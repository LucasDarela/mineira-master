"use client";
import { useState, useEffect } from "react";
import { Search, X } from "lucide-react";

type Player = { id: string; name: string };

function AutocompleteInput({
  label,
  players,
  value,
  onChange,
}: {
  label: string;
  players: Player[];
  value: string;
  onChange: (id: string) => void;
}) {
  const [search, setSearch] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const selectedPlayer = players.find((p) => p.id === value);
  const displayValue = selectedPlayer ? selectedPlayer.name : search;

  const filteredPlayers = players.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="relative">
      <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
        {label}
      </label>
      <div className="relative">
        <input
          type="text"
          value={displayValue}
          onChange={(e) => {
            setSearch(e.target.value);
            setIsOpen(true);
            onChange(""); // clear selection if typing
          }}
          onFocus={() => setIsOpen(true)}
          onBlur={() => setTimeout(() => setIsOpen(false), 200)}
          className="w-full p-2 pl-8 border rounded text-sm bg-white"
          placeholder="Buscar jogador..."
        />
        <Search className="absolute left-2 top-2.5 text-gray-400" size={16} />
        {selectedPlayer && (
          <button
            type="button"
            onClick={() => {
              onChange("");
              setSearch("");
            }}
            className="absolute right-2 top-2.5 text-red-400 hover:text-red-600"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {isOpen && !selectedPlayer && filteredPlayers.length > 0 && (
        <ul className="absolute z-10 w-full mt-1 bg-white border rounded shadow-lg max-h-40 overflow-auto">
          {filteredPlayers.map((p) => (
            <li
              key={p.id}
              className="p-2 text-sm hover:bg-gray-100 cursor-pointer border-b last:border-b-0"
              onClick={() => {
                onChange(p.id);
                setSearch("");
                setIsOpen(false);
              }}
            >
              {p.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function EventGroup({
  title,
  players,
  maxCount = 10,
  value = [],
  onChange,
}: {
  title: string;
  players: Player[];
  maxCount?: number;
  value: string[];
  onChange: (val: string[]) => void;
}) {
  const [count, setCount] = useState(value.length);

  // Sync count with initial value if it changes
  useEffect(() => {
    if (value.length > count) setCount(value.length);
  }, [value, count]);

  return (
    <div className="bg-gray-50 p-4 rounded border mb-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-[#001f3f]">{title}</h3>
        <select
          value={count}
          onChange={(e) => {
            const newCount = parseInt(e.target.value);
            setCount(newCount);
            // Trim the array if count is reduced
            if (newCount < value.length) {
              onChange(value.slice(0, newCount));
            }
          }}
          className="p-1 border rounded text-sm bg-white font-bold"
        >
          {Array.from({ length: maxCount + 1 }).map((_, i) => (
            <option key={i} value={i}>
              {i}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-3">
        {Array.from({ length: count }).map((_, i) => (
          <AutocompleteInput
            key={i}
            label={`#${i + 1}`}
            players={players}
            value={value[i] || ""}
            onChange={(id) => {
              const newVal = [...value];
              newVal[i] = id;
              onChange(newVal);
            }}
          />
        ))}
        {count === 0 && (
          <p className="text-xs text-gray-400 italic">
            Nenhum evento registrado.
          </p>
        )}
      </div>
    </div>
  );
}

function OpponentGoalScorersGroup({
  value = [],
  onChange,
}: {
  value: string[];
  onChange: (val: string[]) => void;
}) {
  const [count, setCount] = useState(value.length);

  useEffect(() => {
    if (value.length > count) setCount(value.length);
  }, [value, count]);

  return (
    <div className="bg-gray-50 p-4 rounded border mb-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-[#001f3f]">🥅 Gols Sofridos</h3>
        <select
          value={count}
          onChange={(e) => {
            const newCount = parseInt(e.target.value);
            setCount(newCount);
            if (newCount < value.length) {
              onChange(value.slice(0, newCount));
            }
          }}
          className="p-1 border rounded text-sm bg-white font-bold"
        >
          {Array.from({ length: 21 }).map((_, i) => (
            <option key={i} value={i}>
              {i}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-3">
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="relative">
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
              Goleador #{i + 1}
            </label>
            <input
              type="text"
              value={value[i] || ""}
              onChange={(e) => {
                const newVal = [...value];
                newVal[i] = e.target.value.substring(0, 30);
                onChange(newVal);
              }}
              className="w-full p-2 border border-gray-300 rounded text-sm bg-white focus:ring-2 focus:ring-[#0074D9] outline-none"
              placeholder="Nome do jogador adversário..."
              maxLength={30}
            />
          </div>
        ))}
        {count === 0 && (
          <p className="text-xs text-gray-400 italic">
            Nenhum gol sofrido registrado.
          </p>
        )}
      </div>
    </div>
  );
}

export function GameEventsEditor({
  players,
  defaultGoals = [],
  defaultOwnGoals = [],
  defaultYellowCards = [],
  defaultRedCards = [],
  defaultOpponentGoalsScorers = [],
}: {
  players: Player[];
  defaultGoals?: string[];
  defaultOwnGoals?: string[];
  defaultYellowCards?: string[];
  defaultRedCards?: string[];
  defaultOpponentGoalsScorers?: string[];
}) {
  const [goals, setGoals] = useState<string[]>(defaultGoals);
  const [ownGoals, setOwnGoals] = useState<string[]>(defaultOwnGoals);
  const [yellowCards, setYellowCards] = useState<string[]>(defaultYellowCards);
  const [redCards, setRedCards] = useState<string[]>(defaultRedCards);
  const [opponentScorers, setOpponentScorers] = useState<string[]>(defaultOpponentGoalsScorers);

  return (
    <div className="col-span-full">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
        <EventGroup
          title="⚽ Gols Marcados"
          players={players}
          value={goals}
          onChange={setGoals}
        />
        <OpponentGoalScorersGroup
          value={opponentScorers}
          onChange={setOpponentScorers}
        />
        <EventGroup
          title="🤦‍♂️ Gols Contra"
          players={players}
          value={ownGoals}
          onChange={setOwnGoals}
        />
        <EventGroup
          title="🟨 C. Amarelos"
          players={players}
          value={yellowCards}
          onChange={setYellowCards}
        />
        <EventGroup
          title="🟥 C. Vermelhos"
          players={players}
          value={redCards}
          onChange={setRedCards}
        />
      </div>

      <input
        type="hidden"
        name="goals_players"
        value={JSON.stringify(goals.filter(Boolean))}
      />
      <input
        type="hidden"
        name="own_goals_players"
        value={JSON.stringify(ownGoals.filter(Boolean))}
      />
      <input
        type="hidden"
        name="opponent_goals_scorers"
        value={JSON.stringify(opponentScorers)}
      />
      <input
        type="hidden"
        name="yellow_cards_players"
        value={JSON.stringify(yellowCards.filter(Boolean))}
      />
      <input
        type="hidden"
        name="red_cards_players"
        value={JSON.stringify(redCards.filter(Boolean))}
      />

      {/* Fallbacks just in case */}
      <input
        type="hidden"
        name="yellow_cards_count"
        value={yellowCards.filter(Boolean).length}
      />
      <input
        type="hidden"
        name="red_cards_count"
        value={redCards.filter(Boolean).length}
      />
    </div>
  );
}
