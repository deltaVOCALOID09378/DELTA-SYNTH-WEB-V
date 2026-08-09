import { ImageResponse } from "next/og";

export const alt = "DELTA SYNTH Digital Vocal Archive";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "#1A1A1A",
          color: "#F0F0F0",
          display: "flex",
          flexDirection: "column",
          fontFamily: "sans-serif",
          height: "100%",
          justifyContent: "space-between",
          overflow: "hidden",
          padding: "54px 64px",
          position: "relative",
          width: "100%",
        }}
      >
        <div
          style={{
            backgroundImage:
              "linear-gradient(to right, rgba(240,240,240,.12) 1px, transparent 1px), linear-gradient(to bottom, rgba(240,240,240,.12) 1px, transparent 1px)",
            backgroundSize: "86px 70px",
            display: "flex",
            inset: 0,
            position: "absolute",
          }}
        />
        <div style={{ color: "#AAA7A2", display: "flex", fontSize: 18, letterSpacing: "0.18em", zIndex: 1 }}>
          DIGITAL VOCAL ARCHIVE · THAILAND · 2019—NOW
        </div>
        <div style={{ display: "flex", flexDirection: "column", fontSize: 154, fontWeight: 900, letterSpacing: "-0.08em", lineHeight: 0.72, zIndex: 1 }}>
          <span style={{ color: "#CC2200" }}>DELTA</span>
          <span>SYNTH</span>
        </div>
        <div style={{ alignItems: "center", display: "flex", justifyContent: "space-between", zIndex: 1 }}>
          <span style={{ fontSize: 30, fontWeight: 700 }}>ห้องควบคุมสัญญาณเสียง</span>
          <span style={{ background: "#CC2200", fontSize: 18, letterSpacing: "0.12em", padding: "12px 16px" }}>SIGNAL ONLINE</span>
        </div>
      </div>
    ),
    size,
  );
}
