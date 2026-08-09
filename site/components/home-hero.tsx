import Image from "next/image";
import Link from "next/link";
import { ArrowIcon, PlayIcon } from "./icons";

const heroVoices = [
  { slug: "ayanami-hikaru", name: "HIKARU", x: "hero-voice hero-a" },
  { slug: "kochujang", name: "KOCHUJANG", x: "hero-voice hero-b" },
  { slug: "guren-kani", name: "GUREN", x: "hero-voice hero-c" },
  { slug: "sun", name: "SUN", x: "hero-voice hero-d" }
];

export function HomeHero() {
  return (
    <section className="home-hero">
      <div className="signal-grid" aria-hidden="true"><i /><i /><i /><i /><i /><i /><i /><i /></div>
      <div className="hero-copy">
        <p className="eyebrow"><span /> DIGITAL VOCAL ARCHIVE · BKK / 2019—NOW</p>
        <h1><span>DELTA</span><br />SYNTH</h1>
        <p className="hero-thai">ห้องควบคุม<br />สัญญาณเสียง</p>
        <div className="hero-actions">
          <Link className="button button-primary" href="/voicebanks">ENTER THE ARCHIVE <ArrowIcon /></Link>
          <Link className="button button-secondary" href="/voicebanks?filter=demo"><PlayIcon /> LISTEN TO SIGNALS</Link>
        </div>
      </div>
      <div className="hero-cast">
        {heroVoices.map((voice) => (
          <Link key={voice.slug} href={`/voicebanks/${voice.slug}`} className={voice.x}>
            <Image src={`/assets/voicebanks/full/${voice.slug}.webp`} alt={`${voice.name} full character artwork`} fill priority sizes="35vw" />
            <span>{voice.name}</span>
          </Link>
        ))}
      </div>
      <div className="hero-monitor">
        <span>INPUT</span><b>04</b><span>VOICES</span><i /><em>REC</em>
      </div>
    </section>
  );
}
