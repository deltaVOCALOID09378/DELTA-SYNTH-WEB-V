"use client";

import { useEffect, useMemo, useState } from "react";
import type { Category, Voicebank } from "@/content/types";
import { SearchIcon } from "./icons";
import { VoicebankCard } from "./voicebank-card";

type Filter = "all" | Category | "demo";

type VoicebankExplorerProps = {
  voicebanks: Voicebank[];
  initialFilter?: Filter;
  initialProject?: { id: string; label: string };
};

export function VoicebankExplorer({ voicebanks, initialFilter = "all", initialProject }: VoicebankExplorerProps) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>(initialFilter);
  const [projectId, setProjectId] = useState<string | null>(initialProject?.id ?? null);
  const [sort, setSort] = useState<"source" | "name" | "release">("source");

  useEffect(() => setFilter(initialFilter), [initialFilter]);
  useEffect(() => setProjectId(initialProject?.id ?? null), [initialProject?.id]);

  const shown = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase();
    return voicebanks
      .filter((voicebank) => {
        const matchesQuery = !normalized || [voicebank.name, ...voicebank.aliases, voicebank.voicer ?? ""].some((field) => field.toLocaleLowerCase().includes(normalized));
        const matchesFilter = filter === "all" || (filter === "demo" ? voicebank.demos.length > 0 : voicebank.category === filter);
        const matchesProject = !projectId || voicebank.projectIds.includes(projectId);
        return matchesQuery && matchesFilter && matchesProject;
      })
      .sort((left, right) => {
        if (sort === "name") return left.name.localeCompare(right.name);
        if (sort === "release") return (right.releaseDate ?? "").localeCompare(left.releaseDate ?? "");
        return left.sourceOrder - right.sourceOrder;
      });
  }, [filter, projectId, query, sort, voicebanks]);

  return (
    <>
      <div className="archive-controls">
        <label className="search-box">
          <span className="sr-only">Search voicebanks</span>
          <SearchIcon />
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="ค้นหาชื่อ / Search name or voicer" />
        </label>
        <div className="filter-row" aria-label="Filter voicebanks">
          {(["all", "official", "collaboration", "partner", "demo"] as const).map((value) => (
            <button key={value} type="button" className={filter === value ? "active" : ""} onClick={() => setFilter(value)}>{value}</button>
          ))}
        </div>
        <label className="sort-select">SORT
          <select value={sort} onChange={(event) => setSort(event.target.value as typeof sort)}>
            <option value="source">Archive order</option>
            <option value="name">Name A–Z</option>
            <option value="release">Release date</option>
          </select>
        </label>
      </div>
      <div className="result-meta">
        <p className="result-count"><b>{String(shown.length).padStart(2, "0")}</b> RECORDS ON SIGNAL</p>
        {projectId && initialProject && (
          <button type="button" className="active-project" onClick={() => setProjectId(null)}>
            PROJECT / {initialProject.label} <span aria-hidden="true">×</span>
            <span className="sr-only">Clear project filter</span>
          </button>
        )}
      </div>
      {shown.length > 0 ? (
        <div className="voice-grid">{shown.map((voicebank, index) => <VoicebankCard key={voicebank.id} voicebank={voicebank} index={index} />)}</div>
      ) : (
        <div className="empty-state"><span>00</span><h2>ไม่พบคลื่นเสียงที่ตรงกัน</h2><p>No matching voicebank. Try another name or clear the active filter.</p><button type="button" onClick={() => { setQuery(""); setFilter("all"); setProjectId(null); }}>CLEAR FILTERS</button></div>
      )}
    </>
  );
}
