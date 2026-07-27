"use client";

// 03 — Supply Chain, three fidelity variations.
//
// The rotating globe is non-negotiable, so all three mount the REAL
// `RealisticGlobe` — the same three.js component production ships, with
// production's own mobile framing (clouds, lonOffset -69, latOffset 40, frozen)
// and the real journey dots and arcs at their true coordinates.
//
// Production already has a mobile layout here — `sc-journey--rail`: globe
// pinned top, vertical timeline below, progressive dot reveal, then auto-select.
// Variation A is that layout; B and C change only how scrolling relates to it.
//
//   A  Production Faithful  — the existing rail.
//   B  Sticky Globe         — globe pins; the rail scrolls under it and the
//                             stop nearest the top selects itself.
//   C  Scroll-Linked Globe  — scroll drives longitude directly.

import dynamic from "next/dynamic";
import { useCallback, useEffect, useRef, useState } from "react";
import { WORK_SCREENS } from "@/data/work";
import { JOURNEY_STOPS, JOURNEY_ARCS } from "@/data/scLab";
import { Rail } from "../parts";
import type { VariantKey } from "@/data/workMobileVariants";

const RealisticGlobe = dynamic(() => import("@/components/ui/realistic-globe"), {
  ssr: false,
});

const SCREEN = WORK_SCREENS.find((s) => s.type === "supply-chain");
if (!SCREEN || SCREEN.type !== "supply-chain") throw new Error("Supply chain screen missing");
const SC = SCREEN.supplyChain;

const STYLE_CLASS: Record<string, string> = {
  "serif-heavy": "wf-sc__lineSerif",
  "mono-caps": "wf-sc__lineMono",
  "sans-light": "wf-sc__lineSans",
  "serif-italic": "wf-sc__lineItalic",
};

/** Production's reveal cadence, from SupplyChainDetail's defaults. */
const REVEAL_MS = 320;
const AUTO_SELECT_MS = 200;

export default function SupplyChainCard({
  variant,
  motion = true,
}: {
  variant: VariantKey;
  motion?: boolean;
}) {
  const [selected, setSelected] = useState<number | undefined>();
  const [revealed, setRevealed] = useState(0);
  const [lonOffset, setLonOffset] = useState(-69);
  const railRef = useRef<HTMLOListElement | null>(null);
  const globeBoxRef = useRef<HTMLDivElement | null>(null);
  const [globeSize, setGlobeSize] = useState(190);
  const played = useRef(false);

  // Progressive dot reveal then auto-select — production's own behaviour.
  useEffect(() => {
    if (played.current) return;
    played.current = true;
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

  // Size the canvas to its box. three.js renders at the exact pixel size passed;
  // CSS-scaling a fixed canvas blurs the texture and misaligns the dot
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

  // B + C read the rail's scroll. One passive listener, no rAF loop: the work
  // per event is two rect reads, which is cheaper than a permanent loop and
  // cannot be left running.
  const onRailScroll = useCallback(() => {
    if (variant === "a" || !motion) return;
    const rail = railRef.current;
    if (!rail) return;
    const railRect = rail.getBoundingClientRect();

    if (variant === "b") {
      // Whichever stop sits nearest the top of the rail owns the globe.
      let best = 0;
      let bestDist = Infinity;
      rail.querySelectorAll<HTMLElement>("[data-stop]").forEach((el) => {
        const d = Math.abs(el.getBoundingClientRect().top - (railRect.top + 24));
        if (d < bestDist) {
          bestDist = d;
          best = Number(el.dataset.stop);
        }
      });
      setSelected((prev) => (prev === best ? prev : best));
      return;
    }

    // C: scroll position drives longitude continuously — the crossing becomes
    // something you perform. Range chosen to sweep Asia → Americas once.
    const max = rail.scrollHeight - rail.clientHeight;
    const p = max > 0 ? rail.scrollTop / max : 0;
    setLonOffset(-69 - p * 120);
  }, [variant, motion]);

  const stops = JOURNEY_STOPS;
  const journeyDots = stops.slice(0, revealed).map((s, i) => ({
    coords: s.coords as [number, number],
    label: s.label,
    selected: selected === i,
  }));
  const visibleArcs = JOURNEY_ARCS.filter(
    (a) => a.from < revealed && a.to < revealed
  );

  return (
    <article className="wf-card wf-card--sc">
      <Rail id={3} tone="onPanel" />
      <span className="wf-sc__globeGlow" aria-hidden="true" />

      <div className="wf-sc__body">
        <div
          className={`wf-sc__globe ${variant === "b" ? "wf-sc__globe--sticky" : ""}`}
          ref={globeBoxRef}
        >
          <RealisticGlobe
            width={globeSize}
            height={globeSize}
            /* Production spins only while nothing is selected. C hands rotation
               to the scroll instead, so its idle spin stays off. */
            autoRotate={motion && variant !== "c" && selected === undefined}
            frozen
            visualStyle="clouds"
            lonOffset={variant === "c" ? lonOffset : -69}
            latOffset={40}
            journeyDots={journeyDots}
            selectedDot={selected}
            journeyArcs={visibleArcs}
            onDotClick={(i) => setSelected(i)}
          />
        </div>

        <div className="wf-sc__quote">
          {SC.heroArt.quoteLines.map((l, i) => (
            <p key={i} className={STYLE_CLASS[l.style] ?? "wf-sc__lineSans"}>
              {l.text}
            </p>
          ))}
        </div>

        <ol
          className="wf-sc__rail"
          ref={railRef}
          onScroll={onRailScroll}
          aria-label="Journey stops"
        >
          {stops.map((stop, i) => {
            const isRevealed = i < revealed;
            const isActive = selected === i;
            return (
              <li key={stop.id} className="wf-sc__railRow" data-stop={i}>
                <button
                  type="button"
                  className={`wf-sc__railItem ${isActive ? "is-active" : ""} ${
                    isRevealed ? "is-revealed" : ""
                  }`}
                  onClick={() => isRevealed && setSelected(i)}
                  disabled={!isRevealed}
                  aria-current={isActive ? "step" : undefined}
                >
                  <span className="wf-sc__railDot" aria-hidden="true" />
                  <span className="wf-sc__railMeta">
                    {stop.year} · {stop.label}
                  </span>
                  <span className="wf-sc__railHeadline">{stop.headline}</span>
                  <span className="wf-sc__railDesc">
                    <span className="wf-sc__railDescInner">
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
