import { Mail, MapPin, Phone } from "lucide-react";
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
              <li className="flex items-center gap-3">
                <MapPin className="text-[#0074D9]" size={24} />
                <a
                  href="https://maps.app.goo.gl/A598vQoi2L2KxV8s8"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Cidade Mineira, Criciúma - SC
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="text-[#0074D9]" size={24} />
                <a
                  href="https://wa.me/5548996103002"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  (48) 99610-3002
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="text-[#0074D9]" size={24} />
                <a
                  href="mailto:contato@mineiramaster.com.br"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  contato@mineiramaster.com.br
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold uppercase tracking-wider mb-6">
              Redes Sociais
            </h4>
            <div className="flex gap-4">
              <a
                href="https://www.instagram.com/mineiramaster/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-[#0074D9] hover:text-white transition-all text-gray-400"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center text-sm">
          <p>&copy; 2026 Mineira Master. Todos os direitos reservados.</p>
          <p className="mt-2 md:mt-0">
            Desenvolvido por{" "}
            <a
              href="https://loadingtechnology.com.br"
              target="_blank"
              rel="noopener noreferrer"
              className=" hover:text-[#0074D9] transition-colors"
            >
              Loading Technology
            </a>
            .
          </p>
        </div>
      </div>
    </footer>
  );
}
