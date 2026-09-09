"use client";

import { useState } from "react";
import { Save, Trash2, Pencil, X } from "lucide-react";
import { deletePlayer, updatePlayer } from "../actions";
import { ConfirmModal } from "@/components/ConfirmModal";

export function PlayerRow({ player }: { player: any }) {
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Usa o bind para criar a Server Action com o ID já preenchido
  const saveAction = updatePlayer.bind(null, player.id);

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
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase">Nome</label>
                <input type="text" name="name" defaultValue={player.name} required className="w-full p-2 border rounded text-sm" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase">Posição</label>
                <select name="position" defaultValue={player.position} required className="w-full p-2 border rounded text-sm">
                  <option value="Goleiro">Goleiro</option>
                  <option value="Zagueiro">Zagueiro</option>
                  <option value="Lateral">Lateral</option>
                  <option value="Lateral Direito">Lateral Direito</option>
                  <option value="Lateral Esquerdo">Lateral Esquerdo</option>
                  <option value="Volante">Volante</option>
                  <option value="Cabeça de Área">Cabeça de Área</option>
                  <option value="Meio-Campo">Meio-Campo</option>
                  <option value="Meia-Atacante">Meia-Atacante</option>
                  <option value="Ponta">Ponta</option>
                  <option value="Atacante">Atacante</option>
                  <option value="Centroavante">Centroavante</option>
                  <option value="Técnico">Técnico</option>
                  <option value="Diretoria">Diretoria</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase">Nº Camisa</label>
                <input type="text" name="jersey_number" defaultValue={player.jersey_number} className="w-full p-2 border rounded text-sm" placeholder="Ex: 10" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase">Nova Foto</label>
                <input type="file" name="image" accept="image/*" className="w-full p-1 border rounded text-sm bg-white" />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase">Entrada no Clube</label>
                <input type="date" name="entry_year" defaultValue={player.entry_year || ""} className="w-full p-2 border rounded text-sm" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase">Naturalidade</label>
                <input type="text" name="birthplace" defaultValue={player.birthplace} className="w-full p-2 border rounded text-sm" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase">Data Nasc.</label>
                <input type="date" name="birth_date" defaultValue={player.birth_date} className="w-full p-2 border rounded text-sm" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase">Altura / Peso</label>
                <div className="flex gap-2">
                  <input type="text" name="height" defaultValue={player.height} placeholder="Alt" className="w-full p-2 border rounded text-sm" />
                  <input type="text" name="weight" defaultValue={player.weight} placeholder="Peso" className="w-full p-2 border rounded text-sm" />
                </div>
              </div>
            </div>

            <div className="flex gap-4 mt-4">
              <label className="flex items-center gap-2 text-sm font-medium">
                <input type="checkbox" name="is_friendly" defaultChecked={player.is_friendly} className="w-4 h-4 rounded text-[#0074D9]" />
                Joga Amistosos
              </label>
              <label className="flex items-center gap-2 text-sm font-medium">
                <input type="checkbox" name="is_championship" defaultChecked={player.is_championship} className="w-4 h-4 rounded text-green-600" />
                Joga Campeonato
              </label>
            </div>

            <h4 className="font-bold text-sm text-[#001f3f] mt-4 border-b pb-1">Estatísticas - Amistosos</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase">C. Amarelos</label>
                <input type="number" name="yellow_cards" defaultValue={player.yellow_cards || 0} className="w-full p-2 border rounded text-sm" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase">C. Vermelhos</label>
                <input type="number" name="red_cards" defaultValue={player.red_cards || 0} className="w-full p-2 border rounded text-sm" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase">Gols Marcados</label>
                <input type="number" name="goals" defaultValue={player.goals || 0} className="w-full p-2 border rounded text-sm" />
              </div>
            </div>

            <h4 className="font-bold text-sm text-[#001f3f] mt-4 border-b pb-1">Estatísticas - Campeonato</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase">C. Amarelos</label>
                <input type="number" name="champ_yellow_cards" defaultValue={player.champ_yellow_cards || 0} className="w-full p-2 border rounded text-sm" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase">C. Vermelhos</label>
                <input type="number" name="champ_red_cards" defaultValue={player.champ_red_cards || 0} className="w-full p-2 border rounded text-sm" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase">Gols Marcados</label>
                <input type="number" name="champ_goals" defaultValue={player.champ_goals || 0} className="w-full p-2 border rounded text-sm" />
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
      <td className="p-3 font-semibold text-[#001f3f]">{player.name}</td>
      <td className="p-3 text-sm text-gray-600">{player.position}</td>
      <td className="p-3 text-center flex items-center justify-center gap-2">
        <button 
          onClick={() => setIsEditing(true)}
          className="p-1.5 text-blue-600 hover:bg-blue-100 rounded-md transition-colors"
          title="Editar"
        >
          <Pencil size={18} />
        </button>
        <button 
          onClick={() => setIsDeleteModalOpen(true)}
          className="p-1.5 text-red-600 hover:bg-red-100 rounded-md transition-colors"
          title="Excluir"
        >
          <Trash2 size={18} />
        </button>

        <ConfirmModal 
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={async () => {
            await deletePlayer(player.id);
          }}
          title="Remover Jogador"
          message={`Tem certeza que deseja remover o jogador ${player.name}?`}
        />
      </td>
    </tr>
  );
}
