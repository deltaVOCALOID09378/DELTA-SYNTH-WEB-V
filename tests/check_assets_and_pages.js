import fs from 'node:fs';
import path from 'node:path';

const singersDir = './src/public/singers';
const singerProfileDir = './Singer Profile/singers';
const fullImgDir = './src/public/assets/images/voicebanks/full';
const thumbImgDir = './src/public/assets/images/voicebanks';
const voiceDir = './src/public/Voice';

function checkSingers(dirName, dirPath) {
  console.log(`\n=== Checking ${dirName} (${dirPath}) ===`);
  const files = fs.readdirSync(dirPath).filter(f => f.endsWith('.html') && f !== 'tackpee.html' && f !== 'index.html');
  
  let missingFull = 0;
  let missingThumb = 0;
  let missingAudio = 0;
  let missingThemeCss = 0;
  let missingVbSection = 0;

  for (const file of files) {
    const fullFilePath = path.join(dirPath, file);
    const content = fs.readFileSync(fullFilePath, 'utf-8');

    // 1. Check Full Image
    const fullMatch = content.match(/src=["'](?:\.\.\/|\.\.\/\.\.\/src\/public\/)assets\/images\/voicebanks\/full\/([^"']+)["']/);
    if (fullMatch) {
      const fullImgName = fullMatch[1];
      const fullImgPath = path.join(fullImgDir, fullImgName);
      if (!fs.existsSync(fullImgPath)) {
        console.error(`[${file}] MISSING full image: "${fullImgName}"`);
        missingFull++;
      }
    } else {
      console.warn(`[${file}] NO full image tag found`);
      missingFull++;
    }

    // 2. Check Thumb Image (fallback)
    const thumbMatch = content.match(/onerror=["']this\.src=['"](?:\.\.\/|\.\.\/\.\.\/src\/public\/)assets\/images\/voicebanks\/([^'"]+)['"]/);
    if (thumbMatch) {
      const thumbImgName = thumbMatch[1];
      const thumbImgPath = path.join(thumbImgDir, thumbImgName);
      if (!fs.existsSync(thumbImgPath)) {
        console.error(`[${file}] MISSING thumb fallback: "${thumbImgName}"`);
        missingThumb++;
      }
    }

    // 3. Check Audio Sample
    const audioMatch = content.match(/<source\s+src=["'](?:\.\.\/|\.\.\/\.\.\/src\/public\/)Voice\/([^"']+)["']/);
    if (audioMatch) {
      const audioName = audioMatch[1];
      const audioPath = path.join(voiceDir, audioName);
      if (!fs.existsSync(audioPath)) {
        console.error(`[${file}] MISSING audio sample: "${audioName}"`);
        missingAudio++;
      }
    }

    // 4. Check CSS reference
    if (!content.includes('style.css')) {
      console.error(`[${file}] MISSING style.css link`);
      missingThemeCss++;
    }

    // 5. Check vb-archive-section
    if (!content.includes('vb-archive-section')) {
      console.warn(`[${file}] MISSING vb-archive-section`);
      missingVbSection++;
    }
  }

  console.log(`Results for ${dirName}:
  Total singer pages: ${files.length}
  Missing full images: ${missingFull}
  Missing thumb images: ${missingThumb}
  Missing audio samples: ${missingAudio}
  Missing theme CSS: ${missingThemeCss}
  Missing vb archive section: ${missingVbSection}`);
}

function checkVoicebankHtml() {
  console.log(`\n=== Checking src/public/voicebank.html ===`);
  const content = fs.readFileSync('./src/public/voicebank.html', 'utf-8');
  
  // Singer links
  const singerLinkRegex = /href=["'](singers\/[^"']+)["']/g;
  let match;
  let brokenLinks = 0;
  let totalLinks = 0;
  while ((match = singerLinkRegex.exec(content)) !== null) {
    totalLinks++;
    const linkPath = path.join('./src/public', match[1]);
    if (!fs.existsSync(linkPath)) {
      console.error(`[voicebank.html] BROKEN singer link: ${match[1]}`);
      brokenLinks++;
    }
  }

  // Image links
  const imgRegex = /src=["'](assets\/images\/[^"']+)["']/g;
  let brokenImgs = 0;
  let totalImgs = 0;
  while ((match = imgRegex.exec(content)) !== null) {
    totalImgs++;
    const imgPath = path.join('./src/public', match[1]);
    if (!fs.existsSync(imgPath)) {
      console.error(`[voicebank.html] BROKEN image link: ${match[1]}`);
      brokenImgs++;
    }
  }

  console.log(`voicebank.html check results:
  Total singer links: ${totalLinks} (Broken: ${brokenLinks})
  Total images: ${totalImgs} (Broken: ${brokenImgs})`);
}

function checkSingersIndex(dirPath) {
  console.log(`\n=== Checking ${dirPath}/index.html ===`);
  const indexPath = path.join(dirPath, 'index.html');
  if (!fs.existsSync(indexPath)) {
    console.error(`MISSING ${indexPath}`);
    return;
  }
  const content = fs.readFileSync(indexPath, 'utf-8');

  // Check links to .html
  const linkRegex = /href=["']([^"']+\.html)["']/g;
  let match, brokenLinks = 0, totalLinks = 0;
  while ((match = linkRegex.exec(content)) !== null) {
    totalLinks++;
    const linkTarget = path.resolve(dirPath, match[1]);
    if (!fs.existsSync(linkTarget)) {
      console.error(`[${indexPath}] BROKEN LINK: ${match[1]} -> ${linkTarget}`);
      brokenLinks++;
    }
  }

  // Check images
  const imgRegex = /src=["']([^"']+\.(?:png|jpg|svg))["']/g;
  let brokenImgs = 0, totalImgs = 0;
  while ((match = imgRegex.exec(content)) !== null) {
    totalImgs++;
    const imgTarget = path.resolve(dirPath, match[1]);
    if (!fs.existsSync(imgTarget)) {
      console.error(`[${indexPath}] BROKEN IMG: ${match[1]} -> ${imgTarget}`);
      brokenImgs++;
    }
  }

  console.log(`${indexPath} results:
  Total links: ${totalLinks} (Broken: ${brokenLinks})
  Total images: ${totalImgs} (Broken: ${brokenImgs})`);
}

checkSingers('src/public/singers', singersDir);
checkSingers('Singer Profile/singers', singerProfileDir);
checkVoicebankHtml();
checkSingersIndex(singersDir);
checkSingersIndex(singerProfileDir);
