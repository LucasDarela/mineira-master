import { Calendar, MapPin, Clock } from "lucide-react";
import { createClient } from "@/utils/supabase/server";

export async function SectionNextGame({ isChampionship = false }: { isChampionship?: boolean }) {
  const supabase = await createClient();
  
  const today = new Date().toISOString().split("T")[0];
  
  const { data: nextGame } = await supabase
    .from("games")
    .select("*")
    .gte("date", today)
    .eq("is_championship", isChampionship)
    .order("date", { ascending: true })
    .limit(1)
    .single();

  if (!nextGame) return null;

  const dateObj = new Date(nextGame.date);
  const formattedDate = dateObj.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric', timeZone: 'UTC' });

  const homeTeam = nextGame.home_or_away === 'Fora' ? nextGame.opponent : 'Mineira Master';
  const awayTeam = nextGame.home_or_away === 'Fora' ? 'Mineira Master' : nextGame.opponent;

  return (
    <section className="bg-gradient-to-r from-[#001f3f] to-[#0074D9] py-10 text-white relative overflow-hidden">
      <div className="absolute inset-0 opacity-10 bg-[url('/images/hero2.jpg')] bg-cover bg-center mix-blend-overlay"></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Título */}
        <div className="text-center mb-6">
          <h2 className="text-sm uppercase tracking-[0.3em] font-bold text-gray-300 mb-4">
            Próximo Desafio {nextGame.is_championship && "(Campeonato)"}
          </h2>

          {/* Layout mobile: vertical com X centralizado */}
          <div className="flex md:hidden flex-col items-center gap-2">
            <span className="text-3xl font-extrabold uppercase leading-tight">{homeTeam}</span>
            <span className="text-2xl font-black text-[#38bdf8]">×</span>
            <span className="text-3xl font-extrabold uppercase leading-tight">{awayTeam}</span>
          </div>

          {/* Layout desktop: horizontal */}
          <h3 className="hidden md:block text-5xl font-extrabold uppercase">
            {homeTeam} <span className="text-[#38bdf8]">×</span> {awayTeam}
          </h3>
        </div>

        {/* Info card */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 md:p-8 shadow-2xl border border-white/20">
          {/* Mobile: grid 3 colunas alinhadas */}
          <div className="grid grid-cols-3 gap-4 md:hidden">
            <div className="flex flex-col items-center text-center gap-2">
              <Calendar className="text-[#38bdf8]" size={28} />
              <div>
                <p className="text-[10px] text-gray-300 uppercase tracking-wider">Data</p>
                <p className="text-sm font-bold leading-tight">{formattedDate}</p>
              </div>
            </div>
            <div className="flex flex-col items-center text-center gap-2">
              <Clock className="text-[#38bdf8]" size={28} />
              <div>
                <p className="text-[10px] text-gray-300 uppercase tracking-wider">Horário</p>
                <p className="text-sm font-bold">{nextGame.time}</p>
              </div>
            </div>
            <div className="flex flex-col items-center text-center gap-2">
              <MapPin className="text-[#38bdf8]" size={28} />
              <div>
                <p className="text-[10px] text-gray-300 uppercase tracking-wider">Local</p>
                <p className="text-sm font-bold leading-tight">{nextGame.location}</p>
                <a
                  href={`https://maps.google.com/?q=${encodeURIComponent(nextGame.location)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[10px] text-[#38bdf8] hover:underline"
                >
                  Ver no Maps
                </a>
              </div>
            </div>
          </div>

          {/* Desktop: horizontal com separadores */}
          <div className="hidden md:flex justify-center items-center gap-16">
            <div className="flex items-center gap-4">
              <Calendar className="text-[#38bdf8]" size={40} />
              <div>
                <p className="text-sm text-gray-300 uppercase">Data</p>
                <p className="text-xl font-bold">{formattedDate}</p>
              </div>
            </div>
            <div className="w-px h-16 bg-white/20"></div>
            <div className="flex items-center gap-4">
              <Clock className="text-[#38bdf8]" size={40} />
              <div>
                <p className="text-sm text-gray-300 uppercase">Horário</p>
                <p className="text-xl font-bold">{nextGame.time}</p>
              </div>
            </div>
            <div className="w-px h-16 bg-white/20"></div>
            <div className="flex items-center gap-4">
              <MapPin className="text-[#38bdf8]" size={40} />
              <div>
                <p className="text-sm text-gray-300 uppercase">Local</p>
                <p className="text-xl font-bold">{nextGame.location}</p>
                <a
                  href={`https://maps.google.com/?q=${encodeURIComponent(nextGame.location)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-[#38bdf8] hover:underline"
                >
                  Ver no Google Maps
                </a>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
