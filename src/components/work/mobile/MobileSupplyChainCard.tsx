"use client";

// 03 — Supply Chain · approved mobile design: Option A, "Production Faithful".
//
// Kept deliberately close to production. Mounts the REAL RealisticGlobe (the
// same three.js component the desktop card ships) with production's own mobile
// framing — clouds, lonOffset -69, latOffset 40, frozen, autoRotate while
// nothing is selected — over the four credential lines set in the production
// hero's own type styles, above the vertical journey rail: Taiwan → China →
// New York → SE Asia, with the progressive dot reveal and auto-select.
//
// No scroll-linked motion — that was Options B/C, which were not selected.

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { WORK_SCREENS } from "@/data/work";
import { JOURNEY_STOPS, JOURNEY_ARCS } from "@/data/scLab";
import { Rail, usePrefersReducedMotion } from "./shared";

const RealisticGlobe = dynamic(() => import("@/components/ui/realistic-globe"), {
  ssr: false,
});

const SCREEN = WORK_SCREENS.find((s) => s.type === "supply-chain");
if (!SCREEN || SCREEN.type !== "supply-chain") throw new Error("Supply chain screen missing");
const SC = SCREEN.supplyChain;

const STYLE_CLASS: Record<string, string> = {
  "serif-heavy": "wm-sc__lineSerif",
  "mono-caps": "wm-sc__lineMono",
  "sans-light": "wm-sc__lineSans",
  "serif-italic": "wm-sc__lineItalic",
};

/** Production's reveal cadence, from SupplyChainDetail's defaults. */
const REVEAL_MS = 320;
const AUTO_SELECT_MS = 200;

export default function MobileSupplyChainCard() {
  const [selected, setSelected] = useState<number | undefined>();
  const [revealed, setRevealed] = useState(0);
  const globeBoxRef = useRef<HTMLDivElement | null>(null);
  const [globeSize, setGlobeSize] = useState(190);
  const reduced = usePrefersReducedMotion();

  // Progressive dot reveal then auto-select — production's own behaviour. No
  // "run once" ref guard: with `[]` deps this only fires on mount, and a guard
  // would defeat itself under React StrictMode (setup → cleanup clears the
  // timers → second setup early-returns → the reveal never completes).
  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];
    JOURNEY_STOPS.forEach((_, i) => {
      timers.push(setTimeout(() => setRevealed(i + 1), REVEAL_MS * (i + 1)));
    });
    timers.push(
      setTimeout(
        () => setSelected(0),
        REVEAL_MS * JOURNEY_STOPS.length + AUTO_SELECT_MS
      )
    );
    return () => timers.forEach(clearTimeout);
  }, []);

  // Size the canvas to its box in pixels — three.js renders at the exact size
  // passed; CSS-scaling a fixed canvas blurs the texture and misaligns the dot
  // projection, which is why production measures too.
  useEffect(() => {
    const el = globeBoxRef.current;
    if (!el) return;
    const compute = () => {
      const r = el.getBoundingClientRect();
      if (r.width < 1 || r.height < 1) return;
      const next = Math.round(
        Math.max(140, Math.min(240, Math.min(r.width, r.height) - 16))
      );
      setGlobeSize((prev) => (Math.abs(prev - next) > 2 ? next : prev));
    };
    compute();
    const ro = new ResizeObserver(compute);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const stops = JOURNEY_STOPS;
  const journeyDots = stops.slice(0, revealed).map((s, i) => ({
    coords: s.coords as [number, number],
    label: s.label,
    selected: selected === i,
  }));
  const visibleArcs = JOURNEY_ARCS.filter((a) => a.from < revealed && a.to < revealed);

  return (
    <article className="wm-card wm-card--sc">
      <Rail id={3} tone="onPanel" />
      <span className="wm-sc__globeGlow" aria-hidden="true" />

      <div className="wm-sc__body">
        <div className="wm-sc__globe" ref={globeBoxRef}>
          <RealisticGlobe
            width={globeSize}
            height={globeSize}
            /* Production spins the globe only while nothing is selected; honour
               reduced-motion by holding it still. */
            autoRotate={!reduced && selected === undefined}
            frozen
            visualStyle="clouds"
            lonOffset={-69}
            latOffset={40}
            journeyDots={journeyDots}
            selectedDot={selected}
            journeyArcs={visibleArcs}
            onDotClick={(i) => setSelected(i)}
          />
        </div>

        <div className="wm-sc__quote">
          {SC.heroArt.quoteLines.map((l, i) => (
            <p key={i} className={STYLE_CLASS[l.style] ?? "wm-sc__lineSans"}>
              {l.text}
            </p>
          ))}
        </div>

        <ol className="wm-sc__rail" aria-label="Journey stops">
          {stops.map((stop, i) => {
            const isRevealed = i < revealed;
            const isActive = selected === i;
            return (
              <li key={stop.id} className="wm-sc__railRow" data-stop={i}>
                <button
                  type="button"
                  className={`wm-sc__railItem ${isActive ? "is-active" : ""} ${
                    isRevealed ? "is-revealed" : ""
                  }`}
                  onClick={() => isRevealed && setSelected(i)}
                  disabled={!isRevealed}
                  aria-current={isActive ? "step" : undefined}
                >
                  <span className="wm-sc__railDot" aria-hidden="true" />
                  <span className="wm-sc__railMeta">
                    {stop.year} · {stop.label}
                  </span>
                  <span className="wm-sc__railHeadline">{stop.headline}</span>
                  <span className="wm-sc__railDesc">
                    <span className="wm-sc__railDescInner">
                      <p>{stop.description}</p>
                    </span>
                  </span>
                </button>
              </li>
            );
          })}
        </ol>
      </div>
    </article>
  );
}
