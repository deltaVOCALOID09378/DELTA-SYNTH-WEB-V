import type { Metadata } from "next";
import Image from "next/image";
import { publicContact } from "@/content/site";

export const metadata: Metadata = { title: "About the Studio", description: "DELTA SYNTH story, mission, workflow and public contact." };

const founders = [
  { name: "Ayanami Hikaru", role: "DELTA No.01 · DELTA SYNTH / Patiphat Wongyai", image: "ayanami-hikaru" },
  { name: "SUN", role: "DELTA No.02 · Voicer: SunZERO5", image: "sun" },
  { name: "Kochujang", role: "DELTA No.03 · Voicer: TangmoThipphawan", image: "kochujang" },
  { name: "Guren Kani", role: "DELTA No.04 · Voicer: MikiBlackqueen", image: "guren-kani" }
];

export default function AboutPage() {
  return (
    <div className="about-page">
      <header className="about-hero page-shell">
        <p className="eyebrow">STUDIO IDENTITY / ตัวตนของเรา</p>
        <h1>เสียงของผู้คน<br /><span>ที่กลายเป็นอนาคต</span></h1>
        <div className="about-intro"><b>THAILAND<br />2019—NOW</b><p>ค่าย DELTA SYNTH ก่อตั้งขึ้นในประเทศไทยเมื่อปี พ.ศ. 2562 จากสมาชิกกลุ่มแรก 4 คน ก่อนเติบโตเป็นเครือข่ายโปรเจกต์และความร่วมมือกับครีเอเตอร์ทั้งไทยและต่างชาติ</p><p>DELTA SYNTH began in Thailand in 2019 with four founding voices. It has grown into an open creative network spanning voice creation, tuning, character art and cross-border collaboration.</p></div>
      </header>
      <section className="founder-section section-pad">
        <div className="section-head"><div><p className="eyebrow">THE FIRST PROJECT</p><h2>B.L. STUDENT<br />FOUNDING SIGNALS</h2></div><p>ผู้ร่วมสร้างและเสียงต้นทางที่ทำให้สตูดิโอเริ่มต้นขึ้น</p></div>
        <div className="founder-list">{founders.map((founder, index) => <article key={founder.name}><div><Image src={`/assets/voicebanks/profile/${founder.image}.webp`} alt={`${founder.name} character artwork`} fill sizes="(max-width: 700px) 50vw, 25vw" /></div><span>0{index + 1}</span><h3>{founder.name}</h3><p>{founder.role}</p></article>)}</div>
      </section>
      <section className="workflow section-pad">
        <div><p className="eyebrow">WORKFLOW / กระบวนการ</p><h2>PRESERVE<br />→ DEVELOP<br />→ SHARE</h2></div>
        <ol><li><span>01</span><div><b>VOICE & INTENT</b><p>เก็บเสียงและเจตนาของผู้ให้เสียงเป็นจุดอ้างอิงหลัก</p></div></li><li><span>02</span><div><b>BUILD & REFINE</b><p>พัฒนาคลังเสียง ปรับจูน และทดสอบการร้องอย่างเป็นระบบ</p></div></li><li><span>03</span><div><b>ART & IDENTITY</b><p>เชื่อมเสียงกับงานออกแบบตัวละครและเครดิตผู้สร้าง</p></div></li><li><span>04</span><div><b>RELEASE & ARCHIVE</b><p>เผยแพร่ผลงานพร้อมเก็บข้อมูลเพื่อการพัฒนารุ่นถัดไป</p></div></li></ol>
      </section>
      <section className="timeline-section section-pad">
        <p className="eyebrow">TIMELINE</p>
        <div className="timeline"><article><b>2019</b><h3>FOUNDING</h3><p>B.L. Student and the first four voices establish DELTA SYNTH.</p></article><article><b>2021—22</b><h3>EXPANSION</h3><p>New collaborators, voicers and project families join the archive.</p></article><article><b>2023—25</b><h3>NETWORK</h3><p>Partner voices and creator collaborations broaden the studio signal.</p></article><article><b>NOW</b><h3>UPGRADE</h3><p>UTAU preservation and DiffSinger research continue.</p></article></div>
      </section>
      <section className="about-contact" id="contact"><p className="eyebrow">PUBLIC CONTACT / ติดต่อ</p><h2>LET&apos;S MAKE<br />THE NEXT SIGNAL.</h2><a href={`mailto:${publicContact}`}>{publicContact}</a><p>สำหรับงานคอลแลป เครดิต ดาวน์โหลด และการสนับสนุนไฟล์ / Collaboration, credit, download and archive support.</p></section>
    </div>
  );
}
