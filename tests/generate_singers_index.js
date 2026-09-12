import fs from 'node:fs';
import path from 'node:path';

async function generateIndex() {
  const vbMod = await import('../src/public/voicebankData.js');
  const { VOICEBANKS } = vbMod;
  const catalog = JSON.parse(fs.readFileSync('src/public/voicebanks_catalog.json', 'utf8'));

  function buildHtml(isRootFolder) {
    const cssPath = isRootFolder ? '../../src/public/style.css' : '../style.css';
    const homePath = isRootFolder ? '../../src/public/index.html' : '../index.html';
    const aboutPath = isRootFolder ? '../../src/public/about.html' : '../about.html';
    const vbPath = isRootFolder ? '../../src/public/voicebank.html' : '../voicebank.html';
    const filesPath = isRootFolder ? '../../src/public/files.html' : '../files.html';
    const collabPath = isRootFolder ? '../../src/public/collab.html' : '../collab.html';
    const eventsPath = isRootFolder ? '../../src/public/events.html' : '../events.html';
    const imgBasePath = isRootFolder ? '../../src/public/' : '../';

    const cardsHtml = VOICEBANKS.map((s, idx) => {
      const archives = catalog[s.id] || [];
      const archiveCount = archives.length;
      const countLabel = archiveCount > 0 ? `${archiveCount} คลังเสียง` : 'ในขั้นตอนพัฒนา';
      const isDiff = s.engine.includes('DiffSinger');
      const badgeClass = isDiff ? 'badge-ai' : 'badge-engine';

      const fullImg = `${imgBasePath}${s.imageFull}`;
      const thumbImg = `${imgBasePath}${s.image}`;

      return `      <article class="cyber-singer-card" 
               data-id="${s.id}" 
               data-gender="${(s.gender || '').toLowerCase()}" 
               data-type="${(s.type || '').toLowerCase()}" 
               data-engine="${(s.engine || '').toLowerCase()}" 
               data-name="${s.name.toLowerCase()} ${(s.nameTh || '').toLowerCase()} ${(s.genre || '').toLowerCase()}">
        <div class="card-visual">
          <div class="visual-glow"></div>
          <img src="${fullImg}" 
               alt="${s.name}" 
               loading="lazy" 
               class="singer-portrait" 
               onerror="this.src='${thumbImg}'">
          <span class="card-badge ${s.status === 'Ready for Download' ? 'badge-ready' : 'badge-dev'}">
            ${s.status === 'Ready for Download' ? 'ACTIVE' : 'DEV'}
          </span>
          <span class="card-num">#${String(idx + 1).padStart(2, '0')}</span>
        </div>
        <div class="card-body">
          <div class="card-header">
            <h3 class="card-name">${s.name}</h3>
            <div class="card-nameth">${s.nameTh || ''}</div>
          </div>
          <p class="card-desc">${s.description || ''}</p>
          <div class="card-specs">
            <div><span class="spec-label">Engine</span><span class="spec-val">${s.engine}</span></div>
            <div><span class="spec-label">Language</span><span class="spec-val">${s.language}</span></div>
            <div><span class="spec-label">Type</span><span class="spec-val">${s.type}</span></div>
            <div><span class="spec-label">Archives</span><span class="spec-val highlight">${countLabel}</span></div>
          </div>
          <div class="card-actions">
            <a href="${s.id}.html" class="btn-profile">
              <span>ดูโปรไฟล์ & ดาวน์โหลด</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </a>
          </div>
        </div>
      </article>`;
    }).join('\n');

    return `<!DOCTYPE html>
<html lang="th">
<head>
<!-- 
  Made And Checked By DELTA SYNTH & Gemini AI 
  Original by Patiphat Wongyai (DELTA SYNTH)
  Revision: 2.0
-->
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Singer Profiles Directory (54 นักร้อง) · DELTA SYNTH Official</title>
<meta name="description" content="ทำเนียบและสารบัญนักร้องเสมือนทั้งหมด 54 เสียงของ DELTA SYNTH พร้อมรูปเต็มตัว ข้อมูลเสียง และลิงก์ดาวน์โหลดคลังเสียง UTAU / DiffSinger">
<link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><rect width=%22100%22 height=%22100%22 rx=%2222%22 fill=%22%230d0d0d%22/><path d=%22M15 55 Q30 25 40 55 T65 55 T90 45%22 stroke=%22%23cc2200%22 stroke-width=%228%22 fill=%22none%22/></svg>">
<link rel="stylesheet" href="${cssPath}">
<link href="https://fonts.googleapis.com/css2?family=Chakra+Petch:wght@400;500;600;700&family=IBM+Plex+Sans+Thai:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;600&family=Kanit:wght@300;400;500;600;700&display=swap" rel="stylesheet">
<style>
  :root {
    --cyber-red: #CC2200;
    --cyber-red-hover: #FF4422;
    --cyber-red-pressed: #991100;
    --cyber-black: #1A1A1A;
    --cyber-darker: #0D0D0D;
    --cyber-white: #F0F0F0;
  }
  body {
    background-color: var(--cyber-darker);
    color: var(--cyber-white);
    font-family: 'Leelawadee UI', 'Kanit', 'IBM Plex Sans Thai', sans-serif;
  }
  .cyber-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(290px, 1fr));
    gap: 24px;
    margin-top: 32px;
  }
  .cyber-singer-card {
    background: rgba(26, 26, 26, 0.85);
    border: 1px solid rgba(204, 34, 0, 0.28);
    border-radius: 16px;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    transition: transform 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.6);
    position: relative;
    backdrop-filter: blur(12px);
  }
  .cyber-singer-card:hover {
    transform: translateY(-5px);
    border-color: var(--cyber-red-hover);
    box-shadow: 0 15px 40px rgba(204, 34, 0, 0.35);
  }
  .card-visual {
    position: relative;
    width: 100%;
    height: 310px;
    background: radial-gradient(circle at center, rgba(204, 34, 0, 0.22) 0%, rgba(13, 13, 13, 0.95) 80%);
    display: flex;
    justify-content: center;
    align-items: flex-end;
    overflow: hidden;
    border-bottom: 1px solid rgba(204, 34, 0, 0.2);
  }
  .visual-glow {
    position: absolute;
    width: 160px;
    height: 160px;
    background: rgba(204, 34, 0, 0.28);
    border-radius: 50%;
    filter: blur(40px);
    top: 30%;
  }
  .singer-portrait {
    position: relative;
    z-index: 2;
    max-height: 94%;
    width: auto;
    object-fit: contain;
    transition: transform 0.4s ease;
    filter: drop-shadow(0 0 16px rgba(0, 0, 0, 0.9));
  }
  .cyber-singer-card:hover .singer-portrait {
    transform: scale(1.05);
  }
  .card-badge {
    position: absolute;
    top: 12px;
    left: 12px;
    z-index: 3;
    font-family: 'JetBrains Mono', monospace;
    font-size: 10px;
    font-weight: 700;
    padding: 3px 8px;
    border-radius: 999px;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }
  .badge-ready {
    background: rgba(204, 34, 0, 0.7);
    color: #fff;
    border: 1px solid #ff4422;
    box-shadow: 0 0 8px rgba(204, 34, 0, 0.6);
  }
  .badge-dev {
    background: rgba(40, 40, 40, 0.85);
    color: #aaa;
    border: 1px solid #555;
  }
  .card-num {
    position: absolute;
    top: 12px;
    right: 12px;
    z-index: 3;
    font-family: 'JetBrains Mono', monospace;
    font-size: 12px;
    color: rgba(255, 255, 255, 0.4);
    font-weight: 600;
  }
  .card-body {
    padding: 18px;
    display: flex;
    flex-direction: column;
    flex: 1;
  }
  .card-header {
    margin-bottom: 8px;
  }
  .card-name {
    font-size: 18px;
    font-weight: 700;
    color: #ffffff;
    margin: 0 0 2px 0;
  }
  .card-nameth {
    font-size: 13px;
    color: #ff5533;
  }
  .card-desc {
    font-size: 12.5px;
    color: #a0a0a0;
    line-height: 1.5;
    margin: 0 0 14px 0;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    height: 38px;
  }
  .card-specs {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 8px;
    background: rgba(13, 13, 13, 0.65);
    border: 1px solid rgba(255, 255, 255, 0.06);
    border-radius: 8px;
    padding: 10px;
    margin-bottom: 16px;
    font-size: 11px;
  }
  .spec-label {
    display: block;
    color: #888;
    font-family: 'JetBrains Mono', monospace;
    text-transform: uppercase;
    font-size: 9.5px;
  }
  .spec-val {
    color: #eee;
    font-weight: 600;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    display: block;
  }
  .spec-val.highlight {
    color: #ff7755;
  }
  .card-actions {
    margin-top: auto;
  }
  .btn-profile {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    width: 100%;
    padding: 10px 14px;
    background: #CC2200;
    color: #FFFFFF;
    font-weight: 600;
    font-size: 13px;
    border-radius: 999px;
    text-decoration: none;
    transition: all 0.2s ease;
    box-shadow: 0 0 12px rgba(204, 34, 0, 0.4);
  }
  .btn-profile:hover {
    background: #FF4422;
    box-shadow: 0 0 20px rgba(255, 68, 34, 0.7);
    color: #FFFFFF;
  }
  .filter-bar {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    align-items: center;
    margin-top: 24px;
    padding: 16px;
    background: rgba(26, 26, 26, 0.7);
    border: 1px solid rgba(204, 34, 0, 0.25);
    border-radius: 12px;
  }
  .search-input {
    flex: 1;
    min-width: 240px;
    background: #0D0D0D;
    border: 1px solid rgba(204, 34, 0, 0.35);
    border-radius: 999px;
    padding: 10px 18px;
    color: #fff;
    font-family: inherit;
    font-size: 13.5px;
    outline: none;
    transition: border-color 0.2s, box-shadow 0.2s;
  }
  .search-input:focus {
    border-color: #ff4422;
    box-shadow: 0 0 12px rgba(255, 68, 34, 0.5);
  }
  .filter-btn {
    background: transparent;
    border: 1px solid rgba(255, 255, 255, 0.15);
    color: #ccc;
    padding: 7px 14px;
    border-radius: 999px;
    font-size: 12px;
    font-family: inherit;
    cursor: pointer;
    transition: all 0.2s;
  }
  .filter-btn:hover {
    border-color: #ff4422;
    color: #fff;
  }
  .filter-btn.active {
    background: #CC2200;
    border-color: #CC2200;
    color: #fff;
    box-shadow: 0 0 12px rgba(204, 34, 0, 0.6);
  }
  @media (max-width: 600px) {
    .cyber-grid {
      grid-template-columns: 1fr;
    }
    .card-visual {
      height: 280px;
    }
  }
</style>
</head>
<body>
<!-- Site Header -->
<header class="site-header">
  <div class="nav">
    <a href="${homePath}" class="brand">
      <span class="brand-mark">Δ</span>
      <span>DELTA SYNTH<small>VOCAL SYNTHESIS STUDIO</small></span>
    </a>
    <nav class="nav-links">
      <a href="${homePath}">Main</a>
      <a href="${aboutPath}">About Us</a>
      <a href="${vbPath}">All Voicebank</a>
      <a href="index.html" class="active">Singer Profiles</a>
      <a href="${filesPath}">USTX / MIDI / SVP / VSQX</a>
      <a href="${collabPath}">Collaboration</a>
      <a href="${eventsPath}">Events</a>
    </nav>
  </div>
</header>

<main style="padding: 40px 0 80px;">
  <div class="wrap">
    <!-- Header Section -->
    <div style="border-bottom: 1px solid rgba(204, 34, 0, 0.25); padding-bottom: 24px; margin-bottom: 16px;">
      <span class="eyebrow">DELTA SYNTH · Complete Character Catalog</span>
      <h1 style="margin: 8px 0; font-size: clamp(28px, 4vw, 44px);">ทำเนียบนักร้องเสมือนทั้งหมด <span style="color:#ff4422;">(54 เสียง)</span></h1>
      <p style="margin:0; font-size: 15px; color: #a0a0a0; max-width: 820px;">
        รวบรวมประวัติ ข้อมูลสเปกทางเทคนิค ภาพคาแรกเตอร์เต็มตัว และแพ็กเกจคลังเสียงพร้อมดาวน์โหลดครบทั้ง 54 นักร้องเสมือน สำหรับ OpenUtau, UTAU และ DiffSinger AI
      </p>
    </div>

    <!-- Search and Filters -->
    <div class="filter-bar">
      <input type="text" id="searchInput" class="search-input" placeholder="🔍 ค้นหาชื่อนักร้อง, ภาษา, แนวเพลง หรือเอนจิน..." />
      <button class="filter-btn active" data-filter="all">ทั้งหมด (54)</button>
      <button class="filter-btn" data-filter="official">Official DELTA</button>
      <button class="filter-btn" data-filter="collaboration">Collaboration</button>
      <button class="filter-btn" data-filter="diffsinger">DiffSinger AI</button>
      <button class="filter-btn" data-filter="male">ชาย (Male)</button>
      <button class="filter-btn" data-filter="female">หญิง (Female)</button>
    </div>

    <!-- 54 Singer Profile Grid -->
    <div class="cyber-grid" id="singersGrid">
${cardsHtml}
    </div>
  </div>
</main>

<!-- Footer -->
<footer class="site-footer" style="background: #05060c; border-top: 1px solid rgba(204,34,0,0.2); padding: 48px 0 24px; margin-top: 40px; text-align: center; color: #777; font-size: 13px;">
  <div class="wrap">
    <div style="margin-bottom: 12px;">
      <span style="color: #cc2200; font-weight: 700;">Δ DELTA SYNTH</span> — Thai Vocal Synthesis Studio Since 2019
    </div>
    <div>Made And Checked By DELTA SYNTH & Gemini AI · Original by DELTA SYNTH</div>
  </div>
</footer>

<script>
  // Filter & Search Logic
  const searchInput = document.getElementById('searchInput');
  const filterBtns = document.querySelectorAll('.filter-btn');
  const cards = document.querySelectorAll('.cyber-singer-card');

  let currentFilter = 'all';
  let currentSearch = '';

  function applyFilters() {
    cards.forEach(card => {
      const name = card.getAttribute('data-name') || '';
      const type = card.getAttribute('data-type') || '';
      const gender = card.getAttribute('data-gender') || '';
      const engine = card.getAttribute('data-engine') || '';

      const matchSearch = currentSearch === '' || name.includes(currentSearch);
      let matchFilter = true;

      if (currentFilter === 'official') {
        matchFilter = type.includes('official');
      } else if (currentFilter === 'collaboration') {
        matchFilter = type.includes('collab');
      } else if (currentFilter === 'diffsinger') {
        matchFilter = engine.includes('diffsinger');
      } else if (currentFilter === 'male') {
        matchFilter = gender === 'male';
      } else if (currentFilter === 'female') {
        matchFilter = gender === 'female';
      }

      if (matchSearch && matchFilter) {
        card.style.display = 'flex';
      } else {
        card.style.display = 'none';
      }
    });
  }

  searchInput.addEventListener('input', (e) => {
    currentSearch = e.target.value.toLowerCase().trim();
    applyFilters();
  });

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentFilter = btn.getAttribute('data-filter');
      applyFilters();
    });
  });
</script>
</body>
</html>`;
  }

  // 1. Write src/public/singers/index.html
  const srcHtml = buildHtml(false);
  fs.writeFileSync('src/public/singers/index.html', srcHtml, 'utf8');
  console.log('Successfully created src/public/singers/index.html with all 54 singers!');

  // 2. Write Singer Profile/singers/index.html
  const rootHtml = buildHtml(true);
  fs.writeFileSync('Singer Profile/singers/index.html', rootHtml, 'utf8');
  console.log('Successfully updated Singer Profile/singers/index.html with all 54 singers!');
}

generateIndex().catch(err => console.error(err));
