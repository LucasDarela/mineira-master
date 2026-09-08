import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { SectionNextGame } from "@/components/SectionNextGame";
import { SectionAgenda } from "@/components/SectionAgenda";
import { SectionElenco } from "@/components/SectionElenco";
import { SectionDiretoria } from "@/components/SectionDiretoria";
import { SectionComissao } from "@/components/SectionComissao";
import { SectionHistory } from "@/components/SectionHistory";
import { SectionSponsors } from "@/components/SectionSponsors";
import { SectionSponsorsCarousel } from "@/components/SectionSponsorsCarousel";
import { SectionInstagram } from "@/components/SectionInstagram";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-white selection:bg-[#0074D9] selection:text-white">
      <Navbar />
      <Hero />
      <SectionNextGame />
      <SectionSponsorsCarousel />
      <SectionAgenda />
      <SectionElenco />
      <SectionDiretoria />
      <SectionComissao />
      <SectionHistory />
      <SectionInstagram />
      <Footer />
    </main>
  );
}
