"use client";

import { useState } from "react";

const ETB_TEXT =
  "Builder in AI and emerging tech, focused on practical tools with real-world use. These projects include live demos, working prototypes, and systems already in use.";

const SC_TEXT =
  "A look at my work in global supply chains, sourcing, and traceability. Ideas, systems, and lessons from the world behind the products we use every day.";

const FONTS = {
  Mono: "var(--font-mono)",
  Sans: "var(--font-sans)",
  Serif: "var(--font-serif)",
};

const LAYOUTS = {
  "Hero (no strip)": "hero",
  "After Strip": "after",
  "Before Strip": "before",
  "Inline Strip": "inline",
  "Side Note": "side",
  "Arch Header": "arch",
} as const;

type Layout = (typeof LAYOUTS)[keyof typeof LAYOUTS];
type FontKey = keyof typeof FONTS;
type Mode = "desktop" | "mobile";

interface Config {
  font: FontKey;
  layout: Layout;
  size: number;
  opacity: number;
  maxCh: number;
  tracking: number;
  lineHeight: number;
  uppercase: boolean;
  italic: boolean;
  fullWidth: boolean;
  weight: number;
}

interface Preset {
  name: string;
  description: string;
  mode: Mode;
  config: Config;
  viewport: number;
}

const PRESETS: Preset[] = [
  // ── Desktop — Hero (live design + variants) ──────────────────────────
  {
    name: "Hero Sans ★ LIVE",
    description: "Current shipped style. DM Sans 15px, quiet opacity, full-width. No strip.",
    mode: "desktop",
    viewport: 1440,
    config: { font: "Sans", layout: "hero", size: 15, opacity: 0.55, maxCh: 80, tracking: 0, lineHeight: 1.5, uppercase: false, italic: false, fullWidth: true, weight: 400 },
  },
  {
    name: "Hero Sans — Heavier",
    description: "Same DM Sans hero but bumped weight + opacity for more presence.",
    mode: "desktop",
    viewport: 1440,
    config: { font: "Sans", layout: "hero", size: 22, opacity: 0.85, maxCh: 80, tracking: -0.01, lineHeight: 1.4, uppercase: false, italic: false, fullWidth: true, weight: 500 },
  },
  {
    name: "Hero Sans — Quiet",
    description: "DM Sans whisper. Lower opacity, smaller size — sits gently under the title.",
    mode: "desktop",
    viewport: 1440,
    config: { font: "Sans", layout: "hero", size: 17, opacity: 0.55, maxCh: 80, tracking: 0, lineHeight: 1.5, uppercase: false, italic: false, fullWidth: true, weight: 400 },
  },
  {
    name: "Hero Serif",
    description: "Editorial DM Serif Display variant. Bigger, more dramatic standfirst.",
    mode: "desktop",
    viewport: 1440,
    config: { font: "Serif", layout: "hero", size: 24, opacity: 0.78, maxCh: 80, tracking: -0.01, lineHeight: 1.35, uppercase: false, italic: false, fullWidth: true, weight: 400 },
  },
  {
    name: "Hero Editorial Italic",
    description: "Serif italic standfirst. Magazine cover-line energy.",
    mode: "desktop",
    viewport: 1440,
    config: { font: "Serif", layout: "hero", size: 26, opacity: 0.72, maxCh: 80, tracking: -0.01, lineHeight: 1.3, uppercase: false, italic: true, fullWidth: true, weight: 400 },
  },
  {
    name: "Hero Mono Manifesto",
    description: "Mono at hero scale. Reads like a system manifesto pinned at the top.",
    mode: "desktop",
    viewport: 1440,
    config: { font: "Mono", layout: "hero", size: 16, opacity: 0.6, maxCh: 80, tracking: 0, lineHeight: 1.5, uppercase: false, italic: false, fullWidth: true, weight: 400 },
  },
  // ── Desktop — Strip-based (legacy/comparison) ────────────────────────
  {
    name: "Arch — Strip",
    description: "Old: 3-row arch header w/ metadata strip. Kept for comparison.",
    mode: "desktop",
    viewport: 1440,
    config: { font: "Mono", layout: "arch", size: 11, opacity: 0.3, maxCh: 46, tracking: 0.015, lineHeight: 1.55, uppercase: false, italic: false, fullWidth: false, weight: 400 },
  },
  {
    name: "Micro Label",
    description: "Mono sub-caption below the strip. Quiet, integrated.",
    mode: "desktop",
    viewport: 1440,
    config: { font: "Mono", layout: "after", size: 11, opacity: 0.28, maxCh: 52, tracking: 0.02, lineHeight: 1.55, uppercase: false, italic: false, fullWidth: false, weight: 400 },
  },
  {
    name: "Side Pull",
    description: "Sans beside the section label. Two-column density.",
    mode: "desktop",
    viewport: 1440,
    config: { font: "Sans", layout: "side", size: 11, opacity: 0.3, maxCh: 28, tracking: 0, lineHeight: 1.5, uppercase: false, italic: false, fullWidth: false, weight: 400 },
  },
  // ── Mobile — Hero variants ───────────────────────────────────────────
  {
    name: "Hero Serif — Mobile",
    description: "Hero paragraph collapsed for narrow widths. Serif, full bleed, generous leading.",
    mode: "mobile",
    viewport: 390,
    config: { font: "Serif", layout: "hero", size: 17, opacity: 0.78, maxCh: 80, tracking: -0.005, lineHeight: 1.4, uppercase: false, italic: false, fullWidth: true, weight: 400 },
  },
  {
    name: "Hero Sans — Mobile",
    description: "Sans hero. Slightly heavier color for small-screen legibility.",
    mode: "mobile",
    viewport: 390,
    config: { font: "Sans", layout: "hero", size: 16, opacity: 0.82, maxCh: 80, tracking: 0, lineHeight: 1.45, uppercase: false, italic: false, fullWidth: true, weight: 400 },
  },
  {
    name: "Hero Italic — Mobile",
    description: "Serif italic at 16/1.45. Editorial feel without overpowering the cards below.",
    mode: "mobile",
    viewport: 390,
    config: { font: "Serif", layout: "hero", size: 16, opacity: 0.74, maxCh: 80, tracking: 0, lineHeight: 1.45, uppercase: false, italic: true, fullWidth: true, weight: 400 },
  },
  // ── Mobile — Strip-based (comparison) ────────────────────────────────
  {
    name: "Whisper",
    description: "Near-invisible mono after strip. Pure metadata texture.",
    mode: "mobile",
    viewport: 390,
    config: { font: "Mono", layout: "after", size: 9, opacity: 0.15, maxCh: 34, tracking: 0.015, lineHeight: 1.4, uppercase: false, italic: false, fullWidth: false, weight: 400 },
  },
];

// ── Panel components ──────────────────────────────────────────────────────────

const DIV = "1px solid rgba(255,255,255,0.07)"; // shared inner divider token

function ETBPanel({ text, config }: { text: string; config: Config }) {
  const pStyle: React.CSSProperties = {
    margin: 0,
    fontFamily: FONTS[config.font],
    fontSize: config.size,
    fontStyle: config.italic ? "italic" : "normal",
    fontWeight: config.weight,
    lineHeight: config.lineHeight,
    color: `rgba(255,255,255,${config.opacity})`,
    maxWidth: config.fullWidth ? "none" : `min(${config.maxCh}ch, 480px)`,
    width: config.fullWidth ? "100%" : "auto",
    letterSpacing: `${config.tracking}em`,
    textTransform: config.uppercase ? "uppercase" : "none",
    overflow: "hidden",
    wordBreak: "break-word",
  };

  const sectionHeader = (
    <div style={{ padding: "10px 20px 8px", borderBottom: DIV, display: "flex", alignItems: "baseline", gap: 10 }}>
      <span style={{ fontFamily: "var(--font-mono)", fontSize: 9, color: "rgba(255,255,255,0.28)", letterSpacing: "0.1em", textTransform: "uppercase" }}>02 / 04</span>
      <span style={{ fontFamily: "Georgia, serif", fontSize: 22, color: "rgba(255,255,255,0.92)", fontWeight: 400, letterSpacing: "-0.02em" }}>Emerging Tech Builds</span>
    </div>
  );

  const cards = (
    <>
      {[
        ["PROCUREBRIDGE", "International procurement workflow app"],
        ["CASEBRIEF", "Medical record summarizer for law firms"],
        ["ATOMICOS", "Atomic Habits-style behavior agent"],
      ].map(([name, sub]) => (
        <div key={name} style={{ margin: "6px 10px", background: "#f2f0ec", borderRadius: 8, padding: "12px 14px" }}>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.15em", textTransform: "uppercase", color: "#111" }}>{name}</div>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 9, color: "rgba(17,17,22,0.45)", marginTop: 3 }}>{sub}</div>
        </div>
      ))}
    </>
  );

  // ── Hero: live shipped design — no strip, full-width paragraph under title ──
  if (config.layout === "hero") {
    return (
      <div style={{ background: "#030304", border: "1px solid rgba(255,255,255,0.05)", borderRadius: 14, overflow: "hidden", flex: 1, minWidth: 0 }}>
        {sectionHeader}
        <div style={{ padding: "16px 20px 22px", width: "100%" }}>
          <p style={pStyle}>{text}</p>
        </div>
        {cards}
      </div>
    );
  }

  // ── Arch: unified 3-row header inside the panel (legacy strip system) ──
  if (config.layout === "arch") {
    return (
      <div style={{ background: "#030304", border: "1px solid rgba(255,255,255,0.05)", borderRadius: 14, overflow: "hidden", flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 12, padding: "10px 20px 9px", borderBottom: DIV }}>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 9, color: "rgba(255,255,255,0.28)", letterSpacing: "0.1em", textTransform: "uppercase", flexShrink: 0 }}>02 / 04</span>
          <span style={{ fontFamily: "Georgia, serif", fontSize: 20, color: "rgba(255,255,255,0.92)", fontWeight: 400, letterSpacing: "-0.02em", lineHeight: 1 }}>Emerging Tech Builds</span>
          <span style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.1)", alignSelf: "center" }} />
        </div>
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 16, padding: "9px 20px 9px", borderBottom: DIV, minWidth: 0 }}>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.22em", textTransform: "uppercase", color: "rgba(255,255,255,0.62)", minWidth: 0 }}>
            Emerging Tech Builds
          </span>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 9, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(255,255,255,0.28)", whiteSpace: "nowrap", flexShrink: 0 }}>
            M.S. in AI (ASU)
          </span>
        </div>
        <div style={{ padding: "10px 20px 12px" }}>
          <p style={pStyle}>{text}</p>
        </div>
        {cards}
      </div>
    );
  }

  // ── Standard layouts (strip + before/after/inline/side) ──
  const descBlock = (
    <div style={{ padding: "4px 20px 12px" }}>
      <p style={pStyle}>{text}</p>
    </div>
  );

  const strip = (
    <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 16, padding: "12px 20px 10px", borderBottom: DIV, minWidth: 0 }}>
      {config.layout === "inline" ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 6, minWidth: 0 }}>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.22em", textTransform: "uppercase", color: "rgba(255,255,255,0.62)" }}>
            Emerging Tech Builds
          </span>
          <p style={{ ...pStyle, margin: 0 }}>{text}</p>
        </div>
      ) : (
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.22em", textTransform: "uppercase", color: "rgba(255,255,255,0.62)", minWidth: 0 }}>
          Emerging Tech Builds
        </span>
      )}
      <span style={{ fontFamily: "var(--font-mono)", fontSize: 9, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(255,255,255,0.28)", whiteSpace: "nowrap", flexShrink: 0 }}>
        M.S. in AI (ASU)
      </span>
    </div>
  );

  const sideNote = (
    <div style={{ display: "flex", gap: 24, alignItems: "flex-start", padding: "12px 20px 10px", borderBottom: DIV, minWidth: 0 }}>
      <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.22em", textTransform: "uppercase", color: "rgba(255,255,255,0.62)", flexShrink: 0, paddingTop: 2 }}>
        Emerging Tech Builds
      </span>
      <p style={{ ...pStyle, margin: 0 }}>{text}</p>
    </div>
  );

  return (
    <div style={{ background: "#030304", border: "1px solid rgba(255,255,255,0.05)", borderRadius: 14, overflow: "hidden", flex: 1, minWidth: 0 }}>
      {sectionHeader}
      {config.layout === "before" && descBlock}
      {config.layout === "side" ? sideNote : strip}
      {config.layout === "after" && descBlock}
      {cards}
    </div>
  );
}


function SCPanel({ text, config }: { text: string; config: Config }) {
  const pStyle: React.CSSProperties = {
    margin: 0,
    fontFamily: FONTS[config.font],
    fontSize: config.size,
    fontStyle: config.italic ? "italic" : "normal",
    fontWeight: config.weight,
    lineHeight: config.lineHeight,
    color: `rgba(255,255,255,${config.opacity})`,
    maxWidth: config.fullWidth ? "none" : `${config.maxCh}ch`,
    width: config.fullWidth ? "100%" : "auto",
    letterSpacing: `${config.tracking}em`,
    textTransform: config.uppercase ? "uppercase" : "none",
  };

  return (
    <div style={{ background: "#000", border: "1px solid rgba(255,255,255,0.05)", borderRadius: 14, overflow: "hidden", flex: 1, minWidth: 0 }}>
      <div style={{ padding: "10px 20px 8px", borderBottom: "1px solid rgba(255,255,255,0.04)", display: "flex", alignItems: "baseline", gap: 10 }}>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 9, color: "rgba(255,255,255,0.28)", letterSpacing: "0.1em", textTransform: "uppercase" }}>03 / 04</span>
        <span style={{ fontFamily: "Georgia, serif", fontSize: 20, color: "#fff", fontWeight: 700 }}>Supply Chain</span>
      </div>

      <div style={{ padding: "8px 20px 6px" }}>
        <p style={pStyle}>{text}</p>
      </div>

      <div style={{ display: "flex", gap: 4, padding: "8px 20px 6px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        {["Taiwan · 2012", "China · 2016", "New York · 2022", "SE Asia · 2023"].map((stop, i) => (
          <div key={stop} style={{ fontFamily: "var(--font-mono)", fontSize: 8, color: i === 0 ? "rgba(255,255,255,0.8)" : "rgba(255,255,255,0.3)", textTransform: "uppercase", letterSpacing: "0.06em", textAlign: "center", padding: "4px 8px", border: i === 0 ? "1px solid rgba(255,255,255,0.15)" : "1px solid transparent", borderRadius: 5 }}>
            {stop}
          </div>
        ))}
      </div>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 100, color: "rgba(255,255,255,0.1)", fontSize: 10, fontFamily: "var(--font-mono)", letterSpacing: "0.12em", border: "1px dashed rgba(255,255,255,0.05)", margin: "10px", borderRadius: 8 }}>
        globe
      </div>
    </div>
  );
}

// ── Main lab ──────────────────────────────────────────────────────────────────

const LIVE_DEFAULT: Config = { font: "Sans", layout: "hero", size: 15, opacity: 0.55, maxCh: 80, tracking: 0, lineHeight: 1.5, uppercase: false, italic: false, fullWidth: true, weight: 400 };

export default function DescriptionLab() {
  const [config, setConfig] = useState<Config>(LIVE_DEFAULT);
  const [viewport, setViewport] = useState(1440);
  const [activePreset, setActivePreset] = useState<string | null>("Hero Sans ★ LIVE");
  const [mode, setMode] = useState<Mode>("desktop");

  const applyPreset = (preset: Preset) => {
    setConfig(preset.config);
    setViewport(preset.viewport);
    setActivePreset(preset.name);
    setMode(preset.mode);
  };

  const set = <K extends keyof Config>(key: K, val: Config[K]) => {
    setActivePreset(null);
    setConfig((prev) => ({ ...prev, [key]: val }));
  };

  const desktopPresets = PRESETS.filter((p) => p.mode === "desktop");
  const mobilePresets = PRESETS.filter((p) => p.mode === "mobile");

  const ctrl: React.CSSProperties = { fontFamily: "var(--font-mono)", fontSize: 9, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(255,255,255,0.35)", display: "block", marginBottom: 5 };
  const val: React.CSSProperties = { fontFamily: "var(--font-mono)", fontSize: 9, color: "rgba(255,255,255,0.55)" };

  const pill = (active: boolean): React.CSSProperties => ({
    fontFamily: "var(--font-mono)", fontSize: 9, textAlign: "left", padding: "5px 9px", borderRadius: 5, border: "1px solid",
    borderColor: active ? "rgba(255,255,255,0.28)" : "rgba(255,255,255,0.06)",
    background: active ? "rgba(255,255,255,0.05)" : "transparent",
    color: active ? "rgba(255,255,255,0.85)" : "rgba(255,255,255,0.38)",
    cursor: "pointer", whiteSpace: "nowrap",
  });

  const VIEWPORT_PRESETS = [
    { label: "390", width: 390, hint: "iPhone" },
    { label: "768", width: 768, hint: "iPad" },
    { label: "1280", width: 1280, hint: "Laptop" },
    { label: "1440", width: 1440, hint: "MBP" },
    { label: "1920", width: 1920, hint: "Studio" },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "#080808", color: "#fff", display: "flex", flexDirection: "column", fontFamily: "var(--font-mono)" }}>

      {/* Header */}
      <div style={{ padding: "12px 20px", borderBottom: "1px solid rgba(255,255,255,0.06)", display: "flex", alignItems: "center", gap: 16 }}>
        <a href="/" style={{ fontSize: 9, color: "rgba(255,255,255,0.25)", textDecoration: "none", letterSpacing: "0.1em" }}>← Back</a>
        <span style={{ fontSize: 9, color: "rgba(255,255,255,0.4)", letterSpacing: "0.14em" }}>Description Lab</span>
        <span style={{ fontSize: 9, color: "rgba(255,255,255,0.15)", marginLeft: "auto", letterSpacing: "0.06em" }}>
          {activePreset ? `Preset: ${activePreset}` : "Custom"}
        </span>
      </div>

      <div style={{ display: "flex", flex: 1, minHeight: 0, overflow: "hidden" }}>

        {/* ── Sidebar ─────────────────────────────────────────────────────── */}
        <aside style={{ width: 240, flexShrink: 0, borderRight: "1px solid rgba(255,255,255,0.06)", display: "flex", flexDirection: "column", overflowY: "auto" }}>

          {/* Presets */}
          <div style={{ padding: "14px 14px 0" }}>
            {/* Mode toggle */}
            <div style={{ display: "flex", gap: 4, marginBottom: 12 }}>
              {(["desktop", "mobile"] as Mode[]).map((m) => (
                <button key={m} onClick={() => setMode(m)} style={{ ...pill(mode === m), flex: 1, textAlign: "center", textTransform: "uppercase", letterSpacing: "0.1em" }}>
                  {m}
                </button>
              ))}
            </div>

            {mode === "desktop" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 3, marginBottom: 14 }}>
                <span style={{ ...ctrl, marginBottom: 7 }}>Desktop Presets</span>
                {desktopPresets.map((p) => (
                  <button key={p.name} onClick={() => applyPreset(p)}
                    style={{ ...pill(activePreset === p.name), display: "flex", flexDirection: "column", gap: 2, height: "auto", padding: "8px 10px" }}>
                    <span style={{ fontSize: 9, letterSpacing: "0.08em", color: activePreset === p.name ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.55)" }}>{p.name}</span>
                    <span style={{ fontSize: 8, color: activePreset === p.name ? "rgba(255,255,255,0.38)" : "rgba(255,255,255,0.22)", fontWeight: 400, lineHeight: 1.4, textTransform: "none", letterSpacing: "0.02em" }}>{p.description}</span>
                  </button>
                ))}
              </div>
            )}

            {mode === "mobile" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 3, marginBottom: 14 }}>
                <span style={{ ...ctrl, marginBottom: 7 }}>Mobile Presets</span>
                {mobilePresets.map((p) => (
                  <button key={p.name} onClick={() => applyPreset(p)}
                    style={{ ...pill(activePreset === p.name), display: "flex", flexDirection: "column", gap: 2, height: "auto", padding: "8px 10px" }}>
                    <span style={{ fontSize: 9, letterSpacing: "0.08em", color: activePreset === p.name ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.55)" }}>{p.name}</span>
                    <span style={{ fontSize: 8, color: activePreset === p.name ? "rgba(255,255,255,0.38)" : "rgba(255,255,255,0.22)", fontWeight: 400, lineHeight: 1.4, textTransform: "none", letterSpacing: "0.02em" }}>{p.description}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", margin: "0 14px" }} />

          {/* Fine controls */}
          <div style={{ padding: "14px", display: "flex", flexDirection: "column", gap: 16 }}>
            <span style={{ ...ctrl, marginBottom: -8 }}>Fine Tune</span>

            <div>
              <span style={ctrl}>Font</span>
              <div style={{ display: "flex", gap: 3 }}>
                {(Object.keys(FONTS) as FontKey[]).map((f) => (
                  <button key={f} onClick={() => set("font", f)} style={{ ...pill(config.font === f), flex: 1, textAlign: "center" }}>{f}</button>
                ))}
              </div>
            </div>

            <div>
              <span style={ctrl}>ETB Layout</span>
              <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                {(Object.entries(LAYOUTS) as [string, Layout][]).map(([label, v]) => (
                  <button key={v} onClick={() => set("layout", v)} style={{ ...pill(config.layout === v), textAlign: "left" }}>{label}</button>
                ))}
              </div>
            </div>

            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <label style={{ display: "flex", alignItems: "center", gap: 5, cursor: "pointer" }}>
                <input type="checkbox" checked={config.uppercase} onChange={(e) => set("uppercase", e.target.checked)} style={{ accentColor: "rgba(255,255,255,0.4)", width: 11, height: 11 }} />
                <span style={{ ...ctrl, marginBottom: 0 }}>Caps</span>
              </label>
              <label style={{ display: "flex", alignItems: "center", gap: 5, cursor: "pointer" }}>
                <input type="checkbox" checked={config.italic} onChange={(e) => set("italic", e.target.checked)} style={{ accentColor: "rgba(255,255,255,0.4)", width: 11, height: 11 }} />
                <span style={{ ...ctrl, marginBottom: 0, fontStyle: "italic" }}>Italic</span>
              </label>
              <label style={{ display: "flex", alignItems: "center", gap: 5, cursor: "pointer" }}>
                <input type="checkbox" checked={config.fullWidth} onChange={(e) => set("fullWidth", e.target.checked)} style={{ accentColor: "rgba(255,255,255,0.4)", width: 11, height: 11 }} />
                <span style={{ ...ctrl, marginBottom: 0 }}>Full</span>
              </label>
            </div>

            {[
              { key: "size" as const, label: "Size", min: 8, max: 40, step: 0.5, unit: "px" },
              { key: "weight" as const, label: "Weight", min: 200, max: 800, step: 100, unit: "" },
              { key: "opacity" as const, label: "Opacity", min: 0.08, max: 1, step: 0.01, unit: "" },
              { key: "maxCh" as const, label: "Max width", min: 20, max: 100, step: 1, unit: "ch" },
              { key: "tracking" as const, label: "Tracking", min: -0.04, max: 0.2, step: 0.005, unit: "em" },
              { key: "lineHeight" as const, label: "Line height", min: 1.1, max: 2.0, step: 0.05, unit: "" },
            ].map(({ key, label, min, max, step, unit }) => (
              <div key={key}>
                <span style={ctrl}>{label} <span style={val}>{config[key] as number}{unit}</span></span>
                <input type="range" min={min} max={max} step={step} value={config[key] as number}
                  onChange={(e) => set(key, Number(e.target.value))}
                  style={{ width: "100%", accentColor: "rgba(255,255,255,0.35)", height: 2 }} />
              </div>
            ))}

            <button
              onClick={() => { setConfig(LIVE_DEFAULT); setActivePreset("Hero Sans ★ LIVE"); }}
              style={{ ...pill(false), textAlign: "center", marginTop: 4 }}
            >
              Reset to live
            </button>
          </div>
        </aside>

        {/* ── Preview ──────────────────────────────────────────────────────── */}
        <main style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", overflow: "hidden" }}>

          <div style={{ padding: "8px 16px", borderBottom: "1px solid rgba(255,255,255,0.06)", display: "flex", gap: 6, alignItems: "center", flexShrink: 0 }}>
            {VIEWPORT_PRESETS.map((vp) => (
              <button key={vp.width} onClick={() => setViewport(vp.width)}
                style={{ ...pill(viewport === vp.width), display: "flex", flexDirection: "column", gap: 1, alignItems: "center", padding: "4px 10px" }}>
                <span style={{ fontSize: 9, letterSpacing: "0.06em" }}>{vp.label}</span>
                <span style={{ fontSize: 7, color: viewport === vp.width ? "rgba(255,255,255,0.3)" : "rgba(255,255,255,0.18)" }}>{vp.hint}</span>
              </button>
            ))}
            <span style={{ fontSize: 9, color: "rgba(255,255,255,0.18)", marginLeft: "auto" }}>{viewport}px</span>
          </div>

          <div style={{ flex: 1, overflow: "auto", padding: 20, background: "#060606" }}>
            <div style={{ width: Math.min(viewport, 1800), margin: "0 auto", display: "flex", gap: 12 }}>
              <ETBPanel text={ETB_TEXT} config={config} />
              <SCPanel text={SC_TEXT} config={config} />
            </div>
          </div>

          <div style={{ padding: "8px 16px", borderTop: "1px solid rgba(255,255,255,0.06)", display: "flex", gap: 16, flexWrap: "wrap", flexShrink: 0 }}>
            {[
              ["font", config.font],
              ["layout", config.layout],
              ["size", `${config.size}px`],
              ["weight", config.weight],
              ["opacity", config.opacity],
              ["max", config.fullWidth ? "full" : `${config.maxCh}ch`],
              ["tracking", `${config.tracking}em`],
              ["lh", config.lineHeight],
              ["caps", String(config.uppercase)],
              ["italic", String(config.italic)],
            ].map(([k, v]) => (
              <span key={k} style={{ fontSize: 9, letterSpacing: "0.05em" }}>
                <span style={{ color: "rgba(255,255,255,0.2)" }}>{k}: </span>
                <span style={{ color: "rgba(255,255,255,0.45)" }}>{v}</span>
              </span>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
