import { createClient } from "@/utils/supabase/server";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { redirect } from "next/navigation";
import { Calendar, MapPin, Target, Clock, Flag, AlertTriangle, Trophy } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default async function GameDetailsPage(props: { params: Promise<{ id: string }> }) {
  const resolvedParams = await props.params;
  const { id } = resolvedParams;
  const supabase = await createClient();

  const { data: game } = await supabase.from("games").select("*").eq("id", id).single();
  const { data: players } = await supabase.from("players").select("id, name, image");

  if (!game) {
    redirect("/");
  }

  const getPlayerName = (pid: string) => players?.find(p => p.id === pid)?.name || "Desconhecido";

  // Agrupar contagens para Gols
  const goalsMap = (game.goals_players || []).reduce((acc: any, curr: string) => {
    acc[curr] = (acc[curr] || 0) + 1;
    return acc;
  }, {});

  // Agrupar contagens para Amarelos
  const yellowMap = (game.yellow_cards_players || []).reduce((acc: any, curr: string) => {
    acc[curr] = (acc[curr] || 0) + 1;
    return acc;
  }, {});

  // Agrupar contagens para Vermelhos
  const redMap = (game.red_cards_players || []).reduce((acc: any, curr: string) => {
    acc[curr] = (acc[curr] || 0) + 1;
    return acc;
  }, {});

  const dateObj = new Date(game.date);
  const dateStr = dateObj.toLocaleDateString('pt-BR', { timeZone: 'UTC' });

  return (
    <div className="min-h-screen bg-gray-50 text-black flex flex-col">
      <Navbar />

      <main className="flex-grow pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Breadcrumb / Voltar */}
          <div className="mb-6">
            <Link href="/#agenda" className="text-[#0074D9] hover:underline font-semibold flex items-center gap-1">
              &larr; Voltar para a Agenda
            </Link>
          </div>

          {/* Cabeçalho da Partida */}
          <div className="bg-[#001f3f] rounded-t-2xl p-8 text-center shadow-lg relative overflow-hidden">
            {game.is_championship && (
              <div className="absolute top-4 right-4 bg-yellow-400 text-yellow-900 text-xs px-3 py-1 rounded-full font-black uppercase tracking-wider shadow-sm">
                Campeonato
              </div>
            )}
            
            <div className="grid items-center gap-4 mb-6 w-full" style={{ gridTemplateColumns: '1fr auto 1fr' }}>
              {game.home_or_away === 'Fora' ? (
                <>
                  <span className="text-3xl md:text-5xl font-black text-white uppercase tracking-tighter text-center leading-tight">{game.opponent}</span>
                  <span className="text-gray-400 text-xl font-medium shrink-0">vs</span>
                  <span className="text-3xl md:text-5xl font-black text-white uppercase tracking-tighter text-center leading-tight">Mineira Master</span>
                </>
              ) : (
                <>
                  <span className="text-3xl md:text-5xl font-black text-white uppercase tracking-tighter text-center leading-tight">Mineira Master</span>
                  <span className="text-gray-400 text-xl font-medium shrink-0">vs</span>
                  <span className="text-3xl md:text-5xl font-black text-white uppercase tracking-tighter text-center leading-tight">{game.opponent}</span>
                </>
              )}
            </div>

            <div className="inline-block bg-white text-[#001f3f] px-8 py-3 rounded-xl font-black text-4xl shadow-inner border-2 border-gray-200">
              {game.home_or_away === 'Fora'
                ? `${game.opponent_goals ?? 0}-${(game.goals_players || []).length}`
                : `${(game.goals_players || []).length}-${game.opponent_goals ?? 0}`}
            </div>
            
            {game.outcome && (
              <div className="mt-4">
                {game.outcome === 'V' && <span className="bg-green-500 text-white font-bold px-4 py-1 rounded text-lg uppercase tracking-widest shadow-md">Vitória</span>}
                {game.outcome === 'E' && <span className="bg-yellow-500 text-white font-bold px-4 py-1 rounded text-lg uppercase tracking-widest shadow-md">Empate</span>}
                {game.outcome === 'D' && <span className="bg-red-500 text-white font-bold px-4 py-1 rounded text-lg uppercase tracking-widest shadow-md">Derrota</span>}
              </div>
            )}
          </div>

          {/* Detalhes Básicos */}
          <div className="bg-white p-6 shadow-md border-b-2 border-gray-100 flex flex-wrap justify-around gap-6">
            <div className="flex items-center gap-3">
              <Calendar className="text-[#0074D9]" size={24} />
              <div>
                <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Data</p>
                <p className="font-bold text-lg">{dateStr}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Clock className="text-[#0074D9]" size={24} />
              <div>
                <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Horário</p>
                <p className="font-bold text-lg">{game.time}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <MapPin className="text-[#0074D9]" size={24} />
              <div>
                <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Local</p>
                <p className="font-bold text-lg">{game.location}</p>
              </div>
            </div>
          </div>

          {/* Eventos da Partida */}
          <div className="bg-white rounded-b-2xl shadow-lg p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Gols e Ataque */}
            <div className="space-y-6">
              <div className="flex items-center gap-2 border-b-2 border-gray-100 pb-2">
                <Target className="text-green-600" size={28} />
                <h2 className="text-2xl font-bold text-[#001f3f] uppercase">Gols da Partida</h2>
              </div>
              
              {Object.keys(goalsMap).length > 0 ? (
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 flex flex-col gap-2">
                  {Object.entries(goalsMap).map(([pid, count]) => (
                    <div key={pid} className="flex items-center gap-2 text-lg font-bold text-gray-800">
                      <span>⚽</span>
                      <span>{getPlayerName(pid)}</span>
                      {Number(count) > 1 && <span className="text-sm bg-gray-200 px-2 py-0.5 rounded-full text-gray-600">x{Number(count)}</span>}
                    </div>
                  ))}
                  {game.goals_details && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <p className="text-sm text-gray-500 font-bold uppercase mb-1">Outros Detalhes:</p>
                      <p className="text-gray-700 whitespace-pre-line leading-relaxed font-medium">
                        {game.goals_details}
                      </p>
                    </div>
                  )}
                </div>
              ) : game.goals_details ? (
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                  <p className="text-gray-700 whitespace-pre-line leading-relaxed font-medium">
                    {game.goals_details}
                  </p>
                </div>
              ) : (
                <p className="text-gray-400 italic">Nenhum gol registrado.</p>
              )}
            </div>

            {/* Cartões e Arbitragem */}
            <div className="space-y-6">
              <div className="flex items-center gap-2 border-b-2 border-gray-100 pb-2">
                <AlertTriangle className="text-yellow-500" size={28} />
                <h2 className="text-2xl font-bold text-[#001f3f] uppercase">Disciplina</h2>
              </div>

              {(Object.keys(yellowMap).length > 0 || Object.keys(redMap).length > 0) ? (
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 flex flex-col gap-3">
                  
                  {Object.entries(yellowMap).map(([pid, count]) => (
                    <div key={`y-${pid}`} className="flex items-center gap-2 text-lg font-bold text-gray-800">
                      <div className="flex gap-0.5">
                        {Array.from({ length: Number(count) }).map((_, i) => (
                          <div key={i} className="w-4 h-5 bg-yellow-400 rounded-sm shadow-sm border border-yellow-500"></div>
                        ))}
                      </div>
                      <span>{getPlayerName(pid)}</span>
                    </div>
                  ))}

                  {Object.entries(redMap).map(([pid, count]) => (
                    <div key={`r-${pid}`} className="flex items-center gap-2 text-lg font-bold text-gray-800">
                      <div className="flex gap-0.5">
                        {Array.from({ length: Number(count) }).map((_, i) => (
                          <div key={i} className="w-4 h-5 bg-red-600 rounded-sm shadow-sm border border-red-700"></div>
                        ))}
                      </div>
                      <span>{getPlayerName(pid)}</span>
                    </div>
                  ))}

                  {game.cards_details && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <p className="text-sm text-gray-500 font-bold uppercase mb-1">Outros Detalhes:</p>
                      <p className="text-gray-700 whitespace-pre-line leading-relaxed font-medium">
                        {game.cards_details}
                      </p>
                    </div>
                  )}
                </div>
              ) : game.cards_details ? (
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                  <p className="text-gray-700 whitespace-pre-line leading-relaxed font-medium">
                    {game.cards_details}
                  </p>
                </div>
              ) : (
                <p className="text-gray-400 italic">Nenhum cartão registrado.</p>
              )}

              <div className="mt-8 border-t-2 border-gray-100 pt-6">
                <div className="flex items-center gap-2 mb-2">
                  <Flag className="text-gray-600" size={24} />
                  <h3 className="text-xl font-bold text-gray-800 uppercase">Arbitragem</h3>
                </div>
                <p className="text-lg font-medium text-gray-700 bg-gray-50 p-3 rounded-lg border border-gray-200 inline-block">
                  {game.referee || "Não informado"}
                </p>
              </div>
            </div>

          </div>
          
          {/* Craque do Jogo / Destaque */}
          {game.highlight_player && (
            (() => {
              const highlight = players?.find(p => p.id === game.highlight_player);
              if (!highlight) return null;
              
              return (
                <div className="mt-8 bg-gradient-to-r from-[#001f3f] to-[#003366] rounded-2xl shadow-2xl p-8 relative overflow-hidden border-t-4 border-yellow-400">
                  <div className="absolute top-0 right-0 -mr-16 -mt-16 opacity-10">
                    <Trophy size={200} className="text-yellow-400" />
                  </div>
                  <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
                    <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-yellow-400 shadow-xl flex-shrink-0">
                      <Image
                        src={highlight.image || "/images/player.jpg"}
                        alt={highlight.name}
                        width={160}
                        height={160}
                        className="object-cover w-full h-full"
                      />
                    </div>
                    <div className="text-center md:text-left flex-grow">
                      <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
                        <Trophy className="text-yellow-400" size={24} />
                        <h3 className="text-yellow-400 font-bold tracking-widest uppercase text-sm">Destaque da Partida</h3>
                      </div>
                      <h2 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tighter">
                        {highlight.name}
                      </h2>
                      <p className="text-gray-300 mt-2 font-medium">Eleito o craque do jogo pela sua brilhante atuação em campo.</p>
                      
                      <div className="mt-4">
                        <Link href={`/elenco/${highlight.id}`} className="inline-block bg-yellow-400 text-yellow-900 font-bold px-6 py-2 rounded shadow-md hover:bg-yellow-300 transition-colors uppercase text-sm tracking-wider">
                          Ver Perfil
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })()
          )}

        </div>
      </main>

      <Footer />
    </div>
  );
}
