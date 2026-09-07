import { Calendar, MapPin, Clock } from "lucide-react";
import { createClient } from "@/utils/supabase/server";

export async function SectionNextGame() {
  const supabase = await createClient();
  
  // Pegar a data de hoje no formato YYYY-MM-DD para timezone local (simples)
  const today = new Date().toISOString().split("T")[0];
  
  const { data: nextGame } = await supabase
    .from("games")
    .select("*")
    .gte("date", today)
    .order("date", { ascending: true })
    .limit(1)
    .single();

  if (!nextGame) return null;

  const dateObj = new Date(nextGame.date);
  const formattedDate = dateObj.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric', timeZone: 'UTC' });

  return (
    <section className="bg-gradient-to-r from-[#001f3f] to-[#0074D9] py-16 text-white relative overflow-hidden">
      <div className="absolute inset-0 opacity-10 bg-[url('/images/hero2.jpg')] bg-cover bg-center mix-blend-overlay"></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-10">
          <h2 className="text-sm uppercase tracking-[0.3em] font-bold text-gray-300 mb-2">
            Próximo Desafio {nextGame.is_championship && "(Campeonato)"}
          </h2>
          <h3 className="text-4xl md:text-5xl font-extrabold uppercase">
            Mineira Master vs. {nextGame.opponent}
          </h3>
        </div>
        <div className="flex flex-col md:flex-row justify-center items-center gap-8 md:gap-16 bg-white/10 backdrop-blur-md rounded-2xl p-8 shadow-2xl border border-white/20">
          <div className="flex items-center gap-4">
            <Calendar className="text-[#38bdf8]" size={40} />
            <div>
              <p className="text-sm text-gray-300 uppercase">Data</p>
              <p className="text-xl font-bold">{formattedDate}</p>
            </div>
          </div>
          <div className="hidden md:block w-px h-16 bg-white/20"></div>
          <div className="flex items-center gap-4">
            <Clock className="text-[#38bdf8]" size={40} />
            <div>
              <p className="text-sm text-gray-300 uppercase">Horário</p>
              <p className="text-xl font-bold">{nextGame.time}</p>
            </div>
          </div>
          <div className="hidden md:block w-px h-16 bg-white/20"></div>
          <div className="flex items-center gap-4">
            <MapPin className="text-[#38bdf8]" size={40} />
            <div>
              <p className="text-sm text-gray-300 uppercase">Local</p>
              <p className="text-xl font-bold">
                {nextGame.location}
              </p>
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
    </section>
  );
}
