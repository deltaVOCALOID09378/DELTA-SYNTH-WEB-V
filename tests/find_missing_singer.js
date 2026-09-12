import fs from 'node:fs';

const vbContent = fs.readFileSync('src/public/voicebankData.js', 'utf8');
const idMatches = [...vbContent.matchAll(/id:\s*['"]([^'"]+)['"]/g)].map(m => m[1]);
console.log('voicebankData IDs count:', idMatches.length);

const singerFiles = fs.readdirSync('src/public/singers')
  .filter(f => f.endsWith('.html') && f !== 'index.html')
  .map(f => f.replace('.html', ''));
console.log('src/public/singers files count:', singerFiles.length);

const profileSingerFiles = fs.readdirSync('Singer Profile/singers')
  .filter(f => f.endsWith('.html') && f !== 'index.html')
  .map(f => f.replace('.html', ''));
console.log('Singer Profile/singers files count:', profileSingerFiles.length);

// What is in challenger_m1_2.test.js?
const chContent = fs.readFileSync('tests/challenger_m1_2.test.js', 'utf8');
console.log('Challenger mentions:');
const diff1 = singerFiles.filter(s => !idMatches.includes(s));
console.log('In singer files but not in voicebankData:', diff1);

// What about Published/ or backup files?
const backupFiles = fs.existsSync('Published') ? fs.readdirSync('Published', { recursive: true }) : [];
console.log('All IDs in voicebankData:', idMatches);
