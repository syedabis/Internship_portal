const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const env = fs.readFileSync('.env.local', 'utf8');
const envMap = {};
env.split(/\r?\n/).forEach(line => {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith('#')) return;
  const idx = trimmed.indexOf('=');
  if (idx !== -1) {
    let v = trimmed.slice(idx + 1).trim();
    if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) v = v.slice(1, -1);
    envMap[trimmed.slice(0, idx).trim()] = v;
  }
});

const client = createClient(envMap.NEXT_PUBLIC_SUPABASE_URL, envMap.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function checkAmbassadors() {
  const { count, error } = await client.from('ambassadors').select('*', { count: 'exact', head: true });
  console.log('Total ambassadors count:', count, 'Error:', error);

  const { data: statuses } = await client.from('ambassadors').select('status');
  const counts = {};
  statuses?.forEach(s => counts[s.status] = (counts[s.status] || 0) + 1);
  console.log('Statuses breakdown:', counts);
}
checkAmbassadors();
