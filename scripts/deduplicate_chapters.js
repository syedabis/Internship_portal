const fs = require('fs');
const path = require('path');

const sqlPath = path.join(__dirname, '..', 'seed_chapters.sql');
const jsonPath = path.join(__dirname, '..', 'parsed_data.json');

const content = fs.readFileSync(sqlPath, 'utf8');

// Parse chapters
const chapterRegex = /\('([^']*)',\s*'([^']*)',\s*'([^']*)',\s*'([^']*)',\s*(\d+),\s*'([^']*)'\)/g;
let match;
const rawChapters = [];
while ((match = chapterRegex.exec(content)) !== null) {
  rawChapters.push({
    name: match[1],
    city: match[2],
    lead_name: match[3],
    whatsapp_link: match[4],
    members_count: parseInt(match[5], 10),
    badge: match[6],
  });
}

function getWhatsAppCode(url) {
  const m = url.match(/chat\.whatsapp\.com\/([A-Za-z0-9]+)/);
  return m ? m[1] : url;
}

const badgePriority = { 'Top Active': 3, 'Official': 2, 'Growing': 1 };
const chaptersByCode = new Map();

for (const c of rawChapters) {
  const code = getWhatsAppCode(c.whatsapp_link);
  if (!chaptersByCode.has(code)) {
    chaptersByCode.set(code, c);
  } else {
    const existing = chaptersByCode.get(code);
    const name = (existing.name.length >= c.name.length && !existing.name.startsWith('(')) ? existing.name : c.name;
    const city = (existing.city !== 'Pakistan' && existing.city !== 'City') ? existing.city : c.city;
    const lead = (existing.lead_name !== 'Campus Team' && existing.lead_name !== 'Lead') ? existing.lead_name : c.lead_name;
    const members = Math.max(existing.members_count, c.members_count);
    const existingBadgePrio = badgePriority[existing.badge] || 0;
    const newBadgePrio = badgePriority[c.badge] || 0;
    const badge = newBadgePrio > existingBadgePrio ? c.badge : existing.badge;

    chaptersByCode.set(code, {
      name,
      city,
      lead_name: lead,
      whatsapp_link: existing.whatsapp_link,
      members_count: members,
      badge,
    });
  }
}

// Disambiguate duplicate name FJWU Chapter 1 (two different WhatsApp groups)
const uniqueChapters = Array.from(chaptersByCode.values()).map(c => {
  if (c.name === 'FJWU Chapter 1' && c.whatsapp_link.includes('CsbERpraxHeEpFsLq2zGLJ')) {
    return { ...c, name: 'FJWU Chapter 7' };
  }
  return c;
});

// Format chapters SQL
const chapterValues = uniqueChapters.map(c => 
  `('${c.name.replace(/'/g, "''")}', '${c.city.replace(/'/g, "''")}', '${c.lead_name.replace(/'/g, "''")}', '${c.whatsapp_link.replace(/'/g, "''")}', ${c.members_count}, '${c.badge}')`
).join(',\n');

// Ambassadors deduplication
const ambRegex = /\('([^']*)',\s*'([^']*)',\s*'([^']*)',\s*'([^']*)',\s*'([^']*)',\s*'([^']*)'\)/g;
const rawAmbassadors = [];
while ((match = ambRegex.exec(content)) !== null) {
  rawAmbassadors.push({
    name: match[1],
    email: match[2],
    phone: match[3],
    university: match[4],
    chapter_name: match[5],
    status: match[6],
  });
}

const emailCount = new Map();
const cleanAmbassadors = rawAmbassadors.map(a => {
  let email = a.email.toLowerCase();
  const count = emailCount.get(email) || 0;
  emailCount.set(email, count + 1);
  if (count > 0) {
    const parts = email.split('@');
    email = `${parts[0]}+${count}@${parts[1]}`;
  }
  return { ...a, email };
});

const ambValues = cleanAmbassadors.map(a =>
  `('${a.name.replace(/'/g, "''")}', '${a.email}', '${a.phone}', '${a.university.replace(/'/g, "''")}', '${a.chapter_name.replace(/'/g, "''")}', '${a.status}')`
).join(',\n');

const newSql = `-- SQL Seed Data for Chapters & Ambassadors (${uniqueChapters.length} Unique Chapters)

INSERT INTO chapters (name, city, lead_name, whatsapp_link, members_count, badge) VALUES
${chapterValues};

INSERT INTO ambassadors (name, email, phone, university, chapter_name, status) VALUES
${ambValues};
`;

fs.writeFileSync(sqlPath, newSql, 'utf8');
console.log(`Successfully wrote deduplicated seed_chapters.sql! Unique chapters: ${uniqueChapters.length}, Ambassadors: ${cleanAmbassadors.length}`);

// Also synchronize parsed_data.json
if (fs.existsSync(jsonPath)) {
  fs.writeFileSync(jsonPath, JSON.stringify({ chapters: uniqueChapters, ambassadors: cleanAmbassadors }, null, 2), 'utf8');
  console.log('Successfully synchronized parsed_data.json!');
}
