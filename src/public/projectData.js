/**
 * DELTA SYNTH — Projects, Files, Events & Activities Catalog
 * 
 * Standards from AGENT.md:
 * - Thai & English Bilingual
 * - Resource file formats: USTX (OpenUtau), MIDI, SVP (Synthesizer V), VSQX (Vocaloid)
 * 
 * Made And Checked By DELTA SYNTH & Gemini AI
 */

export const PROJECTS = [
  {
    id: 'diffsinger_upgrade_2025',
    title: 'DiffSinger AI Engine Upgrade Project',
    titleTh: 'โครงการยกระดับเสียงร้องสู่ DiffSinger AI',
    category: 'AI Engine',
    status: 'In Progress',
    date: '2025-06-15',
    description: 'พัฒนาและเทรนโมเดล DiffSinger สำหรับนักร้องในสังกัด DELTA SYNTH เพื่อคุณภาพเสียงร้องระดับสตูดิโอระดับสากล',
    languages: ['Thai', 'English', 'Japanese', 'Chinese', 'Korean', 'French', 'Spanish'],
    singers: ['Ayanami Hikaru', 'SUN', 'Guren Kani', 'Kochujang', 'Thitiya Anantanetr'],
    collaborators: ['Printmov Team', 'DELTA SYNTH Studio'],
    link: 'project.html'
  },
  {
    id: 'openutau_thai_phonemizer',
    title: 'OpenUtau Thai Phonemizer Optimization',
    titleTh: 'การเพิ่มประสิทธิภาพระบบโฟนีไมเซอร์ภาษาไทยบน OpenUtau',
    category: 'Phonemizer',
    status: 'Completed',
    date: '2025-03-01',
    description: 'ปรับปรุง Dictionary และ Timing Spacing เพื่อการออกเสียงภาษาไทยที่ราบรื่น ไม่สะดุด และเป็นธรรมชาติที่สุด',
    languages: ['Thai'],
    singers: ['All 54 Singers'],
    collaborators: ['DELTA SYNTH Core Dev Team'],
    link: 'project.html'
  },
  {
    id: 'digital_vocal_archive',
    title: 'DELTA SYNTH Digital Vocal Archive & Web Portal',
    titleTh: 'คลังจัดเก็บและพอร์ทัลเสียงร้องดิจิทัล DELTA SYNTH',
    category: 'Web Platform',
    status: 'Active',
    date: '2026-08-01',
    description: 'ระบบศูนย์กลางรวมประวัติ ไฟล์เสียง และโปรไฟล์ของนักร้องเสมือนจริง 54 คน พร้อมระบบดาวน์โหลดความเร็วสูง',
    languages: ['Thai', 'English'],
    singers: ['All DELTA SYNTH Singers'],
    collaborators: ['DELTA SYNTH & Gemini AI'],
    link: 'index.html'
  }
];

export const MUSIC_FILES = [
  {
    id: 'file_001',
    title: 'Starlight Dreamer (ผู้ท่องดวงดาว)',
    producer: 'DELTA SYNTH Official',
    format: 'USTX',
    bpm: 135,
    key: 'C Major',
    compatibleEngine: 'OpenUtau',
    recommendedSinger: 'Ayanami Hikaru',
    downloadUrl: 'https://drive.google.com/file/d/DELTA_USTX_001',
    fileSize: '4.2 MB',
    dateAdded: '2025-05-10'
  },
  {
    id: 'file_002',
    title: 'Midnight Highway (ทางหลวงเที่ยงคืน)',
    producer: 'DELTA SYNTH Official',
    format: 'SVP',
    bpm: 128,
    key: 'F# Minor',
    compatibleEngine: 'Synthesizer V / OpenUtau',
    recommendedSinger: 'SUN',
    downloadUrl: 'https://drive.google.com/file/d/DELTA_SVP_002',
    fileSize: '2.8 MB',
    dateAdded: '2025-05-20'
  },
  {
    id: 'file_003',
    title: 'Cyber Pulse Resonance',
    producer: 'DELTA SYNTH & Collab Team',
    format: 'MIDI',
    bpm: 140,
    key: 'A Minor',
    compatibleEngine: 'Any DAW / MIDI Sequencer',
    recommendedSinger: 'Bew Powerine',
    downloadUrl: 'https://drive.google.com/file/d/DELTA_MIDI_003',
    fileSize: '150 KB',
    dateAdded: '2025-06-01'
  },
  {
    id: 'file_004',
    title: 'Sakura Petals in the Rain',
    producer: 'DELTA SYNTH Japan Collab',
    format: 'VSQX',
    bpm: 95,
    key: 'G Major',
    compatibleEngine: 'Vocaloid 4/5/6 / OpenUtau',
    recommendedSinger: 'Kikokawa Usagi',
    downloadUrl: 'https://drive.google.com/file/d/DELTA_VSQX_004',
    fileSize: '1.2 MB',
    dateAdded: '2025-06-15'
  },
  {
    id: 'file_005',
    title: 'Sound of Siam Heritage (มนต์เสน่ห์สยาม)',
    producer: 'DELTA SYNTH Heritage Series',
    format: 'USTX',
    bpm: 88,
    key: 'D Minor',
    compatibleEngine: 'OpenUtau Thai Phonemizer',
    recommendedSinger: 'Chansamorn & Arun Kamonlanert',
    downloadUrl: 'https://drive.google.com/file/d/DELTA_USTX_005',
    fileSize: '5.6 MB',
    dateAdded: '2025-07-02'
  }
];

export const EVENTS = [
  {
    id: 'event_001',
    title: 'DELTA SYNTH Online Creator Fest 2026',
    titleTh: 'เทศกาลครีเอเตอร์ออนไลน์ DELTA SYNTH 2026',
    date: '2026-09-20',
    time: '18:00 - 21:00 น.',
    location: 'Discord & YouTube Live Stream',
    type: 'Live Event / Showcase',
    description: 'การเปิดตัวคลังเสียงใหม่ DiffSinger Generation 2 พร้อมการแสดงสดจากครีเอเตอร์คอมมูนิตี้',
    registrationOpen: true,
    maxParticipants: 500,
    currentRegistered: 184
  },
  {
    id: 'event_002',
    title: 'Workshop: Master OpenUtau Thai Tuning',
    titleTh: 'เวิร์กช็อป: ปรับจูนเสียงร้องภาษาไทยบน OpenUtau ให้สมบูรณ์แบบ',
    date: '2026-10-05',
    time: '14:00 - 17:00 น.',
    location: 'DELTA SYNTH Discord Studio',
    type: 'Workshop / Training',
    description: 'เทคนิคการปรับ Pitch Bend, Envelope, Timing Spacing และการตั้งค่า Thai Phonemizer จากทีมงานผู้พัฒนา',
    registrationOpen: true,
    maxParticipants: 100,
    currentRegistered: 68
  }
];

export const BETA_VOICEBANKS = [
  {
    id: 'beta_diffsinger_hikaru_v2',
    name: 'Ayanami Hikaru DiffSinger v2.0 (BETA)',
    version: '2.0.0-beta.3',
    engine: 'DiffSinger',
    status: 'Open Testing',
    updateDate: '2026-08-10',
    changelog: 'ปรับปรุงการออกเสียงสระคู่ภาษาไทย และลด Artifacts ในเสียงสูง',
    downloadUrl: 'https://drive.google.com/drive/folders/BETA_HIKARU_V2'
  },
  {
    id: 'beta_diffsinger_sun_v2',
    name: 'SUN DiffSinger v2.0 (BETA)',
    version: '2.0.0-beta.2',
    engine: 'DiffSinger',
    status: 'Open Testing',
    updateDate: '2026-08-08',
    changelog: 'เพิ่มไดนามิกเสียงร้องแนว Rock ให้มีพลังมากขึ้น',
    downloadUrl: 'https://drive.google.com/drive/folders/BETA_SUN_V2'
  },
  {
    id: 'beta_thitiya_vccv',
    name: 'Thitiya Anantanetr VCCV Extended (BETA)',
    version: '1.2.0-beta',
    engine: 'UTAU VCCV',
    status: 'Closed Testing',
    updateDate: '2026-07-28',
    changelog: 'เพิ่ม Samplerate 96kHz และแก้ปัญหาคลิกเสียงช่วงรอยต่อพยางค์',
    downloadUrl: '#'
  }
];

export const CHANGELOGS = [
  {
    date: '2026-08-13',
    version: 'v2.4.0',
    title: 'Wix Velo & Vercel Codebase Optimization',
    category: 'System & Optimization',
    details: 'เพิ่มโมดูล Wix Velo แบบสมบูรณ์, อัปเดตชุดสีตามมาตรฐาน DELTA SYNTH (#CC2200), แก้ไข Image Paths ทั้งหมด'
  },
  {
    date: '2025-06-25',
    version: 'v2.3.0',
    title: 'Collabolation with Printmov Team',
    category: 'New Singer & Upgrade',
    details: 'เริ่มโครงการทดสอบ DiffSinger สำหรับ 7 ภาษา (ไทย, อังกฤษ, ญี่ปุ่น, จีน, เกาหลี, ฝรั่งเศส, สเปน)'
  },
  {
    date: '2025-05-15',
    version: 'v2.2.0',
    title: 'OpenUtau Thai Phonemizer Safe Spacing Fix',
    category: 'Phonemizer Update',
    details: 'ปรับโครงสร้าง Minimum Safe Spacing ในพยางค์ต่อเนื่องภาษาไทย ป้องกันพยัญชนะทับซ้อน'
  }
];

export default {
  PROJECTS,
  MUSIC_FILES,
  EVENTS,
  BETA_VOICEBANKS,
  CHANGELOGS
};
