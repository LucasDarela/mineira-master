"use client";
import { useState } from "react";
import { Save, Trash2, Pencil, X } from "lucide-react";
import { updateGameResult, deleteGame, updateGame } from "../actions";
import { LocationInput } from "./LocationInput";

export function GameRow({ game }: { game: any }) {
  const [isEditing, setIsEditing] = useState(false);

  if (isEditing) {
    return (
      <tr className="bg-blue-50 border-b border-blue-100 shadow-inner">
        <td colSpan={4} className="p-4">
          <form action={async (formData) => {
            await updateGame(game.id, formData);
            setIsEditing(false);
          }} className="flex flex-col gap-4">
            
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div className="col-span-1 md:col-span-2">
                <label className="block text-xs font-bold text-gray-500 uppercase">Adversário</label>
                <input type="text" name="opponent" defaultValue={game.opponent} required className="w-full p-2 border rounded text-sm" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase">Data</label>
                <input type="date" name="date" defaultValue={game.date} required className="w-full p-2 border rounded text-sm" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase">Horário</label>
                <input type="time" name="time" defaultValue={game.time} required className="w-full p-2 border rounded text-sm" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Local</label>
                <LocationInput defaultValue={game.location} />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase">Resultado (V/E/D)</label>
                <select name="outcome" defaultValue={game.outcome || ""} className="w-full p-2 border rounded text-sm font-bold bg-white">
                  <option value="">Nenhum</option>
                  <option value="V">V - Vitória</option>
                  <option value="E">E - Empate</option>
                  <option value="D">D - Derrota</option>
                </select>
              </div>
              <div className="col-span-1 flex items-center gap-2 mt-4">
                <input type="checkbox" name="is_championship" id={`is_championship_${game.id}`} defaultChecked={game.is_championship} className="w-4 h-4" />
                <label htmlFor={`is_championship_${game.id}`} className="text-sm font-medium">Campeonato?</label>
              </div>
            </div>

            <div className="flex justify-end gap-2 border-t border-blue-100 pt-3">
              <button 
                type="button" 
                onClick={() => setIsEditing(false)} 
                className="px-4 py-2 bg-gray-400 text-white rounded text-sm font-bold hover:bg-gray-500 transition-colors flex items-center gap-1"
              >
                <X size={16} /> Cancelar
              </button>
              <button 
                type="submit" 
                className="px-4 py-2 bg-[#0074D9] text-white rounded text-sm font-bold hover:bg-[#005bb5] transition-colors flex items-center gap-1"
              >
                <Save size={16} /> Salvar Edição
              </button>
            </div>
          </form>
        </td>
      </tr>
    );
  }

  return (
    <tr className="hover:bg-gray-50 border-b border-gray-100">
      <td className="p-3 whitespace-nowrap">
        <div className="font-semibold">{new Date(game.date).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}</div>
        <div className="text-xs text-gray-500">{game.time}</div>
      </td>
      <td className="p-3">
        <div className="font-bold text-[#001f3f]">{game.opponent}</div>
        <div className="text-xs text-gray-500">{game.location}</div>
        {game.is_championship && <span className="inline-block mt-1 bg-yellow-100 text-yellow-800 text-[10px] px-2 py-0.5 rounded font-bold uppercase">Campeonato</span>}
      </td>
      <td className="p-3">
        <form action={updateGameResult.bind(null, game.id)} className="flex items-center gap-1">
          <input 
            type="text" 
            name="result" 
            defaultValue={game.result} 
            placeholder="Placar"
            className="w-16 p-1 border rounded text-center font-bold text-sm"
          />
          <select name="outcome" defaultValue={game.outcome || ""} className="w-12 p-1 border rounded text-center font-bold text-sm bg-white cursor-pointer">
            <option value="">-</option>
            <option value="V" className="text-green-600">V</option>
            <option value="E" className="text-yellow-600">E</option>
            <option value="D" className="text-red-600">D</option>
          </select>
          <button type="submit" className="text-green-600 hover:text-green-800 p-1 ml-1" title="Atualizar Resultado Rápido">
            <Save size={18} />
          </button>
        </form>
      </td>
      <td className="p-3 text-center">
        <div className="flex items-center justify-center gap-2">
          <button 
            onClick={() => setIsEditing(true)} 
            className="text-blue-500 hover:text-blue-700 p-1 bg-blue-50 rounded" 
            title="Editar Jogo"
          >
            <Pencil size={18} />
          </button>
          
          <form action={deleteGame.bind(null, game.id)}>
            <button type="submit" className="text-red-500 hover:text-red-700 p-1 bg-red-50 rounded" title="Excluir Jogo">
              <Trash2 size={18} />
            </button>
          </form>
        </div>
      </td>
    </tr>
  );
}
