"use client";

import { useState } from "react";
import { addTransaction, toggleTransactionPaid, deleteTransaction } from "../finance-actions";
import { Check, X, Loader2, Trash2, Plus, ChevronDown, ChevronUp } from "lucide-react";
import { ConfirmModal } from "@/components/ConfirmModal";

export function LancamentosTable({ transactions }: { transactions: any[] }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUpdating, setIsUpdating] = useState<string | null>(null);
  const [transactionToDelete, setTransactionToDelete] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  
  const [filterType, setFilterType] = useState("todos");
  const [filterMonth, setFilterMonth] = useState(new Date().getMonth() + 1);
  const [filterYear, setFilterYear] = useState(new Date().getFullYear());

  const categoriasDespesa = ["Arbitragem", "Aluguel de Campo", "Janta", "Uniforme", "Premiação", "Alimentação", "Transporte", "Outros"];
  const categoriasReceita = ["Patrocínio", "Evento", "Doação", "Outros"];

  const [formType, setFormType] = useState("saida");

  const filteredTransactions = transactions?.filter(t => {
    const dateObj = new Date(t.date);
    const m = dateObj.getUTCMonth() + 1;
    const y = dateObj.getUTCFullYear();
    
    if (filterType !== "todos" && t.type !== filterType) return false;
    if (m !== filterMonth || y !== filterYear) return false;
    
    return true;
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget);
    try {
      await addTransaction(formData);
      (e.target as HTMLFormElement).reset();
    } catch (error: any) {
      alert("Erro ao adicionar lançamento: " + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTogglePaid = async (id: string, currentStatus: boolean) => {
    setIsUpdating(id);
    try {
      await toggleTransactionPaid(id, currentStatus);
    } catch (error) {
      console.error(error);
    } finally {
      setIsUpdating(null);
    }
  };

  const handleDelete = async (id: string) => {
    setIsUpdating(id);
    try {
      await deleteTransaction(id);
    } catch (error) {
      console.error(error);
    } finally {
      setIsUpdating(null);
    }
  };

  return (
    <div className="space-y-8">
      {/* Formulário de Novo Lançamento (Accordion) */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <button 
          onClick={() => setIsFormOpen(!isFormOpen)}
          className="w-full flex items-center justify-between p-6 bg-white hover:bg-gray-50 transition-colors"
        >
          <h2 className="text-lg font-bold text-[#001f3f] flex items-center gap-2">
            <Plus size={20} /> Novo Lançamento
          </h2>
          <div className="text-gray-400">
            {isFormOpen ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
          </div>
        </button>
        
        {isFormOpen && (
          <div className="p-6 border-t border-gray-100 bg-gray-50/50">
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
                <select name="type" value={formType} onChange={(e) => setFormType(e.target.value)} className="w-full border-gray-300 rounded-md shadow-sm">
                  <option value="saida">Saída (Despesa)</option>
                  <option value="entrada">Entrada (Receita)</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Categoria</label>
                <select name="category" className="w-full border-gray-300 rounded-md shadow-sm">
                  {formType === "saida" 
                    ? categoriasDespesa.map(c => <option key={c} value={c}>{c}</option>)
                    : categoriasReceita.map(c => <option key={c} value={c}>{c}</option>)
                  }
                </select>
              </div>

              <div className="lg:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
                <input type="text" name="description" required className="w-full border-gray-300 rounded-md shadow-sm" placeholder="Ex: Pagamento do juiz" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Valor (R$)</label>
                <input type="number" step="0.01" name="amount" required className="w-full border-gray-300 rounded-md shadow-sm" placeholder="0.00" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Data</label>
                <input type="date" name="date" required defaultValue={new Date().toISOString().split('T')[0]} className="w-full border-gray-300 rounded-md shadow-sm" />
              </div>
              
              <div className="flex items-center gap-2 mt-6">
                <input type="checkbox" name="paid" id="paidCheckbox" defaultChecked className="w-4 h-4 rounded border-gray-300 text-[#0074D9] focus:ring-[#0074D9]" />
                <label htmlFor="paidCheckbox" className="text-sm text-gray-700 font-medium">Já foi pago/recebido?</label>
              </div>

              <div className="lg:col-span-4 flex justify-end mt-2">
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="bg-[#0074D9] hover:bg-[#005bb5] text-white font-bold py-2 px-6 rounded-md transition-colors flex items-center gap-2 disabled:opacity-50"
                >
                  {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : <Plus size={18} />}
                  Adicionar Lançamento
                </button>
              </div>
            </form>
          </div>
        )}
      </div>

      {/* Lista de Lançamentos */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
          <h2 className="text-lg font-bold text-[#001f3f]">Extrato</h2>
          <div className="flex gap-4">
            <select value={filterType} onChange={(e) => setFilterType(e.target.value)} className="border-gray-300 rounded-md shadow-sm text-sm">
              <option value="todos">Todas as Movimentações</option>
              <option value="entrada">Apenas Entradas</option>
              <option value="saida">Apenas Saídas</option>
            </select>
            <select value={filterMonth} onChange={(e) => setFilterMonth(Number(e.target.value))} className="border-gray-300 rounded-md shadow-sm text-sm">
              {[...Array(12)].map((_, i) => (
                <option key={i+1} value={i+1}>{new Date(2000, i).toLocaleString('pt-BR', { month: 'long' })}</option>
              ))}
            </select>
            <select value={filterYear} onChange={(e) => setFilterYear(Number(e.target.value))} className="border-gray-300 rounded-md shadow-sm text-sm">
              {[filterYear - 1, filterYear, filterYear + 1].map(y => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo/Categoria</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Descrição</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Valor</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredTransactions?.length === 0 && (
                <tr><td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">Nenhum lançamento encontrado para este período.</td></tr>
              )}
              {filteredTransactions?.map((t) => (
                <tr key={t.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(t.date).toLocaleDateString('pt-BR', {timeZone: 'UTC'})}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${t.type === 'entrada' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {t.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 max-w-[200px] truncate" title={t.description}>
                    {t.description}
                  </td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm font-bold ${t.type === 'entrada' ? 'text-green-600' : 'text-red-600'}`}>
                    {t.type === 'entrada' ? '+' : '-'} R$ {Number(t.amount).toFixed(2).replace('.', ',')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <button
                      onClick={() => handleTogglePaid(t.id, t.paid)}
                      disabled={isUpdating === t.id}
                      className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                        t.paid ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                      }`}
                    >
                      {isUpdating === t.id ? <Loader2 size={14} className="animate-spin" /> : t.paid ? <Check size={14} /> : <X size={14} />}
                      {t.paid ? 'Pago' : 'Pendente'}
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button onClick={() => setTransactionToDelete(t.id)} disabled={isUpdating === t.id} className="text-red-600 hover:text-red-900 ml-4">
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      <ConfirmModal 
        isOpen={!!transactionToDelete}
        onClose={() => setTransactionToDelete(null)}
        onConfirm={() => transactionToDelete && handleDelete(transactionToDelete)}
        title="Excluir Lançamento"
        message="Tem certeza que deseja excluir este lançamento financeiro?"
      />
    </div>
  );
}
