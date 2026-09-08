import { createClient } from "@/utils/supabase/server";
import { AgendaCard } from "./AgendaCard";
import { AgendaRow } from "./AgendaRow";

export async function SectionAgenda() {
  const supabase = await createClient();
  const { data: games } = await supabase
    .from("games")
    .select("*")
    .order("date", { ascending: false })
    .limit(6);

  return (
    <section id="agenda" className="py-24 bg-[#f8f9fa]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-extrabold text-[#001f3f] uppercase tracking-tight">
            Agenda de Jogos
          </h2>
          <div className="w-24 h-1 bg-[#0074D9] mx-auto mt-4 mb-6"></div>
        </div>
        
        {/* Mobile View */}
        <div className="grid grid-cols-1 gap-4 md:hidden">
          {games?.length === 0 && (
            <div className="py-8 text-center text-gray-500 font-medium">Nenhum jogo agendado no momento.</div>
          )}
          {games?.map((game) => {
            const dateObj = new Date(game.date);
            const dateStr = dateObj.toLocaleDateString('pt-BR', { timeZone: 'UTC' });
            return <AgendaCard key={game.id} game={game} dateStr={dateStr} />;
          })}
        </div>

        {/* Desktop View */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left border-collapse bg-white rounded-lg shadow-sm overflow-hidden max-w-5xl mx-auto">
            <thead>
              <tr className="bg-[#001f3f] text-white">
                <th className="py-4 px-6 font-semibold uppercase text-sm">Data</th>
                <th className="py-4 px-6 font-semibold uppercase text-sm">Hora</th>
                <th className="py-4 px-6 font-semibold uppercase text-sm text-center">Partida</th>
                <th className="py-4 px-6 font-semibold uppercase text-sm">Local</th>
                <th className="py-4 px-6 font-semibold uppercase text-sm">Desfecho</th>
              </tr>
            </thead>
            <tbody>
              {games?.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-gray-500 font-medium">Nenhum jogo agendado no momento.</td>
                </tr>
              )}
              {games?.map((game, index) => {
                const dateObj = new Date(game.date);
                const dateStr = dateObj.toLocaleDateString('pt-BR', { timeZone: 'UTC' });
                return <AgendaRow key={game.id} game={game} index={index} dateStr={dateStr} />;
              })}
            </tbody>
          </table>
        </div>


        <div className="mt-8 text-center">
          <a
            href="/jogos"
            className="inline-flex items-center justify-center bg-white text-[#001f3f] border-2 border-[#001f3f] hover:bg-[#001f3f] hover:text-white font-bold py-3 px-8 rounded-full transition-colors shadow-sm"
          >
            Ver Agenda Completa
          </a>
        </div>
      </div>
    </section>
  );
}
