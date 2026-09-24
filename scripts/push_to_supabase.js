const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const supabaseUrl = 'https://tlckqydcxdmduogjilqc.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRsY2txeWRjeGRtZHVvZ2ppbHFjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkwODc5MTUsImV4cCI6MjA5NDY2MzkxNX0.tL5gfMIsVm-mS7x93h42JFf_Ex9BwMW3y-Z67JAenK0';

const supabase = createClient(supabaseUrl, supabaseKey);

async function pushData() {
  const dataPath = path.join(__dirname, '..', 'parsed_data.json');
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

  if (ambassadors.length > 0) {
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
