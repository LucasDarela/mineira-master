"use client";
import { useState, useRef } from "react";
import { updateInventoryItem, deleteInventoryItem } from "../actions";
import { Pencil, Trash2, Check, X } from "lucide-react";
import { ConfirmModal } from "@/components/ConfirmModal";

type InventoryItem = {
  id: string;
  description: string;
  quantity: number;
  value?: number | null;
  in_care_of?: string | null;
};

export function InventoryRow({ item }: { item: InventoryItem }) {
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  
  const formRef = useRef<HTMLFormElement>(null);
  
  const handleUpdate = async (formData: FormData) => {
    await updateInventoryItem(item.id, formData);
    setIsEditing(false);
  };
  
  const handleDelete = async () => {
    await deleteInventoryItem(item.id);
  };

  if (isEditing) {
    return (
      <tr className="bg-yellow-50">
        <td colSpan={5} className="p-3">
          <form action={handleUpdate} ref={formRef} className="flex flex-col gap-2">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase">Descrição</label>
                <input type="text" name="description" defaultValue={item.description} required className="w-full p-2 border rounded text-sm" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase">Quantidade</label>
                <input type="number" name="quantity" defaultValue={item.quantity} required className="w-full p-2 border rounded text-sm" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase">Valor Unitário (R$)</label>
                <input type="number" step="0.01" name="value" defaultValue={item.value || ""} className="w-full p-2 border rounded text-sm" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase">Aos cuidados de</label>
                <input type="text" name="in_care_of" defaultValue={item.in_care_of || ""} className="w-full p-2 border rounded text-sm" />
              </div>
            </div>
            
            <div className="flex items-center gap-2 mt-2 justify-end">
              <button type="button" onClick={() => setIsEditing(false)} className="flex items-center gap-1 text-gray-600 hover:text-gray-900 bg-gray-200 px-3 py-1.5 rounded-md text-sm font-semibold transition-colors">
                <X size={16} /> Cancelar
              </button>
              <button type="submit" className="flex items-center gap-1 text-white hover:bg-green-700 bg-green-600 px-3 py-1.5 rounded-md text-sm font-semibold transition-colors shadow-sm">
                <Check size={16} /> Salvar
              </button>
            </div>
          </form>
        </td>
      </tr>
    );
  }

  return (
    <tr className="hover:bg-gray-50 transition-colors">
      <td className="p-3 font-semibold text-[#001f3f]">{item.description}</td>
      <td className="p-3 text-center">{item.quantity}</td>
      <td className="p-3 text-center">
        {item.value ? `R$ ${Number(item.value).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` : "-"}
      </td>
      <td className="p-3 text-center">{item.in_care_of || "-"}</td>
      <td className="p-3 text-center">
        <div className="flex items-center justify-center gap-2">
          <button onClick={() => setIsEditing(true)} className="p-1.5 text-blue-600 hover:bg-blue-100 rounded-md transition-colors" title="Editar">
            <Pencil size={18} />
          </button>
          
          <button onClick={() => setIsDeleteModalOpen(true)} className="p-1.5 text-red-600 hover:bg-red-100 rounded-md transition-colors" title="Excluir">
            <Trash2 size={18} />
          </button>
          
          <ConfirmModal 
            isOpen={isDeleteModalOpen}
            onClose={() => setIsDeleteModalOpen(false)}
            onConfirm={handleDelete}
            title="Remover Item"
            message={`Tem certeza que deseja remover o item "${item.description}"?`}
          />
        </div>
      </td>
    </tr>
  );
}
