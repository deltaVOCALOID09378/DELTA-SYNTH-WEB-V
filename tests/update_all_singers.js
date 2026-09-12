import fs from 'node:fs';
import path from 'node:path';

const RAW_VOICEBANKS = [
  { file: "ARZBTV English Arpasing v.1.0.rar", bytes: 93870130, singer: "arzbtv" },
  { file: "ARZBTV II 2026 JPN VCV v.1.0.rar", bytes: 85918331, singer: "arzbtv" },
  { file: "ARZBTV THAI VCCV v.1.0.zip", bytes: 43628769, singer: "arzbtv" },
  { file: "Ahctan Airy Mode in 2026 JPN VCV v.2.0.rar", bytes: 51212390, singer: "ahctan" },
  { file: "Ahctan ENG Arpasing v.1.0.rar", bytes: 118088326, singer: "ahctan" },
  { file: "Ahctan JPN VCV v1.0.rar", bytes: 97126881, singer: "ahctan" },
  { file: "Ahctan Thai VCCV v1.0.zip", bytes: 32516474, singer: "ahctan" },
  { file: "Arun Kamonlanetr JP VCV Multipitch.rar", bytes: 54935317, singer: "arun_kamonlanetr" },
  { file: "Arun Kamonlanetr Special 2026 JPN VCV v.1.0 (1).rar", bytes: 100801259, singer: "arun_kamonlanetr" },
  { file: "Arun Kamonlanetr Special 2026 JPN VCV v.1.0.rar", bytes: 100801259, singer: "arun_kamonlanetr" },
  { file: "Arun Kamonlanetr THAI VCCV 2025.rar", bytes: 85339886, singer: "arun_kamonlanetr" },
  { file: "Ayanami  Hikaru JP CV5 2020.rar", bytes: 57747016, singer: "ayanami_hikaru" },
  { file: "Ayanami Hikaru 2019 Voice Voicebank JPN VCV v.1.0.rar", bytes: 93934663, singer: "ayanami_hikaru" },
  { file: "Ayanami Hikaru 2021 ENG CZ VCCV1 v.1.5.rar", bytes: 228367470, singer: "ayanami_hikaru" },
  { file: "Ayanami Hikaru 2021 Thai VCCV v.2.3.rar", bytes: 119052887, singer: "ayanami_hikaru" },
  { file: "Ayanami Hikaru AI SN 6th v.1.0.rar", bytes: 366841826, singer: "ayanami_hikaru" },
  { file: "Ayanami Hikaru AI SN 6th v.1.3.rar", bytes: 443426077, singer: "ayanami_hikaru" },
  { file: "Ayanami Hikaru EVO 6th ENG Arpasing v.4.0.rar", bytes: 56902474, singer: "ayanami_hikaru" },
  { file: "Ayanami Hikaru EVO Thai CVVC v.1.0.rar", bytes: 55207764, singer: "ayanami_hikaru" },
  { file: "Ayanami Hikaru Japanese VCV Kire.rar", bytes: 98781726, singer: "ayanami_hikaru" },
  { file: "Ayanami Hikaru Official EVO Set ENG v.1.8.rar", bytes: 177383404, singer: "ayanami_hikaru" },
  { file: "Ayanami Hikaru Official EVO Set JPN VCV v.1.9.rar", bytes: 171665193, singer: "ayanami_hikaru" },
  { file: "Ayanami Hikaru The 1st 2019 JP CV v.1.0.rar", bytes: 10432380, singer: "ayanami_hikaru" },
  { file: "Ayanami Hikaru The 1st 2019 Thai CVVC v.1.0.rar", bytes: 57024655, singer: "ayanami_hikaru" },
  { file: "Ayanami Hikaru The Official 2026 Set Of JPN VCV v.1.0.rar", bytes: 110543994, singer: "ayanami_hikaru" },
  { file: "Ayanami Kyoko AI SN v.1.1.rar", bytes: 436828080, singer: "ayanami_hikaru" },
  { file: "Ayanami Kyoko EVO 6th Japanese CV v.1.0.rar", bytes: 24246566, singer: "ayanami_hikaru" },
  { file: "Ayanami Kyoko EVO ENG Arpasing 2024 v.1.0.rar", bytes: 58021123, singer: "ayanami_hikaru" },
  { file: "Ayanami Kyoko JPN VCV v.1.0.rar", bytes: 91608350, singer: "ayanami_hikaru" },
  { file: "Ayanami Kyoko Thai VCCV v.2.0.rar", bytes: 132041171, singer: "ayanami_hikaru" },
  { file: "Ayanami kyoko ENG Arpasing Beta v.1.0.rar", bytes: 147253571, singer: "ayanami_hikaru" },
  { file: "Azaya Aika For 2026 English Arpasing v.1.0.rar", bytes: 115373321, singer: "azaya_aika" },
  { file: "Azaya Aika The First Type 2026 JPN VCV v.1.0.rar", bytes: 102731448, singer: "azaya_aika" },
  { file: "Beem Powerine AI New Type in 2026 JPN VCV v.1.0 (1).rar", bytes: 78478850, singer: "beem_powerine" },
  { file: "Beem Powerine AI New Type in 2026 JPN VCV v.1.0.rar", bytes: 78478850, singer: "beem_powerine" },
  { file: "Beem Powerine New Type in 2026 For English Arpasing v.1.0.rar", bytes: 55638669, singer: "beem_powerine" },
  { file: "Bew Powerine AI New Type in 2026 JPN VCV v.1.0 (1).rar", bytes: 82988532, singer: "bew__powerine" },
  { file: "Bew Powerine AI New Type in 2026 JPN VCV v.1.0.rar", bytes: 82988532, singer: "bew__powerine" },
  { file: "Bew Powerine New Type in 2026 For English Arpasing v.1.0.rar", bytes: 96193366, singer: "bew__powerine" },
  { file: "Bew Powerine Upgrade JPN CV 2025 v.1.0.rar", bytes: 60187128, singer: "bew__powerine" },
  { file: "Charnsamorn English Arpasing v.1.0.rar", bytes: 104185113, singer: "chansamorn" },
  { file: "Charnsamorn New For 2026 JPN VCV v.1.0.rar", bytes: 58361568, singer: "chansamorn" },
  { file: "Chinoame Chiyu VCV Multipitch.rar", bytes: 216492456, singer: "chansamorn" },
  { file: "Chinoame Chiyu VCV.rar", bytes: 68180291, singer: "chansamorn" },
  { file: "DIWACHI  Full Type JP VCV v.1.0.rar", bytes: 70053627, singer: "diwachi" },
  { file: "Diwachi Full Type 2025 ENG Arpasing v.1.0.rar", bytes: 79093893, singer: "diwachi" },
  { file: "Dokya English Arpasing v.1.0.rar", bytes: 116464778, singer: "dokya" },
  { file: "Dokya JPN VCV v.1.1.rar", bytes: 61880145, singer: "dokya" },
  { file: "FangYu JPN VCV v.1.0.0.rar", bytes: 96211742, singer: "fangyu" },
  { file: "Fangyu ENG Arpasing v.1.0.rar", bytes: 60780955, singer: "fangyu" },
  { file: "Fangyu ENG Arpasing v.1.0.zip", bytes: 121534797, singer: "fangyu" },
  { file: "Felix Callobration 6th ENG Arpasing v.1.0.zip", bytes: 134178098, singer: "felix" },
  { file: "Felix Callobration 6th JPN VCV v.1.4.rar", bytes: 65264273, singer: "felix" },
  { file: "FellowWhite ENG Arpasing v.1.0.rar", bytes: 108822847, singer: "fellowwhite" },
  { file: "FellowWhite JPN VCV v1.0.rar", bytes: 98687908, singer: "fellowwhite" },
  { file: "FellowWhite in Full EN-JP v.1.0.rar", bytes: 92555990, singer: "fellowwhite" },
  { file: "Fuwari Bento Diffsinger V.1.0.1.rar", bytes: 450038828, singer: "fuwari_bento" },
  { file: "Fuwari Bento Full 2025 ENG Arpasing v.1.0.rar", bytes: 92802717, singer: "fuwari_bento" },
  { file: "Fuwari Bento New 2026 JPN VCV v.1.0.rar", bytes: 94458287, singer: "fuwari_bento" },
  { file: "Fuwari Bento VCV Upgrade 2025.rar", bytes: 42763517, singer: "fuwari_bento" },
  { file: "Guren Kani 2019 Japanese CV.rar", bytes: 12553583, singer: "guren_kani" },
  { file: "Guren Kani EVO ENG Arpasing 2022.rar", bytes: 135186444, singer: "guren_kani" },
  { file: "Guren Kani EVO For 2026 English Arpasing v.1.0.rar", bytes: 104854877, singer: "guren_kani" },
  { file: "Guren Kani EVO JPN VCV v.2.0.zip", bytes: 79772167, singer: "guren_kani" },
  { file: "Guren Kani Fix 6th THAI CVVC.rar", bytes: 80905039, singer: "guren_kani" },
  { file: "Haruhiko Normal Mode for Collaboration in 2026 English Arpasing v.1.0.rar", bytes: 110536654, singer: "haruhiko" },
  { file: "Helen for 7th Aniversary English Arpasing v.1.0.rar", bytes: 97779272, singer: "ayanami_hikaru" },
  { file: "Helen for 7th Aniversary JPN VCV v.1.0.rar", bytes: 106925361, singer: "ayanami_hikaru" },
  { file: "Ibara Kouya Callaboration  in 2025 English Arpasing v.1.0.rar", bytes: 95147186, singer: "ibara_kouya" },
  { file: "Ibara Kouya For Collaboration in 2026 JPN VCV v.1.0.rar", bytes: 100593240, singer: "ibara_kouya" },
  { file: "Jonu For the Collaboration in 2026 English Arpasing v.1.0.rar", bytes: 102104996, singer: "jonu" },
  { file: "Jonu The Collaboration in 2026 JPN VCV v.1.0 (1).rar", bytes: 99854448, singer: "jonu" },
  { file: "Jonu The Collaboration in 2026 JPN VCV v.1.0.rar", bytes: 99854448, singer: "jonu" },
  { file: "KangFu Full Type ENG Arpasing v.2.0.rar", bytes: 101198428, singer: "kangfu" },
  { file: "KangFu JP VCV Full Type v1.1.rar", bytes: 59359879, singer: "kangfu" },
  { file: "KangFu JP VCV Full v.1.5.rar", bytes: 109149107, singer: "kangfu" },
  { file: "Kikokawa Usagi For Collaboration in 2026 English Arpasing v.1.0.rar", bytes: 87696900, singer: "kikakowa_usagi" },
  { file: "Kikokawa Usagi New Type JPN VCV v.1.0.zip", bytes: 100821049, singer: "kikakowa_usagi" },
  { file: "Kira Full Type 2025 ENG Arpasing v.1.9.zip", bytes: 137550428, singer: "kira" },
  { file: "Kira The 1st Type JPN VCV v.1.0.rar", bytes: 101195874, singer: "kira" },
  { file: "Kochujang EVO 2025 ENG Arpasing v.2.1.rar", bytes: 87240941, singer: "kochujang" },
  { file: "Kochujang EVO 6th  JPN VCV v1.1.rar", bytes: 110676866, singer: "kochujang" },
  { file: "Kochujang EVO 6th  Thai VCCV v.1.0.zip", bytes: 53040453, singer: "kochujang" },
  { file: "Koizumi Satoru Airy Mode For Collaboration in 2026 English Arpasing v.1.0.rar", bytes: 100355622, singer: "koizumi_satoru" },
  { file: "Koizumi Satoru For Callaboration in 2026 English Arpasing v.1.0.rar", bytes: 167692578, singer: "koizumi_satoru" },
  { file: "Koizumi Satoru Normal Mode For Collaboration in 2026 JPN VCV v.1.0 (1).rar", bytes: 119524104, singer: "koizumi_satoru" },
  { file: "Koizumi Satoru Normal Mode For Collaboration in 2026 JPN VCV v.1.0.rar", bytes: 119524104, singer: "koizumi_satoru" },
  { file: "MAIRU JP CVVC  BETA.rar", bytes: 6518421, singer: "mairu_maishi" },
  { file: "Mairu Maishi Cute JPN VCV v.2.0.rar", bytes: 64046345, singer: "mairu_maishi" },
  { file: "Mairu Maishi Cute Mode For English Arpasing v.1.0.rar", bytes: 127755135, singer: "mairu_maishi" },
  { file: "Mairu Maishi Power ENG Arpasing v.1.1.5.rar", bytes: 67364659, singer: "mairu_maishi" },
  { file: "Mairu Maishi Power ENG Arpasing v1.1.1.rar", bytes: 67039093, singer: "mairu_maishi" },
  { file: "Mairu Maishi Power JPN VCV v.1.0.rar", bytes: 100952815, singer: "mairu_maishi" },
  { file: "Mairu Maishi Power Mode For English Arpasing v.2.0.rar", bytes: 90716281, singer: "mairu_maishi" },
  { file: "Mairu Maishi Power v.2.0.zip", bytes: 368300889, singer: "mairu_maishi" },
  { file: "Mairu Maishi Power. Thai VCCV v.1.0.rar", bytes: 39736665, singer: "mairu_maishi" },
  { file: "Mayuree English Arpasing v.1.0.rar", bytes: 90199869, singer: "mayuree" },
  { file: "MayureeAI The 1st Generation 2026 JPN VCV v.1.0.rar", bytes: 100572427, singer: "mayuree" },
  { file: "Miro Ace2 ENG Arpasing v.1.0.rar", bytes: 122995928, singer: "miro" },
  { file: "Miro English Arpasing v.2.0.rar", bytes: 108302114, singer: "miro" },
  { file: "Miro JPN VCV v.1.0.rar", bytes: 84345511, singer: "miro" },
  { file: "Mojine Sora For Collaboration in 2026 JPN VCV v.1.0.rar", bytes: 58138770, singer: "mojine_sora" },
  { file: "Namphueng ENG Arpasing v.1.3.rar", bytes: 92207183, singer: "namphueng" },
  { file: "Namphueng English Arpasing v.2.0.rar", bytes: 114664794, singer: "namphueng" },
  { file: "NamphuengAI JPN VCV v.1.0.rar", bytes: 93194885, singer: "namphueng" },
  { file: "Narisa Adult JPN VCV v.1.0.rar", bytes: 83909110, singer: "narisa" },
  { file: "Narisa Adult Mode English Arpasing v.1.0.rar", bytes: 94692086, singer: "narisa" },
  { file: "Narisa Cheerful Mode Voicebank JPN VCV v.1.0.rar", bytes: 174475717, singer: "narisa" },
  { file: "Narisa Power Mode English Arpasing v.1.0.rar", bytes: 94554159, singer: "narisa" },
  { file: "Narisa Soft Mode English Arpasing v.1.0 (1).rar", bytes: 94522474, singer: "narisa" },
  { file: "Narisa Soft Mode English Arpasing v.1.0.rar", bytes: 94522474, singer: "narisa" },
  { file: "Narisa Soft Mode Voicebank JPN VCV v.1.0.rar", bytes: 165205714, singer: "narisa" },
  { file: "Natsune Tanda For Collaboration in 2026 JPN VCV v.1.0.rar", bytes: 54763361, singer: "okaminari_tanda" },
  { file: "Oborone Tsukihana ENG Arpasing v.1.0.rar", bytes: 91279970, singer: "yamada_satoru" },
  { file: "Oborone Tsukihana JPN CV V.1.0.rar", bytes: 25784659, singer: "yamada_satoru" },
  { file: "Onika JPN VCV Collaboration v.1.0..rar", bytes: 64970935, singer: "onika" },
  { file: "Onika New Full Type in 2026 English Arpasing v.1.0.rar", bytes: 91227571, singer: "onika" },
  { file: "Onika New Type 2026 JPN VCV v.2.0.rar", bytes: 60130437, singer: "onika" },
  { file: "Onika The First Type for ENG Arpasing v.1.0.rar", bytes: 232732230, singer: "onika" },
  { file: "Quint New Type For Collaboration in 2026 English Arpasing v.1.0.rar", bytes: 104580137, singer: "quint" },
  { file: "Quint New Type For Collaboration in 2026 JPN VCV v.1.6.rar", bytes: 91407454, singer: "quint" },
  { file: "RelVeN New For 2026 JPN VCV v.1.0.rar", bytes: 57872709, singer: "relven" },
  { file: "RelVen in Full TH-EN-JP v.1.0.rar", bytes: 205419326, singer: "relven" },
  { file: "Relven JPN VCV v.1.0.rar", bytes: 80284202, singer: "relven" },
  { file: "Root Normal ENG Arpasing v.1.0.rar", bytes: 104289300, singer: "root" },
  { file: "Root Normal JPN VCV v.1.0.rar", bytes: 58484744, singer: "root" },
  { file: "Root Normal Mode in 2026 English Arpasing v.2.0.rar", bytes: 115692924, singer: "root" },
  { file: "SRIPHAN For The 7th Aniversary For English Arpasing v.1.0.rar", bytes: 103382213, singer: "sriphan" },
  { file: "SRIPHAN New Upgrade in 2026 JPN VCV v.1.0.rar", bytes: 102308889, singer: "sriphan" },
  { file: "SRIPHAN The Original Vocal in Thai VCCV v.1.6.rar", bytes: 44915335, singer: "sriphan" },
  { file: "SUN  Original Vocal in 2021 ENG Apasing v.1.8.rar", bytes: 84192024, singer: "sun" },
  { file: "SUN EVO 2025 ENG Arpasing v.2.0.rar", bytes: 87700569, singer: "sun" },
  { file: "SUN EVO in 2025  JPN VCV v1.0.rar", bytes: 111485862, singer: "sun" },
  { file: "SUN Original Vocal in 2021 JPN CV v.1.8.rar", bytes: 13310824, singer: "sun" },
  { file: "SUN Original Vocal in 2021 Thai VCCV v.1.8.rar", bytes: 71593018, singer: "sun" },
  { file: "Sakultala The First  Type in 2026  English Arpasing v.1.0.rar", bytes: 157021553, singer: "sakultala" },
  { file: "SakuntalaAI New For 2026 JPN VCV v.1.0.rar", bytes: 123871245, singer: "sakultala" },
  { file: "Sato Zetsuto JP VCV 2025.rar", bytes: 90398206, singer: "yuuya_sato" },
  { file: "Savanna The First Type in 2026 JPN VCV v.1.0.rar", bytes: 95926021, singer: "savanna" },
  { file: "Shiroino Mochi Adult Mode in Collaboration 2025 ENG Arpasing v.1.0.rar", bytes: 102780419, singer: "shiroino_mochi" },
  { file: "Shiroino Mochi Soft Mode For Collaboration in 2026  JPN VCV v.1.0.rar", bytes: 89174115, singer: "shiroino_mochi" },
  { file: "TackPee English Arpasing v.1.0.rar", bytes: 90248771, singer: "tagpy" },
  { file: "Tackpee JPN VCV v.1.0 (1).rar", bytes: 103467374, singer: "tagpy" },
  { file: "Tackpee JPN VCV v.1.0.rar", bytes: 103467374, singer: "tagpy" },
  { file: "Tenshi Saburo English Arpasing v.1.0.rar", bytes: 119752171, singer: "tenshi_saburo" },
  { file: "Tenshi Saburo New Type for 2026 JPN VCV v.1.0 (1).rar", bytes: 88522101, singer: "tenshi_saburo" },
  { file: "Tenshi Saburo New Type for 2026 JPN VCV v.1.0 (2).rar", bytes: 88522101, singer: "tenshi_saburo" },
  { file: "Tenshi Saburo New Type for 2026 JPN VCV v.1.0.rar", bytes: 88522101, singer: "tenshi_saburo" },
  { file: "Thitiya Anantanetr Full type in 2026 English Arpasing v.1.0.rar", bytes: 110528232, singer: "thitiya_anantanetr" },
  { file: "Thitiya Anantanetr JPN VCV Full Part 6th.rar", bytes: 95524412, singer: "thitiya_anantanetr" },
  { file: "Thitiya Anantanetr New Pack in 2026 JPN VCV v.1.0 (1).rar", bytes: 98132899, singer: "thitiya_anantanetr" },
  { file: "Thitiya Anantanetr New Pack in 2026 JPN VCV v.1.0.rar", bytes: 98132899, singer: "thitiya_anantanetr" },
  { file: "Tom JPN VCV v1.0.zip", bytes: 101732218, singer: "tom" },
  { file: "TomAI Normal ENG Arpasing v.1.4.rar", bytes: 135629459, singer: "tom" },
  { file: "Toshio Sasagawa 笹川トシオ ENG Arpasing.rar", bytes: 91250590, singer: "tom" },
  { file: "Uchu Sutori English Arpasing v.1.0.rar", bytes: 99857810, singer: "uchu_sutori" },
  { file: "Uchu Sutori JPN VCV v.1.0.rar", bytes: 84278951, singer: "uchu_sutori" },
  { file: "Uchu Sutori JPN VCV v.2.0.rar", bytes: 59865009, singer: "uchu_sutori" },
  { file: "Uchu Sutori TH-EN-JP Pack v.2.0.rar", bytes: 207564133, singer: "uchu_sutori" },
  { file: "Utashi Nara English Arpasing v.1.0.rar", bytes: 87880966, singer: "utashi_nara" },
  { file: "Utashi Nara for The Callaboration in 2026 JPN VCV v.1.0 (1).rar", bytes: 83647735, singer: "utashi_nara" },
  { file: "Utashi Nara for The Callaboration in 2026 JPN VCV v.1.0.rar", bytes: 83647735, singer: "utashi_nara" },
  { file: "Yamada Satoru English Arpasing v.1.0.rar", bytes: 93740113, singer: "yamada_satoru" },
  { file: "Yamada Takeshi Original Vocal in JPN CV v.1.0.rar", bytes: 16391599, singer: "yamada_takeshi" },
  { file: "Yokuatsu Takuto Beta The First Voice Collaboration 2025 ENG Arpasing v.1.0.rar", bytes: 113494550, singer: "yokuatsu_takuto" },
  { file: "Yokuatsu Takuto New Generation 2026 JPN VCV v.1.0.rar", bytes: 87055687, singer: "yokuatsu_takuto" },
  { file: "Yokuatsu Takuto Old Type JPN VCV v.1.0.rar", bytes: 58852796, singer: "yokuatsu_takuto" }
];

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

const voicebanksBySinger = {};
for (const item of RAW_VOICEBANKS) {
  if (!voicebanksBySinger[item.singer]) voicebanksBySinger[item.singer] = [];
  voicebanksBySinger[item.singer].push({
    filename: item.file,
    size: formatSize(item.bytes),
    bytes: item.bytes,
    format: detectFormat(item.file),
    language: detectLanguage(item.file)
  });
}

// Sort: DiffSinger first, then larger archives
for (const s of Object.keys(voicebanksBySinger)) {
  voicebanksBySinger[s].sort((a, b) => {
    if (a.format === 'DiffSinger AI' && b.format !== 'DiffSinger AI') return -1;
    if (b.format === 'DiffSinger AI' && a.format !== 'DiffSinger AI') return 1;
    return b.bytes - a.bytes;
  });
}

// Save json
fs.writeFileSync('src/public/voicebanks_catalog.json', JSON.stringify(voicebanksBySinger, null, 2), 'utf8');
console.log(`Saved src/public/voicebanks_catalog.json with ${RAW_VOICEBANKS.length} voicebanks mapped across ${Object.keys(voicebanksBySinger).length} singers.`);

function generateVoicebankHtml(singerId) {
  const items = voicebanksBySinger[singerId] || [];
  
  let listHtml = '';
  if (items.length > 0) {
    listHtml = items.map(item => {
      const isDiffSinger = item.format.includes('DiffSinger');
      const badgeClass = isDiffSinger ? 'vb-badge vb-badge-diffsinger' : 'vb-badge vb-badge-engine';
      return `            <div class="vb-archive-card">
              <div class="vb-archive-info">
                <div class="vb-archive-name">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#ff4422" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
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
                <span>⚡ ดาวน์โหลด</span>
              </a>
            </div>`;
    }).join('\n');
  } else {
    listHtml = `            <div class="vb-archive-card" style="border-style: dashed; justify-content: center; text-align: center; padding: 22px;">
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

  const newSection = generateVoicebankHtml(singerId);

  const marker1 = '<!-- Master Voicebank Access & Download Buttons -->';
  const marker2 = '<!-- Individual Voicebank Archives & Downloads -->';

  let startIdx = content.indexOf(marker1);
  if (startIdx === -1) {
    startIdx = content.indexOf(marker2);
  }

  const endIdx = content.indexOf('</main>');

  if (startIdx !== -1 && endIdx !== -1 && startIdx < endIdx) {
    const before = content.slice(0, startIdx);
    const after = content.slice(endIdx);
    const replacement = `${newSection}\n        </div>\n      </div>\n    </div>\n  </div>\n`;
    content = before + replacement + after;
    fs.writeFileSync(filePath, content, 'utf8');
    return true;
  } else {
    console.warn(`Marker not found in: ${filename}`);
    return false;
  }
}

const srcSingersDir = "src/public/singers";
const srcFiles = fs.readdirSync(srcSingersDir).filter(f => f.endsWith('.html'));
let srcCount = 0;
for (const f of srcFiles) {
  if (updateSingerFile(path.join(srcSingersDir, f))) srcCount++;
}
console.log(`Updated ${srcCount} singer files in src/public/singers.`);

const rootSingersDir = "Singer Profile/singers";
if (fs.existsSync(rootSingersDir)) {
  const rootFiles = fs.readdirSync(rootSingersDir).filter(f => f.endsWith('.html'));
  let rootCount = 0;
  for (const f of rootFiles) {
    if (updateSingerFile(path.join(rootSingersDir, f))) rootCount++;
  }
  console.log(`Updated ${rootCount} singer files in Singer Profile/singers.`);
}

console.log("SUCCESS: All singer profile pages now hang their voicebank archive files directly!");
