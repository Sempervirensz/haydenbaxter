"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { JOURNEY_STOPS, JOURNEY_ARCS } from "@/data/scLab";
import dynamic from "next/dynamic";
import { WORK_SCREENS, type SupplyChainData } from "@/data/work";
import { usePrefersReducedMotion } from "./mobile/shared";

const RealisticGlobe = dynamic(
  () => import("@/components/ui/realistic-globe"),
  { ssr: false }
);

/** Chapter number + name for the section rail, read from the same source the
 *  mobile card's <Rail> uses so desktop can never disagree with it. */
const SC_SCREEN = WORK_SCREENS.find((s) => s.type === "supply-chain");

/** The four heroArt quote styles, mapped onto the desktop type scale. Same four
 *  roles as the mobile card (`wm-sc__line*`), scaled up with clamp(). */
const QUOTE_STYLE_CLASS: Record<string, string> = {
  "serif-heavy": "sc-ed__lineSerif",
  "mono-caps": "sc-ed__lineMono",
  "sans-light": "sc-ed__lineSans",
  "serif-italic": "sc-ed__lineItalic",
};

interface SupplyChainDetailProps {
  data: SupplyChainData;
  isActive: boolean;
  /** ms between each dot reveal. Default 320 (Snappy + bright). */
  revealIntervalMs?: number;
  /** ms to wait after last reveal before auto-selecting stop 0. Default 200. */
  autoSelectDelayMs?: number;
}

export default function SupplyChainDetail({
  data,
  isActive,
  revealIntervalMs = 320,
  autoSelectDelayMs = 200,
}: SupplyChainDetailProps) {
  const [selectedStop, setSelectedStop] = useState<number | undefined>();
  const [revealedCount, setRevealedCount] = useState(0);
  const hasPlayed = useRef(false);
  const [isMobile, setIsMobile] = useState(false);
  const globeContainerRef = useRef<HTMLDivElement>(null);
  const [globeSize, setGlobeSize] = useState(360);
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 768px)");
    setIsMobile(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  // Measure the globe container and size the canvas to fit cleanly on every
  // viewport. Three.js renders at the *exact* pixel size we pass — CSS
  // scaling on a fixed-size canvas blurs the texture and misaligns the
  // dot/arc projections. Sizing dynamically keeps the sphere sharp and
  // prevents top/bottom clipping when the parent card is short.
  useEffect(() => {
    const el = globeContainerRef.current;
    if (!el) return;

    const compute = () => {
      const rect = el.getBoundingClientRect();
      if (rect.width < 1 || rect.height < 1) return;

      // Reserve a margin so the sphere's halo/dots never touch the card
      // edge, and so the copy beside it keeps its breathing room.
      const margin = isMobile ? 12 : 28;
      const available = Math.min(rect.width, rect.height) - margin * 2;

      // Clamp so the globe stays readable on tiny phones and doesn't overwhelm
      // the copy beside it. The desktop ceiling scales with the viewport rather
      // than sitting at a flat 520px — that flat cap is what left the globe at
      // ~13% of the frame on a 4K display, and `available` (the measured column)
      // is still the real constraint, so the copy keeps its room either way.
      const minSize = isMobile ? 160 : 260;
      const maxSize = isMobile
        ? 240
        : Math.min(920, Math.max(520, Math.round(window.innerWidth * 0.26)));
      const next = Math.round(Math.max(minSize, Math.min(maxSize, available)));

      setGlobeSize((prev) => (Math.abs(prev - next) > 2 ? next : prev));
    };

    compute();
    const ro = new ResizeObserver(compute);
    ro.observe(el);
    window.addEventListener("resize", compute);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", compute);
    };
  }, [isMobile]);

  useEffect(() => {
    // On mobile the Work scroll hook short-circuits (screenIndex stays -1),
    // so `isActive` never flips true. The rail layout doesn't need staged
    // reveal anyway — show everything immediately and auto-select stop 0.
    if (isMobile) {
      setRevealedCount(JOURNEY_STOPS.length);
      if (selectedStop === undefined) setSelectedStop(0);
      hasPlayed.current = true;
      return;
    }

    if (!isActive) return;

    // Skip reveal animation on revisit — show everything immediately
    if (hasPlayed.current) {
      setRevealedCount(JOURNEY_STOPS.length);
      if (selectedStop === undefined) setSelectedStop(0);
      return;
    }

    // Reset and start reveal. hasPlayed is only marked true AFTER the
    // sequence finishes, so:
    //   (a) React Strict Mode's double-effect in dev doesn't short-circuit
    //       to "already played" before the first tick fires.
    //   (b) If the user scrolls away mid-reveal, they still get the full
    //       animation on their next visit.
    setRevealedCount(0);
    let i = 0;
    let selectTimeout: ReturnType<typeof setTimeout> | null = null;
    const timer = setInterval(() => {
      i++;
      setRevealedCount(i);
      if (i >= JOURNEY_STOPS.length) {
        clearInterval(timer);
        hasPlayed.current = true;
        selectTimeout = setTimeout(() => setSelectedStop(0), autoSelectDelayMs);
      }
    }, revealIntervalMs);
    return () => {
      clearInterval(timer);
      if (selectTimeout) clearTimeout(selectTimeout);
    };
  }, [isActive, isMobile, revealIntervalMs, autoSelectDelayMs]);

  const handleDotClick = useCallback(
    (i: number) => {
      if (i >= revealedCount) return;
      setSelectedStop(i);
    },
    [revealedCount]
  );

  const visibleDots = JOURNEY_STOPS.slice(0, revealedCount);

  const journeyDots = visibleDots.map((stop, i) => ({
    coords: stop.coords,
    label: stop.label,
    selected: selectedStop === i,
  }));

  const visibleArcs = JOURNEY_ARCS.filter(
    (a) => a.from < visibleDots.length && a.to < visibleDots.length
  );

  // ── Mobile: vertical rail layout ────────────────────────────────────
  // Globe pinned at top, scrolling timeline below. One stop per row with
  // a dot on a vertical line. Active stop expands to reveal description.
  // Desktop keeps the horizontal topbar + floating card layout unchanged.
  if (isMobile) {
    return (
      <section className="sc-journey sc-journey--rail" aria-label="Supply chain journey">
        {data.description && (
          <div className="sc-journey__description">
            <p>{data.description}</p>
          </div>
        )}
        <div className="sc-journey__railGlobe" ref={globeContainerRef}>
          <RealisticGlobe
            width={globeSize}
            height={globeSize}
            autoRotate={selectedStop === undefined}
            frozen
            visualStyle="clouds"
            lonOffset={-69}
            latOffset={40}
            journeyDots={journeyDots}
            selectedDot={selectedStop}
            journeyArcs={visibleArcs}
            onDotClick={handleDotClick}
          />
        </div>

        <ol className="sc-journey__rail" aria-label="Journey stops">
          {JOURNEY_STOPS.map((stop, i) => {
            const revealed = i < revealedCount;
            const active = selectedStop === i;
            const visited = selectedStop !== undefined && i <= selectedStop;
            return (
              <li key={stop.id} className="sc-journey__railRow">
                <button
                  type="button"
                  className={`sc-journey__railItem ${active ? "is-active" : ""} ${visited ? "is-visited" : ""} ${!revealed ? "is-hidden" : ""}`}
                  onClick={() => revealed && setSelectedStop(i)}
                  disabled={!revealed}
                  aria-current={active ? "step" : undefined}
                >
                  <span className="sc-journey__railDot" aria-hidden="true" />
                  <span className="sc-journey__railBody">
                    <span className="sc-journey__railMeta">
                      {stop.year} · {stop.label}
                    </span>
                    <span className="sc-journey__railHeadline">{stop.headline}</span>
                    <span className="sc-journey__railDesc">{stop.description}</span>
                  </span>
                </button>
              </li>
            );
          })}
        </ol>
      </section>
    );
  }

  // ── Desktop: the mobile card, opened out into a two-column editorial panel ──
  //
  // Same page, wider screen. Every material below is the mobile card's own
  // (`wm-sc__*` in work-mobile-cards.css), re-expressed at desktop scale:
  //   • the "03 / 04 — SUPPLY CHAIN" rail + hairline rule, read from WORK_SCREENS
  //   • the four heroArt credential lines in their four type roles
  //   • the vertical journey rail with its gold active node
  // The globe moves from above the copy into its own column so it can be large
  // without pushing the timeline off the card. Its props are unchanged.
  return (
    <section className="sc-journey sc-ed" aria-label="Supply chain journey">
      <div className="sc-ed__inner">
        <header className="sc-ed__rail">
          <span className="sc-ed__railNum">
            {SC_SCREEN?.number ?? "03 / 04"} — {SC_SCREEN?.name ?? "Supply Chain"}
          </span>
          <span className="sc-ed__railLine" aria-hidden="true" />
        </header>

        {data.description && (
          <p className="sc-ed__standfirst">{data.description}</p>
        )}

        <div className="sc-ed__cols">
          <div className="sc-ed__globeCol" ref={globeContainerRef}>
            <span className="sc-ed__globeGlow" aria-hidden="true" />
            <div className="sc-ed__globe">
              <RealisticGlobe
                width={globeSize}
                height={globeSize}
                /* Unchanged framing + interaction; the reduced-motion guard
                   matches what the mobile card already does. */
                autoRotate={!reducedMotion && selectedStop === undefined}
                frozen
                visualStyle="clouds"
                lonOffset={-69}
                latOffset={40}
                journeyDots={journeyDots}
                selectedDot={selectedStop}
                journeyArcs={visibleArcs}
                onDotClick={handleDotClick}
              />
            </div>
          </div>

          <div className="sc-ed__content">
            <div className="sc-ed__quote">
              {data.heroArt.quoteLines.map((line, i) => (
                <p
                  key={i}
                  className={QUOTE_STYLE_CLASS[line.style] ?? "sc-ed__lineSans"}
                >
                  {line.text}
                </p>
              ))}
            </div>

            <ol className="sc-ed__timeline" aria-label="Journey stops">
              {JOURNEY_STOPS.map((stop, i) => {
                const revealed = i < revealedCount;
                const active = selectedStop === i;
                return (
                  <li key={stop.id} className="sc-ed__row">
                    <button
                      type="button"
                      className={`sc-ed__item ${active ? "is-active" : ""} ${
                        revealed ? "is-revealed" : ""
                      }`}
                      onClick={() => revealed && setSelectedStop(i)}
                      disabled={!revealed}
                      aria-current={active ? "step" : undefined}
                    >
                      <span className="sc-ed__dot" aria-hidden="true" />
                      <span className="sc-ed__meta">
                        {stop.year} · {stop.label}
                      </span>
                      <span className="sc-ed__headline">{stop.headline}</span>
                      <span className="sc-ed__desc">
                        <span className="sc-ed__descInner">
                          <p>{stop.description}</p>
                        </span>
                      </span>
                    </button>
                  </li>
                );
              })}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}
