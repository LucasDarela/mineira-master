import { createClient } from "@/utils/supabase/server";
import { addGame, logout, addPlayer, addDirector, addStaff, addSponsor } from "./actions";
import { LogOut, Users, CalendarDays, Briefcase, ClipboardList, MonitorPlay } from "lucide-react";
import { GameRow } from "./components/GameRow";
import { PlayerRow } from "./components/PlayerRow";
import { DirectorRow } from "./components/DirectorRow";
import { StaffRow } from "./components/StaffRow";
import { SponsorRow } from "./components/SponsorRow";
import { LocationInput } from "./components/LocationInput";

export default async function AdminPage(props: { searchParams: Promise<{ tab?: string }> }) {
  const supabase = await createClient();
  const searchParams = await props.searchParams;
  const currentTab = searchParams?.tab || "jogos";

  const { data: games } = await supabase.from("games").select("*").order("date", { ascending: false });
  const { data: players } = await supabase.from("players").select("*").order("name", { ascending: true });
  const { data: directors } = await supabase.from("directors").select("*").order("name", { ascending: true });
  const { data: staff } = await supabase.from("staff").select("*").order("name", { ascending: true });
  const { data: sponsors } = await supabase.from("sponsors").select("*").order("name", { ascending: true });

  return (
    <div className="min-h-screen bg-gray-50 text-black">
      <header className="bg-[#001f3f] text-white p-4 shadow-md flex justify-between items-center">
        <h1 className="text-xl font-bold uppercase">Administração - Mineira Master</h1>
        <form action={logout}>
          <button type="submit" className="flex items-center gap-2 hover:text-[#0074D9] transition-colors text-sm font-semibold">
            <LogOut size={16} /> Sair
          </button>
        </form>
      </header>

      {/* Navegação de Abas */}
      <div className="max-w-7xl mx-auto px-6 mt-6">
        <div className="flex border-b border-gray-200 overflow-x-auto hide-scrollbar">
          <a 
            href="?tab=jogos" 
            className={`flex items-center gap-2 px-4 md:px-6 py-3 font-semibold uppercase tracking-wider text-sm transition-colors whitespace-nowrap ${currentTab === "jogos" ? "border-b-2 border-[#0074D9] text-[#0074D9]" : "text-gray-500 hover:text-gray-800"}`}
          >
            <CalendarDays size={18} /> Jogos
          </a>
          <a 
            href="?tab=elenco" 
            className={`flex items-center gap-2 px-4 md:px-6 py-3 font-semibold uppercase tracking-wider text-sm transition-colors whitespace-nowrap ${currentTab === "elenco" ? "border-b-2 border-[#0074D9] text-[#0074D9]" : "text-gray-500 hover:text-gray-800"}`}
          >
            <Users size={18} /> Elenco
          </a>
          <a 
            href="?tab=diretoria" 
            className={`flex items-center gap-2 px-4 md:px-6 py-3 font-semibold uppercase tracking-wider text-sm transition-colors whitespace-nowrap ${currentTab === "diretoria" ? "border-b-2 border-[#0074D9] text-[#0074D9]" : "text-gray-500 hover:text-gray-800"}`}
          >
            <Briefcase size={18} /> Diretoria
          </a>
          <a 
            href="?tab=comissao" 
            className={`flex items-center gap-2 px-4 md:px-6 py-3 font-semibold uppercase tracking-wider text-sm transition-colors whitespace-nowrap ${currentTab === "comissao" ? "border-b-2 border-[#0074D9] text-[#0074D9]" : "text-gray-500 hover:text-gray-800"}`}
          >
            <ClipboardList size={18} /> Comissão
          </a>
          <a 
            href="?tab=patrocinadores" 
            className={`flex items-center gap-2 px-4 md:px-6 py-3 font-semibold uppercase tracking-wider text-sm transition-colors whitespace-nowrap ${currentTab === "patrocinadores" ? "border-b-2 border-[#0074D9] text-[#0074D9]" : "text-gray-500 hover:text-gray-800"}`}
          >
            <MonitorPlay size={18} /> Patrocinadores
          </a>
        </div>
      </div>

      <main className="max-w-7xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* ABA JOGOS */}
        {currentTab === "jogos" && (
          <>
            <div className="lg:col-span-1">
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h2 className="text-lg font-bold text-[#001f3f] mb-4 border-b pb-2">Adicionar Novo Jogo</h2>
                <form action={addGame} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Oponente</label>
                    <input type="text" name="opponent" required className="w-full p-2 border rounded" placeholder="Ex: Amigos FC" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Data</label>
                    <input type="date" name="date" required className="w-full p-2 border rounded" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Horário</label>
                    <input type="time" name="time" required className="w-full p-2 border rounded" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Local</label>
                    <LocationInput />
                  </div>
                  <div className="flex items-center gap-2">
                    <input type="checkbox" name="is_championship" id="is_championship" className="w-4 h-4" />
                    <label htmlFor="is_championship" className="text-sm font-medium">É jogo de Campeonato?</label>
                  </div>
                  <button type="submit" className="w-full bg-[#0074D9] hover:bg-[#005bb5] text-white font-bold py-2 px-4 rounded transition-colors">
                    Salvar Jogo
                  </button>
                </form>
              </div>
            </div>

            <div className="lg:col-span-2">
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h2 className="text-lg font-bold text-[#001f3f] mb-4 border-b pb-2">Jogos Cadastrados</h2>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-gray-100 text-sm uppercase text-gray-600">
                      <tr><th className="p-3">Data</th><th className="p-3">Adversário</th><th className="p-3">Resultado</th><th className="p-3 text-center">Ações</th></tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {(!games || games.length === 0) && (
                        <tr><td colSpan={4} className="p-4 text-center text-gray-500">Nenhum jogo cadastrado.</td></tr>
                      )}
                      {games?.map((game) => <GameRow key={game.id} game={game} />)}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </>
        )}

        {/* ABA ELENCO */}
        {currentTab === "elenco" && (
          <>
            <div className="lg:col-span-1">
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h2 className="text-lg font-bold text-[#001f3f] mb-4 border-b pb-2">Adicionar Jogador</h2>
                {/* IMPORTANTE: encType="multipart/form-data" para upload de arquivos */}
                <form action={addPlayer} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Nome Completo</label>
                    <input type="text" name="name" required className="w-full p-2 border rounded" placeholder="Ex: João Silva" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Posição</label>
                    <select name="position" required className="w-full p-2 border rounded">
                      <option value="Goleiro">Goleiro</option>
                      <option value="Zagueiro">Zagueiro</option>
                      <option value="Lateral">Lateral</option>
                      <option value="Meio-Campo">Meio-Campo</option>
                      <option value="Atacante">Atacante</option>
                      <option value="Técnico">Técnico</option>
                      <option value="Diretoria">Diretoria</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Nº Camisa</label>
                    <input type="text" name="jersey_number" className="w-full p-2 border rounded" placeholder="Ex: 10" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Foto</label>
                    <input type="file" name="image" accept="image/*" className="w-full p-2 border rounded bg-white text-sm" />
                  </div>
                  <button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition-colors">
                    Adicionar Jogador
                  </button>
                </form>
              </div>
            </div>

            <div className="lg:col-span-2">
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h2 className="text-lg font-bold text-[#001f3f] mb-4 border-b pb-2">Jogadores Cadastrados ({players?.length || 0})</h2>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-gray-100 text-sm uppercase text-gray-600">
                      <tr><th className="p-3">Nome</th><th className="p-3">Posição</th><th className="p-3 text-center">Ações</th></tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {(!players || players.length === 0) && (
                        <tr><td colSpan={3} className="p-4 text-center text-gray-500">Nenhum jogador cadastrado.</td></tr>
                      )}
                      {players?.map((player) => <PlayerRow key={player.id} player={player} />)}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </>
        )}

        {/* ABA DIRETORIA */}
        {currentTab === "diretoria" && (
          <>
            <div className="lg:col-span-1">
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h2 className="text-lg font-bold text-[#001f3f] mb-4 border-b pb-2">Adicionar Diretor</h2>
                <form action={addDirector} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Nome Completo</label>
                    <input type="text" name="name" required className="w-full p-2 border rounded" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Cargo</label>
                    <input type="text" name="role" required className="w-full p-2 border rounded" placeholder="Ex: Presidente" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Foto</label>
                    <input type="file" name="image" accept="image/*" className="w-full p-2 border rounded bg-white text-sm" />
                  </div>
                  <button type="submit" className="w-full bg-[#001f3f] hover:bg-[#0074D9] text-white font-bold py-2 px-4 rounded transition-colors">
                    Salvar Diretor
                  </button>
                </form>
              </div>
            </div>
            <div className="lg:col-span-2">
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h2 className="text-lg font-bold text-[#001f3f] mb-4 border-b pb-2">Membros da Diretoria ({directors?.length || 0})</h2>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-gray-100 text-sm uppercase text-gray-600">
                      <tr><th className="p-3">Nome</th><th className="p-3">Cargo</th><th className="p-3 text-center">Ações</th></tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {(!directors || directors.length === 0) && (
                        <tr><td colSpan={3} className="p-4 text-center text-gray-500">Nenhum diretor cadastrado.</td></tr>
                      )}
                      {directors?.map((dir) => <DirectorRow key={dir.id} director={dir} />)}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </>
        )}

        {/* ABA COMISSÃO TÉCNICA */}
        {currentTab === "comissao" && (
          <>
            <div className="lg:col-span-1">
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h2 className="text-lg font-bold text-[#001f3f] mb-4 border-b pb-2">Adicionar Membro (Comissão)</h2>
                <form action={addStaff} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Nome Completo</label>
                    <input type="text" name="name" required className="w-full p-2 border rounded" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Cargo</label>
                    <input type="text" name="role" required className="w-full p-2 border rounded" placeholder="Ex: Treinador" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Foto</label>
                    <input type="file" name="image" accept="image/*" className="w-full p-2 border rounded bg-white text-sm" />
                  </div>
                  <button type="submit" className="w-full bg-[#001f3f] hover:bg-[#0074D9] text-white font-bold py-2 px-4 rounded transition-colors">
                    Salvar Membro
                  </button>
                </form>
              </div>
            </div>
            <div className="lg:col-span-2">
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h2 className="text-lg font-bold text-[#001f3f] mb-4 border-b pb-2">Membros da Comissão ({staff?.length || 0})</h2>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-gray-100 text-sm uppercase text-gray-600">
                      <tr><th className="p-3">Nome</th><th className="p-3">Cargo</th><th className="p-3 text-center">Ações</th></tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {(!staff || staff.length === 0) && (
                        <tr><td colSpan={3} className="p-4 text-center text-gray-500">Nenhum membro cadastrado.</td></tr>
                      )}
                      {staff?.map((st) => <StaffRow key={st.id} staffMember={st} />)}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </>
        )}

        {/* ABA PATROCINADORES */}
        {currentTab === "patrocinadores" && (
          <>
            <div className="lg:col-span-1">
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h2 className="text-lg font-bold text-[#001f3f] mb-4 border-b pb-2">Adicionar Patrocinador</h2>
                <form action={addSponsor} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Nome do Patrocinador</label>
                    <input type="text" name="name" required className="w-full p-2 border rounded" placeholder="Ex: Supermercado XYZ" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Site / Link (Opcional)</label>
                    <input type="url" name="url" className="w-full p-2 border rounded" placeholder="Ex: https://www.exemplo.com.br" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Logo (Imagem)</label>
                    <input type="file" name="image" accept="image/*" required className="w-full p-2 border rounded bg-white text-sm" />
                  </div>
                  <button type="submit" className="w-full bg-[#001f3f] hover:bg-[#0074D9] text-white font-bold py-2 px-4 rounded transition-colors">
                    Salvar Patrocinador
                  </button>
                </form>
              </div>
            </div>
            <div className="lg:col-span-2">
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h2 className="text-lg font-bold text-[#001f3f] mb-4 border-b pb-2">Patrocinadores Cadastrados ({sponsors?.length || 0})</h2>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-gray-100 text-sm uppercase text-gray-600">
                      <tr><th className="p-3">Nome / Logo</th><th className="p-3 text-center">Ações</th></tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {(!sponsors || sponsors.length === 0) && (
                        <tr><td colSpan={2} className="p-4 text-center text-gray-500">Nenhum patrocinador cadastrado.</td></tr>
                      )}
                      {sponsors?.map((st) => <SponsorRow key={st.id} sponsor={st} />)}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </>
        )}

      </main>
    </div>
  );
}
