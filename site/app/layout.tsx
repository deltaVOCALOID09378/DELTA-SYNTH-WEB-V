import type { Metadata, Viewport } from "next";
import "./globals.css";
import { LanguageProvider } from "@/components/language-provider";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { siteOrigin } from "@/lib/site-origin";

export const metadata: Metadata = {
  metadataBase: new URL(siteOrigin),
  title: { default: "DELTA SYNTH — Digital Vocal Archive", template: "%s · DELTA SYNTH" },
  description: "คลังเสียงนักร้องเสมือน โปรเจกต์ และทรัพยากรของ DELTA SYNTH Studio — Thailand, founded 2019.",
  applicationName: "DELTA SYNTH",
  alternates: { canonical: "/" },
  manifest: "/manifest.webmanifest",
  openGraph: {
    title: "DELTA SYNTH — Digital Vocal Archive",
    description: "A living archive of virtual voices, collaborations and project resources.",
    url: "/",
    siteName: "DELTA SYNTH",
    locale: "th_TH",
    alternateLocale: ["en_US"],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "DELTA SYNTH — Digital Vocal Archive",
    description: "A living archive of virtual voices, collaborations and project resources.",
  },
};

export const viewport: Viewport = {
  themeColor: "#1A1A1A",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="th">
      <body>
        <LanguageProvider>
          <a className="skip-link" href="#main-content">ข้ามไปยังเนื้อหา / Skip to content</a>
          <SiteHeader />
          <main id="main-content">{children}</main>
          <SiteFooter />
        </LanguageProvider>
      </body>
    </html>
  );
}
