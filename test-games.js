const dotenv = require('dotenv');
dotenv.config({ path: '.env.local' });

async function run() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const res = await fetch(`${url}/rest/v1/games?select=id,opponent,goals_players,yellow_cards_players,red_cards_players&order=date.desc&limit=3`, {
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`
    }
  });
  const text = await res.text();
  console.log("Response:", res.status, text);
}
run();
