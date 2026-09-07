"use client";
import React, { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function Hero() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const [selectedIndex, setSelectedIndex] = useState(0);

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
  }, [emblaApi, onSelect]);

  const slides = [
    {
      src: "/images/hero1.jpg",
      alt: "Lances do jogo do Mineira Master",
      title: "Garra e Experiência",
      subtitle: "Futebol arte em Criciúma",
    },
    {
      src: "/images/hero2.jpg",
      alt: "Estádio iluminado",
      title: "Paixão que Não Envelhece",
      subtitle: "Mineira Master 50+",
    },
  ];

  return (
    <div className="relative w-full h-screen overflow-hidden bg-[#001f3f]">
      <div className="absolute inset-0 z-0 h-full w-full" ref={emblaRef}>
        <div className="flex h-full w-full touch-pan-y">
          {slides.map((slide, index) => (
            <div
              key={index}
              className="relative min-w-full h-full flex-[0_0_100%]"
            >
              <Image
                src={slide.src}
                alt={slide.alt}
                fill
                sizes="100vw"
                className="object-cover opacity-60"
                priority={index === 0}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#001f3f] via-transparent to-transparent opacity-80" />
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
                <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-4 drop-shadow-lg tracking-tight uppercase">
                  {slide.title}
                </h1>
                <p className="text-xl md:text-3xl text-gray-200 font-medium drop-shadow-md">
                  {slide.subtitle}
                </p>
                <div className="mt-8">
                  <a
                    href="#agenda"
                    className="inline-block bg-[#0074D9] hover:bg-[#38bdf8] text-white font-bold py-3 px-8 rounded-full transition-all transform hover:scale-105 shadow-xl uppercase tracking-widest text-sm"
                  >
                    Próximo Jogo
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Controls */}
      <button
        onClick={scrollPrev}
        className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-black/30 hover:bg-[#0074D9]/80 rounded-full text-white backdrop-blur-sm transition-all"
      >
        <ChevronLeft size={32} />
      </button>
      <button
        onClick={scrollNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-black/30 hover:bg-[#0074D9]/80 rounded-full text-white backdrop-blur-sm transition-all"
      >
        <ChevronRight size={32} />
      </button>
      
      {/* Indicators */}
      <div className="absolute bottom-8 left-0 right-0 flex justify-center space-x-3 z-10">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => emblaApi?.scrollTo(idx)}
            className={`w-3 h-3 rounded-full transition-all ${
              idx === selectedIndex ? "bg-[#0074D9] w-8" : "bg-white/50 hover:bg-white"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
