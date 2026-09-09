"use client";
import { useState } from "react";
import { Save, Trash2, Pencil, X } from "lucide-react";
import { updateGameResult, deleteGame, updateGame } from "../actions";
import { LocationInput } from "./LocationInput";
import { GameEventsEditor } from "./GameEventsEditor";
import { ConfirmModal } from "@/components/ConfirmModal";

export function GameRow({ game, players }: { game: any; players: any[] }) {
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  if (isEditing) {
    return (
      <tr className="bg-slate-50 border-b border-gray-200 shadow-inner">
        <td colSpan={4} className="p-0">
          <form
            action={async (formData) => {
              await updateGame(game.id, formData);
              setIsEditing(false);
            }}
            className="p-6 md:p-8 flex flex-col gap-6"
          >
            <div className="flex justify-between items-center border-b border-gray-100 pb-3">
              <h3 className="text-lg font-extrabold text-[#001f3f] flex items-center gap-2">
                <Pencil size={18} className="text-[#0074D9]" />
                Editando Partida
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
              <div className="col-span-1 md:col-span-5">
                <label className="block text-[11px] font-black text-gray-500 uppercase tracking-widest mb-1">
                  Adversário
                </label>
                <input
                  type="text"
                  name="opponent"
                  defaultValue={game.opponent}
                  required
                  className="w-full p-2.5 border border-gray-300 rounded-lg text-sm bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[#0074D9] outline-none transition-all"
                />
              </div>
              <div className="col-span-1 md:col-span-3">
                <label className="block text-[11px] font-black text-gray-500 uppercase tracking-widest mb-1">
                  Data
                </label>
                <input
                  type="date"
                  name="date"
                  defaultValue={game.date}
                  required
                  className="w-full p-2.5 border border-gray-300 rounded-lg text-sm bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[#0074D9] outline-none transition-all"
                />
              </div>
              <div className="col-span-1 md:col-span-2">
                <label className="block text-[11px] font-black text-gray-500 uppercase tracking-widest mb-1">
                  Horário
                </label>
                <input
                  type="time"
                  name="time"
                  defaultValue={game.time}
                  required
                  className="w-full p-2.5 border border-gray-300 rounded-lg text-sm bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[#0074D9] outline-none transition-all"
                />
              </div>
              <div className="col-span-1 md:col-span-2">
                <label className="block text-[11px] font-black text-gray-500 uppercase tracking-widest mb-1">
                  Mando
                </label>
                <select
                  name="home_or_away"
                  defaultValue={game.home_or_away || "Casa"}
                  className="w-full p-2.5 border border-gray-300 rounded-lg text-sm bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[#0074D9] outline-none transition-all"
                  required
                >
                  <option value="Casa">Casa</option>
                  <option value="Fora">Fora</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
              <div className="col-span-1 md:col-span-6">
                <label className="block text-[11px] font-black text-gray-500 uppercase tracking-widest mb-1">
                  Local
                </label>
                <div className="bg-gray-50 rounded-lg overflow-hidden border border-gray-300 focus-within:ring-2 focus-within:ring-[#0074D9] focus-within:bg-white transition-all">
                  <LocationInput defaultValue={game.location} />
                </div>
              </div>
              <div className="col-span-1 md:col-span-6">
                <label className="block text-[11px] font-black text-gray-500 uppercase tracking-widest mb-1">
                  Árbitro
                </label>
                <input
                  type="text"
                  name="referee"
                  defaultValue={game.referee || ""}
                  className="w-full p-2.5 border border-gray-300 rounded-lg text-sm bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[#0074D9] outline-none transition-all"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-end">
              <div>
                <label className="block text-[11px] font-black text-gray-500 uppercase tracking-widest mb-1">
                  Destaque da Partida (Craque do Jogo)
                </label>
                <select
                  name="highlight_player"
                  defaultValue={game.highlight_player || ""}
                  className="w-full p-2.5 border border-gray-300 rounded-lg text-sm bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[#0074D9] outline-none transition-all"
                >
                  <option value="">Nenhum destaque selecionado</option>
                  {players.map((p: any) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg border border-gray-300">
                <input
                  type="checkbox"
                  name="is_championship"
                  id={`is_championship_${game.id}`}
                  defaultChecked={game.is_championship}
                  className="w-5 h-5 rounded text-[#0074D9] focus:ring-[#0074D9] bg-white border-gray-300"
                />
                <label
                  htmlFor={`is_championship_${game.id}`}
                  className="text-[12px] font-semibold text-gray-700 cursor-pointer select-none"
                >
                  Esta partida faz parte de um Campeonato?
                </label>
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 mt-2">
              <h4 className="text-xs font-black text-[#001f3f] uppercase mb-4 tracking-widest flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#0074D9]"></span>{" "}
                Eventos da Partida
              </h4>
              <GameEventsEditor
                players={players}
                defaultGoals={game.goals_players || []}
                defaultYellowCards={game.yellow_cards_players || []}
                defaultRedCards={game.red_cards_players || []}
                defaultOpponentGoals={game.opponent_goals || 0}
              />
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-5 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg text-sm font-bold hover:bg-gray-100 transition-colors flex items-center gap-2"
              >
                <X size={16} /> Cancelar
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 bg-[#0074D9] text-white rounded-lg text-sm font-bold hover:bg-[#005bb5] transition-colors shadow-md hover:shadow-lg flex items-center gap-2"
              >
                <Save size={16} /> Salvar Edições
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
        <div className="font-semibold">
          {new Date(game.date).toLocaleDateString("pt-BR", { timeZone: "UTC" })}
        </div>
        <div className="text-xs text-gray-500">{game.time}</div>
      </td>
      <td className="p-3 text-center whitespace-nowrap min-w-[240px] sm:min-w-[300px]">
        {game.home_or_away === 'Fora' ? (
          <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 sm:gap-3 w-full max-w-[400px] mx-auto">
            <span className="font-bold text-gray-700 text-right truncate text-xs sm:text-base">{game.opponent}</span>
            <span className="bg-gray-100 px-2 sm:px-3 py-1 rounded font-black text-[#001f3f] min-w-[45px] sm:min-w-[55px] text-center border border-gray-200 shadow-sm shrink-0 text-sm sm:text-base">
              {game.opponent_goals || 0} <span className="text-gray-400 font-normal mx-0.5 sm:mx-1">x</span> {(game.goals_players || []).length}
            </span>
            <span className="font-black text-[#0074D9] text-left truncate flex items-center gap-1 sm:gap-2 text-xs sm:text-base">
              Mineira Master
              {game.is_championship && (
                <span className="bg-yellow-100 text-yellow-800 text-[9px] px-1.5 py-0.5 rounded font-bold uppercase hidden sm:inline-block shrink-0">Camp</span>
              )}
            </span>
          </div>
        ) : (
          <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 sm:gap-3 w-full max-w-[400px] mx-auto">
            <span className="font-black text-[#0074D9] text-right truncate flex items-center justify-end gap-1 sm:gap-2 text-xs sm:text-base">
              {game.is_championship && (
                <span className="bg-yellow-100 text-yellow-800 text-[9px] px-1.5 py-0.5 rounded font-bold uppercase hidden sm:inline-block shrink-0">Camp</span>
              )}
              Mineira Master
            </span>
            <span className="bg-gray-100 px-2 sm:px-3 py-1 rounded font-black text-[#001f3f] min-w-[45px] sm:min-w-[55px] text-center border border-gray-200 shadow-sm shrink-0 text-sm sm:text-base">
              {(game.goals_players || []).length} <span className="text-gray-400 font-normal mx-0.5 sm:mx-1">x</span> {game.opponent_goals || 0}
            </span>
            <span className="font-bold text-gray-700 text-left truncate text-xs sm:text-base">{game.opponent}</span>
          </div>
        )}
        <div className="text-[11px] text-gray-500 mt-1.5 text-center">{game.location}</div>
      </td>
      <td className="p-3">
        <div className="flex items-center justify-center gap-2 flex-wrap">
          {!game.outcome && !game.result && <span className="font-bold text-gray-400">-</span>}
          {game.outcome === 'V' && <span className="bg-green-100 text-green-700 font-bold px-2 py-1 rounded text-xs shadow-sm border border-green-200">V</span>}
          {game.outcome === 'E' && <span className="bg-yellow-100 text-yellow-700 font-bold px-2 py-1 rounded text-xs shadow-sm border border-yellow-200">E</span>}
          {game.outcome === 'D' && <span className="bg-red-100 text-red-700 font-bold px-2 py-1 rounded text-xs shadow-sm border border-red-200">D</span>}
        </div>
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

          <button
            type="button"
            onClick={() => setIsDeleteModalOpen(true)}
            className="text-red-500 hover:text-red-700 p-1 bg-red-50 rounded"
            title="Excluir Jogo"
          >
            <Trash2 size={18} />
          </button>

          <ConfirmModal 
            isOpen={isDeleteModalOpen}
            onClose={() => setIsDeleteModalOpen(false)}
            onConfirm={async () => {
              await deleteGame(game.id);
            }}
            title="Excluir Partida"
            message={`Tem certeza que deseja excluir a partida contra ${game.opponent}?`}
          />
        </div>
      </td>
    </tr>
  );
}
