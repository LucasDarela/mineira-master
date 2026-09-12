// Rate limiter simples em memória, por chave (ex: "login:<ip>").
//
// Limitação conhecida: o contador vive na memória do processo Node.js.
// Em ambientes serverless com múltiplas instâncias (ex: Vercel com vários
// lambdas simultâneos), cada instância tem seu próprio contador, então o
// limite efetivo pode ser N vezes maior que o configurado sob carga alta
// distribuída entre instâncias. Para uma garantia forte multi-instância,
// migrar para um store compartilhado (ex: Upstash Redis) usando a mesma
// interface `checkRateLimit`.

type Entry = {
  count: number;
  resetAt: number;
};

const store = new Map<string, Entry>();

// Evita crescimento ilimitado do Map em processos de longa duração:
// só varre e remove entradas expiradas quando o store cresce demais.
const CLEANUP_THRESHOLD = 5000;

function cleanupExpired(now: number) {
  for (const [key, entry] of store) {
    if (entry.resetAt <= now) {
      store.delete(key);
    }
  }
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetAt: number;
}

/**
 * Verifica e consome uma tentativa da janela de rate limit para `key`.
 * Janela fixa: a cada `windowMs` o contador zera a partir da primeira
 * tentativa registrada naquele período.
 */
export function checkRateLimit(
  key: string,
  limit: number,
  windowMs: number
): RateLimitResult {
  const now = Date.now();

  if (store.size > CLEANUP_THRESHOLD) {
    cleanupExpired(now);
  }

  const entry = store.get(key);

  if (!entry || entry.resetAt <= now) {
    const resetAt = now + windowMs;
    store.set(key, { count: 1, resetAt });
    return { allowed: true, remaining: limit - 1, resetAt };
  }

  if (entry.count >= limit) {
    return { allowed: false, remaining: 0, resetAt: entry.resetAt };
  }

  entry.count += 1;
  return { allowed: true, remaining: limit - entry.count, resetAt: entry.resetAt };
}

/** Limpa o contador de uma chave (ex: após um login bem-sucedido). */
export function resetRateLimit(key: string) {
  store.delete(key);
}
