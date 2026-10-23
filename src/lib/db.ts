import { Pool, types } from "pg";

// Formatos de retorno iguais aos que o Supabase (PostgREST) devolvia
types.setTypeParser(1082, (v) => v); // date -> "2026-09-25"
types.setTypeParser(1114, (v) => v.replace(" ", "T")); // timestamp
types.setTypeParser(1184, (v) => v.replace(" ", "T")); // timestamptz
types.setTypeParser(1700, (v) => parseFloat(v)); // numeric -> number
types.setTypeParser(20, (v) => parseInt(v, 10)); // bigint -> number

const globalForDb = globalThis as unknown as { pgPool?: Pool };

function createPool() {
  const p = new Pool({
    connectionString: process.env.DATABASE_URL,
    max: 10,
    idleTimeoutMillis: 30_000,
  });
  // Conexão ociosa caiu (ex.: Postgres reiniciou): o pool descarta o cliente e
  // abre outro na próxima query; sem este listener o erro vira uncaughtException
  p.on("error", (err) => console.error("[db] erro em conexão ociosa:", err.message));
  return p;
}

export const pool = globalForDb.pgPool ?? createPool();

if (process.env.NODE_ENV !== "production") globalForDb.pgPool = pool;
