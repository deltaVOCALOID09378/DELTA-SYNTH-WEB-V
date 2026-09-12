import fs from 'node:fs';
import path from 'node:path';

const voicebankDir = "G:\\.shortcut-targets-by-id\\1tboFHk0sj2Util_1CGBvqEPfV-qqCvMx\\All Voicebank for every Project in DELTA SYNTH";
const srcSingersDir = "e:\\Program Developing\\DELTA_SYNTH-main\\src\\public\\singers";
const rootSingersDir = "e:\\Program Developing\\DELTA_SYNTH-main\\Singer Profile\\singers";

function formatSize(bytes) {
  if (bytes >= 1024 * 1024 * 1024) {
    return (bytes / (1024 * 1024 * 1024)).toFixed(2) + ' GB';
  }
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

function detectFormat(filename) {
  const upper = filename.toUpperCase();
  if (upper.includes('DIFFSINGER') || upper.includes('AI SN') || upper.includes('AI NEW TYPE')) return 'DiffSinger AI';
  if (upper.includes('ARPASING') || upper.includes('APASING')) return 'UTAU Arpasing';
  if (upper.includes('VCCV')) return 'UTAU VCCV';
  if (upper.includes('CVVC')) return 'UTAU CVVC';
  if (upper.includes('VCV')) return 'UTAU VCV';
  if (upper.includes('CV')) return 'UTAU CV';
  return 'UTAU Voicebank';
}

function detectLanguage(filename) {
  const upper = filename.toUpperCase();
  if (upper.includes('TH-EN-JP') || upper.includes('EN-JP') || upper.includes('THAI-JPN') || upper.includes('ALL')) return 'Multi-lingual';
  if (upper.includes('THAI') || upper.includes('TH ') || upper.includes('THCCV')) return 'Thai';
  if (upper.includes('ENG') || upper.includes('ENGLISH') || upper.includes('ARPASING')) return 'English';
  if (upper.includes('JPN') || upper.includes('JP ') || upper.includes('JAPANESE') || upper.includes('KIRE')) return 'Japanese';
  if (upper.includes('CHI') || upper.includes('CHINESE')) return 'Chinese';
  return 'Multi-lingual';
}

function mapFileToSinger(file) {
  const lower = file.toLowerCase().replace(/[^a-z0-9]/g, '');
  if (lower.startsWith('arzbtv')) return 'arzbtv';
  if (lower.startsWith('ahctan')) return 'ahctan';
  if (lower.startsWith('arunkamonlanetr')) return 'arun_kamonlanetr';
  if (lower.startsWith('ayanami')) return 'ayanami_hikaru';
  if (lower.startsWith('azayaaika')) return 'azaya_aika';
  if (lower.startsWith('ballpowerine')) return 'ball_powerine';
  if (lower.startsWith('beempowerine')) return 'beem_powerine';
  if (lower.startsWith('bewpowerine')) return 'bew__powerine';
  if (lower.startsWith('charnsamorn') || lower.startsWith('chansamorn')) return 'chansamorn';
  if (lower.startsWith('chinoamechiyu')) return 'chansamorn';
  if (lower.startsWith('diwachi')) return 'diwachi';
  if (lower.startsWith('dokya')) return 'dokya';
  if (lower.startsWith('fangyu')) return 'fangyu';
  if (lower.startsWith('felix')) return 'felix';
  if (lower.startsWith('fellowwhite')) return 'fellowwhite';
  if (lower.startsWith('fuwaribento')) return 'fuwari_bento';
  if (lower.startsWith('gurenkani')) return 'guren_kani';
  if (lower.startsWith('haruhiko')) return 'haruhiko';
  if (lower.startsWith('helen')) return 'ayanami_hikaru';
  if (lower.startsWith('ibarakouya')) return 'ibara_kouya';
  if (lower.startsWith('jonu')) return 'jonu';
  if (lower.startsWith('kangfu')) return 'kangfu';
  if (lower.startsWith('kikakowausagi') || lower.startsWith('kikokawausagi')) return 'kikakowa_usagi';
  if (lower.startsWith('kira')) return 'kira';
  if (lower.startsWith('kochujang')) return 'kochujang';
  if (lower.startsWith('koizumisatoru')) return 'koizumi_satoru';
  if (lower.startsWith('mairu')) return 'mairu_maishi';
  if (lower.startsWith('mayuree')) return 'mayuree';
  if (lower.startsWith('miro')) return 'miro';
  if (lower.startsWith('mochiai')) return 'mochiai';
  if (lower.startsWith('mojinesora')) return 'mojine_sora';
  if (lower.startsWith('namphueng')) return 'namphueng';
  if (lower.startsWith('narisa')) return 'narisa';
  if (lower.startsWith('natsunetanda') || lower.startsWith('okaminarintanda') || lower.startsWith('okaminaritanda')) return 'okaminari_tanda';
  if (lower.startsWith('oboronetsukihana')) return 'yamada_satoru';
  if (lower.startsWith('onika')) return 'onika';
  if (lower.startsWith('quint')) return 'quint';
  if (lower.startsWith('relven')) return 'relven';
  if (lower.startsWith('root')) return 'root';
  if (lower.startsWith('sakultala') || lower.startsWith('sakuntala')) return 'sakultala';
  if (lower.startsWith('satozetsuto')) return 'yuuya_sato';
  if (lower.startsWith('savanna')) return 'savanna';
  if (lower.startsWith('shiroinomochi')) return 'shiroino_mochi';
  if (lower.startsWith('sriphan')) return 'sriphan';
  if (lower.startsWith('sun')) return 'sun';
  if (lower.startsWith('tackpee') || lower.startsWith('tagpy')) return 'tagpy';
  if (lower.startsWith('tenshisaburo')) return 'tenshi_saburo';
  if (lower.startsWith('thitiyaanantanetr')) return 'thitiya_anantanetr';
  if (lower.startsWith('tom')) return 'tom';
  if (lower.startsWith('toshiosasagawa')) return 'tom';
  if (lower.startsWith('uchusutori')) return 'uchu_sutori';
  if (lower.startsWith('utashinara')) return 'utashi_nara';
  if (lower.startsWith('yamadakimada')) return 'yamada_kimada';
  if (lower.startsWith('yamadasatoru')) return 'yamada_satoru';
  if (lower.startsWith('yamadatakeshi')) return 'yamada_takeshi';
  if (lower.startsWith('yokuatsutakuto')) return 'yokuatsu_takuto';
  if (lower.startsWith('yuuyasato')) return 'yuuya_sato';
  return null;
}

// Build map
const vbFiles = fs.readdirSync(voicebankDir);
const voicebanksBySinger = {};
for (const file of vbFiles) {
  const stat = fs.statSync(path.join(voicebankDir, file));
  const singer = mapFileToSinger(file);
  if (!singer) continue;
  if (!voicebanksBySinger[singer]) voicebanksBySinger[singer] = [];
  voicebanksBySinger[singer].push({
    filename: file,
    size: formatSize(stat.size),
    bytes: stat.size,
    format: detectFormat(file),
    language: detectLanguage(file)
  });
}

// Sort voicebanks within each singer: DiffSinger first, then by size desc
for (const s of Object.keys(voicebanksBySinger)) {
  voicebanksBySinger[s].sort((a, b) => {
    if (a.format === 'DiffSinger AI' && b.format !== 'DiffSinger AI') return -1;
    if (b.format === 'DiffSinger AI' && a.format !== 'DiffSinger AI') return 1;
    return b.bytes - a.bytes;
  });
}

function generateVoicebankHtml(singerId) {
  const items = voicebanksBySinger[singerId] || [];
  
  let listHtml = '';
  if (items.length > 0) {
    listHtml = items.map(item => {
      const isDiffSinger = item.format.includes('DiffSinger');
      const badgeClass = isDiffSinger ? 'vb-badge vb-badge-diffsinger' : 'vb-badge vb-badge-engine';
      return `              <div class="vb-archive-card">
                <div class="vb-archive-info">
                  <div class="vb-archive-name">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ff4422" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                    <span>${item.filename}</span>
                  </div>
                  <div class="vb-archive-meta">
                    <span class="${badgeClass}">${item.format}</span>
                    <span class="vb-badge vb-badge-lang">${item.language}</span>
                    <span class="vb-badge vb-badge-size">${item.size}</span>
                  </div>
                </div>
                <a class="vb-btn-download" 
                   href="https://drive.google.com/drive/folders/1tboFHk0sj2Util_1CGBvqEPfV-qqCvMx?usp=drive_link" 
                   target="_blank" 
                   rel="noopener noreferrer"
                   title="ดาวน์โหลด ${item.filename}">
                  <span>📥 ดาวน์โหลด</span>
                </a>
              </div>`;
    }).join('\n');
  } else {
    listHtml = `              <div class="vb-archive-card" style="border-style: dashed; justify-content: center; text-align: center; padding: 22px;">
                <div style="display:flex; flex-direction:column; align-items:center; gap:6px;">
                  <div style="font-size: 14px; font-weight: 600; color: #FFFFFF;">คลังเสียงอยู่ในขั้นตอนพัฒนา / กำลังเผยแพร่รุ่นใหม่</div>
                  <p style="font-size: 12px; color: #a0a0a0; margin: 0;">สามารถติดตามและเข้าถึงคลังเสียงผ่าน Google Drive หลักของสตูดิโอ DELTA SYNTH</p>
                </div>
              </div>`;
  }

  return `          <!-- Individual Voicebank Archives & Downloads -->
          <div class="vb-archive-section">
            <div class="vb-archive-title">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#cc2200" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>
              <span>คลังเสียงพร้อมดาวน์โหลด (${items.length} รายการ) · VOICEBANK ARCHIVES</span>
            </div>
            
            <div class="vb-archive-list">
${listHtml}
            </div>

            <div style="margin-top: 24px; text-align: center;">
              <a class="btn-drive" 
                 href="https://drive.google.com/drive/folders/1tboFHk0sj2Util_1CGBvqEPfV-qqCvMx?usp=drive_link" 
                 target="_blank" 
                 rel="noopener noreferrer">
                <span>📂 เข้าสู่คลังไดรฟ์หลัก DELTA SYNTH Voicebank Hub →</span>
              </a>
              <p style="margin-top: 10px; font-size: 12px; color: #a0a0a0;">
                เข้าถึงโฟลเดอร์รวมทั้งหมดบน <a href="https://drive.google.com/drive/folders/1tboFHk0sj2Util_1CGBvqEPfV-qqCvMx?usp=drive_link" target="_blank" rel="noopener noreferrer" style="color: #ff5533; text-decoration: underline;">Official Google Drive Voicebank Repository</a>
              </p>
            </div>
          </div>`;
}

function updateSingerFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  const filename = path.basename(filePath);
  if (filename === 'tackpee.html') return;
  const singerId = filename.replace('.html', '');

  // Replace Master Voicebank Access block or existing vb-archive-section
  const newVbHtml = generateVoicebankHtml(singerId);

  // Match existing download section
  const oldSectionRegex = /<!-- Master Voicebank Access & Download Buttons -->[\s\S]*?<\/div>\s*<\/div>\s*<\/div>\s*<\/div>\s*<\/main>/;
  const existingVbSectionRegex = /<!-- Individual Voicebank Archives & Downloads -->[\s\S]*?<\/div>\s*<\/div>\s*<\/div>\s*<\/div>\s*<\/main>/;

  if (oldSectionRegex.test(content)) {
    content = content.replace(oldSectionRegex, `${newVbHtml}\n        </div>\n      </div>\n    </div>\n  </div>\n</main>`);
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated voicebank list in: ${filename}`);
  } else if (existingVbSectionRegex.test(content)) {
    content = content.replace(existingVbSectionRegex, `${newVbHtml}\n        </div>\n      </div>\n    </div>\n  </div>\n</main>`);
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Re-updated voicebank list in: ${filename}`);
  } else {
    // Fallback: look for </main> and previous closing tags
    const fallbackRegex = /<div class="border-t border-gray-800\/60 pt-6 text-center flex flex-col items-center">[\s\S]*?<\/div>\s*<\/div>\s*<\/div>\s*<\/div>\s*<\/div>\s*<\/main>/;
    if (fallbackRegex.test(content)) {
      content = content.replace(fallbackRegex, `${newVbHtml}\n        </div>\n      </div>\n    </div>\n  </div>\n</main>`);
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`Updated via fallback in: ${filename}`);
    } else {
      console.warn(`Could not locate download section in: ${filename}`);
    }
  }
}

// Process both src/public/singers and Singer Profile/singers
const srcFiles = fs.readdirSync(srcSingersDir).filter(f => f.endsWith('.html'));
for (const f of srcFiles) {
  updateSingerFile(path.join(srcSingersDir, f));
}

if (fs.existsSync(rootSingersDir)) {
  const rootFiles = fs.readdirSync(rootSingersDir).filter(f => f.endsWith('.html'));
  for (const f of rootFiles) {
    updateSingerFile(path.join(rootSingersDir, f));
  }
}

console.log('Finished updating all singer profiles!');
