import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SplashScreen } from "@/components/SplashScreen";
import { ScrollToTop } from "@/components/ScrollToTop";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Mineira Master | Futebol e Tradição",
  description:
    "Site oficial do time Mineira Master. Acompanhe nossos jogos, conheça nosso elenco, diretoria e fique por dentro de todas as novidades do nosso clube.",
  keywords: [
    "Mineira Master",
    "Futebol",
    "Time Amador",
    "Futebol Amador",
    "Jogos",
    "Campeonato",
  ],
  authors: [{ name: "Mineira Master" }],
  openGraph: {
    title: "Mineira Master | Futebol e Tradição",
    description:
      "Site oficial do time Mineira Master. Acompanhe nossos jogos, conheça nosso elenco e diretoria.",
    // url: "https://mineiramaster.com.br", // Troque pelo domínio real depois
    siteName: "Mineira Master",
    locale: "pt_BR",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="pt-BR"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased scroll-smooth`}
      data-scroll-behavior="smooth"
    >
      <body className="min-h-full flex flex-col">
        <SplashScreen />
        {children}
        <ScrollToTop />
      </body>
    </html>
  );
}
