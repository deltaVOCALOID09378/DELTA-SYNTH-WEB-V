import fs from 'node:fs';

// 1. Update src/public/voicebankData.js
let vbDataContent = fs.readFileSync('src/public/voicebankData.js', 'utf8');

// Replace imageFull paths: 'assets/images/voicebanks/(?!full/)' -> 'assets/images/voicebanks/full/'
vbDataContent = vbDataContent.replace(/imageFull:\s*'assets\/images\/voicebanks\/(?!full\/)([^']+)'/g, (match, filename) => {
  return `imageFull: 'assets/images/voicebanks/full/${filename}'`;
});

// Update downloadUrl to official Google Drive repository
vbDataContent = vbDataContent.replace(/downloadUrl:\s*'https:\/\/drive\.google\.com\/drive\/folders\/DELTA_SYNTH_[^']+'/g, () => {
  return `downloadUrl: 'https://drive.google.com/drive/folders/1tboFHk0sj2Util_1CGBvqEPfV-qqCvMx?usp=drive_link'`;
});

fs.writeFileSync('src/public/voicebankData.js', vbDataContent, 'utf8');
console.log('Updated src/public/voicebankData.js (imageFull and downloadUrl)');

// 2. Update src/public/voicebank.html
let vbHtml = fs.readFileSync('src/public/voicebank.html', 'utf8');

// Update image src in voicebank.html to full body images with fallback
vbHtml = vbHtml.replace(/<img\s+src="assets\/images\/voicebanks\/([^"]+)"\s+alt="([^"]+)"\s+loading="lazy"\s+onerror="this\.src='assets\/images\/voicebanks\/[^']+'">/g, (match, file, alt) => {
  return `<img src="assets/images/voicebanks/full/${file}" alt="${alt}" loading="lazy" onerror="this.src='assets/images/voicebanks/${file}'">`;
});

// Update favicon stroke to #cc2200 and fill to #0d0d0d
vbHtml = vbHtml.replace(/stroke=%22%234fe3d0%22/g, 'stroke=%22%23cc2200%22');
vbHtml = vbHtml.replace(/fill=%22%230a0b16%22/g, 'fill=%22%230d0d0d%22');

fs.writeFileSync('src/public/voicebank.html', vbHtml, 'utf8');
console.log('Updated src/public/voicebank.html (full images and cyber favicon)');

// 3. Update main HTML pages (index, about, files, collab, events, project)
const mainPages = ['index.html', 'about.html', 'files.html', 'collab.html', 'events.html', 'project.html'];
for (const p of mainPages) {
  const pPath = `src/public/${p}`;
  if (!fs.existsSync(pPath)) continue;
  let pageContent = fs.readFileSync(pPath, 'utf8');
  
  // Favicon cyber red
  pageContent = pageContent.replace(/stroke=%22%234fe3d0%22/g, 'stroke=%22%23cc2200%22');
  pageContent = pageContent.replace(/fill=%22%230a0b16%22/g, 'fill=%22%230d0d0d%22');
  
  // Curve gradient in index.html and others
  pageContent = pageContent.replace(/<stop offset="0%" stop-color="#9075ff"\/>\s*<stop offset="50%" stop-color="#6f8dff"\/>\s*<stop offset="100%" stop-color="#4fe3d0"\/>/g, 
    '<stop offset="0%" stop-color="#CC2200"/>\n      <stop offset="50%" stop-color="#FF4422"/>\n      <stop offset="100%" stop-color="#991100"/>');

  fs.writeFileSync(pPath, pageContent, 'utf8');
  console.log(`Updated theme tokens and favicon in src/public/${p}`);
}

console.log('Finished updating voicebank data and pages!');
