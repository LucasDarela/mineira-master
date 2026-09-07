"use client";

import { useState } from "react";
import { Save, Trash2, Pencil, X } from "lucide-react";
import { deleteDirector, updateDirector } from "../actions";

export function DirectorRow({ director }: { director: any }) {
  const [isEditing, setIsEditing] = useState(false);
  const saveAction = updateDirector.bind(null, director.id);

  if (isEditing) {
    return (
      <tr className="bg-yellow-50">
        <td colSpan={3} className="p-3">
          <form 
            action={(formData) => {
              saveAction(formData);
              setIsEditing(false);
            }} 
            className="flex flex-col gap-2"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase">Nome</label>
                <input type="text" name="name" defaultValue={director.name} required className="w-full p-2 border rounded text-sm" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase">Cargo</label>
                <input type="text" name="role" defaultValue={director.role} required className="w-full p-2 border rounded text-sm" placeholder="Ex: Presidente" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase">Nova Foto</label>
                <input type="file" name="image" accept="image/*" className="w-full p-1 border rounded text-sm bg-white" />
              </div>
            </div>
            
            <div className="flex items-center gap-2 mt-2 justify-end">
              <button 
                type="button" 
                onClick={() => setIsEditing(false)} 
                className="flex items-center gap-1 text-gray-600 hover:text-gray-900 bg-gray-200 px-3 py-1.5 rounded-md text-sm font-semibold transition-colors"
              >
                <X size={16} /> Cancelar
              </button>
              <button 
                type="submit" 
                className="flex items-center gap-1 text-white hover:bg-green-700 bg-green-600 px-3 py-1.5 rounded-md text-sm font-semibold transition-colors shadow-sm"
              >
                <Save size={16} /> Salvar
              </button>
            </div>
          </form>
        </td>
      </tr>
    );
  }

  return (
    <tr className="hover:bg-gray-50 transition-colors">
      <td className="p-3 font-semibold text-[#001f3f] flex items-center gap-3">
        <img src={director.image} alt={director.name} className="w-8 h-8 rounded-full object-cover border" />
        {director.name}
      </td>
      <td className="p-3 text-sm text-gray-600">{director.role}</td>
      <td className="p-3 text-center flex items-center justify-center gap-2">
        <button onClick={() => setIsEditing(true)} className="p-1.5 text-blue-600 hover:bg-blue-100 rounded-md transition-colors" title="Editar">
          <Pencil size={18} />
        </button>
        <button 
          onClick={async () => {
            if(confirm("Tem certeza que deseja remover?")) await deleteDirector(director.id);
          }}
          className="p-1.5 text-red-600 hover:bg-red-100 rounded-md transition-colors" title="Excluir"
        >
          <Trash2 size={18} />
        </button>
      </td>
    </tr>
  );
}
