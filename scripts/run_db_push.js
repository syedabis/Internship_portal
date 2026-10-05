const fs = require('fs');
const { execSync } = require('child_process');

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

try {
  execSync('npx prisma db push', {
    env: { ...process.env, ...envMap },
    stdio: 'inherit'
  });
  console.log('db push SUCCESS');
} catch (err) {
  console.error('db push FAILED:', err.message);
}
