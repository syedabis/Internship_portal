import { db } from '../lib/db';
import fs from 'fs';
import path from 'path';

async function main() {
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
  console.log('Table internship_blocked_interns created/verified!');

  const jsonPath = path.join(process.cwd(), 'blocked_interns.json');
  if (fs.existsSync(jsonPath)) {
    const blockedJson = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
    console.log('Seeding', blockedJson.length, 'records from blocked_interns.json...');
    for (const record of blockedJson) {
      const email = record.email.toLowerCase().trim();
      const name = record.name || '';
      const reason = record.reason || 'Due to inconsistent performance and unfulfilled milestone requirements';
      const blockedBy = record.blockedBy || 'Admin';
      const blockedAt = new Date(record.blockedAt || Date.now());

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
  }

  const rows = await db.$queryRawUnsafe<any[]>(`SELECT email, name, reason, blocked_at FROM internship_blocked_interns ORDER BY blocked_at DESC;`);
  console.log('Total in database:', rows.length);
  console.log('Latest 3 records:');
  console.dir(rows.slice(0, 3), { depth: null });
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('Migration failed:', err);
    process.exit(1);
  });
