const dotenv = require('dotenv');
dotenv.config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

async function run() {
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
  
  const { data: updatedGame, error: updateError } = await supabase.from("games").update({ 
    goals_players: ["6feaf403-32e3-43f9-abc3-4e4f55a26079", "some-other"],
  }).eq("id", "c5b9adc2-0753-4c4b-b83c-62471f8b7850").select().single();

  console.log("updateError:", updateError);
}
run();
