import { ImageResponse } from "next/og";

// Social-share card for the hidden /v2 site, in its own parchment palette so a
// shared link previews this design rather than the main site's dark card.
// Generated to a static PNG at build time (output: export compatible).
export const dynamic = "force-static";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Hayden Baxter: Global Business Strategist & AI Product Builder";

export default function V2OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#f7f5f0",
          padding: "80px",
          color: "#13110d",
          fontFamily: "Georgia, serif",
          borderTop: "10px solid #a8543a",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            fontSize: 24,
            letterSpacing: 6,
            textTransform: "uppercase",
            color: "#6b6048",
          }}
        >
          <div style={{ width: 14, height: 14, borderRadius: 7, background: "#a8543a" }} />
          Global Business · AI · Supply Chain
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div style={{ fontSize: 96, lineHeight: 1, letterSpacing: -2 }}>Hayden Baxter</div>
          <div style={{ fontSize: 38, lineHeight: 1.3, color: "#4d4533", maxWidth: 960 }}>
            Putting AI to work, strengthening global supply chains, and innovating where
            sustainability meets technology.
          </div>
        </div>
        <div style={{ display: "flex", gap: 28, fontSize: 24, color: "#6b6048" }}>
          <span>Nike</span>
          <span>Converse</span>
          <span>Disney</span>
          <span>Aosom</span>
          <span style={{ color: "#2a776f" }}>Founder, WorldPulse</span>
        </div>
      </div>
    ),
    size,
  );
}
