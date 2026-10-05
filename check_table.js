const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const env = fs.readFileSync('.env.local', 'utf8');
const envMap = {};
env.split(/\r?\n/).forEach(line => {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith('#')) return;
  const idx = trimmed.indexOf('=');
  if (idx !== -1) {
    const k = trimmed.slice(0, idx).trim();
    let v = trimmed.slice(idx + 1).trim();
    if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
      v = v.slice(1, -1);
    }
    envMap[k] = v;
  }
});

const client = createClient(envMap.NEXT_PUBLIC_SUPABASE_URL, envMap.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function testAmbassadors() {
  const { data: list, error: readErr } = await client
    .from('ambassadors')
    .select('*')
    .eq('status', 'Blocked');
  console.log('Currently blocked in ambassadors:', list?.length, readErr);

  // Test insert
  const testEmail = 'test_check_blocked@datacrumbs.org';
  const { data: insData, error: insErr } = await client
    .from('ambassadors')
    .insert([{
      name: 'Test Intern',
      email: testEmail,
      phone: '+92 300 0000000',
      chapter_name: 'None',
      status: 'Blocked',
      notes: JSON.stringify({ reason: 'Test block', blockedAt: new Date().toISOString() })
    }])
    .select();
  console.log('Insert test result:', insData, insErr);

  // Cleanup test
  if (!insErr) {
    const { error: delErr } = await client.from('ambassadors').delete().eq('email', testEmail);
    console.log('Cleanup result:', delErr);
  }
}
testAmbassadors();
