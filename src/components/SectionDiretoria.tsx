import { createClient } from "@/utils/supabase/server";
import { User } from "lucide-react";
import Image from "next/image";

export async function SectionDiretoria() {
  const supabase = await createClient();
  const { data: board } = await supabase.from("directors").select("*").order("created_at", { ascending: true });

  // Fallback caso não haja diretoria cadastrada
  const displayBoard = board && board.length > 0 ? board : [
    { id: "1", name: "Jair Lenz", role: "Presidente", image: null },
    { id: "2", name: "Carlos Oliveira", role: "Vice-Presidente", image: null },
  ];

  return (
    <section id="diretoria" className="py-24 bg-[#f8f9fa]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-extrabold text-[#001f3f] uppercase tracking-tight">Diretoria</h2>
          <div className="w-24 h-1 bg-[#0074D9] mx-auto mt-4"></div>
        </div>
        <div className="flex flex-wrap justify-center gap-8">
          {displayBoard.map((member) => (
            <div key={member.id} className="w-full sm:w-[calc(50%-2rem)] lg:w-[calc(25%-2rem)] min-w-[280px] max-w-[320px] bg-white p-8 rounded-xl shadow-md text-center border-t-4 border-[#0074D9] hover:shadow-xl transition-shadow flex flex-col items-center">
              
              {/* Foto do Diretor */}
              <div className="w-24 h-24 relative rounded-full overflow-hidden mb-6 border-4 border-gray-100 shadow-sm">
                {member.image ? (
                  <Image src={member.image} alt={member.name} fill className="object-cover" sizes="96px" />
                ) : (
                  <div className="w-full h-full bg-[#001f3f]/10 flex items-center justify-center">
                    <User size={40} className="text-[#001f3f]" />
                  </div>
                )}
              </div>
              
              <h3 className="text-xl font-bold text-[#001f3f] mb-2">{member.name}</h3>
              <p className="text-gray-600 font-medium uppercase text-sm tracking-wide">{member.role}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
