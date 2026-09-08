import { createClient } from "@/utils/supabase/server";
import Image from "next/image";

export async function SectionSponsorsCarousel() {
  const supabase = await createClient();
  const { data: sponsors } = await supabase
    .from("sponsors")
    .select("*")
    .order("created_at", { ascending: true });

  // Se não houver patrocinadores cadastrados, não exibe a seção
  if (!sponsors || sponsors.length === 0) return null;

  // Duplica a lista para o loop infinito do scroll
  const items = [...sponsors, ...sponsors, ...sponsors];

  return (
    <section className="py-10 bg-white border-y border-gray-100 overflow-hidden">
      {/* Trilho com scroll infinito */}
      <div className="relative w-full overflow-hidden">
        {/* Fade nas laterais */}
        <div className="absolute left-0 top-0 h-full w-16 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 h-full w-16 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

        <div className="flex animate-scroll w-max gap-12 items-center px-8">
          {items.map((sponsor, i) => {
            const inner = sponsor.image ? (
              <div className="relative w-32 h-16 grayscale hover:grayscale-0 transition-all duration-300 opacity-60 hover:opacity-100">
                <Image
                  src={sponsor.image}
                  alt={sponsor.name}
                  fill
                  className="object-contain"
                  sizes="128px"
                />
              </div>
            ) : (
              <div className="text-xl font-black text-gray-400 hover:text-[#0074D9] uppercase tracking-tight transition-colors whitespace-nowrap opacity-60 hover:opacity-100">
                {sponsor.name}
              </div>
            );

            return sponsor.url ? (
              <a
                key={`${sponsor.id}-${i}`}
                href={sponsor.url}
                target="_blank"
                rel="noopener noreferrer"
                title={sponsor.name}
                className="flex-shrink-0"
              >
                {inner}
              </a>
            ) : (
              <div key={`${sponsor.id}-${i}`} className="flex-shrink-0">
                {inner}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
