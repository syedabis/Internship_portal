const fs = require('fs');
const path = require('path');

const csvPath = path.join(__dirname, '..', 'Changemakers Groups - Sheet1.csv');
const rawText = fs.readFileSync(csvPath, 'utf8');

const lines = rawText.split('\n');
const chapters = [];
const ambassadors = [];
const seenLinks = new Set();

let chapterId = 1;
let ambId = 1;

for (let i = 1; i < lines.length; i++) {
  const line = lines[i].trim();
  if (!line) continue;

  // CSV parsing handling quotes
  const parts = [];
  let current = '';
  let inQuotes = false;
  for (let c = 0; c < line.length; c++) {
    const char = line[c];
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      parts.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  parts.push(current.trim());

  if (parts.length < 2) continue;

  let rawTitle = parts[0].replace(/^"|"$/g, '').trim();
  let link = parts[1].replace(/^"|"$/g, '').trim();
  let ambStr = parts[2] ? parts[2].replace(/^"|"$/g, '').trim() : '';
  if (parts[5]) {
    const extra = parts[5].replace(/^"|"$/g, '').trim();
    if (extra) ambStr = ambStr ? `${ambStr}, ${extra}` : extra;
  }

  if (!rawTitle || !link || !link.startsWith('http')) continue;
  if (seenLinks.has(link)) continue;
  seenLinks.add(link);

  // Clean title
  let cleanTitle = rawTitle
    .replace(/^ChangeMakers\s*(\([^\)]+\))?\s*[\|\-–•\s]*/i, '')
    .replace(/^(CV\s*•\s*LinkedIn\s*•\s*Jobs\s*[\|\-–•\s]*)/i, '')
    .replace(/^[\|\-–•\s]+/, '')
    .trim();

  if (!cleanTitle) cleanTitle = rawTitle;

  // City guess
  let city = 'Pakistan';
  const lTitle = cleanTitle.toLowerCase();
  if (lTitle.includes('karachi')) city = 'Karachi';
  else if (lTitle.includes('lahore')) city = 'Lahore';
  else if (lTitle.includes('islamabad')) city = 'Islamabad';
  else if (lTitle.includes('rawalpindi') || lTitle.includes('fjwu')) city = 'Rawalpindi';
  else if (lTitle.includes('multan')) city = 'Multan';
  else if (lTitle.includes('sukkur')) city = 'Sukkur';
  else if (lTitle.includes('faisalabad')) city = 'Faisalabad';
  else if (lTitle.includes('peshawar') || lTitle.includes('mardan')) city = 'KPK / Mardan';
  else if (lTitle.includes('hyderabad') || lTitle.includes('jamshoro')) city = 'Sindh / Jamshoro';
  else if (lTitle.includes('bahawalpur')) city = 'Bahawalpur';
  else if (lTitle.includes('gik') || lTitle.includes('topi')) city = 'Swabi / Topi';
  else if (lTitle.includes('sargodha')) city = 'Sargodha';
  else if (lTitle.includes('sahiwal')) city = 'Sahiwal';
  else if (lTitle.includes('quetta') || lTitle.includes('balochistan')) city = 'Balochistan';

  let leadName = 'Campus Team';
  if (ambStr) {
    const names = ambStr.split(/[,/]/).map(n => n.trim()).filter(Boolean);
    if (names.length > 0) {
      leadName = names[0];
      names.forEach(n => {
        ambassadors.push({
          id: `amb_${ambId++}`,
          name: n,
          email: `${n.toLowerCase().replace(/[^a-z0-9]/g, '')}@cortexa.ai`,
          phone: '+92 300 0000000',
          university: cleanTitle,
          chapter_id: `c_${chapterId}`,
          chapter_name: cleanTitle,
          status: 'Active'
        });
      });
    }
  }

  chapters.push({
    id: `c_${chapterId++}`,
    name: cleanTitle,
    city: city,
    lead_name: leadName,
    whatsapp_link: link,
    members_count: 25 + (chapterId * 7 % 80),
    badge: chapterId % 5 === 0 ? 'Top Active' : (chapterId % 2 === 0 ? 'Official' : 'Growing')
  });
}

console.log(`Parsed ${chapters.length} chapters and ${ambassadors.length} ambassadors.`);

fs.writeFileSync(path.join(__dirname, '..', 'parsed_data.json'), JSON.stringify({ chapters, ambassadors }, null, 2));
