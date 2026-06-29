import { ImageResponse } from "next/og";
import { SITE_NAME } from "@/data/site";

// Branded social-share card, generated to a static PNG at build time
// (compatible with output: export).
// Required so the image is generated at build time under output: export.
export const dynamic = "force-static";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Hayden Baxter — Designer & Builder";

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
        <div
          style={{
            fontSize: 26,
            letterSpacing: 8,
            textTransform: "uppercase",
            color: "#d8b15a",
          }}
        >
          {SITE_NAME}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ fontSize: 84, lineHeight: 1.05, fontWeight: 700 }}>
            Designer &amp; Builder
          </div>
          <div style={{ fontSize: 32, color: "rgba(243,243,243,0.7)" }}>
            Brand systems · Product interfaces · Emerging-tech tools
          </div>
        </div>
        <div style={{ fontSize: 24, color: "rgba(243,243,243,0.5)" }}>
          haydenbaxter.com
        </div>
      </div>
    ),
    size,
  );
}
