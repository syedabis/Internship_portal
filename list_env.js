const fs = require('fs');
const env = fs.readFileSync('.env.local', 'utf8');
env.split(/\r?\n/).forEach(line => {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith('#')) return;
  const idx = trimmed.indexOf('=');
  if (idx !== -1) {
    console.log(trimmed.slice(0, idx).trim());
  }
});
