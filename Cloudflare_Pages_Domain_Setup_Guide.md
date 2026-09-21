# คู่มือการติดตั้งและใช้งานเว็บไซต์ DELTA SYNTH บน Cloudflare Pages
## เชื่อมต่อโดเมนหลัก `delta-synth-studio-th.com` โดยไม่ใช้ Wix และ Vercel
**Made And Checked By DELTA SYNTH & Gemini AI**  
**Original by Patiphat Wongyai (Delta)**  
**Revision: 1.0**  
**Date: 16 กันยายน 2026**

---

### 1. ทำไมจึงเลือก Cloudflare Pages แทน Wix และ Vercel?

| คุณสมบัติ | Cloudflare Pages | Vercel (เดิม) | Wix (เดิม) |
| :--- | :--- | :--- | :--- |
| **Bandwidth** | **ไม่จำกัด (Unlimited)** | จำกัด 100 GB/เดือน | จำกัดตามแพ็กเกจ |
| **ความเร็วในไทย** | **Edge CDN ในกรุงเทพฯ โหลดไวสุด** | Edge ทั่วไป | โครงสร้างหนัก โหลดช้า |
| **Custom Domain** | **ฟรี 100% พร้อม SSL Auto** | ฟรี | มีค่าบริการ/ผูกมัด |
| **Security Headers** | รองรับไฟล์ `_headers` เต็มรูปแบบ | ต้องใช้ config เฉพาะ | ปรับแต่งไม่ได้ |
| **การดูแลรักษา** | อิสระ ไม่ผูกขาดกับแพลตฟอร์มปิด | คล่องตัว | ปิดกั้นโค้ด |

---

### 2. วิธีนำเว็บไซต์ขึ้น Cloudflare Pages (2 วิธีง่ายๆ)

#### วิธีที่ 1: ลากและวางโฟลเดอร์ (Direct Upload — ง่ายและเร็วที่สุด ไม่ต้องใช้ Git)
1. เข้าไปที่ [dash.cloudflare.com](https://dash.cloudflare.com/) แล้วสร้างบัญชีฟรี (หรือเข้าสู่ระบบ)
2. ไปที่เมนูด้านซ้ายเลือก **Workers & Pages** -> คลิก **Create application**
3. เลือกแถบ **Pages** -> เลือก **Upload assets**
4. ตั้งชื่อ Project Name เช่น: `delta-synth-studio`
5. ลากโฟลเดอร์ `src/public` ของโปรเจกต์ DELTA SYNTH ไปวางในช่องอัปโหลด
6. คลิก **Deploy site** เว็บไซต์จะออนไลน์ทันทีที่ `https://delta-synth-studio.pages.dev`

#### วิธีที่ 2: รันสคริปต์อัตโนมัติ 1-Click
1. ดับเบิลคลิกไฟล์ `Tools\Deploy_Cloudflare_Pages.bat`
2. ระบบจะทำการรันเทส 144 ชุดเพื่อตรวจสอบความสมบูรณ์ของโค้ดทั้งหมด (Zero Defect Verification)
3. ระบบจะทำการเรียก `npx wrangler pages deploy src/public --project-name delta-synth-studio` เพื่ออัปโหลดขึ้น Cloudflare ทันที
4. มีไฟล์บันทึกผลการทำงานที่ `Tools\Deploy_Cloudflare_Pages.log` เสมอ

---

### 3. วิธีผูกโดเมนหลัก `delta-synth-studio-th.com`

1. ในหน้า Cloudflare Dashboard ของ Project `delta-synth-studio`
2. ไปที่แท็บ **Custom domains** -> คลิก **Set up a custom domain**
3. พิมพ์ชื่อโดเมน: `delta-synth-studio-th.com` แล้วกด **Continue**
4. **การตั้งค่า DNS:**
   - **กรณีโดเมนใช้ Cloudflare DNS อยู่แล้ว:** Cloudflare จะผูก DNS CNAME ให้อัตโนมัติในคลิกเดียว
   - **กรณีจดโดเมนจาก Registrar อื่น (เช่น Namecheap, GoDaddy, Hostinger, Thaidatahosting):**
     - เพิ่ม **CNAME Record**:
       - Type: `CNAME`
       - Name: `@` (หรือ root) และ `www`
       - Target: `delta-synth-studio.pages.dev`
       - Proxy status: **Proxied (เปิดเมฆสีส้ม)**
5. รอระบบออกใบรับรอง SSL/TLS (HTTPS) ฟรีอัตโนมัติภายใน 5-15 นาที
6. เว็บไซต์จะเปิดใช้งานได้จริงผ่าน `https://delta-synth-studio-th.com` อย่างสมบูรณ์แบบ

---

### 4. ไฟล์ตั้งค่าที่เตรียมไว้ให้พร้อมแล้วในโฟลเดอร์ `src/public/`

1. **`CNAME`**: ระบุ `delta-synth-studio-th.com` สำหรับการตั้งค่าโดเมน
2. **`_headers`**: กำหนดค่า Security Headers (X-Frame-Options, X-Content-Type-Options, Referrer-Policy, CORS) และ Caching สำหรับไฟล์รูปภาพ/เสียง `assets/` และ `Voice/` ให้อยู่ใน Cache 1 ปี (โหลดเร็วระดับเสี้ยววินาที)
3. **`_redirects`**: กฎการส่งต่อ URL แบบ Clean Routing
4. **`robots.txt`**: อนุญาตให้ Search Engine (Google, Bing) ทำการจัดอันดับเว็บไซต์ได้อย่างถูกต้อง
5. **`sitemap.xml`**: แผนผังเว็บไซต์สมบูรณ์แบบ ครอบคลุมหน้าหลักทั้งหมด และหน้านักร้องทั้ง 54 เสียง ภายใต้โดเมน `https://delta-synth-studio-th.com/`

---

### 5. การรัน Backend REST API แบบ Standalone (`server.js`)
หากต้องการรัน Server ฝั่ง Backend สำหรับ API ระบบค้นหาคลังเสียง และการอัปโหลดไฟล์:
- ดับเบิลคลิก `Tools\Run_Independent_Server.bat`
- Server จะทำงานที่ `http://localhost:3000` (หรือสามารถ Deploy ขึ้น Render, Railway, VPS ได้)
- รองรับ Endpoint มาตรฐานตามหลัก RESTful API:
  - `GET /api/v1/health` — ตรวจสอบสถานะการทำงาน
  - `GET /api/v1/voicebanks` — ดึงข้อมูลแพ็กเกจคลังเสียงทั้งหมด
  - `GET /api/v1/voicebanks/:id` — ค้นหาข้อมูลคลังเสียงเฉพาะบุคคล
  - `POST /api/v1/uploads/single` — อัปโหลดไฟล์เดี่ยว (สูงสุด 100MB)
  - `POST /api/v1/uploads/multiple` — อัปโหลดหลายไฟล์พร้อมกัน
