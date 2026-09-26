// O cliente de navegador do Supabase não é mais usado (migração para Postgres na VPS).
export function createClient(): never {
  throw new Error("Cliente de navegador removido: use @/utils/supabase/server no servidor.");
}
