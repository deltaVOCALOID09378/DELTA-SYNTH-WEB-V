/**
 * DELTA SYNTH Multi-Language Internationalization Engine (i18n)
 * Made And Checked By DELTA SYNTH & All Code Agentic AI Engine
 * Original by DELTA SYNTH
 * 
 * Supported Languages (9):
 * - th: Thai (ภาษาไทย - Default / Reference)
 * - en: English
 * - fr: French (Français)
 * - es: Spanish (Español)
 * - es-cl: Chilean Spanish (Español de Chile)
 * - zh: Chinese (中文)
 * - ja: Japanese (日本語)
 * - ru: Russian (Русский)
 * - ko: Korean (한국어)
 */

(function () {
  'use strict';

  const LANGUAGES = [
    { code: 'th', label: 'ภาษาไทย', flag: '🇹🇭', short: 'TH' },
    { code: 'en', label: 'English', flag: '🇬🇧', short: 'EN' },
    { code: 'fr', label: 'Français', flag: '🇫🇷', short: 'FR' },
    { code: 'es', label: 'Español', flag: '🇪🇸', short: 'ES' },
    { code: 'es-cl', label: 'Español (Chile)', flag: '🇨🇱', short: 'CL' },
    { code: 'zh', label: '中文 (简体)', flag: '🇨🇳', short: 'ZH' },
    { code: 'ja', label: '日本語', flag: '🇯🇵', short: 'JA' },
    { code: 'ru', label: 'Русский', flag: '🇷🇺', short: 'RU' },
    { code: 'ko', label: '한국어', flag: '🇰🇷', short: 'KO' }
  ];

  const TRANSLATIONS = {
    th: {
      nav_main: "หน้าหลัก",
      nav_about: "เกี่ยวกับเรา",
      nav_voicebank: "คลังเสียงทั้งหมด",
      nav_files: "USTX / MIDI / SVP / VSQX",
      nav_collab: "ผลงานร่วม",
      nav_events: "กิจกรรม",
      nav_new_works: "ผลงานใหม่",
      nav_thai_openutau: "Thai OpenUtau",
      nav_projects: "รวมโปรเจกต์",
      nav_toggle_open: "เปิดเมนูนำทาง",
      nav_toggle_close: "ปิดเมนูนำทาง",
      hero_eyebrow: "Thai Vocal Synthesis Studio — Since 2019",
      hero_title: "เสียงร้องเสมือน<br>ที่เริ่มต้นจาก<span class=\"accent\">ความตั้งใจของคนไทย</span>",
      hero_desc: "DELTA SYNTH คือค่ายพัฒนาคลังเสียงร้องเสมือน (UTAU / DiffSinger AI) สัญชาติไทย ผลิตและดูแลนักร้องเสมือนกว่า 57 เสียง พร้อมคลังเสียงดาวน์โหลด 167+ แพ็กเกจ รองรับการร้องได้ 7 ภาษา พร้อมส่งต่อคลังเสียงและไฟล์เพลงให้ทุกคนใช้งานฟรี",
      hero_btn_drive: "ดาวน์โหลดคลังเสียง (Google Drive Master)",
      hero_btn_explore: "สำรวจคลังเสียงทั้งหมด (57 เสียง)",
      hero_btn_about: "รู้จักค่ายของเรา",
      spec_core_engines_title: "CORE ENGINES",
      spec_core_engines_val: "DIFFSINGER AI · UTAU RESAMPLER",
      spec_repertoire_title: "REPERTOIRE",
      spec_repertoire_val: "TH · JP · EN · CN · KR · FR · ES (7 LINGUAL)",
      spec_status_title: "SYSTEM STATUS",
      spec_status_val: "LIVE & SYNTHESIZING",
      spec_partner_title: "TECH PARTNER",
      spec_partner_val: "PRINTMOV — DIFFSINGER NEURAL AI",
      spec_rd_title: "OPEN SOURCE R&D",
      spec_rd_val: "THAI OPENUTAU PHONEMIZER",
      spec_founded_title: "FOUNDED",
      spec_founded_val: "2019 · BANGKOK, THAILAND",
      stat_singers_num: "57+",
      stat_singers_lbl: "นักร้องเสมือนในเครือ",
      stat_packages_num: "167+",
      stat_packages_lbl: "คลังเสียงพร้อมดาวน์โหลด",
      stat_languages_num: "7+",
      stat_languages_lbl: "ภาษาที่รองรับการร้อง",
      stat_free_num: "0฿",
      stat_free_lbl: "ฟรี 100% สำหรับทุกคน",
      pillars_eyebrow: "อัตลักษณ์ของเรา",
      pillars_title: "คำขวัญ วิสัยทัศน์ และจุดยืนของ DELTA SYNTH",
      pillars_desc: "สรุปแนวทางการทำงานของค่ายอย่างเป็นทางการ เพื่อให้ทุกความร่วมมือและทุกคลังเสียงเดินไปในทิศทางเดียวกัน",
      pillar1_tag: "คำขวัญ",
      pillar1_title: "\"สร้างเสียง สร้างตัวตน สร้างสรรค์ไม่สิ้นสุด\"",
      pillar1_desc: "ทุกคลังเสียงของเราไม่ใช่แค่ไฟล์เสียง แต่คือตัวตนหนึ่งที่มีเรื่องราว มีนิสัย และมีที่มาเฉพาะตัว เราเชื่อว่าการพัฒนาเสียงคือการพัฒนาตัวละครไปพร้อมกันเสมอ",
      pillar2_tag: "วิสัยทัศน์",
      pillar2_title: "ค่ายเสียงเสมือนไทยที่ยืนระดับสากล",
      pillar2_desc: "มุ่งพัฒนาคลังเสียงร้องภาษาไทยให้ก้าวทันมาตรฐานเทคโนโลยี AI เสียงร้องระดับโลก ผ่านความร่วมมือกับทีมพัฒนา DiffSinger และเครือข่ายผู้สร้างนักร้องเสมือนทั้งไทยและต่างประเทศ",
      pillar3_tag: "เอกลักษณ์",
      pillar3_title: "หลากตัวตน หนึ่งมาตรฐานคุณภาพ",
      pillar3_desc: "จากนักเรียน B.L. รุ่นก่อตั้งปี 2019 สู่ตระกูล Wongyai และซีรีส์พนักงาน CP All Learning ทุกตัวละครถูกดูแลด้วยกระบวนการจูนเสียงเฉพาะตัว รักษาคุณภาพให้ใช้งานได้ยั่งยืน",
      showcase_eyebrow: "VIRTUAL SINGERS SHOWCASE",
      showcase_title: "นักร้องเสมือนไฮไลต์ประจำค่าย",
      showcase_desc: "สัมผัสน้ำเสียงระดับพรีเมียมจากคลังเสียงยอดนิยม ทั้ง UTAU และ DiffSinger AI พร้อมดาวน์โหลดทันที",
      showcase_btn_all: "ดูนักร้องทั้งหมด 57 เสียง →",
      showcase_hikaru_sub: "อายานามิ ฮิคารุ · Pop / Ballad",
      showcase_hikaru_desc: "เสียงหลักอันเป็นเอกลักษณ์ของ DELTA SYNTH ให้โทนเสียงอบอุ่น ทรงพลัง และยืดหยุ่นสูงในทุกย่านเสียง",
      showcase_sun_sub: "ซัน · Rock / Modern",
      showcase_sun_desc: "เสียงใส คมชัด พุ่งตรง เหมาะกับแนวเพลงเร็วและท่อนฮุคที่ต้องการพลังเสียงหนักแน่น",
      showcase_relven_sub: "เรลเวน · Alternative / Rock",
      showcase_relven_desc: "เสียงทรงพลัง ดุดัน สไตล์ร็อกแอนด์อัลเทอร์เนทีฟ รองรับการร้องทั้งภาษาไทย ญี่ปุ่น และอังกฤษ",
      showcase_andromeda_sub: "แอนโดรเมดา · Space Pop / Electro",
      showcase_andromeda_desc: "โปรเจกต์พิเศษร่วมกับ TYU โทนเสียงสังเคราะห์ล้ำยุค ดุจดั่งประกายดาวในห้วงกาแล็กซี",
      btn_profile: "โปรไฟล์",
      btn_download: "ดาวน์โหลด",
      badge_coming_soon: "รอเปิดตัว",
      nw_eyebrow: "NEW WORKS · AI TOOLS BY DELTA SYNTH",
      nw_title: "ผลงานใหม่ล่าสุดจากห้องพัฒนา DELTA SYNTH",
      nw_desc: "เครื่องมือ AI ที่ทีมพัฒนาขึ้นเองเพื่อสนับสนุนงานสร้างเสียงร้องเสมือน — ทั้งการแปลงเสียงด้วย Tone-Preserving Thai RVC ผ่านหน้าเว็บภาษาไทย และผู้ช่วย Local AI Agent บนเครื่องของคุณเอง",
      nw_rvc_badge: "NEW WORK · ACTIVE DEVELOPMENT",
      nw_rvc_sub: "Tone-Preserving Thai RVC System · ระบบแปลงเสียงวรรณยุกต์ไทยแท้",
      nw_rvc_desc: "WebUI แปลงเสียงด้วย Retrieval-based Voice Conversion (RVC) ที่ปรับแต่งสถาปัตยกรรมเพื่อรักษาวรรณยุกต์ไทย 5 เสียงครบถ้วน ด้วย RMVPE F0 contour และ Thai ContentVec/HuBERT (ความแม่นยำวรรณยุกต์ ≥ 95%, MOS ≥ 4.0, RTF ≤ 0.3) พร้อมคู่มือสองภาษาไทย/อังกฤษ",
      nw_rvc_li1: "ครบวงจรในหน้าเดียว: แปลงเสียง (Inference), จัดการ Dataset, ฝึกโมเดล (Train), สร้าง Index (FAISS) และแยกเสียงร้อง/ดนตรีด้วย UVR5",
      nw_rvc_li2: "รองรับฮาร์ดแวร์หลากหลาย: NVIDIA CUDA, AMD / Intel (DirectML) และ CPU เปิดรันผ่าน Program.py (พอร์ต 9378) หรือ go-web.bat (พอร์ต 7897)",
      nw_rvc_li3: "โหมดเสียงสด & ปลั๊กอิน DAW: รองรับ realtime_gui.py แปลงเสียงสดความหน่วงต่ำ และรองรับ RVCRealtimeVST สำหรับโปรแกรมทำเพลง",
      nw_rvc_li4: "ระบบประมวลผล Batch ปลอดภัย: แยก subprocess ลดปัญหา VRAM รั่ว มี clear_vram_safe() พร้อมระบบตรวจซ่อม dependency อัตโนมัติ",
      nw_rvc_btn_gh: "Source Code บน GitHub",
      nw_rvc_btn_contact: "ติดต่อร่วมทดสอบ",
      nw_dark_badge: "NEW WORK · ACTIVE DEVELOPMENT",
      nw_dark_sub: "Local Agentic AI Desktop · Made by DELTA SYNTH",
      nw_dark_desc: "แอปเดสก์ท็อป Windows สำหรับสั่งงาน AI Agent บนเครื่องของคุณเองผ่าน Ollama 100% ไม่ต้องใช้ API Key ภายนอก และจำกัดสิทธิ์การเข้าถึงไฟล์เฉพาะ Workspace ที่กำหนดเท่านั้น",
      nw_dark_li1: "หน้าจอ Avalonia / .NET สไตล์โมเดิร์น: เลือกโมเดล สตรีมความคิดและสถานะการทำงานของ Agent แบบสดด้วย NDJSON พร้อมปุ่มยกเลิกทันที",
      nw_dark_li2: "เครื่องมือไฟล์ความปลอดภัยสูง: read_file, write_file, list_directory ป้องกัน Path Traversal เขียนไฟล์แบบ Atomic และจำกัดขนาด",
      nw_dark_li3: "ความปลอดภัยแบบปิด: Backend และ Gateway ผูกที่ 127.0.0.1 เท่านั้น ควบคุม Concurrency และจำกัดจำนวนเซสชันพร้อมกัน",
      nw_dark_li4: "ระบบ Supervisor และการควบคุม: ตรวจสุขภาพโปรเซสอัตโนมัติ มีสคริปต์ setup, start, stop, verify พร้อมใช้งานสมบูรณ์",
      nw_dark_btn_gh: "ติดตามบน GitHub",
      nw_dark_btn_contact: "ติดต่อร่วมทดสอบ",
      openutau_eyebrow: "COMMUNITY PROJECT · OPEN SOURCE R&D",
      openutau_title: "ศูนย์พัฒนา Thai OpenUtau · ยกระดับเสียงร้องเสมือนภาษาไทย",
      openutau_desc: "โครงการพัฒนาส่วนขยายและระบบรองรับภาษาไทยสำหรับ OpenUtau เพื่อสร้างมาตรฐานใหม่ที่ใช้งานง่าย ครบถ้วน พร้อมเปิดให้ติดตามและร่วมทดสอบกับคอมมูนิตี้",
      openutau_badge: "ACTIVE DEVELOPMENT",
      openutau_core: "Core Engine: OpenUtau · C# / .NET 8",
      openutau_f1_num: "01 / G2P & PHONEMIZER",
      openutau_f1_title: "ระบบแปลงเนื้อร้องไทยอัตโนมัติ",
      openutau_f1_desc: "พัฒนาโมดูล Thai Phonemizer และ G2P (Grapheme-to-Phoneme) อัจฉริยะ รองรับระบบ VCCV / CVVC ช่วยให้ป้อนเนื้อเพลงภาษาไทยได้ทันทีโดยไม่ต้องถอดรหัสโฟเนมด้วยตนเอง",
      openutau_f2_num: "02 / THAI LOCALIZATION",
      openutau_f2_title: "อินเทอร์เฟซภาษาไทยสมบูรณ์แบบ",
      openutau_f2_desc: "แพ็กเกจแปลเมนู การตั้งค่าแทร็ก หน้าต่างเปียโนโรล และคำอธิบายเอ็นจินสังเคราะห์เสียงเป็นภาษาไทย 100% ตามมาตรฐานเสียงสากล เพื่อให้ทุกคนเข้าถึงการทำเพลงได้อย่างราบรื่น",
      openutau_f3_num: "03 / ECOSYSTEM & TESTING",
      openutau_f3_title: "การเชื่อมต่อคลังเสียงและเทมเพลต",
      openutau_f3_desc: "ทดสอบร่วมกับคลังเสียง DELTA SYNTH กว่า 57 เสียง และ UTAU / DiffSinger AI สัญชาติไทย พร้อมแจกจ่ายไฟล์เทมเพลต USTX ตัวอย่างการจูน และคู่มือการติดตั้งที่อัปเดตสม่ำเสมอ",
      openutau_btn_gh: "ติดตาม Source Code บน GitHub",
      openutau_btn_tools: "ดาวน์โหลด Release & Tools ทดสอบ",
      openutau_btn_contact: "ติดต่อร่วมทดสอบ / ติดตามความคืบหน้า",
      files_sec_eyebrow: "CREATOR TOOLKIT",
      files_sec_title: "ไฟล์เพลงสำเร็จรูปสำหรับนักสร้างสรรค์",
      files_sec_desc: "คลังไฟล์ USTX, MIDI, SVP และ VSQX ที่พร้อมให้นักแต่งเพลงและโปรดิวเซอร์นำไปใช้ต่อยอดงานเพลงได้ทันที",
      files_p1_tag: "OPENUTAU",
      files_p1_title: "USTX Project Templates",
      files_p1_desc: "ไฟล์โปรเจกต์พร้อมการปรับตั้งค่าพิทช์ เสียงเอฟเฟกต์ และโฟเนมภาษาไทยที่แม่นยำ พร้อมเปิดรันใน OpenUtau ได้ทันที",
      files_p1_btn: "ดาวน์โหลด USTX →",
      files_p2_tag: "SYNTHESIZER V",
      files_p2_title: "SVP Score Files",
      files_p2_desc: "ไฟล์สเกลและเนื้อร้องสังเคราะห์คุณภาพสูงสำหรับซอฟต์แวร์ Synthesizer V รองรับการขับร้องหลากหลายภาษา",
      files_p2_btn: "ดาวน์โหลด SVP →",
      files_p3_tag: "DAW / VOCALOID",
      files_p3_title: "MIDI & VSQX Archives",
      files_p3_desc: "แทร็กโน้ตดนตรีและไฟล์โปรเจกต์มาตรฐานสากล สำหรับเปิดใน DAW ชั้นนำ หรือโปรแกรมตระกูล VOCALOID",
      files_p3_btn: "ดาวน์โหลด MIDI/VSQX →",
      timeline_eyebrow: "ความเคลื่อนไหวล่าสุด",
      timeline_title: "สรุปกิจกรรมและพัฒนาการของค่าย",
      timeline_item1_date: "ต.ค. 2026",
      timeline_item1_title: "ผลงานใหม่: Thai RVC Web UI และ The Darkside UI AI Agent",
      timeline_item1_desc: "เพิ่มเครื่องมือ AI ที่พัฒนาโดย DELTA SYNTH 2 รายการ — WebUI แปลงเสียง RVC ภาษาไทย และ AI Agent เดสก์ท็อปที่ทำงานบนเครื่องผ่าน Ollama",
      timeline_item2_date: "2026",
      timeline_item2_title: "ระบบความร่วมมือและคลังเสียงเจเนอเรชันใหม่",
      timeline_item2_desc: "เปิดตัวโปรเจกต์ความร่วมมือระดับสากล TYU Project และพัฒนาคลังเสียง Andromeda, RelVeN 2026 พร้อมชุดทดสอบระบบ 5 ระดับ Zero Defects",
      timeline_item3_date: "2025",
      timeline_item3_title: "ความร่วมมือกับทีม Printmov — อัปเกรดสู่ DiffSinger AI",
      timeline_item3_desc: "DELTA SYNTH เข้าร่วมเป็นพาร์ทเนอร์ทดสอบของทีม Printmov เพื่อยกระดับคลังเสียงหลักของค่ายสู่ DiffSinger AI Engine คุณภาพสูง ต่อยอดจากคลังเสียง UTAU เดิม",
      timeline_item4_date: "มิ.ย. 2025",
      timeline_item4_title: "เปิดตัวนักร้องรุ่นใหม่ประจำฤดูกาล",
      timeline_item4_desc: "ต้อนรับคลังเสียงใหม่และการอัปเกรดคลังเสียงเดิมหลายตัวละคร ครอบคลุมทั้งภาษาไทย ญี่ปุ่น และอังกฤษ",
      timeline_item5_date: "ต่อเนื่อง",
      timeline_item5_title: "รองรับการร้องได้ 7 ภาษา",
      timeline_item5_desc: "ไทย · อังกฤษ · ญี่ปุ่น · จีน · เกาหลี · ฝรั่งเศส · สเปน ผ่านฟีเจอร์ Cross-Lingual Synthesis ของ DiffSinger และ UTAU",
      cta_title: "ดาวน์โหลดคลังเสียงและไฟล์เพลงได้แล้ววันนี้",
      cta_desc: "ไม่ต้องหาจากเว็บอื่นอีกต่อไป — คลังเสียงและไฟล์ USTX / MIDI / SVP / VSQX ของ DELTA SYNTH อยู่ในเว็บไซต์เดียวครบจบ 100% ฟรี",
      cta_btn_drive: "เปิด Google Drive รวม",
      cta_btn_roster: "ดูรายชื่อนักร้องทั้งหมด",
      footer_desc: "สตูดิโอพัฒนาคลังเสียงร้องเสมือนสัญชาติไทย ก่อตั้งปี 2019 ผลิตคลังเสียง UTAU และ DiffSinger AI มาแล้วกว่า 57 ตัวละคร พร้อมไฟล์เพลงและเทมเพลตสำหรับคอมมูนิตี้",
      footer_sitemap: "แผนผังเว็บไซต์",
      footer_contact: "ช่องทางติดต่อ & โซเชียล",
      footer_drive: "คลังดาวน์โหลด Google Drive Master",
      footer_rights: "© ตั้งแต่ปี 2019 — ทีม DELTA SYNTH สร้างสรรค์ด้วยความภาคภูมิใจในประเทศไทย",
      footer_made_by: "ออกแบบด้วย DELTA SYNTH Design System",
      about_h1: "เรื่องราวของ DELTA SYNTH",
      about_origin_title: "จุดเริ่มต้นของค่าย",
      about_contact_title: "ติดต่อค่าย DELTA SYNTH",
      vb_hero_crumb: "คลังเสียงทั้งหมด / ALL VOICEBANKS",
      vb_hero_title: "คลังเสียงทั้งหมดของ DELTA SYNTH",
      vb_hero_desc: "รวมคลังเสียงนักร้องเสมือนทั้ง UTAU และ DiffSinger AI สัญชาติไทยกว่า 57 เสียง พร้อมลิงก์ดาวน์โหลดตรงฟรี",
      vb_drive_banner_title: "Google Drive Master Archive",
      vb_drive_banner_desc: "ดาวน์โหลดคลังเสียงและไฟล์โปรเจกต์ทั้งหมดได้จากโฟลเดอร์หลักบน Google Drive จัดหมวดหมู่ชัดเจน อัปเดตล่าสุดสม่ำเสมอ",
      vb_drive_banner_btn: "เปิด Google Drive รวม →",
      vb_search_placeholder: "ค้นหาชื่อนักร้อง, ภาษา, แนวเพลง หรือเอ็นจิน...",
      vb_filter_all: "ทั้งหมด (57)",
      vb_filter_diffsinger: "DiffSinger AI",
      vb_filter_utau: "UTAU",
      vb_card_profile: "ดูโปรไฟล์",
      vb_card_private: "Private Voicebank",
      profile_return: "← กลับไปหน้ารวมคลังเสียง",
      profile_return_sub: "All Voicebanks",
      profile_official: "OFFICIAL SINGER",
      profile_age: "อายุ",
      profile_gender: "เพศ",
      profile_voicer: "ผู้ให้เสียง (Voicer)",
      profile_genre: "แนวเพลงที่แนะนำ",
      profile_engine: "เอ็นจินเสียง",
      profile_language: "ภาษาที่รองรับ",
      profile_bio_title: "ประวัติความเป็นมา",
      profile_audio_title: "ตัวอย่างเสียงร้อง",
      profile_audio_demo: "ตัวอย่างเสียงร้อง",
      profile_status_title: "สถานะคลังเสียง",
      profile_private_title: "Private Voicebank",
      profile_private_desc: "คลังเสียงนี้สงวนสิทธิ์เฉพาะโปรเจกต์ภายในและการร่วมงานพิเศษ",
      profile_private_badge: "PRIVATE ACCESS",
      profile_download_title: "ดาวน์โหลดคลังเสียง",
      profile_btn_download: "ดาวน์โหลด",
      files_h1: "ไฟล์เพลง USTX · MIDI · SVP · VSQX",
      files_desc: "คลังไฟล์โปรเจกต์ดนตรีสำเร็จรูปฟรี สำหรับนำไปขับร้องด้วยเสียงเสมือน",
      events_h1: "อีเวนต์และกิจกรรม",
      events_desc: "รวมกิจกรรม อีเวนต์ และความเคลื่อนไหวสำคัญของ DELTA SYNTH",
      collab_h1: "COLLABORATION VOICEBANKS",
      collab_desc: "คลังเสียงและโปรเจกต์ที่ร่วมสร้างสรรค์กับศิลปินและพันธมิตรทั้งในและต่างประเทศ",
      project_h1: "ทำเนียบ 9 กลุ่มโปรเจกต์ DELTA SYNTH",
      project_desc: "รวมรายชื่อ 9 กลุ่มโปรเจกต์และศิลปินเสียงร้องเสมือนทั้งหมดในเครือ DELTA SYNTH",
      upload_h1: "ศูนย์อัปโหลดไฟล์ (File Upload Center)",
      vb_label_status: "สถานะ:",
      vb_label_affil: "สังกัด:",
      vb_label_category: "หมวดหมู่:",
      vb_chip_all: "ทั้งหมด (55)",
      vb_chip_official: "✓ เป็นทางการ (Active)",
      vb_chip_upcoming: "⏳ รอเปิดตัว (Upcoming)",
      vb_chip_private: "🔒 ไพรเวท (Private)",
      vb_chip_female: "หญิง (Female · 16)",
      vb_chip_male: "ชาย (Male)",
      vb_chip_lgbtq: "LGBTQ (5)",
      badge_active: "✓ เป็นทางการ",
      badge_private: "🔒 ไพรเวท",
      badge_upcoming: "⏳ รอเปิดตัว",
      about_eyebrow: "ก่อตั้งปี 2019 · The 1st Project — B.L. Student",
      about_lead: "ค่ายเพลงมือใหม่สัญชาติไทย ก่อตั้งขึ้นในปี พ.ศ. 2562 ปัจจุบันดำเนินหลากหลายโปรเจกต์ผ่านการจับมือร่วมงานกับครีเอเตอร์ทั้งไทยและต่างชาติอย่างต่อเนื่อง",
      about_story_eyebrow: "Our Story",
      about_story_title: "จุดเริ่มต้นของค่าย",
      about_story_desc: "ก่อตั้งโดยสมาชิก 4 คนแรก ร่วมกับผู้สนับสนุนอีก 3 ท่าน — คุณ SUN, Kochujang (Shu-chan) และ Guren Kani — ที่ร่วมสร้างและสนับสนุนค่ายมาโดยตลอด ผลงานส่วนใหญ่เผยแพร่ผ่านช่อง YouTube ของค่ายจนถึงปัจจุบัน",
      about_contact_eyebrow: "ติดต่อเรา",
      files_th_name: "ชื่อไฟล์",
      files_th_desc: "รายละเอียด",
      files_th_format: "รูปแบบ",
      events_empty_title: "ยังไม่มีอีเวนต์ที่กำหนดไว้ในขณะนี้",
      events_empty_desc: "ทีมงานกำลังจัดสรรเวลาสำหรับโปรเจกต์เพลงและการพัฒนาคลังเสียงเป็นหลัก ติดตามช่องทางของเราไว้เพื่อไม่พลาดประกาศกิจกรรมครั้งถัดไป",
      events_empty_btn: "ติดตามช่องทางของเรา",
      collab_eyebrow: "PARTNERSHIPS & SPECIAL PROJECTS",
      collab_sub_title: "Featured Collaboration Artists",
      collab_sub_desc: "ศิลปินและคลังเสียงไฮไลต์จากโปรเจกต์ความร่วมมือพิเศษ",
      collab_btn_roster: "ดูทำเนียบ 9 กลุ่มโปรเจกต์ทั้งหมด →",
      collab_btn_drive: "📂 คลังไดรฟ์รวม All Voicebanks",
      collab_btn_card: "เข้าสู่โปรไฟล์ & ดาวน์โหลด →"
    },

    en: {
      nav_main: "Main",
      nav_about: "About Us",
      nav_voicebank: "All Voicebanks",
      nav_files: "USTX / MIDI / SVP / VSQX",
      nav_collab: "Collaboration",
      nav_events: "Events",
      nav_new_works: "New Works",
      nav_thai_openutau: "Thai OpenUtau",
      nav_projects: "Projects",
      nav_toggle_open: "Open navigation menu",
      nav_toggle_close: "Close navigation menu",
      hero_eyebrow: "Thai Vocal Synthesis Studio — Since 2019",
      hero_title: "Virtual Singing Voices<br>Born from <span class=\"accent\">Thai Passion & Innovation</span>",
      hero_desc: "DELTA SYNTH is a Thai virtual vocal synthesis developer (UTAU / DiffSinger AI), producing and maintaining 57+ virtual singers with 167+ downloadable packages supporting 7 languages — distributed completely free to creators worldwide.",
      hero_btn_drive: "Download Voicebanks (Google Drive Master)",
      hero_btn_explore: "Explore All Voicebanks (57 Singers)",
      hero_btn_about: "About Our Studio",
      spec_core_engines_title: "CORE ENGINES",
      spec_core_engines_val: "DIFFSINGER AI · UTAU RESAMPLER",
      spec_repertoire_title: "REPERTOIRE",
      spec_repertoire_val: "TH · JP · EN · CN · KR · FR · ES (7 LINGUAL)",
      spec_status_title: "SYSTEM STATUS",
      spec_status_val: "LIVE & SYNTHESIZING",
      spec_partner_title: "TECH PARTNER",
      spec_partner_val: "PRINTMOV — DIFFSINGER NEURAL AI",
      spec_rd_title: "OPEN SOURCE R&D",
      spec_rd_val: "THAI OPENUTAU PHONEMIZER",
      spec_founded_title: "FOUNDED",
      spec_founded_val: "2019 · BANGKOK, THAILAND",
      stat_singers_num: "57+",
      stat_singers_lbl: "Virtual Singers in Roster",
      stat_packages_num: "167+",
      stat_packages_lbl: "Downloadable Voicebanks",
      stat_languages_num: "7+",
      stat_languages_lbl: "Languages Supported",
      stat_free_num: "0฿",
      stat_free_lbl: "100% Free for Everyone",
      pillars_eyebrow: "OUR IDENTITY",
      pillars_title: "Motto, Vision, and Core Pillars of DELTA SYNTH",
      pillars_desc: "Our official foundational principles ensuring every collaboration and voicebank shares the same pursuit of excellence.",
      pillar1_tag: "MOTTO",
      pillar1_title: "\"Create Voice, Create Identity, Endless Creativity\"",
      pillar1_desc: "Each voicebank is not merely audio files, but an individual identity with unique lore, character, and emotional depth. We believe voice development and character cultivation grow together.",
      pillar2_tag: "VISION",
      pillar2_title: "Thai Virtual Singing on the Global Stage",
      pillar2_desc: "Advancing Thai vocal synthesis to match world-class AI standards through continuous collaboration with DiffSinger developers and international creator communities.",
      pillar3_tag: "IDENTITY",
      pillar3_title: "Diverse Personas, One Quality Standard",
      pillar3_desc: "From the 2019 founding B.L. student line to the Wongyai family and CP All Learning corporate series, each character receives tailored acoustic tuning for enduring performance.",
      showcase_eyebrow: "VIRTUAL SINGERS SHOWCASE",
      showcase_title: "Featured Virtual Singers",
      showcase_desc: "Experience premium singing synthesis across our flagship UTAU and DiffSinger AI voicebanks, available for instant free download.",
      showcase_btn_all: "View All 57 Singers →",
      showcase_hikaru_sub: "Ayanami Hikaru · Pop / Ballad",
      showcase_hikaru_desc: "The quintessential voice of DELTA SYNTH, delivering warm, powerful, and remarkably versatile vocal expression across all registers.",
      showcase_sun_sub: "SUN · Rock / Modern",
      showcase_sun_desc: "Crisp, bright, and punchy vocal tone, engineered for high-tempo rock tracks and dynamic hooks requiring commanding presence.",
      showcase_relven_sub: "RelVeN · Alternative / Rock",
      showcase_relven_desc: "Fierce, dynamic, and emotionally charged alternative rock vocals, supporting multi-lingual synthesis in Thai, Japanese, and English.",
      showcase_andromeda_sub: "Andromeda · Space Pop / Electro",
      showcase_andromeda_desc: "A special collaborative project with TYU featuring futuristic synthesized vocals that sparkle like stardust across galaxies.",
      btn_profile: "Profile",
      btn_download: "Download",
      badge_coming_soon: "Coming Soon",
      nw_eyebrow: "NEW WORKS · AI TOOLS BY DELTA SYNTH",
      nw_title: "Latest Engineering Works from DELTA SYNTH Labs",
      nw_desc: "Proprietary AI tools developed in-house to advance virtual singing — from tone-preserving Thai RVC voice conversion via WebUI to a local, sandboxed desktop AI agent.",
      nw_rvc_badge: "NEW WORK · ACTIVE DEVELOPMENT",
      nw_rvc_sub: "Tone-Preserving Thai RVC System · Authentic Thai Tone Conversion",
      nw_rvc_desc: "A WebUI for Retrieval-based Voice Conversion (RVC) customized to preserve all 5 Thai phonetic tones using RMVPE F0 contour and Thai ContentVec/HuBERT (Tone Accuracy ≥ 95%, MOS ≥ 4.0, RTF ≤ 0.3) with bilingual documentation.",
      nw_rvc_li1: "All-in-one Web Interface: Voice Conversion (Inference), Dataset Management, Model Training, Index Building (FAISS), and UVR5 vocal/instrumental separation.",
      nw_rvc_li2: "Broad Hardware Support: NVIDIA CUDA, AMD / Intel (DirectML), and CPU fallback via Program.py (port 9378) or go-web.bat (port 7897).",
      nw_rvc_li3: "Live Performance & DAW Plugin: Real-time low-latency GUI (realtime_gui.py) and RVCRealtimeVST plugin support for music production.",
      nw_rvc_li4: "Secure Subprocess Batching: Isolated subprocess architecture preventing VRAM leaks, safe VRAM clearing (clear_vram_safe()), and self-repairing dependency checks.",
      nw_rvc_btn_gh: "Source Code on GitHub",
      nw_rvc_btn_contact: "Join Testing Program",
      nw_dark_badge: "NEW WORK · ACTIVE DEVELOPMENT",
      nw_dark_sub: "Local Agentic AI Desktop · Made by DELTA SYNTH",
      nw_dark_desc: "A Windows desktop application orchestrating local AI agents powered 100% by local Ollama instances — zero external API keys required, with strict workspace sandbox isolation.",
      nw_dark_li1: "Modern Avalonia / .NET UI: Real-time agent thought streaming and task inspection via NDJSON, model switching, and instant cancellation controls.",
      nw_dark_li2: "Hardened File System Tools: read_file, write_file, list_directory with path traversal guards, atomic file writes, and size bounds.",
      nw_dark_li3: "Strict Loopback Isolation: Backend and gateway strictly bound to 127.0.0.1, preventing unauthorized network exposure.",
      nw_dark_li4: "Supervisor & Orchestration: Auto process health checking with pre-configured setup, start, stop, and verify automation scripts.",
      nw_dark_btn_gh: "Follow on GitHub",
      nw_dark_btn_contact: "Join Testing Program",
      openutau_eyebrow: "COMMUNITY PROJECT · OPEN SOURCE R&D",
      openutau_title: "Thai OpenUtau Center · Elevating Thai Virtual Singing",
      openutau_desc: "An open-source R&D initiative developing Thai language support and phonemizer extensions for OpenUtau, establishing an accessible new standard for Thai music producers.",
      openutau_badge: "ACTIVE DEVELOPMENT",
      openutau_core: "Core Engine: OpenUtau · C# / .NET 8",
      openutau_f1_num: "01 / G2P & PHONEMIZER",
      openutau_f1_title: "Automated Thai Lyric Phonemizer",
      openutau_f1_desc: "Advanced Thai Grapheme-to-Phoneme (G2P) engine supporting VCCV and CVVC singing methods, enabling seamless Thai lyric input without manual phoneme transcription.",
      openutau_f2_num: "02 / THAI LOCALIZATION",
      openutau_f2_title: "Comprehensive Thai Interface",
      openutau_f2_desc: "Complete 100% Thai localization package for menus, track preferences, piano roll editor, and synthesis engine configurations adhering to audio engineering standards.",
      openutau_f3_num: "03 / ECOSYSTEM & TESTING",
      openutau_f3_title: "Voicebank Integration & Templates",
      openutau_f3_desc: "Extensively verified with DELTA SYNTH's 57+ singers and Thai DiffSinger AI models, offering turnkey USTX templates, tuning samples, and regularly updated installation guides.",
      openutau_btn_gh: "View Source on GitHub",
      openutau_btn_tools: "Download Releases & Tools",
      openutau_btn_contact: "Collaborate & Follow Progress",
      files_sec_eyebrow: "CREATOR TOOLKIT",
      files_sec_title: "Turnkey Production Project Files",
      files_sec_desc: "A rich archive of USTX, MIDI, SVP, and VSQX files ready for composers and music producers to craft original tracks and covers immediately.",
      files_p1_tag: "OPENUTAU",
      files_p1_title: "USTX Project Templates",
      files_p1_desc: "Pre-tuned OpenUtau project files featuring accurate pitch curves, dynamics, and Thai phonetics, ready to load and render out of the box.",
      files_p1_btn: "Download USTX →",
      files_p2_tag: "SYNTHESIZER V",
      files_p2_title: "SVP Score Files",
      files_p2_desc: "High-precision musical scores and synthetic vocal arrangements designed for Dreamtonics Synthesizer V across multiple languages.",
      files_p2_btn: "Download SVP →",
      files_p3_tag: "DAW / VOCALOID",
      files_p3_title: "MIDI & VSQX Archives",
      files_p3_desc: "Standard MIDI note sequences and VSQX project files fully compatible with leading digital audio workstations and VOCALOID editors.",
      files_p3_btn: "Download MIDI/VSQX →",
      timeline_eyebrow: "LATEST MOVEMENTS",
      timeline_title: "Studio Milestones & Community Updates",
      timeline_item1_date: "Oct 2026",
      timeline_item1_title: "New Works: Thai RVC Web UI & The Darkside UI AI Agent",
      timeline_item1_desc: "Released two proprietary AI tools — a tone-preserving Thai RVC voice converter WebUI and a sandboxed desktop local AI agent powered by Ollama.",
      timeline_item2_date: "2026",
      timeline_item2_title: "Next-Gen Cross-Border Roster & Test Automation",
      timeline_item2_desc: "Launched the TYU Project international collaboration, introduced Andromeda and RelVeN 2026, and deployed 5-tier Zero-Defect automated test suites.",
      timeline_item3_date: "2025",
      timeline_item3_title: "Printmov Partnership — Upgrading to DiffSinger AI",
      timeline_item3_desc: "DELTA SYNTH joined as an official testing partner for Printmov, elevating core voicebanks to high-fidelity DiffSinger neural singing synthesis.",
      timeline_item4_date: "Jun 2025",
      timeline_item4_title: "New Seasonal Singers Debut",
      timeline_item4_desc: "Debuted new voicebanks and major character revisions supporting Thai, Japanese, and English repertoire.",
      timeline_item5_date: "Continuous",
      timeline_item5_title: "7-Language Multilingual Synthesis",
      timeline_item5_desc: "Thai, English, Japanese, Chinese, Korean, French, and Spanish via cross-lingual synthesis capabilities in DiffSinger and UTAU.",
      cta_title: "Download Voicebanks & Project Files Today",
      cta_desc: "No more searching multiple mirrors — all DELTA SYNTH voicebanks, USTX, MIDI, SVP, and VSQX files are centralized in one unified hub, 100% free.",
      cta_btn_drive: "Open Master Google Drive",
      cta_btn_roster: "Explore Full 57-Singer Roster",
      footer_desc: "Thai virtual singing synthesis developer established in 2019, crafting UTAU and DiffSinger AI voicebanks for 57+ characters with open-source project files for creators worldwide.",
      footer_sitemap: "Sitemap",
      footer_contact: "Contact & Community",
      footer_drive: "Google Drive Master Archive",
      footer_rights: "© Since 2019 — DELTA SYNTH Team. Crafted with pride in Thailand.",
      footer_made_by: "Designed with DELTA SYNTH Design System",
      about_h1: "The Story of DELTA SYNTH",
      about_origin_title: "Studio Origins & History",
      about_contact_title: "Contact DELTA SYNTH",
      vb_hero_crumb: "ALL VOICEBANKS",
      vb_hero_title: "All DELTA SYNTH Voicebanks",
      vb_hero_desc: "The complete collection of 57+ Thai UTAU and DiffSinger AI virtual singers, with direct, high-speed free download links.",
      vb_drive_banner_title: "Google Drive Master Archive",
      vb_drive_banner_desc: "Download all full voicebanks, sound packages, and demo project files directly from our organized, always-updated master cloud drive.",
      vb_drive_banner_btn: "Open Master Drive →",
      vb_search_placeholder: "Search singer name, language, genre, or engine...",
      vb_filter_all: "All (57)",
      vb_filter_diffsinger: "DiffSinger AI",
      vb_filter_utau: "UTAU",
      vb_card_profile: "View Profile",
      vb_card_private: "Private Voicebank",
      profile_return: "← Back to Voicebank Catalog",
      profile_return_sub: "All Voicebanks",
      profile_official: "OFFICIAL SINGER",
      profile_age: "Age",
      profile_gender: "Gender",
      profile_voicer: "Voicer",
      profile_genre: "Recommended Genre",
      profile_engine: "Voice Engine",
      profile_language: "Supported Languages",
      profile_bio_title: "Biography & Lore",
      profile_audio_title: "Voice Audio Samples",
      profile_audio_demo: "Audio Demo Preview",
      profile_status_title: "Voicebank Status",
      profile_private_title: "Private Voicebank",
      profile_private_desc: "This voicebank is reserved exclusively for internal productions and licensed collaborations.",
      profile_private_badge: "PRIVATE ACCESS",
      profile_download_title: "Voicebank Downloads",
      profile_btn_download: "Download",
      files_h1: "USTX · MIDI · SVP · VSQX Project Files",
      files_desc: "Free turnkey vocal project files and musical scores ready for your favorite synthesis engines.",
      events_h1: "Events & Community Milestones",
      events_desc: "Track our latest activities, exhibitions, and major community releases.",
      collab_h1: "COLLABORATION VOICEBANKS",
      collab_desc: "Special voicebanks and joint projects co-created with domestic and international creators.",
      project_h1: "DELTA SYNTH 9 Project Groups Roster",
      project_desc: "Comprehensive directory of all 9 project teams and affiliated virtual singing artists.",
      upload_h1: "File Upload Center",
      vb_label_status: "Status:",
      vb_label_affil: "Affiliation:",
      vb_label_category: "Category:",
      vb_chip_all: "All (55)",
      vb_chip_official: "✓ Official (Active)",
      vb_chip_upcoming: "⏳ Upcoming",
      vb_chip_private: "🔒 Private",
      vb_chip_female: "Female (16)",
      vb_chip_male: "Male",
      vb_chip_lgbtq: "LGBTQ (5)",
      badge_active: "✓ Official",
      badge_private: "🔒 Private",
      badge_upcoming: "⏳ Upcoming",
      about_eyebrow: "Founded in 2019 · The 1st Project — B.L. Student",
      about_lead: "A Thai vocal synthesis studio founded in 2019, actively operating diverse creative projects in continuous collaboration with Thai and international creators.",
      about_story_eyebrow: "Our Story",
      about_story_title: "The Origin of the Studio",
      about_story_desc: "Founded by the original 4 members together with 3 supporters — SUN, Kochujang (Shu-chan), and Guren Kani — who have continuously co-created and supported the studio. Most productions are published on the official YouTube channel.",
      about_contact_eyebrow: "Get in Touch",
      files_th_name: "File Name",
      files_th_desc: "Description",
      files_th_format: "Format",
      events_empty_title: "No Scheduled Events at This Time",
      events_empty_desc: "The team is primarily focusing on music projects and voicebank development. Follow our official channels so you don't miss future event announcements.",
      events_empty_btn: "Follow Our Channels",
      collab_eyebrow: "PARTNERSHIPS & SPECIAL PROJECTS",
      collab_sub_title: "Featured Collaboration Artists",
      collab_sub_desc: "Featured artists and highlight voicebanks from special collaborative projects.",
      collab_btn_roster: "View All 9 Project Groups →",
      collab_btn_drive: "📂 Master Drive: All Voicebanks",
      collab_btn_card: "View Profile & Download →"
    },

    fr: {
      nav_main: "Accueil",
      nav_about: "À propos",
      nav_voicebank: "Toutes les banques vocales",
      nav_files: "USTX / MIDI / SVP / VSQX",
      nav_collab: "Collaborations",
      nav_events: "Événements",
      nav_new_works: "Nouveautés",
      nav_thai_openutau: "Thai OpenUtau",
      nav_projects: "Projets",
      nav_toggle_open: "Ouvrir le menu de navigation",
      nav_toggle_close: "Fermer le menu de navigation",
      hero_eyebrow: "Studio de synthèse vocale thaïlandaise — Depuis 2019",
      hero_title: "Des voix virtuelles nées de la passion et<br><span class=\"accent\">de l'ingéniosité thaïlandaise</span>",
      hero_desc: "DELTA SYNTH est un studio de développement de banques vocales virtuelles (UTAU / DiffSinger AI) originaire de Thaïlande. Nous créons et entretenons plus de 57 chanteurs virtuels et 167 packages téléchargeables, capables d'interpréter des chansons en 7 langues. Toutes nos banques et fichiers musicaux sont mis gratuitement à disposition de tous les créateurs.",
      hero_btn_drive: "Télécharger les banques vocales (Google Drive)",
      hero_btn_explore: "Explorer toutes les banques",
      hero_btn_about: "Découvrir notre studio",
      spec_core_engines_title: "Moteurs principaux",
      spec_core_engines_val: "OpenUtau · DiffSinger AI · Classic UTAU (resampler / wavtool)",
      spec_repertoire_title: "Répertoire et contenu",
      spec_repertoire_val: "57+ chanteurs · 167+ packages · 1 500+ projets USTX/MIDI",
      spec_status_title: "Statut du projet",
      spec_status_val: "En ligne 24/7 · Distribution gratuite · Dérivations non-commerciales autorisées",
      spec_partner_title: "Partenaires créatifs",
      spec_partner_val: "Studio VOX · Communauté UTAU thaïlandaise · Réseau mondial de synthèse",
      spec_rd_title: "Laboratoire R&D",
      spec_rd_val: "Thai Tone Preserving RVC · The Darkside AI Agent · Suite Phonémiseur",
      spec_founded_title: "Année de fondation",
      spec_founded_val: "Août 2019 · Bangkok, Thaïlande",
      stat_singers_num: "57+",
      stat_singers_lbl: "Chanteurs virtuels",
      stat_packages_num: "167+",
      stat_packages_lbl: "Packages gratuits",
      stat_languages_num: "7",
      stat_languages_lbl: "Langues prises en charge",
      stat_free_num: "100%",
      stat_free_lbl: "Gratuit pour la création",
      pillars_eyebrow: "THREE PILLARS OF EXCELLENCE",
      pillars_title: "Les trois piliers d'excellence de DELTA SYNTH",
      pillars_desc: "De l'échantillonnage acoustique à la préservation tonale, jusqu'à la mise à disposition libre des projets musicaux.",
      pillar1_tag: "PILIER 01 · ACOUSTIQUE & IA",
      pillar1_title: "Échantillonnage de précision & Réseaux neuronaux",
      pillar1_desc: "Prise en charge de l'échantillonnage de haute fidélité (VCCV, CVVC, Arpasing) et des modèles neuronaux profonds DiffSinger AI pour un rendu fluide et naturel.",
      pillar2_tag: "PILIER 02 · PHONÉTIQUE THAÏLANDAISE",
      pillar2_title: "Préservation des 5 tons thaïlandais & Multilinguisme",
      pillar2_desc: "Développement d'un phonémiseur OpenUtau exclusif pour le thaï et d'algorithmes préservant fidèlement les cinq tons, avec prise en charge du japonais et de l'anglais.",
      pillar3_tag: "PILIER 03 · ÉCOSYSTÈME CRÉATIF",
      pillar3_title: "Ressources et fichiers musicaux en libre accès",
      pillar3_desc: "Plus de 1 500 fichiers USTX, MIDI, SVP et VSQX partagés sans restriction pour inspirer les compositeurs, arrangeurs et passionnés du monde entier.",
      showcase_eyebrow: "FEATURED SINGERS",
      showcase_title: "Chanteurs virtuels vedettes",
      showcase_desc: "Découvrez les voix emblématiques et les timbres distinctifs développés par DELTA SYNTH.",
      showcase_btn_all: "Voir les 57+ chanteurs →",
      showcase_hikaru_sub: "Light & Cybernetic Voice · Voix féminine emblématique",
      showcase_hikaru_desc: "Voix électro-pop claire et lumineuse, compatible Thai VCCV et DiffSinger AI, dotée d'aigus limpides et percutants.",
      showcase_sun_sub: "Warm & Emotional Power · Voix masculine chaleureuse et puissante",
      showcase_sun_desc: "Médiums chauds et expressifs alliés à une belle puissance dans les aigus, idéale pour le rock, la ballade et la pop.",
      showcase_relven_sub: "Mellow & Melodic Tone · Voix mélodique et douce",
      showcase_relven_desc: "Timbre doux et soigné pour la chanson folk et acoustique, avec une interprétation pleine de finesse et d'émotion.",
      showcase_andromeda_sub: "Celestial & Cosmic Diva · Voix céleste et cosmique",
      showcase_andromeda_desc: "Ampleur spatiale et résonance aérienne envoûtante, taillée sur mesure pour l'électro futuriste et les thèmes épiques.",
      btn_profile: "Consulter la fiche du profil",
      btn_download: "Télécharger la banque vocale",
      badge_coming_soon: "Bientôt disponible",
      nw_eyebrow: "NEW WORKS · AI TOOLS BY DELTA SYNTH",
      nw_title: "Dernières innovations du laboratoire DELTA SYNTH",
      nw_desc: "Outils d'intelligence artificielle conçus par notre équipe pour enrichir la création vocale virtuelle — comprenant notre WebUI Thai RVC préservant les tons thaïlandais et notre agent IA de bureau local The Darkside.",
      nw_rvc_badge: "NOUVEAUTÉ · EN DÉVELOPPEMENT ACTIF",
      nw_rvc_sub: "Tone-Preserving Thai RVC System · Conversion vocale avec tons thaïlandais authentiques",
      nw_rvc_desc: "Interface WebUI de conversion vocale basée sur RVC (Retrieval-based Voice Conversion) avec architecture sur mesure préservant les 5 tons du thaï via le contour F0 RMVPE et Thai ContentVec/HuBERT (précision tonale ≥ 95 %, MOS ≥ 4.0, RTF ≤ 0.3) et documentation bilingue thaï/anglais.",
      nw_rvc_li1: "Tout-en-un sur une seule page : conversion (inférence), gestion de dataset, entraînement (train), création d'index FAISS et séparation voix/instrumental avec UVR5",
      nw_rvc_li2: "Large compatibilité matérielle : NVIDIA CUDA, AMD / Intel (DirectML) et CPU ; lancement via Program.py (port 9378) ou go-web.bat (port 7897)",
      nw_rvc_li3: "Mode temps réel & plugin DAW : module realtime_gui.py à très faible latence et compatibilité avec le plugin RVCRealtimeVST pour stations audionumériques",
      nw_rvc_li4: "Traitement par lots sécurisé : sous-processus isolés pour prévenir les fuites de VRAM, fonction clear_vram_safe() et auto-réparation des dépendances",
      nw_rvc_btn_gh: "Code source sur GitHub",
      nw_rvc_btn_contact: "Participer aux tests",
      nw_dark_badge: "NOUVEAUTÉ · EN DÉVELOPPEMENT ACTIF",
      nw_dark_sub: "Local Agentic AI Desktop · Made by DELTA SYNTH",
      nw_dark_desc: "Application de bureau Windows pour orchestrer des agents IA autonomes sur votre propre machine via Ollama 100 % localement, sans clé API externe et avec un accès aux fichiers strictement confiné à l'espace de travail désigné.",
      nw_dark_li1: "Interface moderne Avalonia / .NET : sélection de modèles, flux continu de réflexion et d'état en direct via NDJSON avec bouton d'arrêt instantané",
      nw_dark_li2: "Outils de fichiers hautement sécurisés : read_file, write_file, list_directory avec protection anti-traversée de répertoire, écritures atomiques et limites de taille",
      nw_dark_li3: "Sécurité locale étanche : backend et passerelle strictement liés à 127.0.0.1 avec contrôle de concurrence et limitation stricte du nombre de sessions",
      nw_dark_li4: "Superviseur et contrôle de processus : surveillance automatique de la santé des processus, scripts setup, start, stop et verify intégrés",
      nw_dark_btn_gh: "Suivre sur GitHub",
      nw_dark_btn_contact: "Rejoindre les tests",
      openutau_eyebrow: "THAI OPENUTAU INTEGRATION",
      openutau_title: "Écosystème multiplateforme moderne Thai OpenUtau",
      openutau_desc: "Prise en charge intégrale du logiciel d'édition vocale open source OpenUtau, avec dictionnaires de prononciation, phonémiseurs dédiés et configurations DiffSinger pour la langue thaïlandaise.",
      openutau_badge: "ÉCOSYSTÈME OPEN SOURCE",
      openutau_core: "Thai Phonemizer & DiffSinger Support",
      openutau_f1_num: "01",
      openutau_f1_title: "Phonémiseur thaï intelligent (Thai Phonemizer)",
      openutau_f1_desc: "Analyse automatique des consonnes initiales, finales, voyelles et marques de ton thaïlandaises pour une transition naturelle sans segmentation manuelle.",
      openutau_f2_num: "02",
      openutau_f2_title: "Connexion directe neuronale DiffSinger AI",
      openutau_f2_desc: "Intégration transparente avec le moteur d'inférence DiffSinger ONNX pour ajuster la hauteur et la dynamique directement dans l'interface de composition.",
      openutau_f3_num: "03",
      openutau_f3_title: "Prêt à l'emploi sur toutes les plateformes",
      openutau_f3_desc: "Fonctionne immédiatement sur Windows, macOS et Linux. Il suffit de glisser-déposer le package vocal DELTA SYNTH pour commencer à créer.",
      openutau_btn_gh: "Voir le projet OpenUtau",
      openutau_btn_tools: "Obtenir les dictionnaires & outils",
      openutau_btn_contact: "Contacter l'équipe technique",
      files_sec_eyebrow: "CREATOR TOOLKIT & MUSIC FILES",
      files_sec_title: "Boîte à outils créateur & Fichiers musicaux",
      files_sec_desc: "Téléchargez gratuitement des fichiers de partition et de réglage USTX, MIDI, SVP et VSQX pour donner vie à vos reprises et compositions originales.",
      files_p1_tag: "PARTITIONS & ACCORDAGE · USTX / UST",
      files_p1_title: "Projets de réglage OpenUtau & UTAU",
      files_p1_desc: "Inclut les paramètres complets de notes, les courbes d'enveloppe et la phonétique calibrée, prêts à être appliqués à n'importe quel chanteur de DELTA SYNTH.",
      files_p1_btn: "Accéder aux projets",
      files_p2_tag: "DONNÉES MÉLODIQUES · MIDI / SVP",
      files_p2_title: "Pistes MIDI et projets Synthesizer V",
      files_p2_desc: "Fichiers MIDI universels et projets SVP compatibles avec tous les logiciels de MAO (Cubase, FL Studio, Logic Pro) pour simplifier votre arrangement.",
      files_p2_btn: "Télécharger les fichiers MIDI",
      files_p3_tag: "ARCHIVES COMPLÈTES · VSQX / STEMS",
      files_p3_title: "Fichiers VOCALOID & Pistes séparées (Stems)",
      files_p3_desc: "Partitions VSQX sélectionnées et pistes instrumentales multipistes sans perte pour étudier le mixage professionnel et les techniques vocales avancées.",
      files_p3_btn: "Explorer les archives",
      timeline_eyebrow: "DEVELOPMENT JOURNEY",
      timeline_title: "L'histoire et l'évolution de DELTA SYNTH",
      timeline_item1_date: "Août 2019",
      timeline_item1_title: "Fondation du studio & Premières banques thaïlandaises",
      timeline_item1_desc: "Création officielle de DELTA SYNTH, standardisation des enregistrements VCCV en thaï et publication des premières banques expérimentales.",
      timeline_item2_date: "2021",
      timeline_item2_title: "Expansion du roster & Nouvelles langues",
      timeline_item2_desc: "La distribution atteint plus de 20 chanteurs, introduction du japonais CVVC et de l'anglais Arpasing, et création du Google Drive centralisé.",
      timeline_item3_date: "2023",
      timeline_item3_title: "Transition vers OpenUtau & Arrivée de DiffSinger AI",
      timeline_item3_desc: "Migration vers OpenUtau, développement du phonémiseur thaïlandais autonome et entraînement réussi des premiers modèles neuronaux DiffSinger.",
      timeline_item4_date: "2025",
      timeline_item4_title: "Étape majeure : 57+ chanteurs & 167+ packages",
      timeline_item4_desc: "Optimisation globale du catalogue avec 57 chanteurs et 167 packages, et ouverture de plus de 1 500 partitions et fichiers de réglage à la communauté.",
      timeline_item5_date: "2026 (Aujourd'hui)",
      timeline_item5_title: "Ère de l'IA : Thai RVC & The Darkside Agent",
      timeline_item5_desc: "Lancement de la WebUI Thai RVC préservant les tons et du système d'agents IA locaux, hissant l'écosystème audio thaïlandais vers de nouveaux sommets.",
      cta_title: "Commencez votre voyage musical vocal dès aujourd'hui",
      cta_desc: "Explorez plus de 57 chanteurs virtuels uniques, téléchargez des fichiers de partition et donnez vie à vos idées musicales les plus audacieuses.",
      cta_btn_drive: "Accéder au Google Drive officiel",
      cta_btn_roster: "Voir la liste de tous les chanteurs",
      footer_desc: "DELTA SYNTH est un studio pionnier dans le développement de voix chantées virtuelles (UTAU / DiffSinger AI) et d'outils audio IA innovants en Thaïlande. Depuis 2019, nous partageons librement nos créations avec le monde entier.",
      footer_sitemap: "Plan du site",
      footer_contact: "Nous contacter",
      footer_drive: "Drive vocal",
      footer_rights: "© 2019–2026 DELTA SYNTH. Tous droits réservés.",
      footer_made_by: "Conçu et développé par DELTA SYNTH.",
      about_h1: "À propos de DELTA SYNTH",
      about_origin_title: "Nos origines et notre vision",
      about_contact_title: "Contacter le studio",
      vb_hero_crumb: "DELTA SYNTH / Toutes les banques vocales",
      vb_hero_title: "Toutes les banques vocales<br>de DELTA SYNTH",
      vb_hero_desc: "Une collection complète de 54+ personnages vocaux uniques, compatibles avec OpenUtau et DiffSinger AI, accompagnés de leurs fiches descriptives, démos audio et liens de téléchargement directs.",
      vb_drive_banner_title: "📂 Répertoire officiel Google Drive de DELTA SYNTH",
      vb_drive_banner_desc: "Téléchargez l'intégralité des banques vocales UTAU et DiffSinger AI du studio directement depuis notre serveur miroir officiel Google Drive.",
      vb_drive_banner_btn: "Accéder au Drive principal (Open Master Drive) →",
      vb_search_placeholder: "Rechercher par nom de chanteur, style, moteur ou langue...",
      vb_filter_all: "Tous (54)",
      vb_filter_diffsinger: "DiffSinger AI",
      vb_filter_utau: "UTAU",
      vb_card_profile: "👤 Profil du personnage / Profile",
      vb_card_private: "🔒 PRIVÉ · Private",
      profile_return: "← Retour à toutes les banques vocales",
      profile_return_sub: "/ Return to Voicebanks",
      profile_official: "Official DELTA",
      profile_age: "Âge / Age",
      profile_gender: "Genre / Gender",
      profile_voicer: "Donneur de voix / Voicer",
      profile_genre: "Genres favoris / Genre",
      profile_engine: "Moteur vocal / Engine",
      profile_language: "Langues / Language",
      profile_bio_title: "Biographie & Présentation / Biography",
      profile_audio_title: "Extrait sonore / Audio Sample",
      profile_audio_demo: "Aperçu démo / Demo:",
      profile_status_title: "Statut de la banque vocale · VOICEBANK STATUS",
      profile_private_title: "Statut de la banque : <span style=\"color: #ff4422;\">Privée (Private Voicebank)</span>",
      profile_private_desc: "La banque vocale de ce personnage est réservée aux productions internes du studio DELTA SYNTH et à des collaborations exclusives. Elle n'est pas disponible en téléchargement public.",
      profile_private_badge: "🔒 ACCÈS PRIVÉ RÉSERVÉ · PRIVATE ACCESS ONLY",
      profile_download_title: "Banques vocales prêtes au téléchargement",
      profile_btn_download: "Télécharger la banque",
      files_h1: "Fichiers musicaux et ressources créatives",
      files_desc: "Téléchargez librement des partitions et projets d'accordage USTX, MIDI, SVP et VSQX pour vos reprises et créations originales.",
      events_h1: "Événements & Actualités",
      events_desc: "Découvrez nos dernières sorties musicales, collaborations et salons communautaires organisés par DELTA SYNTH.",
      collab_h1: "Collaborations et partenariats",
      collab_desc: "Nous accueillons avec enthousiasme les propositions des compositeurs, illustrateurs, mixeurs et chercheurs en IA vocale.",
      project_h1: "Projets musicaux & technologiques",
      project_desc: "Explorez nos albums originaux, concerts virtuels et projets logiciels d'intelligence artificielle en cours.",
      upload_h1: "Soumettre et partager vos créations",
      vb_label_status: "Statut :",
      vb_label_affil: "Affiliation :",
      vb_label_category: "Catégorie :",
      vb_chip_all: "Tous (55)",
      vb_chip_official: "✓ Officiel (Actif)",
      vb_chip_upcoming: "⏳ À venir (Upcoming)",
      vb_chip_private: "🔒 Privé (Private)",
      vb_chip_female: "Femme (16)",
      vb_chip_male: "Homme (Male)",
      vb_chip_lgbtq: "LGBTQ (5)",
      badge_active: "✓ Officiel",
      badge_private: "🔒 Privé",
      badge_upcoming: "⏳ À venir",
      about_eyebrow: "Fondé en 2019 · 1er Projet — B.L. Student",
      about_lead: "Studio de synthèse vocale thaïlandaise fondé en 2019, menant de multiples projets créatifs en collaboration continue avec des artistes locaux et internationaux.",
      about_story_eyebrow: "Notre histoire",
      about_story_title: "Les origines du studio",
      about_story_desc: "Fondé par les 4 membres initiaux avec le soutien constant de SUN, Kochujang (Shu-chan) et Guren Kani. La majorité des créations est diffusée sur la chaîne YouTube officielle du studio.",
      about_contact_eyebrow: "Contactez-nous",
      files_th_name: "Nom du fichier",
      files_th_desc: "Description",
      files_th_format: "Format",
      events_empty_title: "Aucun événement prévu pour le moment",
      events_empty_desc: "L'équipe consacre actuellement son temps aux projets musicaux et au développement des banques vocales. Suivez nos réseaux officiels pour ne manquer aucune future annonce.",
      events_empty_btn: "Suivre nos réseaux",
      collab_eyebrow: "PARTENARIATS ET PROJETS SPÉCIAUX",
      collab_sub_title: "Artistes partenaires mis en avant",
      collab_sub_desc: "Artistes et banques vocales emblématiques issus de nos projets de collaboration spéciale.",
      collab_btn_roster: "Voir les 9 groupes de projets →",
      collab_btn_drive: "📂 Drive principal All Voicebanks",
      collab_btn_card: "Accéder au profil et télécharger →"
    },

    es: {
      nav_main: "Inicio",
      nav_about: "Sobre nosotros",
      nav_voicebank: "Bancos de voz",
      nav_files: "USTX / MIDI / SVP / VSQX",
      nav_collab: "Colaboraciones",
      nav_events: "Eventos",
      nav_new_works: "Novedades",
      nav_thai_openutau: "Thai OpenUtau",
      nav_projects: "Proyectos",
      nav_toggle_open: "Abrir menú de navegación",
      nav_toggle_close: "Cerrar menú de navegación",
      hero_eyebrow: "Estudio tailandés de síntesis vocal — Desde 2019",
      hero_title: "Voces virtuales nacidas de la pasión e<br><span class=\"accent\">innovación tailandesa</span>",
      hero_desc: "DELTA SYNTH es un estudio pionero de desarrollo de bancos de voz virtuales (UTAU / DiffSinger AI) de Tailandia. Creamos y mantenemos más de 57 cantantes virtuales y 167 paquetes descargables con soporte para cantar en 7 idiomas. Compartimos todos nuestros bancos y archivos musicales de forma gratuita para toda la comunidad creativa mundial.",
      hero_btn_drive: "Descargar bancos de voz (Google Drive)",
      hero_btn_explore: "Explorar todos los bancos",
      hero_btn_about: "Conoce nuestro estudio",
      spec_core_engines_title: "Motores principales",
      spec_core_engines_val: "OpenUtau · DiffSinger AI · Classic UTAU (resampler / wavtool)",
      spec_repertoire_title: "Repertorio y catálogo",
      spec_repertoire_val: "57+ cantantes · 167+ paquetes · 1.500+ proyectos USTX/MIDI",
      spec_status_title: "Estado del proyecto",
      spec_status_val: "Online 24/7 · Distribución gratuita · Creaciones no comerciales bienvenidas",
      spec_partner_title: "Red de colaboradores",
      spec_partner_val: "Studio VOX · Comunidad UTAU Tailandia · Red Global de Síntesis Vocal",
      spec_rd_title: "Laboratorio I+D",
      spec_rd_val: "Thai Tone Preserving RVC · The Darkside AI Agent · Suite de Fonemizadores",
      spec_founded_title: "Año de fundación",
      spec_founded_val: "Agosto de 2019 · Bangkok, Tailandia",
      stat_singers_num: "57+",
      stat_singers_lbl: "Cantantes virtuales",
      stat_packages_num: "167+",
      stat_packages_lbl: "Paquetes gratuitos",
      stat_languages_num: "7",
      stat_languages_lbl: "Idiomas soportados",
      stat_free_num: "100%",
      stat_free_lbl: "Gratuito para crear",
      pillars_eyebrow: "THREE PILLARS OF EXCELLENCE",
      pillars_title: "Los tres pilares fundamentales de DELTA SYNTH",
      pillars_desc: "Desde la grabación acústica y la preservación tonal hasta la distribución libre de recursos musicales para toda la comunidad.",
      pillar1_tag: "PILAR 01 · ACÚSTICA E IA",
      pillar1_title: "Muestreo acústico de precisión y redes neuronales",
      pillar1_desc: "Muestreo de alta fidelidad en formatos VCCV, CVVC y Arpasing junto a modelos de aprendizaje profundo DiffSinger AI para una pronunciación natural y clara.",
      pillar2_tag: "PILAR 02 · FONÉTICA TAILANDESA",
      pillar2_title: "Preservación de los 5 tonos tailandeses y soporte multilingüe",
      pillar2_desc: "Fonemizador exclusivo para OpenUtau con algoritmos de preservación tonal que respetan fielmente los tonos tailandeses, además de japonés e inglés.",
      pillar3_tag: "PILAR 03 · ECOSISTEMA CREATIVO",
      pillar3_title: "Archivos y proyectos musicales en libre acceso",
      pillar3_desc: "Más de 1.500 archivos USTX, MIDI, SVP y VSQX abiertos sin restricciones para que productores de todo el mundo creen covers y remezclas.",
      showcase_eyebrow: "FEATURED SINGERS",
      showcase_title: "Cantantes virtuales destacados",
      showcase_desc: "Escucha las voces más representativas y los timbres característicos desarrollados por DELTA SYNTH.",
      showcase_btn_all: "Ver los 57+ cantantes →",
      showcase_hikaru_sub: "Light & Cybernetic Voice · Voz femenina insignia",
      showcase_hikaru_desc: "Tono electro-pop brillante y cristalino, compatible con Thai VCCV y DiffSinger AI, con agudos nítidos y potente proyección.",
      showcase_sun_sub: "Warm & Emotional Power · Voz masculina cálida y potente",
      showcase_sun_desc: "Medios expresivos y calidez vocal combinados con gran potencia en registros altos, ideal para rock, baladas y pop.",
      showcase_relven_sub: "Mellow & Melodic Tone · Voz masculina dulce y melódica",
      showcase_relven_desc: "Timbre suave y conmovedor, perfecto para folk y baladas pop, con una interpretación llena de matices y calidez.",
      showcase_andromeda_sub: "Celestial & Cosmic Diva · Voz etérea y cósmica",
      showcase_andromeda_desc: "Atmósfera vocal amplia y envolvente, creada especialmente para géneros electrónicos, sinfónicos y temas de fantasía.",
      btn_profile: "Ver perfil del personaje",
      btn_download: "Descargar banco de voz",
      badge_coming_soon: "Próximamente",
      nw_eyebrow: "NEW WORKS · AI TOOLS BY DELTA SYNTH",
      nw_title: "Últimas innovaciones del laboratorio DELTA SYNTH",
      nw_desc: "Herramientas de IA creadas por nuestro equipo para potenciar la síntesis vocal y el trabajo autónomo en tu ordenador — incluyendo la WebUI Thai RVC con preservación tonal y nuestro asistente local The Darkside AI Agent.",
      nw_rvc_badge: "NOVEDAD · EN DESARROLLO ACTIVO",
      nw_rvc_sub: "Tone-Preserving Thai RVC System · Conversión de voz con tonos tailandeses auténticos",
      nw_rvc_desc: "Interfaz WebUI basada en RVC (Retrieval-based Voice Conversion) adaptada con precisión para conservar los 5 tonos del tailandés mediante contorno F0 RMVPE y Thai ContentVec/HuBERT (precisión tonal ≥ 95%, MOS ≥ 4.0, RTF ≤ 0.3) con documentación bilingüe tailandés/inglés.",
      nw_rvc_li1: "Todo en una sola pantalla: conversión (inferencia), gestión de datasets, entrenamiento de modelos (train), creación de índices FAISS y separación vocal/pista con UVR5",
      nw_rvc_li2: "Compatibilidad amplia: NVIDIA CUDA, AMD / Intel (DirectML) y CPU; ejecución vía Program.py (puerto 9378) o go-web.bat (puerto 7897)",
      nw_rvc_li3: "Modo en tiempo real y plugin DAW: módulo realtime_gui.py de baja latencia y soporte para plugins RVCRealtimeVST en secuenciadores de audio",
      nw_rvc_li4: "Procesamiento por lotes seguro: subprocesos aislados para evitar fugas de VRAM, función clear_vram_safe() y autorreparación de dependencias",
      nw_rvc_btn_gh: "Código fuente en GitHub",
      nw_rvc_btn_contact: "Contactar para pruebas",
      nw_dark_badge: "NOVEDAD · EN DESARROLLO ACTIVO",
      nw_dark_sub: "Local Agentic AI Desktop · Made by DELTA SYNTH",
      nw_dark_desc: "Aplicación de escritorio para Windows que ejecuta agentes de IA autónomos en tu propio equipo mediante Ollama al 100% en local, sin requerir claves API externas y con acceso estrictamente restringido al espacio de trabajo asignado.",
      nw_dark_li1: "Interfaz moderna en Avalonia / .NET: cambio de modelo, transmisión en directo del razonamiento y estado del agente vía NDJSON con botón de cancelación instantánea",
      nw_dark_li2: "Herramientas de archivo seguras: read_file, write_file, list_directory con protección contra directory traversal, escrituras atómicas y límites de tamaño",
      nw_dark_li3: "Seguridad local cerrada: backend y pasarela vinculados exclusivamente a 127.0.0.1, con gestión de concurrencia y límite de sesiones activas",
      nw_dark_li4: "Supervisión y control de procesos: monitoreo de salud automatizado y scripts completos de configuración, inicio, detención y verificación",
      nw_dark_btn_gh: "Seguir en GitHub",
      nw_dark_btn_contact: "Solicitar acceso a pruebas",
      openutau_eyebrow: "THAI OPENUTAU INTEGRATION",
      openutau_title: "Ecosistema multiplataforma moderno Thai OpenUtau",
      openutau_desc: "Compatibilidad integral con el editor de canto de código abierto OpenUtau, con diccionarios fonéticos dedicados, fonemizadores y perfiles DiffSinger para tailandés.",
      openutau_badge: "ECOSISTEMA DE CÓDIGO ABIERTO",
      openutau_core: "Thai Phonemizer & DiffSinger Support",
      openutau_f1_num: "01",
      openutau_f1_title: "Fonemizador tailandés inteligente (Thai Phonemizer)",
      openutau_f1_desc: "Identificación automática de consonantes, vocales y marcas de tono tailandesas para transiciones fluidas sin segmentación manual.",
      openutau_f2_num: "02",
      openutau_f2_title: "Conexión neuronal directa con DiffSinger AI",
      openutau_f2_desc: "Integración directa con el motor ONNX de DiffSinger para modular curvas de tono y dinámica directamente sobre el editor de notas.",
      openutau_f3_num: "03",
      openutau_f3_title: "Listo para usar en cualquier sistema",
      openutau_f3_desc: "Totalmente compatible con Windows, macOS y Linux. Solo arrastra el paquete de DELTA SYNTH y empieza a componer de inmediato.",
      openutau_btn_gh: "Ver proyecto OpenUtau",
      openutau_btn_tools: "Descargar diccionarios y utilidades",
      openutau_btn_contact: "Consultar con el equipo técnico",
      files_sec_eyebrow: "CREATOR TOOLKIT & MUSIC FILES",
      files_sec_title: "Caja de herramientas y archivos para creadores",
      files_sec_desc: "Descarga de forma gratuita archivos de afinación y partituras USTX, MIDI, SVP y VSQX para tus covers y composiciones musicales.",
      files_p1_tag: "PARTITURAS Y AFINACIÓN · USTX / UST",
      files_p1_title: "Proyectos de afinación OpenUtau y UTAU",
      files_p1_desc: "Incluye parámetros detallados de notas, envolventes dinámicas y fonética ajustada, listos para asignar a cualquier cantante de DELTA SYNTH.",
      files_p1_btn: "Explorar proyectos",
      files_p2_tag: "DATOS MELÓDICOS · MIDI / SVP",
      files_p2_title: "Pistas melódicas MIDI y proyectos Synthesizer V",
      files_p2_desc: "Archivos MIDI estándar y proyectos SVP listos para importar en cualquier DAW (Cubase, FL Studio, Logic Pro) para facilitar tus arreglos.",
      files_p2_btn: "Descargar archivos MIDI",
      files_p3_tag: "ARCHIVOS COMPLETOS · VSQX / STEMS",
      files_p3_title: "Proyectos VOCALOID y pistas separadas (Stems)",
      files_p3_desc: "Proyectos VSQX de temas clásicos e instrumentales en alta definición sin compresión para aprender técnicas avanzadas de mezcla y producción.",
      files_p3_btn: "Ver biblioteca de recursos",
      timeline_eyebrow: "DEVELOPMENT JOURNEY",
      timeline_title: "Nuestra trayectoria y evolución",
      timeline_item1_date: "Agosto de 2019",
      timeline_item1_title: "Fundación del estudio y primeros bancos tailandeses",
      timeline_item1_desc: "Se funda oficialmente DELTA SYNTH, estableciendo el estándar de muestreo VCCV en tailandés y lanzando los primeros bancos experimentales.",
      timeline_item2_date: "2021",
      timeline_item2_title: "Ampliación del elenco y soporte multilingüe",
      timeline_item2_desc: "El elenco se expande a más de 20 cantantes, incorporando bancos CVVC en japonés y Arpasing en inglés, junto con el repositorio central en Google Drive.",
      timeline_item3_date: "2023",
      timeline_item3_title: "Migración a OpenUtau y adopción de DiffSinger AI",
      timeline_item3_desc: "Transición total al ecosistema moderno de OpenUtau, desarrollo de fonemizadores dedicados para tailandés y entrenamiento exitoso de modelos DiffSinger.",
      timeline_item4_date: "2025",
      timeline_item4_title: "Hito alcanzado: 57+ cantantes y 167+ paquetes",
      timeline_item4_desc: "Consolidación de todo el catálogo con 57 cantantes y 167 paquetes de descarga, liberando más de 1.500 proyectos y partituras para toda la comunidad.",
      timeline_item5_date: "2026 (Actualidad)",
      timeline_item5_title: "Era de la IA: Thai RVC y The Darkside Agent",
      timeline_item5_desc: "Lanzamiento de Thai RVC con preservación tonal y sistema de agentes autónomos locales, impulsando el ecosistema de IA de voz en Tailandia al futuro.",
      cta_title: "Comienza tu viaje en la música vocal virtual",
      cta_desc: "Descubre más de 57 cantantes virtuales únicos, descarga proyectos de afinación y crea canciones inolvidables con nuestras herramientas.",
      cta_btn_drive: "Acceder al repositorio oficial en Google Drive",
      cta_btn_roster: "Ver el catálogo completo de cantantes",
      footer_desc: "DELTA SYNTH es un estudio pionero dedicado al desarrollo de voces cantadas virtuales (UTAU / DiffSinger AI) y herramientas avanzadas de IA de audio en Tailandia. Desde 2019, ofrecemos recursos 100% gratuitos para creadores de todo el mundo.",
      footer_sitemap: "Mapa del sitio",
      footer_contact: "Contacto",
      footer_drive: "Drive de voces",
      footer_rights: "© 2019–2026 DELTA SYNTH. Todos los derechos reservados.",
      footer_made_by: "Diseñado y desarrollado por DELTA SYNTH.",
      about_h1: "Sobre DELTA SYNTH",
      about_origin_title: "Nuestros orígenes y visión",
      about_contact_title: "Contactar al estudio",
      vb_hero_crumb: "DELTA SYNTH / Bancos de voz",
      vb_hero_title: "Todos los bancos de voz<br>de DELTA SYNTH",
      vb_hero_desc: "Catálogo completo con más de 54 personajes con timbres únicos, compatibles con OpenUtau y DiffSinger AI, con perfiles detallados, muestras de audio y enlaces directos de descarga.",
      vb_drive_banner_title: "📂 Repositorio oficial en Google Drive de DELTA SYNTH",
      vb_drive_banner_desc: "Descarga todos los bancos de voz UTAU y DiffSinger AI del estudio directamente desde el servidor oficial en Google Drive.",
      vb_drive_banner_btn: "Abrir repositorio principal (Open Master Drive) →",
      vb_search_placeholder: "Buscar por nombre, estilo vocal, motor o idioma...",
      vb_filter_all: "Todos (54)",
      vb_filter_diffsinger: "DiffSinger AI",
      vb_filter_utau: "UTAU",
      vb_card_profile: "👤 Perfil del personaje / Profile",
      vb_card_private: "🔒 PRIVADO · Private",
      profile_return: "← Volver a todos los bancos de voz",
      profile_return_sub: "/ Return to Voicebanks",
      profile_official: "Official DELTA",
      profile_age: "Edad / Age",
      profile_gender: "Género / Gender",
      profile_voicer: "Proveedor de voz / Voicer",
      profile_genre: "Géneros favoritos / Genre",
      profile_engine: "Motor vocal / Engine",
      profile_language: "Idiomas / Language",
      profile_bio_title: "Biografía y trasfondo / Biography",
      profile_audio_title: "Muestra de audio / Audio Sample",
      profile_audio_demo: "Demo de audio / Demo:",
      profile_status_title: "Estado del banco de voz · VOICEBANK STATUS",
      profile_private_title: "Estado del banco: <span style=\"color: #ff4422;\">Privado (Private Voicebank)</span>",
      profile_private_desc: "El banco de voz de este personaje es de uso exclusivo interno en las producciones de DELTA SYNTH y proyectos especiales. No está disponible para descarga pública.",
      profile_private_badge: "🔒 ACCESO EXCLUSIVO PRIVADO · PRIVATE ACCESS ONLY",
      profile_download_title: "Bancos de voz disponibles para descarga",
      profile_btn_download: "Descargar banco",
      files_h1: "Archivos musicales y recursos creativos",
      files_desc: "Descarga gratuitamente partituras y proyectos de afinación USTX, MIDI, SVP y VSQX para tus covers y producciones musicales.",
      events_h1: "Eventos y novedades",
      events_desc: "Mantente al tanto de nuestros lanzamientos musicales, eventos comunitarios y actividades organizadas por DELTA SYNTH.",
      collab_h1: "Colaboraciones y contacto",
      collab_desc: "Estamos abiertos a colaborar con productores musicales, ilustradores, afinadores de voz e investigadores de IA vocal.",
      project_h1: "Proyectos musicales y tecnológicos",
      project_desc: "Conoce nuestros álbumes originales, eventos virtuales y proyectos de desarrollo de herramientas de inteligencia artificial.",
      upload_h1: "Enviar y compartir tus obras",
      vb_label_status: "Estado:",
      vb_label_affil: "Afiliación:",
      vb_label_category: "Categoría:",
      vb_chip_all: "Todos (55)",
      vb_chip_official: "✓ Oficial (Activo)",
      vb_chip_upcoming: "⏳ Próximamente (Upcoming)",
      vb_chip_private: "🔒 Privado (Private)",
      vb_chip_female: "Femenino (16)",
      vb_chip_male: "Masculino (Male)",
      vb_chip_lgbtq: "LGBTQ (5)",
      badge_active: "✓ Oficial",
      badge_private: "🔒 Privado",
      badge_upcoming: "⏳ Próximamente",
      about_eyebrow: "Fundado en 2019 · 1er Proyecto — B.L. Student",
      about_lead: "Estudio de síntesis vocal tailandés fundado en 2019, que desarrolla diversos proyectos creativos en colaboración continua con artistas de Tailandia y de todo el mundo.",
      about_story_eyebrow: "Nuestra historia",
      about_story_title: "El origen del estudio",
      about_story_desc: "Fundado por los primeros 4 miembros junto a 3 colaboradores clave — SUN, Kochujang (Shu-chan) y Guren Kani — quienes han co-creado y apoyado al estudio permanentemente. La mayoría de las producciones se publican en el canal oficial de YouTube.",
      about_contact_eyebrow: "Contáctanos",
      files_th_name: "Nombre del archivo",
      files_th_desc: "Descripción",
      files_th_format: "Formato",
      events_empty_title: "No hay eventos programados en este momento",
      events_empty_desc: "El equipo se encuentra enfocado principalmente en la producción musical y el desarrollo de bancos de voz. Sigue nuestros canales oficiales para no perderte futuros eventos.",
      events_empty_btn: "Seguir nuestros canales",
      collab_eyebrow: "COLABORACIONES Y PROYECTOS ESPECIALES",
      collab_sub_title: "Artistas colaboradores destacados",
      collab_sub_desc: "Artistas y bancos de voz destacados nacidos de proyectos especiales de colaboración.",
      collab_btn_roster: "Ver los 9 grupos de proyectos →",
      collab_btn_drive: "📂 Drive maestro: Todos los bancos",
      collab_btn_card: "Ver perfil y descargar →"
    },

    'es-cl': {
      nav_main: "Inicio",
      nav_about: "Sobre el estudio",
      nav_voicebank: "Catálogo de voces",
      nav_files: "USTX / MIDI / SVP / VSQX",
      nav_collab: "Colaboraciones",
      nav_events: "Eventos y novedades",
      nav_new_works: "Novedades y proyectos",
      nav_thai_openutau: "Thai OpenUtau",
      nav_projects: "Proyectos",
      nav_toggle_open: "Abrir menú de navegación",
      nav_toggle_close: "Cerrar menú de navegación",
      hero_eyebrow: "Estudio tailandés de síntesis vocal — Desde 2019",
      hero_title: "Voces virtuales nacidas con la pasión y el<br><span class=\"accent\">talento de Tailandia</span>",
      hero_desc: "DELTA SYNTH es un estudio de desarrollo de librerías y bancos de voz virtuales (UTAU / DiffSinger AI) de Tailandia. Creamos y mantenemos más de 57 cantantes virtuales con 167 paquetes listos para descargar y cantar en 7 idiomas. Compartimos todos los bancos y archivos de música 100% gratis para que cualquier creador en Chile y el mundo haga música sin frenos.",
      hero_btn_drive: "Descargar bancos de voz (Google Drive)",
      hero_btn_explore: "Explorar todas las voces",
      hero_btn_about: "Conoce nuestro estudio",
      spec_core_engines_title: "Motores principales",
      spec_core_engines_val: "OpenUtau · DiffSinger AI · UTAU clásico (resampler / wavtool)",
      spec_repertoire_title: "Catálogo y repertorio",
      spec_repertoire_val: "57+ cantantes · 167+ paquetes · Más de 1.500 proyectos USTX/MIDI",
      spec_status_title: "Estado del proyecto",
      spec_status_val: "Online 24/7 · Descarga libre · Creación no comercial totalmente bienvenida",
      spec_partner_title: "Red de creadores",
      spec_partner_val: "Studio VOX · Comunidad UTAU Tailandia · Red Global de Síntesis Vocal",
      spec_rd_title: "Laboratorio I+D",
      spec_rd_val: "Thai Tone Preserving RVC · The Darkside AI Agent · Suite de Fonemizadores",
      spec_founded_title: "Año de fundación",
      spec_founded_val: "Agosto de 2019 · Bangkok, Tailandia",
      stat_singers_num: "57+",
      stat_singers_lbl: "Cantantes en catálogo",
      stat_packages_num: "167+",
      stat_packages_lbl: "Paquetes gratuitos",
      stat_languages_num: "7",
      stat_languages_lbl: "Idiomas soportados",
      stat_free_num: "100%",
      stat_free_lbl: "Gratis para crear",
      pillars_eyebrow: "THREE PILLARS OF EXCELLENCE",
      pillars_title: "Los tres pilares esenciales de DELTA SYNTH",
      pillars_desc: "Desde la grabación acústica en estudio y la preservación tonal hasta la entrega abierta de archivos para toda la escena musical.",
      pillar1_tag: "PILAR 01 · ACÚSTICA E INTELIGENCIA ARTIFICIAL",
      pillar1_title: "Muestreo acústico preciso y modelos neuronales",
      pillar1_desc: "Grabaciones en formatos VCCV, CVVC y Arpasing junto a modelos de redes neuronales DiffSinger AI para que las voces suenen naturales, fluidas y claritas.",
      pillar2_tag: "PILAR 02 · FONÉTICA TAILANDESA Y MULTILINGÜE",
      pillar2_title: "Preservación de los 5 tonos y versatilidad idiomática",
      pillar2_desc: "Fonemizador exclusivo para OpenUtau con algoritmos diseñados para conservar intactos los 5 tonos del tailandés, además de cantar en japonés e inglés.",
      pillar3_tag: "PILAR 03 · ECOSISTEMA CREATIVO",
      pillar3_title: "Archivos y proyectos abiertos para la comunidad",
      pillar3_desc: "Más de 1.500 archivos USTX, MIDI, SVP y VSQX compartidos libremente para que productores y aficionados armen sus propios covers y temas originales.",
      showcase_eyebrow: "FEATURED SINGERS",
      showcase_title: "Cantantes destacados del estudio",
      showcase_desc: "Descubre las voces con más personalidad y los timbres característicos de DELTA SYNTH.",
      showcase_btn_all: "Ver los 57+ cantantes →",
      showcase_hikaru_sub: "Light & Cybernetic Voice · Voz femenina principal",
      showcase_hikaru_desc: "Voz electro-pop brillante y limpia, compatible con Thai VCCV y DiffSinger AI, con agudos potentes que destacan en cualquier mezcla.",
      showcase_sun_sub: "Warm & Emotional Power · Voz masculina cálida y con fuerza",
      showcase_sun_desc: "Medios cálidos y gran cuerpo vocal junto a una potencia tremenda en agudos, ideal para rock, baladas y pop latino.",
      showcase_relven_sub: "Mellow & Melodic Tone · Voz masculina suave y acústica",
      showcase_relven_desc: "Timbre dulce y melódico, ideal para folk y baladas suaves, con una expresividad súper natural y cercana.",
      showcase_andromeda_sub: "Celestial & Cosmic Diva · Voz etérea y espacial",
      showcase_andromeda_desc: "Voz con una atmósfera envolvente y resonancia cósmica, perfecta para música electrónica, sinfónica y fantasía.",
      btn_profile: "Ver perfil completo",
      btn_download: "Descargar voz",
      badge_coming_soon: "Próximamente",
      nw_eyebrow: "NEW WORKS · AI TOOLS BY DELTA SYNTH",
      nw_title: "Lo nuevo de nuestro laboratorio de desarrollo",
      nw_desc: "Herramientas de IA creadas en casa para enriquecer la síntesis vocal y el trabajo autónomo en tu PC — incluyendo la WebUI Thai RVC con preservación tonal y nuestro asistente local The Darkside AI Agent.",
      nw_rvc_badge: "NOVEDAD · EN DESARROLLO ACTIVO",
      nw_rvc_sub: "Tone-Preserving Thai RVC System · Conversión de voz con tonos tailandeses auténticos",
      nw_rvc_desc: "WebUI basada en RVC (Retrieval-based Voice Conversion) adaptada para mantener al 100% los 5 tonos del tailandés usando el contorno F0 RMVPE y Thai ContentVec/HuBERT (precisión tonal ≥ 95%, MOS ≥ 4.0, RTF ≤ 0.3) con guía en tailandés e inglés.",
      nw_rvc_li1: "Todo en un solo panel: conversión de voz (inferencia), gestión de datasets, entrenamiento (train), armado de índices FAISS y separación vocal con UVR5",
      nw_rvc_li2: "Gran soporte de hardware: NVIDIA CUDA, AMD / Intel (DirectML) y CPU; listo para iniciar con Program.py (puerto 9378) o go-web.bat (puerto 7897)",
      nw_rvc_li3: "Monitoreo en tiempo real y plugin DAW: módulo realtime_gui.py de baja latencia y soporte para plugins RVCRealtimeVST en tu DAW favorito",
      nw_rvc_li4: "Procesamiento por lotes seguro: subprocesos separados para evitar que se sature la VRAM, función clear_vram_safe() y reparación automática de paquetes",
      nw_rvc_btn_gh: "Código en GitHub",
      nw_rvc_btn_contact: "Contactar para probar",
      nw_dark_badge: "NOVEDAD · EN DESARROLLO ACTIVO",
      nw_dark_sub: "Local Agentic AI Desktop · Made by DELTA SYNTH",
      nw_dark_desc: "Aplicación de escritorio para Windows que corre agentes de IA autónomos en tu propio PC con Ollama 100% en local, sin requerir APIs externas y con acceso protegido exclusivamente a la carpeta que definas.",
      nw_dark_li1: "Interfaz moderna en Avalonia / .NET: cambio de modelo, streaming de pensamiento y estado del agente en vivo vía NDJSON con botón de parada inmediata",
      nw_dark_li2: "Herramientas de archivos seguras: funciones read_file, write_file y list_directory protegidas contra directory traversal y con límites de tamaño",
      nw_dark_li3: "Entorno local blindado: backend y gateway restringidos a 127.0.0.1 con control de concurrencia y límite de sesiones activas",
      nw_dark_li4: "Supervisión continua: chequeo de salud automático para procesos y scripts listos de setup, start, stop y verify",
      nw_dark_btn_gh: "Seguir en GitHub",
      nw_dark_btn_contact: "Sumarse a las pruebas",
      openutau_eyebrow: "THAI OPENUTAU INTEGRATION",
      openutau_title: "Ecosistema moderno multiplataforma Thai OpenUtau",
      openutau_desc: "Integración completa con el editor de canto de código abierto OpenUtau, con diccionarios de pronunciación, fonemizadores dedicados y soporte DiffSinger para tailandés.",
      openutau_badge: "ECOSISTEMA DE CÓDIGO ABIERTO",
      openutau_core: "Thai Phonemizer & DiffSinger Support",
      openutau_f1_num: "01",
      openutau_f1_title: "Fonemizador tailandés inteligente (Thai Phonemizer)",
      openutau_f1_desc: "Reconoce automáticamente consonantes iniciales, vocales y marcas de tono para generar transiciones suaves sin cortes raros.",
      openutau_f2_num: "02",
      openutau_f2_title: "Conexión directa con la red neuronal DiffSinger AI",
      openutau_f2_desc: "Se enlaza de forma nativa con el motor ONNX de DiffSinger para retocar curvas de pitch y dinámica directamente sobre el editor de notas.",
      openutau_f3_num: "03",
      openutau_f3_title: "Listo para usar en cualquier sistema operativo",
      openutau_f3_desc: "Funciona perfecto en Windows, macOS y Linux. Solo arrastras el paquete de DELTA SYNTH y ya puedes ponerte a cantar.",
      openutau_btn_gh: "Ir al proyecto OpenUtau",
      openutau_btn_tools: "Descargar diccionarios y herramientas",
      openutau_btn_contact: "Consultar con el equipo de soporte",
      files_sec_eyebrow: "CREATOR TOOLKIT & MUSIC FILES",
      files_sec_title: "Caja de herramientas y archivos de música para creadores",
      files_sec_desc: "Descarga sin costo proyectos de afinación y partituras en USTX, MIDI, SVP y VSQX para acelerar tus covers y temas propios.",
      files_p1_tag: "PARTITURAS Y AFINACIÓN · USTX / UST",
      files_p1_title: "Proyectos de afinación OpenUtau y UTAU",
      files_p1_desc: "Vienen con parámetros de notas, curvas de volumen y fonética afinada listos para cargar en cualquier cantante de DELTA SYNTH.",
      files_p1_btn: "Ver proyectos de afinación",
      files_p2_tag: "DATOS MELÓDICOS · MIDI / SVP",
      files_p2_title: "Pistas melódicas MIDI y archivos Synthesizer V",
      files_p2_desc: "Archivos MIDI estándar y proyectos SVP para importar en Cubase, FL Studio, Logic Pro o cualquier secuenciador de audio.",
      files_p2_btn: "Descargar archivos MIDI",
      files_p3_tag: "ARCHIVOS COMPLETOS · VSQX / STEMS",
      files_p3_title: "Proyectos VOCALOID y pistas separadas (Stems)",
      files_p3_desc: "Archivos VSQX y pistas multipista de temas clásicos en alta calidad para estudiar mezclas profesionales y técnicas vocales avanzadas.",
      files_p3_btn: "Revisar biblioteca de recursos",
      timeline_eyebrow: "DEVELOPMENT JOURNEY",
      timeline_title: "El camino y crecimiento de DELTA SYNTH",
      timeline_item1_date: "Agosto de 2019",
      timeline_item1_title: "Fundación del estudio y primeros bancos tailandeses",
      timeline_item1_desc: "Nace oficialmente DELTA SYNTH, sentando las bases del muestreo VCCV en tailandés y lanzando los primeros bancos experimentales.",
      timeline_item2_date: "2021",
      timeline_item2_title: "Crecimiento del elenco e idiomas adicionales",
      timeline_item2_desc: "El equipo suma más de 20 cantantes, incorporando bancos CVVC en japonés y Arpasing en inglés, junto con el Google Drive centralizado.",
      timeline_item3_date: "2023",
      timeline_item3_title: "Salto a OpenUtau y adopción de DiffSinger AI",
      timeline_item3_desc: "Transición completa al ecosistema de OpenUtau, creación del fonemizador tailandés propio y primer entrenamiento exitoso de modelos DiffSinger.",
      timeline_item4_date: "2025",
      timeline_item4_title: "Gran hito: 57+ cantantes y 167+ paquetes de voz",
      timeline_item4_desc: "Se consolida todo el catálogo con 57 cantantes y 167 paquetes de descarga, abriendo más de 1.500 archivos y proyectos a la comunidad.",
      timeline_item5_date: "2026 (Actualidad)",
      timeline_item5_title: "Era de la IA: Thai RVC y The Darkside Agent",
      timeline_item5_desc: "Lanzamiento de Thai RVC con preservación tonal y sistema de agentes autónomos de escritorio, llevando la síntesis vocal tailandesa a la vanguardia.",
      cta_title: "Empieza hoy tu viaje en la música con voces virtuales",
      cta_desc: "Explora más de 57 cantantes con personalidades y timbres únicos, descarga proyectos listos y dale vida a tus mejores canciones.",
      cta_btn_drive: "Entrar al Google Drive oficial",
      cta_btn_roster: "Ver la lista completa de cantantes",
      footer_desc: "DELTA SYNTH es un estudio pionero dedicado al desarrollo de voces cantadas virtuales (UTAU / DiffSinger AI) y herramientas de IA de audio en Tailandia. Desde 2019, ofrecemos recursos 100% gratuitos para creadores de todo el planeta.",
      footer_sitemap: "Mapa del sitio",
      footer_contact: "Contacto",
      footer_drive: "Drive oficial de voces",
      footer_rights: "© 2019–2026 DELTA SYNTH. Todos los derechos reservados.",
      footer_made_by: "Diseñado y desarrollado por DELTA SYNTH.",
      about_h1: "Sobre DELTA SYNTH",
      about_origin_title: "Nuestros inicios y visión",
      about_contact_title: "Contacto con el estudio",
      vb_hero_crumb: "DELTA SYNTH / Catálogo de voces",
      vb_hero_title: "Todos los bancos de voz<br>de DELTA SYNTH",
      vb_hero_desc: "Catálogo completo con más de 54 personajes con timbres únicos, compatibles con OpenUtau y DiffSinger AI, con biografías, muestras de audio y descarga directa.",
      vb_drive_banner_title: "📂 Repositorio oficial en Google Drive de DELTA SYNTH",
      vb_drive_banner_desc: "Descarga todos los bancos de voz UTAU y DiffSinger AI del estudio directamente desde el servidor oficial en Google Drive.",
      vb_drive_banner_btn: "Abrir repositorio principal (Open Master Drive) →",
      vb_search_placeholder: "Buscar por nombre, estilo vocal, motor o idioma...",
      vb_filter_all: "Todos (54)",
      vb_filter_diffsinger: "DiffSinger AI",
      vb_filter_utau: "UTAU",
      vb_card_profile: "👤 Perfil del personaje / Profile",
      vb_card_private: "🔒 PRIVADO · Private",
      profile_return: "← Volver al catálogo de voces",
      profile_return_sub: "/ Return to Voicebanks",
      profile_official: "Official DELTA",
      profile_age: "Edad / Age",
      profile_gender: "Género / Gender",
      profile_voicer: "Proveedor de voz / Voicer",
      profile_genre: "Géneros favoritos / Genre",
      profile_engine: "Motor vocal / Engine",
      profile_language: "Idiomas / Language",
      profile_bio_title: "Biografía e historia / Biography",
      profile_audio_title: "Muestra de audio / Audio Sample",
      profile_audio_demo: "Demo de audio / Demo:",
      profile_status_title: "Estado de la voz · VOICEBANK STATUS",
      profile_private_title: "Estado de la voz: <span style=\"color: #ff4422;\">Privada (Private Voicebank)</span>",
      profile_private_desc: "La voz de este personaje está reservada para uso exclusivo interno en producciones de DELTA SYNTH y proyectos especiales. No cuenta con descarga pública.",
      profile_private_badge: "🔒 ACCESO EXCLUSIVO PRIVADO · PRIVATE ACCESS ONLY",
      profile_download_title: "Voces disponibles para descarga",
      profile_btn_download: "Descargar voz",
      files_h1: "Archivos musicales y recursos creativos",
      files_desc: "Descarga gratis partituras y proyectos de afinación en USTX, MIDI, SVP y VSQX para armar tus temas y covers.",
      events_h1: "Eventos y novedades",
      events_desc: "Conoce los últimos lanzamientos de canciones, ferias comunitarias y actividades de DELTA SYNTH.",
      collab_h1: "Colaboraciones y contacto",
      collab_desc: "Siempre nos motiva colaborar con productores musicales, dibujantes, afinadores e investigadores de IA vocal.",
      project_h1: "Proyectos musicales y tecnológicos",
      project_desc: "Revisa nuestros álbumes originales, conciertos virtuales y proyectos de software con inteligencia artificial.",
      upload_h1: "Enviar y compartir tus creaciones",
      vb_label_status: "Estado:",
      vb_label_affil: "Afiliación:",
      vb_label_category: "Categoría:",
      vb_chip_all: "Todos (55)",
      vb_chip_official: "✓ Oficial (Activo)",
      vb_chip_upcoming: "⏳ Próximamente (Upcoming)",
      vb_chip_private: "🔒 Privado (Private)",
      vb_chip_female: "Femenino (16)",
      vb_chip_male: "Masculino (Male)",
      vb_chip_lgbtq: "LGBTQ (5)",
      badge_active: "✓ Oficial",
      badge_private: "🔒 Privado",
      badge_upcoming: "⏳ Próximamente",
      about_eyebrow: "Fundado en 2019 · 1er Proyecto — B.L. Student",
      about_lead: "Estudio de síntesis vocal tailandés fundado en 2019, desarrollando diversos proyectos creativos en colaboración permanente con artistas de Chile, Tailandia y el mundo.",
      about_story_eyebrow: "Nuestra historia",
      about_story_title: "El origen del estudio",
      about_story_desc: "Fundado por los primeros 4 miembros junto al apoyo constante de SUN, Kochujang (Shu-chan) y Guren Kani. La mayoría de las obras se comparten a través del canal oficial de YouTube del estudio.",
      about_contact_eyebrow: "Contacto",
      files_th_name: "Nombre del archivo",
      files_th_desc: "Descripción",
      files_th_format: "Formato",
      events_empty_title: "No hay eventos agendados en este momento",
      events_empty_desc: "El equipo está concentrado en la producción musical y en el desarrollo de voces. Sigue nuestras redes oficiales para estar al tanto de los próximos eventos.",
      events_empty_btn: "Seguir nuestros canales",
      collab_eyebrow: "COLABORACIONES Y PROYECTOS ESPECIALES",
      collab_sub_title: "Artistas colaboradores destacados",
      collab_sub_desc: "Artistas y bancos de voz destacados nacidos de proyectos especiales de colaboración.",
      collab_btn_roster: "Ver los 9 grupos de proyectos →",
      collab_btn_drive: "📂 Drive maestro: Todos los bancos",
      collab_btn_card: "Ver perfil y descargar →"
    },

    zh: {
      nav_main: "主页",
      nav_about: "关于我们",
      nav_voicebank: "全部歌声库",
      nav_files: "USTX / MIDI / SVP / VSQX",
      nav_collab: "合作交流",
      nav_events: "活动与动态",
      nav_new_works: "最新作品",
      nav_thai_openutau: "Thai OpenUtau",
      nav_projects: "项目展示",
      nav_toggle_open: "打开导航菜单",
      nav_toggle_close: "关闭导航菜单",
      hero_eyebrow: "泰国虚拟歌声合成工作室 — 始于 2019",
      hero_title: "源自泰国创造力与热情的<br><span class=\"accent\">次世代虚拟歌声</span>",
      hero_desc: "DELTA SYNTH 是来自泰国的虚拟歌声库（UTAU / DiffSinger AI）开发工作室。制作并维护超过 57 位虚拟歌手及 167+ 款音源下载包，支持 7 种语言歌唱，致力于为全球音乐创作者免费提供高品质歌声库与工程文件。",
      hero_btn_drive: "下载歌声库 (Google Drive)",
      hero_btn_explore: "浏览全部歌声库",
      hero_btn_about: "了解我们工作室",
      spec_core_engines_title: "核心引擎",
      spec_core_engines_val: "OpenUtau · DiffSinger AI · Classic UTAU (resampler / wavtool)",
      spec_repertoire_title: "作品曲库",
      spec_repertoire_val: "57+ 歌手 · 167+ 音源包 · 1,500+ USTX/MIDI 工程",
      spec_status_title: "项目状态",
      spec_status_val: "7x24 在线 · 免费分发 · 开放非商业二次创作",
      spec_partner_title: "合作伙伴",
      spec_partner_val: "Studio VOX · Thai UTAU Community · Global Synthesizer Network",
      spec_rd_title: "研发中心",
      spec_rd_val: "Thai Tone Preserving RVC · The Darkside AI Agent · Phonemizer Suite",
      spec_founded_title: "成立年份",
      spec_founded_val: "2019 年 8 月 · 曼谷，泰国 (Bangkok, Thailand)",
      stat_singers_num: "57+",
      stat_singers_lbl: "旗下虚拟歌手",
      stat_packages_num: "167+",
      stat_packages_lbl: "免费音源包",
      stat_languages_num: "7",
      stat_languages_lbl: "支持演唱语言",
      stat_free_num: "100%",
      stat_free_lbl: "免费提供创作",
      pillars_eyebrow: "THREE PILLARS OF EXCELLENCE",
      pillars_title: "DELTA SYNTH 的三大核心支柱",
      pillars_desc: "从声学录音、声调保持算法到工程文件分发，我们打造全流程专业虚拟歌声生态。",
      pillar1_tag: "PILLAR 01 · ACOUSTIC & AI",
      pillar1_title: "高品质音源采样与神经声学模型",
      pillar1_desc: "支持 VCCV、CVVC、Arpasing 传统采样以及 DiffSinger AI 深度学习声学模型，声音自然圆润，发音清晰纯净。",
      pillar2_tag: "PILLAR 02 · THAI PHONETICS",
      pillar2_title: "专精泰语音调保持与跨语言支持",
      pillar2_desc: "独家开发泰语 5 声调 OpenUtau 音素解析器与 Tone-Preserving 算法，完美还原泰语、日语、英语等多语种发音。",
      pillar3_tag: "PILLAR 03 · CREATIVE ECOSYSTEM",
      pillar3_title: "开放共享的创作者工程资源库",
      pillar3_desc: "无保留公开 1,500+ USTX、MIDI、SVP 及 VSQX 工程文件，支持全球创作者自由翻唱、混音与教学交流。",
      showcase_eyebrow: "FEATURED SINGERS",
      showcase_title: "精选旗舰虚拟歌手",
      showcase_desc: "聆听 DELTA SYNTH 最具代表性的标志性声音与音色。",
      showcase_btn_all: "查看全部 57+ 歌手 →",
      showcase_hikaru_sub: "Light & Cybernetic Voice · 核心主打女声",
      showcase_hikaru_desc: "清澈明亮的流行电音声线，支持 Thai VCCV 与 DiffSinger AI，高音通透穿透力强。",
      showcase_sun_sub: "Warm & Emotional Power · 温暖力量型男声",
      showcase_sun_desc: "深情温暖的中低音与高音爆发力兼备，完美驾驭摇滚、抒情与流行曲风。",
      showcase_relven_sub: "Mellow & Melodic Tone · 柔和旋律型男声",
      showcase_relven_desc: "柔和细腻的民谣与流行声线，音色干净自然，充满故事感。",
      showcase_andromeda_sub: "Celestial & Cosmic Diva · 空灵星际女声",
      showcase_andromeda_desc: "宽广空灵的声场表现，适合电子、交响与史诗幻想曲风。",
      btn_profile: "查看歌手档案",
      btn_download: "下载音源包",
      badge_coming_soon: "即将推出",
      nw_eyebrow: "NEW WORKS · AI TOOLS BY DELTA SYNTH",
      nw_title: "DELTA SYNTH 研发实验室最新成果",
      nw_desc: "由团队自主研发的 AI 赋能工具，专注于虚拟歌声与本地智能助手——包括保留泰语音调的 Tone-Preserving Thai RVC WebUI，以及完全运行于本地的 The Darkside AI Agent。",
      nw_rvc_badge: "NEW WORK · ACTIVE DEVELOPMENT",
      nw_rvc_sub: "Tone-Preserving Thai RVC System · 泰语声调保持变声系统",
      nw_rvc_desc: "基于检索式变声技术（Retrieval-based Voice Conversion）定制优化的 WebUI，采用 RMVPE F0 轮廓与 Thai ContentVec/HuBERT，完整保留泰语五声调（声调准确率 ≥ 95%, MOS ≥ 4.0, RTF ≤ 0.3），附带泰英双语指南。",
      nw_rvc_li1: "单页面全流程：支持音频推理（Inference）、数据集制作、模型训练（Train）、FAISS 索引构建及 UVR5 人声/伴奏分离",
      nw_rvc_li2: "全硬件适配：原生支持 NVIDIA CUDA、AMD/Intel (DirectML) 及 CPU，可通过 Program.py (端口 9378) 或 go-web.bat (端口 7897) 启动",
      nw_rvc_li3: "实时监听与 DAW 插件：提供 realtime_gui.py 低延迟实时变声，并支持 RVCRealtimeVST 宿主插件集成",
      nw_rvc_li4: "安全批处理机制：子进程隔离杜绝显存泄漏，配备 clear_vram_safe() 与依赖环境自愈修复系统",
      nw_rvc_btn_gh: "GitHub 源码仓库",
      nw_rvc_btn_contact: "申请测试与反馈",
      nw_dark_badge: "NEW WORK · ACTIVE DEVELOPMENT",
      nw_dark_sub: "Local Agentic AI Desktop · Made by DELTA SYNTH",
      nw_dark_desc: "专为 Windows 打造的自主 AI Agent 桌面系统，基于 Ollama 100% 本地运算，无需外接 API Key，权限严格沙盒隔离于指定工作区。",
      nw_dark_li1: "现代化 Avalonia / .NET 界面：实时模型切换、NDJSON 实时思维流与运行状态呈现，支持一键安全终止",
      nw_dark_li2: "高防护文件工具集：提供 read_file、write_file、list_directory，内置防路径遍历、原子写入与体积上限限制",
      nw_dark_li3: "严格隔离架构：后端与网关专属绑定于 127.0.0.1，受控并发调度与会话数量保护",
      nw_dark_li4: "进程守护机制：内置守护进程自动健康检查，附带 setup、start、stop、verify 全套自动化运维脚本",
      nw_dark_btn_gh: "GitHub 跟踪进度",
      nw_dark_btn_contact: "联系加入测试",
      openutau_eyebrow: "THAI OPENUTAU INTEGRATION",
      openutau_title: "新时代跨平台 Thai OpenUtau 生态",
      openutau_desc: "全面拥抱现代开源码歌声编辑软件 OpenUtau，为泰语歌声合成量身定制发音词典、音素解析器与 DiffSinger 配置文件。",
      openutau_badge: "OPEN SOURCE ECOSYSTEM",
      openutau_core: "Thai Phonemizer & DiffSinger Support",
      openutau_f1_num: "01",
      openutau_f1_title: "智能泰语音素解析器 (Thai Phonemizer)",
      openutau_f1_desc: "自动识别泰语声母、韵母及声调标记，无需手动拆分音节即可实现平滑发音过渡。",
      openutau_f2_num: "02",
      openutau_f2_title: "DiffSinger AI 神经声学直连",
      openutau_f2_desc: "无缝对接 DiffSinger ONNX 推理引擎，在 OpenUtau 画布上直接绘制音高线与表现力曲线。",
      openutau_f3_num: "03",
      openutau_f3_title: "跨平台开箱即用",
      openutau_f3_desc: "完美兼容 Windows、macOS 与 Linux，一键导入 DELTA SYNTH 歌声包即可开嗓演唱。",
      openutau_btn_gh: "访问 OpenUtau 项目",
      openutau_btn_tools: "获取泰语词典与工具",
      openutau_btn_contact: "向技术团队咨询",
      files_sec_eyebrow: "CREATOR TOOLKIT & MUSIC FILES",
      files_sec_title: "创作者素材与工程文件库",
      files_sec_desc: "免费获取 USTX、MIDI、SVP 及 VSQX 调校工程文件，为您的翻唱与原创作曲加速赋能。",
      files_p1_tag: "SCORE & TUNING · USTX / UST",
      files_p1_title: "OpenUtau & UTAU 调校工程",
      files_p1_desc: "内含完整音符参数、包络曲线与音素校正，快速套入任意 DELTA SYNTH 歌手。",
      files_p1_btn: "进入工程库",
      files_p2_tag: "NOTE DATA · MIDI / SVP",
      files_p2_title: "MIDI 旋律与 Synthesizer V 工程",
      files_p2_desc: "标准 MIDI 音轨与 SVP 工程，方便导入各大 DAW（Cubase、FL Studio、Logic Pro）二次编曲。",
      files_p2_btn: "下载 MIDI 文件",
      files_p3_tag: "PACKAGE ARCHIVES · VSQX / STEMS",
      files_p3_title: "VOCALOID 工程与分轨素材",
      files_p3_desc: "精选经典歌曲的 VSQX 格式及高质量无损伴奏分轨，学习专业混音与调音技巧。",
      files_p3_btn: "查看素材库",
      timeline_eyebrow: "DEVELOPMENT JOURNEY",
      timeline_title: "DELTA SYNTH 的成长历程",
      timeline_item1_date: "2019 年 8 月",
      timeline_item1_title: "工作室成立与首批 UTAU 泰语音源",
      timeline_item1_desc: "DELTA SYNTH 正式成立，启动泰语 VCCV 采样标准的规范化制定，发布首款实验性音源。",
      timeline_item2_date: "2021 年",
      timeline_item2_title: "扩充歌手阵容与跨语种支持",
      timeline_item2_desc: "歌手规模扩展至 20+ 位，引入日语 CVVC 及英语 Arpasing 音源库，建立 Google Drive 集中分发机制。",
      timeline_item3_date: "2023 年",
      timeline_item3_title: "全面拥抱 OpenUtau 与 DiffSinger AI",
      timeline_item3_desc: "升级为现代 OpenUtau 生态，自研泰语音素解析器，并成功训练首批 DiffSinger 神经声学模型。",
      timeline_item4_date: "2025 年",
      timeline_item4_title: "生态突破：57+ 歌手与 167+ 音源包",
      timeline_item4_desc: "旗下音源库全面优化，达到 57 位歌手及 167 款下载包，向社区公开 1,500 余份乐谱与调校工程。",
      timeline_item5_date: "2026 年（现今）",
      timeline_item5_title: "AI 时代：Thai RVC 与 The Darkside Agent",
      timeline_item5_desc: "推出保留泰语音调的 Thai RVC WebUI 及本地离线桌面 AI Agent 系统，推动泰国音频 AI 生态全面迈向新高度。",
      cta_title: "开启您的虚拟歌声创作之旅",
      cta_desc: "探索 57+ 独具魅力的泰语与多语种虚拟歌手，下载工程文件，创作属于您的动人乐章。",
      cta_btn_drive: "进入官方 Google Drive 仓库",
      cta_btn_roster: "查看全部歌手名单",
      footer_desc: "DELTA SYNTH 是致力于泰国虚拟歌声合成（UTAU / DiffSinger AI）与前沿音频 AI 工具研发的先驱工作室。始于 2019，始终坚持免费开放，赋能全球创作者。",
      footer_sitemap: "网站导航",
      footer_contact: "联系我们",
      footer_drive: "音源总库",
      footer_rights: "© 2019–2026 DELTA SYNTH. 保留所有权利。",
      footer_made_by: "由 DELTA SYNTH 设计与开发。",
      about_h1: "关于 DELTA SYNTH",
      about_origin_title: "初心与愿景",
      about_contact_title: "联系工作室",
      vb_hero_crumb: "DELTA SYNTH / 全部歌声库",
      vb_hero_title: "全部虚拟歌声库<br>DELTA SYNTH",
      vb_hero_desc: "汇集旗下 54+ 位独特音色角色，全面支持 OpenUtau 与 DiffSinger AI，包含角色立绘档案、试听示范及直接下载通道。",
      vb_drive_banner_title: "📂 DELTA SYNTH 官方 Google Drive 音源总库",
      vb_drive_banner_desc: "工作室旗下所有 UTAU 及 DiffSinger AI 虚拟歌声库官方高速下载镜像。",
      vb_drive_banner_btn: "进入主盘总库 (Open Master Drive) →",
      vb_search_placeholder: "搜索歌手姓名、音色类型、引擎或支持语言...",
      vb_filter_all: "全部 (54)",
      vb_filter_diffsinger: "DiffSinger AI",
      vb_filter_utau: "UTAU",
      vb_card_profile: "👤 歌手档案 / Profile",
      vb_card_private: "🔒 专属私有 · PRIVATE",
      profile_return: "← 返回全部歌声库",
      profile_return_sub: "/ Return to Voicebanks",
      profile_official: "Official DELTA",
      profile_age: "年龄 / Age",
      profile_gender: "性别 / Gender",
      profile_voicer: "声源提供 / Voicer",
      profile_genre: "擅长曲风 / Genre",
      profile_engine: "支持引擎 / Engine",
      profile_language: "支持语言 / Language",
      profile_bio_title: "角色背景与经历 / Biography",
      profile_audio_title: "试听音频范例 / Audio Sample",
      profile_audio_demo: "试听示范 / Demo:",
      profile_status_title: "歌声库状态 · VOICEBANK STATUS",
      profile_private_title: "歌声库状态: <span style=\"color: #ff4422;\">专属私有 (Private Voicebank)</span>",
      profile_private_desc: "该角色的歌声库为 DELTA SYNTH 内部专属音源，仅限工作室内部制作及特约合作项目使用，暂未开放公开下载。",
      profile_private_badge: "🔒 专属私有权限 · PRIVATE ACCESS ONLY",
      profile_download_title: "可下载歌声库",
      profile_btn_download: "下载音源包",
      files_h1: "素材与工程文件库",
      files_desc: "免费下载 USTX、MIDI、SVP 及 VSQX 音乐工程文件与分轨素材，支持快速翻唱与二次创作。",
      events_h1: "活动与动态",
      events_desc: "了解 DELTA SYNTH 的最新音乐发行、社区合作展会以及创作赛事活动。",
      collab_h1: "合作与联络",
      collab_desc: "期待与音乐制作人、插画师、调音师及 AI 音频研究者携手合作，共同探索虚拟歌声无限可能。",
      project_h1: "音乐与技术项目",
      project_desc: "查看 DELTA SYNTH 参与的原创音乐专辑、虚拟演唱会以及 AI 工具开发项目。",
      upload_h1: "作品提交与分享",
      vb_label_status: "状态:",
      vb_label_affil: "所属:",
      vb_label_category: "分类:",
      vb_chip_all: "全部 (55)",
      vb_chip_official: "✓ 官方 (Active)",
      vb_chip_upcoming: "⏳ 即将推出 (Upcoming)",
      vb_chip_private: "🔒 专属私有 (Private)",
      vb_chip_female: "女性 (Female · 16)",
      vb_chip_male: "男性 (Male)",
      vb_chip_lgbtq: "LGBTQ (5)",
      badge_active: "✓ 官方",
      badge_private: "🔒 专属私有",
      badge_upcoming: "⏳ 即将推出",
      about_eyebrow: "始于 2019 年 · 首个项目 — B.L. Student",
      about_lead: "创立于 2019 年的泰国虚拟歌声合成工作室，通过与泰国本土及国际创作者的持续合作，稳步推进多元音乐与声学项目。",
      about_story_eyebrow: "创办历程",
      about_story_title: "工作室的诞生与起点",
      about_story_desc: "由最初的 4 位核心成员及 3 位重要支持者——SUN、Kochujang（Shu-chan）与 Guren Kani 共同创立并持续建设。绝大多数音乐成果至今皆发布于官方 YouTube 频道。",
      about_contact_eyebrow: "联系我们",
      files_th_name: "文件名",
      files_th_desc: "描述 / 曲目详情",
      files_th_format: "格式",
      events_empty_title: "当前暂无计划中的公开活动",
      events_empty_desc: "团队目前正将精力专注于原创音乐企划与声学库开发。欢迎关注我们的官方社媒频道，以便第一时间获取后续活动动态。",
      events_empty_btn: "关注官方动态",
      collab_eyebrow: "合作企划与特别项目",
      collab_sub_title: "精选合作艺术家",
      collab_sub_desc: "来自特别合作项目的精选虚拟歌手与代表性歌声库。",
      collab_btn_roster: "查看全部 9 大项目组作品 →",
      collab_btn_drive: "📂 官方云端总盘 All Voicebanks",
      collab_btn_card: "进入档案并下载 →"
    },

    ja: {
      nav_main: "メイン",
      nav_about: "スタジオ紹介",
      nav_voicebank: "音源ライブラリ",
      nav_files: "USTX / MIDI / SVP / VSQX",
      nav_collab: "コラボレーション",
      nav_events: "イベント",
      nav_new_works: "最新開発作品",
      nav_thai_openutau: "Thai OpenUtau",
      nav_projects: "プロジェクト一覧",
      nav_toggle_open: "ナビゲーションメニューを開く",
      nav_toggle_close: "ナビゲーションメニューを閉じる",
      hero_eyebrow: "タイ発の音声合成スタジオ — 2019年設立",
      hero_title: "タイの情熱と革新から生まれた<br><span class=\"accent\">次世代バーチャルシンガー</span>",
      hero_desc: "DELTA SYNTHはタイ発のバーチャル歌声合成音源（UTAU / DiffSinger AI）開発スタジオです。57名以上のバーチャルシンガーと167以上の音源パッケージを制作・管理し、7言語に対応。すべての音源と制作ファイルを世界中のクリエイターへ完全無料で提供しています。",
      hero_btn_drive: "音源ダウンロード (Google Drive Master)",
      hero_btn_explore: "全音源カタログを見る (57名)",
      hero_btn_about: "スタジオについて",
      spec_core_engines_title: "CORE ENGINES",
      spec_core_engines_val: "DIFFSINGER AI · UTAU RESAMPLER",
      spec_repertoire_title: "REPERTOIRE",
      spec_repertoire_val: "TH · JP · EN · CN · KR · FR · ES (7言語対応)",
      spec_status_title: "SYSTEM STATUS",
      spec_status_val: "LIVE & SYNTHESIZING",
      spec_partner_title: "TECH PARTNER",
      spec_partner_val: "PRINTMOV — DIFFSINGER NEURAL AI",
      spec_rd_title: "OPEN SOURCE R&D",
      spec_rd_val: "THAI OPENUTAU PHONEMIZER",
      spec_founded_title: "FOUNDED",
      spec_founded_val: "2019 · バンコク (タイ)",
      stat_singers_num: "57+",
      stat_singers_lbl: "所属バーチャルシンガー",
      stat_packages_num: "167+",
      stat_packages_lbl: "配布中音源パッケージ",
      stat_languages_num: "7+",
      stat_languages_lbl: "歌唱対応言語",
      stat_free_num: "0円",
      stat_free_lbl: "完全無料・自由な創作",
      pillars_eyebrow: "スタジオの理念",
      pillars_title: "モットー・ビジョン・開発理念",
      pillars_desc: "すべての音源制作とコラボレーションにおいて一貫した品質と表現力を維持するための公式指針です。",
      pillar1_tag: "モットー",
      pillar1_title: "「声を創り、個性を創り、無限の創造へ」",
      pillar1_desc: "私たちの音源は単なる音声データではありません。それぞれ固有の物語、性格、魅力を持ったキャラクターです。声の開発と魂の宿るキャラクター作りは常に一体です。",
      pillar2_tag: "ビジョン",
      pillar2_title: "世界へ羽ばたくタイ発の歌声合成",
      pillar2_desc: "DiffSinger開発チームや国内外のクリエイターネットワークと連携し、タイ語歌声合成を世界最先端のAI音声基準へと進化させ続けます。",
      pillar3_tag: "アイデンティティ",
      pillar3_title: "多彩な個性、揺るぎない品質基準",
      pillar3_desc: "2019年創設のB.L.学生グループからWongyaiファミリー、CP Allラーニングシリーズまで、全シンガーを専門的なチューニングで長期にわたりサポートします。",
      showcase_eyebrow: "VIRTUAL SINGERS SHOWCASE",
      showcase_title: "代表バーチャルシンガー紹介",
      showcase_desc: "UTAUおよびDiffSinger AIを搭載した人気フラッグシップ音源のプレミアムな歌声を、今すぐ無料でお試しいただけます。",
      showcase_btn_all: "全57名のシンガーを見る →",
      showcase_hikaru_sub: "綾波ヒカル · Pop / Ballad",
      showcase_hikaru_desc: "DELTA SYNTHの代表的歌声。温かみと力強さを兼ね備え、あらゆる音域で柔軟な表現力を発揮します。",
      showcase_sun_sub: "SUN · Rock / Modern",
      showcase_sun_desc: "抜けの良いクリアでエネルギッシュな音色。アップテンポなロックナンバーや力強いサビに最適です。",
      showcase_relven_sub: "レルヴェン · Alternative / Rock",
      showcase_relven_desc: "力強くエモーショナルなオルタナティブロックボーカル。タイ語、日本語、英語の多言語歌唱を完全サポート。",
      showcase_andromeda_sub: "アンドロメダ · Space Pop / Electro",
      showcase_andromeda_desc: "TYUとの特別コラボプロジェクト。銀河の星々のようにきらめく、近未来的でスペーシーな合成音声です。",
      btn_profile: "プロフィール",
      btn_download: "ダウンロード",
      badge_coming_soon: "近日公開",
      nw_eyebrow: "NEW WORKS · AI TOOLS BY DELTA SYNTH",
      nw_title: "DELTA SYNTHラボ発・最新AIエンジニアリング作品",
      nw_desc: "歌声合成の制作を支援するために独自開発したAIツール群 — タイ語声調を完全保持するRVC WebUIと、ローカルで安全に動作するデスクトップAIエージェント。",
      nw_rvc_badge: "NEW WORK · ACTIVE DEVELOPMENT",
      nw_rvc_sub: "Tone-Preserving Thai RVC System · タイ語5声調完全保持RVCシステム",
      nw_rvc_desc: "Retrieval-based Voice Conversion (RVC) をタイ語に特化改良。RMVPE F0輪郭とThai ContentVec/HuBERTにより、タイ語の全5声調を忠実に再現（声調精度 ≥ 95%, MOS ≥ 4.0, RTF ≤ 0.3）。日英バイリンガル解説付き。",
      nw_rvc_li1: "オールインワンWebUI: 音声変換（Inference）、データセット管理、モデル学習（Train）、インデックス生成（FAISS）、UVR5によるボーカル/伴奏分離を網羅。",
      nw_rvc_li2: "幅広いハードウェア対応: NVIDIA CUDA、AMD / Intel (DirectML)、およびCPUフォールバック。Program.py（ポート9378）またはgo-web.bat（ポート7897）で起動可能。",
      nw_rvc_li3: "リアルタイム変換 & DAW連携: 低遅延リアルタイムGUI (realtime_gui.py) と楽曲制作向けRVCRealtimeVSTプラグインに対応。",
      nw_rvc_li4: "安全なサブプロセスバッチ処理: VRAMリークを防ぐサブプロセス分離、clear_vram_safe() による安全なメモリ解放、自動依存関係修復機能。",
      nw_rvc_btn_gh: "GitHubでソースコードを見る",
      nw_rvc_btn_contact: "テスト参加・お問い合わせ",
      nw_dark_badge: "NEW WORK · ACTIVE DEVELOPMENT",
      nw_dark_sub: "Local Agentic AI Desktop · Made by DELTA SYNTH",
      nw_dark_desc: "ローカルOllama上で100%駆動するWindowsデスクトップAIエージェント。外部APIキー不要、指定ワークスペースのみにアクセスを制限する高セキュリティ設計。",
      nw_dark_li1: "洗練されたAvalonia / .NET UI: NDJSONによるリアルタイム思考ストリーミング、進捗状況表示、モデル切替、即時キャンセル制御。",
      nw_dark_li2: "堅牢なファイルシステム操作: パストラバーサル防止、アトミックファイル書き込み、サイズ制限を備えたread_file, write_file, list_directoryツール。",
      nw_dark_li3: "完全閉鎖型ローカルセキュリティ: バックエンドとゲートウェイを127.0.0.1のみにバインドし、外部ネットワークへの露出を完全遮断。",
      nw_dark_li4: "スーパーバイザー管理機構: プロセスの自動死活監視と、setup, start, stop, verify自動化スクリプトを同梱。",
      nw_dark_btn_gh: "GitHubで確認する",
      nw_dark_btn_contact: "テスト参加・お問い合わせ",
      openutau_eyebrow: "COMMUNITY PROJECT · OPEN SOURCE R&D",
      openutau_title: "Thai OpenUtau開発センター · タイ語音声合成の革新",
      openutau_desc: "OpenUtau向けタイ語プラグインおよびフォネマイザーのオープンソース開発プロジェクト。誰でも直感的にタイ語楽曲を制作できる新基準を確立します。",
      openutau_badge: "ACTIVE DEVELOPMENT",
      openutau_core: "Core Engine: OpenUtau · C# / .NET 8",
      openutau_f1_num: "01 / G2P & PHONEMIZER",
      openutau_f1_title: "タイ語歌詞自動フォネマイザー",
      openutau_f1_desc: "高度なThai G2Pエンジンにより、VCCVおよびCVVC方式をサポート。音素記号を手動入力することなく、タイ語テキストをそのまま打ち込んで歌わせることができます。",
      openutau_f2_num: "02 / THAI LOCALIZATION",
      openutau_f2_title: "完全タイ語ローカライズUI",
      openutau_f2_desc: "メニュー、トラック設定、ピアノロールエディター、合成エンジン設定まで、音響工学の標準用語に基づき100%タイ語翻訳パッケージを提供。",
      openutau_f3_num: "03 / ECOSYSTEM & TESTING",
      openutau_f3_title: "音源連携とプロジェクトテンプレート",
      openutau_f3_desc: "DELTA SYNTHの57名以上の音源およびタイ産DiffSinger AIモデルと綿密に検証。即戦力のUSTXテンプレート、調声サンプル、インストールガイドを常時更新配布。",
      openutau_btn_gh: "GitHubでソースコードを見る",
      openutau_btn_tools: "リリース版 & ツールを入手",
      openutau_btn_contact: "開発に参加・進捗を追う",
      files_sec_eyebrow: "CREATOR TOOLKIT",
      files_sec_title: "クリエイター向け完成楽曲制作ファイル",
      files_sec_desc: "作編曲家やプロデューサーがすぐに自作楽曲やカバーに活用できる、USTX、MIDI、SVP、VSQXファイルの無料アーカイブです。",
      files_p1_tag: "OPENUTAU",
      files_p1_title: "USTXプロジェクトテンプレート",
      files_p1_desc: "タイ語のピッチカーブ、ダイナミクス、音素調整があらかじめ施され、OpenUtauで開いてすぐに再生・レンダリングできるプロジェクトファイル。",
      files_p1_btn: "USTXをダウンロード →",
      files_p2_tag: "SYNTHESIZER V",
      files_p2_title: "SVPスコアファイル",
      files_p2_desc: "Synthesizer V向けの高品質な譜面および調声データ。多言語歌唱に対応した精密なボーカルアレンジメント。",
      files_p2_btn: "SVPをダウンロード →",
      files_p3_tag: "DAW / VOCALOID",
      files_p3_title: "MIDI & VSQXアーカイブ",
      files_p3_desc: "主要DAWやVOCALOIDエディターと互換性のある標準MIDIノートデータおよびVSQXファイルセット。",
      files_p3_btn: "MIDI/VSQXをダウンロード →",
      timeline_eyebrow: "最新の活動記録",
      timeline_title: "スタジオのマイルストーンと歩み",
      timeline_item1_date: "2026年10月",
      timeline_item1_title: "最新作品：Thai RVC Web UI & The Darkside UI AIエージェント",
      timeline_item1_desc: "自社開発AIツール2作品を公開 — タイ語RVC音声変換WebUIと、Ollama搭載デスクトップAIエージェント。",
      timeline_item2_date: "2026年",
      timeline_item2_title: "次世代グローバル展開と品質保証体制",
      timeline_item2_desc: "国際共同企画TYU Projectを始動、新音源AndromedaおよびRelVeN 2026を開発、5段階自動検証テスト環境を導入。",
      timeline_item3_date: "2025年",
      timeline_item3_title: "Printmovチームとの提携 — DiffSinger AIへの進化",
      timeline_item3_desc: "Printmovの公式テストパートナーに就任し、主要音源を高音質DiffSingerニューラル歌声合成へアップグレード。",
      timeline_item4_date: "2025年6月",
      timeline_item4_title: "新シーズン所属シンガー発表",
      timeline_item4_desc: "タイ語、日本語、英語に対応する新音源のリリースと既存音源の大幅アップデートを実施。",
      timeline_item5_date: "継続的対応",
      timeline_item5_title: "7言語による歌唱合成サポート",
      timeline_item5_desc: "DiffSingerとUTAUのクロスリンガル合成機能により、タイ語・英語・日本語・中国語・韓国語・フランス語・スペイン語に対応。",
      cta_title: "今すぐ音源と制作ファイルをダウンロード",
      cta_desc: "あちこち探す必要はありません — DELTA SYNTHの全音源、USTX、MIDI、SVP、VSQXファイルがこのサイトで100%無料で手に入ります。",
      cta_btn_drive: "マスターGoogle Driveを開く",
      cta_btn_roster: "全57名のシンガー一覧を見る",
      footer_desc: "2019年に設立されたタイ発のバーチャル歌声合成開発スタジオ。57名以上のUTAU / DiffSinger AI音源と、世界中のクリエイターに向けた制作素材を提供しています。",
      footer_sitemap: "サイトマップ",
      footer_contact: "お問い合わせ & SNS",
      footer_drive: "Google Driveマスターアーカイブ",
      footer_rights: "© Since 2019 — DELTA SYNTH Team. タイより誇りを込めて制作。",
      footer_made_by: "Designed with DELTA SYNTH Design System",
      about_h1: "DELTA SYNTHの歩みと物語",
      about_origin_title: "スタジオ設立の原点",
      about_contact_title: "お問い合わせ窓口",
      vb_hero_crumb: "全音源一覧 / ALL VOICEBANKS",
      vb_hero_title: "DELTA SYNTH 音源ライブラリ",
      vb_hero_desc: "タイ発のUTAUおよびDiffSinger AIバーチャルシンガー57名以上の完全コレクション。高速ダイレクトリンクで無料配布中。",
      vb_drive_banner_title: "Google Drive Master Archive",
      vb_drive_banner_desc: "全音源、追加音声パック、デモプロジェクトファイルを、常に最新に整理されたクラウドアカウントから直接ダウンロード可能です。",
      vb_drive_banner_btn: "マスターDriveを開く →",
      vb_search_placeholder: "シンガー名、言語、ジャンル、エンジンで検索...",
      vb_filter_all: "すべて (57)",
      vb_filter_diffsinger: "DiffSinger AI",
      vb_filter_utau: "UTAU",
      vb_card_profile: "プロフィール",
      vb_card_private: "Private Voicebank",
      profile_return: "← 音源一覧に戻る",
      profile_return_sub: "All Voicebanks",
      profile_official: "OFFICIAL SINGER",
      profile_age: "年齢",
      profile_gender: "性別",
      profile_voicer: "CV (中の人)",
      profile_genre: "推奨ジャンル",
      profile_engine: "音源エンジン",
      profile_language: "対応言語",
      profile_bio_title: "キャラクター設定・プロフィール",
      profile_audio_title: "歌声試聴サンプル",
      profile_audio_demo: "オーディオデモ試聴",
      profile_status_title: "音源配布ステータス",
      profile_private_title: "Private Voicebank",
      profile_private_desc: "この音源はスタジオ内部制作および特別コラボレーション専用の非公開音源です。",
      profile_private_badge: "PRIVATE ACCESS",
      profile_download_title: "音源ダウンロード",
      profile_btn_download: "ダウンロード",
      files_h1: "USTX · MIDI · SVP · VSQX プロジェクトファイル",
      files_desc: "バーチャルシンガーですぐに歌わせることができる無料の完成楽曲プロジェクトファイル集。",
      events_h1: "イベント & コミュニティ情報",
      events_desc: "DELTA SYNTHの最新活動、参加イベント、主要リリース情報。",
      collab_h1: "COLLABORATION VOICEBANKS",
      collab_desc: "国内外のアーティストや制作チームと共に創り上げた特別コラボレーション音源。",
      project_h1: "DELTA SYNTH 9大プロジェクト名鑑",
      project_desc: "全9つのプロジェクトチームと所属バーチャルシンガーの総合名簿。",
      upload_h1: "ファイル提出センター",
      vb_label_status: "ステータス:",
      vb_label_affil: "所属:",
      vb_label_category: "カテゴリー:",
      vb_chip_all: "すべて (55)",
      vb_chip_official: "✓ 公式 (Active)",
      vb_chip_upcoming: "⏳ 近日公開 (Upcoming)",
      vb_chip_private: "🔒 非公開 (Private)",
      vb_chip_female: "女性 (Female · 16)",
      vb_chip_male: "男性 (Male)",
      vb_chip_lgbtq: "LGBTQ (5)",
      badge_active: "✓ 公式",
      badge_private: "🔒 非公開",
      badge_upcoming: "⏳ 近日公開",
      about_eyebrow: "2019年設立 · 第1弾プロジェクト — B.L. Student",
      about_lead: "2019年に設立されたタイ発の音声合成スタジオ。タイ国内外のクリエイターと継続的に提携し、多彩なプロジェクトを展開しています。",
      about_story_eyebrow: "スタジオの歩み",
      about_story_title: "スタジオの原点と始まり",
      about_story_desc: "初期メンバー4名と、スタジオを支え続けてきたSUN、コチュジャン（シューちゃん）、紅蓮カニの3名のサポーターにより設立。多くの作品は公式YouTubeチャンネルを通じて現在も発信されています。",
      about_contact_eyebrow: "お問い合わせ",
      files_th_name: "ファイル名",
      files_th_desc: "説明 / 楽曲詳細",
      files_th_format: "形式",
      events_empty_title: "現在予定されているイベントはありません",
      events_empty_desc: "チームは現在、音楽制作および音源ライブラリ開発に注力しています。今後のイベント告知を見逃さないよう、公式チャンネルをぜひフォローしてください。",
      events_empty_btn: "公式チャンネルをフォロー",
      collab_eyebrow: "パートナーシップ & 特別企画",
      collab_sub_title: "注目のコラボレーションアーティスト",
      collab_sub_desc: "特別コラボレーション企画による注目のアーティストと音源ライブラリ。",
      collab_btn_roster: "全9大プロジェクトグループを見る →",
      collab_btn_drive: "📂 公式マスタードライブ All Voicebanks",
      collab_btn_card: "プロフィール＆ダウンロードへ →"
    },

    ru: {
      nav_main: "Главная",
      nav_about: "О студии",
      nav_voicebank: "Голосовые банки",
      nav_files: "USTX / MIDI / SVP / VSQX",
      nav_collab: "Сотрудничество",
      nav_events: "События",
      nav_new_works: "Новинки",
      nav_thai_openutau: "Thai OpenUtau",
      nav_projects: "Проекты",
      nav_toggle_open: "Открыть меню навигации",
      nav_toggle_close: "Закрыть меню навигации",
      hero_eyebrow: "Тайская студия синтеза вокала — С 2019 года",
      hero_title: "Виртуальные голоса, рожденные тайской страстью и<br><span class=\"accent\">передовыми технологиями</span>",
      hero_desc: "DELTA SYNTH — студия разработки виртуальных голосовых банков (UTAU / DiffSinger AI) из Таиланда. Мы создаем и поддерживаем более 57 виртуальных вокалистов и 167 готовых пакетов с поддержкой пения на 7 языках. Все наши банки и музыкальные проекты распространяются абсолютно бесплатно для музыкантов всего мира.",
      hero_btn_drive: "Скачать голосовые банки (Google Drive)",
      hero_btn_explore: "Все голосовые банки",
      hero_btn_about: "О нашей студии",
      spec_core_engines_title: "Основные движки",
      spec_core_engines_val: "OpenUtau · DiffSinger AI · Классический UTAU (resampler / wavtool)",
      spec_repertoire_title: "Репертуар и контент",
      spec_repertoire_val: "57+ певцов · 167+ пакетов · 1500+ проектов USTX/MIDI",
      spec_status_title: "Статус проекта",
      spec_status_val: "Доступен 24/7 · Бесплатная загрузка · Некоммерческие работы приветствуются",
      spec_partner_title: "Партнерская сеть",
      spec_partner_val: "Studio VOX · Тайское UTAU-сообщество · Международная сеть синтеза",
      spec_rd_title: "Лаборатория R&D",
      spec_rd_val: "Thai Tone Preserving RVC · The Darkside AI Agent · Набор фонемайзеров",
      spec_founded_title: "Год основания",
      spec_founded_val: "Август 2019 г. · Бангкок, Таиланд (Bangkok, Thailand)",
      stat_singers_num: "57+",
      stat_singers_lbl: "Виртуальных певцов",
      stat_packages_num: "167+",
      stat_packages_lbl: "Бесплатных пакетов",
      stat_languages_num: "7",
      stat_languages_lbl: "Поддерживаемых языков",
      stat_free_num: "100%",
      stat_free_lbl: "Бесплатно для музыки",
      pillars_eyebrow: "THREE PILLARS OF EXCELLENCE",
      pillars_title: "Три ключевых принципа DELTA SYNTH",
      pillars_desc: "От студийного акустического семплирования до сохранения тонов и открытого доступа ко всем музыкальным партитурам.",
      pillar1_tag: "ПРИНЦИП 01 · АКУСТИКА И ИИ",
      pillar1_title: "Прецизионное семплирование и нейросетевой звук",
      pillar1_desc: "Поддержка высокоточных стандартов VCCV, CVVC, Arpasing и глубоких моделей DiffSinger AI для кристально чистого и естественного звучания вокала.",
      pillar2_tag: "ПРИНЦИП 02 · ТАЙСКАЯ ФОНЕТИКА",
      pillar2_title: "Сохранение 5 тайских тонов и мультиязычность",
      pillar2_desc: "Собственный тайский фонемайзер для OpenUtau и тоносохраняющие алгоритмы, идеально воспроизводящие тайские тона, а также японский и английский языки.",
      pillar3_tag: "ПРИНЦИП 03 · ТВОРЧЕСКАЯ ЭКОСИСТЕМА",
      pillar3_title: "Открытый банк музыкальных проектов для авторов",
      pillar3_desc: "Более 1500 файлов USTX, MIDI, SVP и VSQX в свободном доступе для создания каверов, ремиксов и вдохновения музыкантов по всему миру.",
      showcase_eyebrow: "FEATURED SINGERS",
      showcase_title: "Популярные виртуальные вокалисты",
      showcase_desc: "Познакомьтесь с ключевыми голосами и уникальными тембрами, созданными DELTA SYNTH.",
      showcase_btn_all: "Все 57+ певцов →",
      showcase_hikaru_sub: "Light & Cybernetic Voice · Флагманский женский вокал",
      showcase_hikaru_desc: "Яркий и чистый электро-поп тембр с поддержкой Thai VCCV и DiffSinger AI. Пронзительные и звонкие верхние ноты.",
      showcase_sun_sub: "Warm & Emotional Power · Теплый и мощный мужской вокал",
      showcase_sun_desc: "Глубокие бархатные средние ноты и мощная экспрессия на верхах, прекрасно подходящая для рока, баллад и поп-музыки.",
      showcase_relven_sub: "Mellow & Melodic Tone · Мягкий мелодичный вокал",
      showcase_relven_desc: "Нежный и душевный голос для фолка и акустических баллад, наполненный теплотой и искренними эмоциями.",
      showcase_andromeda_sub: "Celestial & Cosmic Diva · Космический эфирный вокал",
      showcase_andromeda_desc: "Объемное пространственное звучание, созданное для футуристической электроники, оркестровой и фэнтезийной музыки.",
      btn_profile: "Профиль персонажа",
      btn_download: "Скачать голосовой банк",
      badge_coming_soon: "Скоро выйдет",
      nw_eyebrow: "NEW WORKS · AI TOOLS BY DELTA SYNTH",
      nw_title: "Свежие разработки лаборатории DELTA SYNTH",
      nw_desc: "Инструменты искусственного интеллекта собственной разработки для синтеза вокала и локальной автоматизации — включая веб-интерфейс Thai RVC с сохранением тонов и настольного локального агента The Darkside AI Agent.",
      nw_rvc_badge: "НОВИНКА · АКТИВНАЯ РАЗРАБОТКА",
      nw_rvc_sub: "Tone-Preserving Thai RVC System · Преобразование голоса с сохранением тайских тонов",
      nw_rvc_desc: "Веб-интерфейс на базе RVC (Retrieval-based Voice Conversion), специально оптимизированный для сохранения всех 5 тайских тонов благодаря контуру F0 RMVPE и Thai ContentVec/HuBERT (точность тональности ≥ 95%, MOS ≥ 4.0, RTF ≤ 0.3) с документацией на тайском и английском языках.",
      nw_rvc_li1: "Все функции на одной странице: преобразование (Inference), работа с датасетами, обучение моделей (Train), создание индексов FAISS и разделение вокала через UVR5",
      nw_rvc_li2: "Широкая поддержка оборудования: NVIDIA CUDA, AMD / Intel (DirectML) и CPU; запуск через Program.py (порт 9378) или go-web.bat (порт 7897)",
      nw_rvc_li3: "Режим реального времени и плагины для DAW: модуль realtime_gui.py с минимальной задержкой и поддержка плагина RVCRealtimeVST для музыкальных редакторов",
      nw_rvc_li4: "Безопасная пакетная обработка: изоляция подпроцессов для исключения утечек VRAM, функция clear_vram_safe() и автовосстановление зависимостей",
      nw_rvc_btn_gh: "Исходный код на GitHub",
      nw_rvc_btn_contact: "Принять участие в тестах",
      nw_dark_badge: "НОВИНКА · АКТИВНАЯ РАЗРАБОТКА",
      nw_dark_sub: "Local Agentic AI Desktop · Made by DELTA SYNTH",
      nw_dark_desc: "Настольное Windows-приложение для управления автономными ИИ-агентами на вашем собственном компьютере через Ollama на 100% локально, без внешних API-ключей и со строгой изоляцией доступа к файлам внутри указанной рабочей зоны.",
      nw_dark_li1: "Современный интерфейс Avalonia / .NET: переключение моделей, потоковая передача хода мыслей и статуса в реальном времени через NDJSON с кнопкой мгновенной остановки",
      nw_dark_li2: "Защищенные файловые инструменты: функции read_file, write_file, list_directory с защитой от выхода за пределы папок, атомарной записью и лимитом размера файлов",
      nw_dark_li3: "Полностью изолированная локальная безопасность: бэкенд и шлюз привязаны только к 127.0.0.1, строгий контроль параллелизма и ограничение активных сессий",
      nw_dark_li4: "Система супервизора и контроля: автоматическая проверка состояния процессов и готовые скрипты setup, start, stop, verify для полного цикла",
      nw_dark_btn_gh: "Следить на GitHub",
      nw_dark_btn_contact: "Присоединиться к тестерам",
      openutau_eyebrow: "THAI OPENUTAU INTEGRATION",
      openutau_title: "Современная кроссплатформенная экосистема Thai OpenUtau",
      openutau_desc: "Полная интеграция с открытым редактором пения OpenUtau, включая тайские фонетические словари, специализированные фонемайзеры и конфигурации DiffSinger.",
      openutau_badge: "ОТКРЫТАЯ ЭКОСИСТЕМА",
      openutau_core: "Thai Phonemizer & DiffSinger Support",
      openutau_f1_num: "01",
      openutau_f1_title: "Умный тайский фонемайзер (Thai Phonemizer)",
      openutau_f1_desc: "Автоматическое определение начальных согласных, гласных и знаков тональности для плавного звучания без ручного деления слогов.",
      openutau_f2_num: "02",
      openutau_f2_title: "Прямая нейросетевая связь с DiffSinger AI",
      openutau_f2_desc: "Прямое подключение к движку DiffSinger ONNX для редактирования высоты тона и выразительности прямо в сетке нот.",
      openutau_f3_num: "03",
      openutau_f3_title: "Готов к работе на любой ОС",
      openutau_f3_desc: "Полная совместимость с Windows, macOS и Linux. Просто перетащите голосовой пакет DELTA SYNTH в окно программы и начните творить.",
      openutau_btn_gh: "Проект OpenUtau",
      openutau_btn_tools: "Скачать словари и утилиты",
      openutau_btn_contact: "Техническая поддержка",
      files_sec_eyebrow: "CREATOR TOOLKIT & MUSIC FILES",
      files_sec_title: "Инструменты и музыкальные файлы для авторов",
      files_sec_desc: "Скачивайте бесплатно готовые проекты настройки и нотные файлы USTX, MIDI, SVP и VSQX для создания каверов и авторских песен.",
      files_p1_tag: "ПАРТИТУРЫ И НАСТРОЙКА · USTX / UST",
      files_p1_title: "Проекты настройки OpenUtau и UTAU",
      files_p1_desc: "Содержат точные параметры нот, огибающие громкости и выверенную фонетику, готовые для применения к любому вокалисту DELTA SYNTH.",
      files_p1_btn: "Каталог проектов",
      files_p2_tag: "МЕЛОДИЧЕСКИЕ ДАННЫЕ · MIDI / SVP",
      files_p2_title: "MIDI-треки и проекты Synthesizer V",
      files_p2_desc: "Универсальные MIDI-дорожки и проекты SVP, готовые для импорта в любую DAW (Cubase, FL Studio, Logic Pro) для удобной аранжировки.",
      files_p2_btn: "Скачать MIDI-файлы",
      files_p3_tag: "ПОЛНЫЕ АРХИВЫ · VSQX / STEMS",
      files_p3_title: "Проекты VOCALOID и инструментальные дорожки (Stems)",
      files_p3_desc: "Партитуры VSQX классических композиций и несжатые инструментальные дорожки для изучения профессионального сведения и тюнинга вокала.",
      files_p3_btn: "Библиотека материалов",
      timeline_eyebrow: "DEVELOPMENT JOURNEY",
      timeline_title: "История развития DELTA SYNTH",
      timeline_item1_date: "Август 2019 г.",
      timeline_item1_title: "Основание студии и первые тайские банки",
      timeline_item1_desc: "Официальное основание DELTA SYNTH, разработка стандарта тайского семплирования VCCV и выпуск первых экспериментальных голосовых банков.",
      timeline_item2_date: "2021 г.",
      timeline_item2_title: "Расширение состава вокалистов и новые языки",
      timeline_item2_desc: "Каталог насчитывает более 20 вокалистов, добавлены японские библиотеки CVVC и английские Arpasing, запущен центральный Google Drive.",
      timeline_item3_date: "2023 г.",
      timeline_item3_title: "Переход на OpenUtau и внедрение DiffSinger AI",
      timeline_item3_desc: "Полный переход на современную среду OpenUtau, создание собственного фонемайзера и успешное обучение первых нейромоделей DiffSinger.",
      timeline_item4_date: "2025 г.",
      timeline_item4_title: "Рубеж: 57+ певцов и 167+ пакетов",
      timeline_item4_desc: "Глобальная оптимизация библиотек до 57 вокалистов и 167 пакетов, открытие более 1500 партитур и проектов для сообщества.",
      timeline_item5_date: "2026 г. (Сейчас)",
      timeline_item5_title: "Эра ИИ: Thai RVC и The Darkside Agent",
      timeline_item5_desc: "Релиз веб-интерфейса Thai RVC с сохранением тонов и настольного автономного агента, открывающего новую главу в тайском голосовом ИИ.",
      cta_title: "Начните создавать музыку с виртуальным вокалом прямо сейчас",
      cta_desc: "Откройте для себя более 57 уникальных вокалистов, скачивайте проекты настройки и создавайте потрясающие треки.",
      cta_btn_drive: "Официальный Google Drive",
      cta_btn_roster: "Полный список вокалистов",
      footer_desc: "DELTA SYNTH — студия-первопроходец в области разработки виртуального пения (UTAU / DiffSinger AI) и передовых аудиоинструментов ИИ в Таиланде. С 2019 года мы бесплатно делимся своими работами с музыкантами всего мира.",
      footer_sitemap: "Карта сайта",
      footer_contact: "Контакты",
      footer_drive: "Диск с банками",
      footer_rights: "© 2019–2026 DELTA SYNTH. Все права защищены.",
      footer_made_by: "Дизайн и разработка: DELTA SYNTH.",
      about_h1: "О проекте DELTA SYNTH",
      about_origin_title: "История и миссия студии",
      about_contact_title: "Связаться со студией",
      vb_hero_crumb: "DELTA SYNTH / Все голосовые банки",
      vb_hero_title: "Все голосовые банки<br>DELTA SYNTH",
      vb_hero_desc: "Полная коллекция из 54+ уникальных персонажей, совместимых с OpenUtau и DiffSinger AI, с биографиями, примерами звучания и прямыми ссылками на загрузку.",
      vb_drive_banner_title: "📂 Официальный репозиторий DELTA SYNTH на Google Drive",
      vb_drive_banner_desc: "Скачивайте все голосовые пакеты UTAU и DiffSinger AI студии напрямую с официального скоростного зеркала на Google Drive.",
      vb_drive_banner_btn: "Открыть главный диск (Open Master Drive) →",
      vb_search_placeholder: "Поиск по имени певца, стилю, движку или языку...",
      vb_filter_all: "Все (54)",
      vb_filter_diffsinger: "DiffSinger AI",
      vb_filter_utau: "UTAU",
      vb_card_profile: "👤 Профиль персонажа / Profile",
      vb_card_private: "🔒 ПРИВАТНЫЙ · Private",
      profile_return: "← Назад ко всем голосовым банкам",
      profile_return_sub: "/ Return to Voicebanks",
      profile_official: "Official DELTA",
      profile_age: "Возраст / Age",
      profile_gender: "Пол / Gender",
      profile_voicer: "Голосовой донор / Voicer",
      profile_genre: "Жанры / Genre",
      profile_engine: "Движок / Engine",
      profile_language: "Языки / Language",
      profile_bio_title: "Биография и история / Biography",
      profile_audio_title: "Аудиодемо / Audio Sample",
      profile_audio_demo: "Демозапись / Demo:",
      profile_status_title: "Статус голосового банка · VOICEBANK STATUS",
      profile_private_title: "Статус голосового банка: <span style=\"color: #ff4422;\">Приватный (Private Voicebank)</span>",
      profile_private_desc: "Голосовой банк этого персонажа является частным (Private Voicebank), предназначен исключительно для внутреннего использования студией DELTA SYNTH и в специальных проектах, и не доступен для открытого скачивания.",
      profile_private_badge: "🔒 ТОЛЬКО ДЛЯ ВНУТРЕННЕГО ИСПОЛЬЗОВАНИЯ · PRIVATE ACCESS ONLY",
      profile_download_title: "Голосовые банки, доступные для загрузки",
      profile_btn_download: "Скачать голосовой банк",
      files_h1: "Библиотека партитур и проектов",
      files_desc: "Бесплатно скачивайте файлы проектов USTX, MIDI, SVP и VSQX для быстрого создания каверов и оригинальных песен.",
      events_h1: "События и новости",
      events_desc: "Следите за новыми релизами песен, выставками и совместными проектами студии DELTA SYNTH.",
      collab_h1: "Сотрудничество и контакты",
      collab_desc: "Мы всегда рады совместной работе с композиторами, художниками, настройщиками вокала и исследователями голосового ИИ.",
      project_h1: "Музыкальные и технические проекты",
      project_desc: "Ознакомьтесь с нашими оригинальными альбомами, виртуальными концертами и проектами программного обеспечения на базе ИИ.",
      upload_h1: "Отправить и поделиться своей работой",
      vb_label_status: "Статус:",
      vb_label_affil: "Принадлежность:",
      vb_label_category: "Категория:",
      vb_chip_all: "Все (55)",
      vb_chip_official: "✓ Официальный (Активен)",
      vb_chip_upcoming: "⏳ Скоро (Upcoming)",
      vb_chip_private: "🔒 Приватный (Private)",
      vb_chip_female: "Женский (16)",
      vb_chip_male: "Мужской (Male)",
      vb_chip_lgbtq: "ЛГБТК+ (5)",
      badge_active: "✓ Официальный",
      badge_private: "🔒 Приватный",
      badge_upcoming: "⏳ Скоро",
      about_eyebrow: "Основан в 2019 г. · Первый проект — B.L. Student",
      about_lead: "Тайская студия синтеза вокала, основанная в 2019 году, непрерывно реализует музыкальные и технологические проекты в сотрудничестве с авторами со всего мира.",
      about_story_eyebrow: "Наша история",
      about_story_title: "Истоки создания студии",
      about_story_desc: "Основан первыми 4 участниками при активной поддержке SUN, Кочуджана (Шу-чан) и Гурэн Кани, которые непрерывно развивали студию. Большинство произведений публикуется на официальном YouTube-канале.",
      about_contact_eyebrow: "Связаться с нами",
      files_th_name: "Имя файла",
      files_th_desc: "Описание",
      files_th_format: "Формат",
      events_empty_title: "В настоящее время запланированных событий нет",
      events_empty_desc: "Команда в настоящее время сосредоточена на музыкальных проектах и разработке голосовых библиотек. Подписывайтесь на наши каналы, чтобы не пропустить будущие анонсы.",
      events_empty_btn: "Следить за новостями",
      collab_eyebrow: "ПАРТНЕРСТВО И СПЕЦИАЛЬНЫЕ ПРОЕКТЫ",
      collab_sub_title: "Избранные артисты сотрудничества",
      collab_sub_desc: "Избранные артисты и ключевые голосовые библиотеки совместных специальных проектов.",
      collab_btn_roster: "Все 9 групп проектов →",
      collab_btn_drive: "📂 Главный диск All Voicebanks",
      collab_btn_card: "Перейти в профиль и скачать →"
    },

    ko: {
      nav_main: "메인",
      nav_about: "스튜디오 소개",
      nav_voicebank: "전체 보이스뱅크",
      nav_files: "USTX / MIDI / SVP / VSQX",
      nav_collab: "협업 안내",
      nav_events: "이벤트 및 소식",
      nav_new_works: "최신 작품",
      nav_thai_openutau: "Thai OpenUtau",
      nav_projects: "프로젝트",
      nav_toggle_open: "내비게이션 메뉴 열기",
      nav_toggle_close: "내비게이션 메뉴 닫기",
      hero_eyebrow: "태국 가상 보컬 합성 스튜디오 — 2019년 설립",
      hero_title: "태국의 열정과 창의성으로 탄생한<br><span class=\"accent\">차세대 가상 보컬</span>",
      hero_desc: "DELTA SYNTH는 태국 기반의 가상 가창 음원(UTAU / DiffSinger AI) 개발 스튜디오입니다. 57명 이상의 가상 싱어와 167개 이상의 음원 패키지를 제작·관리하며 7개 국어 가창을 지원합니다. 모든 음원과 음악 프로젝트 파일을 전 세계 창작자에게 무료로 공유합니다.",
      hero_btn_drive: "음원 다운로드 (Google Drive)",
      hero_btn_explore: "전체 음원 라이브러리 둘러보기",
      hero_btn_about: "스튜디오 소개",
      spec_core_engines_title: "핵심 엔진",
      spec_core_engines_val: "OpenUtau · DiffSinger AI · Classic UTAU (resampler / wavtool)",
      spec_repertoire_title: "보유 리포지토리",
      spec_repertoire_val: "57+ 싱어 · 167+ 음원 패키지 · 1,500+ USTX/MIDI 프로젝트",
      spec_status_title: "운영 현황",
      spec_status_val: "24/7 서비스 · 무료 배포 · 비영리 2차 창작 전면 허용",
      spec_partner_title: "파트너 네트워크",
      spec_partner_val: "Studio VOX · Thai UTAU Community · Global Synthesizer Network",
      spec_rd_title: "R&D 연구실",
      spec_rd_val: "Thai Tone Preserving RVC · The Darkside AI Agent · Phonemizer Suite",
      spec_founded_title: "설립일",
      spec_founded_val: "2019년 8월 · 태국 방콕 (Bangkok, Thailand)",
      stat_singers_num: "57+",
      stat_singers_lbl: "소속 가상 싱어",
      stat_packages_num: "167+",
      stat_packages_lbl: "무료 배포 음원",
      stat_languages_num: "7",
      stat_languages_lbl: "지원 언어 수",
      stat_free_num: "100%",
      stat_free_lbl: "창작용 무료 제공",
      pillars_eyebrow: "THREE PILLARS OF EXCELLENCE",
      pillars_title: "DELTA SYNTH를 이끄는 3대 핵심 기둥",
      pillars_desc: "정밀 음향 녹음부터 성조 보존 알고리즘, 개방형 음악 자산 배포까지 전문 가상 보컬 생태계를 구축합니다.",
      pillar1_tag: "PILLAR 01 · ACOUSTIC & AI",
      pillar1_title: "고품질 샘플링과 신경망 음향 모델",
      pillar1_desc: "VCCV, CVVC, Arpasing 방식의 정밀 샘플링과 DiffSinger AI 딥러닝 음향 모델을 통해 맑고 자연스러운 발음을 구현합니다.",
      pillar2_tag: "PILLAR 02 · THAI PHONETICS",
      pillar2_title: "태국어 5성조 보존 및 다국어 최적화",
      pillar2_desc: "독자 개발한 OpenUtau 태국어 음소 분석기와 Tone-Preserving 알고리즘으로 태국어 5개 성조와 영어, 일본어 등을 완벽하게 표현합니다.",
      pillar3_tag: "PILLAR 03 · CREATIVE ECOSYSTEM",
      pillar3_title: "창작자를 위한 개방형 음악 데이터 공유",
      pillar3_desc: "1,500개 이상의 USTX, MIDI, SVP, VSQX 조교 프로젝트 파일을 조건 없이 공개하여 전 세계 창작자의 커버 및 리믹스를 지원합니다.",
      showcase_eyebrow: "FEATURED SINGERS",
      showcase_title: "대표 가상 싱어 라인업",
      showcase_desc: "DELTA SYNTH의 독창적인 보컬 캐릭터와 음색을 직접 경험해 보세요.",
      showcase_btn_all: "전체 57+ 싱어 보기 →",
      showcase_hikaru_sub: "Light & Cybernetic Voice · 대표 여성 보컬",
      showcase_hikaru_desc: "밝고 청명한 일렉트로-팝 보이스. Thai VCCV와 DiffSinger AI를 지원하며 시원한 고음 표현력이 돋보입니다.",
      showcase_sun_sub: "Warm & Emotional Power · 따뜻하고 힘찬 남성 보컬",
      showcase_sun_desc: "감미로운 중저음과 폭발적인 고음을 겸비하여 록, 발라드, 팝 등 다채로운 장르를 완벽하게 소화합니다.",
      showcase_relven_sub: "Mellow & Melodic Tone · 감미로운 멜로디 보컬",
      showcase_relven_desc: "부드럽고 서정적인 포크 및 팝 보이스. 깨끗하고 자연스러운 음색으로 깊은 감성을 전달합니다.",
      showcase_andromeda_sub: "Celestial & Cosmic Diva · 몽환적인 우주 보컬",
      showcase_andromeda_desc: "넓고 신비로운 공간감을 선사하며 신스팝, 오케스트라 및 판타지 장르에 최적화된 목소리입니다.",
      btn_profile: "캐릭터 프로필 보기",
      btn_download: "음원 패키지 다운로드",
      badge_coming_soon: "출시 예정",
      nw_eyebrow: "NEW WORKS · AI TOOLS BY DELTA SYNTH",
      nw_title: "DELTA SYNTH 연구 개발실의 최신 성과",
      nw_desc: "스튜디오에서 자체 개발한 혁신 AI 도구들로 가상 보컬 제작과 로컬 생산성을 극대화합니다. 태국어 성조를 보존하는 Thai RVC WebUI와 로컬 전용 The Darkside AI Agent를 소개합니다.",
      nw_rvc_badge: "NEW WORK · ACTIVE DEVELOPMENT",
      nw_rvc_sub: "Tone-Preserving Thai RVC System · 태국어 성조 보존 음성 변환",
      nw_rvc_desc: "Retrieval-based Voice Conversion(RVC)을 기반으로 태국어 5개 성조를 완벽히 유지하도록 맞춤 설계된 WebUI입니다. RMVPE F0 윤곽선과 Thai ContentVec/HuBERT를 탑재하여 성조 정확도 ≥ 95%, MOS ≥ 4.0, RTF ≤ 0.3을 달성했습니다.",
      nw_rvc_li1: "올인원 단일 화면: 보이스 변환(Inference), 데이터셋 편집, 모델 학습(Train), FAISS 인덱스 생성 및 UVR5 보컬/반주 분리 지원",
      nw_rvc_li2: "폭넓은 하드웨어 호환: NVIDIA CUDA, AMD/Intel (DirectML) 및 CPU 공식 지원. Program.py (포트 9378) 또는 go-web.bat (포트 7897) 구동",
      nw_rvc_li3: "실시간 모니터링 & DAW 연동: 초저지연 실시간 변환(realtime_gui.py) 및 작곡 프로그램용 RVCRealtimeVST 플러그인 호환",
      nw_rvc_li4: "안전한 배치 처리: 하위 프로세스 분리로 VRAM 누수를 방지하며 clear_vram_safe() 및 환경 의존성 자동 복구 시스템 내장",
      nw_rvc_btn_gh: "GitHub 소스코드",
      nw_rvc_btn_contact: "테스트 참가 및 문의",
      nw_dark_badge: "NEW WORK · ACTIVE DEVELOPMENT",
      nw_dark_sub: "Local Agentic AI Desktop · Made by DELTA SYNTH",
      nw_dark_desc: "외부 API 키 없이 Ollama를 통해 PC에서 100% 독립 구동되는 윈도우용 자율 AI 에이전트 데스크톱 시스템입니다. 지정된 워크스페이스에만 안전하게 접근합니다.",
      nw_dark_li1: "모던 Avalonia / .NET 인터페이스: 실시간 모델 전환, NDJSON 실시간 사고 과정 및 작업 상태 스트리밍, 즉시 취소 지원",
      nw_dark_li2: "보안 파일 시스템 도구: read_file, write_file, list_directory 지원, 경로 순회 차단, 원자적 쓰기 및 파일 용량 제한 완비",
      nw_dark_li3: "완전 폐쇄형 로컬 보안: 백엔드와 게이트웨이가 127.0.0.1로 격리되며 동시성 제어 및 활성 세션 한도 적용",
      nw_dark_li4: "프로세스 감시 및 제어: 내장 슈퍼바이저를 통한 상태 점검, setup, start, stop, verify 자동화 스크립트 완비",
      nw_dark_btn_gh: "GitHub 개발 추적",
      nw_dark_btn_contact: "테스터 신청",
      openutau_eyebrow: "THAI OPENUTAU INTEGRATION",
      openutau_title: "차세대 크로스 플랫폼 Thai OpenUtau 생태계",
      openutau_desc: "최신 오픈소스 가창 음원 에디터 OpenUtau에 완벽 대응하며 태국어 전용 발음 사전, 음소 분석기, DiffSinger 설정 패키지를 제공합니다.",
      openutau_badge: "OPEN SOURCE ECOSYSTEM",
      openutau_core: "Thai Phonemizer & DiffSinger Support",
      openutau_f1_num: "01",
      openutau_f1_title: "지능형 태국어 음소 분석기 (Thai Phonemizer)",
      openutau_f1_desc: "태국어 초성, 중성, 종성 및 성조 기호를 자동 감지하여 음절 분리 없이 부드러운 연결을 완성합니다.",
      openutau_f2_num: "02",
      openutau_f2_title: "DiffSinger AI 신경망 다이렉트 연동",
      openutau_f2_desc: "DiffSinger ONNX 추론 엔진과 직접 연결되어 OpenUtau 피아노 롤 위에서 감정 곡선과 피치를 자유롭게 제어합니다.",
      openutau_f3_num: "03",
      openutau_f3_title: "크로스 플랫폼 원클릭 실행",
      openutau_f3_desc: "Windows, macOS, Linux에서 모두 완벽 작동하며 DELTA SYNTH 음원을 드래그 앤 드롭으로 즉시 설치할 수 있습니다.",
      openutau_btn_gh: "OpenUtau 프로젝트 방문",
      openutau_btn_tools: "태국어 사전 및 도구 받기",
      openutau_btn_contact: "기술 지원 문의",
      files_sec_eyebrow: "CREATOR TOOLKIT & MUSIC FILES",
      files_sec_title: "창작자를 위한 음악 프로젝트 및 파일 보관소",
      files_sec_desc: "USTX, MIDI, SVP, VSQX 조교 프로젝트 파일을 무료로 다운로드하여 당신의 커버 곡과 음악 창작을 한 단계 높여보세요.",
      files_p1_tag: "SCORE & TUNING · USTX / UST",
      files_p1_title: "OpenUtau & UTAU 조교 프로젝트",
      files_p1_desc: "정밀한 음표 파라미터, 볼륨 엔벨로프, 음소 교정 데이터가 포함되어 있어 즉시 보컬에 적용할 수 있습니다.",
      files_p1_btn: "프로젝트 파일 보관소 이동",
      files_p2_tag: "NOTE DATA · MIDI / SVP",
      files_p2_title: "MIDI 멜로디 트랙 및 Synthesizer V 파일",
      files_p2_desc: "표준 MIDI 및 SVP 프로젝트로 Cubase, FL Studio, Logic Pro 등 다양한 DAW로 간편하게 임포트할 수 있습니다.",
      files_p2_btn: "MIDI 다운로드",
      files_p3_tag: "PACKAGE ARCHIVES · VSQX / STEMS",
      files_p3_title: "VOCALOID 파일 및 고음질 반주 트랙",
      files_p3_desc: "명곡들의 VSQX 파일과 무손실 음원 스템(Stems)을 통해 프로의 조교 및 믹싱 노하우를 직접 연구할 수 있습니다.",
      files_p3_btn: "자료 라이브러리 보기",
      timeline_eyebrow: "DEVELOPMENT JOURNEY",
      timeline_title: "DELTA SYNTH의 발자취와 여정",
      timeline_item1_date: "2019년 8월",
      timeline_item1_title: "스튜디오 설립 및 태국어 UTAU 개발 착수",
      timeline_item1_desc: "DELTA SYNTH가 정식 출범하여 태국어 VCCV 샘플링 표준 규격을 제정하고 첫 실험 음원을 공개했습니다.",
      timeline_item2_date: "2021년",
      timeline_item2_title: "싱어 라인업 확장과 다국어 지원 확대",
      timeline_item2_desc: "소속 보컬을 20명 이상으로 확대하고 일본어 CVVC 및 영어 Arpasing 음원을 추가하며 구글 드라이브 통합 저장소를 구축했습니다.",
      timeline_item3_date: "2023년",
      timeline_item3_title: "OpenUtau 전면 전환 및 DiffSinger AI 도입",
      timeline_item3_desc: "차세대 OpenUtau 생태계로 전면 전환하고 독자적인 태국어 음소 분석기를 구축하며 첫 DiffSinger 모델 훈련에 성공했습니다.",
      timeline_item4_date: "2025년",
      timeline_item4_title: "57+ 싱어 및 167+ 음원 패키지 달성",
      timeline_item4_desc: "소속 보컬을 57명, 음원 패키지를 167종으로 확장하고 1,500곡 이상의 조교 프로젝트 파일을 대중에 완전 개방했습니다.",
      timeline_item5_date: "2026년 (현재)",
      timeline_item5_title: "AI 시대 도약: Thai RVC & The Darkside Agent",
      timeline_item5_desc: "성조 보존형 Thai RVC WebUI와 로컬 전용 AI 에이전트 시스템을 선보이며 태국 음성 AI 생태계의 새 지평을 열어가고 있습니다.",
      cta_title: "가상 보컬 음악의 새로운 여정을 시작하세요",
      cta_desc: "57명 이상의 매력적인 보컬을 탐색하고 조교 프로젝트 파일을 다운로드하여 나만의 특별한 음악을 만들어 보세요.",
      cta_btn_drive: "공식 Google Drive 저장소 열기",
      cta_btn_roster: "전체 싱어 목록 확인",
      footer_desc: "DELTA SYNTH는 태국 가상 음성 합성(UTAU / DiffSinger AI) 및 첨단 오디오 AI 기술 발전을 선도하는 스튜디오입니다. 2019년부터 전 세계 창작자를 위해 모든 자료를 무료로 개방하고 있습니다.",
      footer_sitemap: "사이트 맵",
      footer_contact: "문의하기",
      footer_drive: "음원 드라이브",
      footer_rights: "© 2019–2026 DELTA SYNTH. All rights reserved.",
      footer_made_by: "Designed and Developed by DELTA SYNTH.",
      about_h1: "DELTA SYNTH 소개",
      about_origin_title: "스튜디오의 시작과 비전",
      about_contact_title: "문의 및 협력",
      vb_hero_crumb: "DELTA SYNTH / 전체 보이스뱅크",
      vb_hero_title: "DELTA SYNTH<br>전체 음원 라이브러리",
      vb_hero_desc: "개성 넘치는 54명 이상의 가상 보컬 캐릭터를 만나보세요. OpenUtau 및 DiffSinger AI 완벽 호환, 캐릭터 프로필, 데모 오디오, 공식 다운로드 링크를 제공합니다.",
      vb_drive_banner_title: "📂 DELTA SYNTH 공식 Google Drive 음원 리포지토리",
      vb_drive_banner_desc: "스튜디오의 모든 UTAU 및 DiffSinger AI 보이스뱅크 패키지를 구글 공식 고속 드라이브에서 다운로드하세요.",
      vb_drive_banner_btn: "마스터 드라이브 열기 (Open Master Drive) →",
      vb_search_placeholder: "싱어 이름, 보컬 스타일, 지원 엔진 또는 언어 검색...",
      vb_filter_all: "전체 (54)",
      vb_filter_diffsinger: "DiffSinger AI",
      vb_filter_utau: "UTAU",
      vb_card_profile: "👤 캐릭터 프로필 / Profile",
      vb_card_private: "🔒 프라이빗 음원 · PRIVATE",
      profile_return: "← 전체 보이스뱅크로 돌아가기",
      profile_return_sub: "/ Return to Voicebanks",
      profile_official: "Official DELTA",
      profile_age: "나이 / Age",
      profile_gender: "성별 / Gender",
      profile_voicer: "음성 제공자 / Voicer",
      profile_genre: "선호 장르 / Genre",
      profile_engine: "지원 엔진 / Engine",
      profile_language: "지원 언어 / Language",
      profile_bio_title: "프로필 및 배경 스토리 / Biography",
      profile_audio_title: "샘플 오디오 / Audio Sample",
      profile_audio_demo: "데모 음원 / Demo:",
      profile_status_title: "음원 상태 · VOICEBANK STATUS",
      profile_private_title: "음원 상태: <span style=\"color: #ff4422;\">프라이빗 (Private Voicebank)</span>",
      profile_private_desc: "이 캐릭터의 음원은 스튜디오 내부 제작 및 특별 제휴 프로젝트 전용으로 보관되는 프라이빗 보이스뱅크입니다. 일반 공개 다운로드는 제공되지 않습니다.",
      profile_private_badge: "🔒 비공개 접근 전용 · PRIVATE ACCESS ONLY",
      profile_download_title: "다운로드 가능한 음원",
      profile_btn_download: "음원 다운로드",
      files_h1: "음악 프로젝트 및 파일 라이브러리",
      files_desc: "USTX, MIDI, SVP, VSQX 등 무료 음악 조교 프로젝트와 스템 파일을 다운로드하여 커버 곡과 리믹스를 제작해 보세요.",
      events_h1: "이벤트 및 공지사항",
      events_desc: "DELTA SYNTH의 최신 음원 발매, 온·오프라인 행사 및 커뮤니티 협업 소식을 전해드립니다.",
      collab_h1: "콜라보레이션 및 문의",
      collab_desc: "음악 프로듀서, 일러스트레이터, 조교사, 음성 AI 연구자와의 창의적인 협업을 언제나 환영합니다.",
      project_h1: "음악 및 기술 프로젝트",
      project_desc: "오리지널 앨범, 가상 콘서트, 그리고 자체 개발 중인 오디오 AI 소프트웨어 프로젝트를 확인하세요.",
      upload_h1: "작품 제출 및 공유",
      vb_label_status: "상태:",
      vb_label_affil: "소속:",
      vb_label_category: "카테고리:",
      vb_chip_all: "전체 (55)",
      vb_chip_official: "✓ 공식 (Active)",
      vb_chip_upcoming: "⏳ 출시 예정 (Upcoming)",
      vb_chip_private: "🔒 비공개 (Private)",
      vb_chip_female: "여성 (Female · 16)",
      vb_chip_male: "남성 (Male)",
      vb_chip_lgbtq: "LGBTQ (5)",
      badge_active: "✓ 공식",
      badge_private: "🔒 비공개",
      badge_upcoming: "⏳ 출시 예정",
      about_eyebrow: "2019년 설립 · 첫 프로젝트 — B.L. Student",
      about_lead: "2019년 설립된 태국 가상 보컬 합성 스튜디오로, 국내외 창작자들과의 지속적인 협업을 통해 다채로운 프로젝트를 활발히 전개하고 있습니다.",
      about_story_eyebrow: "스튜디오 스토리",
      about_story_title: "스튜디오의 출발점",
      about_story_desc: "초기 4명의 멤버와 스튜디오를 함께 일구고 지원해 준 SUN, 고추장(슈짱), 구렌 카니 등 3명의 서포터와 함께 출범했습니다. 대부분의 작품은 공식 유튜브 채널을 통해 꾸준히 공개되고 있습니다.",
      about_contact_eyebrow: "문의하기",
      files_th_name: "파일명",
      files_th_desc: "상세 설명",
      files_th_format: "형식",
      events_empty_title: "현재 예정된 이벤트가 없습니다",
      events_empty_desc: "스튜디오 팀은 현재 음악 프로젝트와 보이스뱅크 개발에 집중하고 있습니다. 다음 이벤트 공지를 놓치지 않도록 공식 채널을 구독해 주세요.",
      events_empty_btn: "공식 채널 팔로우",
      collab_eyebrow: "파트너십 및 스페셜 프로젝트",
      collab_sub_title: "대표 협업 아티스트",
      collab_sub_desc: "특별 협업 프로젝트를 통해 탄생한 대표 아티스트와 하이라이트 음원입니다.",
      collab_btn_roster: "전체 9개 프로젝트 그룹 보기 →",
      collab_btn_drive: "📂 마스터 드라이브 All Voicebanks",
      collab_btn_card: "프로필 및 다운로드 바로가기 →"
    }
  };

  const STORAGE_KEY = 'delta_synth_lang';

  function getCurrentLang() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored && TRANSLATIONS[stored]) {
        return stored;
      }
      const userChosen = localStorage.getItem('delta_synth_lang_chosen');
      if (userChosen) {
        return 'th';
      }
      const navLang = (navigator.language || navigator.userLanguage || '').toLowerCase();
      if (navLang.startsWith('th')) return 'th';
      if (navLang === 'es-cl') return 'es-cl';
      if (navLang.startsWith('es')) return 'es';
      if (navLang.startsWith('ja')) return 'ja';
      if (navLang.startsWith('zh')) return 'zh';
      if (navLang.startsWith('ko')) return 'ko';
      if (navLang.startsWith('fr')) return 'fr';
      if (navLang.startsWith('ru')) return 'ru';
      if (navLang.startsWith('en')) return 'en';
    } catch (e) {
      // localStorage unavailable or blocked
    }
    return 'th';
  }

  function setLanguage(langCode) {
    if (!TRANSLATIONS[langCode]) {
      langCode = 'th';
    }
    try {
      localStorage.setItem(STORAGE_KEY, langCode);
    } catch (e) {}

    document.documentElement.lang = langCode === 'es-cl' ? 'es-CL' : langCode;
    applyTranslations(langCode);
    updateSwitcherUI(langCode);

    try {
      window.dispatchEvent(new CustomEvent('deltaLanguageChanged', { detail: { lang: langCode } }));
    } catch (e) {}
  }

  function applyTranslations(langCode) {
    const t = TRANSLATIONS[langCode] || TRANSLATIONS.th;

    // 1. Data-i18n text content
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (t[key] !== undefined) {
        el.innerHTML = t[key];
      }
    });

    // 2. Data-i18n placeholders (e.g. search inputs)
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      const key = el.getAttribute('data-i18n-placeholder');
      if (t[key] !== undefined) {
        el.setAttribute('placeholder', t[key]);
      }
    });

    // 3. Data-i18n titles & aria-labels
    document.querySelectorAll('[data-i18n-title]').forEach(el => {
      const key = el.getAttribute('data-i18n-title');
      if (t[key] !== undefined) {
        el.setAttribute('title', t[key]);
      }
    });

    document.querySelectorAll('[data-i18n-aria]').forEach(el => {
      const key = el.getAttribute('data-i18n-aria');
      if (t[key] !== undefined) {
        el.setAttribute('aria-label', t[key]);
      }
    });

    // 4. Navigation Links Across All Pages
    const navMapping = {
      'index.html': t.nav_main,
      'about.html': t.nav_about,
      'voicebank.html': t.nav_voicebank,
      'files.html': t.nav_files,
      'collab.html': t.nav_collab,
      'events.html': t.nav_events,
      'project.html': t.project_h1 ? t.nav_collab : 'Projects'
    };
    document.querySelectorAll('.site-header .nav-links a, #site-navigation a, #mobile-menu a').forEach(a => {
      const href = a.getAttribute('href') || '';
      for (const [file, label] of Object.entries(navMapping)) {
        if (href.endsWith(file) || href.includes(file)) {
          if (!a.querySelector('svg') && !a.querySelector('img')) {
            a.textContent = label;
          }
          break;
        }
      }
    });

    // 5. Hero CTA buttons & elements
    const driveBtns = document.querySelectorAll('a[href*="drive.google.com/drive/folders/1tboFHk0sj2Util_1CGBvqEPfV-qqCvMx"]');
    driveBtns.forEach(btn => {
      if (btn.classList.contains('btn-drive')) {
        btn.textContent = t.vb_drive_banner_btn;
      } else if (btn.classList.contains('btn') && (btn.textContent.includes('Google Drive') || btn.textContent.includes('Drive'))) {
        btn.innerHTML = '<span>' + t.hero_btn_drive + '</span><span style="font-size:11px; opacity:0.85;">/ Master Drive</span>';
      }
    });

    // 6. Voicebank Page Banner, Search & Filters
    const bannerDrive = document.querySelector('.banner-drive');
    if (bannerDrive) {
      const h3 = bannerDrive.querySelector('h3');
      const p = bannerDrive.querySelector('p');
      if (h3) h3.textContent = t.vb_drive_banner_title;
      if (p) p.textContent = t.vb_drive_banner_desc;
    }

    const searchInput = document.getElementById('search-input') || document.getElementById('singerSearchInput') || document.querySelector('.vb-search-input') || document.querySelector('.filter-search-input');
    if (searchInput) {
      searchInput.setAttribute('placeholder', t.vb_search_placeholder);
    }

    // Filter sub-labels (Status, Affiliation, Category)
    document.querySelectorAll('.filter-sub-label').forEach(el => {
      const txt = el.textContent.trim();
      if (txt.includes('สถานะ') || txt.includes('Status')) el.textContent = t.vb_label_status;
      else if (txt.includes('สังกัด') || txt.includes('Affiliation')) el.textContent = t.vb_label_affil;
      else if (txt.includes('หมวดหมู่') || txt.includes('Category')) el.textContent = t.vb_label_category;
    });

    // Filter chips in voicebank.html
    const chipMap = {
      'all': t.vb_chip_all,
      'active': t.vb_chip_official,
      'upcoming': t.vb_chip_upcoming,
      'private': t.vb_chip_private,
      'female': t.vb_chip_female,
      'male': t.vb_chip_male,
      'lgbtq': t.vb_chip_lgbtq
    };
    for (const [filterVal, chipText] of Object.entries(chipMap)) {
      document.querySelectorAll('.filter-chip[data-filter="' + filterVal + '"]').forEach(chip => {
        chip.textContent = chipText;
      });
    }

    // Status badges on voicebank cards
    document.querySelectorAll('.status-badge').forEach(badge => {
      if (badge.classList.contains('status-active')) badge.textContent = t.badge_active;
      else if (badge.classList.contains('status-private')) badge.textContent = t.badge_private;
      else if (badge.classList.contains('status-upcoming')) badge.textContent = t.badge_upcoming;
    });

    // VCard stats labels on voicebank cards (อายุ, เพศ, ผู้ให้เสียง)
    document.querySelectorAll('.vcard-stats b, .vcard-specs b').forEach(b => {
      const txt = b.textContent.trim();
      if (txt.includes('อายุ') || txt.includes('Age')) b.textContent = t.profile_age + ':';
      else if (txt.includes('เพศ') || txt.includes('Gender')) b.textContent = t.profile_gender + ':';
      else if (txt.includes('ผู้ให้เสียง') || txt.includes('Voicer')) b.textContent = t.profile_voicer + ':';
    });

    // 7. Files Page Table Headers
    const fileTableHeaders = document.querySelectorAll('.file-table th, table.file-list th, #file-table th');
    if (fileTableHeaders.length >= 3) {
      fileTableHeaders[0].textContent = t.files_th_name;
      fileTableHeaders[1].textContent = t.files_th_desc;
      fileTableHeaders[2].textContent = t.files_th_format;
    }

    // 8. Events Page Empty State
    const emptyState = document.querySelector('.empty-state') || document.querySelector('.events-empty');
    if (emptyState) {
      const h3 = emptyState.querySelector('h3, h2');
      const p = emptyState.querySelector('p');
      const btn = emptyState.querySelector('a.btn, button.btn');
      if (h3) h3.textContent = t.events_empty_title;
      if (p) p.textContent = t.events_empty_desc;
      if (btn) btn.textContent = t.events_empty_btn;
    }

    // 9. Collab Page Elements
    const collabEyebrow = document.querySelector('.collab-eyebrow') || document.querySelector('.page-hero .eyebrow');
    if (collabEyebrow && (window.location.pathname.includes('collab') || document.title.includes('Collaboration'))) {
      collabEyebrow.textContent = t.collab_eyebrow;
    }
    const collabSubTitle = document.querySelector('.collab-sub-title');
    if (collabSubTitle) collabSubTitle.textContent = t.collab_sub_title;
    const collabSubDesc = document.querySelector('.collab-sub-desc');
    if (collabSubDesc) collabSubDesc.textContent = t.collab_sub_desc;
    const collabBtnRoster = document.querySelector('.collab-btn-roster');
    if (collabBtnRoster) collabBtnRoster.textContent = t.collab_btn_roster;
    const collabBtnDrive = document.querySelector('.collab-btn-drive');
    if (collabBtnDrive) collabBtnDrive.textContent = t.collab_btn_drive;
    document.querySelectorAll('.collab-card .btn, .collab-btn-card').forEach(b => {
      b.textContent = t.collab_btn_card;
    });

    // 10. About Page Elements
    if (window.location.pathname.includes('about') || document.title.includes('About Us')) {
      const pageHero = document.querySelector('.page-hero');
      if (pageHero) {
        const eyebrow = pageHero.querySelector('.eyebrow');
        const p = pageHero.querySelector('p.lead');
        if (eyebrow) eyebrow.textContent = t.about_eyebrow;
        if (p) p.textContent = t.about_lead;
      }
      const sectionHead = document.querySelector('.section-head');
      if (sectionHead) {
        const eyebrow = sectionHead.querySelector('.eyebrow');
        const h2 = sectionHead.querySelector('h2');
        const p = sectionHead.querySelector('p');
        if (eyebrow) eyebrow.textContent = t.about_story_eyebrow;
        if (h2) h2.textContent = t.about_story_title;
        if (p) p.textContent = t.about_story_desc;
      }
      const contactHeads = document.querySelectorAll('.section-head');
      if (contactHeads.length > 1) {
        const eyebrow = contactHeads[1].querySelector('.eyebrow');
        if (eyebrow) eyebrow.textContent = t.about_contact_eyebrow;
      }
      document.querySelectorAll('.founder .role').forEach(r => {
        const txt = r.textContent;
        if (txt.includes('ผู้ให้เสียง:') || txt.includes('Voicer:')) {
          const voicerName = txt.split(':')[1] ? txt.split(':')[1].trim() : '';
          r.textContent = t.profile_voicer + ': ' + voicerName;
        }
      });
      document.querySelectorAll('.founder a.btn').forEach(btn => {
        const txt = btn.textContent;
        const match = txt.match(/\((\d+.*?)\)/);
        const count = match ? ' ' + match[0] : '';
        btn.textContent = t.profile_download_title + count + ' →';
      });
    }

    // 11. Singer Profile Pages: Specs, Bio and Audio Labels
    document.querySelectorAll('.grid > div').forEach(div => {
      const pLabel = div.querySelector('p:first-child');
      if (pLabel) {
        const text = pLabel.textContent.trim();
        if (text.includes('Age') || text.includes('อายุ')) pLabel.textContent = t.profile_age;
        else if (text.includes('Gender') || text.includes('เพศ')) pLabel.textContent = t.profile_gender;
        else if (text.includes('Voicer') || text.includes('ผู้ให้เสียง')) pLabel.textContent = t.profile_voicer;
        else if (text.includes('Genre') || text.includes('แนวเพลง')) pLabel.textContent = t.profile_genre;
        else if (text.includes('Engine') || text.includes('เอนจิน')) pLabel.textContent = t.profile_engine;
        else if (text.includes('Language') || text.includes('ภาษา')) pLabel.textContent = t.profile_language;
      }
    });

    document.querySelectorAll('h3').forEach(h3 => {
      const txt = h3.textContent.trim();
      if (txt.includes('Biography') || txt.includes('ประวัติ')) {
        h3.textContent = t.profile_bio_title;
      } else if (txt.includes('Audio Sample') || txt.includes('ตัวอย่างเสียง')) {
        h3.textContent = t.profile_audio_title;
      }
    });

    const vbTitle = document.querySelector('.vb-archive-title');
    if (vbTitle) {
      const span = vbTitle.querySelector('span');
      if (span) {
        if (span.textContent.includes('STATUS') || span.textContent.includes('สถานะ')) {
          span.textContent = t.profile_status_title;
        } else if (span.textContent.includes('ARCHIVES') || span.textContent.includes('ดาวน์โหลด')) {
          const match = span.textContent.match(/\(\d+.*?\)/);
          const count = match ? ' ' + match[0] : '';
          span.textContent = t.profile_download_title + count + ' · VOICEBANK ARCHIVES';
        }
      }
    }

    const privateCard = document.querySelector('.vb-private-card');
    if (privateCard) {
      const pTitle = privateCard.querySelector('.vb-private-title');
      const pDesc = privateCard.querySelector('.vb-private-desc');
      const pBadge = privateCard.querySelector('.vb-private-badge');
      if (pTitle) pTitle.innerHTML = t.profile_private_title;
      if (pDesc) pDesc.textContent = t.profile_private_desc;
      if (pBadge) pBadge.textContent = t.profile_private_badge;
    }

    const backBtn = document.querySelector('a[href="../voicebank.html"]');
    if (backBtn && (backBtn.textContent.includes('กลับ') || backBtn.textContent.includes('Return') || backBtn.textContent.includes('Volver') || backBtn.textContent.includes('Retour') || backBtn.textContent.includes('戻る') || backBtn.textContent.includes('返回') || backBtn.textContent.includes('돌아가기') || backBtn.textContent.includes('Назад'))) {
      backBtn.innerHTML = '<span>' + t.profile_return + '</span><span class="text-xs text-gray-500">' + t.profile_return_sub + '</span>';
    }

    document.querySelectorAll('.vb-btn-download span').forEach(s => {
      s.textContent = t.profile_btn_download;
    });

    // 12. Footer copyright & made by
    const footerBottom = document.querySelector('.footer-bottom') || document.querySelector('.site-footer div[style*="border-top"]');
    if (footerBottom) {
      const spans = footerBottom.querySelectorAll('span');
      if (spans.length >= 2) {
        spans[0].textContent = t.footer_rights;
        spans[1].textContent = t.footer_made_by;
      }
    }
  }

  function createLanguageSwitcher() {
    // Deduplicate any multiple switchers if present
    const existingSwitchers = document.querySelectorAll('.lang-switcher');
    if (existingSwitchers.length > 1) {
      for (let i = 1; i < existingSwitchers.length; i++) {
        existingSwitchers[i].remove();
      }
    }

    let switcher = document.getElementById('lang-switcher') || document.querySelector('.lang-switcher');
    const currentLang = getCurrentLang();
    const curLangObj = LANGUAGES.find(l => l.code === currentLang) || LANGUAGES[0];

    const langItemsHtml = LANGUAGES.map(l => 
      '<button type="button" role="menuitem" data-lang="' + l.code + '" class="' + (currentLang === l.code ? 'active' : '') + '">' +
        '<span class="lang-flag">' + l.flag + '</span>' +
        '<span class="lang-name">' + l.label + '</span>' +
        '<span class="lang-code-tag">' + l.short + '</span>' +
      '</button>'
    ).join('');

    // If not existing in HTML, create dynamically
    if (!switcher) {
      const navLinks = document.querySelector('.site-header .nav-links') || document.querySelector('#site-navigation') || document.querySelector('.nav-links');
      const nav = document.querySelector('.site-header .nav') || document.querySelector('.nav') || document.querySelector('header');
      const container = navLinks || nav;
      if (!container) return;

      switcher = document.createElement('div');
      switcher.className = 'lang-switcher';
      switcher.id = 'lang-switcher';

      switcher.innerHTML = 
        '<button class="lang-btn" id="lang-btn" type="button" aria-haspopup="true" aria-expanded="false" title="Select Language">' +
          '<span class="lang-flag" id="lang-flag">' + curLangObj.flag + '</span>' +
          '<span class="lang-current" id="lang-current">' + curLangObj.label + '</span>' +
          '<span class="lang-code-tag" id="lang-code-tag">' + curLangObj.short + '</span>' +
        '</button>' +
        '<div class="lang-dropdown" id="lang-dropdown" style="display: none !important; backdrop-filter: none !important; -webkit-backdrop-filter: none !important;" role="menu" aria-label="Language selection">' +
          langItemsHtml +
        '</div>';

      container.appendChild(switcher);
    } else {
      switcher.id = 'lang-switcher';
      let btn = switcher.querySelector('#lang-btn') || switcher.querySelector('.lang-btn');
      if (btn) {
        btn.id = 'lang-btn';
        if (!btn.querySelector('#lang-flag')) {
          btn.innerHTML = 
            '<span class="lang-flag" id="lang-flag">' + curLangObj.flag + '</span>' +
            '<span class="lang-current" id="lang-current">' + curLangObj.label + '</span>' +
            '<span class="lang-code-tag" id="lang-code-tag">' + curLangObj.short + '</span>';
        }
      }
      let dropdown = switcher.querySelector('#lang-dropdown') || switcher.querySelector('.lang-dropdown');
      if (!dropdown) {
        dropdown = document.createElement('div');
        dropdown.className = 'lang-dropdown';
        dropdown.id = 'lang-dropdown';
        dropdown.setAttribute('role', 'menu');
        dropdown.setAttribute('aria-label', 'Language selection');
        dropdown.style.setProperty('display', 'none', 'important');
        dropdown.style.setProperty('backdrop-filter', 'none', 'important');
        dropdown.style.setProperty('-webkit-backdrop-filter', 'none', 'important');
        switcher.appendChild(dropdown);
      }
      if (!dropdown.querySelector('button[data-lang]')) {
        dropdown.innerHTML = langItemsHtml;
      }
    }

    const btn = switcher.querySelector('#lang-btn') || switcher.querySelector('.lang-btn');
    const dropdown = switcher.querySelector('#lang-dropdown') || switcher.querySelector('.lang-dropdown');
    if (!btn || !dropdown) return;

    dropdown.style.setProperty('backdrop-filter', 'none', 'important');
    dropdown.style.setProperty('-webkit-backdrop-filter', 'none', 'important');

    const toggleDropdown = (open) => {
      const isCurrentlyOpen = dropdown.classList.contains('show') && dropdown.style.display !== 'none';
      const shouldOpen = open !== undefined ? open : !isCurrentlyOpen;
      if (shouldOpen) {
        dropdown.style.setProperty('display', 'flex', 'important');
        dropdown.classList.add('show');
        btn.setAttribute('aria-expanded', 'true');
      } else {
        dropdown.style.setProperty('display', 'none', 'important');
        dropdown.classList.remove('show');
        btn.setAttribute('aria-expanded', 'false');
      }
    };

    const newBtn = btn.cloneNode(true);
    btn.parentNode.replaceChild(newBtn, btn);

    newBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleDropdown();
    });

    dropdown.querySelectorAll('button[data-lang]').forEach(optionBtn => {
      optionBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const chosen = optionBtn.getAttribute('data-lang');
        try {
          localStorage.setItem('delta_synth_lang_chosen', 'true');
        } catch (err) {}
        setLanguage(chosen);
        toggleDropdown(false);
      });
    });

    document.addEventListener('click', (e) => {
      if (!switcher.contains(e.target)) {
        toggleDropdown(false);
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && dropdown.classList.contains('show')) {
        toggleDropdown(false);
        newBtn.focus();
      }
    });
  }

  function updateSwitcherUI(langCode) {
    const curLangObj = LANGUAGES.find(l => l.code === langCode) || LANGUAGES[0];
    
    // Update button text and flag
    const flagEl = document.getElementById('lang-flag') || document.querySelector('.lang-btn .lang-flag');
    const currentLabel = document.getElementById('lang-current') || document.querySelector('.lang-btn .lang-current');
    const codeTag = document.getElementById('lang-code-tag') || document.querySelector('.lang-btn .lang-code-tag');

    if (flagEl) flagEl.textContent = curLangObj.flag;
    if (currentLabel) currentLabel.textContent = curLangObj.label;
    if (codeTag) codeTag.textContent = curLangObj.short;

    // Update active state in dropdown
    document.querySelectorAll('#lang-dropdown button[data-lang], .lang-dropdown button[data-lang]').forEach(btn => {
      if (btn.getAttribute('data-lang') === langCode) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
  }

  function init() {
    createLanguageSwitcher();
    const currentLang = getCurrentLang();
    setLanguage(currentLang);

    // Cross-tab synchronization
    try {
      window.addEventListener('storage', (e) => {
        if (e.key === STORAGE_KEY && e.newValue && TRANSLATIONS[e.newValue]) {
          setLanguage(e.newValue);
        }
      });
    } catch (e) {}
  }

  if (typeof window !== 'undefined' && typeof document !== 'undefined') {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', init);
    } else {
      init();
    }
  }

  // Export globally for programmatic control
  if (typeof window !== 'undefined') {
    window.DeltaI18n = {
      languages: LANGUAGES,
      getCurrentLanguage: getCurrentLang,
      setLanguage: setLanguage,
      translations: TRANSLATIONS
    };
  }

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = { LANGUAGES, TRANSLATIONS, getCurrentLang, setLanguage, applyTranslations };
  }
})();
