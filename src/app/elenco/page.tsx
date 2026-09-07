import { createClient } from "@/utils/supabase/server";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import Image from "next/image";

export default async function ElencoPage() {
  const supabase = await createClient();
  const { data: players } = await supabase.from("players").select("*").order("name");
  const { data: staff } = await supabase.from("staff").select("*").order("name");

  // Mock fallback caso não tenha dados no banco
  const displayPlayers = players && players.length > 0 ? players : Array.from({ length: 12 }).map((_, i) => ({
    id: `mock-${i}`,
    name: `Jogador ${i + 1}`,
    position: ["Goleiro", "Zagueiro", "Lateral", "Meio-Campo", "Atacante"][i % 5],
    jersey_number: (i + 1).toString(),
    image: "/images/player.jpg",
  }));

  // Agrupar por posições
  const groupedPlayers = displayPlayers.reduce((acc, player) => {
    const pos = player.position;
    if (!acc[pos]) acc[pos] = [];
    acc[pos].push(player);
    return acc;
  }, {} as Record<string, any[]>);

  // Ordem de exibição em campo
  const positionOrder = ["Goleiro", "Zagueiro", "Lateral", "Meio-Campo", "Atacante"];

  return (
    <div className="min-h-screen bg-gray-50 text-black">
      <Navbar />

      <main className="pt-24 pb-16">
        <div className="bg-[#001f3f] py-16 mb-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-5xl font-extrabold text-white uppercase tracking-tight mb-4">
              Elenco Oficial
            </h1>
            <p className="text-gray-300 max-w-2xl mx-auto text-lg">
              Conheça as lendas que vestem a camisa do Mineira Master.
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Sessões dos Jogadores */}
          {positionOrder.map((position) => {
            const posPlayers = groupedPlayers[position];
            if (!posPlayers || posPlayers.length === 0) return null;

            return (
              <div key={position} className="mb-16">
                <div className="flex items-center mb-8">
                  <h2 className="text-3xl font-bold text-[#001f3f] uppercase">{position}s</h2>
                  <div className="ml-4 flex-grow h-px bg-gray-300"></div>
                </div>

                <div className="flex flex-wrap justify-center gap-6 md:gap-8">
                  {posPlayers.map((player: any) => (
                    <div key={player.id} className="w-[calc(50%-1rem)] sm:w-[calc(25%-1.5rem)] lg:w-[calc(20%-1.5rem)] max-w-[200px] group relative overflow-hidden rounded-xl shadow-md hover:shadow-xl transition-all duration-300 bg-white">
                      <div className="aspect-[3/4] relative w-full">
                        <Image
                          src={player.image || "/images/player.jpg"}
                          alt={player.name}
                          fill
                          sizes="(max-width: 768px) 50vw, 25vw"
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#001f3f] via-transparent to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
                      </div>
                      <div className="absolute bottom-0 w-full p-4 text-center">
                        <h3 className="text-lg font-bold text-white mb-0 uppercase tracking-wider truncate">
                          {player.jersey_number ? `${player.jersey_number} - ` : ''}{player.name}
                        </h3>
                        <p className="text-[#38bdf8] font-semibold text-xs uppercase">{player.position}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}

          {/* Sessão da Comissão Técnica */}
          {staff && staff.length > 0 && (
            <div className="mb-16">
              <div className="flex items-center mb-8">
                <h2 className="text-3xl font-bold text-[#001f3f] uppercase">Comissão Técnica</h2>
                <div className="ml-4 flex-grow h-px bg-gray-300"></div>
              </div>
              
              <div className="flex flex-wrap justify-center gap-6 md:gap-8">
                {staff.map((member) => (
                  <div key={member.id} className="w-[calc(50%-1rem)] sm:w-[calc(25%-1.5rem)] lg:w-[calc(20%-1.5rem)] max-w-[200px] group relative overflow-hidden rounded-xl shadow-md hover:shadow-xl transition-all duration-300 bg-white border-t-4 border-green-600">
                    <div className="aspect-[3/4] relative w-full">
                      <Image
                        src={member.image || "/images/player.jpg"}
                        alt={member.name}
                        fill
                        sizes="(max-width: 768px) 50vw, 25vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-green-900 via-transparent to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
                    </div>
                    <div className="absolute bottom-0 w-full p-4 text-center">
                      <h3 className="text-lg font-bold text-white mb-0 uppercase tracking-wider truncate">
                        {member.name}
                      </h3>
                      <p className="text-green-400 font-semibold text-xs uppercase">{member.role}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </main>

      <Footer />
    </div>
  );
}
