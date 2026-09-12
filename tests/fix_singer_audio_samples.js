import fs from 'node:fs';
import path from 'node:path';

const dirs = ['./src/public/singers', './Singer Profile/singers'];

const audioReplacements = {
  'kochujang.html': { from: /Voice\/Kochujang\.wav/g, to: 'Voice/Kochujang1.wav' },
  'thitiya_anantanetr.html': { from: /Voice\/Thitiya Anantanetr\.wav/g, to: 'Voice/Thitiya.wav' },
  'bew__powerine.html': { from: /Voice\/Bew  Powerine\.wav/g, to: 'Voice/Bew Powerine.wav' },
  'beem_powerine.html': { from: /Voice\/Beem Powerine\.wav/g, to: 'Voice/Beem.wav' },
  'chansamorn.html': { from: /Voice\/Chansamorn\.wav/g, to: 'Voice/Charnsamorn.wav' },
  'kikakowa_usagi.html': { from: /Voice\/Kikakowa Usagi\.wav/g, to: 'Voice/Kikokawa Usagi.wav' },
  'arzbtv.html': { from: /Voice\/ARZB TV\.wav/g, to: 'Voice/ARZBTV.wav' },
  'okaminari_tanda.html': { from: /Voice\/Okaminari Tanda\.wav/g, to: 'Voice/Natsune Tanda.wav' },
  'sakultala.html': { from: /Voice\/Sakultala\.wav/g, to: 'Voice/Sakultala1.wav' },
  'yamada_kimada.html': { from: /Voice\/Yamada Kimada\.wav/g, to: 'Voice/Yamada Kimada1.wav' }
};

for (const dir of dirs) {
  if (!fs.existsSync(dir)) continue;

  for (const [filename, rep] of Object.entries(audioReplacements)) {
    const p = path.join(dir, filename);
    if (fs.existsSync(p)) {
      let content = fs.readFileSync(p, 'utf-8');
      if (rep.from.test(content)) {
        content = content.replace(rep.from, rep.to);
        fs.writeFileSync(p, content, 'utf-8');
        console.log(`[${dir}] Fixed audio in ${filename} -> ${rep.to}`);
      }
    }
  }

  // Handle in-production singers (ball_powerine and mochiai)
  for (const singerId of ['ball_powerine', 'mochiai']) {
    const filename = `${singerId}.html`;
    const p = path.join(dir, filename);
    if (fs.existsSync(p)) {
      let content = fs.readFileSync(p, 'utf-8');
      const audioPattern = /<audio controls[\s\S]*?<\/audio>/;
      if (audioPattern.test(content)) {
        content = content.replace(
          audioPattern,
          '<div class="text-xs text-gray-400 font-mono italic">Audio sample in production · ตัวอย่างเสียงร้องกำลังจัดทำ</div>'
        );
        fs.writeFileSync(p, content, 'utf-8');
        console.log(`[${dir}] Replaced audio player with in-production badge in ${filename}`);
      }
    }
  }
}

console.log('Audio sample fix completed.');
