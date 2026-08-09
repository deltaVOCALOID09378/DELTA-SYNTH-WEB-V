import Link from "next/link";
import { publicContact } from "@/content/site";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="footer-mark">DELTA<br />SYNTH</div>
      <div>
        <p className="eyebrow">PUBLIC SIGNAL / ติดต่อ</p>
        <a href={`mailto:${publicContact}`}>{publicContact}</a>
        <p className="muted">Thailand · Active since 2019</p>
      </div>
      <nav aria-label="Footer navigation">
        <Link href="/voicebanks">Voicebank Archive</Link>
        <Link href="/projects">Projects</Link>
        <Link href="/resources">Resources</Link>
        <Link href="/about">Studio & Contact</Link>
      </nav>
      <div className="footer-credits">
        <p>© {new Date().getFullYear()} DELTA SYNTH</p>
        <p>Original creators, voicers and artists retain their credited work.</p>
      </div>
    </footer>
  );
}
