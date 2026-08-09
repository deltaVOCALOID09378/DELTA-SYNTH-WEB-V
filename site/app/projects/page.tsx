import type { Metadata } from "next";
import Link from "next/link";
import { ArrowIcon } from "@/components/icons";
import { projects } from "@/content/site";

export const metadata: Metadata = { title: "Projects", description: "Nine DELTA SYNTH studio project families and collaborations." };

export default function ProjectsPage() {
  return (
    <div className="projects-page page-shell">
      <header className="page-title split-title">
        <div><p className="eyebrow">PROJECT ARCHIVE / แผนผังความร่วมมือ</p><h1>NINE<br /><span>FAMILIES</span></h1></div>
        <p>โปรเจกต์ของ DELTA SYNTH เติบโตจากผู้คนจริง—เพื่อน ศิลปิน นักพากย์ ผู้ร่วมงาน และชุมชนทั้งไทยและต่างประเทศ โครงสร้างนี้ยึดตามหมวดหมู่ในคลังต้นฉบับ</p>
      </header>
      <div className="project-ledger">
        {projects.map((project) => (
          <article key={project.id}>
            <span className="project-no">{project.number}</span>
            <div><p className="mono">ARCHIVE FAMILY / {project.id.toUpperCase()}</p><h2>{project.title.th}</h2><h3>{project.title.en}</h3></div>
            <p>{project.description.th}<br /><span>{project.description.en}</span></p>
            <Link href={`/voicebanks?project=${project.id}`} aria-label={`View voices in ${project.title.en}`}><ArrowIcon /></Link>
          </article>
        ))}
      </div>
      <aside className="source-note"><b>SOURCE NOTE</b><p>รายชื่อกลุ่มอ้างอิงจากโฟลเดอร์ “All The Project for Singer in My Works” สมาชิกแต่ละกลุ่มจะทยอยเชื่อมเมื่อผ่านการตรวจสอบชื่อและเครดิตครบถ้วน</p></aside>
    </div>
  );
}
