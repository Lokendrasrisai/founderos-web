import { ImageResponse } from "next/og";
import { site } from "@/config/site";

export const alt = `${site.name} — ${site.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Default share image, generated at build time from the site config. */
export default function OpengraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        background: "#090b10",
        color: "#f5f7fa",
        padding: "72px 80px",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
        <div style={{ width: 44, height: 44, background: "#3d5afe", borderRadius: 6 }} />
        <div style={{ fontSize: 34, letterSpacing: -0.5 }}>{site.name}</div>
      </div>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div style={{ fontSize: 84, letterSpacing: -3, lineHeight: 1 }}>{site.tagline}</div>
        <div style={{ marginTop: 28, fontSize: 30, color: "#a3acba", maxWidth: 900, lineHeight: 1.35 }}>
          {site.description}
        </div>
      </div>
      <div
        style={{
          display: "flex",
          height: 2,
          background: "linear-gradient(90deg, #3d5afe, rgba(142,163,194,0.15))",
        }}
      />
    </div>,
    size,
  );
}
