const dotenv = require('dotenv');
dotenv.config({ path: '.env.local' });

async function run() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const res = await fetch(`${url}/rest/v1/players?id=eq.6feaf403-32e3-43f9-abc3-4e4f55a26079`, {
    method: 'PATCH',
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      'Content-Type': 'application/json',
      'Prefer': 'return=representation'
    },
    body: JSON.stringify({ goals: 1 })
  });
  const text = await res.text();
  console.log("Service Key Update Response:", res.status, text);
}
run();
