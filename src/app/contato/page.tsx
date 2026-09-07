"use client";
import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Mail, MapPin, Phone, Send } from "lucide-react";

export default function Contato() {
  const [enviado, setEnviado] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Aqui seria a integração real com o backend ou serviço de e-mail (ex: EmailJS, Resend)
    setEnviado(true);
    setTimeout(() => setEnviado(false), 5000);
  };

  return (
    <main className="min-h-screen bg-white">
      <Navbar />

      <div className="pt-28 pb-16 bg-[#001f3f] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold uppercase tracking-tight mb-4">
            Fale Conosco
          </h1>
          <p className="text-xl text-gray-300">
            Entre em contato para jogos, parcerias ou dúvidas.
          </p>
        </div>
      </div>

      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Informações de Contato */}
            <div>
              <h2 className="text-3xl font-bold text-[#001f3f] uppercase mb-8 border-l-4 border-[#0074D9] pl-4">
                Nossos Contatos
              </h2>
              <p className="text-gray-600 mb-8 text-lg">
                Tem interesse em marcar um amistoso com o Mineira Master ou se
                tornar um patrocinador? Utilize os canais abaixo ou preencha o
                formulário e responderemos em breve!
              </p>

              <div className="space-y-6">
                <div className="flex items-center gap-4 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                  <div className="w-14 h-14 bg-[#0074D9]/10 rounded-full flex items-center justify-center shrink-0">
                    <MapPin className="text-[#0074D9]" size={28} />
                  </div>
                  <div>
                    <h4 className="font-bold text-[#001f3f]">Endereço</h4>
                    <p className="text-gray-600">
                      Criciúma, Santa Catarina, Brasil
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                  <div className="w-14 h-14 bg-[#0074D9]/10 rounded-full flex items-center justify-center shrink-0">
                    <Phone className="text-[#0074D9]" size={28} />
                  </div>
                  <div>
                    <h4 className="font-bold text-[#001f3f]">
                      Telefone / WhatsApp
                    </h4>
                    <p className="text-gray-600">(48) 99610-3002</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                  <div className="w-14 h-14 bg-[#0074D9]/10 rounded-full flex items-center justify-center shrink-0">
                    <Mail className="text-[#0074D9]" size={28} />
                  </div>
                  <div>
                    <h4 className="font-bold text-[#001f3f]">E-mail</h4>
                    <p className="text-gray-600">
                      contato@mineiramaster.com.br
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Formulário de Contato */}
            <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
              <h3 className="text-2xl font-bold text-[#001f3f] mb-6">
                Envie uma mensagem
              </h3>

              {enviado ? (
                <div className="bg-green-50 border border-green-200 text-green-700 px-6 py-8 rounded-xl text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Send size={32} className="text-green-600" />
                  </div>
                  <h4 className="text-xl font-bold mb-2">Mensagem Enviada!</h4>
                  <p>
                    Obrigado pelo contato. Retornaremos o mais breve possível.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label
                      htmlFor="nome"
                      className="block text-sm font-semibold text-gray-700 mb-1"
                    >
                      Nome Completo
                    </label>
                    <input
                      type="text"
                      id="nome"
                      required
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#0074D9] focus:border-transparent transition-all outline-none"
                      placeholder="Seu nome"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-semibold text-gray-700 mb-1"
                    >
                      E-mail
                    </label>
                    <input
                      type="email"
                      id="email"
                      required
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#0074D9] focus:border-transparent transition-all outline-none"
                      placeholder="seu@email.com"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="assunto"
                      className="block text-sm font-semibold text-gray-700 mb-1"
                    >
                      Assunto
                    </label>
                    <input
                      type="text"
                      id="assunto"
                      required
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#0074D9] focus:border-transparent transition-all outline-none"
                      placeholder="Amistoso, Patrocínio, etc."
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="mensagem"
                      className="block text-sm font-semibold text-gray-700 mb-1"
                    >
                      Mensagem
                    </label>
                    <textarea
                      id="mensagem"
                      rows={4}
                      required
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#0074D9] focus:border-transparent transition-all outline-none resize-none"
                      placeholder="Escreva sua mensagem aqui..."
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-[#001f3f] hover:bg-[#0074D9] text-white font-bold py-4 px-8 rounded-lg transition-colors flex items-center justify-center gap-2 uppercase tracking-wide"
                  >
                    <Send size={20} />
                    Enviar Mensagem
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
