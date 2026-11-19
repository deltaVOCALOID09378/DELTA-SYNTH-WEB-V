<div align="center">

# DELTA SYNTH — Official Web Portal 🎙️
### Independent Vocal Synthesis Studio & Thai Vocal Synth Ecosystem

[![Live Portal](https://img.shields.io/badge/Live_Website-Visit_Portal-CC2200?style=for-the-badge&logo=githubpages&logoColor=white)](https://deltavocaloid09378.github.io/DELTA-SYNTH-WEB-V)
[![Thai OpenUtau](https://img.shields.io/badge/Engine-Thai_OpenUtau-1A1A1A?style=for-the-badge&logo=github&logoColor=CC2200)](https://github.com/deltaVOCALOID09378/Thai_OpenUtau)
[![YouTube](https://img.shields.io/badge/YouTube-@deltaSYNTH0320-1A1A1A?style=for-the-badge&logo=youtube&logoColor=CC2200)](https://www.youtube.com/@deltaSYNTH0320)

</div>

---

### 🌐 Overview | ภาพรวมโปรเจกต์
**DELTA-SYNTH-WEB-V** is the consolidated official web portal for **DELTA SYNTH**, developed and maintained by **Delta (Patiphat Wongyai)**. This platform serves as the central hub for showcasing Thai and bilingual virtual singers, interactive voicebank audio demos, software releases, and verified partner collaborations.

**DELTA-SYNTH-WEB-V** คือเว็บไซต์หลักอย่างเป็นทางการของสตูดิโอ **DELTA SYNTH** รวบรวมฐานข้อมูลนักร้องเสียงสังเคราะห์ (Voicebanks) ตัวอย่างเสียงร้องจริง ซอฟต์แวร์เครื่องมือพัฒนาเสียง และรายชื่อพาร์ทเนอร์ที่ได้รับการยืนยันอย่างเป็นทางการ

---

### ✨ Key Features | ฟีเจอร์หลักของเว็บไซต์

- **🎤 Complete Voicebank Directory (`voicebank.html`):**
  - Catalogs 55+ virtual singers and partner characters, systematically organized by collaborative project groups and sorted chronologically from debut date.
  - Dedicated individual singer profile pages (e.g., `singers/mairu_maishi.html`) featuring verified voice provider credits, official artwork attributions, and platform links.
- **🔊 Integrated Audio Sample Player (`src/public/Voice`):**
  - Direct web-based playback of curated vocal samples, allowing creators and listeners to preview each voicebank's vocal tone and articulation directly on their profile page.
- **🛠️ Software & Engine Hub:**
  - Direct access and documentation links for flagship studio tools, including **Thai OpenUtau Engine** and **Thai RVC WebUI**.
- **🎨 Signature Studio Design & Bilingual UI:**
  - Built with a responsive layout supporting **Thai & English** localization, styled in the signature **DELTA SYNTH** dark cosmic aesthetic (`#1A1A1A` Dark Base, `#CC2200` Accent Red, `#F0F0F0` Crisp Typography, and `Leelawadee UI`).

---

### 📂 Repository Structure | โครงสร้างไฟล์หลัก

```text
DELTA-SYNTH-WEB-V/
├── index.html               # Main studio landing page & featured releases
├── voicebank.html           # Chronological & group-sorted voicebank directory
├── singers/                 # Individual character profiles, lore & voice provider credits
└── src/
    └── public/
        └── Voice/           # Hosted vocal sample audio assets (.wav / .mp3)
