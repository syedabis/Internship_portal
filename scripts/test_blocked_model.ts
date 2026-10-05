import { db } from '../lib/db';

async function test() {
  const count = await db.blockedIntern.count();
  const sample = await db.blockedIntern.findUnique({ where: { email: 'hifzaayaz460@gmail.com' } });
  console.log('BlockedIntern count via Prisma model:', count);
  console.log('Hifza Ayaz from Prisma model:', sample);
}

test()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error('Error:', e);
    process.exit(1);
  });
