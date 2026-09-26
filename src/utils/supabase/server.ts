/**
 * Substituto do cliente Supabase, agora usando Postgres local (VPS).
 * Mantém a mesma API usada no projeto (from/select/eq/order/..., auth, storage)
 * para que o resto do código continue funcionando sem alterações.
 *
 * Regras de acesso (equivalentes às antigas policies de RLS, porém mais seguras):
 *  - leitura pública: todas as tabelas, exceto PRIVATE_TABLES
 *  - escrita (insert/update/delete/upsert) e upload: somente admin logado
 */
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import { promises as fs } from "fs";
import path from "path";
import { pool } from "@/lib/db";
import {
  SESSION_COOKIE,
  createSessionToken,
  sessionCookieOptions,
  verifySessionToken,
} from "@/lib/session";

type DbError = { message: string; code?: string } | null;
/* eslint-disable @typescript-eslint/no-explicit-any */
// Mesmos tipos que o supabase-js devolve sem tipagem gerada
type Result = { data: any; error: DbError; count: number | null };
type ResultMany = { data: any[] | null; error: DbError; count: number | null };
type ResultOne = { data: any; error: DbError; count: number | null };
type Row = Record<string, unknown>;

const PRIVATE_TABLES = new Set(["financial_transactions", "player_dues", "inventory"]);
const UPLOAD_DIR = process.env.UPLOAD_DIR || path.join(process.cwd(), "storage");
const IDENT = /^[a-zA-Z_][a-zA-Z0-9_]*$/;

function q(id: string) {
  if (!IDENT.test(id)) throw new Error(`Identificador inválido: ${id}`);
  return `"${id}"`;
}

function cols(list: string) {
  const s = list.trim();
  if (!s || s === "*") return "*";
  return s.split(",").map((c) => q(c.trim())).join(", ");
}

let jsonColsCache: Map<string, Set<string>> | null = null;
async function jsonCols(table: string) {
  if (!jsonColsCache) {
    const { rows } = await pool.query(
      `select table_name, column_name from information_schema.columns
       where table_schema = 'public' and data_type in ('json','jsonb')`
    );
    const m = new Map<string, Set<string>>();
    for (const r of rows) {
      if (!m.has(r.table_name)) m.set(r.table_name, new Set());
      m.get(r.table_name)!.add(r.column_name);
    }
    jsonColsCache = m;
  }
  return jsonColsCache.get(table) ?? new Set<string>();
}

async function currentUser() {
  const store = await cookies();
  return verifySessionToken(store.get(SESSION_COOKIE)?.value);
}

type Filter = { col: string; op: string; val: unknown };
type Order = { col: string; asc: boolean; nullsFirst?: boolean };
type Op = "select" | "insert" | "update" | "delete" | "upsert";

class QueryBuilder implements PromiseLike<ResultMany> {
  private op: Op = "select";
  private columns = "*";
  private returning: string | null = null;
  private filters: Filter[] = [];
  private orders: Order[] = [];
  private lim?: number;
  private off?: number;
  private singleRow: "single" | "maybe" | null = null;
  private countExact = false;
  private rows: Row[] = [];
  private values: Row = {};
  private conflict = "id";
  private ignoreDup = false;

  constructor(private table: string) {
    q(table);
  }

  select(columns = "*", opts?: { count?: "exact" | "planned" | "estimated"; head?: boolean }) {
    if (this.op === "select") {
      this.columns = columns;
      if (opts?.count) this.countExact = true;
    } else {
      this.returning = columns;
    }
    return this;
  }
  insert(rows: Row | Row[]) {
    this.op = "insert";
    this.rows = Array.isArray(rows) ? rows : [rows];
    return this;
  }
  upsert(rows: Row | Row[], opts?: { onConflict?: string; ignoreDuplicates?: boolean }) {
    this.op = "upsert";
    this.rows = Array.isArray(rows) ? rows : [rows];
    if (opts?.onConflict) this.conflict = opts.onConflict;
    this.ignoreDup = !!opts?.ignoreDuplicates;
    return this;
  }
  update(values: Row) {
    this.op = "update";
    this.values = values;
    return this;
  }
  delete() {
    this.op = "delete";
    return this;
  }
  private f(col: string, op: string, val: unknown) {
    this.filters.push({ col, op, val });
    return this;
  }
  eq(col: string, val: unknown) { return this.f(col, "=", val); }
  neq(col: string, val: unknown) { return this.f(col, "<>", val); }
  gt(col: string, val: unknown) { return this.f(col, ">", val); }
  gte(col: string, val: unknown) { return this.f(col, ">=", val); }
  lt(col: string, val: unknown) { return this.f(col, "<", val); }
  lte(col: string, val: unknown) { return this.f(col, "<=", val); }
  order(col: string, opts?: { ascending?: boolean; nullsFirst?: boolean }) {
    this.orders.push({ col, asc: opts?.ascending !== false, nullsFirst: opts?.nullsFirst });
    return this;
  }
  limit(n: number) { this.lim = n; return this; }
  range(from: number, to: number) {
    this.off = from;
    this.lim = to - from + 1;
    return this;
  }
  single(): PromiseLike<ResultOne> {
    this.singleRow = "single";
    return this as unknown as PromiseLike<ResultOne>;
  }
  maybeSingle(): PromiseLike<ResultOne> {
    this.singleRow = "maybe";
    return this as unknown as PromiseLike<ResultOne>;
  }

  private where(params: unknown[]) {
    if (!this.filters.length) return "";
    return (
      " where " +
      this.filters
        .map((f) => {
          params.push(f.val);
          return `${q(f.col)} ${f.op} $${params.length}`;
        })
        .join(" and ")
    );
  }

  private prep(col: string, val: unknown, json: Set<string>) {
    if (json.has(col) && val !== null && val !== undefined) return JSON.stringify(val);
    return val;
  }

  private buildInsert(params: unknown[], json: Set<string>) {
    const keys = [
      ...new Set(this.rows.flatMap((r) => Object.keys(r).filter((k) => r[k] !== undefined))),
    ];
    const t = `public.${q(this.table)}`;
    if (!keys.length) return `insert into ${t} default values`;
    const values = this.rows
      .map(
        (r) =>
          "(" +
          keys
            .map((k) => {
              if (r[k] === undefined) return "default";
              params.push(this.prep(k, r[k], json));
              return `$${params.length}`;
            })
            .join(", ") +
          ")"
      )
      .join(", ");
    let sql = `insert into ${t} (${keys.map(q).join(", ")}) values ${values}`;
    if (this.op === "upsert") {
      const conflictCols = this.conflict.split(",").map((c) => c.trim());
      const updCols = keys.filter((k) => !conflictCols.includes(k));
      sql += ` on conflict (${conflictCols.map(q).join(", ")}) `;
      sql +=
        this.ignoreDup || !updCols.length
          ? "do nothing"
          : "do update set " + updCols.map((k) => `${q(k)} = excluded.${q(k)}`).join(", ");
    }
    return sql;
  }

  private async execute(): Promise<Result> {
    try {
      const needsAuth = this.op !== "select" || PRIVATE_TABLES.has(this.table);
      if (needsAuth && !(await currentUser())) {
        return { data: null, error: { message: "Não autorizado", code: "42501" }, count: null };
      }
      const json = await jsonCols(this.table);
      const t = `public.${q(this.table)}`;
      const params: unknown[] = [];
      let sql: string;

      if (this.op === "select") {
        sql = `select ${cols(this.columns)} from ${t}${this.where(params)}`;
        if (this.orders.length) {
          sql +=
            " order by " +
            this.orders
              .map(
                (o) =>
                  `${q(o.col)} ${o.asc ? "asc" : "desc"}` +
                  (o.nullsFirst === undefined ? "" : o.nullsFirst ? " nulls first" : " nulls last")
              )
              .join(", ");
        }
        if (this.lim !== undefined) sql += ` limit ${Number(this.lim)}`;
        if (this.off !== undefined) sql += ` offset ${Number(this.off)}`;
      } else if (this.op === "insert" || this.op === "upsert") {
        sql = this.buildInsert(params, json);
      } else if (this.op === "update") {
        const keys = Object.keys(this.values).filter((k) => this.values[k] !== undefined);
        if (!keys.length) return { data: this.returning ? [] : null, error: null, count: null };
        const set = keys
          .map((k) => {
            params.push(this.prep(k, this.values[k], json));
            return `${q(k)} = $${params.length}`;
          })
          .join(", ");
        sql = `update ${t} set ${set}${this.where(params)}`;
      } else {
        sql = `delete from ${t}${this.where(params)}`;
      }

      if (this.op !== "select" && this.returning !== null) sql += ` returning ${cols(this.returning)}`;

      const res = await pool.query(sql, params);
      let data: unknown =
        this.op === "select" || this.returning !== null ? res.rows : null;

      let count: number | null = null;
      if (this.countExact) {
        const p2: unknown[] = [];
        const c = await pool.query(`select count(*)::int as c from ${t}${this.where(p2)}`, p2);
        count = c.rows[0].c;
      }

      if (this.singleRow) {
        const rows = (data as Row[]) ?? [];
        if (rows.length > 1 || (rows.length === 0 && this.singleRow === "single")) {
          return {
            data: null,
            error: { message: "JSON object requested, multiple (or no) rows returned", code: "PGRST116" },
            count,
          };
        }
        data = rows[0] ?? null;
      }
      return { data, error: null, count };
    } catch (e) {
      const err = e as { message?: string; code?: string };
      console.error(`[db] erro em ${this.table}:`, err);
      return { data: null, error: { message: err.message ?? "Erro no banco", code: err.code }, count: null };
    }
  }

  then<T1 = ResultMany, T2 = never>(
    onfulfilled?: ((value: ResultMany) => T1 | PromiseLike<T1>) | null,
    onrejected?: ((reason: unknown) => T2 | PromiseLike<T2>) | null
  ): PromiseLike<T1 | T2> {
    return this.execute().then(onfulfilled, onrejected);
  }
}

const auth = {
  async signInWithPassword({ email, password }: { email: string; password: string }) {
    const { rows } = await pool.query(
      "select email, password_hash from public.admin_users where lower(email) = lower($1)",
      [email ?? ""]
    );
    const ok = rows[0] && (await bcrypt.compare(password ?? "", rows[0].password_hash));
    if (!ok) return { data: { user: null }, error: { message: "Invalid login credentials" } };
    const store = await cookies();
    store.set(SESSION_COOKIE, createSessionToken(rows[0].email), sessionCookieOptions);
    return { data: { user: { email: rows[0].email as string } }, error: null };
  },
  async signOut() {
    const store = await cookies();
    store.delete(SESSION_COOKIE);
    return { error: null };
  },
  async getUser() {
    return { data: { user: await currentUser() }, error: null };
  },
};

const storage = {
  from(bucket: string) {
    q(bucket);
    return {
      async upload(name: string, body: Buffer | Uint8Array, _opts?: { contentType?: string }) {
        if (!(await currentUser())) return { data: null, error: { message: "Não autorizado" } };
        try {
          const safe = path.basename(name);
          const dir = path.join(UPLOAD_DIR, bucket);
          await fs.mkdir(dir, { recursive: true });
          await fs.writeFile(path.join(dir, safe), body, { flag: "wx" });
          return { data: { path: safe }, error: null };
        } catch (e) {
          return { data: null, error: { message: (e as Error).message } };
        }
      },
      getPublicUrl(name: string) {
        return { data: { publicUrl: `/${bucket}/${encodeURIComponent(path.basename(name))}` } };
      },
    };
  },
};

export async function createClient() {
  return {
    from: (table: string) => new QueryBuilder(table),
    auth,
    storage,
  };
}
