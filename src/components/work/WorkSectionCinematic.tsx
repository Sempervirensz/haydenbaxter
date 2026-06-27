"use client";

// Work section — merged: the signature CD-scroll clock landing (unchanged) feeds
// straight into the four projects rendered as cinematic cards.
//
// The CD scroll machinery is reused untouched:
//   - useWorkScroll spins the disc + reports screenIndex / activeLabel
//   - WorkLanding is the verbatim landing chapter
//   - the 300vh .work__chapter--detail tracks + screenBreaks timing are unchanged
// Only what renders INSIDE each detail chapter changes: a cinematic card
// (CinematicCardBody) instead of the old glass detail card. The cinematic
// sink/dim + parallax is driven by useCinematicParallax.

import { useRef, useState } from "react";
import { useWorkScroll } from "@/hooks/useWorkScroll";
import { useCinematicParallax } from "@/hooks/useCinematicParallax";
import WorkLanding from "@/components/work/WorkLanding";
import CinematicCardBody, { CINEMATIC_CARDS } from "@/components/work/CinematicCardBody";
import "@/components/work/cinematic-work-stack.css";

export default function WorkSectionCinematic() {
  const { ref, screenIndex, activeLabel } = useWorkScroll();
  const [peek, setPeek] = useState(false);

  // Card parallax / depth handoff. Motion baked on (reduced-motion safe inside).
  useCinematicParallax(ref);

  return (
    <section id="work" ref={ref} className="work work--cinematic">
      <WorkLanding activeLabel={activeLabel} />

      {CINEMATIC_CARDS.map((card, idx) => (
        <div
          key={card.id}
          className="work__chapter work__chapter--detail"
          style={{ zIndex: idx + 2 }}
          data-cstack-chapter
          data-cstack-id={card.id}
        >
          <article className={`cstack__card cstack__card--${card.id} cstack__card--${card.kind}`}>
            <CinematicCardBody
              card={card}
              isActive={screenIndex === idx + 1}
              peek={peek}
              onTogglePeek={() => setPeek((p) => !p)}
            />
          </article>
        </div>
      ))}
    </section>
  );
}
