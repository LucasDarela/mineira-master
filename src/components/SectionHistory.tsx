export function SectionHistory() {
  return (
    <section id="historia" className="py-12 bg-[#001f3f] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-4xl font-extrabold uppercase tracking-tight mb-6">
              Nossa História
            </h2>
            <div className="w-24 h-1 bg-[#0074D9] mb-8"></div>
            <div className="space-y-6 text-gray-300 text-lg leading-relaxed">
              <p>
                O <strong className="text-white">Mineira Master</strong> foi
                fundado em{" "}
                <strong className="text-[#38bdf8]">Janeiro de 2026</strong> na
                cidade de Criciúma. Nascido da paixão de veteranos que dedicaram
                suas vidas aos campos de várzea e profissionais da região.
              </p>
              <p>
                Nossa missão é provar que o futebol não tem idade. Com jogadores
                acima de 50 anos, levamos a campo a técnica refinada que apenas
                décadas de experiência podem proporcionar.
              </p>
              <p>
                As cores azul escuro, azul claro, preto e branco representam a
                garra, a tradição e o futuro que ainda temos a construir nos
                gramados do sul de Santa Catarina.
              </p>
            </div>
          </div>
          <div className="relative h-96 rounded-2xl overflow-hidden shadow-2xl border-4 border-white/10">
            <div className="absolute inset-0 bg-[url('/images/hero1.webp')] bg-cover bg-center"></div>
          </div>
        </div>
      </div>
    </section>
  );
}
