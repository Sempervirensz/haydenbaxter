"use client";

// ─────────────────────────────────────────────────────────────────────────────
// WORK DISPLAY LAB — Top text treatment experiments
// Five refined concepts (A–E) for the Work landing screen header.
//
// HOW TO SWITCH CONCEPTS
//   Change DEFAULT_CONCEPT below to "A"–"E".
//   Or use the picker UI rendered at the bottom of the screen.
//
// ADJUSTABLE CONFIG — see LAB_CONFIG below.
// ─────────────────────────────────────────────────────────────────────────────

import { useEffect, useRef, useState } from "react";
import "./lab.css";

// ─── CONFIG ──────────────────────────────────────────────────────────────────

type ConceptKey = "A" | "B" | "C" | "C2" | "C3" | "D" | "E";
const DEFAULT_CONCEPT: ConceptKey = "A";

const LAB_CONFIG = {
  title: "Work",
  quote: "Rooted in outcome and action.",

  // Dim opacity for non-active list rows (C / D).
  trackListDimOpacity: 0.24,

  // 0 = instant snaps · 1 = full motion.
  motionIntensity: 0.8,

  tracks: [
    { label: "",                     track: "00", display: "Intro",        sub: "The body of work." },
    { label: "WorldPulse",           track: "01", display: "WorldPulse",   sub: "Founder · Supply chain transparency" },
    { label: "Emerging Tech Builds", track: "02", display: "Emerging Tech", sub: "AI systems · Prototypes · R&D" },
    { label: "Supply Chain",         track: "03", display: "Supply Chain", sub: "Fortune 100 sourcing · 8+ years Asia" },
    { label: "Consulting",           track: "04", display: "Consulting",   sub: "Strategy that ships." },
  ],
};

// ─── Scroll hook (mirrors useWorkScroll, self-contained) ─────────────────────

const ZONES = [
  { hold: [0.0,  0.15],  deg:    0, label: "" },
  { hold: [0.18, 0.35],  deg:  -45, label: "WorldPulse" },
  { hold: [0.38, 0.55],  deg: -135, label: "Emerging Tech Builds" },
  { hold: [0.58, 0.75],  deg: -225, label: "Supply Chain" },
  { hold: [0.78, 0.92],  deg: -315, label: "Consulting" },
  { hold: [0.96, 0.985], deg: -360, label: "" },
];

const SCREEN_BREAKS = [0, 0.35, 0.56, 0.77, 0.95, 1];

function ease(t: number) { return t < 0.5 ? 2*t*t : 1 - Math.pow(-2*t+2,2)/2; }
function clamp01(v: number) { return Math.max(0, Math.min(1, v)); }

function getCdState(progress: number) {
  const p = clamp01(progress);
  for (const z of ZONES) {
    if (p >= z.hold[0] && p <= z.hold[1]) return { deg: z.deg, label: z.label };
  }
  const last = ZONES[ZONES.length - 1];
  if (p > last.hold[1]) {
    const extra = (p - last.hold[1]) / (1 - last.hold[1]);
    return { deg: last.deg - extra * extra * 720, label: last.label };
  }
  for (let i = 0; i < ZONES.length - 1; i++) {
    const s = ZONES[i], e = ZONES[i+1];
    if (p > s.hold[1] && p < e.hold[0]) {
      const t = ease((p - s.hold[1]) / (e.hold[0] - s.hold[1]));
      return { deg: s.deg + (e.deg - s.deg) * t, label: t < 0.5 ? s.label : e.label };
    }
  }
  return { deg: 0, label: "" };
}

function useLabScroll(containerRef: React.RefObject<HTMLElement | null>) {
  const [activeLabel, setActiveLabel] = useState("");

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    let currentDeg = 0;
    let rafId = 0;
    let lastLabel = "";

    const discEl = el.querySelector<HTMLElement>(".wdl-disc");

    const getProgress = () => {
      const rect = el.getBoundingClientRect();
      const scrollH = Math.max(el.offsetHeight - window.innerHeight, 0);
      const scrolled = Math.max(0, Math.min(scrollH, -rect.top));
      return scrollH > 0 ? scrolled / scrollH : 0;
    };

    const tick = () => {
      const progress = getProgress();
      const firstBreak = SCREEN_BREAKS[1] || 1;
      const landingProgress = firstBreak > 0 ? clamp01(progress / firstBreak) : 0;
      const { deg, label } = getCdState(landingProgress);

      currentDeg += (deg - currentDeg) * 0.08;
      if (Math.abs(deg - currentDeg) < 0.01) currentDeg = deg;

      if (discEl) discEl.style.setProperty("--lab-deg", `${currentDeg}deg`);

      if (label !== lastLabel) {
        lastLabel = label;
        setActiveLabel(label);
      }

      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [containerRef]);

  return { activeLabel };
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getTrack(label: string) {
  return LAB_CONFIG.tracks.find((t) => t.label === label) ?? LAB_CONFIG.tracks[0];
}

function getTrackIndex(label: string) {
  // Position within the 4 real tracks (01–04); -1 during intro/outro.
  const real = LAB_CONFIG.tracks.filter((t) => t.label !== "");
  return real.findIndex((t) => t.label === label);
}

type ConceptProps = { activeLabel: string };

// ─────────────────────────────────────────────────────────────────────────────
// CONCEPT A — Index Leaf
// Left-aligned serif "Work" masthead, tiny "N° 01/04" ticker on the right,
// single hairline, live project name below with mono track tag on the right.
// ─────────────────────────────────────────────────────────────────────────────

function ConceptA({ activeLabel }: ConceptProps) {
  const track = getTrack(activeLabel);
  const idx = Math.max(0, getTrackIndex(activeLabel));
  const dur = `${Math.round(280 * LAB_CONFIG.motionIntensity)}ms`;

  return (
    <div className="wdl-concept wdl-concept--a">
      <div className="wdl-a__masthead">
        <h2 className="wdl-a__title">{LAB_CONFIG.title}</h2>
        <span className="wdl-a__ticker" aria-hidden="true">
          N°&nbsp;<span className="wdl-a__tickerNum" key={track.track}>{String(idx + 1).padStart(2, "0")}</span>
          &nbsp;/&nbsp;04
        </span>
      </div>

      <div className="wdl-a__rule" />

      <div
        className="wdl-a__readout"
        style={{ "--readout-dur": dur } as React.CSSProperties}
      >
        <span className="wdl-a__name" key={track.label}>
          {track.display}
        </span>
        <span className="wdl-a__tag" key={track.label + "-tag"}>
          T·{track.track}
        </span>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// CONCEPT B — Numeral
// A single giant serif numeral (dim, structural) anchors the left.
// Project name sits at its baseline. One hairline. Nothing else.
// ─────────────────────────────────────────────────────────────────────────────

function ConceptB({ activeLabel }: ConceptProps) {
  const track = getTrack(activeLabel);
  const dur = `${Math.round(300 * LAB_CONFIG.motionIntensity)}ms`;

  return (
    <div className="wdl-concept wdl-concept--b">
      <div className="wdl-b__wrap">
        <div className="wdl-b__numCol">
          <span className="wdl-b__prefix" aria-hidden="true">N°</span>
          <span
            className="wdl-b__bigNum"
            key={track.track}
            style={{ "--readout-dur": dur } as React.CSSProperties}
            aria-hidden="true"
          >
            {track.track}
          </span>
        </div>

        <div className="wdl-b__textCol">
          <h2
            className="wdl-b__name"
            key={track.label}
            style={{ "--readout-dur": dur } as React.CSSProperties}
          >
            {track.display}
          </h2>
        </div>
      </div>

      <div className="wdl-b__rule" />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// CONCEPT C — Contents
// A quiet printed table of contents. Small mono heading, four rows, hairlines.
// Active row brightens and grows a bullet. No marquee. No sub copy.
// ─────────────────────────────────────────────────────────────────────────────

function ConceptC({ activeLabel }: ConceptProps) {
  const dur = `${Math.round(300 * LAB_CONFIG.motionIntensity)}ms`;

  return (
    <div className="wdl-concept wdl-concept--c">
      <div className="wdl-c__head">
        <span className="wdl-c__eyebrow">Contents</span>
        <span className="wdl-c__eyebrow wdl-c__eyebrow--right">{LAB_CONFIG.title}</span>
      </div>

      <ol
        className="wdl-c__list"
        style={{ "--dim-opacity": LAB_CONFIG.trackListDimOpacity, "--list-dur": dur } as React.CSSProperties}
      >
        {LAB_CONFIG.tracks.filter((t) => t.label !== "").map((t) => {
          const isActive = t.label === activeLabel;
          return (
            <li key={t.label} className={`wdl-c__item ${isActive ? "is-active" : ""}`}>
              <span className="wdl-c__bullet" aria-hidden="true" />
              <span className="wdl-c__num">{t.track}</span>
              <span className="wdl-c__name">{t.display}</span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// CONCEPT C2 — Contents (Hush)
// Tighter, quieter. No eyebrow/"Work" label at all — the list stands alone.
// Active row: number glows brass, name goes full white, no bullet.
// Active row slides 4px right — a small anchor move.
// ─────────────────────────────────────────────────────────────────────────────

function ConceptC2({ activeLabel }: ConceptProps) {
  const dur = `${Math.round(320 * LAB_CONFIG.motionIntensity)}ms`;

  return (
    <div className="wdl-concept wdl-concept--c2">
      <ol
        className="wdl-c2__list"
        style={{ "--dim-opacity": 0.22, "--list-dur": dur } as React.CSSProperties}
      >
        {LAB_CONFIG.tracks.filter((t) => t.label !== "").map((t) => {
          const isActive = t.label === activeLabel;
          return (
            <li key={t.label} className={`wdl-c2__item ${isActive ? "is-active" : ""}`}>
              <span className="wdl-c2__num">{t.track}</span>
              <span className="wdl-c2__name">{t.display}</span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// CONCEPT C3 — Contents (Inline)
// Four rows in two visual tiers: mono number + serif name + a hairline.
// Active item underlines itself with a thin brass rule that grows in.
// No columns, no grid, no dots — just typography and one hairline per row.
// ─────────────────────────────────────────────────────────────────────────────

function ConceptC3({ activeLabel }: ConceptProps) {
  const dur = `${Math.round(320 * LAB_CONFIG.motionIntensity)}ms`;

  return (
    <div className="wdl-concept wdl-concept--c3">
      <ol
        className="wdl-c3__list"
        style={{ "--dim-opacity": 0.26, "--list-dur": dur } as React.CSSProperties}
      >
        {LAB_CONFIG.tracks.filter((t) => t.label !== "").map((t) => {
          const isActive = t.label === activeLabel;
          return (
            <li key={t.label} className={`wdl-c3__item ${isActive ? "is-active" : ""}`}>
              <span className="wdl-c3__row">
                <span className="wdl-c3__num">{t.track}</span>
                <span className="wdl-c3__name">{t.display}</span>
              </span>
              <span className="wdl-c3__rule" aria-hidden="true" />
            </li>
          );
        })}
      </ol>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// CONCEPT D — Register
// Three-column editorial register (no status column). Quiet weights, hairlines.
// ─────────────────────────────────────────────────────────────────────────────

function ConceptD({ activeLabel }: ConceptProps) {
  const dur = `${Math.round(260 * LAB_CONFIG.motionIntensity)}ms`;

  return (
    <div className="wdl-concept wdl-concept--d">
      <div className="wdl-d__head">
        <h2 className="wdl-d__title">{LAB_CONFIG.title}</h2>
        <span className="wdl-d__meta">Register</span>
      </div>

      <div
        className="wdl-d__table"
        style={{ "--list-dur": dur, "--dim-opacity": LAB_CONFIG.trackListDimOpacity } as React.CSSProperties}
      >
        <div className="wdl-d__colhead">
          <span>№</span>
          <span>Project</span>
          <span>Focus</span>
        </div>

        {LAB_CONFIG.tracks.filter((t) => t.label !== "").map((t) => {
          const isActive = t.label === activeLabel;
          return (
            <div key={t.label} className={`wdl-d__row ${isActive ? "is-active" : ""}`}>
              <span className="wdl-d__rowNum">{t.track}</span>
              <span className="wdl-d__rowName">{t.display}</span>
              <span className="wdl-d__rowFocus">{t.sub}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// CONCEPT E — Broadside
// "Work" large, hairline spine, live project name below.
// One decorative detail: a small italic kicker "Now showing —".
// ─────────────────────────────────────────────────────────────────────────────

function ConceptE({ activeLabel }: ConceptProps) {
  const track = getTrack(activeLabel);
  const dur = `${Math.round(320 * LAB_CONFIG.motionIntensity)}ms`;

  return (
    <div className="wdl-concept wdl-concept--e">
      <h2 className="wdl-e__title">{LAB_CONFIG.title}</h2>

      <div className="wdl-e__rule" />

      <div className="wdl-e__bottom">
        <span className="wdl-e__kicker">Now showing —</span>
        <h3
          className="wdl-e__active"
          key={track.label}
          style={{ "--readout-dur": dur } as React.CSSProperties}
        >
          {track.display}
        </h3>
        <span className="wdl-e__num" key={track.track}>
          T·{track.track}
        </span>
      </div>
    </div>
  );
}

// ─── Shell ───────────────────────────────────────────────────────────────────

export default function WorkDisplayLab() {
  const [concept, setConcept] = useState<ConceptKey>(DEFAULT_CONCEPT);
  const containerRef = useRef<HTMLElement>(null);
  const { activeLabel } = useLabScroll(containerRef);

  const conceptNames: Record<ConceptKey, string> = {
    A: "A — Index Leaf",
    B: "B — Numeral",
    C: "C — Contents",
    C2: "C2 — Hush",
    C3: "C3 — Inline",
    D: "D — Register",
    E: "E — Broadside",
  };

  return (
    <main className="wdl-shell">
      <div className="wdl-badge" aria-label="Lab environment">
        <span>WORK DISPLAY LAB</span>
      </div>

      <nav className="wdl-switcher" aria-label="Switch concept">
        {(["A", "B", "C", "C2", "C3", "D", "E"] as const).map((c) => (
          <button
            key={c}
            className={`wdl-switcher__btn ${concept === c ? "is-active" : ""}`}
            onClick={() => setConcept(c)}
            type="button"
          >
            {conceptNames[c]}
          </button>
        ))}
      </nav>

      <section
        className="wdl-work"
        ref={containerRef as React.RefObject<HTMLElement>}
        aria-label="Work landing experiment"
      >
        <article className="wdl-screen">
          {concept === "A" && <ConceptA activeLabel={activeLabel} />}
          {concept === "B" && <ConceptB activeLabel={activeLabel} />}
          {concept === "C" && <ConceptC activeLabel={activeLabel} />}
          {concept === "C2" && <ConceptC2 activeLabel={activeLabel} />}
          {concept === "C3" && <ConceptC3 activeLabel={activeLabel} />}
          {concept === "D" && <ConceptD activeLabel={activeLabel} />}
          {concept === "E" && <ConceptE activeLabel={activeLabel} />}

          <div className="wdl-player" aria-hidden="true">
            <img src="/playerforeground.png" alt="" className="wdl-player__fg" />
            <div className="wdl-disc-wrap">
              <div
                className="wdl-disc"
                style={{ "--lab-deg": "0deg" } as React.CSSProperties}
              />
            </div>
          </div>

          <div className="wdl-cdlabel" aria-live="polite">
            {activeLabel}
          </div>
        </article>
      </section>

      <aside className="wdl-notes" aria-label="Lab notes">
        <p className="wdl-notes__concept">Concept {concept}</p>
        <p className="wdl-notes__name">{conceptNames[concept]}</p>
        <hr className="wdl-notes__hr" />
        <p className="wdl-notes__kv">
          <span>Active</span>
          <span>{activeLabel || "—"}</span>
        </p>
        <p className="wdl-notes__kv">
          <span>Config</span>
          <span>lab.tsx</span>
        </p>
        <p className="wdl-notes__kv">
          <span>Promote</span>
          <span>WorkSection.tsx</span>
        </p>
      </aside>
    </main>
  );
}
