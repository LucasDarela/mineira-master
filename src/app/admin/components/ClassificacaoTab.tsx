"use client";
import { useState } from "react";
import { Save, Trash2, Pencil, X } from "lucide-react";
import { addStanding, updateStanding, deleteStanding } from "../actions";
import { ConfirmModal } from "@/components/ConfirmModal";

function StandingRow({ standing }: { standing: any }) {
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  if (isEditing) {
    return (
      <tr className="bg-slate-50 border-b border-gray-200">
        <td colSpan={10} className="p-0">
          <form
            action={async (formData) => {
              await updateStanding(standing.id, formData);
              setIsEditing(false);
            }}
            className="p-4"
          >
            <div className="grid grid-cols-1 md:grid-cols-8 gap-4 mb-4">
              <div className="col-span-1 md:col-span-2">
                <label className="block text-[11px] font-black text-gray-500 uppercase">Time</label>
                <input type="text" name="team_name" defaultValue={standing.team_name} required className="w-full p-2 border rounded text-sm" />
              </div>
              <div>
                <label className="block text-[11px] font-black text-gray-500 uppercase">Jogos</label>
                <input type="number" name="matches_played" defaultValue={standing.matches_played} required className="w-full p-2 border rounded text-sm" />
              </div>
              <div>
                <label className="block text-[11px] font-black text-gray-500 uppercase">Vitórias</label>
                <input type="number" name="wins" defaultValue={standing.wins} required className="w-full p-2 border rounded text-sm" />
              </div>
              <div>
                <label className="block text-[11px] font-black text-gray-500 uppercase">Empates</label>
                <input type="number" name="draws" defaultValue={standing.draws} required className="w-full p-2 border rounded text-sm" />
              </div>
              <div>
                <label className="block text-[11px] font-black text-gray-500 uppercase">Derrotas</label>
                <input type="number" name="losses" defaultValue={standing.losses} required className="w-full p-2 border rounded text-sm" />
              </div>
              <div>
                <label className="block text-[11px] font-black text-gray-500 uppercase">Gols Pró</label>
                <input type="number" name="goals_for" defaultValue={standing.goals_for} required className="w-full p-2 border rounded text-sm" />
              </div>
              <div>
                <label className="block text-[11px] font-black text-gray-500 uppercase">Gols Contra</label>
                <input type="number" name="goals_against" defaultValue={standing.goals_against} required className="w-full p-2 border rounded text-sm" />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <button type="button" onClick={() => setIsEditing(false)} className="px-3 py-1 bg-white border rounded text-sm">Cancelar</button>
              <button type="submit" className="px-3 py-1 bg-[#0074D9] text-white rounded text-sm flex items-center gap-1"><Save size={14}/> Salvar</button>
            </div>
          </form>
        </td>
      </tr>
    );
  }

  const points = (standing.wins * 3) + (standing.draws * 1);
  const sg = standing.goals_for - standing.goals_against;

  return (
    <tr className="border-b border-gray-100 hover:bg-gray-50">
      <td className="p-3 font-bold">{standing.team_name}</td>
      <td className="p-3 text-center font-black text-[#0074D9] text-lg">{points}</td>
      <td className="p-3 text-center text-gray-500">{standing.matches_played}</td>
      <td className="p-3 text-center text-gray-500">{standing.wins}</td>
      <td className="p-3 text-center text-gray-500">{standing.draws}</td>
      <td className="p-3 text-center text-gray-500">{standing.losses}</td>
      <td className="p-3 text-center text-gray-500">{standing.goals_for}</td>
      <td className="p-3 text-center text-gray-500">{standing.goals_against}</td>
      <td className="p-3 text-center text-gray-500">{sg}</td>
      <td className="p-3 text-right">
        {standing.is_auto ? (
          <span className="text-[10px] font-bold uppercase bg-blue-100 text-blue-800 px-2 py-1 rounded">Automático</span>
        ) : (
          <>
            <button onClick={() => setIsEditing(true)} className="p-2 text-blue-600 hover:bg-blue-50 rounded"><Pencil size={16} /></button>
            <button type="button" onClick={() => setIsDeleteModalOpen(true)} className="p-2 text-red-600 hover:bg-red-50 rounded ml-2"><Trash2 size={16} /></button>
            
            <ConfirmModal 
              isOpen={isDeleteModalOpen}
              onClose={() => setIsDeleteModalOpen(false)}
              onConfirm={async () => {
                await deleteStanding(standing.id);
              }}
              title="Excluir Time"
              message={`Tem certeza que deseja excluir o time ${standing.team_name} da classificação? Esta ação não pode ser desfeita e todo o histórico deste time será perdido.`}
            />
          </>
        )}
      </td>
    </tr>
  );
}

export function ClassificacaoTab({ standings }: { standings: any[] }) {
  // Ordenar a listagem do admin pelas mesmas regras do site
  const sortedStandings = [...standings].sort((a, b) => {
    const pointsA = (a.wins * 3) + a.draws;
    const pointsB = (b.wins * 3) + b.draws;
    if (pointsA !== pointsB) return pointsB - pointsA;
    if (a.wins !== b.wins) return b.wins - a.wins;
    const sgA = a.goals_for - a.goals_against;
    const sgB = b.goals_for - b.goals_against;
    return sgB - sgA;
  });

  return (
    <div className="space-y-6">
      <details className="bg-white rounded-xl shadow-sm border border-gray-200 group">
        <summary className="text-xl font-bold text-[#001f3f] cursor-pointer outline-none flex justify-between items-center list-none p-6 border-b border-gray-100">
          Adicionar Time
          <span className="transition-transform group-open:rotate-180 p-2 bg-gray-100 rounded-full">
            <svg fill="none" height="20" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" width="20"><path d="M6 9l6 6 6-6"></path></svg>
          </span>
        </summary>
        <div className="p-6">
          <form action={addStanding} className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-4">
              <label className="block text-[11px] font-black text-gray-500 uppercase mb-1">Nome do Time</label>
              <input type="text" name="team_name" required className="w-full p-2 border rounded" placeholder="Ex: Mineira Master" />
            </div>
            <div className="md:col-span-4 mt-2 border-t pt-4">
              <p className="text-xs text-gray-500 mb-4">Se for um novo time, pode deixar tudo 0. Caso já esteja no meio do campeonato, preencha os stats iniciais.</p>
              <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase">Jogos</label>
                  <input type="number" name="matches_played" defaultValue="0" required className="w-full p-2 border rounded" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase">Vitórias</label>
                  <input type="number" name="wins" defaultValue="0" required className="w-full p-2 border rounded" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase">Empates</label>
                  <input type="number" name="draws" defaultValue="0" required className="w-full p-2 border rounded" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase">Derrotas</label>
                  <input type="number" name="losses" defaultValue="0" required className="w-full p-2 border rounded" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase">Gols Pró</label>
                  <input type="number" name="goals_for" defaultValue="0" required className="w-full p-2 border rounded" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase">Gols Contra</label>
                  <input type="number" name="goals_against" defaultValue="0" required className="w-full p-2 border rounded" />
                </div>
              </div>
            </div>
            <div className="md:col-span-4 flex justify-end mt-4">
              <button type="submit" className="bg-[#0074D9] text-white px-6 py-2 rounded font-bold hover:bg-[#005bb5]">Adicionar Time</button>
            </div>
          </form>
        </div>
      </details>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-[#001f3f]">Tabela de Classificação</h2>
          <p className="text-sm text-gray-500">Pontos e Saldo de Gols são calculados automaticamente</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-xs uppercase text-gray-500">
                <th className="p-3 font-bold">Time</th>
                <th className="p-3 text-center" title="Pontos">P</th>
                <th className="p-3 text-center" title="Jogos">J</th>
                <th className="p-3 text-center" title="Vitórias">V</th>
                <th className="p-3 text-center" title="Empates">E</th>
                <th className="p-3 text-center" title="Derrotas">D</th>
                <th className="p-3 text-center" title="Gols Pró">GP</th>
                <th className="p-3 text-center" title="Gols Contra">GC</th>
                <th className="p-3 text-center" title="Saldo de Gols">SG</th>
                <th className="p-3 text-right">Ações</th>
              </tr>
            </thead>
            <tbody>
              {sortedStandings.length === 0 ? (
                <tr><td colSpan={10} className="p-6 text-center text-gray-500">Nenhum time cadastrado.</td></tr>
              ) : (
                sortedStandings.map(standing => <StandingRow key={standing.id} standing={standing} />)
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
