"use client";

import React from "react";
import { useRouter } from "next/navigation";

export function AgendaRow({
  game,
  index,
  dateStr,
}: {
  game: any;
  index: number;
  dateStr: string;
}) {
  const router = useRouter();

  const todayIso = new Date().toISOString().split("T")[0];
  const isFinished = game.date < todayIso;

  return (
    <tr
      onClick={() => router.push(`/jogos/${game.id}`)}
      className={`border-t border-gray-100 hover:bg-[#e6f2ff] transition-colors cursor-pointer ${
        index % 2 === 0 ? "bg-gray-50" : "bg-white"
      }`}
    >
      <td className="py-4 px-6 font-medium text-[#001f3f]">{dateStr}</td>
      <td className="py-4 px-6 text-gray-600 font-medium">{game.time}</td>
      <td className="py-4 px-6">
        <div
          className="grid items-center gap-3"
          style={{ gridTemplateColumns: "1fr auto 1fr" }}
        >
          {/* Coluna esquerda: mandante */}
          <span
            className={`font-bold text-right whitespace-nowrap overflow-hidden text-ellipsis ${game.home_or_away === "Fora" ? "text-gray-700" : "text-[#0074D9]"}`}
          >
            {game.home_or_away === "Fora" ? game.opponent : "Mineira Master"}
          </span>

          {/* Placar: sempre centralizado */}
          <span className="bg-gray-100 px-4 py-1 rounded font-bold text-[#001f3f] whitespace-nowrap text-center w-20">
            {game.home_or_away === "Fora"
              ? `${game.opponent_goals || 0} x ${(game.goals_players || []).length}`
              : `${(game.goals_players || []).length} x ${game.opponent_goals || 0}`}
          </span>

          {/* Coluna direita: visitante */}
          <span
            className={`font-bold text-left whitespace-nowrap overflow-hidden text-ellipsis ${game.home_or_away === "Fora" ? "text-[#0074D9]" : "text-gray-700"}`}
          >
            {game.home_or_away === "Fora" ? "Mineira Master" : game.opponent}
          </span>
        </div>
      </td>
      <td className="py-4 px-6 text-gray-600 truncate max-w-[200px]">
        {game.location}
      </td>
      <td className="py-4 px-6">
        <div className="flex flex-col gap-1">
          {/* Status: Finalizado / Em Breve */}
          {isFinished ? (
            <span className="text-[10px] text-gray-400 uppercase tracking-widest font-semibold">
              Finalizado
            </span>
          ) : (
            <span className="text-[10px] text-[#0074D9] uppercase tracking-widest font-semibold">
              Em Breve
            </span>
          )}
          {/* Badge V/E/D */}
          <div className="flex items-center gap-2 whitespace-nowrap">
          {!game.outcome && !game.result && (
            <span className="text-gray-400 font-bold">-</span>
          )}
          {game.outcome === "V" && (
            <span className="bg-green-100 text-green-700 font-bold px-2 py-0.5 rounded text-sm">
              V
            </span>
          )}
          {game.outcome === "E" && (
            <span className="bg-yellow-100 text-yellow-700 font-bold px-2 py-0.5 rounded text-sm">
              E
            </span>
          )}
          {game.outcome === "D" && (
            <span className="bg-red-100 text-red-700 font-bold px-2 py-0.5 rounded text-sm">
              D
            </span>
          )}
          {/* Cartões depois */}
          {game.yellow_cards_count > 0 && (
            <div className="flex gap-0.5">
              {Array.from({ length: game.yellow_cards_count }).map((_, i) => (
                <div
                  key={`y-${i}`}
                  className="w-2 h-3 bg-yellow-400 rounded-sm"
                ></div>
              ))}
            </div>
          )}
          {game.red_cards_count > 0 && (
            <div className="flex gap-0.5">
              {Array.from({ length: game.red_cards_count }).map((_, i) => (
                <div
                  key={`r-${i}`}
                  className="w-2 h-3 bg-red-600 rounded-sm"
                ></div>
              ))}
            </div>
          )}
          </div>
        </div>
      </td>
    </tr>
  );
}
