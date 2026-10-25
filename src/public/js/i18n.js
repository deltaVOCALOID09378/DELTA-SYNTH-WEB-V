/**
 * DELTA SYNTH Multi-Language Internationalization Engine (i18n)
 * Made And Checked By DELTA SYNTH & All Code Agentic AI Engine
 * Original by DELTA SYNTH
 * 
 * Supported Languages:
 * - th: Thai (ภาษาไทย - Default)
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
      "nav_new_works": "ผลงานใหม่",
      "nw_eyebrow": "NEW WORKS · AI TOOLS BY DELTA SYNTH",
      "nw_title": "ผลงานใหม่ล่าสุดจากห้องพัฒนา DELTA SYNTH",
      "nw_desc": "เครื่องมือ AI ที่ทีมพัฒนาขึ้นเองเพื่อสนับสนุนงานสร้างเสียงร้องเสมือน — ทั้งการแปลงเสียงด้วย Tone-Preserving Thai RVC ผ่านหน้าเว็บภาษาไทย และผู้ช่วย Local AI Agent บนเครื่องของคุณเอง",
      "nw_rvc_badge": "NEW WORK · ACTIVE DEVELOPMENT",
      "nw_rvc_sub": "Tone-Preserving Thai RVC System · ระบบแปลงเสียงวรรณยุกต์ไทยแท้",
      "nw_rvc_desc": "WebUI แปลงเสียงด้วย Retrieval-based Voice Conversion (RVC) ที่ปรับแต่งสถาปัตยกรรมเพื่อรักษาวรรณยุกต์ไทย 5 เสียงครบถ้วน ด้วย RMVPE F0 contour และ Thai ContentVec/HuBERT (ความแม่นยำวรรณยุกต์ ≥ 95%, MOS ≥ 4.0, RTF ≤ 0.3) พร้อมคู่มือสองภาษาไทย/อังกฤษ",
      "nw_rvc_li1": "ครบวงจรในหน้าเดียว: แปลงเสียง (Inference), จัดการ Dataset, ฝึกโมเดล (Train), สร้าง Index (FAISS) และแยกเสียงร้อง/ดนตรีด้วย UVR5",
      "nw_rvc_li2": "รองรับฮาร์ดแวร์หลากหลาย: NVIDIA CUDA, AMD / Intel (DirectML) และ CPU เปิดรันผ่าน Program.py (พอร์ต 9378) หรือ go-web.bat (พอร์ต 7897)",
      "nw_rvc_li3": "โหมดเสียงสด & ปลั๊กอิน DAW: รองรับ realtime_gui.py แปลงเสียงสดความหน่วงต่ำ และรองรับ RVCRealtimeVST สำหรับโปรแกรมทำเพลง",
      "nw_rvc_li4": "ระบบประมวลผล Batch ปลอดภัย: แยก subprocess ลดปัญหา VRAM รั่ว มี clear_vram_safe() พร้อมระบบตรวจซ่อม dependency อัตโนมัติ",
      "nw_rvc_btn_gh": "Source Code บน GitHub",
      "nw_rvc_btn_contact": "ติดต่อร่วมทดสอบ",
      "nw_dark_badge": "NEW WORK · ACTIVE DEVELOPMENT",
      "nw_dark_sub": "Local Agentic AI Desktop · Made by DELTA SYNTH",
      "nw_dark_desc": "แอปเดสก์ท็อป Windows สำหรับสั่งงาน AI Agent บนเครื่องของคุณเองผ่าน Ollama 100% ไม่ต้องใช้ API Key ภายนอก และจำกัดสิทธิ์การเข้าถึงไฟล์เฉพาะ Workspace ที่กำหนดเท่านั้น",
      "nw_dark_li1": "หน้าจอ Avalonia / .NET สไตล์โมเดิร์น: เลือกโมเดล สตรีมความคิดและสถานะการทำงานของ Agent แบบสดด้วย NDJSON พร้อมปุ่มยกเลิกทันที",
      "nw_dark_li2": "เครื่องมือไฟล์ความปลอดภัยสูง: read_file, write_file, list_directory ป้องกัน Path Traversal เขียนไฟล์แบบ Atomic และจำกัดขนาด",
      "nw_dark_li3": "ความปลอดภัยแบบปิด: Backend และ Gateway ผูกที่ 127.0.0.1 เท่านั้น ควบคุม Concurrency และจำกัดจำนวนเซสชันพร้อมกัน",
      "nw_dark_li4": "ระบบ Supervisor และการควบคุม: ตรวจสุขภาพโปรเซสอัตโนมัติ มีสคริปต์ setup, start, stop, verify พร้อมใช้งานสมบูรณ์",
      "nw_dark_btn_gh": "ติดตามบน GitHub",
      "nw_dark_btn_contact": "ติดต่อร่วมทดสอบ",
      nav_main: 'Main',
      nav_about: 'About Us',
      nav_voicebank: 'All Voicebank',
      nav_files: 'USTX / MIDI / SVP / VSQX',
      nav_collab: 'Collaboration',
      nav_events: 'Events',
      nav_toggle_open: 'เปิดเมนูนำทาง',
      nav_toggle_close: 'ปิดเมนูนำทาง',
      hero_eyebrow: 'Thai Vocal Synthesis Studio — Since 2019',
      hero_title: 'เสียงร้องเสมือน<br>ที่เริ่มต้นจาก<span class="accent">ความตั้งใจของคนไทย</span>',
      hero_desc: 'DELTA SYNTH คือค่ายพัฒนาคลังเสียงร้องเสมือน (UTAU / DiffSinger AI) สัญชาติไทย ผลิตและดูแลนักร้องเสมือนกว่า 54 เสียง พร้อมคลังเสียงดาวน์โหลด 167 แพ็กเกจ รองรับการร้องได้หลายภาษา พร้อมส่งต่อคลังเสียงและไฟล์เพลงให้ทุกคนใช้งานฟรี',
      hero_btn_drive: 'ดาวน์โหลดคลังเสียง (Google Drive)',
      hero_btn_explore: 'สำรวจคลังเสียงทั้งหมด',
      hero_btn_about: 'รู้จักค่ายของเรา',
      stat_singers: 'นักร้องเสมือนในเครือ',
      stat_packages: 'คลังเสียงพร้อมดาวน์โหลด',
      stat_projects: 'โปรเจกต์เพลงและไฟล์ดนตรี',
      stat_studios: 'สตูดิโอและพาร์ทเนอร์สร้างสรรค์',
      vb_hero_crumb: 'DELTA SYNTH / All Voicebank',
      vb_hero_title: 'คลังเสียงทั้งหมด<br>ของ DELTA SYNTH',
      vb_hero_desc: 'คลังเสียงร้องเสมือนรวม 54 ตัวละคร รองรับ OpenUtau และ DiffSinger AI พร้อมประวัติตัวละคร ตัวอย่างเสียงร้อง และลิงก์ดาวน์โหลดตรง',
      vb_drive_banner_title: '📂 DELTA SYNTH Official Google Drive Voicebank Repository',
      vb_drive_banner_desc: 'คลังดาวน์โหลดไฟล์เสียง Voicebank (UTAU / DiffSinger AI) ทั้งหมดของสตูดิโอบน Google Drive ทางการ',
      vb_drive_banner_btn: 'เข้าสู่คลังไดรฟ์หลัก (Open Master Drive) →',
      vb_filter_all: 'All (54)',
      vb_card_profile: '👤 ข้อมูลตัวละคร / Profile',
      vb_card_private: '🔒 PRIVATE · ไพรเวท',
      profile_return: '← กลับสู่คลังเสียงทั้งหมด',
      profile_return_sub: '/ Return to Voicebanks',
      profile_official: 'Official DELTA',
      profile_age: 'Age / อายุ',
      profile_gender: 'Gender / เพศ',
      profile_voicer: 'Voicer / ผู้ให้เสียง',
      profile_genre: 'Genre / แนวเพลง',
      profile_engine: 'Engine / เอนจิน',
      profile_language: 'Language / ภาษา',
      profile_bio_title: 'Biography / ประวัติและความเป็นมา',
      profile_audio_title: 'Audio Sample / ตัวอย่างเสียงร้อง',
      profile_audio_demo: 'Demo Preview:',
      profile_status_title: 'สถานะคลังเสียง · VOICEBANK STATUS',
      profile_private_title: 'คลังเสียงสถานะ: <span style="color: #ff4422;">ไพรเวท (Private Voicebank)</span>',
      profile_private_desc: 'คลังเสียงของตัวละครนี้เป็นคลังเสียงส่วนตัว (Private Voicebank) สงวนสิทธิ์การใช้งานเฉพาะภายในสตูดิโอ DELTA SYNTH และโปรเจกต์พิเศษ ไม่เปิดให้ดาวน์โหลดไฟล์สาธารณะ',
      profile_private_badge: '🔒 PRIVATE ACCESS ONLY · สถานะคลังเสียงส่วนตัว',
      profile_download_title: 'คลังเสียงพร้อมดาวน์โหลด',
      profile_btn_download: '⚡ ดาวน์โหลด',
      footer_desc: 'สตูดิโอพัฒนาคลังเสียงร้องเสมือนสัญชาติไทย ก่อตั้งขึ้นในปี ค.ศ. 2019 สรรค์สร้างคลังเสียง UTAU และ DiffSinger AI พร้อมแจกจ่ายไฟล์โปรเจกต์ดนตรีฟรีเพื่อทุกคน',
      footer_sitemap: 'Sitemap',
      footer_contact: 'Contact & Community',
      footer_drive: 'Google Drive Voicebanks Hub',
      footer_rights: '© Since 2019 — DELTA SYNTH Studio. All rights reserved.',
      footer_made_by: 'Made And Checked By DELTA SYNTH & All Code Agentic AI Engine'
    },
    en: {
      "nav_new_works": "New Works",
      "nw_eyebrow": "NEW WORKS · AI TOOLS BY DELTA SYNTH",
      "nw_title": "Latest Innovations from the DELTA SYNTH Lab",
      "nw_desc": "In-house developed AI tools powering next-generation virtual vocal creation — featuring Tone-Preserving Thai RVC with a localized Thai web interface and a secure Local AI Desktop Agent.",
      "nw_rvc_badge": "NEW WORK · ACTIVE DEVELOPMENT",
      "nw_rvc_sub": "Tone-Preserving Thai RVC System · Authentic Thai Tone Voice Conversion",
      "nw_rvc_desc": "Retrieval-based Voice Conversion WebUI engineered to preserve all 5 Thai phonetic tones using RMVPE F0 contour and Thai ContentVec/HuBERT (Tone Accuracy ≥ 95%, MOS ≥ 4.0, RTF ≤ 0.3) with bilingual Thai/English documentation.",
      "nw_rvc_li1": "All-in-one pipeline: Voice conversion (Inference), Dataset processing, Model training, FAISS Index building, and UVR5 vocal/instrumental separation.",
      "nw_rvc_li2": "Multi-hardware acceleration: NVIDIA CUDA, AMD / Intel (DirectML), and CPU. Launch via Program.py (port 9378) or go-web.bat (port 7897).",
      "nw_rvc_li3": "Low-latency Live Voice & DAW Integration: Supports realtime_gui.py for ultra-low latency voice changers and RVCRealtimeVST for digital audio workstations.",
      "nw_rvc_li4": "Safe Batch Execution: Subprocess isolation prevents VRAM leakage, features clear_vram_safe(), and includes self-healing dependency auto-repair.",
      "nw_rvc_btn_gh": "Source Code on GitHub",
      "nw_rvc_btn_contact": "Join Beta Testing",
      "nw_dark_badge": "NEW WORK · ACTIVE DEVELOPMENT",
      "nw_dark_sub": "Local Agentic AI Desktop · Made by DELTA SYNTH",
      "nw_dark_desc": "Windows desktop app orchestrating autonomous AI agents powered 100% locally by Ollama — zero cloud API keys needed, strictly sandboxed to user-designated workspaces.",
      "nw_dark_li1": "Modern Avalonia / .NET UI: Dynamic model selection, live thought and tool execution streaming via NDJSON, and instant task cancellation.",
      "nw_dark_li2": "Hardened File Tools: read_file, write_file, and list_directory with strict anti-traversal guards, atomic writes, and file size limits.",
      "nw_dark_li3": "Closed-loop Security: Backend and Gateway strictly bound to 127.0.0.1 with concurrency throttles and concurrent session limits.",
      "nw_dark_li4": "Supervisor & Operational Lifecycle: Automated process health checks with turnkey setup, start, stop, and verify management scripts.",
      "nw_dark_btn_gh": "Follow on GitHub",
      "nw_dark_btn_contact": "Join Beta Testing",
      nav_main: 'Main',
      nav_about: 'About Us',
      nav_voicebank: 'All Voicebank',
      nav_files: 'USTX / MIDI / SVP / VSQX',
      nav_collab: 'Collaboration',
      nav_events: 'Events',
      nav_toggle_open: 'Open Navigation Menu',
      nav_toggle_close: 'Close Navigation Menu',
      hero_eyebrow: 'Thai Vocal Synthesis Studio — Since 2019',
      hero_title: 'Virtual Singing Voices<br>Born from <span class="accent">Thai Passion</span>',
      hero_desc: 'DELTA SYNTH is a premier Thai vocal synthesis studio (UTAU / DiffSinger AI) developing over 54 virtual vocalists with 167+ downloadable packages, multi-language support, and free musical assets for all creators.',
      hero_btn_drive: 'Download Voicebanks (Google Drive)',
      hero_btn_explore: 'Explore All Voicebanks',
      hero_btn_about: 'About Our Studio',
      stat_singers: 'Virtual Vocalists in Roster',
      stat_packages: 'Downloadable Voicebank Packages',
      stat_projects: 'Music Projects & Files',
      stat_studios: 'Studios & Creative Partners',
      vb_hero_crumb: 'DELTA SYNTH / All Voicebank',
      vb_hero_title: 'Complete Voicebank Roster<br>of DELTA SYNTH',
      vb_hero_desc: 'Voicebank repository of 54 virtual characters. OpenUtau and DiffSinger AI ready with complete profiles, audio demos, and direct download links.',
      vb_drive_banner_title: '📂 DELTA SYNTH Official Google Drive Voicebank Repository',
      vb_drive_banner_desc: 'Complete studio repository for UTAU and DiffSinger AI voicebanks hosted on official Google Drive.',
      vb_drive_banner_btn: 'Open Master Drive Repository →',
      vb_filter_all: 'All (54)',
      vb_card_profile: '👤 Profile & Details',
      vb_card_private: '🔒 PRIVATE VOICEBANK',
      profile_return: '← Return to All Voicebanks',
      profile_return_sub: '/ Voicebank Roster',
      profile_official: 'Official DELTA',
      profile_age: 'Age',
      profile_gender: 'Gender',
      profile_voicer: 'Voicer',
      profile_genre: 'Genre',
      profile_engine: 'Engine',
      profile_language: 'Language',
      profile_bio_title: 'Biography & Background',
      profile_audio_title: 'Audio Sample Preview',
      profile_audio_demo: 'Demo Preview:',
      profile_status_title: 'Voicebank Status · VOICEBANK STATUS',
      profile_private_title: 'Voicebank Status: <span style="color: #ff4422;">Private Voicebank</span>',
      profile_private_desc: "This character's voicebank is private and reserved exclusively for DELTA SYNTH studio productions and special collaborations. Public download is unavailable.",
      profile_private_badge: '🔒 PRIVATE ACCESS ONLY · Studio Exclusive',
      profile_download_title: 'Downloadable Voicebank Archives',
      profile_btn_download: '⚡ Download',
      footer_desc: 'Thai virtual vocal synthesis studio founded in 2019. Creating UTAU and DiffSinger AI voicebanks with free musical distribution for creators worldwide.',
      footer_sitemap: 'Sitemap',
      footer_contact: 'Contact & Community',
      footer_drive: 'Google Drive Voicebanks Hub',
      footer_rights: '© Since 2019 — DELTA SYNTH Studio. All rights reserved.',
      footer_made_by: 'Made And Checked By DELTA SYNTH & All Code Agentic AI Engine'
    },
    fr: {
      "nav_new_works": "Nouvelles Créations",
      "nw_eyebrow": "NOUVELLES CRÉATIONS · OUTILS IA PAR DELTA SYNTH",
      "nw_title": "Dernières innovations du laboratoire DELTA SYNTH",
      "nw_desc": "Outils d'IA développés en interne pour dynamiser la création vocale virtuelle — intégrant RVC thaï avec préservation tonale et un agent IA de bureau local sécurisé.",
      "nw_rvc_badge": "NOUVEAU · EN DÉVELOPPEMENT ACTIF",
      "nw_rvc_sub": "Système RVC thaï préservant les tons · Conversion vocale tonale authentique",
      "nw_rvc_desc": "WebUI de conversion vocale basée sur la récupération (RVC), optimisée pour préserver les 5 tons thaïlandais grâce à RMVPE F0 et ContentVec/HuBERT (précision tonale ≥ 95%, MOS ≥ 4.0, RTF ≤ 0.3) avec documentation bilingue.",
      "nw_rvc_li1": "Pipeline tout-en-un : Conversion vocale (Inférence), gestion de datasets, entraînement, création d'index FAISS et séparation UVR5 voix/musique.",
      "nw_rvc_li2": "Accélération matérielle universelle : NVIDIA CUDA, AMD / Intel (DirectML) et CPU. Lancez via Program.py (port 9378) ou go-web.bat (port 7897).",
      "nw_rvc_li3": "Mode voix en direct à faible latence & DAW : Incorpore realtime_gui.py pour la voix directe et RVCRealtimeVST pour les stations audionumériques.",
      "nw_rvc_li4": "Exécution batch sécurisée : Isolation par sous-processus évitant les fuites VRAM, clear_vram_safe() et auto-réparation des dépendances.",
      "nw_rvc_btn_gh": "Code Source sur GitHub",
      "nw_rvc_btn_contact": "Rejoindre le bêta-test",
      "nw_dark_badge": "NOUVEAU · EN DÉVELOPPEMENT ACTIF",
      "nw_dark_sub": "Bureau d'IA agentique locale · Créé par DELTA SYNTH",
      "nw_dark_desc": "Application de bureau Windows orchestrant des agents IA autonomes propulsés localement par Ollama — zéro clé API externe, bac à sable strict.",
      "nw_dark_li1": "Interface moderne Avalonia / .NET : Sélection de modèle, flux de pensée et d'état en direct via NDJSON avec annulation instantanée.",
      "nw_dark_li2": "Outils de fichiers hautement sécurisés : read_file, write_file, list_directory avec protection contre le traversée de chemin et écritures atomiques.",
      "nw_dark_li3": "Sécurité en circuit fermé : Backend et Gateway liés exclusivement à 127.0.0.1 avec contrôle de concurrence et limites de session.",
      "nw_dark_li4": "Superviseur et contrôle du cycle de vie : Surveillance de santé automatisée avec scripts clés en main setup, start, stop et verify.",
      "nw_dark_btn_gh": "Suivre sur GitHub",
      "nw_dark_btn_contact": "Rejoindre le bêta-test",
      nav_main: 'Accueil',
      nav_about: 'À Propos',
      nav_voicebank: 'Banques Vocales',
      nav_files: 'USTX / MIDI / SVP / VSQX',
      nav_collab: 'Collaborations',
      nav_events: 'Événements',
      nav_toggle_open: 'Ouvrir le menu',
      nav_toggle_close: 'Fermer le menu',
      hero_eyebrow: 'Studio de Synthèse Vocale Thaïlandais — Depuis 2019',
      hero_title: 'Voix Chantées Virtuelles<br>Nées de la <span class="accent">Passion Thaïlandaise</span>',
      hero_desc: 'DELTA SYNTH est un studio thaïlandais de synthèse vocale (UTAU / DiffSinger AI) produisant plus de 54 chanteurs virtuels avec 167+ banques vocales téléchargeables, multilingues et gratuites pour tous les créateurs.',
      hero_btn_drive: 'Télécharger les Banques Vocales (Google Drive)',
      hero_btn_explore: 'Explorer Toutes les Banques Vocales',
      hero_btn_about: 'À Propos du Studio',
      stat_singers: 'Chanteurs Virtuels au Catalogue',
      stat_packages: 'Banques Vocales Téléchargeables',
      stat_projects: 'Projets Musicaux & Fichiers',
      stat_studios: 'Partenaires Créatifs & Studios',
      vb_hero_crumb: 'DELTA SYNTH / Banques Vocales',
      vb_hero_title: 'Catalogue Complet des Banques Vocales<br>de DELTA SYNTH',
      vb_hero_desc: 'Répertoire de 54 chanteurs virtuels. Compatibles OpenUtau et DiffSinger AI avec fiches complètes, échantillons audio et téléchargements directs.',
      vb_drive_banner_title: '📂 Répertoire Officiel Google Drive des Banques Vocales DELTA SYNTH',
      vb_drive_banner_desc: 'Répertoire complet des banques vocales UTAU et DiffSinger AI hébergées sur le Google Drive officiel.',
      vb_drive_banner_btn: 'Ouvrir le Drive Principal →',
      vb_filter_all: 'Tous (54)',
      vb_card_profile: '👤 Fiche & Profil',
      vb_card_private: '🔒 BANQUE PRIVÉE',
      profile_return: '← Retour aux Banques Vocales',
      profile_return_sub: '/ Catalogue Complet',
      profile_official: 'Officiel DELTA',
      profile_age: 'Âge',
      profile_gender: 'Genre',
      profile_voicer: 'Donneur de Voix',
      profile_genre: 'Genre Musical',
      profile_engine: 'Moteur',
      profile_language: 'Langue',
      profile_bio_title: 'Biographie & Histoire',
      profile_audio_title: 'Échantillon Audio',
      profile_audio_demo: 'Aperçu Démo :',
      profile_status_title: 'Statut de la Banque Vocale · STATUT',
      profile_private_title: 'Statut : <span style="color: #ff4422;">Banque Vocale Privée (Private)</span>',
      profile_private_desc: 'La banque vocale de ce personnage est privée, réservée exclusivement aux productions internes de DELTA SYNTH et aux projets spéciaux.',
      profile_private_badge: '🔒 ACCÈS PRIVÉ UNIQUEMENT · Exclusivité Studio',
      profile_download_title: 'Banques Vocales Téléchargeables',
      profile_btn_download: '⚡ Télécharger',
      footer_desc: 'Studio thaïlandais de synthèse vocale fondé en 2019. Création de banques UTAU et DiffSinger AI avec partage gratuit pour les créateurs.',
      footer_sitemap: 'Plan du Site',
      footer_contact: 'Contact & Communauté',
      footer_drive: 'Google Drive Banques Vocales',
      footer_rights: '© Depuis 2019 — DELTA SYNTH Studio. Tous droits réservés.',
      footer_made_by: 'Made And Checked By DELTA SYNTH & All Code Agentic AI Engine'
    },
    es: {
      "nav_new_works": "Nuevas Obras",
      "nw_eyebrow": "NUEVAS OBRAS · HERRAMIENTAS IA DE DELTA SYNTH",
      "nw_title": "Últimas innovaciones del laboratorio DELTA SYNTH",
      "nw_desc": "Herramientas de IA desarrolladas internamente para potenciar la creación vocal virtual — integrando RVC tailandés con preservación tonal y un agente de IA de escritorio local seguro.",
      "nw_rvc_badge": "NUEVO · EN DESARROLLO ACTIVO",
      "nw_rvc_sub": "Sistema Thai RVC con preservación tonal · Conversión de voz tonal tailandesa auténtica",
      "nw_rvc_desc": "WebUI de conversión de voz basada en recuperación (RVC), diseñada para preservar los 5 tonos tailandeses con RMVPE F0 y ContentVec/HuBERT (precisión tonal ≥ 95%, MOS ≥ 4.0, RTF ≤ 0.3) con soporte bilingüe.",
      "nw_rvc_li1": "Pipeline todo en uno: Conversión vocal (Inferencia), gestión de datasets, entrenamiento de modelos, creación de índice FAISS y separación UVR5.",
      "nw_rvc_li2": "Aceleración multihardware: NVIDIA CUDA, AMD / Intel (DirectML) y CPU. Ejecución vía Program.py (puerto 9378) o go-web.bat (puerto 7897).",
      "nw_rvc_li3": "Modo voz en vivo de baja latencia y DAW: Soporta realtime_gui.py para cambio de voz en tiempo real y RVCRealtimeVST para DAWs.",
      "nw_rvc_li4": "Ejecución por lotes segura: Aislamiento por subprocesos para evitar fugas de VRAM, clear_vram_safe() y autorreparación de dependencias.",
      "nw_rvc_btn_gh": "Código Fuente en GitHub",
      "nw_rvc_btn_contact": "Unirse a las pruebas",
      "nw_dark_badge": "NUEVO · EN DESARROLLO ACTIVO",
      "nw_dark_sub": "Escritorio de IA agéntica local · Creado por DELTA SYNTH",
      "nw_dark_desc": "Aplicación de escritorio Windows que orquesta agentes de IA autónomos ejecutados localmente con Ollama — sin API keys externas, entorno aislado seguro.",
      "nw_dark_li1": "Interfaz moderna Avalonia / .NET: Selección de modelos, streaming en vivo de razonamiento y estado vía NDJSON con cancelación inmediata.",
      "nw_dark_li2": "Herramientas de archivo seguras: read_file, write_file y list_directory con prevención de path traversal y escrituras atómicas.",
      "nw_dark_li3": "Seguridad de circuito cerrado: Backend y Gateway vinculados únicamente a 127.0.0.1 con control de concurrencia y límites de sesión.",
      "nw_dark_li4": "Supervisor y control del ciclo de vida: Comprobaciones automáticas del estado de procesos con scripts listos para setup, start, stop y verify.",
      "nw_dark_btn_gh": "Seguir en GitHub",
      "nw_dark_btn_contact": "Unirse a las pruebas",
      nav_main: 'Inicio',
      nav_about: 'Sobre Nosotros',
      nav_voicebank: 'Bancos de Voz',
      nav_files: 'USTX / MIDI / SVP / VSQX',
      nav_collab: 'Colaboraciones',
      nav_events: 'Eventos',
      nav_toggle_open: 'Abrir menú',
      nav_toggle_close: 'Cerrar menú',
      hero_eyebrow: 'Estudio Tailandés de Síntesis Vocal — Desde 2019',
      hero_title: 'Voces de Canto Virtuales<br>Nacidas de la <span class="accent">Pasión Tailandesa</span>',
      hero_desc: 'DELTA SYNTH es un estudio tailandés de síntesis vocal (UTAU / DiffSinger AI) que produce más de 54 cantantes virtuales con 167+ paquetes de voz descargables, soporte multilingüe y recursos musicales gratuitos.',
      hero_btn_drive: 'Descargar Bancos de Voz (Google Drive)',
      hero_btn_explore: 'Explorar Todos los Bancos de Voz',
      hero_btn_about: 'Conoce Nuestro Estudio',
      stat_singers: 'Cantantes Virtuales en Catálogo',
      stat_packages: 'Paquetes de Voz Descargables',
      stat_projects: 'Proyectos Musicales y Archivos',
      stat_studios: 'Estudios y Socios Creativos',
      vb_hero_crumb: 'DELTA SYNTH / Bancos de Voz',
      vb_hero_title: 'Catálogo Completo de Bancos de Voz<br>de DELTA SYNTH',
      vb_hero_desc: 'Repositorio de 54 personajes virtuales listos para OpenUtau y DiffSinger AI, con perfiles completos, muestras de audio y descargas directas.',
      vb_drive_banner_title: '📂 Repositorio Oficial en Google Drive de Bancos de Voz DELTA SYNTH',
      vb_drive_banner_desc: 'Catálogo completo de bancos de voz UTAU y DiffSinger AI alojados en el Google Drive oficial.',
      vb_drive_banner_btn: 'Abrir Drive Principal →',
      vb_filter_all: 'Todos (54)',
      vb_card_profile: '👤 Perfil y Ficha',
      vb_card_private: '🔒 BANCO PRIVADO',
      profile_return: '← Volver a Todos los Bancos de Voz',
      profile_return_sub: '/ Catálogo Completo',
      profile_official: 'Oficial DELTA',
      profile_age: 'Edad',
      profile_gender: 'Género',
      profile_voicer: 'Actor de Voz',
      profile_genre: 'Género Musical',
      profile_engine: 'Motor',
      profile_language: 'Idioma',
      profile_bio_title: 'Biografía e Historia',
      profile_audio_title: 'Muestra de Audio',
      profile_audio_demo: 'Muestra de audio:',
      profile_status_title: 'Estado del Banco de Voz · ESTADO',
      profile_private_title: 'Estado: <span style="color: #ff4422;">Banco de Voz Privado</span>',
      profile_private_desc: 'El banco de voz de este personaje es privado y reservado exclusivamente para producciones de DELTA SYNTH y colaboraciones especiales.',
      profile_private_badge: '🔒 SOLO ACCESO PRIVADO · Exclusivo de Estudio',
      profile_download_title: 'Bancos de Voz Disponibles para Descargar',
      profile_btn_download: '⚡ Descargar',
      footer_desc: 'Estudio tailandés de síntesis vocal fundado en 2019. Creación de bancos de voz UTAU y DiffSinger AI con distribución gratuita para creadores de todo el mundo.',
      footer_sitemap: 'Mapa del Sitio',
      footer_contact: 'Contacto y Comunidad',
      footer_drive: 'Centro Google Drive de Bancos de Voz',
      footer_rights: '© Desde 2019 — DELTA SYNTH Studio. Todos los derechos reservados.',
      footer_made_by: 'Made And Checked By DELTA SYNTH & All Code Agentic AI Engine'
    },
    'es-cl': {
      "nav_new_works": "Nuevas Obras",
      "nw_eyebrow": "NUEVAS OBRAS · HERRAMIENTAS IA DE DELTA SYNTH",
      "nw_title": "Últimas innovaciones del laboratorio DELTA SYNTH",
      "nw_desc": "Herramientas de IA desarrolladas internamente para potenciar la creación vocal virtual — integrando RVC tailandés con preservación tonal y un agente de IA de escritorio local seguro.",
      "nw_rvc_badge": "NUEVO · EN DESARROLLO ACTIVO",
      "nw_rvc_sub": "Sistema Thai RVC con preservación tonal · Conversión de voz tonal tailandesa auténtica",
      "nw_rvc_desc": "WebUI de conversión de voz basada en recuperación (RVC), diseñada para preservar los 5 tonos tailandeses con RMVPE F0 y ContentVec/HuBERT (precisión tonal ≥ 95%, MOS ≥ 4.0, RTF ≤ 0.3) con soporte bilingüe.",
      "nw_rvc_li1": "Pipeline todo en uno: Conversión vocal (Inferencia), gestión de datasets, entrenamiento de modelos, creación de índice FAISS y separación UVR5.",
      "nw_rvc_li2": "Aceleración multihardware: NVIDIA CUDA, AMD / Intel (DirectML) y CPU. Ejecución vía Program.py (puerto 9378) o go-web.bat (puerto 7897).",
      "nw_rvc_li3": "Modo voz en vivo de baja latencia y DAW: Soporta realtime_gui.py para cambio de voz en tiempo real y RVCRealtimeVST para DAWs.",
      "nw_rvc_li4": "Ejecución por lotes segura: Aislamiento por subprocesos para evitar fugas de VRAM, clear_vram_safe() y autorreparación de dependencias.",
      "nw_rvc_btn_gh": "Código Fuente en GitHub",
      "nw_rvc_btn_contact": "Unirse a las pruebas",
      "nw_dark_badge": "NUEVO · EN DESARROLLO ACTIVO",
      "nw_dark_sub": "Escritorio de IA agéntica local · Creado por DELTA SYNTH",
      "nw_dark_desc": "Aplicación de escritorio Windows que orquesta agentes de IA autónomos ejecutados localmente con Ollama — sin API keys externas, entorno aislado seguro.",
      "nw_dark_li1": "Interfaz moderna Avalonia / .NET: Selección de modelos, streaming en vivo de razonamiento y estado vía NDJSON con cancelación inmediata.",
      "nw_dark_li2": "Herramientas de archivo seguras: read_file, write_file y list_directory con prevención de path traversal y escrituras atómicas.",
      "nw_dark_li3": "Seguridad de circuito cerrado: Backend y Gateway vinculados únicamente a 127.0.0.1 con control de concurrencia y límites de sesión.",
      "nw_dark_li4": "Supervisor y control del ciclo de vida: Comprobaciones automáticas del estado de procesos con scripts listos para setup, start, stop y verify.",
      "nw_dark_btn_gh": "Seguir en GitHub",
      "nw_dark_btn_contact": "Unirse a las pruebas",
      nav_main: 'Inicio',
      nav_about: 'Sobre Nosotros',
      nav_voicebank: 'Bancos de Voz',
      nav_files: 'USTX / MIDI / SVP / VSQX',
      nav_collab: 'Colaboraciones',
      nav_events: 'Eventos y Noticias',
      nav_toggle_open: 'Abrir menú de navegación',
      nav_toggle_close: 'Cerrar menú de navegación',
      hero_eyebrow: 'Estudio de Síntesis Vocal Tailandés — Desde 2019',
      hero_title: 'Voces Virtuales<br>Creadas con <span class="accent">Pasión Tailandesa</span>',
      hero_desc: 'DELTA SYNTH es un estudio de síntesis vocal (UTAU / DiffSinger AI) con más de 54 cantantes virtuales y 167 paquetes de voz listos para descargar gratis, compatibles con varios idiomas y pensados para toda la comunidad.',
      hero_btn_drive: 'Descargar Bancos de Voz (Google Drive)',
      hero_btn_explore: 'Explorar el Catálogo Completo',
      hero_btn_about: 'Conoce Nuestro Estudio',
      stat_singers: 'Cantantes Virtuales en el Roster',
      stat_packages: 'Paquetes de Voz Disponibles',
      stat_projects: 'Proyectos Musicales y Canciones',
      stat_studios: 'Estudios y Colaboradores',
      vb_hero_crumb: 'DELTA SYNTH / Bancos de Voz',
      vb_hero_title: 'Catálogo Oficial de Bancos de Voz<br>de DELTA SYNTH',
      vb_hero_desc: 'Catálogo de 54 personajes virtuales preparados para OpenUtau y DiffSinger AI con fichas detalladas, muestras de voz y descargas directas.',
      vb_drive_banner_title: '📂 Repositorio Oficial en Google Drive — DELTA SYNTH',
      vb_drive_banner_desc: 'Catálogo maestro de bancos de voz UTAU y DiffSinger AI en Google Drive oficial.',
      vb_drive_banner_btn: 'Ir al Drive Maestro →',
      vb_filter_all: 'Todos (54)',
      vb_card_profile: '👤 Ficha de Personaje',
      vb_card_private: '🔒 BANCO PRIVADO (EXCLUSIVO)',
      profile_return: '← Volver a los Bancos de Voz',
      profile_return_sub: '/ Catálogo de Personajes',
      profile_official: 'Oficial DELTA',
      profile_age: 'Edad',
      profile_gender: 'Género',
      profile_voicer: 'Proveedor de Voz',
      profile_genre: 'Estilo Musical',
      profile_engine: 'Motor de Síntesis',
      profile_language: 'Idioma',
      profile_bio_title: 'Biografía y Reseña',
      profile_audio_title: 'Muestra de Audio',
      profile_audio_demo: 'Muestra de prueba:',
      profile_status_title: 'Estado del Banco de Voz · ESTADO',
      profile_private_title: 'Estado: <span style="color: #ff4422;">Banco de Voz Privado (Uso Exclusivo)</span>',
      profile_private_desc: 'El banco de voz de este personaje es privado y de uso exclusivo para las producciones de DELTA SYNTH y proyectos especiales.',
      profile_private_badge: '🔒 ACCESO PRIVADO · Exclusivo de DELTA SYNTH',
      profile_download_title: 'Bancos de Voz Listos para Descargar',
      profile_btn_download: '⚡ Descargar',
      footer_desc: 'Estudio tailandés de síntesis vocal creado el año 2019. Bancos de voz UTAU y DiffSinger AI compartidos gratuitamente para creadores.',
      footer_sitemap: 'Mapa del Sitio',
      footer_contact: 'Contacto y Comunidad',
      footer_drive: 'Google Drive de Bancos de Voz',
      footer_rights: '© Desde 2019 — DELTA SYNTH Studio. Todos los derechos reservados.',
      footer_made_by: 'Made And Checked By DELTA SYNTH & All Code Agentic AI Engine'
    },
    zh: {
      "nav_new_works": "最新作品",
      "nw_eyebrow": "最新作品 · DELTA SYNTH 出品 AI 工具",
      "nw_title": "DELTA SYNTH 研发实验室最新成果",
      "nw_desc": "团队自主研发的 AI 创作工具，赋能新一代虚拟歌手制作 —— 包含支持泰语音调保留的 Thai RVC Web 界面与本地化安全 AI Agent 桌面系统。",
      "nw_rvc_badge": "最新作品 · 持续开发中",
      "nw_rvc_sub": "声调保留泰语 RVC 系统 · 原汁原味的泰语音调语音转换",
      "nw_rvc_desc": "基于检索的语音转换（RVC）WebUI，针对泰语 5 个完整声调深度重构，结合 RMVPE 音高校准与 Thai ContentVec/HuBERT 特征提取（声调准确率 ≥ 95%, MOS ≥ 4.0, RTF ≤ 0.3），内建泰英双语指引。",
      "nw_rvc_li1": "一体化全流程：实时推理转换、数据集预处理、模型微调训练、FAISS 特征索引构建与 UVR5 人声伴奏分离。",
      "nw_rvc_li2": "多硬件无缝支持：支持 NVIDIA CUDA、AMD / Intel (DirectML) 与 CPU。可通过 Program.py (端口 9378) 或 go-web.bat (端口 7897) 启动。",
      "nw_rvc_li3": "超低延迟实时变声与 DAW 插件：集成 realtime_gui.py 实时变声界面与 RVCRealtimeVST 宿主音频插件。",
      "nw_rvc_li4": "安全批处理机制：隔离子进程彻底杜绝 VRAM 显存泄漏，配备 clear_vram_safe() 清理与依赖项自动修复。",
      "nw_rvc_btn_gh": "访问 GitHub 源码仓库",
      "nw_rvc_btn_contact": "申请参与测试",
      "nw_dark_badge": "最新作品 · 持续开发中",
      "nw_dark_sub": "本地自主 AI Agent 桌面系统 · DELTA SYNTH 原创研发",
      "nw_dark_desc": "基于 Ollama 的 100% 本地 Windows AI 桌面助手 —— 无需任何外部 API Key，文件操作严格沙箱隔离于指定工作区。",
      "nw_dark_li1": "现代化 Avalonia / .NET 界面：自由切换本地模型，通过 NDJSON 流式呈现 Agent 思考链与执行状态，支持一键即时中断。",
      "nw_dark_li2": "高防安全文件工具：read_file、write_file、list_directory 严密防范路径穿越 (Path Traversal)，支持原子写入与体积上限限制。",
      "nw_dark_li3": "封闭式回环安全：后端服务与网关严格仅绑定 127.0.0.1 本地回环地址，具备并发排队控制与最大并发会话限制。",
      "nw_dark_li4": "守护进程与生命周期控制：内置进程健康心跳监测，提供 setup、start、stop、verify 一键式脚本全套工具。",
      "nw_dark_btn_gh": "在 GitHub 关注项目",
      "nw_dark_btn_contact": "申请参与测试",
      nav_main: '首页',
      nav_about: '关于我们',
      nav_voicebank: '全部音源库',
      nav_files: 'USTX / MIDI / SVP / VSQX',
      nav_collab: '合作企划',
      nav_events: '活动资讯',
      nav_toggle_open: '打开导航菜单',
      nav_toggle_close: '关闭导航菜单',
      hero_eyebrow: '泰国虚拟歌声合成工作室 — 始于 2019 年',
      hero_title: '源自泰国匠心的<br><span class="accent">虚拟歌声</span>',
      hero_desc: 'DELTA SYNTH 是泰国的虚拟歌声合成工作室（UTAU / DiffSinger AI），制作并管理 54+ 位虚拟歌手，拥有 167+ 个免费音源包，支持多语言合成与乐曲工程文件免费共享。',
      hero_btn_drive: '下载音源库 (Google Drive)',
      hero_btn_explore: '浏览所有音源库',
      hero_btn_about: '了解我们的工作室',
      stat_singers: '旗下虚拟歌手',
      stat_packages: '可下载音源包',
      stat_projects: '音乐工程与作品',
      stat_studios: '合作工作室与伙伴',
      vb_hero_crumb: 'DELTA SYNTH / 全部音源库',
      vb_hero_title: 'DELTA SYNTH<br>全部虚拟音源库',
      vb_hero_desc: '收录 54 位虚拟角色音源，全面支持 OpenUtau 与 DiffSinger AI，包含完整角色档案、试听音频及高速下载链接。',
      vb_drive_banner_title: '📂 DELTA SYNTH 官方 Google Drive 音源库总中心',
      vb_drive_banner_desc: '官方 Google Drive 提供完整的 UTAU 与 DiffSinger AI 音源库下载服务。',
      vb_drive_banner_btn: '进入总仓库 (Open Master Drive) →',
      vb_filter_all: '全部 (54)',
      vb_card_profile: '👤 角色档案 / Profile',
      vb_card_private: '🔒 非公开音源 (PRIVATE)',
      profile_return: '← 返回音源库总览',
      profile_return_sub: '/ 全部角色列表',
      profile_official: '官方 DELTA',
      profile_age: '年龄',
      profile_gender: '性别',
      profile_voicer: '音源提供者',
      profile_genre: '擅长曲风',
      profile_engine: '引擎',
      profile_language: '支持语言',
      profile_bio_title: '角色履历与生平',
      profile_audio_title: '试听音频',
      profile_audio_demo: '试听样例：',
      profile_status_title: '音源状态 · VOICEBANK STATUS',
      profile_private_title: '音源状态：<span style="color: #ff4422;">非公开 (Private Voicebank)</span>',
      profile_private_desc: '该角色的音源库为内部非公开音源，仅限 DELTA SYNTH 工作室内部及特别企划使用，暂不提供公开下载。',
      profile_private_badge: '🔒 仅限内部访问 · 工作室专属',
      profile_download_title: '可下载音源包',
      profile_btn_download: '⚡ 立即下载',
      footer_desc: '泰国虚拟歌声合成工作室，创立于 2019 年。专注打造 UTAU 与 DiffSinger AI 音源库，致力于为全球创作者提供优质的免费音乐资源。',
      footer_sitemap: '网站导航',
      footer_contact: '联系我们与社群',
      footer_drive: 'Google Drive 音源库中心',
      footer_rights: '© 始于 2019 — DELTA SYNTH Studio 保留所有权利。',
      footer_made_by: 'Made And Checked By DELTA SYNTH & All Code Agentic AI Engine'
    },
    ja: {
      "nav_new_works": "最新の作品",
      "nw_eyebrow": "最新作品 · DELTA SYNTH 開発 AI ツール",
      "nw_title": "DELTA SYNTH 開発ラボの最新成果",
      "nw_desc": "仮想ボーカル制作を支援する自社開発のAIツール群 — タイ語声調を忠実に再現する Thai RVC WebUI と、完全ローカル稼働の安全な AI Agent デスクトップ環境。",
      "nw_rvc_badge": "新作品 · 開発進行中",
      "nw_rvc_sub": "声調維持型タイ語 RVC システム · 本格タイ語声調音声変換",
      "nw_rvc_desc": "5種類のタイ語声調を忠実に保持するよう再設計された RVC WebUI。RMVPE F0 ピッチ抽出と Thai ContentVec/HuBERT により高精度（声調精度 ≥ 95%, MOS ≥ 4.0, RTF ≤ 0.3）を実現、タイ語・英語のバイリンガル対応。",
      "nw_rvc_li1": "オールインワン設計：音声変換（推論）、データセット管理、モデル学習、FAISS インデックス生成、UVR5 ボーカル/伴奏分離。",
      "nw_rvc_li2": "マルチハードウェア対応：NVIDIA CUDA、AMD / Intel (DirectML)、CPU に対応。Program.py (ポート 9378) または go-web.bat (ポート 7897) で起動。",
      "nw_rvc_li3": "低遅延リアルタイム変換＆DAW連携：realtime_gui.py による生放送ボイスチェンジャーと RVCRealtimeVST による DAW プラグインに対応。",
      "nw_rvc_li4": "安全なバッチ処理：サブプロセス分離により VRAM リークを防止、clear_vram_safe() と依存関係の自動修復機能を搭載。",
      "nw_rvc_btn_gh": "GitHub ソースコードを見る",
      "nw_rvc_btn_contact": "テスト参加・お問い合わせ",
      "nw_dark_badge": "新作品 · 開発進行中",
      "nw_dark_sub": "完全ローカル自律型 AI Agent デスクトップ · DELTA SYNTH 開発",
      "nw_dark_desc": "Ollama による 100% ローカル完結型 Windows AI デスクトップアプリ。外部 API キー不要、指定ワークスペース内のみに厳格サンドボックス制限。",
      "nw_dark_li1": "モダンな Avalonia / .NET UI：モデル選択、思考プロセスとツール実行状態の NDJSON ライブストリーミング、即時キャンセル対応。",
      "nw_dark_li2": "セキュアなファイル操作ツール：read_file、write_file、list_directory によるパストラバーサル防止、アトミック書き込み、ファイルサイズ制限。",
      "nw_dark_li3": "クローズドループセキュリティ：バックエンドとゲートウェイを 127.0.0.1 に限定バインド、並行実行制御とセッション上限管理。",
      "nw_dark_li4": "スーパーバイザー＆プロセス管理：自動ヘルスチェック、setup、start、stop、verify の運用スクリプトを完備。",
      "nw_dark_btn_gh": "GitHub をチェック",
      "nw_dark_btn_contact": "テスト参加・お問い合わせ",
      nav_main: 'メイン',
      nav_about: '私たちについて',
      nav_voicebank: '音源ライブラリ',
      nav_files: 'USTX / MIDI / SVP / VSQX',
      nav_collab: 'コラボ企画',
      nav_events: 'イベント',
      nav_toggle_open: 'メニューを開く',
      nav_toggle_close: 'メニューを閉じる',
      hero_eyebrow: 'タイ発 歌声合成スタジオ — Since 2019',
      hero_title: 'タイの情熱から生まれた<br><span class="accent">バーチャルシンガー</span>',
      hero_desc: 'DELTA SYNTH はタイ発の歌声合成スタジオ（UTAU / DiffSinger AI）です。54名以上のバーチャル歌手と167以上の音源パッケージを展開し、多言語対応の音源や楽曲ファイルを全クリエイターに無料配布しています。',
      hero_btn_drive: '音源をダウンロード (Google Drive)',
      hero_btn_explore: 'すべての音源を見る',
      hero_btn_about: 'スタジオについて',
      stat_singers: '所属バーチャル歌手',
      stat_packages: '配布中の音源パッケージ',
      stat_projects: '楽曲プロジェクト・ファイル',
      stat_studios: '提携スタジオ・クリエイター',
      vb_hero_crumb: 'DELTA SYNTH / 音源ライブラリ',
      vb_hero_title: 'DELTA SYNTH<br>全バーチャル音源一覧',
      vb_hero_desc: '全54キャラクターの音源リポジトリ。OpenUtau および DiffSinger AI に完全対応し、プロフィール、試聴デモ、直接ダウンロードリンクを完備。',
      vb_drive_banner_title: '📂 DELTA SYNTH 公式 Google Drive 音源ライブラリ',
      vb_drive_banner_desc: 'UTAU および DiffSinger AI の全音源を公式 Google Drive にて公開・配布中。',
      vb_drive_banner_btn: 'メインドライブを開く →',
      vb_filter_all: 'すべて (54)',
      vb_card_profile: '👤 プロフィール詳細',
      vb_card_private: '🔒 非公開音源 (PRIVATE)',
      profile_return: '← 音源一覧へ戻る',
      profile_return_sub: '/ キャラクター一覧',
      profile_official: '公式 DELTA',
      profile_age: '年齢',
      profile_gender: '性別',
      profile_voicer: '音声提供 / 中の人',
      profile_genre: 'ジャンル',
      profile_engine: 'エンジン',
      profile_language: '対応言語',
      profile_bio_title: 'キャラクタープロフィール・経歴',
      profile_audio_title: '音声サンプル試聴',
      profile_audio_demo: 'デモ試聴：',
      profile_status_title: '音源ステータス · VOICEBANK STATUS',
      profile_private_title: 'ステータス：<span style="color: #ff4422;">非公開 (Private Voicebank)</span>',
      profile_private_desc: '本キャラクターの音源は DELTA SYNTH スタジオ内部制作および特別企画専用の非公開音源（Private）であり、一般公開・配布は行っておりません。',
      profile_private_badge: '🔒 非公開音源 · スタジオ専用アクセス',
      profile_download_title: 'ダウンロード可能音源一覧',
      profile_btn_download: '⚡ ダウンロード',
      footer_desc: '2019年に設立されたタイの歌声合成スタジオ。UTAU および DiffSinger AI 音源を制作し、世界中のクリエイターに無償配布を行っています。',
      footer_sitemap: 'サイトマップ',
      footer_contact: 'お問い合わせ・コミュニティ',
      footer_drive: 'Google Drive 音源ハブ',
      footer_rights: '© Since 2019 — DELTA SYNTH Studio. 無断転載を禁じます。',
      footer_made_by: 'Made And Checked By DELTA SYNTH & All Code Agentic AI Engine'
    },
    ru: {
      "nav_new_works": "Новые Работы",
      "nw_eyebrow": "НОВЫЕ РАБОТЫ · AI-ИНСТРУМЕНТЫ ОТ DELTA SYNTH",
      "nw_title": "Новейшие разработки лаборатории DELTA SYNTH",
      "nw_desc": "Собственные AI-инструменты для синтеза вокала нового поколения — система Thai RVC с сохранением тонов тайского языка и безопасный локальный AI-агент для ПК.",
      "nw_rvc_badge": "НОВАЯ РАБОТА · АКТИВНАЯ РАЗРАБОТКА",
      "nw_rvc_sub": "Система Thai RVC с сохранением тонов · Аутентичная конвертация тайских тонов",
      "nw_rvc_desc": "WebUI конвертации голоса на основе RVC, оптимизированный для сохранения всех 5 тонов тайского языка с использованием RMVPE F0 и ContentVec/HuBERT (точность тонов ≥ 95%, MOS ≥ 4.0, RTF ≤ 0.3) с двуязычной документацией.",
      "nw_rvc_li1": "Полный цикл в одном интерфейсе: Инференс, обработка датасетов, обучение моделей, индексация FAISS и разделение вокала с UVR5.",
      "nw_rvc_li2": "Широкая аппаратная поддержка: NVIDIA CUDA, AMD / Intel (DirectML) и CPU. Запуск через Program.py (порт 9378) или go-web.bat (порт 7897).",
      "nw_rvc_li3": "Режим реального времени и плагин для DAW: realtime_gui.py с минимальной задержкой и плагин RVCRealtimeVST для музыкальных редакторов.",
      "nw_rvc_li4": "Безопасная пакетная обработка: Изоляция подпроцессов предотвращает утечки VRAM, функция clear_vram_safe() и автовосстановление библиотек.",
      "nw_rvc_btn_gh": "Исходный код на GitHub",
      "nw_rvc_btn_contact": "Присоединиться к тесту",
      "nw_dark_badge": "НОВАЯ РАБОТА · АКТИВНАЯ РАЗРАБОТКА",
      "nw_dark_sub": "Локальный автономный AI-агент для ПК · От DELTA SYNTH",
      "nw_dark_desc": "Десктопное приложение для Windows для управления локальными AI-агентами через Ollama на 100% — без внешних API-ключей, с изоляцией в песочнице.",
      "nw_dark_li1": "Современный интерфейс Avalonia / .NET: Выбор моделей, потоковое отображение мыслей и статуса агента через NDJSON с мгновенной отменой.",
      "nw_dark_li2": "Защищенные файловые инструменты: read_file, write_file, list_directory с защитой от выхода за пределы каталога и атомарной записью.",
      "nw_dark_li3": "Замкнутый контур безопасности: Бэкенд и шлюз привязаны исключительно к 127.0.0.1, контроль параллелизма и ограничение сессий.",
      "nw_dark_li4": "Супервизор и управление процессами: Автопроверка работоспособности, готовые скрипты setup, start, stop и verify.",
      "nw_dark_btn_gh": "Следить на GitHub",
      "nw_dark_btn_contact": "Присоединиться к тесту",
      nav_main: 'Главная',
      nav_about: 'О нас',
      nav_voicebank: 'Голосовые банки',
      nav_files: 'USTX / MIDI / SVP / VSQX',
      nav_collab: 'Коллаборации',
      nav_events: 'События',
      nav_toggle_open: 'Открыть меню',
      nav_toggle_close: 'Закрыть меню',
      hero_eyebrow: 'Тайская студия вокального синтеза — с 2019 года',
      hero_title: 'Виртуальные вокальные голоса,<br>рожденные <span class="accent">тайской страстью</span>',
      hero_desc: 'DELTA SYNTH — тайская студия синтеза вокала (UTAU / DiffSinger AI), развивающая более 54 виртуальных певцов и 167+ голосовых банков с поддержкой множества языков и бесплатным доступом для всех музыкантов.',
      hero_btn_drive: 'Скачать голосовые банки (Google Drive)',
      hero_btn_explore: 'Все голосовые банки',
      hero_btn_about: 'О нашей студии',
      stat_singers: 'Виртуальных вокалистов в каталоге',
      stat_packages: 'Голосовых банков для скачивания',
      stat_projects: 'Музыкальных проектов и файлов',
      stat_studios: 'Студий и партнеров',
      vb_hero_crumb: 'DELTA SYNTH / Голосовые банки',
      vb_hero_title: 'Полный каталог голосовых банков<br>DELTA SYNTH',
      vb_hero_desc: 'Каталог из 54 виртуальных персонажей для OpenUtau и DiffSinger AI с подробными анкетами, аудиодемо и прямыми ссылками на скачивание.',
      vb_drive_banner_title: '📂 Официальный репозиторий Google Drive DELTA SYNTH',
      vb_drive_banner_desc: 'Полный каталог голосовых банков UTAU и DiffSinger AI на официальном Google Drive.',
      vb_drive_banner_btn: 'Открыть основной диск →',
      vb_filter_all: 'Все (54)',
      vb_card_profile: '👤 Профиль и данные',
      vb_card_private: '🔒 ПРИВАТНЫЙ БАНК',
      profile_return: '← Вернуться ко всем голосовым банкам',
      profile_return_sub: '/ Каталог персонажей',
      profile_official: 'Официальный DELTA',
      profile_age: 'Возраст',
      profile_gender: 'Пол',
      profile_voicer: 'Голосовой донор',
      profile_genre: 'Музыкальный жанр',
      profile_engine: 'Движок',
      profile_language: 'Язык',
      profile_bio_title: 'Биография и описание',
      profile_audio_title: 'Аудиодемо',
      profile_audio_demo: 'Прослушать демо:',
      profile_status_title: 'Статус голосового банка · СТАТУС',
      profile_private_title: 'Статус: <span style="color: #ff4422;">Приватный голосовой банк</span>',
      profile_private_desc: 'Голосовой банк этого персонажа является приватным и предназначен исключительно для внутренних проектов DELTA SYNTH. Публичное скачивание недоступно.',
      profile_private_badge: '🔒 ТОЛЬКО ДЛЯ ВНУТРЕННЕГО ДОСТУПА · Эксклюзив студии',
      profile_download_title: 'Доступные голосовые банки',
      profile_btn_download: '⚡ Скачать',
      footer_desc: 'Тайская студия вокального синтеза, основанная в 2019 году. Разработка банков UTAU и DiffSinger AI с бесплатным распространением для создателей контента.',
      footer_sitemap: 'Карта сайта',
      footer_contact: 'Контакты и сообщество',
      footer_drive: 'Центр голосовых банков Google Drive',
      footer_rights: '© С 2019 года — DELTA SYNTH Studio. Все права защищены.',
      footer_made_by: 'Made And Checked By DELTA SYNTH & All Code Agentic AI Engine'
    },
    ko: {
      "nav_new_works": "새로운 작품",
      "nw_eyebrow": "새로운 작품 · DELTA SYNTH의 AI 툴",
      "nw_title": "DELTA SYNTH 연구실의 최신 혁신 성과",
      "nw_desc": "차세대 가상 보컬 제작을 지원하는 자체 개발 AI 툴킷 — 태국어 5성조를 완벽히 보존하는 Thai RVC WebUI와 안전한 로컬 AI 에이전트 데스크톱 앱.",
      "nw_rvc_badge": "새로운 작품 · 활발한 개발 중",
      "nw_rvc_sub": "성조 보존형 태국어 RVC 시스템 · 정통 태국어 성조 음성 변환",
      "nw_rvc_desc": "RMVPE F0 윤곽선과 Thai ContentVec/HuBERT를 통해 5개 태국어 성조를 완벽히 보존하도록 설계된 RVC WebUI (성조 정확도 ≥ 95%, MOS ≥ 4.0, RTF ≤ 0.3), 태국어/영어 듀얼 가이드 제공.",
      "nw_rvc_li1": "올인원 파이프라인: 음성 변환(추론), 데이터셋 관리, 모델 훈련, FAISS 인덱스 생성 및 UVR5 보컬/반주 분리.",
      "nw_rvc_li2": "다양한 하드웨어 가속 지원: NVIDIA CUDA, AMD / Intel (DirectML), CPU 대응. Program.py (포트 9378) 또는 go-web.bat (포트 7897)로 실행.",
      "nw_rvc_li3": "초저지연 실시간 변환 및 DAW 플러그인: realtime_gui.py 실시간 음성 변조 및 작곡 프로그램을 위한 RVCRealtimeVST 지원.",
      "nw_rvc_li4": "안전한 배치 처리 아키텍처: 서브프로세스 격리로 VRAM 누수 차단, clear_vram_safe() 메모리 반환 및 종속성 자동 복구 탑재.",
      "nw_rvc_btn_gh": "GitHub 소스코드 확인",
      "nw_rvc_btn_contact": "베타 테스터 신청",
      "nw_dark_badge": "새로운 작품 · 활발한 개발 중",
      "nw_dark_sub": "로컬 오토노머스 AI 에이전트 데스크톱 · DELTA SYNTH 제작",
      "nw_dark_desc": "Ollama를 통해 100% 로컬 환경에서 실행되는 윈도우 AI 에이전트 데스크톱 앱 — 외부 API 키 불필요, 지정된 워크스페이스 내 완전 샌드박스 격리.",
      "nw_dark_li1": "모던 Avalonia / .NET UI: 모델 선택, NDJSON 기반의 실시간 사고 과정 및 실행 상태 스트리밍, 즉각적인 작업 취소 지원.",
      "nw_dark_li2": "철저한 파일 보안 도구: 경로 탐색 공격(Path Traversal) 방지, 원자적(Atomic) 쓰기 및 파일 용량 제한이 적용된 파일 시스템 도구.",
      "nw_dark_li3": "폐쇄형 로컬 보안망: 백엔드 및 게이트웨이를 오직 127.0.0.1로 바인딩하여 외부 노출 차단, 동시성 제어 및 세션 제한.",
      "nw_dark_li4": "슈퍼바이저 및 수명 주기 관리: 자동 프로세스 헬스체크와 완벽한 setup, start, stop, verify 운영 스크립트 제공.",
      "nw_dark_btn_gh": "GitHub에서 팔로우",
      "nw_dark_btn_contact": "베타 테스터 신청",
      nav_main: '메인',
      nav_about: '소개',
      nav_voicebank: '음원 라이브러리',
      nav_files: 'USTX / MIDI / SVP / VSQX',
      nav_collab: '콜라보레이션',
      nav_events: '이벤트',
      nav_toggle_open: '내비게이션 메뉴 열기',
      nav_toggle_close: '내비게이션 메뉴 닫기',
      hero_eyebrow: '태국 가상 음원 합성 스튜디오 — Since 2019',
      hero_title: '태국의 열정으로 탄생한<br><span class="accent">가상 보컬</span>',
      hero_desc: 'DELTA SYNTH는 태국의 가상 음원 합성 스튜디오(UTAU / DiffSinger AI)로, 54명 이상의 가상 가수와 167개 이상의 음원 패키지를 개발 및 서비스하며 전 세계 크리에이터들에게 무료 음악 자원을 제공합니다.',
      hero_btn_drive: '음원 다운로드 (Google Drive)',
      hero_btn_explore: '모든 음원 둘러보기',
      hero_btn_about: '스튜디오 소개',
      stat_singers: '소속 가상 보컬리스트',
      stat_packages: '배포 중인 음원 패키지',
      stat_projects: '음악 프로젝트 및 파일',
      stat_studios: '협력 스튜디오 및 파트너',
      vb_hero_crumb: 'DELTA SYNTH / 모든 음원',
      vb_hero_title: 'DELTA SYNTH<br>전체 가상 음원 라이브러리',
      vb_hero_desc: '총 54명 가상 캐릭터의 음원 저장소. OpenUtau 및 DiffSinger AI 지원, 캐릭터 상세 프로필, 오디오 샘플 및 즉시 다운로드 제공.',
      vb_drive_banner_title: '📂 DELTA SYNTH 공식 Google Drive 음원 저장소',
      vb_drive_banner_desc: '공식 Google Drive에서 제공되는 UTAU 및 DiffSinger AI 전체 음원 다운로드 센터.',
      vb_drive_banner_btn: '마스터 드라이브 열기 →',
      vb_filter_all: '전체 (54)',
      vb_card_profile: '👤 상세 프로필',
      vb_card_private: '🔒 비공개 음원 (PRIVATE)',
      profile_return: '← 모든 음원 목록으로 돌아가기',
      profile_return_sub: '/ 캐릭터 목록',
      profile_official: '공식 DELTA',
      profile_age: '나이',
      profile_gender: '성별',
      profile_voicer: '음성 제공자 (성우)',
      profile_genre: '장르',
      profile_engine: '엔진',
      profile_language: '지원 언어',
      profile_bio_title: '소개 및 프로필',
      profile_audio_title: '오디오 샘플 듣기',
      profile_audio_demo: '데모 미리듣기:',
      profile_status_title: '음원 상태 · VOICEBANK STATUS',
      profile_private_title: '상태: <span style="color: #ff4422;">비공개 음원 (Private Voicebank)</span>',
      profile_private_desc: '이 캐릭터의 음원은 DELTA SYNTH 스튜디오 내부 제작 및 특별 프로젝트 전용 비공개 음원입니다. 일반 다운로드는 제공되지 않습니다.',
      profile_private_badge: '🔒 전용 접근 제한 · 스튜디오 비공개 음원',
      profile_download_title: '다운로드 가능 음원 목록',
      profile_btn_download: '⚡ 다운로드',
      footer_desc: '2019년 설립된 태국의 가상 음원 합성 스튜디오. UTAU 및 DiffSinger AI 음원을 제작하고 전 세계 창작자에게 무상 배포하고 있습니다.',
      footer_sitemap: '사이트맵',
      footer_contact: '문의 및 커뮤니티',
      footer_drive: 'Google Drive 음원 허브',
      footer_rights: '© 2019년 설립 — DELTA SYNTH Studio. 판권 소유.',
      footer_made_by: 'Made And Checked By DELTA SYNTH & All Code Agentic AI Engine'
    }
  };

  const STORAGE_KEY = 'delta_synth_lang';

  function getCurrentLang() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved && TRANSLATIONS[saved]) {
        return saved;
      }
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

    document.documentElement.lang = langCode === 'es-cl' ? 'es' : langCode;
    applyTranslations(langCode);
    updateSwitcherUI(langCode);

    try {
      window.dispatchEvent(new CustomEvent('deltaLanguageChanged', { detail: { lang: langCode } }));
    } catch (e) {}
  }

  function applyTranslations(langCode) {
    const t = TRANSLATIONS[langCode] || TRANSLATIONS.th;

    // 1. Data-i18n attributes
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (t[key]) {
        el.innerHTML = t[key];
      }
    });

    // 2. Navigation Links
    const navMapping = {
      'index.html': t.nav_main,
      'about.html': t.nav_about,
      'voicebank.html': t.nav_voicebank,
      'files.html': t.nav_files,
      'collab.html': t.nav_collab,
      'events.html': t.nav_events
    };
    document.querySelectorAll('.site-header .nav-links a, #site-navigation a, #mobile-menu a').forEach(a => {
      const href = a.getAttribute('href') || '';
      for (const [file, label] of Object.entries(navMapping)) {
        if (href.endsWith(file) || href.includes(file)) {
          a.textContent = label;
          break;
        }
      }
    });

    // 3. Hero CTA buttons & elements
    const driveBtns = document.querySelectorAll('a[href*="drive.google.com/drive/folders/1tboFHk0sj2Util_1CGBvqEPfV-qqCvMx"]');
    driveBtns.forEach(btn => {
      if (btn.classList.contains('btn-drive')) {
        btn.textContent = t.vb_drive_banner_btn;
      } else if (btn.classList.contains('btn') && btn.textContent.includes('Google Drive')) {
        btn.innerHTML = `<span>${t.hero_btn_drive}</span><span style="font-size:11px; opacity:0.85;">/ Master Drive</span>`;
      }
    });

    // 4. Voicebank Page Banner
    const bannerDrive = document.querySelector('.banner-drive');
    if (bannerDrive) {
      const h3 = bannerDrive.querySelector('h3');
      const p = bannerDrive.querySelector('p');
      if (h3) h3.textContent = t.vb_drive_banner_title;
      if (p) p.textContent = t.vb_drive_banner_desc;
    }

    // 5. Singer profile pages: specs and labels
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

    // Singer Bio & Audio Titles
    document.querySelectorAll('h3').forEach(h3 => {
      const txt = h3.textContent.trim();
      if (txt.includes('Biography') || txt.includes('ประวัติ')) {
        h3.textContent = t.profile_bio_title;
      } else if (txt.includes('Audio Sample') || txt.includes('ตัวอย่างเสียง')) {
        h3.textContent = t.profile_audio_title;
      }
    });

    // Voicebank Status Card in singer profiles
    const vbTitle = document.querySelector('.vb-archive-title');
    if (vbTitle) {
      const span = vbTitle.querySelector('span');
      if (span) {
        if (span.textContent.includes('STATUS') || span.textContent.includes('สถานะ')) {
          span.textContent = t.profile_status_title;
        } else if (span.textContent.includes('ARCHIVES') || span.textContent.includes('ดาวน์โหลด')) {
          const match = span.textContent.match(/\(\d+.*?\)/);
          const count = match ? ` ${match[0]}` : '';
          span.textContent = `${t.profile_download_title}${count} · VOICEBANK ARCHIVES`;
        }
      }
    }

    // Private Voicebank Card
    const privateCard = document.querySelector('.vb-private-card');
    if (privateCard) {
      const pTitle = privateCard.querySelector('.vb-private-title');
      const pDesc = privateCard.querySelector('.vb-private-desc');
      const pBadge = privateCard.querySelector('.vb-private-badge');
      if (pTitle) pTitle.innerHTML = t.profile_private_title;
      if (pDesc) pDesc.textContent = t.profile_private_desc;
      if (pBadge) pBadge.textContent = t.profile_private_badge;
    }

    // Return to Voicebanks button
    const backBtn = document.querySelector('a[href="../voicebank.html"]');
    if (backBtn && backBtn.textContent.includes('กลับ')) {
      backBtn.innerHTML = `<span>${t.profile_return}</span><span class="text-xs text-gray-500">${t.profile_return_sub}</span>`;
    }

    // Download buttons
    document.querySelectorAll('.vb-btn-download span').forEach(s => {
      s.textContent = t.profile_btn_download;
    });

    // Footer copyright & made by
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
    if (document.getElementById('lang-switcher')) {
      return;
    }

    const navLinks = document.querySelector('.site-header .nav-links') || document.querySelector('#site-navigation') || document.querySelector('.nav-links');
    const nav = document.querySelector('.site-header .nav') || document.querySelector('.nav') || document.querySelector('header');
    const container = navLinks || nav;
    if (!container) return;

    const switcher = document.createElement('div');
    switcher.className = 'lang-switcher';
    switcher.id = 'lang-switcher';

    const currentLang = getCurrentLang();

    const langItemsHtml = LANGUAGES.map(l => `
      <button type="button" role="menuitem" data-lang="${l.code}" class="${currentLang === l.code ? 'active' : ''}">
        <span class="lang-flag">${l.flag}</span>
        <span class="lang-name">${l.label}</span>
        <span class="lang-code-tag">${l.short}</span>
      </button>
    `).join('');

    switcher.innerHTML = `
      <button class="lang-btn" id="lang-btn" type="button" aria-haspopup="true" aria-expanded="false" title="Language">
        <span class="lang-current" id="lang-current">Language</span>
      </button>
      <div class="lang-dropdown" id="lang-dropdown" style="display: none !important;" role="menu" aria-label="Language selection">
        ${langItemsHtml}
      </div>
    `;

    container.appendChild(switcher);

    const btn = switcher.querySelector('#lang-btn');
    const dropdown = switcher.querySelector('#lang-dropdown');

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

    btn.addEventListener('click', (e) => {
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
        btn.focus();
      }
    });
  }

  function updateSwitcherUI(langCode) {
    const currentLabel = document.getElementById('lang-current');
    if (currentLabel) {
      currentLabel.textContent = 'Language';
    }
    document.querySelectorAll('#lang-dropdown button[data-lang]').forEach(btn => {
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
  }

  if (typeof window !== 'undefined' && typeof document !== 'undefined') {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', init);
    } else {
      init();
    }
  }

  // Export globally for programmatic control if needed
  if (typeof window !== 'undefined') {
    window.DeltaI18n = {
      languages: LANGUAGES,
      getCurrentLanguage: getCurrentLang,
      setLanguage: setLanguage,
      translations: TRANSLATIONS
    };
  }

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = { LANGUAGES, TRANSLATIONS };
  }
})();

