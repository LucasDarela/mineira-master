import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { SectionElenco } from "@/components/SectionElenco";
import { SectionAgenda } from "@/components/SectionAgenda";
import { SectionNextGame } from "@/components/SectionNextGame";
import { createClient } from "@/utils/supabase/server";

export default async function Campeonato() {
  const supabase = await createClient();
  const { data: dbStandings } = await supabase.from("championship_standings").select("*");
  const { data: games } = await supabase.from("games").select("*").eq("is_championship", true);
  
  let standings = dbStandings || [];
  
  if (games) {
    const champGames = games.filter((g: any) => g.outcome);
    const mmStats = {
      team_name: "Mineira Master",
      matches_played: champGames.length,
      wins: champGames.filter((g: any) => g.outcome === "V").length,
      draws: champGames.filter((g: any) => g.outcome === "E").length,
      losses: champGames.filter((g: any) => g.outcome === "D").length,
      goals_for: champGames.reduce((sum: number, g: any) => sum + (g.goals_players?.length || 0), 0),
      goals_against: champGames.reduce((sum: number, g: any) => sum + (g.opponent_goals || 0), 0),
    };
    standings = standings.filter((s: any) => s.team_name.toLowerCase() !== "mineira master");
    standings.push(mmStats);
  }
  
  // Calcular pontos, saldo de gols e ordenar
  const classificacao = standings
    .map(t => {
      const p = (t.wins * 3) + t.draws;
      const sg = t.goals_for - t.goals_against;
      return { 
        time: t.team_name, 
        p, 
        j: t.matches_played, 
        v: t.wins, 
        e: t.draws, 
        d: t.losses, 
        gp: t.goals_for, 
        gc: t.goals_against, 
        sg 
      };
    })
    .sort((a, b) => {
      if (a.p !== b.p) return b.p - a.p;
      if (a.v !== b.v) return b.v - a.v;
      return b.sg - a.sg;
    })
    .map((t, index) => ({ ...t, pos: index + 1 }));



  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      
      <div className="pt-28 pb-16 bg-[#001f3f] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold uppercase tracking-tight mb-4">Campeonato Regional 50+</h1>
          <p className="text-xl text-gray-300">Acompanhe a campanha do Mineira Master na busca pelo título!</p>
        </div>
      </div>



      <SectionNextGame isChampionship={true} />
      <SectionAgenda isChampionship={true} />

      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-[#001f3f] uppercase mb-8 border-l-4 border-[#0074D9] pl-4">Classificação</h2>
          
          <div className="overflow-x-auto bg-white rounded-xl shadow-md border border-gray-100">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#001f3f] text-white">
                  <th className="py-4 px-4 font-semibold text-center w-12">#</th>
                  <th className="py-4 px-4 font-semibold">Time</th>
                  <th className="py-4 px-4 font-semibold text-center w-12" title="Pontos">P</th>
                  <th className="py-4 px-4 font-semibold text-center w-12 hidden sm:table-cell" title="Jogos">J</th>
                  <th className="py-4 px-4 font-semibold text-center w-12 hidden sm:table-cell" title="Vitórias">V</th>
                  <th className="py-4 px-4 font-semibold text-center w-12 hidden sm:table-cell" title="Empates">E</th>
                  <th className="py-4 px-4 font-semibold text-center w-12 hidden sm:table-cell" title="Derrotas">D</th>
                  <th className="py-4 px-4 font-semibold text-center w-12 hidden md:table-cell" title="Gols Pró">GP</th>
                  <th className="py-4 px-4 font-semibold text-center w-12 hidden md:table-cell" title="Gols Contra">GC</th>
                  <th className="py-4 px-4 font-semibold text-center w-12" title="Saldo de Gols">SG</th>
                </tr>
              </thead>
              <tbody>
                {classificacao.map((time, idx) => (
                  <tr key={time.time} className={`${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'} border-b border-gray-100 hover:bg-gray-100`}>
                    <td className="py-3 px-4 text-center font-bold text-gray-500">{time.pos}</td>
                    <td className={`py-3 px-4 font-bold ${time.time === 'Mineira Master' ? 'text-[#0074D9]' : 'text-gray-800'}`}>{time.time}</td>
                    <td className="py-3 px-4 text-center font-black text-[#0074D9] text-lg">{time.p}</td>
                    <td className="py-3 px-4 text-center text-gray-500 hidden sm:table-cell">{time.j}</td>
                    <td className="py-3 px-4 text-center text-gray-500 hidden sm:table-cell">{time.v}</td>
                    <td className="py-3 px-4 text-center text-gray-500 hidden sm:table-cell">{time.e}</td>
                    <td className="py-3 px-4 text-center text-gray-500 hidden sm:table-cell">{time.d}</td>
                    <td className="py-3 px-4 text-center text-gray-500 hidden md:table-cell">{time.gp}</td>
                    <td className="py-3 px-4 text-center text-gray-500 hidden md:table-cell">{time.gc}</td>
                    <td className="py-3 px-4 text-center text-gray-500">{time.sg}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
      <SectionElenco isChampionship={true} />

      <Footer />
    </main>
  );
}
