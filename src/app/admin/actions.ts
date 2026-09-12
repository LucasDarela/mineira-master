"use server";
import sharp from "sharp";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import { checkRateLimit, resetRateLimit } from "@/utils/rate-limit";
import { getClientIp } from "@/utils/get-client-ip";

async function getIsAdminDomain() {
  const headersList = await headers();
  const host = headersList.get("host") || "";
  return host.startsWith("admin.");
}

const LOGIN_RATE_LIMIT = 10;
const LOGIN_RATE_WINDOW_MS = 20 * 60 * 1000; // 20 minutos

export async function login(formData: FormData) {
  const ip = await getClientIp();
  const rateLimitKey = `admin-login:${ip}`;

  const { allowed } = checkRateLimit(rateLimitKey, LOGIN_RATE_LIMIT, LOGIN_RATE_WINDOW_MS);
  if (!allowed) {
    redirect("/admin/login?error=ratelimit");
  }

  const supabase = await createClient();
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const isAdminDomain = await getIsAdminDomain();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    redirect("/admin/login?error=true");
  }

  resetRateLimit(rateLimitKey);
  revalidatePath("/", "layout");
  redirect("/admin");
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}

export async function addGame(formData: FormData) {
  const supabase = await createClient();
  const opponent = formData.get("opponent") as string;
  const date = formData.get("date") as string;
  const time = formData.get("time") as string;
  const location = formData.get("location") as string;
  const home_or_away = formData.get("home_or_away") as string || "Casa";
  const is_championship = formData.get("is_championship") === "on";
  const referee = formData.get("referee") as string || null;
  const highlight_player = formData.get("highlight_player") as string || null;
  const goalsPlayersStr = formData.get("goals_players") as string;
  const ownGoalsPlayersStr = formData.get("own_goals_players") as string;
  const yellowCardsPlayersStr = formData.get("yellow_cards_players") as string;
  const redCardsPlayersStr = formData.get("red_cards_players") as string;
  const opponentGoalsScorersStr = formData.get("opponent_goals_scorers") as string;
  
  let goals_players: string[] = [];
  let own_goals_players: string[] = [];
  let yellow_cards_players: string[] = [];
  let red_cards_players: string[] = [];
  let opponent_goals_scorers: string[] = [];
  
  try { goals_players = JSON.parse(goalsPlayersStr || "[]"); } catch {}
  try { own_goals_players = JSON.parse(ownGoalsPlayersStr || "[]"); } catch {}
  try { yellow_cards_players = JSON.parse(yellowCardsPlayersStr || "[]"); } catch {}
  try { red_cards_players = JSON.parse(redCardsPlayersStr || "[]"); } catch {}
  try { opponent_goals_scorers = JSON.parse(opponentGoalsScorersStr || "[]"); } catch {}

  const opponent_goals = opponent_goals_scorers.filter(Boolean).length + own_goals_players.length;

  const yellow_cards_count = yellow_cards_players.length;
  const red_cards_count = red_cards_players.length;
  const goals_count = goals_players.length;
  
  let outcome: string | null = null;
  const isPastGame = new Date(`${date}T${time || '00:00'}:00`) <= new Date();
  if (isPastGame || goals_count > 0 || opponent_goals > 0) {
    outcome = "E";
    if (goals_count > opponent_goals) outcome = "V";
    else if (goals_count < opponent_goals) outcome = "D";
  }

  const { data: newGame, error } = await supabase.from("games").insert([{ 
    opponent, 
    date, 
    time, 
    location, 
    home_or_away,
    is_championship, 
    outcome,
    opponent_goals,
    referee,
    highlight_player,
    yellow_cards_count,
    red_cards_count,
    goals_players,
    own_goals_players,
    opponent_goals_scorers,
    yellow_cards_players,
    red_cards_players
  }]).select().single();

  if (newGame) {
    const goalsCol = is_championship ? 'champ_goals' : 'goals';
    const yellowCol = is_championship ? 'champ_yellow_cards' : 'yellow_cards';
    const redCol = is_championship ? 'champ_red_cards' : 'red_cards';

    await changePlayerStats(supabase, goals_players, goalsCol, 1);
    await changePlayerStats(supabase, own_goals_players, goalsCol, -1);
    await changePlayerStats(supabase, yellow_cards_players, yellowCol, 1);
    await changePlayerStats(supabase, red_cards_players, redCol, 1);
  }

  revalidatePath("/", "layout");
}

export async function updateGameResult(id: string, formData: FormData) {
  const supabase = await createClient();
  const result = formData.get("result") as string;
  const outcome = formData.get("outcome") as string || "";
  
  await supabase.from("games").update({ result, outcome }).eq("id", id);
  
  revalidatePath("/", "layout");
}

export async function updateGame(id: string, formData: FormData) {
  const supabase = await createClient();
  const opponent = formData.get("opponent") as string;
  const date = formData.get("date") as string;
  const time = formData.get("time") as string;
  const location = formData.get("location") as string;
  const home_or_away = formData.get("home_or_away") as string || "Casa";
  const is_championship = formData.get("is_championship") === "on";
  const referee = formData.get("referee") as string || null;
  const highlight_player = formData.get("highlight_player") as string || null;
  const goalsPlayersStr = formData.get("goals_players") as string;
  const ownGoalsPlayersStr = formData.get("own_goals_players") as string;
  const yellowCardsPlayersStr = formData.get("yellow_cards_players") as string;
  const redCardsPlayersStr = formData.get("red_cards_players") as string;
  const opponentGoalsScorersStr = formData.get("opponent_goals_scorers") as string;
  
  let goals_players: string[] = [];
  let own_goals_players: string[] = [];
  let yellow_cards_players: string[] = [];
  let red_cards_players: string[] = [];
  let opponent_goals_scorers: string[] = [];
  
  try { goals_players = JSON.parse(goalsPlayersStr || "[]"); } catch {}
  try { own_goals_players = JSON.parse(ownGoalsPlayersStr || "[]"); } catch {}
  try { yellow_cards_players = JSON.parse(yellowCardsPlayersStr || "[]"); } catch {}
  try { red_cards_players = JSON.parse(redCardsPlayersStr || "[]"); } catch {}
  try { opponent_goals_scorers = JSON.parse(opponentGoalsScorersStr || "[]"); } catch {}

  const opponent_goals = opponent_goals_scorers.filter(Boolean).length + own_goals_players.length;

  const yellow_cards_count = yellow_cards_players.length;
  const red_cards_count = red_cards_players.length;
  const goals_count = goals_players.length;
  
  let outcome: string | null = null;
  const isPastGame = new Date(`${date}T${time || '00:00'}:00`) <= new Date();
  if (isPastGame || goals_count > 0 || opponent_goals > 0) {
    outcome = "E";
    if (goals_count > opponent_goals) outcome = "V";
    else if (goals_count < opponent_goals) outcome = "D";
  }
  
  // Buscar o jogo antigo para reverter as estatísticas
  const { data: oldGame } = await supabase.from("games").select("goals_players, own_goals_players, yellow_cards_players, red_cards_players, is_championship").eq("id", id).single();
  
  if (oldGame) {
    const oldGoalsCol = oldGame.is_championship ? 'champ_goals' : 'goals';
    const oldYellowCol = oldGame.is_championship ? 'champ_yellow_cards' : 'yellow_cards';
    const oldRedCol = oldGame.is_championship ? 'champ_red_cards' : 'red_cards';

    await changePlayerStats(supabase, oldGame.goals_players || [], oldGoalsCol, -1);
    await changePlayerStats(supabase, oldGame.own_goals_players || [], oldGoalsCol, +1);
    await changePlayerStats(supabase, oldGame.yellow_cards_players || [], oldYellowCol, -1);
    await changePlayerStats(supabase, oldGame.red_cards_players || [], oldRedCol, -1);
  }
  
  const { data: updatedGame, error: updateError } = await supabase.from("games").update({ 
    opponent, 
    date, 
    time, 
    location, 
    home_or_away,
    is_championship, 
    outcome,
    opponent_goals,
    referee,
    highlight_player,
    yellow_cards_count,
    red_cards_count,
    goals_players,
    own_goals_players,
    opponent_goals_scorers,
    yellow_cards_players,
    red_cards_players
  }).eq("id", id).select().single();
  
  if (updateError) {
    const fs = require('fs');
    fs.writeFileSync('error_log.txt', JSON.stringify({ updateError, data: { opponent, referee, is_championship, goals_players } }, null, 2));
  }
  
  console.log("UPDATE RESULT:", updatedGame, updateError);

  console.log("CHANGING STATS UP", { goals_players, yellow_cards_players, red_cards_players });
  
  const goalsCol = is_championship ? 'champ_goals' : 'goals';
  const yellowCol = is_championship ? 'champ_yellow_cards' : 'yellow_cards';
  const redCol = is_championship ? 'champ_red_cards' : 'red_cards';

  await changePlayerStats(supabase, goals_players, goalsCol, 1);
  await changePlayerStats(supabase, own_goals_players, goalsCol, -1);
  await changePlayerStats(supabase, yellow_cards_players, yellowCol, 1);
  await changePlayerStats(supabase, red_cards_players, redCol, 1);

  revalidatePath("/", "layout");
}

export async function deleteGame(id: string) {
  const supabase = await createClient();
  const { data: oldGame } = await supabase.from("games").select("goals_players, own_goals_players, yellow_cards_players, red_cards_players, is_championship").eq("id", id).single();
  
  if (oldGame) {
    const goalsCol = oldGame.is_championship ? 'champ_goals' : 'goals';
    const yellowCol = oldGame.is_championship ? 'champ_yellow_cards' : 'yellow_cards';
    const redCol = oldGame.is_championship ? 'champ_red_cards' : 'red_cards';

    await changePlayerStats(supabase, oldGame.goals_players || [], goalsCol, -1);
    await changePlayerStats(supabase, oldGame.own_goals_players || [], goalsCol, +1);
    await changePlayerStats(supabase, oldGame.yellow_cards_players || [], yellowCol, -1);
    await changePlayerStats(supabase, oldGame.red_cards_players || [], redCol, -1);
  }

  await supabase.from("games").delete().eq("id", id);
  
  revalidatePath("/", "layout");
}

async function changePlayerStats(supabase: any, playerIds: string[], statColumn: string, change: number) {
  if (!playerIds || playerIds.length === 0) return;
  
  const counts = playerIds.reduce((acc, id) => {
    acc[id] = (acc[id] || 0) + change;
    return acc;
  }, {} as Record<string, number>);

  for (const [id, countChange] of Object.entries(counts)) {
    if (countChange === 0) continue;
    const { data, error } = await supabase.from('players').select(statColumn).eq('id', id).single();
    console.log(`FETCHED PLAYER ${id} STAT ${statColumn}:`, data, error);
    if (data) {
      const newVal = Math.max(0, (data[statColumn] || 0) + countChange);
      const { error: updErr } = await supabase.from('players').update({ [statColumn]: newVal }).eq('id', id);
      console.log(`UPDATED PLAYER ${id} TO ${newVal}, error:`, updErr);
    }
  }
}

export async function uploadImageToStorage(file: File | null) {
  if (!file || file.size === 0 || file.name === "undefined") return null;
  const supabase = await createClient();
  
  try {
    const buffer = Buffer.from(await file.arrayBuffer());
    
    // Processamento com Sharp:
    // fit: 'inside' mantem proporção sem cortar, 'cover' recorta. Sem enlargement impede de esticar img pequena
    const processedBuffer = await sharp(buffer)
      .resize({ width: 800, height: 800, fit: 'inside', withoutEnlargement: true })
      .webp({ quality: 85 })
      .toBuffer();

    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.webp`;
    
    const { error } = await supabase.storage.from('uploads').upload(fileName, processedBuffer, {
      contentType: 'image/webp',
    });
    
    if (error) {
      console.error("Erro no upload:", error);
      return null;
    }
    const { data: urlData } = supabase.storage.from('uploads').getPublicUrl(fileName);
    return urlData.publicUrl;
  } catch (err) {
    console.error("Erro ao processar imagem:", err);
    return null;
  }
}

// ==== JOGADORES ====

export async function addPlayer(formData: FormData) {
  const supabase = await createClient();
  const name = formData.get("name") as string;
  const position = formData.get("position") as string;
  const jersey_number = formData.get("jersey_number") as string || "";
  
  const entry_year = formData.get("entry_year") as string || null;
  const birthplace = formData.get("birthplace") as string || null;
  const birth_date = formData.get("birth_date") as string || null;
  const height = formData.get("height") as string || null;
  const weight = formData.get("weight") as string || null;
  const yellow_cards = parseInt(formData.get("yellow_cards") as string || "0");
  const red_cards = parseInt(formData.get("red_cards") as string || "0");
  const goals = parseInt(formData.get("goals") as string || "0");
  
  const champ_yellow_cards = parseInt(formData.get("champ_yellow_cards") as string || "0");
  const champ_red_cards = parseInt(formData.get("champ_red_cards") as string || "0");
  const champ_goals = parseInt(formData.get("champ_goals") as string || "0");
  
  const is_friendly = formData.get("is_friendly") === "on";
  const is_championship = formData.get("is_championship") === "on";
  
  const file = formData.get("image") as File;
  const image = await uploadImageToStorage(file) || "/images/player.jpg";
  
  await supabase.from("players").insert([{ 
    name, position, jersey_number, image, 
    entry_year, birthplace, birth_date, height, weight, yellow_cards, red_cards, goals,
    champ_yellow_cards, champ_red_cards, champ_goals, is_friendly, is_championship
  }]);
  revalidatePath("/", "layout");
}

export async function updatePlayer(id: string, formData: FormData) {
  const supabase = await createClient();
  const name = formData.get("name") as string;
  const position = formData.get("position") as string;
  const jersey_number = formData.get("jersey_number") as string || "";
  
  const entry_year = formData.get("entry_year") as string || null;
  const birthplace = formData.get("birthplace") as string || null;
  const birth_date = formData.get("birth_date") as string || null;
  const height = formData.get("height") as string || null;
  const weight = formData.get("weight") as string || null;
  const yellow_cards = parseInt(formData.get("yellow_cards") as string || "0");
  const red_cards = parseInt(formData.get("red_cards") as string || "0");
  const goals = parseInt(formData.get("goals") as string || "0");
  
  const champ_yellow_cards = parseInt(formData.get("champ_yellow_cards") as string || "0");
  const champ_red_cards = parseInt(formData.get("champ_red_cards") as string || "0");
  const champ_goals = parseInt(formData.get("champ_goals") as string || "0");
  
  const is_friendly = formData.get("is_friendly") === "on";
  const is_championship = formData.get("is_championship") === "on";
  
  const updateData: any = { 
    name, position, jersey_number, 
    entry_year, birthplace, birth_date, height, weight, yellow_cards, red_cards, goals,
    champ_yellow_cards, champ_red_cards, champ_goals, is_friendly, is_championship
  };
  const file = formData.get("image") as File;
  const uploadedImage = await uploadImageToStorage(file);
  if (uploadedImage) updateData.image = uploadedImage;
  
  await supabase.from("players").update(updateData).eq("id", id);
  revalidatePath("/", "layout");
}

export async function deletePlayer(id: string) {
  const supabase = await createClient();
  await supabase.from("players").delete().eq("id", id);
  revalidatePath("/", "layout");
}

// ==== DIRETORIA ====

export async function addDirector(formData: FormData) {
  const supabase = await createClient();
  const name = formData.get("name") as string;
  const role = formData.get("role") as string;
  const file = formData.get("image") as File;
  const image = await uploadImageToStorage(file) || "/images/player.jpg";
  await supabase.from("directors").insert([{ name, role, image }]);
  revalidatePath("/", "layout");
}

export async function updateDirector(id: string, formData: FormData) {
  const supabase = await createClient();
  const name = formData.get("name") as string;
  const role = formData.get("role") as string;
  const updateData: any = { name, role };
  const file = formData.get("image") as File;
  const uploadedImage = await uploadImageToStorage(file);
  if (uploadedImage) updateData.image = uploadedImage;
  await supabase.from("directors").update(updateData).eq("id", id);
  revalidatePath("/", "layout");
}

export async function deleteDirector(id: string) {
  const supabase = await createClient();
  await supabase.from("directors").delete().eq("id", id);
  revalidatePath("/", "layout");
}

// ==== COMISSÃO TÉCNICA ====

export async function addStaff(formData: FormData) {
  const supabase = await createClient();
  const name = formData.get("name") as string;
  const role = formData.get("role") as string;
  const file = formData.get("image") as File;
  const image = await uploadImageToStorage(file) || "/images/player.jpg";
  await supabase.from("staff").insert([{ name, role, image }]);
  revalidatePath("/", "layout");
}

export async function updateStaff(id: string, formData: FormData) {
  const supabase = await createClient();
  const name = formData.get("name") as string;
  const role = formData.get("role") as string;
  const updateData: any = { name, role };
  const file = formData.get("image") as File;
  const uploadedImage = await uploadImageToStorage(file);
  if (uploadedImage) updateData.image = uploadedImage;
  await supabase.from("staff").update(updateData).eq("id", id);
  revalidatePath("/", "layout");
}

export async function deleteStaff(id: string) {
  const supabase = await createClient();
  await supabase.from("staff").delete().eq("id", id);
  revalidatePath("/", "layout");
}

// ==== PATROCINADORES ====

export async function addSponsor(formData: FormData) {
  const supabase = await createClient();
  const name = formData.get("name") as string;
  const url = formData.get("url") as string || "";
  const file = formData.get("image") as File;
  const image = await uploadImageToStorage(file);
  await supabase.from("sponsors").insert([{ name, url, image }]);
  revalidatePath("/", "layout");
}

export async function updateSponsor(id: string, formData: FormData) {
  const supabase = await createClient();
  const name = formData.get("name") as string;
  const url = formData.get("url") as string || "";
  const updateData: any = { name, url };
  const file = formData.get("image") as File;
  const uploadedImage = await uploadImageToStorage(file);
  if (uploadedImage) updateData.image = uploadedImage;
  await supabase.from("sponsors").update(updateData).eq("id", id);
  revalidatePath("/", "layout");
}

export async function deleteSponsor(id: string) {
  const supabase = await createClient();
  await supabase.from("sponsors").delete().eq("id", id);
  revalidatePath("/", "layout");
}

// ==== CLASSIFICAÇÃO ====

export async function addStanding(formData: FormData) {
  const supabase = await createClient();
  const team_name = formData.get("team_name") as string;
  const matches_played = parseInt(formData.get("matches_played") as string || "0");
  const wins = parseInt(formData.get("wins") as string || "0");
  const draws = parseInt(formData.get("draws") as string || "0");
  const losses = parseInt(formData.get("losses") as string || "0");
  const goals_for = parseInt(formData.get("goals_for") as string || "0");
  const goals_against = parseInt(formData.get("goals_against") as string || "0");
  
  await supabase.from("championship_standings").insert([{ 
    team_name, matches_played, wins, draws, losses, goals_for, goals_against 
  }]);
  
  revalidatePath("/", "layout");
}

export async function updateStanding(id: string, formData: FormData) {
  const supabase = await createClient();
  const team_name = formData.get("team_name") as string;
  const matches_played = parseInt(formData.get("matches_played") as string || "0");
  const wins = parseInt(formData.get("wins") as string || "0");
  const draws = parseInt(formData.get("draws") as string || "0");
  const losses = parseInt(formData.get("losses") as string || "0");
  const goals_for = parseInt(formData.get("goals_for") as string || "0");
  const goals_against = parseInt(formData.get("goals_against") as string || "0");
  
  await supabase.from("championship_standings").update({ 
    team_name, matches_played, wins, draws, losses, goals_for, goals_against 
  }).eq("id", id);
  
  revalidatePath("/", "layout");
}

export async function deleteStanding(id: string) {
  const supabase = await createClient();
  await supabase.from("championship_standings").delete().eq("id", id);
  revalidatePath("/", "layout");
}
