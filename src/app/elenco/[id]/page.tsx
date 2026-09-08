import { createClient } from "@/utils/supabase/server";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import Image from "next/image";
import { redirect } from "next/navigation";
import { Calendar, User, MapPin, Target, Ruler, Weight, Hash, CreditCard, Trophy } from "lucide-react";

export default async function PlayerProfilePage(props: { params: Promise<{ id: string }> }) {
  const resolvedParams = await props.params;
  const { id } = resolvedParams;
  const supabase = await createClient();

  const { data: player } = await supabase.from("players").select("*").eq("id", id).single();
  const { data: highlightGames } = await supabase.from("games").select("*").eq("highlight_player", id).order("date", { ascending: false });

  if (!player) {
    redirect("/elenco");
  }

  // Helper para formatar data
  const formatDate = (dateString?: string) => {
    if (!dateString) return "Não informado";
    try {
      if (!dateString.includes("-")) return dateString; // se for apenas o ano, retorna ele mesmo
      const parts = dateString.split("-");
      if (parts.length === 3) {
        const [year, month, day] = parts;
        return `${day}/${month}/${year}`;
      }
      return dateString;
    } catch {
      return dateString;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-black">
      <div className="min-h-screen pb-16">
        <Navbar />

        <main className="pt-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col md:flex-row gap-8 lg:gap-16 mt-8">
            
            {/* Esquerda: Foto do Jogador */}
            <div className="md:w-1/3 flex flex-col">
              <div className="bg-white rounded-t-xl overflow-hidden shadow-2xl relative aspect-[3/4] border-b-4 border-[#001f3f]">
                <Image
                  src={player.image || "/images/player.jpg"}
                  alt={player.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover"
                />
              </div>
              <div className="bg-white rounded-b-xl p-4 shadow-xl">
                <h1 className="text-2xl md:text-3xl font-black text-black uppercase tracking-tighter">
                  {player.name}
                </h1>
              </div>
            </div>

            {/* Direita: Detalhes e Status */}
            <div className="md:w-2/3 space-y-6">
              <div className="bg-white rounded-2xl shadow-xl border-t-4 border-[#001f3f] p-8">
                <h2 className="text-2xl font-bold text-[#001f3f] mb-6 uppercase tracking-wider border-b pb-2">Dados do Atleta</h2>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  
                  <div className="flex items-center gap-4">
                    <div className="bg-[#001f3f] p-3 rounded-lg shadow-md flex-shrink-0">
                      <Calendar size={28} className="text-white" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Entrada no Clube</p>
                      <p className="text-xl font-black text-gray-900">{player.entry_year ? formatDate(player.entry_year) : '-'}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="bg-[#001f3f] p-3 rounded-lg shadow-md flex-shrink-0">
                      <MapPin size={28} className="text-white" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Naturalidade</p>
                      <p className="text-xl font-black text-gray-900">{player.birthplace || '-'}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="bg-[#001f3f] p-3 rounded-lg shadow-md flex-shrink-0">
                      <User size={28} className="text-white" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Data Nasc.</p>
                      <p className="text-xl font-black text-gray-900">{formatDate(player.birth_date)}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="bg-[#001f3f] p-3 rounded-lg shadow-md flex-shrink-0">
                      <Target size={28} className="text-white" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Posição</p>
                      <p className="text-xl font-black text-gray-900">{player.position}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="bg-[#001f3f] p-3 rounded-lg shadow-md flex-shrink-0">
                      <Ruler size={28} className="text-white" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Altura</p>
                      <p className="text-xl font-black text-gray-900">{player.height || '-'}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="bg-[#001f3f] p-3 rounded-lg shadow-md flex-shrink-0">
                      <Weight size={28} className="text-white" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Peso</p>
                      <p className="text-xl font-black text-gray-900">{player.weight || '-'}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="bg-[#001f3f] p-3 rounded-lg shadow-md flex-shrink-0">
                      <Hash size={28} className="text-white" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Nº Camisa</p>
                      <p className="text-xl font-black text-gray-900">{player.jersey_number || '-'}</p>
                    </div>
                  </div>

                </div>
              </div>

              {/* ESTATÍSTICAS / CARTÕES */}
              <div className="bg-white rounded-2xl shadow-xl border-t-4 border-[#001f3f] p-8 mt-6">
                <h2 className="text-2xl font-bold text-[#001f3f] mb-6 uppercase tracking-wider border-b pb-2">Estatísticas</h2>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  
                  <div className="flex items-center gap-4">
                    <div className="bg-yellow-100 p-3 rounded-lg shadow-md flex-shrink-0">
                      <CreditCard size={28} className="text-yellow-600 fill-yellow-600" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">C. Amarelos</p>
                      <p className="text-2xl font-black text-gray-900">{player.yellow_cards || 0}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="bg-red-100 p-3 rounded-lg shadow-md flex-shrink-0">
                      <CreditCard size={28} className="text-red-600 fill-red-600" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">C. Vermelhos</p>
                      <p className="text-2xl font-black text-gray-900">{player.red_cards || 0}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="bg-[#001f3f] p-3 rounded-lg shadow-md flex-shrink-0">
                      <Trophy size={28} className="text-white fill-white" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Gols Marcados</p>
                      <p className="text-2xl font-black text-gray-900">{player.goals || 0}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* DESTAQUES DA PARTIDA */}
              {highlightGames && highlightGames.length > 0 && (
                <div className="bg-gradient-to-r from-[#001f3f] to-[#003366] rounded-2xl shadow-2xl border-t-4 border-yellow-400 p-8 mt-6 relative overflow-hidden">
                  <div className="absolute top-0 right-0 -mr-8 -mt-8 opacity-10">
                    <Trophy size={150} className="text-yellow-400" />
                  </div>
                  <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-6 border-b border-[#ffffff20] pb-3">
                      <Trophy size={32} className="text-yellow-400" />
                      <h2 className="text-2xl font-bold text-white uppercase tracking-wider">Craque do Jogo</h2>
                    </div>
                    
                    <p className="text-gray-300 mb-6 font-medium">Eleito o destaque principal nas seguintes partidas:</p>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {highlightGames.map((game) => (
                        <div key={game.id} className="bg-white/10 backdrop-blur-sm border border-white/20 p-4 rounded-xl flex items-center justify-between hover:bg-white/20 transition-colors">
                          <div>
                            <p className="text-yellow-400 text-xs font-bold uppercase tracking-widest">{formatDate(game.date)}</p>
                            <p className="text-white font-bold text-lg">vs {game.opponent}</p>
                          </div>
                          <div className="bg-white text-[#001f3f] px-3 py-1 rounded font-black text-sm">
                            {(game.goals_players || []).length} x {game.opponent_goals || 0}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

          </div>
        </main>

      </div>
      <Footer />
    </div>
  );
}
