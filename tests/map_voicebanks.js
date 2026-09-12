import fs from 'node:fs';
import path from 'node:path';

const voicebankDir = "G:\\.shortcut-targets-by-id\\1tboFHk0sj2Util_1CGBvqEPfV-qqCvMx\\All Voicebank for every Project in DELTA SYNTH";
const singersDir = "e:\\Program Developing\\DELTA_SYNTH-main\\src\\public\\singers";

// Read all singer files
const singerFiles = fs.readdirSync(singersDir).filter(f => f.endsWith('.html') && f !== 'tackpee.html');
const singerIds = singerFiles.map(f => f.replace('.html', ''));

console.log(`Total singer profile pages: ${singerFiles.length}`);

// Read all voicebank files
const vbFiles = fs.readdirSync(voicebankDir);
console.log(`Total voicebank archive files: ${vbFiles.length}`);

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
  if (upper.includes('THAI') || upper.includes('TH ')) return 'Thai';
  if (upper.includes('ENG') || upper.includes('ENGLISH') || upper.includes('ARPASING')) return 'English';
  if (upper.includes('JPN') || upper.includes('JP ') || upper.includes('JAPANESE')) return 'Japanese';
  if (upper.includes('CHI') || upper.includes('CHINESE')) return 'Chinese';
  return 'Multi-lingual';
}

// Map each file to a singer
const mapping = {};
for (const sId of singerIds) {
  mapping[sId] = [];
}
// Also map tackpee to tagpy
mapping['tagpy'] = mapping['tagpy'] || [];

const unmapped = [];

for (const file of vbFiles) {
  const fullPath = path.join(voicebankDir, file);
  const stat = fs.statSync(fullPath);
  const sizeStr = formatSize(stat.size);
  const fmt = detectFormat(file);
  const lang = detectLanguage(file);
  
  const lower = file.toLowerCase().replace(/[^a-z0-9]/g, '');
  
  let matched = null;
  
  // Custom manual mappings for edge cases
  if (lower.startsWith('arzbtv')) matched = 'arzbtv';
  else if (lower.startsWith('ahctan')) matched = 'ahctan';
  else if (lower.startsWith('arunkamonlanetr')) matched = 'arun_kamonlanetr';
  else if (lower.startsWith('ayanami')) {
    if (lower.includes('kyoko')) matched = 'ayanami_hikaru'; // Kyoko is sister/variant or Hikaru? Let's check
    else matched = 'ayanami_hikaru';
  }
  else if (lower.startsWith('azayaaika')) matched = 'azaya_aika';
  else if (lower.startsWith('ballpowerine')) matched = 'ball_powerine';
  else if (lower.startsWith('beempowerine')) matched = 'beem_powerine';
  else if (lower.startsWith('bewpowerine')) matched = 'bew__powerine';
  else if (lower.startsWith('charnsamorn') || lower.startsWith('chansamorn')) matched = 'chansamorn';
  else if (lower.startsWith('chinoamechiyu')) matched = 'chansamorn'; // or other?
  else if (lower.startsWith('diwachi')) matched = 'diwachi';
  else if (lower.startsWith('dokya')) matched = 'dokya';
  else if (lower.startsWith('fangyu')) matched = 'fangyu';
  else if (lower.startsWith('felix')) matched = 'felix';
  else if (lower.startsWith('fellowwhite')) matched = 'fellowwhite';
  else if (lower.startsWith('fuwaribento')) matched = 'fuwari_bento';
  else if (lower.startsWith('gurenkani')) matched = 'guren_kani';
  else if (lower.startsWith('haruhiko')) matched = 'haruhiko';
  else if (lower.startsWith('helen')) matched = 'ayanami_hikaru'; // or Helen
  else if (lower.startsWith('ibarakouya')) matched = 'ibara_kouya';
  else if (lower.startsWith('jonu')) matched = 'jonu';
  else if (lower.startsWith('kangfu')) matched = 'kangfu';
  else if (lower.startsWith('kikakowausagi') || lower.startsWith('kikokawausagi')) matched = 'kikakowa_usagi';
  else if (lower.startsWith('kira')) matched = 'kira';
  else if (lower.startsWith('kochujang')) matched = 'kochujang';
  else if (lower.startsWith('koizumisatoru')) matched = 'koizumi_satoru';
  else if (lower.startsWith('mairu')) matched = 'mairu_maishi';
  else if (lower.startsWith('mayuree')) matched = 'mayuree';
  else if (lower.startsWith('miro')) matched = 'miro';
  else if (lower.startsWith('mochiai')) matched = 'mochiai';
  else if (lower.startsWith('mojinesora')) matched = 'mojine_sora';
  else if (lower.startsWith('namphueng')) matched = 'namphueng';
  else if (lower.startsWith('narisa')) matched = 'narisa';
  else if (lower.startsWith('natsunetanda') || lower.startsWith('okaminarintanda') || lower.startsWith('okaminaritanda')) matched = 'okaminari_tanda';
  else if (lower.startsWith('oboronetsukihana')) matched = 'yamada_satoru'; // let's check
  else if (lower.startsWith('onika')) matched = 'onika';
  else if (lower.startsWith('quint')) matched = 'quint';
  else if (lower.startsWith('relven')) matched = 'relven';
  else if (lower.startsWith('root')) matched = 'root';
  else if (lower.startsWith('sakultala') || lower.startsWith('sakuntala')) matched = 'sakultala';
  else if (lower.startsWith('satozetsuto')) matched = 'yuuya_sato';
  else if (lower.startsWith('savanna')) matched = 'savanna';
  else if (lower.startsWith('shiroinomochi')) matched = 'shiroino_mochi';
  else if (lower.startsWith('sriphan')) matched = 'sriphan';
  else if (lower.startsWith('sun')) matched = 'sun';
  else if (lower.startsWith('tackpee') || lower.startsWith('tagpy')) matched = 'tagpy';
  else if (lower.startsWith('tenshisaburo')) matched = 'tenshi_saburo';
  else if (lower.startsWith('thitiyaanantanetr')) matched = 'thitiya_anantanetr';
  else if (lower.startsWith('tom')) matched = 'tom';
  else if (lower.startsWith('toshiosasagawa')) matched = 'tom';
  else if (lower.startsWith('uchusutori')) matched = 'uchu_sutori';
  else if (lower.startsWith('utashinara')) matched = 'utashi_nara';
  else if (lower.startsWith('yamadakimada')) matched = 'yamada_kimada';
  else if (lower.startsWith('yamadasatoru')) matched = 'yamada_satoru';
  else if (lower.startsWith('yamadatakeshi')) matched = 'yamada_takeshi';
  else if (lower.startsWith('yokuatsutakuto')) matched = 'yokuatsu_takuto';
  else if (lower.startsWith('yuuyasato')) matched = 'yuuya_sato';

  const entry = {
    filename: file,
    size: sizeStr,
    bytes: stat.size,
    format: fmt,
    language: lang,
    matchedSinger: matched
  };

  if (matched && mapping[matched]) {
    mapping[matched].push(entry);
  } else {
    unmapped.push(entry);
  }
}

console.log("\n--- SINGER MAPPING STATS ---");
let totalMapped = 0;
for (const [sId, list] of Object.entries(mapping)) {
  console.log(`${sId}: ${list.length} voicebanks`);
  totalMapped += list.length;
}
console.log(`\nTotal mapped: ${totalMapped} / ${vbFiles.length}`);
if (unmapped.length > 0) {
  console.log("\nUnmapped files:");
  for (const u of unmapped) {
    console.log(`  ${u.filename}`);
  }
}

fs.writeFileSync('src/public/voicebanks_mapped.json', JSON.stringify(mapping, null, 2), 'utf8');
console.log("Successfully wrote src/public/voicebanks_mapped.json");

