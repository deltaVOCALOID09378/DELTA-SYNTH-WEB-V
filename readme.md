# DELTA SYNTH Official Website

> 🌌 **The Official Voicebank & Artist Portfolio Website for DELTA SYNTH**

Welcome to the official repository of the DELTA SYNTH website! This project is the central hub for our artists, voicebanks (UTAU/SynthV/etc.), and community resources.

## 🚀 Project Overview (ภาพรวมโปรเจกต์)
เว็บไซต์นี้ถูกพัฒนาและออกแบบใหม่ทั้งหมดให้เป็นระบบ Static Site (HTML/CSS) โดยมุ่งเน้นไปที่ความเร็ว ความสวยงามระดับพรีเมียม และประสบการณ์ผู้ใช้ที่ดีที่สุด (UX/UI):
- **Space Theme & Glassmorphism:** การออกแบบส่วนต่อประสานกับผู้ใช้ (UI) ที่เน้นความมืดแบบอวกาศ แสงเรืองรอง และกระจกโปร่งแสง
- **Bilingual Support:** รองรับสองภาษา (ภาษาไทยและภาษาอังกฤษ) ในทุกหน้าจอ ควบคุมผ่านฟอนต์ Kanit/Sarabun และ Inter อย่างลงตัว
- **Centralized Voicebank Links:** รวบรวมระบบดาวน์โหลดเสียงของนักร้องกว่า 50 ชีวิต ไว้ที่ Google Drive ส่วนกลาง เพื่อง่ายต่อการบำรุงรักษา
- **Hosted on Vercel:** โฮสต์ผ่าน Vercel เพื่อความรวดเร็วในการส่งผ่านข้อมูลระดับโลก (Edge Network)

## 📁 System Architecture (สถาปัตยกรรมระบบ)
หากคุณเป็นผู้พัฒนา หรือ AI Agent ที่เข้ามาสานต่อโปรเจกต์ โปรดอ้างอิงโครงสร้างระบบผ่านไฟล์เหล่านี้เพื่อทำความเข้าใจ:
1. `AGENT.md`: **[สำคัญที่สุด]** กฎเกณฑ์และข้อบังคับสูงสุดในการเขียนโค้ดและพัฒนาโปรเจกต์
2. `The Source Code of System File's Name Mapping.md`: แผนผัง Mind Map ระบุไฟล์วิกฤตของระบบที่ห้ามลบ
3. `All File Mapping.md`: สารบัญแสดง Path และตำแหน่งของไฟล์ทั้งหมดในหน้าบ้านและหลังบ้าน
4. `DELTA_SYNTH_Core_Reference.md`: เอกสารอ้างอิงศูนย์กลางตามทฤษฎีการพัฒนา
5. `Research_and_Development_Report.md`: ประวัติและพัฒนาการของระบบทั้งหมด

## 🛠️ Development & Deployment
เว็บไซต์นี้ถูกตั้งค่าให้ Deploy ผ่าน Vercel
- **Live Website:** `https://public-woad-tau.vercel.app` (สามารถผูกโดเมน `deltasynth.com` ได้ผ่านระบบ Vercel)
- หากต้องการอัปเดตเว็บ ให้ใช้คำสั่ง `npx vercel --prod` ในโฟลเดอร์ `src/public`
- ไฟล์สคริปต์ช่วยพัฒนาสำหรับ Agent จะเก็บไว้ที่ `All Editing File For Agent` 

---
*Made with ❤️ by DELTA SYNTH & AI Agents*
