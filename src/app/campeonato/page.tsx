import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { SectionElenco } from "@/components/SectionElenco";
import { createClient } from "@/utils/supabase/server";

export default async function Campeonato() {
  const supabase = await createClient();
  const { data: jogosData } = await supabase
    .from("games")
    .select("*")
    .eq("is_championship", true)
    .order("date", { ascending: true });
    
  const jogos = jogosData || [];

  const classificacao = [
    { pos: 1, time: "Mineira Master", p: 12, j: 4, v: 4, e: 0, d: 0, gp: 10, gc: 2, sg: 8 },
    { pos: 2, time: "Amigos FC", p: 9, j: 4, v: 3, e: 0, d: 1, gp: 8, gc: 4, sg: 4 },
    { pos: 3, time: "Veteranos SC", p: 7, j: 4, v: 2, e: 1, d: 1, gp: 5, gc: 5, sg: 0 },
    { pos: 4, time: "Lendas do Sul", p: 4, j: 4, v: 1, e: 1, d: 2, gp: 4, gc: 6, sg: -2 },
    { pos: 5, time: "Clube da Bola", p: 3, j: 4, v: 1, e: 0, d: 3, gp: 3, gc: 8, sg: -5 },
    { pos: 6, time: "Criciúma 50+", p: 0, j: 4, v: 0, e: 0, d: 4, gp: 1, gc: 6, sg: -5 },
  ];

  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      
      <div className="pt-28 pb-16 bg-[#001f3f] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold uppercase tracking-tight mb-4">Campeonato Regional 50+</h1>
          <p className="text-xl text-gray-300">Acompanhe a campanha do Mineira Master na busca pelo título!</p>
        </div>
      </div>

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
                    <td className="py-3 px-4 text-center font-bold">{time.p}</td>
                    <td className="py-3 px-4 text-center text-gray-500 hidden sm:table-cell">{time.j}</td>
                    <td className="py-3 px-4 text-center text-gray-500 hidden sm:table-cell">{time.v}</td>
                    <td className="py-3 px-4 text-center text-gray-500 hidden sm:table-cell">{time.e}</td>
                    <td className="py-3 px-4 text-center text-gray-500 hidden sm:table-cell">{time.d}</td>
                    <td className="py-3 px-4 text-center text-gray-500 hidden md:table-cell">{time.gp}</td>
                    <td className="py-3 px-4 text-center text-gray-500 hidden md:table-cell">{time.gc}</td>
                    <td className="py-3 px-4 text-center font-semibold">{time.sg}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-[#001f3f] uppercase mb-8 border-l-4 border-[#0074D9] pl-4">Jogos do Campeonato</h2>
          
          {jogos.length === 0 ? (
             <p className="text-gray-500 italic">Nenhum jogo do campeonato registrado ainda.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {jogos.map((jogo, idx) => {
                const dateObj = new Date(jogo.date);
                const dateStr = dateObj.toLocaleDateString('pt-BR', { timeZone: 'UTC' });
                return (
                  <div key={jogo.id} className="bg-gray-50 p-6 rounded-lg border border-gray-200 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:border-[#0074D9] transition-colors">
                    <div className="bg-[#001f3f] text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                      Rodada {idx + 1}
                    </div>
                    <div className="text-lg font-semibold text-gray-800 flex-1 flex items-center justify-center gap-2">
                      <span>Mineira Master</span>
                      {jogo.result ? <span className="text-[#0074D9] font-bold">{jogo.result}</span> : <span className="text-gray-400"> x </span>}
                      <span>{jogo.opponent}</span>
                      
                      {jogo.outcome === 'V' && <span className="bg-green-100 text-green-700 font-bold px-2 py-1 rounded text-xs ml-2">V</span>}
                      {jogo.outcome === 'E' && <span className="bg-yellow-100 text-yellow-700 font-bold px-2 py-1 rounded text-xs ml-2">E</span>}
                      {jogo.outcome === 'D' && <span className="bg-red-100 text-red-700 font-bold px-2 py-1 rounded text-xs ml-2">D</span>}
                    </div>
                    <div className="text-gray-500 font-medium text-sm flex flex-col items-end">
                      <span>{dateStr}</span>
                      <span className="text-xs">{jogo.location}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      <SectionElenco />

      <Footer />
    </main>
  );
}
