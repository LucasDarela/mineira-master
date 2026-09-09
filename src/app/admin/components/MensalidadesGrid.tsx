"use client";

import { useState } from "react";
import { generateMonthlyDues, toggleDuesPaid, updateDuesAmount } from "../finance-actions";
import { Check, X, Loader2 } from "lucide-react";

export function MensalidadesGrid({ players, playerDues }: { players: any[], playerDues: any[] }) {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [isGenerating, setIsGenerating] = useState(false);
  const [isUpdating, setIsUpdating] = useState<string | null>(null);
  const [editingAmount, setEditingAmount] = useState<{id: string, amount: string} | null>(null);

  // Estados do Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMonth, setModalMonth] = useState<{num: number, name: string} | null>(null);
  const [modalAmount, setModalAmount] = useState("50.00");

  const months = [
    { num: 1, name: "Jan" }, { num: 2, name: "Fev" }, { num: 3, name: "Mar" },
    { num: 4, name: "Abr" }, { num: 5, name: "Mai" }, { num: 6, name: "Jun" },
    { num: 7, name: "Jul" }, { num: 8, name: "Ago" }, { num: 9, name: "Set" },
    { num: 10, name: "Out" }, { num: 11, name: "Nov" }, { num: 12, name: "Dez" }
  ];

  const handleOpenModal = (monthNum: number, monthName: string) => {
    setModalMonth({ num: monthNum, name: monthName });
    setIsModalOpen(true);
  };

  const handleConfirmGenerate = async () => {
    if (!modalMonth) return;
    setIsGenerating(true);
    setIsModalOpen(false);
    
    try {
      const amount = parseFloat(modalAmount.replace(',', '.'));
      if (isNaN(amount)) throw new Error("Valor inválido");
      
      await generateMonthlyDues(modalMonth.num, selectedYear, amount);
    } catch (error) {
      console.error(error);
      alert("Erro ao gerar mensalidades. Verifique o valor.");
    } finally {
      setIsGenerating(false);
      setModalMonth(null);
    }
  };

  const handleTogglePaid = async (dueId: string, currentStatus: boolean) => {
    setIsUpdating(dueId);
    try {
      await toggleDuesPaid(dueId, currentStatus);
    } catch (error) {
      console.error(error);
      alert("Erro ao atualizar status.");
    } finally {
      setIsUpdating(null);
    }
  };

  const handleSaveAmount = async (dueId: string) => {
    if (!editingAmount) return;
    setIsUpdating(dueId);
    try {
      const amount = parseFloat(editingAmount.amount.replace(',', '.'));
      if (!isNaN(amount)) {
        await updateDuesAmount(dueId, amount);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsUpdating(null);
      setEditingAmount(null);
    }
  };

  return (
    <details className="bg-white rounded-xl shadow-sm border border-gray-200 group">
      <summary className="text-xl font-bold text-[#001f3f] cursor-pointer outline-none flex justify-between items-center list-none p-6 border-b border-gray-100">
        <div>
          Controle de Mensalidades
          <p className="text-sm text-gray-500 font-normal mt-1">Acompanhamento e baixa de mensalidades por jogador</p>
        </div>
        <div className="flex items-center gap-4">
          <select 
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
            onClick={(e) => e.stopPropagation()}
            className="border-gray-300 rounded-md shadow-sm text-sm p-2 bg-gray-50 font-normal"
          >
            {[selectedYear - 1, selectedYear, selectedYear + 1].map(y => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
          <span className="transition-transform group-open:rotate-180 p-2 bg-gray-100 rounded-full">
            <svg fill="none" height="20" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" width="20"><path d="M6 9l6 6 6-6"></path></svg>
          </span>
        </div>
      </summary>

      <div className="p-6 pt-2">
        <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sticky left-0 bg-gray-50 z-10">
                Jogador
              </th>
              {months.map(m => (
                <th key={m.num} className="px-2 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[100px]">
                  <div>{m.name}</div>
                  <button 
                    onClick={() => handleOpenModal(m.num, m.name)}
                    disabled={isGenerating}
                    className="mt-1 text-[10px] text-[#0074D9] hover:underline flex items-center justify-center w-full gap-1"
                    title="Gerar mensalidades para todos"
                  >
                    {isGenerating && modalMonth?.num === m.num ? <Loader2 size={10} className="animate-spin"/> : null}
                    Gerar Todos
                  </button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {players?.map(player => (
              <tr key={player.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 sticky left-0 bg-white group-hover:bg-gray-50 z-10 border-r border-gray-100">
                  {player.name}
                </td>
                {months.map(m => {
                  const due = playerDues?.find(d => d.player_id === player.id && d.month === m.num && d.year === selectedYear);
                  
                  return (
                    <td key={m.num} className="px-2 py-4 whitespace-nowrap text-center">
                      {due ? (
                        <div className="flex flex-col items-center gap-1">
                          {editingAmount?.id === due.id ? (
                            <div className="flex items-center gap-1">
                              <input 
                                type="text" 
                                value={editingAmount?.amount || ""} 
                                onChange={(e) => setEditingAmount({id: due.id, amount: e.target.value})}
                                className="w-16 text-xs p-1 border rounded"
                                autoFocus
                              />
                              <button onClick={() => handleSaveAmount(due.id)} className="text-green-600">
                                <Check size={14} />
                              </button>
                              <button onClick={() => setEditingAmount(null)} className="text-red-600">
                                <X size={14} />
                              </button>
                            </div>
                          ) : (
                            <span 
                              className="text-xs text-gray-500 cursor-pointer hover:text-blue-600"
                              onClick={() => setEditingAmount({id: due.id, amount: due.amount.toString()})}
                            >
                              R$ {Number(due.amount).toFixed(2).replace('.', ',')}
                            </span>
                          )}
                          
                          <button
                            onClick={() => handleTogglePaid(due.id, due.paid)}
                            disabled={isUpdating === due.id}
                            className={`flex items-center justify-center w-8 h-8 rounded-full transition-colors ${
                              due.paid ? 'bg-green-100 text-green-600 hover:bg-green-200' : 'bg-red-100 text-red-600 hover:bg-red-200'
                            }`}
                            title={due.paid ? `Pago em ${new Date(due.paid_at).toLocaleDateString()}` : 'Marcar como pago'}
                          >
                            {isUpdating === due.id ? (
                              <Loader2 size={16} className="animate-spin" />
                            ) : due.paid ? (
                              <Check size={16} />
                            ) : (
                              <X size={16} />
                            )}
                          </button>
                        </div>
                      ) : (
                        <span className="text-xs text-gray-300">-</span>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal de Valor da Mensalidade */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-sm w-full p-6 animate-in fade-in zoom-in duration-200">
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              Gerar Mensalidades - {modalMonth?.name}/{selectedYear}
            </h3>
            <p className="text-sm text-gray-500 mb-4">
              Defina o valor base que será gerado para todos os jogadores ativos. Você poderá alterar individualmente depois.
            </p>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">Valor (R$)</label>
              <input 
                type="number" 
                step="0.01"
                value={modalAmount}
                onChange={(e) => setModalAmount(e.target.value)}
                className="w-full border-gray-300 rounded-md shadow-sm p-2 border"
                autoFocus
              />
            </div>

            <div className="flex justify-end gap-3">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 border rounded-md"
              >
                Cancelar
              </button>
              <button 
                onClick={handleConfirmGenerate}
                className="px-4 py-2 text-sm font-medium text-white bg-[#0074D9] hover:bg-blue-700 rounded-md"
              >
                Confirmar e Gerar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
    </details>
  );
}
