import { createClient } from "@/utils/supabase/server";
import {
  addGame,
  logout,
  addPlayer,
  addDirector,
  addSponsor,
  addInventoryItem,
  addStaff,
} from "./actions";
import {
  LogOut,
  Users,
  CalendarDays,
  Briefcase,
  ClipboardList,
  MonitorPlay,
  Wallet,
  Archive,
} from "lucide-react";
import { GameRow } from "./components/GameRow";
import { PlayerRow } from "./components/PlayerRow";
import { DirectorRow } from "./components/DirectorRow";
import { StaffRow } from "./components/StaffRow";
import { SponsorRow } from "./components/SponsorRow";
import { InventoryRow } from "./components/InventoryRow";
import { LocationInput } from "./components/LocationInput";
import { SearchFilter } from "./components/SearchFilter";
import { GameEventsEditor } from "./components/GameEventsEditor";
import { FinanceiroTab } from "./components/FinanceiroTab";
import { ClassificacaoTab } from "./components/ClassificacaoTab";
import { Trophy } from "lucide-react";

export default async function AdminPage(props: {
  searchParams: Promise<{ tab?: string; q?: string }>;
}) {
  const supabase = await createClient();
  const searchParams = await props.searchParams;
  const currentTab = searchParams?.tab || "jogos";
  const q = searchParams?.q?.toLowerCase() || "";

  let { data: games } = await supabase
    .from("games")
    .select("*")
    .order("date", { ascending: false });
  let { data: players } = await supabase
    .from("players")
    .select("*")
    .order("name", { ascending: true });
  let { data: directors } = await supabase
    .from("directors")
    .select("*")
    .order("name", { ascending: true });
  let { data: staff } = await supabase
    .from("staff")
    .select("*")
    .order("name", { ascending: true });
  let { data: sponsors } = await supabase
    .from("sponsors")
    .select("*")
    .order("name", { ascending: true });

  let { data: financial_transactions } = await supabase
    .from("financial_transactions")
    .select("*")
    .order("date", { ascending: false });

  let { data: player_dues } = await supabase
    .from("player_dues")
    .select("*")
    .order("year", { ascending: false })
    .order("month", { ascending: false });

  let { data: standingsData } = await supabase
    .from("championship_standings")
    .select("*");

  let { data: inventory } = await supabase
    .from("inventory")
    .select("*")
    .order("description", { ascending: true });

  let standings = standingsData || [];

  if (games) {
    const champGames = games.filter((g: any) => g.is_championship && g.outcome);
    const mmStats = {
      id: "mineira-master-auto",
      team_name: "Mineira Master",
      matches_played: champGames.length,
      wins: champGames.filter((g: any) => g.outcome === "V").length,
      draws: champGames.filter((g: any) => g.outcome === "E").length,
      losses: champGames.filter((g: any) => g.outcome === "D").length,
      goals_for: champGames.reduce(
        (sum: number, g: any) => sum + (g.goals_players?.length || 0),
        0,
      ),
      goals_against: champGames.reduce(
        (sum: number, g: any) => sum + (g.opponent_goals || 0),
        0,
      ),
      is_auto: true,
    };
    standings = standings.filter(
      (s: any) => s.team_name.toLowerCase() !== "mineira master",
    );
    standings.push(mmStats);
  }
  if (q) {
    if (games)
      games = games.filter((g: any) => g.opponent.toLowerCase().includes(q));
    if (players)
      players = players.filter((p: any) => p.name.toLowerCase().includes(q));
    if (directors)
      directors = directors.filter((d: any) =>
        d.name.toLowerCase().includes(q),
      );
    if (sponsors)
      sponsors = sponsors.filter((s: any) => s.name.toLowerCase().includes(q));
    if (inventory)
      inventory = inventory.filter((i: any) => i.description.toLowerCase().includes(q));
  }

  return (
    <div className="min-h-screen bg-gray-50 text-black">
      <header className="bg-[#001f3f] text-white p-4 shadow-md flex justify-between items-center">
        <h1 className="text-xl font-bold uppercase">
          Administração - Mineira Master
        </h1>
        <form action={logout}>
          <button
            type="submit"
            className="flex items-center gap-2 hover:text-[#0074D9] transition-colors text-sm font-semibold"
          >
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
          <a
            href="?tab=classificacao"
            className={`flex items-center gap-2 px-4 md:px-6 py-3 font-semibold uppercase tracking-wider text-sm transition-colors whitespace-nowrap ${currentTab === "classificacao" ? "border-b-2 border-[#0074D9] text-[#0074D9]" : "text-gray-500 hover:text-gray-800"}`}
          >
            <Trophy size={18} /> Campeonato
          </a>
          <a
            href="?tab=financeiro"
            className={`flex items-center gap-2 px-4 md:px-6 py-3 font-semibold uppercase tracking-wider text-sm transition-colors whitespace-nowrap ${currentTab === "financeiro" ? "border-b-2 border-[#0074D9] text-[#0074D9]" : "text-gray-500 hover:text-gray-800"}`}
          >
            <Wallet size={18} /> Financeiro
          </a>
          <a
            href="?tab=patrimonio"
            className={`flex items-center gap-2 px-4 md:px-6 py-3 font-semibold uppercase tracking-wider text-sm transition-colors whitespace-nowrap ${currentTab === "patrimonio" ? "border-b-2 border-[#0074D9] text-[#0074D9]" : "text-gray-500 hover:text-gray-800"}`}
          >
            <Archive size={18} /> Patrimônio
          </a>
        </div>
      </div>

      <main className="max-w-7xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* ABA CLASSIFICAÇÃO */}
        {currentTab === "classificacao" && (
          <div className="lg:col-span-3">
            <ClassificacaoTab standings={standings || []} />
          </div>
        )}

        {/* ABA PATRIMÔNIO */}
        {currentTab === "patrimonio" && (
          <>
            <div className="lg:col-span-1">
              <details className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 group lg:open">
                <summary className="text-lg font-bold text-[#001f3f] cursor-pointer outline-none flex justify-between items-center list-none border-b pb-2 mb-4">
                  Adicionar Item
                  <span className="transition group-open:rotate-180">
                    <svg fill="none" height="24" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                  </span>
                </summary>
                <form action={addInventoryItem} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Descrição</label>
                    <input type="text" name="description" required className="w-full p-2 border rounded" placeholder="Ex: Bolas da Penalty" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Quantidade</label>
                    <input type="number" name="quantity" required defaultValue="1" className="w-full p-2 border rounded" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Valor Unitário (R$)</label>
                    <input type="number" step="0.01" name="value" className="w-full p-2 border rounded" placeholder="Ex: 150.00" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Aos cuidados de</label>
                    <input type="text" name="in_care_of" className="w-full p-2 border rounded" placeholder="Ex: João" />
                  </div>
                  <button type="submit" className="w-full bg-[#001f3f] hover:bg-[#0074D9] text-white font-bold py-2 px-4 rounded transition-colors">
                    Salvar Item
                  </button>
                </form>
              </details>
            </div>
            <div className="lg:col-span-2">
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-4 border-b pb-2 gap-2">
                  <h2 className="text-lg font-bold text-[#001f3f]">
                    Itens Cadastrados ({inventory?.length || 0})
                  </h2>
                  <div className="w-full sm:w-64">
                    <SearchFilter placeholder="Buscar item..." />
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-gray-100 text-sm uppercase text-gray-600">
                      <tr>
                        <th className="p-3">Descrição</th>
                        <th className="p-3 text-center">Quantidade</th>
                        <th className="p-3 text-center">Valor (R$)</th>
                        <th className="p-3 text-center">Cuidados de</th>
                        <th className="p-3 text-center">Ações</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {(!inventory || inventory.length === 0) && (
                        <tr>
                          <td colSpan={5} className="p-4 text-center text-gray-500">
                            Nenhum item cadastrado.
                          </td>
                        </tr>
                      )}
                      {inventory?.map((item: any) => (
                        <InventoryRow key={item.id} item={item} />
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </>
        )}

        {/* ABA JOGOS */}
        {currentTab === "jogos" && (
          <>
            <div className="lg:col-span-1">
              <details className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 group lg:open">
                <summary className="text-lg font-bold text-[#001f3f] cursor-pointer outline-none flex justify-between items-center list-none border-b pb-2 mb-4">
                  Adicionar Novo Jogo
                  <span className="transition group-open:rotate-180">
                    <svg
                      fill="none"
                      height="24"
                      shapeRendering="geometricPrecision"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.5"
                      viewBox="0 0 24 24"
                      width="24"
                    >
                      <path d="M6 9l6 6 6-6"></path>
                    </svg>
                  </span>
                </summary>
                <form action={addGame} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Oponente
                    </label>
                    <input
                      type="text"
                      name="opponent"
                      required
                      className="w-full p-2 border rounded"
                      placeholder="Ex: Amigos FC"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Data
                    </label>
                    <input
                      type="date"
                      name="date"
                      required
                      className="w-full p-2 border rounded"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Horário
                    </label>
                    <input
                      type="time"
                      name="time"
                      required
                      className="w-full p-2 border rounded"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Mando de Campo
                    </label>
                    <select
                      name="home_or_away"
                      className="w-full p-2 border rounded"
                      required
                    >
                      <option value="Casa">Casa</option>
                      <option value="Fora">Fora</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Local
                    </label>
                    <LocationInput />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Árbitro
                    </label>
                    <input
                      type="text"
                      name="referee"
                      className="w-full p-2 border rounded"
                      placeholder="Ex: Anderson Daronco"
                    />
                  </div>

                  {/* Os eventos da partida (gols, cartões, destaque) foram movidos apenas para a Edição */}

                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      name="is_championship"
                      id="is_championship"
                      className="w-4 h-4"
                    />
                    <label
                      htmlFor="is_championship"
                      className="text-sm font-medium"
                    >
                      É jogo de Campeonato?
                    </label>
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-[#0074D9] hover:bg-[#005bb5] text-white font-bold py-2 px-4 rounded transition-colors"
                  >
                    Salvar Jogo
                  </button>
                </form>
              </details>
            </div>

            <div className="lg:col-span-2">
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-4 border-b pb-2 gap-2">
                  <h2 className="text-lg font-bold text-[#001f3f]">
                    Jogos Cadastrados
                  </h2>
                  <div className="w-full sm:w-64">
                    <SearchFilter placeholder="Buscar por adversário..." />
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-gray-100 text-sm uppercase text-gray-600">
                      <tr>
                        <th className="p-3">Data/Hora</th>
                        <th className="p-3 text-center">Partida</th>
                        <th className="p-3 text-center">Desfecho</th>
                        <th className="p-3 text-center">Ações</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {(!games || games.length === 0) && (
                        <tr>
                          <td
                            colSpan={4}
                            className="p-4 text-center text-gray-500"
                          >
                            Nenhum jogo cadastrado.
                          </td>
                        </tr>
                      )}
                      {games?.map((game) => (
                        <GameRow
                          key={game.id}
                          game={game}
                          players={
                            players?.map((p) => ({ id: p.id, name: p.name })) ||
                            []
                          }
                        />
                      ))}
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
              <details className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 group lg:open">
                <summary className="text-lg font-bold text-[#001f3f] cursor-pointer outline-none flex justify-between items-center list-none border-b pb-2 mb-4">
                  Adicionar Jogador
                  <span className="transition group-open:rotate-180">
                    <svg
                      fill="none"
                      height="24"
                      shapeRendering="geometricPrecision"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.5"
                      viewBox="0 0 24 24"
                      width="24"
                    >
                      <path d="M6 9l6 6 6-6"></path>
                    </svg>
                  </span>
                </summary>
                {/* IMPORTANTE: encType="multipart/form-data" para upload de arquivos */}
                <form action={addPlayer} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Nome Completo
                    </label>
                    <input
                      type="text"
                      name="name"
                      required
                      className="w-full p-2 border rounded"
                      placeholder="Ex: João Silva"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Posição
                    </label>
                    <select
                      name="position"
                      required
                      className="w-full p-2 border rounded"
                    >
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
                    <label className="block text-sm font-medium mb-1">
                      Nº Camisa
                    </label>
                    <input
                      type="text"
                      name="jersey_number"
                      className="w-full p-2 border rounded"
                      placeholder="Ex: 10"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Entrada no Clube
                      </label>
                      <input
                        type="date"
                        name="entry_year"
                        className="w-full p-2 border rounded"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Naturalidade
                      </label>
                      <input
                        type="text"
                        name="birthplace"
                        className="w-full p-2 border rounded"
                        placeholder="Ex: São Paulo (SP)"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Data de Nasc.
                      </label>
                      <input
                        type="date"
                        name="birth_date"
                        className="w-full p-2 border rounded"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Altura
                      </label>
                      <input
                        type="text"
                        name="height"
                        className="w-full p-2 border rounded"
                        placeholder="Ex: 1,80m"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Peso
                      </label>
                      <input
                        type="text"
                        name="weight"
                        className="w-full p-2 border rounded"
                        placeholder="Ex: 75kg"
                      />
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 text-sm font-medium">
                      <input
                        type="checkbox"
                        name="is_friendly"
                        defaultChecked
                        className="w-4 h-4 rounded text-[#0074D9]"
                      />
                      Joga Amistosos
                    </label>
                    <label className="flex items-center gap-2 text-sm font-medium">
                      <input
                        type="checkbox"
                        name="is_championship"
                        className="w-4 h-4 rounded text-green-600"
                      />
                      Joga Campeonato
                    </label>
                  </div>

                  <h4 className="font-bold text-sm text-[#001f3f] border-b pb-1">
                    Estatísticas - Amistosos
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        C. Amarelos
                      </label>
                      <input
                        type="number"
                        name="yellow_cards"
                        defaultValue="0"
                        className="w-full p-2 border rounded"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        C. Vermelhos
                      </label>
                      <input
                        type="number"
                        name="red_cards"
                        defaultValue="0"
                        className="w-full p-2 border rounded"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Gols Marcados
                      </label>
                      <input
                        type="number"
                        name="goals"
                        defaultValue="0"
                        className="w-full p-2 border rounded"
                      />
                    </div>
                  </div>

                  <h4 className="font-bold text-sm text-[#001f3f] border-b pb-1">
                    Estatísticas - Campeonato
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        C. Amarelos
                      </label>
                      <input
                        type="number"
                        name="champ_yellow_cards"
                        defaultValue="0"
                        className="w-full p-2 border rounded"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        C. Vermelhos
                      </label>
                      <input
                        type="number"
                        name="champ_red_cards"
                        defaultValue="0"
                        className="w-full p-2 border rounded"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Gols Marcados
                      </label>
                      <input
                        type="number"
                        name="champ_goals"
                        defaultValue="0"
                        className="w-full p-2 border rounded"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Foto
                    </label>
                    <input
                      type="file"
                      name="image"
                      accept="image/*"
                      className="w-full p-2 border rounded bg-white text-sm"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition-colors"
                  >
                    Adicionar Jogador
                  </button>
                </form>
              </details>
            </div>

            <div className="lg:col-span-2">
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-4 border-b pb-2 gap-2">
                  <h2 className="text-lg font-bold text-[#001f3f]">
                    Jogadores Cadastrados ({players?.length || 0})
                  </h2>
                  <div className="w-full sm:w-64">
                    <SearchFilter placeholder="Buscar jogador..." />
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-gray-100 text-sm uppercase text-gray-600">
                      <tr>
                        <th className="p-3">Nome</th>
                        <th className="p-3">Posição</th>
                        <th className="p-3 text-center">Ações</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {(!players || players.length === 0) && (
                        <tr>
                          <td
                            colSpan={3}
                            className="p-4 text-center text-gray-500"
                          >
                            Nenhum jogador cadastrado.
                          </td>
                        </tr>
                      )}
                      {players?.map((player) => (
                        <PlayerRow key={player.id} player={player} />
                      ))}
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
              <details className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 group lg:open">
                <summary className="text-lg font-bold text-[#001f3f] cursor-pointer outline-none flex justify-between items-center list-none border-b pb-2 mb-4">
                  Adicionar Diretor
                  <span className="transition group-open:rotate-180">
                    <svg
                      fill="none"
                      height="24"
                      shapeRendering="geometricPrecision"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.5"
                      viewBox="0 0 24 24"
                      width="24"
                    >
                      <path d="M6 9l6 6 6-6"></path>
                    </svg>
                  </span>
                </summary>
                <form action={addDirector} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Nome Completo
                    </label>
                    <input
                      type="text"
                      name="name"
                      required
                      className="w-full p-2 border rounded"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Cargo
                    </label>
                    <input
                      type="text"
                      name="role"
                      required
                      className="w-full p-2 border rounded"
                      placeholder="Ex: Presidente"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Foto
                    </label>
                    <input
                      type="file"
                      name="image"
                      accept="image/*"
                      className="w-full p-2 border rounded bg-white text-sm"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-[#001f3f] hover:bg-[#0074D9] text-white font-bold py-2 px-4 rounded transition-colors"
                  >
                    Salvar Diretor
                  </button>
                </form>
              </details>
            </div>
            <div className="lg:col-span-2">
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-4 border-b pb-2 gap-2">
                  <h2 className="text-lg font-bold text-[#001f3f]">
                    Membros da Diretoria ({directors?.length || 0})
                  </h2>
                  <div className="w-full sm:w-64">
                    <SearchFilter placeholder="Buscar diretor..." />
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-gray-100 text-sm uppercase text-gray-600">
                      <tr>
                        <th className="p-3">Nome</th>
                        <th className="p-3">Cargo</th>
                        <th className="p-3 text-center">Ações</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {(!directors || directors.length === 0) && (
                        <tr>
                          <td
                            colSpan={3}
                            className="p-4 text-center text-gray-500"
                          >
                            Nenhum diretor cadastrado.
                          </td>
                        </tr>
                      )}
                      {directors?.map((dir) => (
                        <DirectorRow key={dir.id} director={dir} />
                      ))}
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
              <details className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 group lg:open">
                <summary className="text-lg font-bold text-[#001f3f] cursor-pointer outline-none flex justify-between items-center list-none border-b pb-2 mb-4">
                  Adicionar Membro (Comissão)
                  <span className="transition group-open:rotate-180">
                    <svg
                      fill="none"
                      height="24"
                      shapeRendering="geometricPrecision"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.5"
                      viewBox="0 0 24 24"
                      width="24"
                    >
                      <path d="M6 9l6 6 6-6"></path>
                    </svg>
                  </span>
                </summary>
                <form action={addStaff} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Nome Completo
                    </label>
                    <input
                      type="text"
                      name="name"
                      required
                      className="w-full p-2 border rounded"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Cargo
                    </label>
                    <input
                      type="text"
                      name="role"
                      required
                      className="w-full p-2 border rounded"
                      placeholder="Ex: Treinador"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Foto
                    </label>
                    <input
                      type="file"
                      name="image"
                      accept="image/*"
                      className="w-full p-2 border rounded bg-white text-sm"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-[#001f3f] hover:bg-[#0074D9] text-white font-bold py-2 px-4 rounded transition-colors"
                  >
                    Salvar Membro
                  </button>
                </form>
              </details>
            </div>
            <div className="lg:col-span-2">
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-4 border-b pb-2 gap-2">
                  <h2 className="text-lg font-bold text-[#001f3f]">
                    Membros da Comissão ({staff?.length || 0})
                  </h2>
                  <div className="w-full sm:w-64">
                    <SearchFilter placeholder="Buscar membro..." />
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-gray-100 text-sm uppercase text-gray-600">
                      <tr>
                        <th className="p-3">Nome</th>
                        <th className="p-3">Cargo</th>
                        <th className="p-3 text-center">Ações</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {(!staff || staff.length === 0) && (
                        <tr>
                          <td
                            colSpan={3}
                            className="p-4 text-center text-gray-500"
                          >
                            Nenhum membro cadastrado.
                          </td>
                        </tr>
                      )}
                      {staff?.map((st) => (
                        <StaffRow key={st.id} staffMember={st} />
                      ))}
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
              <details className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 group lg:open">
                <summary className="text-lg font-bold text-[#001f3f] cursor-pointer outline-none flex justify-between items-center list-none border-b pb-2 mb-4">
                  Adicionar Patrocinador
                  <span className="transition group-open:rotate-180">
                    <svg
                      fill="none"
                      height="24"
                      shapeRendering="geometricPrecision"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.5"
                      viewBox="0 0 24 24"
                      width="24"
                    >
                      <path d="M6 9l6 6 6-6"></path>
                    </svg>
                  </span>
                </summary>
                <form action={addSponsor} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Nome do Patrocinador
                    </label>
                    <input
                      type="text"
                      name="name"
                      required
                      className="w-full p-2 border rounded"
                      placeholder="Ex: Supermercado XYZ"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Site / Link (Opcional)
                    </label>
                    <input
                      type="url"
                      name="url"
                      className="w-full p-2 border rounded"
                      placeholder="Ex: https://www.exemplo.com.br"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Logo (Imagem)
                    </label>
                    <input
                      type="file"
                      name="image"
                      accept="image/*"
                      required
                      className="w-full p-2 border rounded bg-white text-sm"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-[#001f3f] hover:bg-[#0074D9] text-white font-bold py-2 px-4 rounded transition-colors"
                  >
                    Salvar Patrocinador
                  </button>
                </form>
              </details>
            </div>
            <div className="lg:col-span-2">
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-4 border-b pb-2 gap-2">
                  <h2 className="text-lg font-bold text-[#001f3f]">
                    Patrocinadores Cadastrados ({sponsors?.length || 0})
                  </h2>
                  <div className="w-full sm:w-64">
                    <SearchFilter placeholder="Buscar patrocinador..." />
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-gray-100 text-sm uppercase text-gray-600">
                      <tr>
                        <th className="p-3">Nome / Logo</th>
                        <th className="p-3 text-center">Ações</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {(!sponsors || sponsors.length === 0) && (
                        <tr>
                          <td
                            colSpan={2}
                            className="p-4 text-center text-gray-500"
                          >
                            Nenhum patrocinador cadastrado.
                          </td>
                        </tr>
                      )}
                      {sponsors?.map((st) => (
                        <SponsorRow key={st.id} sponsor={st} />
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </>
        )}
        {/* ABA FINANCEIRO */}
        {currentTab === "financeiro" && (
          <div className="lg:col-span-3">
            <FinanceiroTab
              transactions={financial_transactions || []}
              playerDues={player_dues || []}
              players={players || []}
            />
          </div>
        )}
      </main>
    </div>
  );
}
