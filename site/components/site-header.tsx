"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useLanguage } from "./language-provider";

const routes = [
  { href: "/", th: "หน้าหลัก", en: "Index" },
  { href: "/voicebanks", th: "คลังเสียง", en: "Voicebanks" },
  { href: "/projects", th: "โปรเจกต์", en: "Projects" },
  { href: "/resources", th: "ไฟล์", en: "Resources" },
  { href: "/events", th: "กิจกรรม", en: "Events" },
  { href: "/about", th: "เกี่ยวกับ", en: "About" }
];

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const { language, setLanguage } = useLanguage();
  const current = routes.find((route) => route.href !== "/" && pathname.startsWith(route.href)) ?? routes[0];

  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    if (!open) return;

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        menuButtonRef.current?.focus();
      }
    };

    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [open]);

  return (
    <header className="site-header">
      <div className="header-inner">
        <Link className="wordmark" href="/" aria-label="DELTA SYNTH home">
          <span className="wordmark-delta">DELTA</span><span>SYNTH</span>
        </Link>
        <span className="route-indicator"><b>●</b> {language === "th" ? current.th : current.en}</span>
        <nav id="site-navigation" className={open ? "main-nav is-open" : "main-nav"} aria-label="Primary navigation">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              aria-current={(route.href === "/" ? pathname === "/" : pathname.startsWith(route.href)) ? "page" : undefined}
            >
              {language === "th" ? route.th : route.en}
            </Link>
          ))}
        </nav>
        <div className="header-actions">
          <div className="language-switch" role="group" aria-label="Language">
            <button type="button" className={language === "th" ? "active" : ""} onClick={() => setLanguage("th")} aria-pressed={language === "th"}>TH</button>
            <span>/</span>
            <button type="button" className={language === "en" ? "active" : ""} onClick={() => setLanguage("en")} aria-pressed={language === "en"}>EN</button>
          </div>
          <button ref={menuButtonRef} className="menu-toggle" type="button" aria-expanded={open} aria-controls="site-navigation" onClick={() => setOpen((value) => !value)}>
            <span className="sr-only">{open ? "Close menu" : "Open menu"}</span><i /><i />
          </button>
        </div>
      </div>
    </header>
  );
}
