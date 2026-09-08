"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu, X, ChevronDown, MapPin } from "lucide-react";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [expandedMenu, setExpandedMenu] = useState<string | null>(null);

  const navItems = [
    { href: "/", label: "Início" },
    {
      label: "Agenda",
      subItems: [
        { href: "/#agenda", label: "Jogos" },
        { href: "/campeonato", label: "Campeonato" },
      ],
    },
    {
      label: "Elenco",
      subItems: [
        { href: "/#elenco", label: "Jogadores" },
        { href: "/#diretoria", label: "Diretoria" },
        { href: "/#comissao", label: "Comissão Técnica" },
      ],
    },
    { href: "/#historia", label: "História" },
    { href: "/#redes-sociais", label: "Instagram" },
    { href: "/contato", label: "Contato" },
  ];

  const toggleSubmenu = (label: string) => {
    if (expandedMenu === label) {
      setExpandedMenu(null);
    } else {
      setExpandedMenu(label);
    }
  };

  return (
    <nav className="fixed w-full z-50 bg-white/95 backdrop-blur-md shadow-lg transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center gap-3">
              <Image
                src="/mineira-logo.png"
                alt="Mineira Master"
                width={80}
                height={80}
                className="h-16 w-auto"
                loading="eager"
                priority
              />
              <span className="font-extrabold text-[#001f3f] text-lg uppercase tracking-tight">
                Mineira Master
              </span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden xl:block">
            <div className="ml-6 flex items-center space-x-1">
              {navItems.map((item) => (
                <div key={item.label} className="relative group">
                  {item.subItems ? (
                    <button className="flex items-center text-[#001f3f] hover:text-[#0074D9] transition-colors px-2 py-2 rounded-md text-xs font-semibold tracking-wide uppercase whitespace-nowrap">
                      {item.label}
                      <ChevronDown
                        size={16}
                        className="ml-1 group-hover:rotate-180 transition-transform duration-300"
                      />
                    </button>
                  ) : (
                    <Link
                      href={item.href!}
                      className="flex items-center text-[#001f3f] hover:text-[#0074D9] transition-colors px-2 py-2 rounded-md text-xs font-semibold tracking-wide uppercase whitespace-nowrap"
                    >
                      {item.label}
                    </Link>
                  )}

                  {/* Dropdown Desktop */}
                  {item.subItems && (
                    <div className="absolute left-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform origin-top-left group-hover:translate-y-0 translate-y-2">
                      <div className="py-1">
                        {item.subItems.map((subItem) => (
                          <Link
                            key={subItem.label}
                            href={subItem.href}
                            className="block px-4 py-2 text-sm text-[#001f3f] hover:bg-gray-100 hover:text-[#0074D9] font-medium"
                          >
                            {subItem.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}

              <div className="pl-4 border-l border-gray-200">
                <a
                  href="https://maps.app.goo.gl/A598vQoi2L2KxV8s8"
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Localização do Campo"
                  className="flex items-center text-red-500 hover:text-red-700 transition-colors p-2 rounded-full hover:bg-red-50"
                >
                  <MapPin size={24} />
                </a>
              </div>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="-mr-2 flex xl:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-[#001f3f] hover:text-[#0074D9] hover:bg-gray-100 focus:outline-none"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="xl:hidden bg-white absolute w-full left-0 border-t border-gray-200 shadow-xl max-h-screen overflow-y-auto z-50">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navItems.map((item) => (
              <div key={item.label}>
                {item.subItems ? (
                  <>
                    <button
                      onClick={() => toggleSubmenu(item.label)}
                      className="w-full flex justify-between items-center text-[#001f3f] hover:text-[#0074D9] hover:bg-gray-50 px-3 py-3 rounded-md text-base font-semibold uppercase"
                    >
                      {item.label}
                      <ChevronDown
                        size={20}
                        className={`transition-transform duration-300 ${
                          expandedMenu === item.label
                            ? "rotate-180 text-[#0074D9]"
                            : ""
                        }`}
                      />
                    </button>
                    {/* Submenu Mobile */}
                    {expandedMenu === item.label && (
                      <div className="pl-6 bg-gray-50 rounded-md py-2 space-y-1 mt-1">
                        {item.subItems.map((subItem) => (
                          <Link
                            key={subItem.label}
                            href={subItem.href}
                            onClick={() => setIsOpen(false)}
                            className="block px-3 py-2 text-sm font-medium text-gray-700 hover:text-[#0074D9] hover:bg-white rounded-md"
                          >
                            - {subItem.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <Link
                    href={item.href!}
                    onClick={() => setIsOpen(false)}
                    className="block text-[#001f3f] hover:text-[#0074D9] hover:bg-gray-50 px-3 py-3 rounded-md text-base font-semibold uppercase"
                  >
                    {item.label}
                  </Link>
                )}
              </div>
            ))}

            {/* Map Link Mobile */}
            <a
              href="https://maps.app.goo.gl/A598vQoi2L2KxV8s8"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-red-600 hover:bg-gray-50 px-3 py-3 rounded-md text-base font-bold uppercase"
            >
              <MapPin size={20} />
              Campo do Mineira
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}
