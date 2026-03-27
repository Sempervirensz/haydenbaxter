"use client";

import { useState, useEffect, useCallback } from "react";
import { JOURNEY_STOPS, JOURNEY_ARCS } from "@/data/scLab";
import RotatingEarth from "@/components/ui/wireframe-dotted-globe";
import type { SupplyChainData } from "@/data/work";

interface SupplyChainDetailProps {
  data: SupplyChainData;
  isActive: boolean;
}

export default function SupplyChainDetail({ data, isActive }: SupplyChainDetailProps) {
  const [selectedStop, setSelectedStop] = useState<number | undefined>();
  const [revealedCount, setRevealedCount] = useState(0);

  useEffect(() => {
    if (!isActive) {
      setRevealedCount(0);
      setSelectedStop(undefined);
      return;
    }
    setRevealedCount(0);
    let i = 0;
    const timer = setInterval(() => {
      i++;
      setRevealedCount(i);
      if (i >= JOURNEY_STOPS.length) clearInterval(timer);
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
      <div className="sc-journey__globe">
        <RotatingEarth
          width={480}
          height={480}
          autoRotate={selectedStop === undefined}
          transparentBg
          journeyDots={journeyDots}
          selectedDot={selectedStop}
          journeyArcs={visibleArcs}
          onDotClick={handleDotClick}
        />
        {/* Floating glass card */}
        <div
          className={`sc-journey__floatingCard ${activeStop ? "is-visible" : ""}`}
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

      <div className="sc-journey__sidebar">
        <div className="sc-journey__sidebarTitle">Journey</div>
        {JOURNEY_STOPS.map((stop, i) => {
          const revealed = i < revealedCount;
          return (
            <button
              key={stop.id}
              type="button"
              className={`sc-journey__timelineItem ${selectedStop === i ? "is-active" : ""} ${selectedStop !== undefined && i <= selectedStop ? "is-visited" : ""} ${!revealed ? "is-hidden" : ""}`}
              onClick={() => revealed && setSelectedStop(i)}
              disabled={!revealed}
            >
              <div className="sc-journey__timelineDot">
                <span>{i + 1}</span>
              </div>
              <div className="sc-journey__timelineContent">
                <div className="sc-journey__timelineYear">{stop.year}</div>
                <div className="sc-journey__timelineTitle">{stop.title}</div>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}
