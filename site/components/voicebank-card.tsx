import Image from "next/image";
import Link from "next/link";
import type { Voicebank } from "@/content/types";
import { ArrowIcon } from "./icons";

export function VoicebankCard({ voicebank, index }: { voicebank: Voicebank; index: number }) {
  return (
    <article className="voice-card">
      <Link href={`/voicebanks/${voicebank.slug}`} className="voice-card-image" aria-label={`Open ${voicebank.name} profile`}>
        <Image src={voicebank.profileImage} alt={`${voicebank.name} character artwork`} fill sizes="(max-width: 680px) 50vw, (max-width: 1100px) 33vw, 25vw" />
        <span className="card-index">{String(index + 1).padStart(2, "0")}</span>
      </Link>
      <div className="voice-card-body">
        <div>
          <span className="status-dot" data-status={voicebank.status} />
          <span className="mono">{voicebank.category.toUpperCase()} · {voicebank.status.toUpperCase()}</span>
        </div>
        <h3><Link href={`/voicebanks/${voicebank.slug}`}>{voicebank.name}</Link></h3>
        <p>{voicebank.voicer ? `VOICER / ${voicebank.voicer}` : "CREDIT / อยู่ระหว่างรวบรวม"}</p>
        <Link className="inline-link" href={`/voicebanks/${voicebank.slug}`}>PROFILE <ArrowIcon size={15} /></Link>
      </div>
    </article>
  );
}
