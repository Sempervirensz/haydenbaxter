"use client";

import { useCallback, useState } from "react";
import "./scroll-lab.css";
import { WORK_SCREENS } from "@/data/work";
import WorldPulseDetail from "@/components/work/WorldPulseDetail";
import ETBDetail from "@/components/work/ETBDetail";
import SupplyChainDetail from "@/components/work/SupplyChainDetail";
import ConsultingDetail from "@/components/work/ConsultingDetail";
import type { WorkScreen } from "@/data/work";

function DetailBody({ screen }: { screen: WorkScreen }) {
  switch (screen.type) {
    case "full":
      return <WorldPulseDetail data={screen.full} />;
    case "emerging-tech-builds":
      return <ETBDetail data={screen.etb} />;
    case "supply-chain":
      return <SupplyChainDetail data={screen.supplyChain} isActive />;
    case "consulting":
      return <ConsultingDetail data={screen.consulting} isActive />;
    default:
      return null;
  }
}

interface LightValues {
  topGlowOpacity: number;
  topGlowSpread: number;
  topGlowY: number;
  edgeHighlightOpacity: number;
  edgeHighlightWidth: number;
  innerShadowSpread: number;
  innerShadowOpacity: number;
  ambientGlowX: number;
  ambientGlowY: number;
  ambientGlowSize: number;
  ambientGlowOpacity: number;
  rimLightOpacity: number;
  rimLightSpread: number;
  dropShadowY: number;
  dropShadowBlur: number;
  dropShadowOpacity: number;
  surfaceBrightness: number;
}

const DEFAULTS: LightValues = {
  topGlowOpacity: 0.08,
  topGlowSpread: 60,
  topGlowY: 0,
  edgeHighlightOpacity: 0.12,
  edgeHighlightWidth: 1,
  innerShadowSpread: 80,
  innerShadowOpacity: 0.4,
  ambientGlowX: 50,
  ambientGlowY: 30,
  ambientGlowSize: 50,
  ambientGlowOpacity: 0.06,
  rimLightOpacity: 0,
  rimLightSpread: 40,
  dropShadowY: 20,
  dropShadowBlur: 60,
  dropShadowOpacity: 0.5,
  surfaceBrightness: 0.04,
};

const PRESETS: { label: string; values: Partial<LightValues> }[] = [
  { label: "Flat", values: { topGlowOpacity: 0, edgeHighlightOpacity: 0, innerShadowOpacity: 0, ambientGlowOpacity: 0, rimLightOpacity: 0, dropShadowOpacity: 0 } },
  { label: "Subtle", values: { ...DEFAULTS } },
  { label: "Top lit", values: { topGlowOpacity: 0.15, topGlowSpread: 80, ambientGlowY: 10, ambientGlowOpacity: 0.1, edgeHighlightOpacity: 0.18, innerShadowOpacity: 0.5 } },
  { label: "Side lit", values: { topGlowOpacity: 0.03, ambientGlowX: 15, ambientGlowY: 40, ambientGlowSize: 60, ambientGlowOpacity: 0.12, rimLightOpacity: 0.08, rimLightSpread: 30 } },
  { label: "Dramatic", values: { topGlowOpacity: 0.2, topGlowSpread: 40, innerShadowSpread: 120, innerShadowOpacity: 0.6, ambientGlowOpacity: 0.15, ambientGlowSize: 40, dropShadowY: 30, dropShadowBlur: 80, dropShadowOpacity: 0.7 } },
  { label: "Rim glow", values: { topGlowOpacity: 0.05, rimLightOpacity: 0.15, rimLightSpread: 50, edgeHighlightOpacity: 0.2, edgeHighlightWidth: 2, innerShadowOpacity: 0.3 } },
  { label: "Floating", values: { topGlowOpacity: 0.1, dropShadowY: 40, dropShadowBlur: 100, dropShadowOpacity: 0.6, innerShadowOpacity: 0.2, ambientGlowOpacity: 0.08, rimLightOpacity: 0.06 } },
];

const SLIDERS: { key: keyof LightValues; label: string; min: number; max: number; step: number; group: string }[] = [
  { key: "topGlowOpacity", label: "Intensity", min: 0, max: 0.4, step: 0.01, group: "Top glow" },
  { key: "topGlowSpread", label: "Spread %", min: 20, max: 100, step: 5, group: "Top glow" },
  { key: "topGlowY", label: "Y offset %", min: 0, max: 30, step: 1, group: "Top glow" },
  { key: "edgeHighlightOpacity", label: "Intensity", min: 0, max: 0.4, step: 0.01, group: "Edge highlight" },
  { key: "edgeHighlightWidth", label: "Width px", min: 0, max: 3, step: 0.5, group: "Edge highlight" },
  { key: "innerShadowSpread", label: "Spread px", min: 0, max: 200, step: 10, group: "Inner shadow" },
  { key: "innerShadowOpacity", label: "Intensity", min: 0, max: 1, step: 0.05, group: "Inner shadow" },
  { key: "ambientGlowX", label: "X position %", min: 0, max: 100, step: 5, group: "Ambient light" },
  { key: "ambientGlowY", label: "Y position %", min: 0, max: 100, step: 5, group: "Ambient light" },
  { key: "ambientGlowSize", label: "Size %", min: 10, max: 100, step: 5, group: "Ambient light" },
  { key: "ambientGlowOpacity", label: "Intensity", min: 0, max: 0.3, step: 0.01, group: "Ambient light" },
  { key: "rimLightOpacity", label: "Intensity", min: 0, max: 0.3, step: 0.01, group: "Rim light" },
  { key: "rimLightSpread", label: "Spread px", min: 10, max: 80, step: 5, group: "Rim light" },
  { key: "dropShadowY", label: "Y offset", min: 0, max: 60, step: 2, group: "Drop shadow" },
  { key: "dropShadowBlur", label: "Blur", min: 0, max: 120, step: 5, group: "Drop shadow" },
  { key: "dropShadowOpacity", label: "Intensity", min: 0, max: 1, step: 0.05, group: "Drop shadow" },
  { key: "surfaceBrightness", label: "Fill opacity", min: 0, max: 0.15, step: 0.005, group: "Surface" },
];

function buildCardStyle(v: LightValues): React.CSSProperties {
  return {
    background: `rgba(255,255,255,${v.surfaceBrightness})`,
    backdropFilter: "blur(24px) saturate(1.4)",
    WebkitBackdropFilter: "blur(24px) saturate(1.4)",
    border: `${v.edgeHighlightWidth}px solid rgba(255,255,255,${v.edgeHighlightOpacity})`,
    borderRadius: "32px",
    boxShadow: [
      `inset 0 ${v.edgeHighlightWidth}px 0 rgba(255,255,255,${v.edgeHighlightOpacity * 1.5})`,
      `inset 0 0 ${v.innerShadowSpread}px rgba(0,0,0,${v.innerShadowOpacity})`,
      `0 ${v.dropShadowY}px ${v.dropShadowBlur}px rgba(0,0,0,${v.dropShadowOpacity})`,
      v.rimLightOpacity > 0 ? `0 0 ${v.rimLightSpread}px rgba(255,255,255,${v.rimLightOpacity})` : "",
    ].filter(Boolean).join(", "),
    overflow: "hidden",
    display: "flex",
    flexDirection: "column" as const,
    position: "relative" as const,
    flex: 1,
    margin: "12px",
  };
}

function buildOverlays(v: LightValues): React.CSSProperties[] {
  return [
    {
      position: "absolute" as const,
      top: `${v.topGlowY}%`,
      left: `${(100 - v.topGlowSpread) / 2}%`,
      right: `${(100 - v.topGlowSpread) / 2}%`,
      height: "120px",
      background: `radial-gradient(100% 100% at 50% 0%, rgba(255,255,255,${v.topGlowOpacity}) 0%, transparent 70%)`,
      pointerEvents: "none" as const,
      zIndex: 3,
      borderRadius: "32px 32px 0 0",
    },
    {
      position: "absolute" as const,
      inset: 0,
      borderRadius: "32px",
      background: `radial-gradient(circle ${v.ambientGlowSize}% at ${v.ambientGlowX}% ${v.ambientGlowY}%, rgba(255,255,255,${v.ambientGlowOpacity}) 0%, transparent 70%)`,
      pointerEvents: "none" as const,
      zIndex: 3,
    },
    {
      position: "absolute" as const,
      inset: 0,
      borderRadius: "32px",
      background: "radial-gradient(ellipse 110% 90% at 50% 50%, transparent 40%, rgba(0,0,0,1) 100%)",
      pointerEvents: "none" as const,
      zIndex: 2,
    },
  ];
}

function buildCssOutput(v: LightValues): string {
  const card = buildCardStyle(v);
  return `/* Card lighting — paste into globals.css .work__screen--detail */
background: rgba(255,255,255,${v.surfaceBrightness});
border: ${v.edgeHighlightWidth}px solid rgba(255,255,255,${v.edgeHighlightOpacity});
box-shadow: ${card.boxShadow};

/* Top glow ::before */
background: radial-gradient(100% 100% at 50% 0%, rgba(255,255,255,${v.topGlowOpacity}) 0%, transparent 70%);
top: ${v.topGlowY}%; left: ${(100 - v.topGlowSpread) / 2}%; right: ${(100 - v.topGlowSpread) / 2}%;

/* Ambient light (add as another pseudo or overlay) */
background: radial-gradient(circle ${v.ambientGlowSize}% at ${v.ambientGlowX}% ${v.ambientGlowY}%, rgba(255,255,255,${v.ambientGlowOpacity}) 0%, transparent 70%);`;
}

export default function CardLightingLab() {
  const [values, setValues] = useState<LightValues>({ ...DEFAULTS });
  const [activeCard, setActiveCard] = useState(0);

  const set = useCallback(
    (key: keyof LightValues, v: number) => setValues((prev) => ({ ...prev, [key]: v })),
    []
  );

  const screen = WORK_SCREENS[activeCard];
  const overlays = buildOverlays(values);

  const groups = SLIDERS.reduce<Record<string, typeof SLIDERS>>((acc, s) => {
    (acc[s.group] ??= []).push(s);
    return acc;
  }, {});

  return (
    <div style={{ background: "#000", color: "#fff", minHeight: "100vh" }}>
      <div style={{ position: "fixed", top: 0, left: 0, right: "300px", bottom: 0, display: "flex", alignItems: "center", justifyContent: "center", padding: "24px" }}>
        <article style={{ width: "100%", height: "88vh", display: "flex", flexDirection: "column" }}>
          <div style={buildCardStyle(values)}>
            {overlays.map((style, i) => (
              <div key={i} style={style} />
            ))}
            <header style={{ display: "flex", alignItems: "center", gap: "18px", padding: "20px 28px 16px", flexShrink: 0, position: "relative", zIndex: 5 }}>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: "11px", letterSpacing: "0.2em", color: "rgba(255,255,255,0.28)" }}>{screen.number}</span>
              <h3 style={{ fontFamily: "var(--font-serif)", fontSize: "28px", color: "rgba(255,255,255,0.92)", fontWeight: 400 }}>
                {screen.logo ? <img src={screen.logo.src} alt={screen.logo.alt} style={{ height: "28px" }} /> : screen.name}
              </h3>
              <span style={{ flex: 1, height: "1px", background: "rgba(255,255,255,0.08)" }} />
            </header>
            <div style={{ flex: 1, overflowY: "clip", minHeight: 0, position: "relative", zIndex: 5 }}>
              <DetailBody screen={screen} />
            </div>
          </div>
        </article>
      </div>

      <div style={{ position: "fixed", top: 0, right: 0, width: "300px", bottom: 0, background: "rgba(8,8,8,0.95)", backdropFilter: "blur(16px)", borderLeft: "1px solid rgba(255,255,255,0.06)", overflowY: "auto", padding: "0 0 24px" }}>
        <div style={{ padding: "16px", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: "10px", letterSpacing: "0.16em", textTransform: "uppercase", color: "rgba(255,255,255,0.5)", marginBottom: "12px" }}>
            Card Lighting Lab
          </div>
          <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginBottom: "12px" }}>
            {WORK_SCREENS.map((s, i) => (
              <button key={s.id} onClick={() => setActiveCard(i)} style={{ fontFamily: "var(--font-mono)", fontSize: "9px", letterSpacing: "0.12em", textTransform: "uppercase", color: i === activeCard ? "rgba(255,255,255,0.85)" : "rgba(255,255,255,0.35)", background: i === activeCard ? "rgba(255,255,255,0.06)" : "none", border: `1px solid ${i === activeCard ? "rgba(255,255,255,0.14)" : "rgba(255,255,255,0.04)"}`, borderRadius: "3px", padding: "4px 10px 3px", cursor: "pointer" }}>
                {s.name}
              </button>
            ))}
          </div>
          <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
            {PRESETS.map((p) => (
              <button key={p.label} onClick={() => setValues((prev) => ({ ...prev, ...p.values }))} style={{ fontFamily: "var(--font-mono)", fontSize: "9px", letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(255,255,255,0.4)", background: "none", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "3px", padding: "4px 10px 3px", cursor: "pointer" }}>
                {p.label}
              </button>
            ))}
            <button onClick={() => setValues({ ...DEFAULTS })} style={{ fontFamily: "var(--font-mono)", fontSize: "9px", letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)", background: "none", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "3px", padding: "4px 10px 3px", cursor: "pointer" }}>
              Reset
            </button>
          </div>
        </div>

        {Object.entries(groups).map(([group, sliders]) => (
          <div key={group} style={{ padding: "10px 16px 6px", borderBottom: "1px solid rgba(255,255,255,0.03)" }}>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: "9px", letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(255,255,255,0.25)", marginBottom: "6px" }}>{group}</div>
            {sliders.map((s) => (
              <label key={s.key} style={{ display: "grid", gridTemplateColumns: "1fr 100px 45px", alignItems: "center", gap: "6px", padding: "3px 0" }}>
                <span style={{ fontFamily: "var(--font-sans)", fontSize: "11px", color: "rgba(255,255,255,0.45)" }}>{s.label}</span>
                <input type="range" min={s.min} max={s.max} step={s.step} value={values[s.key]} onChange={(e) => set(s.key, parseFloat(e.target.value))} style={{ width: "100%" }} />
                <span style={{ fontFamily: "var(--font-mono)", fontSize: "10px", color: "rgba(255,255,255,0.3)", textAlign: "right" }}>
                  {values[s.key] < 1 && s.max <= 1 ? (values[s.key] * 100).toFixed(0) + "%" : String(values[s.key])}
                </span>
              </label>
            ))}
          </div>
        ))}

        <div style={{ padding: "12px 16px", borderTop: "1px solid rgba(255,255,255,0.04)" }}>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: "9px", letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(255,255,255,0.25)", marginBottom: "8px" }}>CSS Output</div>
          <pre style={{ fontFamily: "var(--font-mono)", fontSize: "9px", lineHeight: 1.5, color: "rgba(255,255,255,0.4)", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.04)", borderRadius: "4px", padding: "10px", whiteSpace: "pre-wrap", wordBreak: "break-all" }}>
            {buildCssOutput(values)}
          </pre>
        </div>
      </div>
    </div>
  );
}
