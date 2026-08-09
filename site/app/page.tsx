import Image from "next/image";
import Link from "next/link";
import { HomeHero } from "@/components/home-hero";
import { ArrowIcon } from "@/components/icons";
import { VoicebankCard } from "@/components/voicebank-card";
import { projects, resources } from "@/content/site";
import { voicebanks } from "@/content/voicebanks";

export default function HomePage() {
  const demoCount = voicebanks.reduce((sum, voicebank) => sum + voicebank.demos.length, 0);
  const featured = voicebanks.filter((voicebank) => ["ayanami-hikaru", "sun", "kochujang", "ayanami-kyoko"].includes(voicebank.slug));
  return (
    <>
      <HomeHero />
      <section className="frequency-strip" aria-label="Archive metrics">
        <div><span>ROSTER FREQUENCY</span><b>{voicebanks.length}</b><em>VOICE IDENTITIES</em></div>
        <div><span>DEMO SIGNALS</span><b>{demoCount}</b><em>LOCAL RECORDINGS</em></div>
        <div><span>PROJECT FAMILIES</span><b>{projects.length}</b><em>ARCHIVE GROUPS</em></div>
        <Link href="/voicebanks">SCAN ALL <ArrowIcon /></Link>
      </section>

      <section className="statement section-pad">
        <div className="section-number">01</div>
        <div>
          <p className="eyebrow">STUDIO STATEMENT / คำประกาศจากสตูดิโอ</p>
          <h2>เสียงทุกเสียงมี<br />ที่มา มีผู้สร้าง<br />และมีอนาคต</h2>
        </div>
        <div className="statement-copy">
          <p>DELTA SYNTH คือสตูดิโอนักร้องเสมือนจากประเทศไทย ก่อตั้งในปี 2019 เรารวบรวมเสียง ตัวละคร และประสบการณ์จากผู้คนรอบตัวมาสร้างเป็นคลังเสียงที่เปิดกว้างต่อการทดลอง</p>
          <p>Founded in Thailand in 2019, DELTA SYNTH develops virtual voices through collaboration—connecting voicers, artists, producers and communities across borders.</p>
          <Link className="inline-link" href="/about">READ OUR STORY <ArrowIcon /></Link>
        </div>
      </section>

      <section className="featured section-pad">
        <div className="section-head">
          <div><p className="eyebrow">SELECTED SIGNALS</p><h2>เสียงแนะนำ<br /><span>Featured voices</span></h2></div>
          <Link className="inline-link" href="/voicebanks">VIEW COMPLETE ARCHIVE <ArrowIcon /></Link>
        </div>
        <div className="voice-grid featured-grid">{featured.map((voicebank, index) => <VoicebankCard key={voicebank.id} voicebank={voicebank} index={index} />)}</div>
      </section>

      <section className="now-panel section-pad">
        <div className="now-image">
          <Image src="/assets/voicebanks/full/fellowwhite.webp" alt="FellowWhite character artwork" fill sizes="(max-width: 800px) 100vw, 42vw" />
          <span>LIVE ARCHIVE / 2025—2026</span>
        </div>
        <div className="now-copy">
          <p className="eyebrow"><i /> CURRENT ACTIVITY / กำลังดำเนินการ</p>
          <h2>UPGRADE<br />THE VOICE.</h2>
          <p>การทดลองและอัปเกรดนักร้อง UTAU สู่ DiffSinger ดำเนินต่อผ่านความร่วมมือกับพาร์ตเนอร์และครีเอเตอร์ โดยมุ่งพัฒนาคุณภาพการร้องหลายภาษาอย่างเป็นขั้นตอน</p>
          <p className="muted">UTAU-to-DiffSinger research continues with partners and creators. Confirmed release details will be added to the archive when ready.</p>
          <Link className="button button-primary" href="/projects">EXPLORE PROJECTS <ArrowIcon /></Link>
        </div>
      </section>

      <section className="resource-preview section-pad">
        <div className="section-head"><div><p className="eyebrow">PROJECT FILE INDEX</p><h2>TOOLS FOR<br />THE NEXT SONG</h2></div><p>รายการไฟล์ USTX / SVP ที่ปรากฏในคลังเดิม ลิงก์ดาวน์โหลดจะเปิดใช้งานเมื่อผ่านการตรวจสอบต้นทางแล้ว</p></div>
        <ol>{resources.slice(0, 5).map((resource, index) => <li key={resource.id}><span>{String(index + 1).padStart(2, "0")}</span><b>{resource.title}</b><em>{resource.formats.join(" + ")}</em><small>VERIFYING SOURCE</small></li>)}</ol>
        <Link className="inline-link" href="/resources">OPEN RESOURCE INDEX <ArrowIcon /></Link>
      </section>

      <section className="contact-band">
        <p>HAVE A VOICE · HAVE A PROJECT · HAVE A SIGNAL</p>
        <h2>มาสร้างเสียง<br />ไปด้วยกัน</h2>
        <a className="button button-light" href="mailto:delta.vocaloid09378@gmail.com">COLLABORATE WITH US <ArrowIcon /></a>
      </section>
    </>
  );
}
