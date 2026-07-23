"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import "./button-effects-lab.css";

const DEMO_LABELS = ["Work", "About", "Journal", "Connect"] as const;

const EASING_OPTIONS = [
  { label: "Smooth (site-like)", value: "cubic-bezier(0.22, 0.61, 0.36, 1)" },
  { label: "ease-out", value: "ease-out" },
  { label: "ease-in-out", value: "ease-in-out" },
  { label: "Springy", value: "cubic-bezier(0.34, 1.56, 0.64, 1)" },
];

type EffectId =
  | "slide-left"
  | "slide-right"
  | "rise"
  | "clip"
  | "blur"
  | "underline"
  | "tilt"
  | "magnetic"
  | "pulse";

type EffectCategory = "entrance" | "interaction" | "ambient";

const EFFECTS: {
  id: EffectId;
  category: EffectCategory;
  name: string;
  desc: string;
  hint?: string;
}[] = [
  {
    id: "slide-left",
    category: "entrance",
    name: "Slide from left",
    desc: "Chips enter from off-screen left with optional stagger — strong for hero nav reveals.",
  },
  {
    id: "slide-right",
    category: "entrance",
    name: "Slide from right",
    desc: "Mirror of slide-left; useful for RTL or asymmetric layouts.",
  },
  {
    id: "rise",
    category: "entrance",
    name: "Rise + fade",
    desc: "Soft vertical lift with opacity — less directional than slide.",
  },
  {
    id: "clip",
    category: "entrance",
    name: "Clip reveal",
    desc: "Wipes open with clip-path; crisp and editorial.",
  },
  {
    id: "blur",
    category: "entrance",
    name: "Blur in",
    desc: "Focus pull-in (blur + slight scale). Use sparingly.",
  },
  {
    id: "underline",
    category: "interaction",
    name: "Underline sweep",
    desc: "Minimal text links with a rule that grows on hover/focus.",
    hint: "Hover or Tab each control.",
  },
  {
    id: "tilt",
    category: "interaction",
    name: "3D tilt",
    desc: "Pointer-driven perspective tilt on each chip.",
    hint: "Move over each chip.",
  },
  {
    id: "magnetic",
    category: "interaction",
    name: "Magnetic pull",
    desc: "Chips ease toward the cursor before click — depth without scaling the hit target.",
    hint: "Move near a chip; press for damped feedback.",
  },
  {
    id: "pulse",
    category: "ambient",
    name: "Soft pulse",
    desc: "Ambient CTA attention loop — keep very subtle in production.",
  },
];

const CATEGORY_LABEL: Record<EffectCategory, string> = {
  entrance: "Entrance",
  interaction: "Interaction",
  ambient: "Ambient",
};

function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const handler = () => setReduced(mq.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);
  return reduced;
}

function MagneticChip({
  label,
  disabled,
}: {
  label: string;
  disabled: boolean;
}) {
  const ref = useRef<HTMLButtonElement>(null);
  const [pressed, setPressed] = useState(false);

  const move = useCallback(
    (clientX: number, clientY: number) => {
      const el = ref.current;
      if (!el || disabled) return;
      const r = el.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      const dx = clientX - cx;
      const dy = clientY - cy;
      const max = 10;
      const nx = Math.max(-1, Math.min(1, dx / (r.width * 1.2)));
      const ny = Math.max(-1, Math.min(1, dy / (r.height * 1.2)));
      el.style.setProperty("--bel-mx", `${nx * max}px`);
      el.style.setProperty("--bel-my", `${ny * max}px`);
    },
    [disabled]
  );

  const clear = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    el.style.setProperty("--bel-mx", "0px");
    el.style.setProperty("--bel-my", "0px");
  }, []);

  return (
    <button
      type="button"
      ref={ref}
      className={`bel-chip bel-magnetic ${pressed ? "is-pressed" : ""}`}
      onPointerMove={(e) => move(e.clientX, e.clientY)}
      onPointerLeave={() => {
        clear();
        setPressed(false);
      }}
      onPointerDown={() => setPressed(true)}
      onPointerUp={() => setPressed(false)}
    >
      {label}
    </button>
  );
}

/** DYMO row: tilt lives on wrapper so entrance keyframes only move the inner face. */
function DymoChipRow() {
  return (
    <div className="bel__track bel__track--dymo">
      {DEMO_LABELS.map((label) => (
        <span key={label} className="bel-chip-wrap">
          <button type="button" className="bel-chip bel-chip--dymo">
            {label}
          </button>
        </span>
      ))}
    </div>
  );
}

function TiltChip({ label, disabled }: { label: string; disabled: boolean }) {
  const ref = useRef<HTMLButtonElement>(null);

  const onMove = useCallback(
    (e: React.PointerEvent<HTMLButtonElement>) => {
      const el = ref.current;
      if (!el || disabled) return;
      const r = el.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width;
      const py = (e.clientY - r.top) / r.height;
      const rx = (py - 0.5) * -18;
      const ry = (px - 0.5) * 22;
      el.style.transform = `perspective(800px) rotateX(${rx}deg) rotateY(${ry}deg) translateZ(0)`;
    },
    [disabled]
  );

  const onLeave = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    el.style.transform = "perspective(800px) rotateX(0deg) rotateY(0deg) translateZ(0)";
  }, []);

  return (
    <button
      type="button"
      ref={ref}
      className="bel-chip bel-tilt"
      onPointerMove={onMove}
      onPointerLeave={onLeave}
    >
      {label}
    </button>
  );
}

export default function ButtonEffectsLab() {
  const reducedMotion = usePrefersReducedMotion();
  const headingId = useId();
  const selectId = useId();
  const [effectId, setEffectId] = useState<EffectId>("slide-left");
  const [replayKey, setReplayKey] = useState(0);
  const [duration, setDuration] = useState(650);
  const [stagger, setStagger] = useState(90);
  const [distance, setDistance] = useState(110);
  const [easing, setEasing] = useState(EASING_OPTIONS[0].value);

  const active = EFFECTS.find((e) => e.id === effectId)!;
  const effectIndex = EFFECTS.findIndex((e) => e.id === effectId);

  const replay = useCallback(() => {
    setReplayKey((k) => k + 1);
  }, []);

  const skipReplayMount = useRef(true);
  useEffect(() => {
    if (skipReplayMount.current) {
      skipReplayMount.current = false;
      return;
    }
    setReplayKey((k) => k + 1);
  }, [effectId, duration, stagger, distance, easing]);

  const goPrev = useCallback(() => {
    const i = effectIndex <= 0 ? EFFECTS.length - 1 : effectIndex - 1;
    setEffectId(EFFECTS[i].id);
  }, [effectIndex]);

  const goNext = useCallback(() => {
    const i = effectIndex >= EFFECTS.length - 1 ? 0 : effectIndex + 1;
    setEffectId(EFFECTS[i].id);
  }, [effectIndex]);

  const stageVars = {
    "--bel-dur": `${duration}ms`,
    "--bel-stagger": `${stagger}ms`,
    "--bel-distance": `${distance}%`,
    "--bel-ease": easing,
  } as React.CSSProperties;

  const showTimingControls =
    effectId === "slide-left" ||
    effectId === "slide-right" ||
    effectId === "rise" ||
    effectId === "clip" ||
    effectId === "blur";

  const renderStage = () => {
    const key = `${effectId}-${replayKey}`;

    if (effectId === "underline") {
      return (
        <div
          key={key}
          className="bel__stage bel__stage--underline"
          style={stageVars}
          aria-labelledby={headingId}
        >
          <div className="bel__track">
            {DEMO_LABELS.map((label) => (
              <button key={label} type="button" className="bel-chip bel-chip--link">
                {label}
              </button>
            ))}
          </div>
        </div>
      );
    }

    if (effectId === "tilt") {
      return (
        <div
          key={key}
          className="bel__stage bel__stage--tilt"
          style={stageVars}
          aria-labelledby={headingId}
        >
          <div className="bel__tilt-grid">
            {DEMO_LABELS.map((label) => (
              <TiltChip key={label} label={label} disabled={reducedMotion} />
            ))}
          </div>
        </div>
      );
    }

    if (effectId === "magnetic") {
      return (
        <div
          key={key}
          className="bel__stage bel__stage--magnetic"
          style={stageVars}
          aria-labelledby={headingId}
        >
          <div className="bel__mag-wrap">
            {DEMO_LABELS.map((label) => (
              <MagneticChip key={label} label={label} disabled={reducedMotion} />
            ))}
          </div>
        </div>
      );
    }

    if (effectId === "pulse") {
      return (
        <div
          key={key}
          className="bel__stage bel__stage--pulse"
          style={stageVars}
          aria-labelledby={headingId}
        >
          <div className="bel__track bel__track--dymo">
            <span className="bel-chip-wrap">
              <button type="button" className="bel-chip bel-chip--dymo bel-chip--pulse">
                Book a call
              </button>
            </span>
          </div>
        </div>
      );
    }

    const mod =
      effectId === "slide-left"
        ? "bel__stage--slide-left"
        : effectId === "slide-right"
          ? "bel__stage--slide-right"
          : effectId === "rise"
            ? "bel__stage--rise"
            : effectId === "clip"
              ? "bel__stage--clip"
              : "bel__stage--blur";

    return (
      <div
        key={key}
        className={`bel__stage ${mod}`}
        style={stageVars}
        aria-labelledby={headingId}
      >
        <DymoChipRow />
      </div>
    );
  };

  const categories = (["entrance", "interaction", "ambient"] as const).filter((c) =>
    EFFECTS.some((e) => e.category === c)
  );

  return (
    <div className="bel">
      <header className="bel__header">
        <div>
          <h1 className="bel__title" id={headingId}>
            Button effects
          </h1>
          <p className="bel__lead">
            DYMO-style chips: entrances and interactions. Sandbox only — nothing here ships until you
            paste it in.
          </p>
        </div>
        <a className="bel__back" href="/">
          Home
        </a>
      </header>

      <div className="bel__main">
        <section className="bel__preview" aria-label="Preview">
          <div className="bel__stage-wrap">
            <span className="bel__stage-label">Live</span>
            {renderStage()}
          </div>
        </section>

        <aside className="bel__sidebar">
          {reducedMotion && (
            <p className="bel__rm-banner" role="status">
              Reduced motion on — entrances and magnetic/tilt are static or minimal.
            </p>
          )}

          <div className="bel__toolbar">
            <label className="bel__field-label" htmlFor={selectId}>
              Effect
            </label>
            <div className="bel__toolbar-row">
              <button type="button" className="bel__step" onClick={goPrev} aria-label="Previous effect">
                ‹
              </button>
              <select
                id={selectId}
                className="bel__select bel__select--effect"
                value={effectId}
                onChange={(ev) => setEffectId(ev.target.value as EffectId)}
              >
                {categories.map((cat) => (
                  <optgroup key={cat} label={CATEGORY_LABEL[cat]}>
                    {EFFECTS.filter((e) => e.category === cat).map((e) => (
                      <option key={e.id} value={e.id}>
                        {e.name}
                      </option>
                    ))}
                  </optgroup>
                ))}
              </select>
              <button type="button" className="bel__step" onClick={goNext} aria-label="Next effect">
                ›
              </button>
              <button type="button" className="bel__btn-replay" onClick={replay}>
                Replay
              </button>
            </div>
          </div>

          <div className="bel__insight">
            <p className="bel__insight-kicker">{CATEGORY_LABEL[active.category]}</p>
            <h2 className="bel__insight-title">{active.name}</h2>
            <p className="bel__insight-body">{active.desc}</p>
            {active.hint ? <p className="bel__insight-hint">{active.hint}</p> : null}
          </div>

          {showTimingControls && (
            <div className="bel__tuning">
              <p className="bel__tuning-title">Timing</p>
              <div className="bel__slider">
                <div className="bel__slider-top">
                  <span>Duration</span>
                  <span>{duration}ms</span>
                </div>
                <input
                  type="range"
                  min={200}
                  max={1600}
                  step={25}
                  value={duration}
                  onChange={(ev) => setDuration(Number(ev.target.value))}
                />
              </div>
              <div className="bel__slider">
                <div className="bel__slider-top">
                  <span>Stagger</span>
                  <span>{stagger}ms</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={220}
                  step={5}
                  value={stagger}
                  onChange={(ev) => setStagger(Number(ev.target.value))}
                />
              </div>
              {(effectId === "slide-left" || effectId === "slide-right") && (
                <div className="bel__slider">
                  <div className="bel__slider-top">
                    <span>Travel</span>
                    <span>{distance}%</span>
                  </div>
                  <input
                    type="range"
                    min={40}
                    max={180}
                    step={5}
                    value={distance}
                    onChange={(ev) => setDistance(Number(ev.target.value))}
                  />
                </div>
              )}
              <label className="bel__slider">
                <div className="bel__slider-top">
                  <span>Easing</span>
                </div>
                <select
                  className="bel__select"
                  value={easing}
                  onChange={(ev) => setEasing(ev.target.value)}
                >
                  {EASING_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
