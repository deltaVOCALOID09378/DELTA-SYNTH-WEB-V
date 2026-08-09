import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowIcon, PlayIcon } from "@/components/icons";
import { getVoicebank, voicebanks } from "@/content/voicebanks";

type PageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return voicebanks.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const voicebank = getVoicebank(slug);
  return voicebank ? { title: voicebank.name, description: `${voicebank.name} — DELTA SYNTH voicebank archive profile.` } : {};
}

function Fact({ label, value }: { label: string; value: string | number | null }) {
  return <div><dt>{label}</dt><dd>{value ?? "อยู่ระหว่างรวบรวม / To be confirmed"}</dd></div>;
}

export default async function VoicebankProfilePage({ params }: PageProps) {
  const { slug } = await params;
  const voicebank = getVoicebank(slug);
  if (!voicebank) notFound();
  const related = voicebanks.filter((candidate) => candidate.slug !== voicebank.slug && (candidate.category === voicebank.category || candidate.projectIds.some((id) => voicebank.projectIds.includes(id)))).slice(0, 4);

  return (
    <article className="profile-page">
      <header className="profile-hero">
        <div className="profile-art">
          <Image src={voicebank.fullImage} alt={`${voicebank.name} full-body character artwork`} fill priority sizes="(max-width: 800px) 100vw, 50vw" />
          <span className="profile-index">DS—{String(voicebank.sourceOrder + 1).padStart(3, "0")}</span>
        </div>
        <div className="profile-title">
          <p className="eyebrow"><i /> {voicebank.category.toUpperCase()} SIGNAL · {voicebank.status.toUpperCase()}</p>
          <h1>{voicebank.name}</h1>
          {voicebank.aliases.length > 0 && <p className="aliases">ALIASES / {voicebank.aliases.join(" · ")}</p>}
          <dl className="profile-quick">
            <Fact label="VOICER" value={voicebank.voicer} />
            <Fact label="ENGINE" value={voicebank.engine} />
            <Fact label="VOICE RANGE" value={voicebank.vocalRange} />
            <Fact label="RELEASE" value={voicebank.releaseDate} />
          </dl>
          <div className="profile-buttons">
            {voicebank.demos.length > 0 && <a className="button button-primary" href="#voice-demos"><PlayIcon /> LISTEN</a>}
            <span className="button button-disabled" aria-disabled="true">DOWNLOAD TO BE VERIFIED</span>
          </div>
        </div>
      </header>

      <div className="profile-content page-shell">
        <section className="profile-facts">
          <div><p className="eyebrow">PROFILE DATA</p><h2>ข้อมูลประจำเสียง</h2></div>
          <dl>
            <Fact label="AGE" value={voicebank.age} />
            <Fact label="GENDER" value={voicebank.gender} />
            <Fact label="HEIGHT" value={voicebank.heightCm ? `${voicebank.heightCm} cm` : null} />
            <Fact label="WEIGHT" value={voicebank.weightKg ? `${voicebank.weightKg} kg` : null} />
            <Fact label="BIRTHDAY" value={voicebank.birthday} />
            <Fact label="LANGUAGES" value={voicebank.languages.length ? voicebank.languages.join(", ") : null} />
            <Fact label="GENRES" value={voicebank.genres.length ? voicebank.genres.join(", ") : null} />
          </dl>
        </section>

        <section className="profile-story">
          <p className="eyebrow">ARCHIVE NOTE / บันทึกประจำคลัง</p>
          {voicebank.biography ? <><h2>{voicebank.biography.th}</h2><p>{voicebank.biography.en}</p></> : <><h2>เรื่องราวอยู่ระหว่างการตรวจสอบต้นฉบับ</h2><p>To preserve creator intent, this archive does not substitute generated biography text for missing source material. Confirmed details will be added with attribution.</p></>}
        </section>

        <section className="demo-section" id="voice-demos">
          <div className="section-head"><div><p className="eyebrow">VOICE SIGNALS</p><h2>AUDIO DEMOS</h2></div><p>เสียงตัวอย่างจากไฟล์เดิมในคลัง ไม่มีการเล่นอัตโนมัติ</p></div>
          {voicebank.demos.length ? <div className="demo-list">{voicebank.demos.map((demo, index) => <div key={demo.id}><span>{String(index + 1).padStart(2, "0")}</span><b>{demo.title}</b><audio controls preload="none" src={demo.src}>Your browser does not support audio.</audio></div>)}</div> : <div className="quiet-state">ยังไม่พบไฟล์เสียงตัวอย่างที่จับคู่ได้ / No verified local demo mapped yet.</div>}
        </section>

        <section className="related-section">
          <div className="section-head"><div><p className="eyebrow">RELATED FREQUENCIES</p><h2>เสียงใกล้เคียงในคลัง</h2></div><Link className="inline-link" href="/voicebanks">ALL VOICES <ArrowIcon /></Link></div>
          <div className="related-list">{related.map((item) => <Link key={item.id} href={`/voicebanks/${item.slug}`}><Image src={item.profileImage} alt="" width={84} height={84} /><span><small>{item.category}</small><b>{item.name}</b></span><ArrowIcon /></Link>)}</div>
        </section>
      </div>
    </article>
  );
}
