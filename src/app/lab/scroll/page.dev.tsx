import Link from "next/link";
import { VARIANTS } from "@/components/scroll-lab/safari/config";

export const metadata = { title: "Safari Scroll Lab" };

export default function ScrollLabIndex() {
  return (
    <main
      style={{
        minHeight: "100vh",
        padding: "48px 32px 96px",
        maxWidth: 920,
        margin: "0 auto",
        color: "#f3f3f3",
        fontFamily: "var(--font-sans)",
      }}
    >
      <header style={{ marginBottom: 40 }}>
        <p
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 11,
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            color: "rgba(243,243,243,0.5)",
            margin: 0,
          }}
        >
          Lab / Safari scroll
        </p>
        <h1
          style={{
            fontFamily: "var(--font-serif)",
            fontSize: 40,
            margin: "8px 0 16px",
            letterSpacing: "-0.02em",
          }}
        >
          Variants
        </h1>
        <p style={{ maxWidth: 640, lineHeight: 1.55, color: "rgba(243,243,243,0.72)" }}>
          Each link below renders the full Work / CD section with one (or a stack of)
          candidate fixes applied. Open several in separate Safari tabs and flip
          between them on the same trackpad session to compare scroll feel.
          Variants are stable URLs &mdash; reload reproduces the same config.
        </p>
      </header>

      <ol style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gap: 14 }}>
        {VARIANTS.map((v) => (
          <li key={v.id}>
            <Link
              href={`/lab/scroll/${v.id}`}
              style={{
                display: "block",
                padding: "18px 20px",
                borderRadius: 12,
                border: "1px solid rgba(255,255,255,0.10)",
                background: "rgba(255,255,255,0.03)",
                textDecoration: "none",
                color: "inherit",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "baseline",
                  gap: 14,
                  marginBottom: 6,
                }}
              >
                <span
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: 11,
                    letterSpacing: "0.18em",
                    color: "#cba86a",
                  }}
                >
                  {v.id}
                </span>
                <span style={{ fontFamily: "var(--font-serif)", fontSize: 20 }}>
                  {v.title}
                </span>
              </div>
              <p
                style={{
                  margin: 0,
                  color: "rgba(243,243,243,0.62)",
                  fontSize: 14,
                  lineHeight: 1.5,
                }}
              >
                {v.hypothesis}
              </p>
            </Link>
          </li>
        ))}
      </ol>
    </main>
  );
}
