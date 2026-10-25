# DELTA SYNTH — AI Agent Commands & Workspace Archive
## ระบบจัดเก็บไฟล์คำสั่ง และไฟล์ประวัติการพัฒนาโครงการ

[TH] **คลังจัดเก็บไฟล์เครื่องมือและข้อมูลประวัติของ AI Agent ประจำโปรเจกต์ DELTA SYNTH**  
โฟลเดอร์นี้จัดทำขึ้นตามมาตรฐาน `/agent-workspace-archive` เพื่อจัดระเบียบพื้นที่การทำงาน (Workspace Hygiene) ให้อยู่ในสถานะที่สะอาดตา ลดการรบกวนของไฟล์ Batch สคริปต์สำรอง ไฟล์บันทึกการนำทาง และโฟลเดอร์สำรองข้อมูลเก่า โดยไม่ลบข้อมูลสำคัญทิ้งอย่างถาวร

### โครงสร้างโฟลเดอร์ (Directory Structure)
- **`Command_Runners/`**: รวบรวมสคริปต์รันคำสั่งประจำตัว (.bat) เช่น สคริปต์ Deploy, สคริปต์ Sync กับ GitHub และสคริปต์ Cleanup ช่วยให้ Root Directory คงความสะอาดตามมาตรฐานสากล
- **`Unused_Files/`**: รวบรวมไฟล์ประวัติการแก้ไขในอดีต (History/Changelogs), ผังชื่อไฟล์เก่า (Mapping docs), ซอร์สโค้ดสำรอง (Nested legacy snapshots) และไฟล์ Log ที่ไม่ได้ใช้งานในโหมด Production

---

[EN] **AI Agent Tools, Command Runners & Historical Archive for DELTA SYNTH**  
This directory is structured under the `/agent-workspace-archive` protocol to maintain strict workspace hygiene. It isolates development batch runners, legacy prompt dumps, path mapping drafts, and obsolete snapshots away from the production source tree while preserving all historical artifacts for auditing.

### Contents:
- **`Command_Runners/`**: Auxiliary shell and Windows batch automation scripts.
- **`Unused_Files/`**: Historical markdown maps, legacy project clones, and offline build logs.

*Maintained by DELTA SYNTH & All Code Agentic AI Engine*
