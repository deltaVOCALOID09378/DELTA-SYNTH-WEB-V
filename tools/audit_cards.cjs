const fs = require('fs');
const path = require('path');

const files = [
  'src/public/voicebank.html',
  'src/pages/voicebank.html',
  'src/public/All DELTA\'s Voicebank.html',
  'src/pages/All DELTA\'s Voicebank.html',
  'src/public/3._All Voicebank _ DELTA SYNTH.html'
];

let out = '=== CARD BUTTON AUDIT ===\n';
for (const file of files) {
  if (!fs.existsSync(file)) {
    out += `File not found: ${file}\n`;
    continue;
  }
  const content = fs.readFileSync(file, 'utf8');
  const dlMatches = content.match(/<a[^>]*class=["'][^"']*link-chip[^"']*["'][^>]*>[\s\S]*?Download[\s\S]*?<\/a>/gi) || [];
  const pfMatches = content.match(/<a[^>]*class=["'][^"']*link-chip[^"']*["'][^>]*>[\s\S]*?Profile[\s\S]*?<\/a>/gi) || [];
  out += `${file}: Download buttons = ${dlMatches.length}, Profile buttons = ${pfMatches.length}\n`;
}
fs.writeFileSync('tools/audit_cards.log', out, 'utf8');
console.log(out);
