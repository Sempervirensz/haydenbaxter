import { ImageResponse } from "next/og";
import { SITE_NAME } from "@/data/site";

// Route-specific share card (LinkedIn Featured, link previews). Static at build
// time for output: export.
export const dynamic = "force-static";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Selected AI Work | Hayden Baxter";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#0a0a0a",
          padding: "80px",
          color: "#f3f3f3",
          fontFamily: "Georgia, serif",
        }}
      >
        <div style={{ fontSize: 26, letterSpacing: 8, textTransform: "uppercase", color: "#d8b15a" }}>
          {SITE_NAME}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ fontSize: 120, lineHeight: 1.02, fontWeight: 700 }}>Selected AI Work</div>
          <div style={{ fontSize: 34, color: "rgba(243,243,243,0.7)" }}>Products and systems built with emerging technology</div>
        </div>
        <div style={{ fontSize: 24, color: "rgba(243,243,243,0.5)" }}>www.haydenbaxter.com/emerging-tech-builds</div>
      </div>
    ),
    size,
  );
}
