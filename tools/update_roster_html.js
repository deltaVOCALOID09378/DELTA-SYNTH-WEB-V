import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { VOICEBANKS } from '../src/public/voicebankData.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

function renderPublicCard(s, idx) {
  const numStr = String(idx + 1).padStart(2, '0');
  
  // Status badge
  let statusBadge = '<span class="status status-active">✓ เป็นทางการ</span>';
  let statusTag = 'official-release';
  const statusLower = (s.status || '').toLowerCase();
  if (statusLower.includes('upcoming')) {
    statusBadge = '<span class="status status-upcoming">⏳ รอเปิดตัว</span>';
    statusTag = 'upcoming';
  } else if (statusLower.includes('private')) {
    statusBadge = '<span class="status status-private">🔒 ไพรเวท</span>';
    statusTag = 'private';
  }

  // Affiliation badge
  let affilBadge = '<span class="affil-badge affil-official">Δ Official DELTA</span>';
  let affilTag = 'official-delta';
  const typeStr = (s.type || '').toLowerCase();
  if (typeStr.includes('ceo') || typeStr.includes('major collab')) {
    affilBadge = '<span class="affil-badge affil-collab">👑 Major Collab</span>';
    affilTag = 'collab';
  } else if (typeStr.includes('partner')) {
    affilBadge = '<span class="affil-badge affil-partner">🤝 OpenUtau Partner</span>';
    affilTag = 'partner';
  } else if (typeStr.includes('collab')) {
    affilBadge = '<span class="affil-badge affil-collab">👑 Major Collab</span>';
    affilTag = 'collab';
  } else {
    affilBadge = '<span class="affil-badge affil-official">Δ Official DELTA</span>';
    affilTag = 'official-delta';
  }

  // Language tags & AI tag
  const langLower = (s.language || '').toLowerCase();
  const langTags = [];
  const tagPills = [];
  if (langLower.includes('jp') || langLower.includes('japan')) {
    langTags.push('jp');
    tagPills.push('<span class="tag-pill jp">JP</span>');
  }
  if (langLower.includes('th') || langLower.includes('thai')) {
    langTags.push('th');
    tagPills.push('<span class="tag-pill th">TH</span>');
  }
  if (langLower.includes('en') || langLower.includes('engl')) {
    langTags.push('en');
    tagPills.push('<span class="tag-pill en">EN</span>');
  }
  
  const engineLower = (s.engine || '').toLowerCase();
  if (engineLower.includes('diffsinger') || engineLower.includes('rvc') || engineLower.includes('ai')) {
    langTags.push('ai');
    tagPills.push('<span class="tag-pill ai">AI</span>');
  }

  // Gender
  const genderLower = (s.gender || '').toLowerCase();
  let genderTag = 'male';
  let genderSpan = '<span class="gender-male">Male</span>';
  if (genderLower.includes('female') || genderLower.includes('หญิง')) {
    genderTag = 'female';
    genderSpan = '<span class="gender-female">Female</span>';
  } else if (genderLower.includes('lgbtq')) {
    genderTag = 'lgbtq';
    genderSpan = '<span class="gender-lgbtq">LGBTQ</span>';
  } else {
    genderTag = 'male';
    genderSpan = '<span class="gender-male">Male</span>';
  }

  const dataTags = [...langTags, statusTag, affilTag, genderTag].join(',');
  const profileUrl = s.detailUrl || `singers/${s.id}.html`;

  return `      <article class="vcard" data-tags="${dataTags}" data-profile="${profileUrl}" tabindex="0" role="link" aria-label="ดูโปรไฟล์ ${s.name}">
        <div class="vcard-media">
          <img src="${s.imageFull}" alt="${s.name}" loading="lazy" onerror="this.src='${s.image}'">
          <div class="vcard-top-badges">
            ${statusBadge}
            ${affilBadge}
          </div>
          <span class="num">${numStr}</span>
        </div>
        <div class="vcard-body">
          <div class="vcard-header-row">
            <div>
              <h3>${s.name}</h3>
              <div class="role">${s.nameTh || ''}</div>
            </div>
          </div>
          <p class="vcard-bio">${s.description || ''}</p>
          <div class="vcard-stats">
            <div><b>Age</b><span>${s.age}</span></div>
            <div><b>Gender</b>${genderSpan}</div>
            <div><b>Voicer</b><span>${s.voicer}</span></div>
            <div><b>Genre</b><span>${s.genre}</span></div>
            <div><b>Engine</b><span>${s.engine}</span></div>
            <div><b>Language</b><span>${s.language}</span></div>
          </div>
          <div class="vcard-tags-row" style="display:flex; justify-content:space-between; align-items:center; margin-top:14px; gap:8px;">
            <div class="vcard-tags">${tagPills.join('')}</div>
            <div class="vcard-links">
              <a class="link-chip" href="${profileUrl}" onclick="event.stopPropagation();">Profile →</a>
            </div>
          </div>
        </div>
        <div class="vcard-hover-hint">คลิกดูโปรไฟล์ ↗</div>
      </article>`;
}

// 1. Update src/public/voicebank.html
const publicVbPath = path.join(rootDir, 'src', 'public', 'voicebank.html');
let publicVbHtml = fs.readFileSync(publicVbPath, 'utf8');

const cardsHtml = VOICEBANKS.map((s, idx) => renderPublicCard(s, idx)).join('\n');

const startIndex = publicVbHtml.indexOf(rosterStartToken);
const lastArticleEnd = publicVbHtml.lastIndexOf('</article>');
const endIndex = lastArticleEnd !== -1 ? publicVbHtml.indexOf('</div>', lastArticleEnd) : -1;

if (startIndex !== -1 && endIndex !== -1) {
  const beforeRoster = publicVbHtml.substring(0, startIndex + rosterStartToken.length);
  const afterRoster = publicVbHtml.substring(endIndex);
  publicVbHtml = beforeRoster + '\n' + cardsHtml + '\n    ' + afterRoster;
} else {
  console.error('Could not find roster markers in src/public/voicebank.html');
  process.exit(1);
}

// Update counts: "all 55 characters", "ทั้งหมด (55)"
publicVbHtml = publicVbHtml.replace(/Voicebank repository of all \d+ characters/g, 'Voicebank repository of all 55 characters');
publicVbHtml = publicVbHtml.replace(/ทั้งหมด \(\d+\)/g, 'ทั้งหมด (55)');

fs.writeFileSync(publicVbPath, publicVbHtml, 'utf8');
console.log(`Updated ${publicVbPath} with ${VOICEBANKS.length} cards.`);
process.exit(0);
