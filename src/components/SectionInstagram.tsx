export function SectionInstagram() {
  return (
    <section id="redes-sociais" className="py-10 bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold text-[#001f3f] mb-4 uppercase flex items-center justify-center gap-3">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-pink-600">
              <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
              <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
            </svg>
            Nosso Instagram
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Acompanhe nossos lances, bastidores, comemorações e o dia a dia do time.
          </p>
        </div>

        {/* Widget Elfsight */}
        <div>
          <script src="https://elfsightcdn.com/platform.js" async></script>
          <div className="elfsight-app-a007507c-a9a9-424b-aeaa-2e6916ad09aa" data-elfsight-app-lazy></div>
        </div>

        <div className="text-center mt-12">
          <a
            href="https://www.instagram.com/mineiramaster/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 text-white px-8 py-3 rounded-full font-bold shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
              <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
            </svg>
            Ver mais no Instagram
          </a>
        </div>
      </div>
    </section>
  );
}
