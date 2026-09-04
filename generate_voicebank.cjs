const fs = require('fs');
const { VOICEBANKS } = require('./src/public/voicebankData.js');

function getStatusClass(s){ return (s&&s.toLowerCase().includes('ready'))?'status-active':'status-dev'; }
function getStatusLabel(s){ return (s&&s.toLowerCase().includes('ready'))?'ACTIVE':'DEVELOPING'; }
function getLangTags(lang){
  if(!lang) return 'th';
  const t=[];
  if(/japanese|jp/i.test(lang)) t.push('jp');
  if(/thai|th/i.test(lang)) t.push('th');
  if(/english|en/i.test(lang)) t.push('en');
  if(/chinese|cn/i.test(lang)) t.push('cn');
  return t.length?t.join(','):'th';
}
function getTagPills(lang){
  const map={jp:'JP',th:'TH',en:'EN',cn:'CN'};
  return getLangTags(lang).split(',').map(t=>`<span class="tag-pill ${t}">${map[t]||t.toUpperCase()}</span>`).join('');
}
function isAI(engine){ return engine&&/diffsinger|ai/i.test(engine); }
function getDataTags(s){
  const t=getLangTags(s.language).split(',');
  if(isAI(s.engine)) t.push('ai');
  return t.join(',');
}
function renderCard(s, i){
  const num=String(i+1).padStart(2,'0');
  const imgSrc=s.imageFull?`assets/images/voicebanks/${s.imageFull.split('/').pop()}`:s.image;
  const aiBadge=isAI(s.engine)?`<span class="tag-pill ai">AI</span>`:'';
  return `<article class="vcard" data-tags="${getDataTags(s)}">
  <div class="vcard-media">
    <img src="${imgSrc}" alt="${s.name}" loading="lazy">
    <span class="status ${getStatusClass(s.status)}">${getStatusLabel(s.status)}</span>
    <span class="num">${num}</span>
  </div>
  <div class="vcard-body">
    <h3>${s.name}</h3>
    <div class="role">${s.nameTh||''}</div>
    <p class="vcard-bio">${s.description||''}</p>
    <div class="vcard-stats">
      <div><b>Age</b><span>${s.age||'N/A'}</span></div>
      <div><b>Gender</b><span>${s.gender||'N/A'}</span></div>
      <div><b>Voicer</b><span>${s.voicer||'DELTA SYNTH'}</span></div>
      <div><b>Genre</b><span>${s.genre||'N/A'}</span></div>
      <div><b>Engine</b><span>${s.engine||'UTAU'}</span></div>
      <div><b>Language</b><span>${s.language||'Thai'}</span></div>
    </div>
    <div class="vcard-tags">${getTagPills(s.language)}${aiBadge}</div>
    <div class="vcard-links">
      <a class="link-chip" href="${s.downloadUrl||'#'}" target="_blank" rel="noopener">Download</a>
      <a class="link-chip" href="${s.detailUrl||'#'}">Profile</a>
    </div>
  </div>
</article>`;
}

const cards = VOICEBANKS.map((s,i)=>renderCard(s,i)).join('\n      ');

const NAV=`<header class="site-header">
  <div class="nav">
    <a href="index.html" class="brand">
      <span class="brand-mark">&#916;</span>
      <span>DELTA SYNTH<small>VOCAL SYNTHESIS STUDIO</small></span>
    </a>
    <nav class="nav-links">
      <a href="index.html">Main</a>
      <a href="about.html">About Us</a>
      <a href="voicebank.html" class="active">All Voicebank</a>
      <a href="files.html">USTX / MIDI / SVP / VSQX</a>
      <a href="collab.html">Collaboration</a>
      <a href="events.html">Events</a>
    </nav>
    <button class="nav-toggle" type="button" aria-expanded="false" aria-label="Open Menu">
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M1 4H17M1 9H17M1 14H17" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>
    </button>
  </div>
</header>`;

const FOOTER=`<footer>
  <div class="wrap">
    <div class="footer-grid">
      <div>
        <div class="brand" style="margin-bottom:14px;">
          <span class="brand-mark">&#916;</span>
          <span>DELTA SYNTH<small>VOCAL SYNTHESIS STUDIO</small></span>
        </div>
        <p style="max-width:340px;font-size:13.5px;">&#xE2AA;&#xE15;&#xE39;&#xE14;&#xE34;&#xE42;&#xE2D;&#xE1E;&#xE31;&#xE18;&#xE19;&#xE32;&#xE04;&#xE25;&#xE31;&#xE07;&#xE40;&#xE2A;&#xE35;&#xE22;&#xE07;&#xE2A;&#xE31;&#xE0D;&#xE0A;&#xE32;&#xE15;&#xE34;&#xE44;&#xE17;&#xE22; &#xE01;&#xE48;&#xE2D;&#xE15;&#xE31;&#xE49;&#xE07;&#xE1B;&#xE35; 2019</p>
      </div>
      <div class="footer-links">
        <h4>Sitemap</h4>
        <a href="index.html">Main</a>
        <a href="about.html">About Us</a>
        <a href="voicebank.html">All Voicebank</a>
        <a href="files.html">USTX / MIDI / SVP / VSQX</a>
        <a href="collab.html">Collaboration</a>
        <a href="events.html">Events</a>
      </div>
      <div class="footer-links">
        <h4>Contact</h4>
        <a href="mailto:delta.vocaloid09378@gmail.com">Gmail (Public)</a>
        <a href="#">YouTube</a>
        <a href="#">TikTok</a>
        <a href="#">X / Twitter</a>
      </div>
    </div>
    <div class="footer-bottom">
      <span>&#169; Since 2019 &#8211; DELTA SYNTH Team</span>
      <span>Made in Thailand</span>
    </div>
  </div>
</footer>`;

const html=`<!DOCTYPE html>
<html lang="th">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>All Voicebank - DELTA SYNTH</title>
<meta name="description" content="DELTA SYNTH Voicebank Repository - All UTAU and DiffSinger AI voice banks">
<link rel="stylesheet" href="style.css">
</head>
<body>
${NAV}
<section class="page-hero">
  <div class="wrap">
    <span class="crumb">DELTA SYNTH / All Voicebank</span>
    <h1>&#xE04;&#xE25;&#xE31;&#xE07;&#xE40;&#xE2A;&#xE35;&#xE22;&#xE07;&#xE17;&#xE31;&#xE49;&#xE07;&#xE2B;&#xE21;&#xE14;<br>&#xE02;&#xE2D;&#xE07; DELTA SYNTH</h1>
    <p class="lead" style="max-width:640px;">Voicebank repository of all ${VOICEBANKS.length} characters. OpenUTAU and DiffSinger AI ready.</p>
  </div>
</section>
<section style="padding-top:0;">
  <div class="wrap">
    <div class="filter-bar">
      <button class="filter-chip active" data-filter="all">All</button>
      <button class="filter-chip" data-filter="jp">JP</button>
      <button class="filter-chip" data-filter="th">TH</button>
      <button class="filter-chip" data-filter="en">EN</button>
      <button class="filter-chip" data-filter="cn">CN</button>
      <button class="filter-chip" data-filter="ai">DiffSinger AI</button>
    </div>
    <div class="roster">
      ${cards}
    </div>
  </div>
</section>
${FOOTER}
<script src="script.js"></script>
</body>
</html>`;

fs.writeFileSync('./src/public/voicebank.html', html, 'utf8');
console.log('voicebank.html generated with '+VOICEBANKS.length+' singers');
