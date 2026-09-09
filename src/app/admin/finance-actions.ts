"use server";
import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

// ==============================================
// TRANSAÇÕES FINANCEIRAS (Entradas e Saídas)
// ==============================================

export async function addTransaction(formData: FormData) {
  const supabase = await createClient();
  const type = formData.get("type") as string;
  const category = formData.get("category") as string;
  const description = formData.get("description") as string;
  const amountStr = formData.get("amount") as string;
  const date = formData.get("date") as string;
  const due_date = formData.get("due_date") as string || null;
  const paid = formData.get("paid") === "true";
  const paid_at = paid ? (formData.get("paid_at") as string || new Date().toISOString().split('T')[0]) : null;
  const notes = formData.get("notes") as string || null;

  // Tratar valor: substituir vírgula por ponto se necessário
  const amount = parseFloat(amountStr.replace(',', '.'));

  if (!type || !category || !description || isNaN(amount) || !date) {
    throw new Error("Campos obrigatórios não preenchidos.");
  }

  const { error } = await supabase.from("financial_transactions").insert([{
    type,
    category,
    description,
    amount,
    date,
    due_date,
    paid,
    paid_at,
    notes,
  }]);

  if (error) {
    console.error("Erro ao inserir transação:", error);
    throw new Error(error.message);
  }

  revalidatePath("/admin");
}

export async function toggleTransactionPaid(id: string, currentStatus: boolean) {
  const supabase = await createClient();
  const paid_at = !currentStatus ? new Date().toISOString().split('T')[0] : null;

  const { error } = await supabase
    .from("financial_transactions")
    .update({ paid: !currentStatus, paid_at })
    .eq("id", id);

  if (error) throw new Error(error.message);
  revalidatePath("/admin");
}

export async function deleteTransaction(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("financial_transactions").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin");
}

// ==============================================
// MENSALIDADES DOS JOGADORES (Player Dues)
// ==============================================

export async function generateMonthlyDues(month: number, year: number, amount: number) {
  const supabase = await createClient();
  
  // 1. Obter todos os jogadores ativos (vamos pegar todos por enquanto, se precisar podemos filtrar por status futuro)
  const { data: players, error: playersError } = await supabase.from("players").select("id");
  if (playersError) throw new Error(playersError.message);
  
  if (!players || players.length === 0) return;

  // 2. Criar os registros de mensalidade se eles ainda não existirem
  const duesToInsert = players.map(player => ({
    player_id: player.id,
    month,
    year,
    amount,
    paid: false
  }));

  // O upsert ou on conflict ignore cuidará para não duplicar mensalidades já geradas
  const { error } = await supabase
    .from("player_dues")
    .upsert(duesToInsert, { onConflict: "player_id,month,year", ignoreDuplicates: true });

  if (error) throw new Error(error.message);
  revalidatePath("/admin");
}

export async function toggleDuesPaid(id: string, currentStatus: boolean) {
  const supabase = await createClient();
  const paid_at = !currentStatus ? new Date().toISOString().split('T')[0] : null;

  const { error } = await supabase
    .from("player_dues")
    .update({ paid: !currentStatus, paid_at })
    .eq("id", id);

  if (error) throw new Error(error.message);
  revalidatePath("/admin");
}

export async function updateDuesAmount(id: string, amount: number) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("player_dues")
    .update({ amount })
    .eq("id", id);

  if (error) throw new Error(error.message);
  revalidatePath("/admin");
}
