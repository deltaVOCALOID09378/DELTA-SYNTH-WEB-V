# All File Mapping
> สมุดบัญชีแสดงตำแหน่งและโครงสร้างของไฟล์ทั้งหมดในโปรเจกต์ DELTA SYNTH

## Root Directory (`D:\DELTA_SYNTH-main`)

```text
DELTA_SYNTH-main/
│
├── .vscode/                   # การตั้งค่า Editor
├── .wix/                      # ไฟล์เชื่อมต่อระบบ Wix (Legacy)
├── All Editing File For Agent/# โฟลเดอร์รวมสคริปต์แก้ไข/ระบบ (ถูกสร้างใหม่เพื่อความเป็นระเบียบ)
│   ├── Deploy_to_Server.bat   # สคริปต์อัปโหลดขึ้นเซิร์ฟเวอร์
│   └── update_profiles.py     # สคริปต์อัปเดตฐานข้อมูลนักร้อง
│
├── Export The Project/        # โฟลเดอร์เก็บไฟล์บิลด์และโค้ดเพื่อปล่อย
├── Export_For_Web/            # โฟลเดอร์เก็บไฟล์เว็บแบบสแตติก
├── Picture File/              # โฟลเดอร์เก็บรูปภาพอ้างอิงและรูปถ่าย
│
├── src/                       # โฟลเดอร์ Source Code หลัก 
│   └── public/                # 📂 หน้าเว็บ Vercel (Production)
│       ├── css/
│       │   └── styles.css     # ธีมอวกาศและ Glassmorphism
│       ├── singers/           # ไฟล์ HTML โปรไฟล์นักร้องทั้งหมด (54 คน)
│       ├── index.html         # หน้าแรกเว็บไซต์
│       ├── about.html         # หน้าเกี่ยวกับเรา
│       └── ... (other html)   
│
├── AGENT.md                   # [ระบบ] กฎข้อบังคับสูงสุดของ AI
├── All File Mapping.md        # [ระบบ] แผนที่ไฟล์ทั้งหมด (ไฟล์นี้)
├── DELTA_SYNTH_Core_Reference.md # [ระบบ] เอกสารอ้างอิงศูนย์กลาง
├── Research_and_Development_Report.md # [ระบบ] รายงานการพัฒนา (R&D)
├── The Source Code of System File's Name Mapping.md # [ระบบ] แผนผังไฟล์วิกฤต
├── README.md                  # [ระบบ] ภาพรวมของโปรเจกต์
│
├── package.json               # ค่าการตั้งค่าของ Node.js/Vercel
├── .eslintrc.json             # ค่าการตั้งค่า Linter
├── jsconfig.json              # ค่าการตั้งค่า JavaScript
└── wix.config.json            # ค่าการตั้งค่า Wix
```

## สรุปโครงสร้างการทำงาน
1. **โค้ดทั้งหมดที่แสดงผลบนเว็บไซต์ (Frontend):** จะอยู่ภายในโฟลเดอร์ `src/public/`
2. **เครื่องมือและสคริปต์สำหรับผู้พัฒนา (Backend/Tools):** จะถูกรวบรวมไว้ที่ `All Editing File For Agent/` 
3. **ระบบเอกสาร (Documentation):** เอกสารอ้างอิงของระบบทั้งหมดจะวางไว้ที่ `Root Directory` เสมอ เพื่อให้ Agent เข้าถึงได้ง่ายที่สุด
