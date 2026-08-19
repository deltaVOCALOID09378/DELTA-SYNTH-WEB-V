# All File Mapping
> สมุดบัญชีแสดงตำแหน่งและโครงสร้างของไฟล์ทั้งหมดในโปรเจกต์ DELTA SYNTH

## โครงสร้างภาพรวมของโปรเจกต์ (`DELTA_SYNTH-main`)

```text
DELTA_SYNTH-main/
│
├── .vscode/                               # การตั้งค่า Editor
├── .wix/                                  # ไฟล์เชื่อมต่อระบบ Wix CLI
├── .vercel/                               # ไฟล์การเชื่อมโยงระบบ Vercel
│
├── src/                                   # 📂 Source Code หลักของทั้งระบบ
│   ├── pages/                             # 📄 สคริปต์หน้าเว็บ Wix Velo (14 หน้า)
│   │   ├── masterPage.js                  # สคริปต์ Global Site-wide (Nav, Mobile, Audio Dock, Toast)
│   │   ├── Main.ggt15.js                  # หน้าแรก (Hero, Featured Singers, Stats, News)
│   │   ├── About US.onz2l.js              # หน้าเกี่ยวกับเรา (Founders, Timeline, Mission)
│   │   ├── All DELTA's Voicebank.acsro.js # หน้ารวมคลังเสียง (54 นักร้อง, Multi-Filter, Audio Preview)
│   │   ├── All Callaboraion Voicebank_.aj73j.js # หน้านักร้องความร่วมมือ
│   │   ├── All USTX, MIDI, SVP and VSQX file.h73n8.js # หน้ารวมไฟล์ดนตรีและทรัพยากร
│   │   ├── All Our Project For Voicebank.hdv8h.js # หน้ารวมโครงการและผลงาน
│   │   ├── Events.mim9b.js                # หน้ารายการกิจกรรม
│   │   ├── Event Details & Registration.mi1hd.js # หน้าลงทะเบียนเข้าร่วมกิจกรรม
│   │   ├── Schedule.sbt9p.js              # หน้าแผนงานและ Roadmap
│   │   ├── Activity for Fix and Input Date.afeou.js # หน้าบันทึกประวัติการอัปเดต (Changelog)
│   │   ├── File Share.ze9bp.js            # หน้าแบ่งปันไฟล์คอมมูนิตี้
│   │   ├── Voicebank BETA.gtyoi.js         # หน้าทดสอบคลังเสียง BETA และรับสมัครผู้ทดสอบ
│   │   └── Contact.kcdii.js               # หน้าติดต่อเราและ FAQ
│   │
│   ├── public/                            # 🌐 โมดูล Wix Public และ Static Portal สำหรับ Vercel
│   │   ├── theme.js                       # ค่าคงที่อัตลักษณ์และธีม (#CC2200, #1A1A1A, #F0F0F0)
│   │   ├── toast.js                       # ระบบ Toast แจ้งเตือน 280x80px ตามมาตรฐาน AGENT.md
│   │   ├── utils.js                       # เครื่องมือช่วยเหลือ $wSafely, Debounce, Logger
│   │   ├── voicebankData.js               # แคตตาล็อกข้อมูลนักร้อง 54 คนแบบสมบูรณ์
│   │   ├── projectData.js                 # ฐานข้อมูลไฟล์เพลง USTX/MIDI/SVP/VSQX, โครงการ, กิจกรรม
│   │   ├── audioPlayer.js                 # ตัวจัดการการเล่นไฟล์เสียงตัวอย่างทั่วทั้งเว็บ
│   │   ├── vercel.json                    # คอนฟิกการนำขึ้นระบบ Vercel (Routing & Cache)
│   │   ├── index.html                     # หน้าแรกเว็บไซต์แบบสแตติก
│   │   ├── about.html                     # หน้าเกี่ยวกับเราแบบสแตติก
│   │   ├── voicebank.html                 # หน้ารวมคลังเสียง 54 คนแบบสแตติก
│   │   ├── project.html                   # หน้ารวมผลงานแบบสแตติก
│   │   ├── css/styles.css                 # สไตล์ชีตระบบ Space Theme & Glassmorphism
│   │   ├── js/starfield.js                # แอนิเมชันดวงดาว Canvas 2D
│   │   ├── singers/                       # ไฟล์โปรไฟล์ HTML นักร้อง 54 คน
│   │   ├── Voice/                         # ไฟล์เสียงตัวอย่าง WAV 66 ไฟล์
│   │   └── assets/                        # ภาพโปรไฟล์และอาร์ตเวิร์กของนักร้อง
│   │
│   └── backend/                           # ⚙️ บริการฝั่งเซิร์ฟเวอร์ Wix Velo
│       ├── voicebankService.jsw           # บริการค้นหา กรอง และดึงข้อมูลนักร้อง
│       ├── fileService.jsw                # บริการจัดการไฟล์เพลงและการติดตามการดาวน์โหลด
│       ├── registrationService.jsw        # บริการลงทะเบียนกิจกรรมและสมัครทดสอบ BETA
│       ├── contactService.jsw             # บริการส่งข้อความติดต่อและสร้าง Ticket
│       ├── data.js                        # Data Hooks อัตโนมัติสำหรับ Wix Collections
│       ├── http-functions.js              # REST API Endpoints สำหรับภายนอก
│       └── permissions.json               # การตั้งค่าสิทธิ์การเข้าถึง Web Methods
│
├── AGENT.md                               # [ระบบ] กฎข้อบังคับสูงสุดของ AI และการออกแบบ
├── PROJECT_CONTEXT.md                     # [ระบบ] บริบทและสถานะการทำงานของโปรเจกต์
├── All File Mapping.md                    # [ระบบ] แผนผังไฟล์ทั้งหมด (ไฟล์นี้)
├── The Source Code of System File's Name Mapping.md # [ระบบ] แผนผังไฟล์วิกฤต
├── DELTA_SYNTH_Core_Reference.md          # [ระบบ] เอกสารอ้างอิงศูนย์กลาง
├── Research_and_Development_Report.md     # [ระบบ] รายงานการวิจัยและพัฒนา (R&D)
├── README.md                              # [ระบบ] ภาพรวมของโปรเจกต์
│
├── package.json                           # ค่าการตั้งค่าของ Node.js/Wix CLI
├── .eslintrc.json                         # ค่าการตั้งค่า Linter
└── jsconfig.json                          # ค่าการตั้งค่า JavaScript
```

## สรุปจุดสำคัญของระบบ
1. **Wix Velo System:** หน้าเพจและโมดูลทั้งหมดเชื่อมโยงแบบไร้รอยต่อ ป้องกันข้อผิดพลาดด้วย `$wSafely` และทำงานได้ถูกต้องทั้งบน Wix Editor และ Wix Live Site
2. **Vercel Static Portal:** ไฟล์ HTML ทั้งหมดถูกจัดวางอยู่ที่ `src/public/` พร้อมไฟล์คอนฟิก `vercel.json` สำหรับการ Deploy แบบ Static Hosting ทันที
3. **DELTA SYNTH Design System:** อิงตามอัตลักษณ์สีแดง `#CC2200`, ฟอนต์ `Leelawadee UI` และ Toast มาตรฐานขนาด `280x80px` ตามที่ระบุไว้ใน `AGENT.md`
