# 🌌 DELTA SYNTH — Official Virtual Singer Ecosystem & Creative Hub

**DELTA SYNTH** คือศูนย์กลางระบบนิเวศเสียงสังเคราะห์เสมือนจริง (Virtual Singer Ecosystem & Creative Hub) ของประเทศไทย พัฒนาขึ้นเพื่อเป็นแพลตฟอร์มนำเสนอคลังเสียงนักร้องสังเคราะห์ (Voicebanks) ทั้งรูปแบบ **UTAU (VCV, CVVC, VCCV, Arpasing)** และ **DiffSinger AI (Deep Learning Vocal Synthesis)** รวมถึงเป็นศูนย์กลางแจกจ่ายไฟล์ทรัพยากรดนตรีระดับมืออาชีพ ได้แก่ **USTX, MIDI, SVP และ VSQX**[cite: 1]

---

## ✨ คุณสมบัติเด่นของระบบ (Key Features)

* **🎙️ คลังเสียงนักร้องเสมือน (Virtual Singer Catalog):** รองรับข้อมูลนักร้องเสมือนในสังกัดและการร่วมมือ (Collaborations) ครบทุกมิติ ทั้งภาษาไทย ญี่ปุ่น อังกฤษ จีน เกาหลี และฝรั่งเศส พร้อมระบบค้นหาและตัวกรองหลายเงื่อนไข (Multi-Filter)[cite: 1]
* **🎧 ระบบเล่นเสียงตัวอย่างอัจฉริยะ (Singleton Audio Preview Engine):** เล่นเสียงตัวอย่าง `.wav` ของนักร้องแต่ละคนได้ทันที พร้อมกลไกป้องกันเสียงซ้อนทับ (Audio Overlap Prevention)
* **📦 คลังดาวน์โหลดไฟล์ดนตรีและโปรเจกต์ (Music & Project Resources):** รวบรวมไฟล์ `USTX`, `MIDI`, `SVP`, `VSQX` และเชื่อมต่อกับ **Master Google Drive Hub (167+ Voicebank Archives)**[cite: 1]
* **🎨 ดีไซน์เอกลักษณ์ Cyberpunk Space Theme:** ออกแบบส่วนติดต่อผู้ใช้สไตล์ห้องนักบินอวกาศ (Cosmic Cockpit / Glassmorphism) ผสานชุดสีประจำค่าย (`#CC2200`, `#1A1A1A`, `#F0F0F0`) และฟอนต์ `Leelawadee UI`[cite: 1]
* **🛡️ สถาปัตยกรรม 3 ชั้น & ความปลอดภัยสูงสุด (3-Layer Architecture & Security):** แยกส่วน Presentation (`src/public/`), Wix Velo Pages (`src/pages/`) และ Backend Web Modules (`src/backend/`) ออกจากกันอย่างชัดเจน พร้อมผ่านการอุดช่องโหว่ความปลอดภัย (0 Vulnerabilities)[cite: 1, 4]
* **✅ ระบบทดสอบอัตโนมัติระดับองค์กร (Automated E2E Verification):** ตรวจสอบความถูกต้องครบทุกมิติ (171/171 Test Suites Passed — Zero Known Defects)[cite: 4, 5]

---

## 🏗️ โครงสร้างสถาปัตยกรรมโปรเจกต์ (Project Architecture)

```text
DELTA_SYNTH-main/
├── src/
│   ├── public/          # Static Web Portal, Client Scripts, Single Source of Truth Data & 55+ Singer Profiles
│   ├── pages/           # Wix Velo Frontend Page Scripts (14 Pages)
│   └── backend/         # Wix Velo Backend Services (.jsw), REST API (http-functions.js) & Permissions
├── tests/               # Native Node.js Automated E2E Test Suite (Zero External Dependencies)
├── .github/workflows/   # CI/CD Pipelines (GitHub Pages, Cloudflare Pages, CodeQL Security Scan)
├── AGENT.md             # มาตรฐานการพัฒนาและกฎข้อบังคับสูงสุดของ DELTA SYNTH
└── server.js            # Standalone Express.js REST API Server
