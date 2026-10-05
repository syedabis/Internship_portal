const fs = require('fs');
const env = fs.readFileSync('.env.local', 'utf8');
env.split(/\r?\n/).forEach(line => {
  if (line.startsWith('DATABASE_URL=')) {
    const url = line.split('=')[1].trim();
    const host = url.split('@')[1]?.split('/')[0];
    console.log('DATABASE_URL host:', host);
  }
});
