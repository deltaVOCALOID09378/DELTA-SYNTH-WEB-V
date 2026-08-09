import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          alignItems: "center",
          background: "#1A1A1A",
          border: "2px solid #CC2200",
          color: "#F0F0F0",
          display: "flex",
          fontFamily: "sans-serif",
          fontSize: 18,
          fontWeight: 900,
          height: "100%",
          justifyContent: "center",
          letterSpacing: "-0.08em",
          width: "100%",
        }}
      >
        <span style={{ color: "#CC2200" }}>D</span>S
      </div>
    ),
    size,
  );
}
