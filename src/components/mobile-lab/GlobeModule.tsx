"use client";

// ═══════════════════════════════════════════════════════════════════════════
// [PROMOTABLE pattern] Deferred-load globe — /mobile-lab
//
// The journey globe is the heaviest thing on the site (three.js). On mobile
// it renders as a static dimmed-earth preview first; the WebGL scene and its
// textures only load after an explicit tap. Reuses the production
// RealisticGlobe + JOURNEY_STOPS untouched, so promoting this is just a
// matter of moving the wrapper.
// ═══════════════════════════════════════════════════════════════════════════

import { useState } from "react";
import dynamic from "next/dynamic";
import { JOURNEY_STOPS, JOURNEY_ARCS } from "@/data/scLab";

const RealisticGlobe = dynamic(() => import("@/components/ui/realistic-globe"), {
  ssr: false,
  loading: () => (
    <div style={{ height: 240, display: "grid", placeItems: "center" }}>
      <span className="mlab-kicker">Loading globe…</span>
    </div>
  ),
});

export default function GlobeModule() {
  const [loaded, setLoaded] = useState(false);
  // Default to Taiwan — the journey's origin (production default framing).
  const [selected, setSelected] = useState(0);

  const dots = JOURNEY_STOPS.map((s, i) => ({
    coords: s.coords,
    label: s.label,
    selected: i === selected,
  }));

  return (
    <div className="mlab-globe-card">
      {loaded ? (
        <div className="mlab-globe-live">
          <RealisticGlobe
            width={260}
            height={250}
            autoRotate={false}
            frozen
            visualStyle="clouds"
            lonOffset={-100}
            latOffset={22}
            journeyDots={dots}
            selectedDot={selected}
            journeyArcs={JOURNEY_ARCS}
            onDotClick={setSelected}
          />
          <p>
            {JOURNEY_STOPS[selected].year} — {JOURNEY_STOPS[selected].headline}
          </p>
        </div>
      ) : (
        <button type="button" className="mlab-globe-preview" onClick={() => setLoaded(true)}>
          <span className="mlab-globe-still" aria-hidden="true" />
          <span className="tag">Tap to spin the globe</span>
        </button>
      )}
    </div>
  );
}
