"use client";

/**
 * Supply Chain — Mobile Layout Lab
 *
 * Local-only preview for 4 candidate mobile layouts of the Supply Chain
 * journey (Work screen 3/4). Renders each inside a 375×812 phone frame so
 * you can compare feel side-by-side without a real device.
 *
 * Variants:
 *  1. Current      — Horizontal timeline (same as prod, for baseline)
 *  2. Vertical rail — Scrolling vertical stop list, small globe pinned top
 *  3. Pills + sheet — Compact pill row, big globe, bottom sheet copy
 *  4. Swipe cards   — Full-screen card per stop, swipe/tap to advance
 */

import { useState, useMemo } from "react";
import dynamic from "next/dynamic";
import { JOURNEY_STOPS, JOURNEY_ARCS } from "@/data/scLab";

const RealisticGlobe = dynamic(
  () => import("@/components/ui/realistic-globe"),
  { ssr: false }
);

type VariantId = "current" | "rail" | "pills" | "cards";

const VARIANTS: { id: VariantId; label: string; blurb: string }[] = [
  { id: "current", label: "1. Current (horizontal)", blurb: "Baseline — same as prod. Cramped nav." },
  { id: "rail", label: "2. Vertical rail", blurb: "Stops scroll as a list. Globe sticks to top." },
  { id: "pills", label: "3. Pills + sheet", blurb: "Pill row, big globe, copy in bottom sheet." },
  { id: "cards", label: "4. Swipe cards", blurb: "One stop at a time, full-screen. Swipe to advance." },
];

export default function SupplyChainMobileLab() {
  const [variant, setVariant] = useState<VariantId>("rail");

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0a0a0a",
        color: "#f3f3f3",
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif",
        padding: "24px",
        display: "grid",
        gridTemplateColumns: "1fr 300px",
        gap: "32px",
        alignItems: "start",
      }}
    >
      {/* Stage */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
        <h1 style={{ fontSize: 18, margin: 0, letterSpacing: "0.04em", textTransform: "uppercase", opacity: 0.75 }}>
          Supply Chain — Mobile Layout Lab
        </h1>

        {/* Tabs */}
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "center" }}>
          {VARIANTS.map((v) => (
            <button
              key={v.id}
              type="button"
              onClick={() => setVariant(v.id)}
              style={{
                background: variant === v.id ? "#f3f3f3" : "transparent",
                color: variant === v.id ? "#0a0a0a" : "#f3f3f3",
                border: "1px solid rgba(255,255,255,0.25)",
                padding: "8px 14px",
                fontFamily: "ui-monospace, Menlo, monospace",
                fontSize: 12,
                letterSpacing: "0.04em",
                cursor: "pointer",
                borderRadius: 4,
              }}
            >
              {v.label}
            </button>
          ))}
        </div>

        {/* Phone frame */}
        <div
          style={{
            width: 390,
            height: 844,
            borderRadius: 52,
            background: "#000",
            padding: 14,
            border: "2px solid rgba(255,255,255,0.15)",
            boxShadow: "0 24px 60px rgba(0,0,0,0.6)",
            position: "relative",
          }}
        >
          {/* Notch */}
          <div
            style={{
              position: "absolute",
              top: 14,
              left: "50%",
              transform: "translateX(-50%)",
              width: 120,
              height: 28,
              background: "#000",
              borderRadius: "0 0 18px 18px",
              zIndex: 10,
            }}
          />
          {/* Screen */}
          <div
            style={{
              width: "100%",
              height: "100%",
              borderRadius: 40,
              overflow: "hidden",
              position: "relative",
              background: "#0a0a0a",
            }}
          >
            {variant === "current" && <CurrentVariant />}
            {variant === "rail" && <RailVariant />}
            {variant === "pills" && <PillsVariant />}
            {variant === "cards" && <CardsVariant />}
          </div>
        </div>
      </div>

      {/* Info sidebar */}
      <aside
        style={{
          position: "sticky",
          top: 24,
          border: "1px solid rgba(255,255,255,0.15)",
          borderRadius: 8,
          padding: 20,
          background: "rgba(255,255,255,0.02)",
        }}
      >
        <div style={{ fontFamily: "ui-monospace, Menlo, monospace", fontSize: 11, letterSpacing: "0.08em", opacity: 0.5, textTransform: "uppercase", marginBottom: 8 }}>
          Active variant
        </div>
        <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 6 }}>
          {VARIANTS.find((v) => v.id === variant)?.label}
        </div>
        <div style={{ fontSize: 13, opacity: 0.7, lineHeight: 1.5, marginBottom: 20 }}>
          {VARIANTS.find((v) => v.id === variant)?.blurb}
        </div>

        <div style={{ borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: 16, fontSize: 12, opacity: 0.6, lineHeight: 1.5 }}>
          <div style={{ fontFamily: "ui-monospace, Menlo, monospace", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 8, opacity: 0.8 }}>
            Trade-offs
          </div>
          {variant === "current" && <div>Fits all stops in view but labels truncate. Globe gets small. Tap targets tight.</div>}
          {variant === "rail" && <div>Reads like a resume. Each stop gets full-width prose. Globe is a companion, not the star.</div>}
          {variant === "pills" && <div>Globe keeps center stage. Quick nav via pills. Sheet focuses attention on copy.</div>}
          {variant === "cards" && <div>Cinematic. One stop per screen. Lowest info density — requires swipe discovery.</div>}
        </div>

        <div style={{ marginTop: 20, fontSize: 11, opacity: 0.45, fontFamily: "ui-monospace, Menlo, monospace" }}>
          Frame: 390×844 (iPhone 14 Pro)
        </div>
      </aside>
    </div>
  );
}

/* ────────────────────────────────────────────────────────────────────── */
/* VARIANT 1 — Current (horizontal, matches prod)                         */
/* ────────────────────────────────────────────────────────────────────── */

function CurrentVariant() {
  const [selected, setSelected] = useState(0);
  const dots = useMemo(
    () => JOURNEY_STOPS.map((s, i) => ({ coords: s.coords, label: s.label, selected: i === selected })),
    [selected]
  );
  const stop = JOURNEY_STOPS[selected];

  return (
    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", padding: "52px 14px 14px", boxSizing: "border-box" }}>
      {/* Horizontal nav */}
      <div style={{ display: "flex", gap: 6, overflowX: "auto", paddingBottom: 8 }}>
        {JOURNEY_STOPS.map((s, i) => (
          <button
            key={s.id}
            onClick={() => setSelected(i)}
            style={{
              flex: "0 0 auto",
              padding: "6px 8px",
              background: i === selected ? "rgba(255,255,255,0.14)" : "transparent",
              border: `1px solid rgba(255,255,255,${i === selected ? 0.36 : 0.2})`,
              color: "#f3f3f3",
              fontSize: 10,
              fontFamily: "ui-monospace, Menlo, monospace",
              borderRadius: 4,
              cursor: "pointer",
              minWidth: 80,
              textAlign: "left",
            }}
          >
            <div style={{ opacity: 0.6, fontSize: 9 }}>0{i + 1}</div>
            <div style={{ fontSize: 10, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{s.headline}</div>
            <div style={{ opacity: 0.5, fontSize: 9 }}>{s.label} · {s.year}</div>
          </button>
        ))}
      </div>

      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
        <RealisticGlobe
          width={220}
          height={220}
          autoRotate={false}
          frozen
          visualStyle="clouds"
          lonOffset={-69}
          latOffset={40}
          journeyDots={dots}
          selectedDot={selected}
          journeyArcs={JOURNEY_ARCS}
          onDotClick={setSelected}
        />
      </div>

      <div style={{ padding: 12, border: "1px solid rgba(255,255,255,0.15)", background: "rgba(10,10,10,0.6)", borderRadius: 6 }}>
        <div style={{ fontSize: 10, fontFamily: "ui-monospace, Menlo, monospace", opacity: 0.5 }}>{stop.year}</div>
        <div style={{ fontSize: 15, fontWeight: 600, marginTop: 2 }}>{stop.title}</div>
        <div style={{ fontSize: 12, opacity: 0.75, marginTop: 4, lineHeight: 1.4 }}>{stop.description}</div>
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────────────────────────────── */
/* VARIANT 2 — Vertical rail                                              */
/* ────────────────────────────────────────────────────────────────────── */

function RailVariant() {
  const [selected, setSelected] = useState(0);
  const dots = useMemo(
    () => JOURNEY_STOPS.map((s, i) => ({ coords: s.coords, label: s.label, selected: i === selected })),
    [selected]
  );

  return (
    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", paddingTop: 44 }}>
      {/* Sticky globe at top */}
      <div
        style={{
          height: 260,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderBottom: "1px solid rgba(255,255,255,0.08)",
          flexShrink: 0,
        }}
      >
        <RealisticGlobe
          width={240}
          height={240}
          autoRotate={false}
          frozen
          visualStyle="clouds"
          lonOffset={-69}
          latOffset={40}
          journeyDots={dots}
          selectedDot={selected}
          journeyArcs={JOURNEY_ARCS}
          onDotClick={setSelected}
        />
      </div>

      {/* Scrolling rail */}
      <div style={{ flex: 1, overflowY: "auto", padding: "16px 16px 40px" }}>
        <div style={{ position: "relative", paddingLeft: 28 }}>
          {/* Vertical line */}
          <div
            style={{
              position: "absolute",
              left: 10,
              top: 10,
              bottom: 10,
              width: 1,
              background: "rgba(255,255,255,0.18)",
            }}
          />
          {JOURNEY_STOPS.map((s, i) => {
            const active = i === selected;
            return (
              <button
                key={s.id}
                onClick={() => setSelected(i)}
                style={{
                  display: "block",
                  width: "100%",
                  textAlign: "left",
                  background: "transparent",
                  border: "none",
                  padding: "12px 0 20px",
                  color: "inherit",
                  cursor: "pointer",
                  position: "relative",
                }}
              >
                {/* Dot */}
                <div
                  style={{
                    position: "absolute",
                    left: -24,
                    top: 14,
                    width: 13,
                    height: 13,
                    borderRadius: "50%",
                    border: `2px solid rgba(255,255,255,${active ? 1 : 0.4})`,
                    background: active ? "#f3f3f3" : "transparent",
                    boxShadow: active ? "0 0 12px rgba(255,255,255,0.5)" : "none",
                  }}
                />
                <div
                  style={{
                    fontFamily: "ui-monospace, Menlo, monospace",
                    fontSize: 10,
                    letterSpacing: "0.1em",
                    opacity: active ? 0.9 : 0.5,
                    marginBottom: 2,
                  }}
                >
                  {s.year} · {s.label.toUpperCase()}
                </div>
                <div
                  style={{
                    fontSize: 17,
                    fontWeight: 600,
                    marginBottom: 4,
                    opacity: active ? 1 : 0.75,
                  }}
                >
                  {s.headline}
                </div>
                {active && (
                  <div style={{ fontSize: 13, opacity: 0.7, lineHeight: 1.5, marginTop: 6 }}>
                    {s.description}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────────────────────────────── */
/* VARIANT 3 — Pills + bottom sheet                                       */
/* ────────────────────────────────────────────────────────────────────── */

function PillsVariant() {
  const [selected, setSelected] = useState(0);
  const dots = useMemo(
    () => JOURNEY_STOPS.map((s, i) => ({ coords: s.coords, label: s.label, selected: i === selected })),
    [selected]
  );
  const stop = JOURNEY_STOPS[selected];

  return (
    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", paddingTop: 44, position: "relative" }}>
      {/* Pill row */}
      <div style={{ display: "flex", gap: 6, padding: "12px 14px 8px", overflowX: "auto" }}>
        {JOURNEY_STOPS.map((s, i) => (
          <button
            key={s.id}
            onClick={() => setSelected(i)}
            style={{
              flex: "0 0 auto",
              padding: "7px 14px",
              background: i === selected ? "#f3f3f3" : "transparent",
              color: i === selected ? "#0a0a0a" : "#f3f3f3",
              border: `1px solid rgba(255,255,255,${i === selected ? 1 : 0.25})`,
              borderRadius: 999,
              fontFamily: "ui-monospace, Menlo, monospace",
              fontSize: 11,
              letterSpacing: "0.06em",
              cursor: "pointer",
              whiteSpace: "nowrap",
            }}
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* Big globe */}
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <RealisticGlobe
          width={320}
          height={320}
          autoRotate={false}
          frozen
          visualStyle="clouds"
          lonOffset={-69}
          latOffset={40}
          journeyDots={dots}
          selectedDot={selected}
          journeyArcs={JOURNEY_ARCS}
          onDotClick={setSelected}
        />
      </div>

      {/* Bottom sheet */}
      <div
        style={{
          background: "rgba(15,15,15,0.96)",
          backdropFilter: "blur(12px)",
          borderTop: "1px solid rgba(255,255,255,0.12)",
          borderRadius: "20px 20px 0 0",
          padding: "14px 18px 26px",
          boxShadow: "0 -10px 30px rgba(0,0,0,0.4)",
        }}
      >
        {/* Grabber */}
        <div
          style={{
            width: 40,
            height: 4,
            background: "rgba(255,255,255,0.25)",
            borderRadius: 2,
            margin: "0 auto 14px",
          }}
        />
        <div style={{ fontFamily: "ui-monospace, Menlo, monospace", fontSize: 10, opacity: 0.55, letterSpacing: "0.1em" }}>
          {stop.year}
        </div>
        <div style={{ fontSize: 20, fontWeight: 700, marginTop: 2, fontFamily: "Georgia, serif" }}>
          {stop.headline}
        </div>
        <div style={{ fontSize: 13, opacity: 0.72, lineHeight: 1.5, marginTop: 8 }}>
          {stop.description}
        </div>
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────────────────────────────── */
/* VARIANT 4 — Swipe cards                                                */
/* ────────────────────────────────────────────────────────────────────── */

function CardsVariant() {
  const [selected, setSelected] = useState(0);
  const dots = useMemo(
    () => JOURNEY_STOPS.map((s, i) => ({ coords: s.coords, label: s.label, selected: i === selected })),
    [selected]
  );
  const stop = JOURNEY_STOPS[selected];
  const total = JOURNEY_STOPS.length;

  return (
    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", paddingTop: 44 }}>
      {/* Progress dots */}
      <div style={{ display: "flex", justifyContent: "center", gap: 6, padding: "14px 0" }}>
        {JOURNEY_STOPS.map((s, i) => (
          <button
            key={s.id}
            onClick={() => setSelected(i)}
            style={{
              width: i === selected ? 24 : 6,
              height: 6,
              borderRadius: 3,
              background: i === selected ? "#f3f3f3" : "rgba(255,255,255,0.3)",
              border: "none",
              cursor: "pointer",
              transition: "width 0.2s",
              padding: 0,
            }}
          />
        ))}
      </div>

      {/* Stop counter */}
      <div style={{ textAlign: "center", fontFamily: "ui-monospace, Menlo, monospace", fontSize: 10, opacity: 0.5, letterSpacing: "0.12em" }}>
        STOP {String(selected + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
      </div>

      {/* Globe */}
      <div style={{ flex: "0 0 auto", display: "flex", alignItems: "center", justifyContent: "center", padding: "16px 0" }}>
        <RealisticGlobe
          width={260}
          height={260}
          autoRotate={false}
          frozen
          visualStyle="clouds"
          lonOffset={-69}
          latOffset={40}
          journeyDots={dots}
          selectedDot={selected}
          journeyArcs={JOURNEY_ARCS}
          onDotClick={setSelected}
        />
      </div>

      {/* Card content */}
      <div style={{ flex: 1, padding: "8px 24px 20px", display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>
        <div style={{ fontFamily: "ui-monospace, Menlo, monospace", fontSize: 10, opacity: 0.55, letterSpacing: "0.14em" }}>
          {stop.year.toUpperCase()} · {stop.label.toUpperCase()}
        </div>
        <div style={{ fontSize: 24, fontWeight: 700, marginTop: 6, lineHeight: 1.15, fontFamily: "Georgia, serif" }}>
          {stop.headline}
        </div>
        <div style={{ fontSize: 13, opacity: 0.72, lineHeight: 1.55, marginTop: 10 }}>
          {stop.description}
        </div>
      </div>

      {/* Nav arrows */}
      <div style={{ display: "flex", justifyContent: "space-between", padding: "0 18px 20px" }}>
        <button
          onClick={() => setSelected((s) => Math.max(0, s - 1))}
          disabled={selected === 0}
          style={{
            background: "transparent",
            border: "1px solid rgba(255,255,255,0.25)",
            color: "#f3f3f3",
            width: 44,
            height: 44,
            borderRadius: "50%",
            fontSize: 18,
            cursor: selected === 0 ? "not-allowed" : "pointer",
            opacity: selected === 0 ? 0.3 : 1,
          }}
        >
          ‹
        </button>
        <button
          onClick={() => setSelected((s) => Math.min(total - 1, s + 1))}
          disabled={selected === total - 1}
          style={{
            background: "#f3f3f3",
            border: "1px solid #f3f3f3",
            color: "#0a0a0a",
            width: 44,
            height: 44,
            borderRadius: "50%",
            fontSize: 18,
            cursor: selected === total - 1 ? "not-allowed" : "pointer",
            opacity: selected === total - 1 ? 0.3 : 1,
          }}
        >
          ›
        </button>
      </div>
    </div>
  );
}
