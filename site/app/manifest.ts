import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "DELTA SYNTH — Digital Vocal Archive",
    short_name: "DELTA SYNTH",
    description: "คลังเสียงนักร้องเสมือน โปรเจกต์ และทรัพยากรของ DELTA SYNTH Studio",
    start_url: "/",
    display: "standalone",
    background_color: "#1A1A1A",
    theme_color: "#CC2200",
    categories: ["music", "entertainment"],
    icons: [{ src: "/icon", sizes: "32x32", type: "image/png" }],
  };
}
