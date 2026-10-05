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
process.env.DATABASE_URL = envMap.DATABASE_URL;

const { db } = require('./lib/db');

async function createTableAndMigrate() {
  try {
    await db.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS internship_blocked_interns (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        email TEXT UNIQUE NOT NULL,
        name TEXT,
        reason TEXT DEFAULT 'Due to inconsistent performance and unfulfilled milestone requirements',
        blocked_by TEXT DEFAULT 'Admin',
        blocked_at TIMESTAMPTZ DEFAULT now()
      );
    `);
    console.log('Table internship_blocked_interns checked/created successfully!');

    // Read local blocked_interns.json
    const blockedJson = JSON.parse(fs.readFileSync('blocked_interns.json', 'utf8'));
    console.log('Seeding', blockedJson.length, 'records from blocked_interns.json...');

    for (const record of blockedJson) {
      const email = record.email.toLowerCase().trim();
      const name = record.name || '';
      const reason = record.reason || 'Due to inconsistent performance and unfulfilled milestone requirements';
      const blockedBy = record.blockedBy || 'Admin';
      const blockedAt = record.blockedAt || new Date().toISOString();

      await db.$executeRawUnsafe(`
        INSERT INTO internship_blocked_interns (email, name, reason, blocked_by, blocked_at)
        VALUES ($1, $2, $3, $4, $5)
        ON CONFLICT (email) DO UPDATE 
        SET name = EXCLUDED.name,
            reason = EXCLUDED.reason,
            blocked_by = EXCLUDED.blocked_by,
            blocked_at = EXCLUDED.blocked_at;
      `, email, name, reason, blockedBy, blockedAt);
    }

    const rows = await db.$queryRawUnsafe(`SELECT * FROM internship_blocked_interns ORDER BY blocked_at DESC;`);
    console.log('Current rows in internship_blocked_interns:', rows.length);
    console.log('Sample row:', rows[0]);
  } catch (err) {
    console.error('Error:', err);
  } finally {
    process.exit(0);
  }
}

createTableAndMigrate();
