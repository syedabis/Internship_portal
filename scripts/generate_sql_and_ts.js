const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, '..', 'parsed_data.json');
const { chapters, ambassadors } = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

// 1. Generate SQL File
let sqlContent = `-- SQL Seed Data for Chapters & Ambassadors (148 Chapters from CSV)\n\n`;
sqlContent += `INSERT INTO chapters (name, city, lead_name, whatsapp_link, members_count, badge) VALUES\n`;

const chapterRows = chapters.map(c => {
  const safeName = c.name.replace(/'/g, "''");
  const safeCity = c.city.replace(/'/g, "''");
  const safeLead = c.lead_name.replace(/'/g, "''");
  const safeLink = c.whatsapp_link.replace(/'/g, "''");
  const safeBadge = c.badge.replace(/'/g, "''");
  return `('${safeName}', '${safeCity}', '${safeLead}', '${safeLink}', ${c.members_count}, '${safeBadge}')`;
});

sqlContent += chapterRows.join(',\n') + `;\n\n`;

if (ambassadors.length > 0) {
  sqlContent += `INSERT INTO ambassadors (name, email, phone, university, chapter_name, status) VALUES\n`;
  const ambRows = ambassadors.map(a => {
    const safeName = a.name.replace(/'/g, "''");
    const safeEmail = a.email.replace(/'/g, "''");
    const safePhone = a.phone.replace(/'/g, "''");
    const safeUni = a.university.replace(/'/g, "''");
    const safeChap = a.chapter_name.replace(/'/g, "''");
    return `('${safeName}', '${safeEmail}', '${safePhone}', '${safeUni}', '${safeChap}', 'Active')`;
  });
  sqlContent += ambRows.join(',\n') + `;\n`;
}

fs.writeFileSync(path.join(__dirname, '..', 'seed_chapters.sql'), sqlContent);

// 2. Generate lib/chaptersData.ts
let tsContent = `// Auto-generated 148 Changemakers Chapters & Ambassadors Dataset from CSV\n\n`;
tsContent += `export const INITIAL_CHAPTERS = ${JSON.stringify(chapters, null, 2)};\n\n`;
tsContent += `export const INITIAL_AMBASSADORS = ${JSON.stringify(ambassadors, null, 2)};\n`;

fs.writeFileSync(path.join(__dirname, '..', 'lib', 'chaptersData.ts'), tsContent);

console.log('Generated seed_chapters.sql and lib/chaptersData.ts successfully!');
