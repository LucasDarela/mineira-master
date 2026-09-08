import { createClient } from "@/utils/supabase/server";
import Image from "next/image";

export async function SectionSponsors() {
  const supabase = await createClient();
  const { data: sponsors } = await supabase.from("sponsors").select("*").order("created_at", { ascending: true });

  const displaySponsors = sponsors && sponsors.length > 0 ? sponsors : [
    { id: "1", name: "Patrocinador 1", image: null },
    { id: "2", name: "Patrocinador 2", image: null },
    { id: "3", name: "Patrocinador 3", image: null },
    { id: "4", name: "Patrocinador 4", image: null },
  ];

  return (
    <section id="patrocinadores" className="py-10 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-2xl font-bold text-gray-400 uppercase tracking-widest mb-10">
          Nossos Patrocinadores
        </h2>
        <div className="flex flex-wrap justify-center items-center gap-12 md:gap-24 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
          {displaySponsors.map((sponsor) => {
            const Wrapper = sponsor.url ? "a" : "div";
            return (
              <Wrapper
                key={sponsor.id}
                href={sponsor.url || undefined}
                target={sponsor.url ? "_blank" : undefined}
                rel={sponsor.url ? "noopener noreferrer" : undefined}
                className="relative transition-colors cursor-pointer flex flex-col items-center justify-center w-32 md:w-48 h-20 md:h-28"
              >
                {sponsor.image ? (
                  <Image 
                    src={sponsor.image} 
                    alt={sponsor.name} 
                    fill 
                    className="object-contain" 
                    sizes="(max-width: 768px) 128px, 192px" 
                  />
                ) : (
                  <div className="text-2xl md:text-3xl font-black text-[#001f3f] tracking-tighter hover:text-[#0074D9]">
                    {sponsor.name.toUpperCase()}
                  </div>
                )}
              </Wrapper>
            );
          })}
        </div>
      </div>
    </section>
  );
}
