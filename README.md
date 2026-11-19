<div align="center">

# Hi there, I'm Delta 👋
### Vocal Synthesis Software Developer & Founder of **DELTA SYNTH** 🇹🇭

[![Website](https://img.shields.io/badge/DELTA_SYNTH-Official_Portal-CC2200?style=for-the-badge&logo=githubpages&logoColor=white)](https://deltavocaloid09378.github.io/DELTA-SYNTH-WEB-V)
[![YouTube](https://img.shields.io/badge/YouTube-@deltaSYNTH0320-1A1A1A?style=for-the-badge&logo=youtube&logoColor=CC2200)](https://www.youtube.com/@deltaSYNTH0320)
[![Ko-fi](https://img.shields.io/badge/Support_My_Work-Ko--fi-CC2200?style=for-the-badge&logo=kofi&logoColor=white)](https://ko-fi.com/deltavocaloid)

</div>

---

### 👨‍💻 About Me
I am a software developer and vocal synthesis engineer from Thailand, specializing in **Thai Singing Voice Synthesis (SVS)** and **AI Voice Conversion** technologies. As the founder of **DELTA SYNTH**, I bridge the gap between complex Thai phonetics and modern vocal synthesis engines.

- 🔭 **Currently Spearheading:** **Thai OpenUtau Engine** — pushing the boundaries of natural Thai vocal rendering.
- 🛠️ **End-to-End Engineering:** From designing custom phonemizer algorithms and acoustic tuning to rigorous, hands-on quality assurance testing on every single build.
- 🎙️ **Focus Areas:** Custom Phonemizers (Thai VCCV, Thai Arpasing), DiffSinger AI Acoustic/Variance Models, RVC Pipelines, and Audio Rendering Optimization.

---

### 🚀 Featured Project: **Thai OpenUtau Engine**

**Thai OpenUtau** is a specialized, high-precision fork and engine enhancement of OpenUtau tailored specifically for Thai and bilingual vocal synthesis workflows.

#### ✨ Key Technical Highlights
- **Advanced Thai Phonemizers:** Custom-built phonemizer logic supporting **Thai VCCV**, **Thai Arpasing**, and **US English**, engineered with strict acoustic expansion ratios (`CCV <= 5%`, `VC = 25–40%`, `V- = 20–30%`) for crisp articulation and smooth transitions.
- **Worldline Renderer & Cache Stability:** Enhanced audio rendering pipeline with file-lock prevention and optimized WAV caching for zero-stutter playback.
- **Native Vocal Ornamentation:** Built-in support for traditional and modern Thai vocal nuances (`pitch.ust` micro-pitch commands and multi-curve vibrato profiles).
- **Integrated Studio Tools:** Enhanced Piano Roll workflow with integrated video recording support (up to 4K resolution) and a bilingual (TH/EN) interface.
- **100% Hands-On Verified:** Every feature, bug fix, and performance update undergoes direct, personal stress-testing to ensure production-grade stability.

---

### 🧰 Tech Stack & Ecosystem

| Domain | Technologies & Tools |
| :--- | :--- |
| **Core Development** | ![C#](https://img.shields.io/badge/C%23-.NET_8_%2F_10-1A1A1A?style=flat-square&logo=dotnet&logoColor=CC2200) ![Python](https://img.shields.io/badge/Python-3.x-1A1A1A?style=flat-square&logo=python&logoColor=F0F0F0) ![C++](https://img.shields.io/badge/C++-Native-1A1A1A?style=flat-square&logo=cplusplus&logoColor=F0F0F0) |
| **AI & Vocal Tech** | ![PyTorch](https://img.shields.io/badge/PyTorch-DirectML-1A1A1A?style=flat-square&logo=pytorch&logoColor=CC2200) `DiffSinger` `RVC v1/v2` `OpenUtau` `Worldline` |
| **Audio & Tuning** | `FL Studio` `UTAU` `Custom Phonemizer Architecture` |

---

<div align="center">
  <i>"Crafted, tested, and refined with precision — bringing authentic Thai voices to life."</i><br>
  <b>Made & Checked by DELTA SYNTH</b>
</div>

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
