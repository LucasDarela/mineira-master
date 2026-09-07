"use server";
import sharp from "sharp";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { createClient } from "@/utils/supabase/server";

async function getIsAdminDomain() {
  const headersList = await headers();
  const host = headersList.get("host") || "";
  return host.startsWith("admin.");
}

export async function login(formData: FormData) {
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
  const is_championship = formData.get("is_championship") === "on";
  const outcome = formData.get("outcome") as string || "";
  const isAdminDomain = await getIsAdminDomain();
  
  const { error } = await supabase.from("games").insert([
    { opponent, date, time, location, is_championship, outcome }
  ]);

  if (error) {
    console.error("Erro do Supabase ao inserir jogo:", error);
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
  const is_championship = formData.get("is_championship") === "on";
  const outcome = formData.get("outcome") as string || "";
  
  await supabase.from("games").update({ opponent, date, time, location, is_championship, outcome }).eq("id", id);
  
  revalidatePath("/", "layout");
}

export async function deleteGame(id: string) {
  const supabase = await createClient();
  await supabase.from("games").delete().eq("id", id);
  
  revalidatePath("/", "layout");
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
  
  const file = formData.get("image") as File;
  const image = await uploadImageToStorage(file) || "/images/player.jpg";
  
  await supabase.from("players").insert([{ name, position, jersey_number, image }]);
  revalidatePath("/", "layout");
}

export async function updatePlayer(id: string, formData: FormData) {
  const supabase = await createClient();
  const name = formData.get("name") as string;
  const position = formData.get("position") as string;
  const jersey_number = formData.get("jersey_number") as string || "";
  
  const updateData: any = { name, position, jersey_number };
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
