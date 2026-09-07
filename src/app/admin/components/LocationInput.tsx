"use client";

import { useState } from "react";

export function LocationInput({ defaultValue = "" }: { defaultValue?: string }) {
  const isCustomDefault = defaultValue !== "Mineira Nova" && defaultValue !== "";
  const [selection, setSelection] = useState(isCustomDefault ? "custom" : defaultValue || "Mineira Nova");

  return (
    <div className="flex flex-col gap-2">
      <select 
        value={selection} 
        onChange={(e) => setSelection(e.target.value)}
        className="w-full p-2 border rounded text-sm bg-white"
        name={selection === "custom" ? "" : "location"}
      >
        <option value="Mineira Nova">Mineira Nova</option>
        <option value="custom">Casa do Adversário / Outro...</option>
      </select>
      
      {selection === "custom" && (
        <input 
          type="text" 
          name="location" 
          defaultValue={isCustomDefault ? defaultValue : ""}
          placeholder="Digite o local da partida..." 
          required 
          className="w-full p-2 border rounded text-sm outline-none focus:ring-1 focus:ring-[#0074D9]" 
        />
      )}
    </div>
  );
}
