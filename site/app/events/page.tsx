import type { Metadata } from "next";
import Link from "next/link";
import { ArrowIcon } from "@/components/icons";

export const metadata: Metadata = { title: "Events", description: "DELTA SYNTH activities and verified event schedule." };

export default function EventsPage() {
  return (
    <div className="events-page page-shell">
      <header className="page-title split-title"><div><p className="eyebrow">EVENT SIGNAL</p><h1>ON<br /><span>AIR</span></h1></div><p>ตารางกิจกรรมจะแสดงเฉพาะข้อมูลที่ยืนยันวัน เวลา และต้นทางได้ เพื่อให้ผู้ติดตามวางแผนได้อย่างถูกต้อง</p></header>
      <section className="event-empty">
        <div className="event-radar" aria-hidden="true"><i /><i /><i /><b /></div>
        <div><p className="eyebrow"><span /> UPCOMING / กิจกรรมถัดไป</p><h2>ยังไม่มีกำหนดการยืนยัน</h2><p>No verified upcoming event is available in the local archive. Dynamic Wix event records were not included in the saved export.</p><Link className="button button-primary" href="/about#contact">FOLLOW THE STUDIO <ArrowIcon /></Link></div>
      </section>
      <section className="activity-log"><div><p className="eyebrow">ACTIVITY ARCHIVE</p><h2>บันทึกการเคลื่อนไหว</h2></div><ol><li><time>2025</time><div><b>DiffSinger upgrade research</b><p>การทดลองอัปเกรดคลังเสียง UTAU ร่วมกับพาร์ตเนอร์และครีเอเตอร์</p></div><span>ONGOING</span></li><li><time>2019</time><div><b>DELTA SYNTH founded</b><p>จุดเริ่มต้นของ B.L. Student และทีมผู้ก่อตั้ง</p></div><span>ARCHIVED</span></li></ol></section>
    </div>
  );
}
