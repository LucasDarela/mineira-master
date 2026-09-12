"use client";
import { useRouter } from "next/navigation";

export function AgendaCard({ game, index, dateStr, isNextGame }: { game: any, index: number, dateStr: string, isNextGame?: boolean }) {
  const router = useRouter();
  
  const mineiraGoals = (game.goals_players || []).length;
  const opponentGoals = game.opponent_goals || 0;

  const todayIso = new Date().toISOString().split('T')[0];
  const isFinished = game.date < todayIso;

  const homeTeam = game.home_or_away === 'Fora' ? game.opponent : 'Mineira Master';
  const awayTeam = game.home_or_away === 'Fora' ? 'Mineira Master' : game.opponent;
  const homeGoals = game.home_or_away === 'Fora' ? opponentGoals : mineiraGoals;
  const awayGoals = game.home_or_away === 'Fora' ? mineiraGoals : opponentGoals;
  const homeColor = game.home_or_away === 'Fora' ? 'text-gray-800' : 'text-[#0074D9]';
  const awayColor = game.home_or_away === 'Fora' ? 'text-[#0074D9]' : 'text-gray-800';

  return (
    <div 
      onClick={() => router.push(`/jogos/${game.id}`)}
      className={`bg-white border rounded-lg shadow-sm cursor-pointer transition-colors overflow-hidden ${
        isNextGame 
          ? "border-yellow-400 border-2 shadow-md bg-yellow-50/50" 
          : "border-gray-200 hover:border-[#0074D9]"
      }`}
    >
      {/* Header: Data | Hora — Local */}
      <div className="bg-gray-50 border-b border-gray-200 px-4 py-2 flex justify-between items-center text-xs text-gray-500 font-semibold uppercase tracking-wider">
        <div className="flex gap-2">
          <span>{dateStr}</span>
          <span className="text-gray-300">|</span>
          <span>{game.time}</span>
        </div>
        <span className="truncate text-right ml-4 text-gray-600 max-w-[140px]">{game.location}</span>
      </div>

      {/* Partida: grid 1fr auto 1fr — placar sempre no centro */}
      <div className="px-4 py-4 grid items-center gap-3" style={{ gridTemplateColumns: '1fr auto 1fr' }}>
        <span className={`font-bold text-right text-base leading-tight ${homeColor}`}>
          {homeTeam}
        </span>

        <div className="flex flex-col items-center shrink-0">
          <span className="bg-gray-100 px-4 py-1 rounded font-bold text-[#001f3f] text-base whitespace-nowrap w-20 text-center">
            {homeGoals} x {awayGoals}
          </span>
          {isFinished ? (
            <span className="text-[10px] text-gray-400 uppercase tracking-widest mt-1 font-semibold">
              Finalizado
            </span>
          ) : isNextGame ? (
            <span className="text-[10px] text-yellow-600 uppercase tracking-widest mt-1 font-bold flex items-center gap-1.5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-500 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-yellow-500"></span>
              </span>
              Próximo Jogo
            </span>
          ) : (
            <span className="text-[10px] text-[#0074D9] uppercase tracking-widest mt-1 font-semibold">
              Em Breve
            </span>
          )}
        </div>

        <span className={`font-bold text-left text-base leading-tight ${awayColor}`}>
          {awayTeam}
        </span>
      </div>

      {/* Footer: Desfecho e Cartões */}
      <div className="border-t border-gray-100 px-4 py-2 flex justify-between items-center text-xs uppercase tracking-wider font-semibold">
        <span className="text-gray-400">
          {game.is_championship ? '🏆 Campeonato' : '⚽ Amistoso'}
        </span>
        <div className="flex items-center gap-2">
          {game.outcome === 'V' && <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded">V</span>}
          {game.outcome === 'E' && <span className="bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded">E</span>}
          {game.outcome === 'D' && <span className="bg-red-100 text-red-700 px-2 py-0.5 rounded">D</span>}
          {!game.outcome && <span className="text-gray-400">-</span>}
          {game.yellow_cards_count > 0 && (
            <div className="flex gap-0.5">
              {Array.from({ length: game.yellow_cards_count }).map((_, i) => (
                <div key={`y-${i}`} className="w-2 h-3 bg-yellow-400 rounded-sm" />
              ))}
            </div>
          )}
          {game.red_cards_count > 0 && (
            <div className="flex gap-0.5">
              {Array.from({ length: game.red_cards_count }).map((_, i) => (
                <div key={`r-${i}`} className="w-2 h-3 bg-red-600 rounded-sm" />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
