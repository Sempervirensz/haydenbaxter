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
}

export default function SupplyChainDetail({ data, isActive }: SupplyChainDetailProps) {
  const [selectedStop, setSelectedStop] = useState<number | undefined>();
  const [revealedCount, setRevealedCount] = useState(0);
  const hasPlayed = useRef(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 768px)");
    setIsMobile(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  const globeSize = isMobile ? 200 : 500;

  useEffect(() => {
    if (!isActive) return;

    // Skip reveal animation on revisit — show everything immediately
    if (hasPlayed.current) {
      setRevealedCount(JOURNEY_STOPS.length);
      if (selectedStop === undefined) setSelectedStop(0);
      return;
    }

    hasPlayed.current = true;
    setRevealedCount(0);
    let i = 0;
    const timer = setInterval(() => {
      i++;
      setRevealedCount(i);
      if (i >= JOURNEY_STOPS.length) {
        clearInterval(timer);
        // Auto-select first stop after all dots revealed
        setTimeout(() => setSelectedStop(0), 600);
      }
    }, 800);
    return () => clearInterval(timer);
  }, [isActive]);

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

  return (
    <section className="sc-journey" aria-label="Supply chain journey">
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
      <div className="sc-journey__topnavBody">
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
