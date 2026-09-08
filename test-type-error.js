const dotenv = require('dotenv');
dotenv.config({ path: '.env.local' });

async function run() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  // Let's test the error by calling the REST API exactly as supabase-js would for an array
  // If we send a JSON array, fetch automatically uses JSON format.
  // Actually, we can just use supabase-js!
  const { createClient } = require('@supabase/supabase-js');
  const supabase = createClient(url, key);
  
  const { data, error } = await supabase.from('games').update({ 
    goals_players: ["6feaf403-32e3-43f9-abc3-4e4f55a26079"] 
  }).eq('id', 'c5b9adc2-0753-4c4b-b83c-62471f8b7850');
  
  console.log("Supabase JS Error:", error);
}
run();
