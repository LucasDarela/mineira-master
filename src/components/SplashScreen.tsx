"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import soccerAnimation from "../../public/soccer-ball.json";

const Player = dynamic(
  () => import("@lottiefiles/react-lottie-player").then((mod) => mod.Player),
  { ssr: false }
);

export function SplashScreen() {
  const [show, setShow] = useState(true);
  const [fade, setFade] = useState(false);

  useEffect(() => {
    // Evita scroll enquanto carrega
    document.body.style.overflow = "hidden";

    // Inicia o fade out após 1.5 segundos
    const fadeTimer = setTimeout(() => {
      setFade(true);
      document.body.style.overflow = "unset";
    }, 1500);

    // Remove do DOM após 2 segundos
    const removeTimer = setTimeout(() => {
      setShow(false);
    }, 2000);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(removeTimer);
      document.body.style.overflow = "unset";
    };
  }, []);

  if (!show) return null;

  return (
    <div 
      className={`fixed inset-0 z-[9999] bg-white flex flex-col items-center justify-center transition-opacity duration-500 ${fade ? 'opacity-0' : 'opacity-100'}`}
    >
      <div className="w-40 h-40 md:w-56 md:h-56 relative drop-shadow-xl">
        <Player 
          autoplay
          loop
          src={soccerAnimation}
          style={{ width: '100%', height: '100%' }}
        />
      </div>
    </div>
  );
}
