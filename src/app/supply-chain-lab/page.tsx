"use client";

/**
 * Supply Chain timeline lab.
 *
 * Lets you tune how the 4-stop journey timeline illuminates: reveal speed,
 * transition duration, and the brightness/glow levels of each item state
 * (inactive / visited / active). All knobs are live — adjustments show up
 * instantly on the mounted component next to the panel.
 *
 * CSS knobs are applied via custom properties on a `.sc-lab` wrapper that
 * overrides the hard-coded rgba values in `src/styles/work-details.css`.
 * Timing knobs are passed as props to the production `SupplyChainDetail`
 * (defaults preserved so the real page is unaffected).
 *
 * NOT linked from the site nav — visit /supply-chain-lab directly.
 */

import { useMemo, useState } from "react";
import SupplyChainDetail from "@/components/work/SupplyChainDetail";
import { WORK_SCREENS } from "@/data/work";

type Knobs = {
  // Speed
  revealIntervalMs: number;
  autoSelectDelayMs: number;
  revealTransitionMs: number;
  colorTransitionMs: number;
  // Brightness
  inactiveTextAlpha: number;
  visitedTextAlpha: number;
  activeBgAlpha: number;
  activeBorderAlpha: number;
  dotBorderInactiveAlpha: number;
  dotBorderVisitedAlpha: number;
  lineAlpha: number;
};

const DEFAULTS: Knobs = {
  revealIntervalMs: 800,
  autoSelectDelayMs: 600,
  revealTransitionMs: 500,
  colorTransitionMs: 300,
  inactiveTextAlpha: 0.35,
  visitedTextAlpha: 0.55,
  activeBgAlpha: 0.06,
  activeBorderAlpha: 0.15,
  dotBorderInactiveAlpha: 0.2,
  dotBorderVisitedAlpha: 0.4,
  lineAlpha: 0.1,
};

// Preset named looks for quick A/B comparison. Each carries a short note so
// you remember what it's aiming at when clicking through. Groups are rendered
// as separate rows in the panel.
type Preset = { name: string; note: string; values: Partial<Knobs> };
type PresetGroup = { title: string; presets: Preset[] };

const PRESET_GROUPS: PresetGroup[] = [
  {
    title: "Baseline",
    presets: [
      { name: "Default", note: "shipped values", values: DEFAULTS },
    ],
  },
  {
    title: "Speed pairings",
    presets: [
      {
        name: "Snappy + bright",
        note: "fast reveal, text reads strong",
        values: {
          revealIntervalMs: 320,
          autoSelectDelayMs: 200,
          revealTransitionMs: 240,
          colorTransitionMs: 140,
          inactiveTextAlpha: 0.92,
          visitedTextAlpha: 0.96,
          activeBgAlpha: 0.14,
          activeBorderAlpha: 0.36,
          dotBorderInactiveAlpha: 0.55,
          dotBorderVisitedAlpha: 0.75,
          lineAlpha: 0.28,
        },
      },
      {
        name: "Snappy + subtle",
        note: "fast reveal, dim inactive so active shines",
        values: {
          revealIntervalMs: 320,
          autoSelectDelayMs: 200,
          revealTransitionMs: 240,
          colorTransitionMs: 140,
          inactiveTextAlpha: 0.3,
          visitedTextAlpha: 0.5,
          activeBgAlpha: 0.18,
          activeBorderAlpha: 0.45,
          dotBorderInactiveAlpha: 0.18,
          dotBorderVisitedAlpha: 0.5,
          lineAlpha: 0.1,
        },
      },
      {
        name: "Cinematic + dim",
        note: "slow, moody, barely-there",
        values: {
          revealIntervalMs: 1200,
          autoSelectDelayMs: 900,
          revealTransitionMs: 900,
          colorTransitionMs: 500,
          activeBgAlpha: 0.04,
          activeBorderAlpha: 0.1,
          inactiveTextAlpha: 0.22,
          visitedTextAlpha: 0.4,
          dotBorderInactiveAlpha: 0.14,
          lineAlpha: 0.06,
        },
      },
      {
        name: "Cinematic + bright",
        note: "slow reveal, but text reads clearly the whole time",
        values: {
          revealIntervalMs: 1100,
          autoSelectDelayMs: 700,
          revealTransitionMs: 800,
          colorTransitionMs: 420,
          inactiveTextAlpha: 0.82,
          visitedTextAlpha: 0.92,
          activeBgAlpha: 0.1,
          activeBorderAlpha: 0.28,
          dotBorderInactiveAlpha: 0.45,
          dotBorderVisitedAlpha: 0.65,
          lineAlpha: 0.2,
        },
      },
    ],
  },
  {
    title: "Brightness character",
    presets: [
      {
        name: "Broadcast",
        note: "everything bright, loud glow — news-ticker energy",
        values: {
          revealIntervalMs: 500,
          autoSelectDelayMs: 350,
          revealTransitionMs: 320,
          colorTransitionMs: 180,
          inactiveTextAlpha: 0.95,
          visitedTextAlpha: 0.98,
          activeBgAlpha: 0.2,
          activeBorderAlpha: 0.55,
          dotBorderInactiveAlpha: 0.6,
          dotBorderVisitedAlpha: 0.85,
          lineAlpha: 0.32,
        },
      },
      {
        name: "Editorial",
        note: "bright text, no glow — type-first",
        values: {
          revealIntervalMs: 600,
          autoSelectDelayMs: 400,
          revealTransitionMs: 480,
          colorTransitionMs: 260,
          inactiveTextAlpha: 0.78,
          visitedTextAlpha: 0.9,
          activeBgAlpha: 0,
          activeBorderAlpha: 0,
          dotBorderInactiveAlpha: 0.35,
          dotBorderVisitedAlpha: 0.6,
          lineAlpha: 0.16,
        },
      },
      {
        name: "Spotlight",
        note: "inactive barely there, active punches hard",
        values: {
          revealIntervalMs: 650,
          autoSelectDelayMs: 500,
          revealTransitionMs: 520,
          colorTransitionMs: 240,
          inactiveTextAlpha: 0.18,
          visitedTextAlpha: 0.38,
          activeBgAlpha: 0.22,
          activeBorderAlpha: 0.6,
          dotBorderInactiveAlpha: 0.14,
          dotBorderVisitedAlpha: 0.5,
          lineAlpha: 0.08,
        },
      },
      {
        name: "Whisper",
        note: "all dim, soft transitions, contemplative",
        values: {
          revealIntervalMs: 900,
          autoSelectDelayMs: 650,
          revealTransitionMs: 700,
          colorTransitionMs: 380,
          inactiveTextAlpha: 0.4,
          visitedTextAlpha: 0.55,
          activeBgAlpha: 0.05,
          activeBorderAlpha: 0.14,
          dotBorderInactiveAlpha: 0.22,
          dotBorderVisitedAlpha: 0.4,
          lineAlpha: 0.08,
        },
      },
      {
        name: "High contrast",
        note: "punchy hierarchy — dim inactive, heavy active",
        values: {
          inactiveTextAlpha: 0.2,
          visitedTextAlpha: 0.45,
          activeBgAlpha: 0.16,
          activeBorderAlpha: 0.35,
          dotBorderInactiveAlpha: 0.15,
          dotBorderVisitedAlpha: 0.55,
          lineAlpha: 0.2,
        },
      },
    ],
  },
  {
    title: "Experimental",
    presets: [
      {
        name: "Roll call",
        note: "sub-second reveal, bright, tight rhythm",
        values: {
          revealIntervalMs: 180,
          autoSelectDelayMs: 150,
          revealTransitionMs: 160,
          colorTransitionMs: 110,
          inactiveTextAlpha: 0.88,
          visitedTextAlpha: 0.95,
          activeBgAlpha: 0.14,
          activeBorderAlpha: 0.36,
          dotBorderInactiveAlpha: 0.5,
          dotBorderVisitedAlpha: 0.72,
          lineAlpha: 0.24,
        },
      },
      {
        name: "Neon",
        note: "heavy active glow, crisp dots, dim rest",
        values: {
          revealIntervalMs: 500,
          autoSelectDelayMs: 380,
          revealTransitionMs: 300,
          colorTransitionMs: 200,
          inactiveTextAlpha: 0.28,
          visitedTextAlpha: 0.48,
          activeBgAlpha: 0.3,
          activeBorderAlpha: 0.7,
          dotBorderInactiveAlpha: 0.12,
          dotBorderVisitedAlpha: 0.55,
          lineAlpha: 0.12,
        },
      },
      {
        name: "Glassy",
        note: "Snappy + bright with a softer glow",
        values: {
          revealIntervalMs: 380,
          autoSelectDelayMs: 260,
          revealTransitionMs: 300,
          colorTransitionMs: 180,
          inactiveTextAlpha: 0.85,
          visitedTextAlpha: 0.94,
          activeBgAlpha: 0.08,
          activeBorderAlpha: 0.24,
          dotBorderInactiveAlpha: 0.4,
          dotBorderVisitedAlpha: 0.62,
          lineAlpha: 0.18,
        },
      },
    ],
  },
];

function useKnobs() {
  const [k, setK] = useState<Knobs>(DEFAULTS);
  const set = <K extends keyof Knobs>(key: K, v: Knobs[K]) =>
    setK((prev) => ({ ...prev, [key]: v }));
  const reset = () => setK(DEFAULTS);
  const apply = (patch: Partial<Knobs>) => setK((prev) => ({ ...prev, ...patch }));
  return { k, set, reset, apply };
}

/** Pick a random preset from any group and add small per-knob jitter so each
 *  press produces a novel variation instead of a repeat. Keeps the result
 *  inside each slider's natural range. */
function randomize(): Knobs {
  const flat = PRESET_GROUPS.flatMap((g) => g.presets);
  const base = { ...DEFAULTS, ...flat[Math.floor(Math.random() * flat.length)].values };
  const jitter = (v: number, span: number, min = 0, max = Infinity) =>
    Math.min(max, Math.max(min, v + (Math.random() * 2 - 1) * span));
  return {
    revealIntervalMs: Math.round(jitter(base.revealIntervalMs, 150, 150, 2000)),
    autoSelectDelayMs: Math.round(jitter(base.autoSelectDelayMs, 120, 0, 2000)),
    revealTransitionMs: Math.round(jitter(base.revealTransitionMs, 100, 80, 1500)),
    colorTransitionMs: Math.round(jitter(base.colorTransitionMs, 60, 50, 800)),
    inactiveTextAlpha: Number(jitter(base.inactiveTextAlpha, 0.12, 0, 1).toFixed(2)),
    visitedTextAlpha: Number(jitter(base.visitedTextAlpha, 0.1, 0, 1).toFixed(2)),
    activeBgAlpha: Number(jitter(base.activeBgAlpha, 0.06, 0, 0.4).toFixed(2)),
    activeBorderAlpha: Number(jitter(base.activeBorderAlpha, 0.12, 0, 0.8).toFixed(2)),
    dotBorderInactiveAlpha: Number(jitter(base.dotBorderInactiveAlpha, 0.12, 0, 1).toFixed(2)),
    dotBorderVisitedAlpha: Number(jitter(base.dotBorderVisitedAlpha, 0.12, 0, 1).toFixed(2)),
    lineAlpha: Number(jitter(base.lineAlpha, 0.06, 0, 0.4).toFixed(2)),
  };
}

function Slider({
  label,
  value,
  min,
  max,
  step,
  unit,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  unit?: string;
  onChange: (v: number) => void;
}) {
  const display = unit === "ms" ? `${Math.round(value)}ms` : value.toFixed(2);
  return (
    <label className="lab-row">
      <span className="lab-row__label">{label}</span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
      />
      <span className="lab-row__value">{display}</span>
    </label>
  );
}

export default function SupplyChainLab() {
  const { k, set, reset, apply } = useKnobs();
  const [mountKey, setMountKey] = useState(0);
  const replay = () => setMountKey((n) => n + 1);

  const screen = useMemo(
    () => WORK_SCREENS.find((s) => s.type === "supply-chain"),
    []
  );

  if (!screen || screen.type !== "supply-chain") {
    return <div style={{ color: "#fff", padding: 32 }}>Supply chain screen not found in WORK_SCREENS.</div>;
  }

  // CSS variable overrides scoped to the lab wrapper. See <style> block below.
  const cssVars: React.CSSProperties = {
    ["--sc-inactive-alpha" as string]: k.inactiveTextAlpha,
    ["--sc-visited-alpha" as string]: k.visitedTextAlpha,
    ["--sc-active-bg-alpha" as string]: k.activeBgAlpha,
    ["--sc-active-border-alpha" as string]: k.activeBorderAlpha,
    ["--sc-dot-border-inactive" as string]: k.dotBorderInactiveAlpha,
    ["--sc-dot-border-visited" as string]: k.dotBorderVisitedAlpha,
    ["--sc-line-alpha" as string]: k.lineAlpha,
    ["--sc-reveal-ms" as string]: `${k.revealTransitionMs}ms`,
    ["--sc-color-ms" as string]: `${k.colorTransitionMs}ms`,
  };

  return (
    <div className="sc-lab-page">
      {/* Scoped overrides — equal specificity via .sc-lab ancestor boost */}
      <style>{`
        .sc-lab .sc-journey__topbarItem {
          color: rgba(255,255,255, var(--sc-inactive-alpha));
          transition:
            color var(--sc-color-ms) ease,
            border-color var(--sc-color-ms) ease,
            background var(--sc-color-ms) ease,
            opacity var(--sc-reveal-ms) ease,
            transform var(--sc-reveal-ms) ease;
        }
        .sc-lab .sc-journey__topbarItem.is-visited {
          color: rgba(255,255,255, var(--sc-visited-alpha));
        }
        .sc-lab .sc-journey__topbarItem.is-active {
          background: rgba(255,255,255, var(--sc-active-bg-alpha));
          border-color: rgba(255,255,255, var(--sc-active-border-alpha));
        }
        .sc-lab .sc-journey__topbarDot {
          border-color: rgba(255,255,255, var(--sc-dot-border-inactive));
          transition:
            background var(--sc-color-ms) ease,
            border-color var(--sc-color-ms) ease,
            color var(--sc-color-ms) ease;
        }
        .sc-lab .sc-journey__topbarItem.is-visited .sc-journey__topbarDot {
          border-color: rgba(255,255,255, var(--sc-dot-border-visited));
        }
        .sc-lab .sc-journey__topbarLine {
          background: rgba(255,255,255, var(--sc-line-alpha));
        }
      `}</style>

      {/* Stage */}
      <div className="sc-lab" style={cssVars}>
        <div className="sc-lab__stage">
          <SupplyChainDetail
            key={mountKey}
            data={screen.supplyChain}
            isActive
            revealIntervalMs={k.revealIntervalMs}
            autoSelectDelayMs={k.autoSelectDelayMs}
          />
        </div>
      </div>

      {/* Control panel */}
      <aside className="sc-lab__panel" aria-label="Timeline controls">
        <header className="sc-lab__panelHead">
          <h1>Supply Chain Lab</h1>
          <p>Tune illumination speed + brightness. Hit replay to re-trigger the reveal.</p>
        </header>

        <div className="sc-lab__buttonRow">
          <button type="button" onClick={replay} className="sc-lab__btn sc-lab__btn--primary">
            Replay reveal
          </button>
          <button type="button" onClick={reset} className="sc-lab__btn">
            Reset
          </button>
          <button
            type="button"
            onClick={() => {
              apply(randomize());
              setTimeout(replay, 50);
            }}
            className="sc-lab__btn"
            title="Random blend of existing presets + small jitter"
          >
            Randomize
          </button>
        </div>

        {PRESET_GROUPS.map((group) => (
          <div key={group.title} className="sc-lab__presetGroup">
            <div className="sc-lab__presetGroupTitle">{group.title}</div>
            <div className="sc-lab__presets">
              {group.presets.map((p) => (
                <button
                  key={p.name}
                  type="button"
                  className="sc-lab__preset"
                  title={p.note}
                  onClick={() => {
                    apply({ ...DEFAULTS, ...p.values });
                    setTimeout(replay, 50);
                  }}
                >
                  <span className="sc-lab__presetName">{p.name}</span>
                  <span className="sc-lab__presetNote">{p.note}</span>
                </button>
              ))}
            </div>
          </div>
        ))}

        <h2 className="sc-lab__section">Speed</h2>
        <Slider
          label="Reveal interval"
          value={k.revealIntervalMs}
          min={150}
          max={2000}
          step={25}
          unit="ms"
          onChange={(v) => set("revealIntervalMs", v)}
        />
        <Slider
          label="Auto-select delay"
          value={k.autoSelectDelayMs}
          min={0}
          max={2000}
          step={25}
          unit="ms"
          onChange={(v) => set("autoSelectDelayMs", v)}
        />
        <Slider
          label="Reveal transition"
          value={k.revealTransitionMs}
          min={80}
          max={1500}
          step={10}
          unit="ms"
          onChange={(v) => set("revealTransitionMs", v)}
        />
        <Slider
          label="Color transition"
          value={k.colorTransitionMs}
          min={50}
          max={800}
          step={10}
          unit="ms"
          onChange={(v) => set("colorTransitionMs", v)}
        />

        <h2 className="sc-lab__section">Brightness</h2>
        <Slider
          label="Inactive text"
          value={k.inactiveTextAlpha}
          min={0}
          max={1}
          step={0.01}
          onChange={(v) => set("inactiveTextAlpha", v)}
        />
        <Slider
          label="Visited text"
          value={k.visitedTextAlpha}
          min={0}
          max={1}
          step={0.01}
          onChange={(v) => set("visitedTextAlpha", v)}
        />
        <Slider
          label="Active glow (bg)"
          value={k.activeBgAlpha}
          min={0}
          max={0.4}
          step={0.01}
          onChange={(v) => set("activeBgAlpha", v)}
        />
        <Slider
          label="Active border"
          value={k.activeBorderAlpha}
          min={0}
          max={0.8}
          step={0.01}
          onChange={(v) => set("activeBorderAlpha", v)}
        />
        <Slider
          label="Dot border inactive"
          value={k.dotBorderInactiveAlpha}
          min={0}
          max={1}
          step={0.01}
          onChange={(v) => set("dotBorderInactiveAlpha", v)}
        />
        <Slider
          label="Dot border visited"
          value={k.dotBorderVisitedAlpha}
          min={0}
          max={1}
          step={0.01}
          onChange={(v) => set("dotBorderVisitedAlpha", v)}
        />
        <Slider
          label="Timeline line"
          value={k.lineAlpha}
          min={0}
          max={0.4}
          step={0.01}
          onChange={(v) => set("lineAlpha", v)}
        />

        <details className="sc-lab__export">
          <summary>Export current values</summary>
          <pre>{JSON.stringify(k, null, 2)}</pre>
        </details>
      </aside>

      <style>{`
        .sc-lab-page {
          display: grid;
          grid-template-columns: 1fr 340px;
          min-height: 100vh;
          background: #000;
          color: #f3f3f3;
          font-family: system-ui, -apple-system, sans-serif;
        }
        .sc-lab {
          position: relative;
          overflow: hidden;
          background: #000;
        }
        .sc-lab__stage {
          display: flex;
          flex-direction: column;
          height: 100vh;
          padding: 24px;
        }
        .sc-lab__stage > .sc-journey {
          flex: 1;
        }
        .sc-lab__panel {
          border-left: 1px solid rgba(255,255,255,0.08);
          padding: 20px 18px;
          overflow-y: auto;
          background: #0a0a0a;
        }
        .sc-lab__panelHead h1 {
          font-size: 15px;
          font-weight: 500;
          margin: 0 0 6px;
          letter-spacing: 0.02em;
        }
        .sc-lab__panelHead p {
          font-size: 11px;
          line-height: 1.45;
          color: rgba(255,255,255,0.55);
          margin: 0 0 18px;
        }
        .sc-lab__buttonRow {
          display: flex;
          gap: 8px;
          margin-bottom: 12px;
        }
        .sc-lab__btn {
          flex: 1;
          padding: 8px 12px;
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.12);
          border-radius: 6px;
          color: #f3f3f3;
          font-family: inherit;
          font-size: 11px;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          cursor: pointer;
          transition: background 160ms ease, border-color 160ms ease;
        }
        .sc-lab__btn:hover {
          background: rgba(255,255,255,0.1);
          border-color: rgba(255,255,255,0.22);
        }
        .sc-lab__btn--primary {
          background: #cba86a;
          color: #0a0a0a;
          border-color: #cba86a;
        }
        .sc-lab__btn--primary:hover {
          background: #d7b878;
          border-color: #d7b878;
        }
        .sc-lab__presetGroup {
          margin-bottom: 14px;
        }
        .sc-lab__presetGroupTitle {
          font-size: 9px;
          font-weight: 600;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.42);
          margin-bottom: 6px;
        }
        .sc-lab__presets {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 6px;
        }
        .sc-lab__preset {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          text-align: left;
          padding: 7px 10px;
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 8px;
          color: rgba(255,255,255,0.85);
          font-family: inherit;
          cursor: pointer;
          transition: all 160ms ease;
          gap: 2px;
        }
        .sc-lab__preset:hover {
          color: #fff;
          border-color: rgba(255,255,255,0.28);
          background: rgba(255,255,255,0.06);
        }
        .sc-lab__presetName {
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 0.01em;
        }
        .sc-lab__presetNote {
          font-size: 9.5px;
          line-height: 1.3;
          color: rgba(255,255,255,0.5);
        }
        .sc-lab__section {
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.45);
          margin: 18px 0 10px;
          padding-bottom: 6px;
          border-bottom: 1px solid rgba(255,255,255,0.06);
        }
        .lab-row {
          display: grid;
          grid-template-columns: 110px 1fr 54px;
          align-items: center;
          gap: 10px;
          margin-bottom: 10px;
        }
        .lab-row__label {
          font-size: 11px;
          color: rgba(255,255,255,0.72);
        }
        .lab-row input[type="range"] {
          width: 100%;
          accent-color: #cba86a;
        }
        .lab-row__value {
          font-family: var(--font-mono, ui-monospace, monospace);
          font-size: 10.5px;
          color: rgba(255,255,255,0.58);
          text-align: right;
        }
        .sc-lab__export {
          margin-top: 22px;
          padding: 10px 12px;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 6px;
        }
        .sc-lab__export summary {
          font-size: 11px;
          color: rgba(255,255,255,0.7);
          cursor: pointer;
        }
        .sc-lab__export pre {
          margin: 10px 0 0;
          font-size: 10.5px;
          color: rgba(255,255,255,0.62);
          white-space: pre-wrap;
        }

        @media (max-width: 900px) {
          .sc-lab-page { grid-template-columns: 1fr; }
          .sc-lab__stage { height: 60vh; }
          .sc-lab__panel { border-left: none; border-top: 1px solid rgba(255,255,255,0.08); }
        }
      `}</style>
    </div>
  );
}
