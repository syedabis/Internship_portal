const { db } = require('./lib/db');

async function testPrisma() {
  try {
    const unlocks = await db.paymentUnlock.count();
    console.log('PaymentUnlock count:', unlocks);
  } catch (err) {
    console.error('Prisma error:', err);
  }
}
testPrisma();
