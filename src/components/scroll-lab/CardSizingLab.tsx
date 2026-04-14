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

interface SizingValues {
  maxWidth: number;
  horizontalPad: number;
  verticalPad: number;
  cardRadius: number;
  cardMargin: number;
  cardHeight: number;
}

const DEFAULTS: SizingValues = {
  maxWidth: 1200,
  horizontalPad: 48,
  verticalPad: 48,
  cardRadius: 32,
  cardMargin: 8,
  cardHeight: 100,
};

const PRESETS: { label: string; values: Partial<SizingValues> }[] = [
  { label: "Current", values: { maxWidth: 1200, horizontalPad: 48, verticalPad: 48, cardRadius: 32, cardMargin: 8, cardHeight: 100 } },
  { label: "Full bleed", values: { maxWidth: 9999, horizontalPad: 0, verticalPad: 0, cardRadius: 0, cardMargin: 0, cardHeight: 100 } },
  { label: "Full + inset", values: { maxWidth: 9999, horizontalPad: 24, verticalPad: 16, cardRadius: 24, cardMargin: 8, cardHeight: 100 } },
  { label: "Wide glass", values: { maxWidth: 9999, horizontalPad: 32, verticalPad: 24, cardRadius: 32, cardMargin: 12, cardHeight: 96 } },
  { label: "Cinematic", values: { maxWidth: 9999, horizontalPad: 48, verticalPad: 80, cardRadius: 14, cardMargin: 0, cardHeight: 85 } },
  { label: "Compact", values: { maxWidth: 900, horizontalPad: 32, verticalPad: 32, cardRadius: 20, cardMargin: 8, cardHeight: 90 } },
];

const SLIDERS: { key: keyof SizingValues; label: string; min: number; max: number; step: number; unit: string }[] = [
  { key: "maxWidth", label: "Max width", min: 600, max: 9999, step: 50, unit: "px" },
  { key: "horizontalPad", label: "H padding", min: 0, max: 120, step: 4, unit: "px" },
  { key: "verticalPad", label: "V padding", min: 0, max: 120, step: 4, unit: "px" },
  { key: "cardRadius", label: "Radius", min: 0, max: 48, step: 1, unit: "px" },
  { key: "cardMargin", label: "Card margin", min: 0, max: 32, step: 2, unit: "px" },
  { key: "cardHeight", label: "Card height", min: 50, max: 100, step: 1, unit: "vh" },
];

export default function CardSizingLab() {
  const [values, setValues] = useState<SizingValues>({ ...DEFAULTS });
  const [activeCard, setActiveCard] = useState(0);

  const set = useCallback(
    (key: keyof SizingValues, v: number) => setValues((prev) => ({ ...prev, [key]: v })),
    []
  );

  const applyPreset = useCallback((preset: Partial<SizingValues>) => {
    setValues((prev) => ({ ...prev, ...preset }));
  }, []);

  const screen = WORK_SCREENS[activeCard];
  const maxW = values.maxWidth >= 9999 ? "none" : `${values.maxWidth}px`;

  const cssOutput = `/* Card sizing — paste into globals.css */
.work__screen {
  max-width: ${maxW};
  padding: ${values.verticalPad}px ${values.horizontalPad}px;
  height: ${values.cardHeight}vh;
}
.work__screen--detail {
  border-radius: ${values.cardRadius}px;
  margin: ${values.cardMargin}px;
}`;

  return (
    <div className="cslab">
      <div
        className="cslab__viewport"
        style={{
          background: "#000",
          position: "fixed",
          top: 0,
          left: 0,
          right: "300px",
          bottom: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <article
          style={{
            width: "100%",
            maxWidth: maxW,
            height: `${values.cardHeight}vh`,
            padding: `${values.verticalPad}px ${values.horizontalPad}px`,
            margin: "0 auto",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div
            style={{
              flex: 1,
              background: "rgba(255,255,255,0.04)",
              backdropFilter: "blur(24px) saturate(1.4)",
              WebkitBackdropFilter: "blur(24px) saturate(1.4)",
              border: "1px solid rgba(255,255,255,0.06)",
              borderRadius: `${values.cardRadius}px`,
              margin: `${values.cardMargin}px`,
              boxShadow: "inset 0 0 80px rgba(0,0,0,0.4)",
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
              position: "relative",
            }}
          >
            <header
              style={{
                display: "flex",
                alignItems: "center",
                gap: "18px",
                padding: "20px 28px 16px",
                flexShrink: 0,
              }}
            >
              <span style={{ fontFamily: "var(--font-mono)", fontSize: "11px", letterSpacing: "0.2em", color: "rgba(255,255,255,0.28)" }}>
                {screen.number}
              </span>
              <h3 style={{ fontFamily: "var(--font-serif)", fontSize: "28px", color: "rgba(255,255,255,0.92)", fontWeight: 400 }}>
                {screen.logo ? (
                  <img src={screen.logo.src} alt={screen.logo.alt} style={{ height: "28px" }} />
                ) : (
                  screen.name
                )}
              </h3>
              <span style={{ flex: 1, height: "1px", background: "rgba(255,255,255,0.08)" }} />
            </header>
            <div style={{ flex: 1, overflowY: "auto", minHeight: 0 }}>
              <DetailBody screen={screen} />
            </div>
            <div
              style={{
                position: "absolute",
                inset: 0,
                borderRadius: `${values.cardRadius}px`,
                background: "radial-gradient(ellipse 110% 90% at 50% 50%, transparent 40%, rgba(0,0,0,1) 100%)",
                pointerEvents: "none",
                zIndex: 1,
              }}
            />
          </div>
        </article>
      </div>

      <div
        className="cslab__panel"
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          width: "300px",
          bottom: 0,
          background: "rgba(8,8,8,0.95)",
          backdropFilter: "blur(16px)",
          borderLeft: "1px solid rgba(255,255,255,0.06)",
          overflowY: "auto",
          padding: "0 0 24px",
          color: "#fff",
        }}
      >
        <div style={{ padding: "16px", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: "10px", letterSpacing: "0.16em", textTransform: "uppercase", color: "rgba(255,255,255,0.5)", marginBottom: "12px" }}>
            Card Sizing Lab
          </div>

          <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginBottom: "16px" }}>
            {WORK_SCREENS.map((s, i) => (
              <button
                key={s.id}
                onClick={() => setActiveCard(i)}
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "9px",
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: i === activeCard ? "rgba(255,255,255,0.85)" : "rgba(255,255,255,0.35)",
                  background: i === activeCard ? "rgba(255,255,255,0.06)" : "none",
                  border: `1px solid ${i === activeCard ? "rgba(255,255,255,0.14)" : "rgba(255,255,255,0.04)"}`,
                  borderRadius: "3px",
                  padding: "4px 10px 3px",
                  cursor: "pointer",
                }}
              >
                {s.name}
              </button>
            ))}
          </div>
        </div>

        <div style={{ padding: "12px 16px 8px", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: "9px", letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(255,255,255,0.25)", marginBottom: "8px" }}>
            Presets
          </div>
          <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
            {PRESETS.map((p) => (
              <button
                key={p.label}
                onClick={() => applyPreset(p.values)}
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "9px",
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: "rgba(255,255,255,0.4)",
                  background: "none",
                  border: "1px solid rgba(255,255,255,0.06)",
                  borderRadius: "3px",
                  padding: "4px 10px 3px",
                  cursor: "pointer",
                }}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        <div style={{ padding: "12px 16px" }}>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: "9px", letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(255,255,255,0.25)", marginBottom: "8px" }}>
            Dimensions
          </div>
          {SLIDERS.map((s) => (
            <label
              key={s.key}
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 110px 50px",
                alignItems: "center",
                gap: "6px",
                padding: "4px 0",
              }}
            >
              <span style={{ fontFamily: "var(--font-sans)", fontSize: "11px", color: "rgba(255,255,255,0.45)" }}>
                {s.label}
              </span>
              <input
                type="range"
                min={s.min}
                max={s.max}
                step={s.step}
                value={values[s.key]}
                onChange={(e) => set(s.key, parseFloat(e.target.value))}
                style={{ width: "100%" }}
              />
              <span style={{ fontFamily: "var(--font-mono)", fontSize: "10px", color: "rgba(255,255,255,0.3)", textAlign: "right" }}>
                {values[s.key] >= 9999 ? "full" : `${values[s.key]}${s.unit}`}
              </span>
            </label>
          ))}
        </div>

        <div style={{ padding: "12px 16px", borderTop: "1px solid rgba(255,255,255,0.04)" }}>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: "9px", letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(255,255,255,0.25)", marginBottom: "8px" }}>
            CSS Output
          </div>
          <pre
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "10px",
              lineHeight: 1.6,
              color: "rgba(255,255,255,0.5)",
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.04)",
              borderRadius: "4px",
              padding: "12px",
              whiteSpace: "pre-wrap",
              wordBreak: "break-all",
            }}
          >
            {cssOutput}
          </pre>
        </div>
      </div>
    </div>
  );
}
