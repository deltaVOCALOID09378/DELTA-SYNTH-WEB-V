# PROJECT CONTEXT: DELTA_SYNTH-main

## 📌 Progress (ความคืบหน้า)
- โครงการมี WebUI และหน้าเว็บไซด์หลักสำหรับนำเสนอ ซึ่งถูกพัฒนาโดยใช้ Next.js ตั้งอยู่ในโฟลเดอร์ `site/`
- โครงการได้ถูกตั้งค่าการ Deploy บน Vercel ภายใต้โปรเจกต์ `delta-synth-th-official` 
- การ Deploy แบบ Production ถูกย้ายโฟลเดอร์ราก (Root Directory) สำหรับ Vercel มาอยู่ที่ `site/` สำเร็จ ทำให้เรียกใช้งานรูปภาพและ CSS (Asset) ได้อย่างถูกต้อง
- โดเมน `deltasynth.com` ถูกเชื่อมต่อ (Alias) เข้ากับ Vercel Project แล้ว
- ได้ทำการอัปเกรด Next.js เป็นเวอร์ชันล่าสุดเพื่ออุดช่องโหว่ (Vulnerability) และปลดล็อกการ Deploy

## 🗂️ Structure (โครงสร้าง)
- `/site`: โฟลเดอร์หลักสำหรับ Web Application ที่เป็น Next.js
- `/site/app`: โค้ดสำหรับหน้าต่างๆ ของเว็บหลัก (App Router)
- `/site/public/assets`: ไฟล์รูปภาพ (เช่น voicebanks), stylesheet, และ static assets ต่างๆ
- `/.vercel`: โฟลเดอร์การตั้งค่าการเชื่อมต่อของ Vercel CLI (Auto-generated)

## ⚙️ Systems (ระบบ)
- **Frontend Framework:** Next.js 16.3 (ใช้ Turbopack สำหรับบิลด์)
- **Hosting / Deployment:** Vercel (ผ่าน Vercel CLI `npx vercel`)
- **Package Manager:** npm

## 📦 Dependencies (ไลบรารีสำคัญ)
- Next.js: `16.3.0`
- React / React DOM
- Vercel CLI

## ⏳ Pending Tasks (งานค้าง)
- **404 NOT_FOUND Issue:** แก้ไขปัญหาเว็บไซต์ตอบกลับด้วย `404: NOT_FOUNDCode: NOT_FOUNDID: sin1::5bqkz-1786254870112-de7e9d81fe27` ซึ่งเกิดขึ้นหลังจากการ Deploy และการรออัปเดตระบบ
- **DNS Verification:** ยืนยันว่าฝั่งผู้ใช้งานได้ตั้งค่า DNS A Record ของ `deltasynth.com` ไปที่ IP `76.76.21.21` หรือได้เปลี่ยน Nameservers เป็น `ns1.vercel-dns.com` / `ns2.vercel-dns.com` แล้วอย่างสมบูรณ์
