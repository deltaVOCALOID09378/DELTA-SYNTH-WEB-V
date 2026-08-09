"use client";

import { useMemo, useState } from "react";
import { SearchIcon } from "@/components/icons";
import { resources } from "@/content/site";

export default function ResourcesPage() {
  const [query, setQuery] = useState("");
  const [format, setFormat] = useState("ALL");
  const shown = useMemo(() => resources.filter((resource) => (!query || resource.title.toLocaleLowerCase().includes(query.toLocaleLowerCase())) && (format === "ALL" || resource.formats.includes(format))), [format, query]);
  return (
    <div className="resources-page page-shell">
      <header className="page-title split-title">
        <div><p className="eyebrow">PROJECT FILE INDEX</p><h1>SONG<br /><span>RESOURCES</span></h1></div>
        <p>ดัชนีรายการไฟล์โปรเจกต์จากเว็บไซต์เดิม เราจะแสดงปุ่มดาวน์โหลดต่อเมื่อยืนยัน URL และเครดิตต้นทางแล้ว เพื่อไม่ส่งผู้ใช้ไปยังลิงก์เสียหรือไฟล์ผิด</p>
      </header>
      <div className="file-guide">
        <b>FORMAT GUIDE</b>
        <span><strong>USTX</strong> OpenUtau project</span>
        <span><strong>SVP</strong> Synthesizer V project</span>
        <span><strong>MIDI</strong> Note & timing data</span>
        <span><strong>VSQX</strong> VOCALOID project</span>
      </div>
      <div className="archive-controls resources-controls">
        <label className="search-box"><span className="sr-only">Search resources</span><SearchIcon /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="ค้นหาชื่อเพลง / Search title" /></label>
        <div className="filter-row">{["ALL", "USTX", "SVP", "MIDI", "VSQX"].map((item) => <button key={item} className={format === item ? "active" : ""} type="button" onClick={() => setFormat(item)}>{item}</button>)}</div>
      </div>
      <div className="resource-table" role="table" aria-label="Project files">
        <div className="resource-row resource-header" role="row"><span>NO.</span><span>TITLE</span><span>FORMAT</span><span>STATUS</span></div>
        {shown.map((resource, index) => <div className="resource-row" role="row" key={resource.id}><span>{String(index + 1).padStart(2, "0")}</span><strong>{resource.title}</strong><span>{resource.formats.join(" / ")}</span><span className="pending">อยู่ระหว่างยืนยัน / VERIFYING</span></div>)}
      </div>
      {!shown.length && <div className="empty-state"><span>00</span><h2>ไม่พบไฟล์ที่ตรงกัน</h2><p>No resource matches this search and format.</p></div>}
    </div>
  );
}
