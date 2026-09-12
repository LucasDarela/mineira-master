import { createClient } from "@/utils/supabase/server";
import { AgendaCard } from "@/components/AgendaCard";
import { AgendaRow } from "@/components/AgendaRow";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default async function CampeonatoAgendaPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const supabase = await createClient();
  const resolvedSearchParams = await searchParams;

  const ITEMS_PER_PAGE = 10;
  const currentPage = Number(resolvedSearchParams.page) || 1;
  const from = (currentPage - 1) * ITEMS_PER_PAGE;
  const to = from + ITEMS_PER_PAGE - 1;

  const { data: games, count } = await supabase
    .from("games")
    .select("*", { count: "exact" })
    .eq("is_championship", true)
    .order("date", { ascending: false })
    .range(from, to);

  const today = new Date().toISOString().split("T")[0];
  const { data: nextGameData } = await supabase
    .from("games")
    .select("id")
    .eq("is_championship", true)
    .gte("date", today)
    .order("date", { ascending: true })
    .limit(1);
  const nextGameId = nextGameData?.[0]?.id;

  // Fetch all games for stats
  const { data: allGames } = await supabase
    .from("games")
    .select("outcome, opponent_goals, goals_players, result")
    .eq("is_championship", true);

  let vit = 0,
    emp = 0,
    der = 0,
    gp = 0,
    gc = 0;
  if (allGames) {
    allGames.forEach((g) => {
      if (g.outcome === "V") vit++;
      if (g.outcome === "E") emp++;
      if (g.outcome === "D") der++;

      const pGoals = (g.goals_players || []).length;
      const oGoals = g.opponent_goals || 0;

      // se tem outcome ou resultado definido, soma os gols
      if (g.outcome || g.result || pGoals > 0 || oGoals > 0) {
        gp += pGoals;
        gc += oGoals;
      }
    });
  }
  const totalJogos = vit + emp + der;
  const ap =
    totalJogos > 0 ? Math.round(((vit * 3 + emp) / (totalJogos * 3)) * 100) : 0;

  const totalPages = Math.ceil((count || 0) / ITEMS_PER_PAGE);

  return (
    <div className="min-h-screen bg-[#f8f9fa] flex flex-col">
      <Navbar />
      <main className="flex-1 pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-extrabold text-[#001f3f] uppercase tracking-tight">
              Agenda do Campeonato
            </h1>
            <div className="w-24 h-1 bg-[#0074D9] mx-auto mt-4 mb-6"></div>
          </div>

          {/* Stats Bar */}
          {totalJogos > 0 && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-8 flex flex-wrap gap-6 justify-center items-center max-w-5xl mx-auto">
              <div className="text-center px-4">
                <p className="text-sm text-gray-500 font-bold uppercase">
                  Jogos
                </p>
                <p className="text-3xl font-black text-[#001f3f]">
                  {totalJogos}
                </p>
              </div>
              <div className="h-12 w-px bg-gray-200 hidden md:block"></div>

              <div className="text-center px-4">
                <p className="text-sm text-gray-500 font-bold uppercase">
                  Vitórias
                </p>
                <p className="text-3xl font-black text-green-600">{vit}</p>
              </div>
              <div className="h-12 w-px bg-gray-200 hidden md:block"></div>

              <div className="text-center px-4">
                <p className="text-sm text-gray-500 font-bold uppercase">
                  Empates
                </p>
                <p className="text-3xl font-black text-yellow-500">{emp}</p>
              </div>
              <div className="h-12 w-px bg-gray-200 hidden md:block"></div>

              <div className="text-center px-4">
                <p className="text-sm text-gray-500 font-bold uppercase">
                  Derrotas
                </p>
                <p className="text-3xl font-black text-red-600">{der}</p>
              </div>
              <div className="h-12 w-px bg-gray-200 hidden md:block"></div>

              <div className="text-center px-4">
                <p className="text-sm text-gray-500 font-bold uppercase">
                  Aproveitamento
                </p>
                <p className="text-3xl font-black text-[#0074D9]">{ap}%</p>
              </div>

              <div className="w-full mt-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm font-bold bg-gray-50 rounded-lg p-4 border border-gray-100">
                <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-start border-b sm:border-b-0 border-gray-200 pb-2 sm:pb-0">
                  <span className="text-gray-500">Gols Marcados (GP)</span>
                  <span className="text-xl text-green-600">{gp}</span>
                </div>
                <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-start border-b sm:border-b-0 border-gray-200 pb-2 sm:pb-0">
                  <span className="text-gray-500">Gols Sofridos (GC)</span>
                  <span className="text-xl text-red-600">{gc}</span>
                </div>
                <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-start">
                  <span className="text-gray-500">Saldo (SG)</span>
                  <span
                    className={`text-xl ${gp - gc >= 0 ? "text-green-600" : "text-red-600"}`}
                  >
                    {gp >= gc ? `+${gp - gc}` : gp - gc}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Mobile View */}
          <div className="grid grid-cols-1 gap-4 md:hidden">
            {games?.length === 0 && (
              <div className="py-8 text-center text-gray-500 font-medium">
                Nenhum jogo agendado.
              </div>
            )}
            {games?.map((game, index) => {
              const dateObj = new Date(game.date);
              const dateStr = dateObj.toLocaleDateString("pt-BR", {
                timeZone: "UTC",
              });
              return <AgendaCard key={game.id} game={game} index={index} isNextGame={game.id === nextGameId} dateStr={dateStr} />;
            })}
          </div>

          {/* Desktop View */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left border-collapse bg-white rounded-lg shadow-sm overflow-hidden max-w-5xl mx-auto">
              <thead>
                <tr className="bg-[#001f3f] text-white">
                  <th className="py-4 px-6 font-semibold uppercase text-sm">
                    Data
                  </th>
                  <th className="py-4 px-6 font-semibold uppercase text-sm">
                    Hora
                  </th>
                  <th className="py-4 px-6 font-semibold uppercase text-sm text-center">
                    Partida
                  </th>
                  <th className="py-4 px-6 font-semibold uppercase text-sm">
                    Local
                  </th>
                  <th className="py-4 px-6 font-semibold uppercase text-sm">
                    Desfecho
                  </th>
                </tr>
              </thead>
              <tbody>
                {games?.length === 0 && (
                  <tr>
                    <td
                      colSpan={5}
                      className="py-8 text-center text-gray-500 font-medium"
                    >
                      Nenhum jogo agendado no momento.
                    </td>
                  </tr>
                )}
                {games?.map((game, index) => {
                  const dateObj = new Date(game.date);
                  const dateStr = dateObj.toLocaleDateString("pt-BR", {
                    timeZone: "UTC",
                  });
                  return (
                    <AgendaRow
                      key={game.id}
                      game={game}
                      index={index}
                      isNextGame={game.id === nextGameId}
                      dateStr={dateStr}
                    />
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-4 mt-8">
              {currentPage > 1 ? (
                <Link
                  href={`/campeonato/agenda?page=${currentPage - 1}`}
                  className="p-2 rounded-full border border-gray-300 bg-white text-gray-700 hover:bg-[#0074D9] hover:text-white transition-colors"
                >
                  <ChevronLeft size={20} />
                </Link>
              ) : (
                <div className="p-2 rounded-full border border-gray-200 bg-gray-50 text-gray-300">
                  <ChevronLeft size={20} />
                </div>
              )}

              <div className="text-[#001f3f] font-bold text-lg">
                Página {currentPage} de {totalPages}
              </div>

              {currentPage < totalPages ? (
                <Link
                  href={`/campeonato/agenda?page=${currentPage + 1}`}
                  className="p-2 rounded-full border border-gray-300 bg-white text-gray-700 hover:bg-[#0074D9] hover:text-white transition-colors"
                >
                  <ChevronRight size={20} />
                </Link>
              ) : (
                <div className="p-2 rounded-full border border-gray-200 bg-gray-50 text-gray-300">
                  <ChevronRight size={20} />
                </div>
              )}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
