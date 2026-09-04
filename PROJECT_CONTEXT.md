# PROJECT CONTEXT: DELTA_SYNTH-main
> เอกสารแสดงสถานะและการทำงานของระบบ DELTA SYNTH

## 📌 สรุปความคืบหน้าและการพัฒนาล่าสุด (Progress & Updates)

1. **สถาปัตยกรรม Wix Velo แบบสมบูรณ์ (`src/pages/`, `src/public/`, `src/backend/`):**
   - พัฒนาและอัปเดตสคริปต์หน้าเว็บ Wix Velo ครบทั้ง 14 หน้าเพจหลัก พร้อมการจัดการข้อผิดพลาดแบบ Defensive `$wSafely`
   - พัฒนาโมดูลส่วนกลาง `src/public/` (Theme Token, Toast Notification ตามมาตรฐาน AGENT.md, Universal Utilities, Audio Player Manager, Voicebank Data 54 นักร้อง, Project Data)
   - พัฒนา Web Modules ด้าน Backend `src/backend/` (`voicebankService.jsw`, `fileService.jsw`, `registrationService.jsw`, `contactService.jsw`, `data.js` Data Hooks, `http-functions.js` REST Endpoints, `permissions.json`)

2. **เว็บไซต์พอร์ทัล Vercel Static Production (`src/public/`):**
   - ตรวจสอบความสมบูรณ์ของหน้าเว็บ HTML ทั้งหมด 58+ ไฟล์ (`index.html`, `about.html`, `voicebank.html`, `project.html`, และ 54 โปรไฟล์นักร้องใน `singers/`)
   - แก้ไขการสะกดชื่อไฟล์ภาพโปรไฟล์ 4 รายการที่คลาดเคลื่อน (`charnsamorn.webp`, `arun-kamonlanert.webp`, `bew-powerine.webp`, `kikokawa-usagi.webp`)
   - ปรับปรุงชุดสีใน `css/styles.css` และ `index.html` สู่มาตรฐานอัตลักษณ์ DELTA SYNTH (สีแดงหลัก `#CC2200`, พื้นหลังดำ `#1A1A1A`, ข้อความขาว `#F0F0F0`)
   - ปรับปรุง Navigation Active States บนหน้า Voicebanks และ Project ให้ถูกต้อง 100%
   - สร้างไฟล์คอนฟิก `vercel.json` กำหนด Clean URLs, Cache-Control Headers, Security Headers, และ Singer Rewrites

---

## 🗂️ โครงสร้างโปรเจกต์ (Project Structure)

```text
DELTA_SYNTH-main/
│
├── AGENT.md                       # กฎและมาตรฐานการพัฒนาสูงสุดของ DELTA SYNTH
├── PROJECT_CONTEXT.md             # บริบทและสถานะการทำงานของระบบ (ไฟล์นี้)
├── All File Mapping.md            # บัญชีแผนผังไฟล์ทั้งหมด
├── package.json                   # การตั้งค่า Wix CLI & Linter
├── .eslintrc.json                 # การตั้งค่า ESLint
│
├── src/
│   ├── pages/                     # 📂 สคริปต์หน้าเว็บ Wix Velo (14 หน้าเพจ)
│   │   ├── masterPage.js          # สคริปต์กลางควบควมทั้งไซต์ (Nav, Mobile Menu, Audio Dock, Toast)
│   │   ├── Main.ggt15.js          # หน้าแรก (Hero, Featured Singers, Stats, News)
│   │   ├── About US.onz2l.js      # หน้าเกี่ยวกับเรา (Founders, Timeline, Accordions)
│   │   ├── All DELTA's Voicebank.acsro.js # หน้ารวมคลังเสียง (54 นักร้อง, Multi-Filter, Search, Audio Demo)
│   │   ├── All Callaboraion Voicebank_.aj73j.js # หน้านักร้องความร่วมมือ
│   │   ├── All USTX, MIDI, SVP and VSQX file.h73n8.js # หน้ารวมไฟล์ดนตรีและทรัพยากร
│   │   ├── All Our Project For Voicebank.hdv8h.js # หน้ารวมโครงการและผลงาน
│   │   ├── Events.mim9b.js        # หน้ารายการกิจกรรม
│   │   ├── Event Details & Registration.mi1hd.js # หน้าลงทะเบียนเข้าร่วมกิจกรรม
│   │   ├── Schedule.sbt9p.js      # หน้ารายละเอียดแผนงานและ Roadmap
│   │   ├── Activity for Fix and Input Date.afeou.js # หน้าบันทึกประวัติการอัปเดต (Changelog)
│   │   ├── File Share.ze9bp.js    # หน้าแบ่งปันไฟล์และส่งทรัพยากรคอมมูนิตี้
│   │   ├── Voicebank BETA.gtyoi.js # หน้าทดสอบคลังเสียง BETA และสมัครผู้ทดสอบ
│   │   └── Contact.kcdii.js       # หน้าติดต่อเราและคำถามที่พบบ่อย (FAQ)
│   │
│   ├── public/                    # 📂 โมดูลส่วนกลางของ Wix + Static Web สำหรับ Vercel
│   │   ├── theme.js               # ค่าคงที่ธีมและชุดสีตามมาตรฐาน AGENT.md
│   │   ├── toast.js               # ระบบ Toast แจ้งเตือนขนาด 280x80px มุมขวาล่าง
│   │   ├── utils.js               # ตัวช่วยป้องกันบั๊ก $wSafely, Debounce, Formatters
│   │   ├── voicebankData.js       # ฐานข้อมูลและแคตตาล็อก 54 นักร้องแบบสมบูรณ์
│   │   ├── projectData.js         # ฐานข้อมูลไฟล์เพลง USTX/MIDI/SVP/VSQX, โครงการ, กิจกรรม
│   │   ├── audioPlayer.js         # ตัวควบคุมการเล่นไฟล์เสียงตัวอย่างแบบทั่วทั้งไซต์
│   │   ├── vercel.json            # ไฟล์คอนฟิกการนำขึ้นระบบ Vercel
│   │   ├── index.html             # หน้าแรก HTML (Vercel)
│   │   ├── about.html             # หน้าเกี่ยวกับเรา HTML
│   │   ├── voicebank.html         # หน้ารวมคลังเสียง HTML
│   │   ├── project.html           # หน้ารวมผลงาน HTML
│   │   ├── css/styles.css         # สไตล์ชีตระบบ Space Theme & Glassmorphism
│   │   ├── js/starfield.js        # แอนิเมชันดวงดาว 2D Canvas
│   │   ├── singers/               # ไฟล์โปรไฟล์ HTML นักร้อง 54 คน
│   │   ├── Voice/                 # ไฟล์เสียงตัวอย่าง WAV 66 ไฟล์
│   │   └── assets/                # ภาพโปรไฟล์และอาร์ตเวิร์กของนักร้อง
│   │
│   └── backend/                   # 📂 บริการฝั่งเซิร์ฟเวอร์ Wix Velo
│       ├── voicebankService.jsw   # บริการค้นหา กรอง และดึงข้อมูลนักร้อง
│       ├── fileService.jsw        # บริการจัดการไฟล์เพลงและการติดตามการดาวน์โหลด
│       ├── registrationService.jsw # บริการบันทึกการลงทะเบียนกิจกรรมและสมัคร BETA
│       ├── contactService.jsw     # บริการส่งข้อความติดต่อและสร้าง Ticket
│       ├── data.js                # Data Hooks อัตโนมัติสำหรับ Wix Collections
│       ├── http-functions.js      # REST API Endpoints สำหรับภายนอก
│       └── permissions.json       # การตั้งค่าสิทธิ์การเข้าถึง Web Methods
```

---

## ⚙️ มาตรฐานและอัตลักษณ์ระบบ (Design & Standards)
- **อัตลักษณ์สี:** สีแดงหลัก `#CC2200`, สีแดงเข้มเมื่อกด `#991100`, สีแดงสว่างเมื่อชี้ `#FF4422`, พื้นหลัง `#1A1A1A`, ข้อความ `#F0F0F0`
- **ฟอนต์หลัก:** `Leelawadee UI`, `Kanit`, `Inter`
- **การแจ้งเตือน Toast:** ขนาดไม่เกิน `280x80px`, มุมล่างขวา `(16, 20)`, ขอบมน `6px`
- **ความเสถียรของโค้ด:** ออกแบบรองรับการทำงานแบบ Defensive, Zero Known Defects, บันทึก Log ตามรูปแบบมาตรฐาน `[Component] Action failed: <cause>. Suggested action: <next step>.`
