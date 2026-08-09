import type { MetadataRoute } from "next";
import { voicebanks } from "@/content/voicebanks";
import { siteOrigin } from "@/lib/site-origin";

export default function sitemap(): MetadataRoute.Sitemap {
  return ["", "/voicebanks", "/projects", "/resources", "/events", "/about"]
    .map((path) => ({ url: `${siteOrigin}${path}`, changeFrequency: "monthly" as const }))
    .concat(voicebanks.map(({ slug }) => ({ url: `${siteOrigin}/voicebanks/${slug}`, changeFrequency: "monthly" as const })));
}
