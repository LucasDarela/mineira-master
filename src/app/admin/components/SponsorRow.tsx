"use client";
import { useState, useRef } from "react";
import { updateSponsor, deleteSponsor } from "../actions";
import { Pencil, Trash2, Check, X, ImageIcon } from "lucide-react";
import Image from "next/image";
import { ConfirmModal } from "@/components/ConfirmModal";

type Sponsor = {
  id: string;
  name: string;
  url?: string | null;
  image: string | null;
};

export function SponsorRow({ sponsor }: { sponsor: Sponsor }) {
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  
  const formRef = useRef<HTMLFormElement>(null);
  
  const handleUpdate = async (formData: FormData) => {
    await updateSponsor(sponsor.id, formData);
    setIsEditing(false);
  };
  
  const handleDelete = async () => {
    await deleteSponsor(sponsor.id);
  };

  if (isEditing) {
    return (
      <tr className="bg-yellow-50">
        <td colSpan={2} className="p-3">
          <form action={handleUpdate} ref={formRef} className="flex flex-col gap-2">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase">Nome</label>
                <input type="text" name="name" defaultValue={sponsor.name} required className="w-full p-2 border rounded text-sm" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase">Site / Link</label>
                <input type="url" name="url" defaultValue={sponsor.url || ""} className="w-full p-2 border rounded text-sm" placeholder="Ex: https://..." />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase">Nova Foto</label>
                <input type="file" name="image" accept="image/*" className="w-full p-1 border rounded text-sm bg-white" />
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
      <td className="p-3">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 shrink-0 relative bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center border">
            {sponsor.image ? (
              <Image src={sponsor.image} alt={sponsor.name} fill className="object-contain p-1" sizes="64px" />
            ) : (
              <ImageIcon className="text-gray-400" />
            )}
          </div>
          <div className="font-semibold text-[#001f3f]">{sponsor.name}</div>
        </div>
      </td>
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
            title="Remover Patrocinador"
            message={`Tem certeza que deseja remover o patrocinador ${sponsor.name}?`}
          />
        </div>
      </td>
    </tr>
  );
}
