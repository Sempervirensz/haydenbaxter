"use client";

import { useEffect, useMemo, useRef, useState } from "react";

// ---- Viewport presets ----------------------------------------------------

interface Viewport {
  label: string;
  device: string;
  w: number;
  h: number;
}

const VIEWPORTS: Viewport[] = [
  { label: "375 × 812", device: "iPhone SE / 13 mini", w: 375, h: 812 },
  { label: "390 × 844", device: "iPhone 13/14", w: 390, h: 844 },
  { label: "430 × 932", device: "iPhone 14 Pro Max", w: 430, h: 932 },
  { label: "768 × 1024", device: "iPad (portrait)", w: 768, h: 1024 },
  { label: "1024 × 768", device: "iPad (landscape)", w: 1024, h: 768 },
  { label: "1280 × 800", device: "13\" laptop (1280)", w: 1280, h: 800 },
  { label: "1440 × 900", device: "13\" MBP (your screen)", w: 1440, h: 900 },
  { label: "1680 × 1050", device: "15\" MBP", w: 1680, h: 1050 },
  { label: "1920 × 1080", device: "Desktop HD", w: 1920, h: 1080 },
];

// All tiles share this display height; width is computed from aspect.
const TILE_DISPLAY_HEIGHT = 360;
// Scrubber bounds.
const SCRUB_MIN = 320;
const SCRUB_MAX = 1920;

// ---- Page ----------------------------------------------------------------

export default function ResponsiveLabPage() {
  const [progress, setProgress] = useState(0);
  const [scrubW, setScrubW] = useState(1440);
  const [highlightBreak, setHighlightBreak] = useState(true);
  const tileRefs = useRef<(HTMLIFrameElement | null)[]>([]);
  const scrubRef = useRef<HTMLIFrameElement | null>(null);

  // Broadcast progress to every iframe whenever it changes.
  useEffect(() => {
    const all = [...tileRefs.current, scrubRef.current].filter(Boolean) as HTMLIFrameElement[];
    for (const f of all) {
      f.contentWindow?.postMessage({ type: "setProgress", progress }, "*");
    }
  }, [progress]);

  // Preset marks. Landing zones live inside the first 35% of global scroll
  // (the sticky window). Detail chapters occupy the remaining 65%.
  //   Landing zones: hold midpoints × 0.35 (see WORK_SCROLL_CONFIG.zones)
  //   Detail chapters: screenBreaks midpoints (see WORK_SCROLL_CONFIG.screenBreaks)
  const landingMarks = useMemo(
    () => [
      { p: 0.0, label: "rest" },
      { p: 0.093, label: "01 WorldPulse" },
      { p: 0.163, label: "02 Emerging" },
      { p: 0.233, label: "03 Supply Chain" },
      { p: 0.298, label: "04 Consulting" },
    ],
    [],
  );
  const detailMarks = useMemo(
    () => [
      { p: 0.455, label: "WP detail" },
      { p: 0.665, label: "ETB detail" },
      { p: 0.86, label: "SC detail" },
      { p: 0.975, label: "C detail" },
    ],
    [],
  );

  const previewUrl = (extra: Record<string, string | number> = {}) => {
    const params = new URLSearchParams({ progress: String(progress), ...Object.fromEntries(Object.entries(extra).map(([k, v]) => [k, String(v)])) });
    return `/work-preview?${params.toString()}`;
  };

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#0a0a0a",
        color: "#f3f3f3",
        fontFamily: "var(--font-sans, system-ui)",
        padding: "24px 24px 96px",
      }}
    >
      {/* Header */}
      <header style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 24, marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 500, letterSpacing: "-0.01em", margin: 0 }}>
            Responsive Lab — Work section
          </h1>
          <p style={{ fontSize: 12, opacity: 0.55, margin: "6px 0 0", fontFamily: "var(--font-mono, ui-monospace)" }}>
            Live HMR: edit WorkSection / globals.css and every tile updates.
          </p>
        </div>
        <label style={{ fontSize: 11, fontFamily: "var(--font-mono, ui-monospace)", opacity: 0.7, display: "flex", alignItems: "center", gap: 8 }}>
          <input
            type="checkbox"
            checked={highlightBreak}
            onChange={(e) => setHighlightBreak(e.target.checked)}
          />
          highlight 640px break (mobile fork)
        </label>
      </header>

      {/* Progress slider */}
      <section style={{ marginBottom: 32, padding: "16px 20px", border: "1px solid rgba(243,243,243,0.08)", borderRadius: 8 }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, fontFamily: "var(--font-mono, ui-monospace)", letterSpacing: "0.18em", textTransform: "uppercase", opacity: 0.55, marginBottom: 8 }}>
          <span>Scroll progress</span>
          <span>{progress.toFixed(3)}</span>
        </div>
        <input
          type="range"
          min={0}
          max={1}
          step={0.001}
          value={progress}
          onChange={(e) => setProgress(parseFloat(e.target.value))}
          style={{ width: "100%", accentColor: "#cba86a" }}
        />
        <div style={{ marginTop: 10 }}>
          <div style={{ fontSize: 9, fontFamily: "var(--font-mono, ui-monospace)", letterSpacing: "0.18em", textTransform: "uppercase", opacity: 0.45, marginBottom: 4 }}>
            Landing — CD label zones
          </div>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", fontSize: 10, fontFamily: "var(--font-mono, ui-monospace)", opacity: 0.75 }}>
            {landingMarks.map((m) => (
              <button
                key={m.label}
                onClick={() => setProgress(m.p)}
                style={{
                  background: Math.abs(progress - m.p) < 0.01 ? "rgba(203,168,106,0.2)" : "transparent",
                  border: "1px solid rgba(243,243,243,0.12)",
                  color: "inherit",
                  cursor: "pointer",
                  padding: "4px 8px",
                  fontFamily: "inherit",
                  fontSize: "inherit",
                  letterSpacing: "0.1em",
                  borderRadius: 3,
                }}
              >
                {m.label}
              </button>
            ))}
          </div>
          <div style={{ fontSize: 9, fontFamily: "var(--font-mono, ui-monospace)", letterSpacing: "0.18em", textTransform: "uppercase", opacity: 0.45, margin: "10px 0 4px" }}>
            Detail chapters
          </div>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", fontSize: 10, fontFamily: "var(--font-mono, ui-monospace)", opacity: 0.75 }}>
            {detailMarks.map((m) => (
              <button
                key={m.label}
                onClick={() => setProgress(m.p)}
                style={{
                  background: Math.abs(progress - m.p) < 0.01 ? "rgba(203,168,106,0.2)" : "transparent",
                  border: "1px solid rgba(243,243,243,0.12)",
                  color: "inherit",
                  cursor: "pointer",
                  padding: "4px 8px",
                  fontFamily: "inherit",
                  fontSize: "inherit",
                  letterSpacing: "0.1em",
                  borderRadius: 3,
                }}
              >
                {m.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Tile grid */}
      <section style={{ display: "flex", gap: 20, overflowX: "auto", paddingBottom: 24, alignItems: "flex-end" }}>
        {VIEWPORTS.map((v, i) => {
          const scale = TILE_DISPLAY_HEIGHT / v.h;
          const displayW = Math.round(v.w * scale);
          const crossesBreak = highlightBreak && v.w > 640;
          const isMobileFork = highlightBreak && v.w <= 640;
          return (
            <figure key={v.label} style={{ margin: 0, flex: "0 0 auto" }}>
              <figcaption
                style={{
                  fontFamily: "var(--font-mono, ui-monospace)",
                  fontSize: 10,
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  opacity: 0.75,
                  marginBottom: 8,
                  display: "flex",
                  justifyContent: "space-between",
                  gap: 8,
                  color: isMobileFork ? "#cba86a" : "#f3f3f3",
                }}
              >
                <span>{v.label}</span>
                <span style={{ opacity: 0.55 }}>{v.device}</span>
              </figcaption>
              <div
                style={{
                  width: displayW,
                  height: TILE_DISPLAY_HEIGHT,
                  border: `1px solid ${isMobileFork ? "rgba(203,168,106,0.5)" : crossesBreak ? "rgba(243,243,243,0.15)" : "rgba(243,243,243,0.08)"}`,
                  borderRadius: 4,
                  overflow: "hidden",
                  background: "#000",
                  position: "relative",
                }}
              >
                <iframe
                  ref={(el) => { tileRefs.current[i] = el; }}
                  src={previewUrl()}
                  title={v.label}
                  style={{
                    width: v.w,
                    height: v.h,
                    border: "none",
                    transform: `scale(${scale})`,
                    transformOrigin: "top left",
                    background: "#0a0a0a",
                  }}
                />
              </div>
            </figure>
          );
        })}
      </section>

      {/* Scrubber */}
      <section style={{ marginTop: 40 }}>
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 12 }}>
          <h2 style={{ fontSize: 14, margin: 0, fontFamily: "var(--font-mono, ui-monospace)", letterSpacing: "0.18em", textTransform: "uppercase", opacity: 0.75 }}>
            Width scrubber
          </h2>
          <span style={{ fontFamily: "var(--font-mono, ui-monospace)", fontSize: 12, color: "#cba86a" }}>
            {scrubW}px × {Math.round((scrubW * 9) / 16)}px
          </span>
        </div>

        <div style={{ marginBottom: 16 }}>
          <input
            type="range"
            min={SCRUB_MIN}
            max={SCRUB_MAX}
            step={1}
            value={scrubW}
            onChange={(e) => setScrubW(parseInt(e.target.value, 10))}
            style={{ width: "100%", accentColor: "#cba86a" }}
          />
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6, fontSize: 10, fontFamily: "var(--font-mono, ui-monospace)", opacity: 0.5 }}>
            {[375, 640, 768, 1024, 1280, 1440, 1920].map((w) => (
              <button
                key={w}
                onClick={() => setScrubW(w)}
                style={{
                  background: "transparent",
                  border: "none",
                  color: w === 640 ? "#cba86a" : "inherit",
                  cursor: "pointer",
                  padding: "2px 4px",
                  fontFamily: "inherit",
                  fontSize: "inherit",
                  letterSpacing: "0.1em",
                }}
              >
                {w}
              </button>
            ))}
          </div>
        </div>

        <div
          style={{
            width: scrubW,
            maxWidth: "100%",
            height: Math.round((scrubW * 9) / 16),
            border: "1px solid rgba(243,243,243,0.15)",
            borderRadius: 4,
            overflow: "hidden",
            background: "#000",
            resize: "horizontal",
            position: "relative",
          }}
        >
          <iframe
            ref={(el) => { scrubRef.current = el; }}
            key={scrubW}  /* key on width forces remount so inner matchMedia re-evaluates */
            src={previewUrl()}
            title="scrubber"
            style={{ width: "100%", height: "100%", border: "none", background: "#0a0a0a" }}
          />
        </div>
        <p style={{ fontSize: 11, opacity: 0.45, marginTop: 8, fontFamily: "var(--font-mono, ui-monospace)" }}>
          Note: iframe remounts on width change so the landing page re-evaluates its `max-width: 640px` mobile fork.
        </p>
      </section>
    </main>
  );
}
