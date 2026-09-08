import { createClient } from "@/utils/supabase/server";
import Image from "next/image";
import Link from "next/link";

export async function SectionElenco() {
  const supabase = await createClient();
  const { data: playersList } = await supabase.from("players").select("*").order("name");
  
  // Se não houver jogadores reais cadastrados, gera alguns de mentira para preencher o visual
  const basePlayers = playersList && playersList.length > 0 ? playersList : Array.from({ length: 8 }).map((_, i) => ({
    id: `mock-${i}`,
    name: `Jogador ${i + 1}`,
    position: ["Goleiro", "Zagueiro", "Lateral", "Meio-Campo", "Atacante"][i % 5],
    image: "/images/player.jpg",
  }));

  // Duplicamos a lista para que a fita contínua (Marquee) não tenha "buracos" no final
  // Garantimos um tamanho mínimo repetindo a lista se for pequena
  let marqueeList = [...basePlayers];
  while (marqueeList.length < 12) {
    marqueeList = [...marqueeList, ...basePlayers];
  }
  
  // Como o keyframes move -50%, o contêiner precisa ter exatamente 2 metades iguais
  const fullMarquee = [...marqueeList, ...marqueeList];

  return (
    <section id="elenco" className="py-12 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 className="text-4xl font-extrabold text-[#001f3f] uppercase tracking-tight">Nosso Elenco</h2>
          <div className="w-24 h-1 bg-[#0074D9] mx-auto mt-4"></div>
          <p className="mt-4 text-gray-600 max-w-2xl mx-auto text-lg">A experiência de quem já viveu muito o futebol. Nosso time de mestres.</p>
        </div>
      </div>
      
      {/* Slider Contínuo (Marquee) */}
      <div className="relative w-full flex whitespace-nowrap overflow-hidden">
        {/* Usamos a animação criada no globals.css que move até -50% */}
        <div className="flex animate-scroll w-max">
          {fullMarquee.map((player, index) => (
            <div 
              key={`${player.id}-${index}`} 
              className="w-[50vw] sm:w-[33vw] lg:w-[25vw] xl:w-[20vw] flex-shrink-0 px-3 group cursor-pointer"
            >
              <Link href={`/elenco/${player.id}`} className="block relative overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300">
                <div className="aspect-[3/4] relative w-full">
                  <Image
                    src={player.image || "/images/player.jpg"}
                    alt={player.name}
                    fill
                    sizes="(max-width: 768px) 50vw, 25vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#001f3f] to-transparent opacity-90 group-hover:opacity-100 transition-opacity" />
                </div>
                <div className="absolute bottom-0 w-full p-4 sm:p-6 text-center transform translate-y-2 group-hover:translate-y-0 transition-transform">
                  <h3 className="text-lg sm:text-xl font-bold text-white mb-1 uppercase tracking-wider truncate">
                    {player.jersey_number ? `${player.jersey_number} - ` : ''}{player.name}
                  </h3>
                  <p className="text-[#38bdf8] font-semibold text-xs sm:text-sm">{player.position}</p>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-16 text-center">
        <Link 
          href="/elenco" 
          className="inline-block bg-transparent border-2 border-[#001f3f] text-[#001f3f] hover:bg-[#001f3f] hover:text-white font-bold py-3 px-8 rounded-full transition-all uppercase tracking-widest text-sm"
        >
          Ver elenco completo
        </Link>
      </div>
    </section>
  );
}
