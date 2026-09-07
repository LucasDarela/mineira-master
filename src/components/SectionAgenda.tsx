import { createClient } from "@/utils/supabase/server";

export async function SectionAgenda() {
  const supabase = await createClient();
  const { data: games } = await supabase
    .from("games")
    .select("*")
    .order("date", { ascending: false })
    .limit(10);

  return (
    <section id="agenda" className="py-24 bg-[#f8f9fa]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-extrabold text-[#001f3f] uppercase tracking-tight">Agenda de Jogos</h2>
          <div className="w-24 h-1 bg-[#0074D9] mx-auto mt-4"></div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse bg-white rounded-lg shadow-sm overflow-hidden">
            <thead>
              <tr className="bg-[#001f3f] text-white">
                <th className="py-4 px-6 font-semibold uppercase text-sm">Data</th>
                <th className="py-4 px-6 font-semibold uppercase text-sm">Hora</th>
                <th className="py-4 px-6 font-semibold uppercase text-sm">Adversário</th>
                <th className="py-4 px-6 font-semibold uppercase text-sm">Local</th>
                <th className="py-4 px-6 font-semibold uppercase text-sm">Resultado</th>
              </tr>
            </thead>
            <tbody>
              {games?.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-gray-500 font-medium">Nenhum jogo agendado no momento.</td>
                </tr>
              )}
              {games?.map((game, index) => {
                // Convert YYYY-MM-DD to DD/MM/YYYY using UTC string to avoid timezone shifts
                const dateObj = new Date(game.date);
                const dateStr = dateObj.toLocaleDateString('pt-BR', { timeZone: 'UTC' });
                
                return (
                  <tr key={game.id} className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} border-b border-gray-200 hover:bg-gray-100 transition-colors`}>
                    <td className="py-4 px-6 text-gray-800 font-medium">
                      {dateStr}
                      {game.is_championship && <span className="ml-2 bg-yellow-100 text-yellow-800 text-[10px] px-2 py-0.5 rounded font-bold uppercase hidden sm:inline-block">Campeonato</span>}
                    </td>
                    <td className="py-4 px-6 text-gray-600">{game.time}</td>
                    <td className="py-4 px-6 font-bold text-[#001f3f]">{game.opponent}</td>
                    <td className="py-4 px-6 text-gray-600">{game.location}</td>
                    <td className="py-4 px-6 flex items-center gap-2">
                      <span className="font-bold text-[#0074D9]">{game.result || "-"}</span>
                      {game.outcome === 'V' && <span className="bg-green-100 text-green-700 font-bold px-2 py-1 rounded text-xs">V</span>}
                      {game.outcome === 'E' && <span className="bg-yellow-100 text-yellow-700 font-bold px-2 py-1 rounded text-xs">E</span>}
                      {game.outcome === 'D' && <span className="bg-red-100 text-red-700 font-bold px-2 py-1 rounded text-xs">D</span>}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
