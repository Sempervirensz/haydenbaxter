"use client";

import { useState, useEffect, useCallback } from "react";
import { JOURNEY_STOPS, JOURNEY_ARCS } from "@/data/scLab";
import RotatingEarth from "@/components/ui/wireframe-dotted-globe";

export type JourneyDesign = "base" | "floating" | "timeline" | "fullbleed" | "hybrid" | "topnav";

interface JourneyGlobeProps {
  design?: JourneyDesign;
}

export default function JourneyGlobe({ design = "base" }: JourneyGlobeProps) {
  const [selectedStop, setSelectedStop] = useState<number | undefined>();
  const [revealedCount, setRevealedCount] = useState(0);

  // Sequential reveal for floating + fullbleed designs
  const useSequentialReveal = design === "floating" || design === "fullbleed" || design === "hybrid" || design === "topnav";

  useEffect(() => {
    if (!useSequentialReveal) {
      setRevealedCount(JOURNEY_STOPS.length);
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
  }, [useSequentialReveal, design]);

  const handleDotClick = useCallback((i: number) => {
    if (useSequentialReveal && i >= revealedCount) return;
    setSelectedStop(i);
  }, [useSequentialReveal, revealedCount]);

  const visibleDots = JOURNEY_STOPS.slice(0, useSequentialReveal ? revealedCount : JOURNEY_STOPS.length);

  const journeyDots = visibleDots.map((stop, i) => ({
    coords: stop.coords,
    label: design === "fullbleed" ? `${i + 1}. ${stop.label}` : stop.label,
    selected: selectedStop === i,
  }));

  const visibleArcs = JOURNEY_ARCS.filter(
    (a) => a.from < visibleDots.length && a.to < visibleDots.length,
  );

  const activeStop = selectedStop !== undefined ? JOURNEY_STOPS[selectedStop] : null;

  const globeSize = design === "fullbleed" ? 800 : design === "topnav" ? 400 : design === "timeline" || design === "hybrid" ? 480 : 600;
  const zoomLevel = design === "floating" ? 1.6 : design === "fullbleed" ? 1.4 : 1.3;

  const globeEl = (
    <RotatingEarth
      width={globeSize}
      height={globeSize}
      autoRotate={selectedStop === undefined}
      transparentBg
      journeyDots={journeyDots}
      selectedDot={selectedStop}
      journeyArcs={visibleArcs}
      onDotClick={handleDotClick}
    />
  );

  // --- Design: Base (G) ---
  if (design === "base") {
    return (
      <div className="scLab-journey scLab-journey--base">
        <div className="scLab-journey__globe">{globeEl}</div>
        <JourneyCard activeStop={activeStop} />
        <StepIndicators
          selectedStop={selectedStop}
          onSelect={setSelectedStop}
        />
      </div>
    );
  }

  // --- Design: Floating glass card (H) ---
  if (design === "floating") {
    return (
      <div className="scLab-journey scLab-journey--floating">
        <div className="scLab-journey__globe">
          {globeEl}
          {/* Floating card positioned near globe */}
          <div
            className={`scLab-journey__floatingCard ${activeStop ? "is-visible" : ""}`}
          >
            {activeStop ? (
              <>
                <div className="scLab-journey__year">{activeStop.year}</div>
                <h3 className="scLab-journey__title">{activeStop.title}</h3>
                <p className="scLab-journey__desc">{activeStop.description}</p>
              </>
            ) : (
              <p className="scLab-journey__hint">
                Click a dot to explore the journey
              </p>
            )}
          </div>
        </div>
        <StepIndicators
          selectedStop={selectedStop}
          onSelect={setSelectedStop}
        />
      </div>
    );
  }

  // --- Design: Timeline sidebar (I) ---
  if (design === "timeline") {
    return (
      <div className="scLab-journey scLab-journey--timeline">
        <div className="scLab-journey__globe">{globeEl}</div>
        <div className="scLab-journey__sidebar">
          <div className="scLab-journey__sidebarTitle">Journey</div>
          {JOURNEY_STOPS.map((stop, i) => (
            <button
              key={stop.id}
              type="button"
              className={`scLab-journey__timelineItem ${selectedStop === i ? "is-active" : ""} ${selectedStop !== undefined && i <= selectedStop ? "is-visited" : ""}`}
              onClick={() => setSelectedStop(i)}
            >
              <div className="scLab-journey__timelineDot">
                <span>{i + 1}</span>
              </div>
              <div className="scLab-journey__timelineContent">
                <div className="scLab-journey__timelineYear">
                  {stop.year}
                </div>
                <div className="scLab-journey__timelineTitle">
                  {stop.title}
                </div>
                {selectedStop === i && (
                  <p className="scLab-journey__timelineDesc">
                    {stop.description}
                  </p>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  // --- Design: Hybrid — floating card + timeline (K) ---
  if (design === "hybrid") {
    return (
      <div className="scLab-journey scLab-journey--hybrid">
        <div className="scLab-journey__globe">
          {globeEl}
          {/* Floating glass card */}
          <div
            className={`scLab-journey__floatingCard ${activeStop ? "is-visible" : ""}`}
          >
            {activeStop ? (
              <>
                <div className="scLab-journey__year">{activeStop.year}</div>
                <h3 className="scLab-journey__title">{activeStop.title}</h3>
                <p className="scLab-journey__desc">{activeStop.description}</p>
              </>
            ) : (
              <p className="scLab-journey__hint">
                Select a stop to explore
              </p>
            )}
          </div>
        </div>
        <div className="scLab-journey__sidebar">
          <div className="scLab-journey__sidebarTitle">Journey</div>
          {JOURNEY_STOPS.map((stop, i) => {
            const revealed = i < revealedCount;
            return (
              <button
                key={stop.id}
                type="button"
                className={`scLab-journey__timelineItem ${selectedStop === i ? "is-active" : ""} ${selectedStop !== undefined && i <= selectedStop ? "is-visited" : ""} ${!revealed ? "is-hidden" : ""}`}
                onClick={() => revealed && setSelectedStop(i)}
                disabled={!revealed}
              >
                <div className="scLab-journey__timelineDot">
                  <span>{i + 1}</span>
                </div>
                <div className="scLab-journey__timelineContent">
                  <div className="scLab-journey__timelineYear">
                    {stop.year}
                  </div>
                  <div className="scLab-journey__timelineTitle">
                    {stop.title}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  // --- Design: Top Nav — horizontal timeline + pop-up glass card (L) ---
  if (design === "topnav") {
    return (
      <div className="scLab-journey scLab-journey--topnav">
        {/* Horizontal timeline nav */}
        <nav className="scLab-journey__topbar" aria-label="Journey stops">
          {JOURNEY_STOPS.map((stop, i) => {
            const revealed = i < revealedCount;
            return (
              <button
                key={stop.id}
                type="button"
                className={`scLab-journey__topbarItem ${selectedStop === i ? "is-active" : ""} ${selectedStop !== undefined && i <= selectedStop ? "is-visited" : ""} ${!revealed ? "is-hidden" : ""}`}
                onClick={() => revealed && setSelectedStop(i)}
                disabled={!revealed}
              >
                <span className="scLab-journey__topbarDot">{i + 1}</span>
                <span className="scLab-journey__topbarLabel">{stop.label}</span>
                <span className="scLab-journey__topbarYear">{stop.year}</span>
              </button>
            );
          })}
          {/* Connecting line behind dots */}
          <div className="scLab-journey__topbarLine" />
        </nav>

        {/* Globe + floating glass card */}
        <div className="scLab-journey__topnavBody">
          <div className="scLab-journey__globe">
            {globeEl}
            <div
              className={`scLab-journey__floatingCard scLab-journey__floatingCard--center ${activeStop ? "is-visible" : ""}`}
            >
              {activeStop ? (
                <>
                  <div className="scLab-journey__year">{activeStop.year}</div>
                  <h3 className="scLab-journey__title">{activeStop.title}</h3>
                  <p className="scLab-journey__desc">{activeStop.description}</p>
                </>
              ) : (
                <p className="scLab-journey__hint">
                  Select a stop to explore
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --- Design: Full-bleed (J) ---
  return (
    <div className="scLab-journey scLab-journey--fullbleed">
      <div className="scLab-journey__globe">{globeEl}</div>
      {/* Overlay card */}
      <div
        className={`scLab-journey__overlay ${activeStop ? "is-visible" : ""}`}
      >
        {activeStop ? (
          <>
            <div className="scLab-journey__year">{activeStop.year}</div>
            <h3 className="scLab-journey__title">{activeStop.title}</h3>
            <p className="scLab-journey__desc">{activeStop.description}</p>
          </>
        ) : (
          <p className="scLab-journey__hint">
            Click a dot to explore the journey
          </p>
        )}
      </div>
      {/* Bottom step indicators */}
      <div className="scLab-journey__bottomSteps">
        <StepIndicators
          selectedStop={selectedStop}
          onSelect={setSelectedStop}
          numbered
        />
      </div>
    </div>
  );
}

/* ---- Sub-components ---- */

function JourneyCard({
  activeStop,
}: {
  activeStop: (typeof JOURNEY_STOPS)[number] | null;
}) {
  return (
    <div className={`scLab-journey__card ${activeStop ? "is-visible" : ""}`}>
      {activeStop ? (
        <>
          <div className="scLab-journey__year">{activeStop.year}</div>
          <h3 className="scLab-journey__title">{activeStop.title}</h3>
          <p className="scLab-journey__desc">{activeStop.description}</p>
        </>
      ) : (
        <p className="scLab-journey__hint">
          Click a dot to explore the journey
        </p>
      )}
    </div>
  );
}

function StepIndicators({
  selectedStop,
  onSelect,
  numbered = false,
}: {
  selectedStop: number | undefined;
  onSelect: (i: number) => void;
  numbered?: boolean;
}) {
  return (
    <div className="scLab-journey__steps">
      {JOURNEY_STOPS.map((stop, i) => (
        <button
          key={stop.id}
          type="button"
          className={`scLab-journey__step ${selectedStop === i ? "is-active" : ""} ${selectedStop !== undefined && i <= selectedStop ? "is-visited" : ""}`}
          onClick={() => onSelect(i)}
        >
          <span className="scLab-journey__stepDot">
            {numbered ? i + 1 : null}
          </span>
          <span className="scLab-journey__stepLabel">{stop.label}</span>
        </button>
      ))}
    </div>
  );
}
