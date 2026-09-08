import { createClient } from "@/utils/supabase/server";

export default async function DebugPage() {
  const supabase = await createClient();
  const { data: games, error } = await supabase.from('games').select('*').order('date', { ascending: false }).limit(2);
  return (
    <pre>{JSON.stringify({ games, error }, null, 2)}</pre>
  );
}
