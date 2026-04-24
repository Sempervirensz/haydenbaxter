"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { JOURNEY_STOPS, JOURNEY_ARCS } from "@/data/scLab";
import dynamic from "next/dynamic";
import type { SupplyChainData } from "@/data/work";

const RealisticGlobe = dynamic(
  () => import("@/components/ui/realistic-globe"),
  { ssr: false }
);

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
      // edge, and so the desktop floating-card overlay has breathing room.
      const margin = isMobile ? 12 : 28;
      const available = Math.min(rect.width, rect.height) - margin * 2;

      // Clamp so the globe stays readable on tiny phones and doesn't
      // overwhelm 4K monitors.
      const minSize = isMobile ? 160 : 280;
      const maxSize = isMobile ? 320 : 640;
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

  const activeStop =
    selectedStop !== undefined ? JOURNEY_STOPS[selectedStop] : null;

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

  // ── Desktop: horizontal topbar + floating card ───────────────────────
  return (
    <section className="sc-journey" aria-label="Supply chain journey">
      {data.description && (
        <div className="sc-journey__description">
          <p>{data.description}</p>
        </div>
      )}
      {/* Horizontal timeline nav */}
      <nav className="sc-journey__topbar sc-journey__topbar--stacked" aria-label="Journey stops">
        {JOURNEY_STOPS.map((stop, i) => {
          const revealed = i < revealedCount;
          return (
            <button
              key={stop.id}
              type="button"
              className={`sc-journey__topbarItem ${selectedStop === i ? "is-active" : ""} ${selectedStop !== undefined && i <= selectedStop ? "is-visited" : ""} ${!revealed ? "is-hidden" : ""}`}
              onClick={() => revealed && setSelectedStop(i)}
              disabled={!revealed}
            >
              <span className="sc-journey__topbarDot">{i + 1}</span>
              <span className="sc-journey__topbarStack">
                <span className="sc-journey__topbarHeadline">{stop.headline}</span>
                <span className="sc-journey__topbarSub">
                  {stop.label} · {stop.year}
                </span>
              </span>
            </button>
          );
        })}
        <div className="sc-journey__topbarLine" />
      </nav>

      {/* Globe + floating glass card */}
      <div className="sc-journey__topnavBody" ref={globeContainerRef}>
        <div className="sc-journey__globe">
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
        <div
          className={`sc-journey__floatingCard sc-journey__floatingCard--bottomRight ${activeStop ? "is-visible" : ""}`}
        >
          {activeStop ? (
            <>
              <div className="sc-journey__year">{activeStop.year}</div>
              <h3 className="sc-journey__cardTitle">{activeStop.title}</h3>
              <p className="sc-journey__desc">{activeStop.description}</p>
            </>
          ) : (
            <p className="sc-journey__hint">Select a stop to explore</p>
          )}
        </div>
      </div>
    </section>
  );
}
