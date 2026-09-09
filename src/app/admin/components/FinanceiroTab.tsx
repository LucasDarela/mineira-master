"use client";

import { DashboardFinanceiro } from "./DashboardFinanceiro";
import { LancamentosTable } from "./LancamentosTable";
import { MensalidadesGrid } from "./MensalidadesGrid";
import { Wallet } from "lucide-react";

export function FinanceiroTab({
  transactions,
  playerDues,
  players,
}: {
  transactions: any[];
  playerDues: any[];
  players: any[];
}) {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-[#001f3f] rounded-lg">
          <Wallet className="text-white" size={24} />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-[#001f3f]">Gestão Financeira</h2>
          <p className="text-gray-500">Controle de caixa, mensalidades e despesas</p>
        </div>
      </div>

      <DashboardFinanceiro transactions={transactions} playerDues={playerDues} />

      {/* Grid de Mensalidades (Aparece no topo para facilitar a gestão mensal) */}
      <MensalidadesGrid players={players} playerDues={playerDues} />

      {/* Tabela de Lançamentos Extras (Despesas, Patrocínios, etc) */}
      <LancamentosTable transactions={transactions} />
    </div>
  );
}
