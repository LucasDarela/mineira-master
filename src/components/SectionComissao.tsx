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
    <section id="comissao" className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 className="text-4xl font-extrabold text-[#001f3f] uppercase tracking-tight">Comissão Técnica</h2>
          <div className="w-24 h-1 bg-green-600 mx-auto mt-4"></div>
        </div>
        
        <div className="flex flex-wrap justify-center gap-4 sm:gap-6">
          {displayStaff.map((member) => (
            <div key={member.id} className="w-[calc(50%-0.5rem)] sm:w-52 lg:w-56 bg-gray-50 px-4 py-5 sm:p-8 rounded-xl shadow-md text-center border-t-4 border-green-600 hover:shadow-xl transition-shadow flex flex-col items-center">
              
              {/* Foto do Membro da Comissão */}
              <div className="w-14 h-14 sm:w-24 sm:h-24 relative rounded-full overflow-hidden mb-3 sm:mb-6 border-4 border-gray-100 shadow-sm">
                {member.image ? (
                  <Image src={member.image} alt={member.name} fill className="object-cover" sizes="96px" />
                ) : (
                  <div className="w-full h-full bg-green-900/10 flex items-center justify-center">
                    <User size={24} className="sm:hidden text-green-800" />
                    <User size={40} className="hidden sm:block text-green-800" />
                  </div>
                )}
              </div>
              
              <h3 className="text-sm sm:text-xl font-bold text-[#001f3f] mb-1 sm:mb-2 leading-tight">{member.name}</h3>
              <p className="text-green-600 font-medium uppercase text-[10px] sm:text-sm tracking-wide">{member.role}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
