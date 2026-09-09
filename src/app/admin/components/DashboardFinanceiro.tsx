"use client";

import { DollarSign, ArrowUpCircle, ArrowDownCircle, Clock } from "lucide-react";

export function DashboardFinanceiro({ transactions, playerDues }: { transactions: any[], playerDues: any[] }) {
  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();

  // Calcular totais
  let totalEntradas = 0;
  let totalSaidas = 0;
  let totalReceitasMes = 0;
  let totalDespesasMes = 0;
  let totalAReceber = 0;

  // Processar transações
  transactions?.forEach(t => {
    const isCurrentMonth = t.date?.startsWith(`${currentYear}-${String(currentMonth).padStart(2, '0')}`);
    
    if (t.type === "entrada") {
      if (t.paid) {
        totalEntradas += Number(t.amount);
        if (isCurrentMonth) totalReceitasMes += Number(t.amount);
      } else {
        totalAReceber += Number(t.amount);
      }
    } else if (t.type === "saida") {
      if (t.paid) {
        totalSaidas += Number(t.amount);
        if (isCurrentMonth) totalDespesasMes += Number(t.amount);
      }
    }
  });

  // Processar mensalidades (playerDues)
  playerDues?.forEach(d => {
    if (d.paid) {
      totalEntradas += Number(d.amount);
      if (d.month === currentMonth && d.year === currentYear) {
        totalReceitasMes += Number(d.amount);
      }
    } else {
      totalAReceber += Number(d.amount);
    }
  });

  const saldoCaixa = totalEntradas - totalSaidas;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-8">
      {/* Saldo Atual */}
      <div className="bg-white rounded-xl p-3 sm:p-6 shadow-sm border border-gray-100 flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
        <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
          <DollarSign className="text-blue-600 w-4 h-4 sm:w-6 sm:h-6" />
        </div>
        <div>
          <p className="text-[10px] sm:text-sm text-gray-500 font-medium uppercase tracking-wide">Saldo em Caixa</p>
          <p className={`text-sm sm:text-2xl font-bold ${saldoCaixa >= 0 ? 'text-gray-900' : 'text-red-600'}`}>
            R$ {saldoCaixa.toFixed(2).replace('.', ',')}
          </p>
        </div>
      </div>

      {/* Receitas do Mês */}
      <div className="bg-white rounded-xl p-3 sm:p-6 shadow-sm border border-gray-100 flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
        <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
          <ArrowUpCircle className="text-green-600 w-4 h-4 sm:w-6 sm:h-6" />
        </div>
        <div>
          <p className="text-[10px] sm:text-sm text-gray-500 font-medium uppercase tracking-wide">Entradas (Mês)</p>
          <p className="text-sm sm:text-2xl font-bold text-gray-900">
            R$ {totalReceitasMes.toFixed(2).replace('.', ',')}
          </p>
        </div>
      </div>

      {/* Despesas do Mês */}
      <div className="bg-white rounded-xl p-3 sm:p-6 shadow-sm border border-gray-100 flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
        <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
          <ArrowDownCircle className="text-red-600 w-4 h-4 sm:w-6 sm:h-6" />
        </div>
        <div>
          <p className="text-[10px] sm:text-sm text-gray-500 font-medium uppercase tracking-wide">Saídas (Mês)</p>
          <p className="text-sm sm:text-2xl font-bold text-gray-900">
            R$ {totalDespesasMes.toFixed(2).replace('.', ',')}
          </p>
        </div>
      </div>

      {/* A Receber */}
      <div className="bg-white rounded-xl p-3 sm:p-6 shadow-sm border border-gray-100 flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
        <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-full bg-yellow-100 flex items-center justify-center flex-shrink-0">
          <Clock className="text-yellow-600 w-4 h-4 sm:w-6 sm:h-6" />
        </div>
        <div>
          <p className="text-[10px] sm:text-sm text-gray-500 font-medium uppercase tracking-wide">A Receber</p>
          <p className="text-sm sm:text-2xl font-bold text-gray-900">
            R$ {totalAReceber.toFixed(2).replace('.', ',')}
          </p>
        </div>
      </div>
    </div>
  );
}
