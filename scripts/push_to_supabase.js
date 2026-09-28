const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Helper to parse .env.local if process.env is not already populated
function loadEnv() {
  const envPath = path.join(__dirname, '..', '.env.local');
  if (fs.existsSync(envPath)) {
    const lines = fs.readFileSync(envPath, 'utf8').split('\n');
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const eqIdx = trimmed.indexOf('=');
      if (eqIdx !== -1) {
        const key = trimmed.slice(0, eqIdx).trim();
        let val = trimmed.slice(eqIdx + 1).trim();
        if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
          val = val.slice(1, -1);
        }
        if (!process.env[key]) {
          process.env[key] = val;
        }
      }
    }
  }
}

loadEnv();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Error: NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY must be set in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function pushData() {
  const dataPath = path.join(__dirname, '..', 'parsed_data.json');
  if (!fs.existsSync(dataPath)) {
    console.error(`Error: Data file not found at ${dataPath}`);
    process.exit(1);
  }
  const { chapters, ambassadors } = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

  console.log(`Pushing ${chapters.length} chapters to Supabase...`);

  // Transform chapters for database insert
  const chaptersPayload = chapters.map(c => ({
    name: c.name,
    city: c.city,
    lead_name: c.lead_name,
    whatsapp_link: c.whatsapp_link,
    members_count: c.members_count,
    badge: c.badge
  }));

  // Batch insert in chunks of 50
  for (let i = 0; i < chaptersPayload.length; i += 50) {
    const chunk = chaptersPayload.slice(i, i + 50);
    const { data, error } = await supabase.from('chapters').insert(chunk).select();
    if (error) {
      console.error(`Error inserting chapters batch ${i}:`, error);
    } else {
      console.log(`Successfully inserted chapters chunk ${i} - ${i + chunk.length}`);
    }
  }

  if (ambassadors && ambassadors.length > 0) {
    console.log(`Pushing ${ambassadors.length} ambassadors to Supabase...`);
    const ambassadorsPayload = ambassadors.map(a => ({
      name: a.name,
      email: a.email,
      phone: a.phone,
      university: a.university,
      chapter_name: a.chapter_name,
      status: a.status
    }));

    const { data, error } = await supabase.from('ambassadors').insert(ambassadorsPayload).select();
    if (error) {
      console.error('Error inserting ambassadors:', error);
    } else {
      console.log(`Successfully inserted ${ambassadors.length} ambassadors!`);
    }
  }

  console.log('All done!');
}

pushData().catch(console.error);
