import { createClient } from "@/utils/supabase/server";
import { User } from "lucide-react";
import Image from "next/image";

export async function SectionComissao() {
  const supabase = await createClient();
  const { data: staff } = await supabase.from("staff").select("*").order("created_at", { ascending: true });

  // Fallback caso não haja comissão cadastrada
  const displayStaff = staff && staff.length > 0 ? staff : [
    { id: "1", name: "João", role: "Treinador", image: null },
    { id: "2", name: "Pedro", role: "Auxiliar Técnico", image: null },
  ];

  return (
    <section id="comissao" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-extrabold text-[#001f3f] uppercase tracking-tight">Comissão Técnica</h2>
          <div className="w-24 h-1 bg-green-600 mx-auto mt-4"></div>
        </div>
        
        <div className="flex flex-wrap justify-center gap-8">
          {displayStaff.map((member) => (
            <div key={member.id} className="w-full sm:w-[calc(50%-2rem)] lg:w-[calc(25%-2rem)] min-w-[280px] max-w-[320px] bg-gray-50 p-8 rounded-xl shadow-md text-center border-t-4 border-green-600 hover:shadow-xl transition-shadow flex flex-col items-center">
              
              {/* Foto do Membro da Comissão */}
              <div className="w-24 h-24 relative rounded-full overflow-hidden mb-6 border-4 border-gray-100 shadow-sm">
                {member.image ? (
                  <Image src={member.image} alt={member.name} fill className="object-cover" sizes="96px" />
                ) : (
                  <div className="w-full h-full bg-green-900/10 flex items-center justify-center">
                    <User size={40} className="text-green-800" />
                  </div>
                )}
              </div>
              
              <h3 className="text-xl font-bold text-[#001f3f] mb-2">{member.name}</h3>
              <p className="text-green-600 font-medium uppercase text-sm tracking-wide">{member.role}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
