import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
  },
  async redirects() {
    return [
      { source: "/character", destination: "/voicebanks", permanent: true },
      { source: "/ust-and-vsqx", destination: "/resources", permanent: true },
      { source: "/about-1-1", destination: "/about", permanent: true },
      { source: "/event-list", destination: "/events", permanent: true },
      { source: "/voicebank.html", destination: "/voicebanks", permanent: true },
      { source: "/project.html", destination: "/projects", permanent: true },
      { source: "/about.html", destination: "/about", permanent: true }
    ];
  }
};

export default nextConfig;
