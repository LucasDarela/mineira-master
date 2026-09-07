import { Link as LinkIcon, Mail, MapPin, Phone } from "lucide-react";
import Image from "next/image";

export function Footer() {
  return (
    <footer
      id="contato"
      className="bg-[#111111] text-gray-400 py-16 border-t-[10px] border-[#0074D9]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1 md:col-span-1">
            <Image
              src="/mineira-logo.jpeg"
              alt="Mineira Master"
              width={120}
              height={120}
              className="mb-6 opacity-90"
            />
            <p className="text-sm">
              Time de futebol Master (50+) da cidade de Criciúma. Tradição,
              garra e muita experiência em campo.
            </p>
          </div>

          <div>
            <h4 className="text-white font-bold uppercase tracking-wider mb-6">
              Links Rápidos
            </h4>
            <ul className="space-y-3">
              <li>
                <a
                  href="#agenda"
                  className="hover:text-[#38bdf8] transition-colors"
                >
                  Agenda
                </a>
              </li>
              <li>
                <a
                  href="#elenco"
                  className="hover:text-[#38bdf8] transition-colors"
                >
                  Elenco
                </a>
              </li>
              <li>
                <a
                  href="#historia"
                  className="hover:text-[#38bdf8] transition-colors"
                >
                  História
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold uppercase tracking-wider mb-6">
              Contato
            </h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="text-[#38bdf8] shrink-0" size={20} />
                <span>Criciúma, SC, Brasil</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="text-[#38bdf8] shrink-0" size={20} />
                <span>(48) 99610-3002</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="text-[#38bdf8] shrink-0" size={20} />
                <span>contato@mineiramaster.com.br</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold uppercase tracking-wider mb-6">
              Redes Sociais
            </h4>
            <div className="flex gap-4">
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-[#38bdf8] hover:text-white transition-all"
              >
                <LinkIcon size={20} />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-[#38bdf8] hover:text-white transition-all"
              >
                <LinkIcon size={20} />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-[#38bdf8] hover:text-white transition-all"
              >
                <LinkIcon size={20} />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center text-sm">
          <p>&copy; 2026 Mineira Master. Todos os direitos reservados.</p>
          <p className="mt-2 md:mt-0">Desenvolvido por Loading Tecnology.</p>
        </div>
      </div>
    </footer>
  );
}
