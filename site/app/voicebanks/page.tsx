import type { Metadata } from "next";
import { VoicebankExplorer } from "@/components/voicebank-explorer";
import { projects } from "@/content/site";
import type { Category } from "@/content/types";
import { voicebanks } from "@/content/voicebanks";

export const metadata: Metadata = { title: "Voicebank Archive", description: "Search the complete DELTA SYNTH singer and voicebank roster." };

type VoicebanksPageProps = {
  searchParams: Promise<{ filter?: string | string[]; project?: string | string[] }>;
};

const filters = new Set<Category | "all" | "demo">(["all", "official", "collaboration", "partner", "demo"]);

function firstValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function VoicebanksPage({ searchParams }: VoicebanksPageProps) {
  const params = await searchParams;
  const requestedFilter = firstValue(params.filter);
  const requestedProject = firstValue(params.project);
  const initialFilter = requestedFilter && filters.has(requestedFilter as Category | "all" | "demo")
    ? requestedFilter as Category | "all" | "demo"
    : "all";
  const initialProject = projects.find((project) => project.id === requestedProject);

  return (
    <div className="archive-page page-shell">
      <header className="page-title">
        <p className="eyebrow">CATALOG / คลังนักร้อง</p>
        <h1>VOICEBANK<br /><span>ARCHIVE</span></h1>
        <p>รายชื่อนักร้องและผู้ร่วมงานทั้งหมดที่มีชุดภาพอ้างอิงในคลัง DELTA SYNTH ข้อมูลที่ยังตรวจสอบไม่ครบจะระบุไว้อย่างตรงไปตรงมา</p>
      </header>
      <VoicebankExplorer
        voicebanks={voicebanks}
        initialFilter={initialFilter}
        initialProject={initialProject ? { id: initialProject.id, label: initialProject.title.en } : undefined}
      />
    </div>
  );
}
