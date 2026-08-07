"use client";

// Personas: three glass cards, sitting directly under the Work section's
// "Let's work together" chapter so the three areas that CTA names resolve into
// what each one actually covers before the page reaches Connect.
//
// This is variant B out of /personas-lab ("glass three-up"), settled on there
// and ported here. The lab's other three directions and its Surface/Colour/
// Type/Mark switches do not come with it: this file is the one decision, with
// the lab's shipped defaults baked in — dark surface, gold accent, WorldPulse
// type voice, icon marks.
//
// It replaces a tabs widget. That pattern showed one persona at a time, which
// could not satisfy the requirement that every persona show an accomplishment
// without being asked. Three cards, all readable at a glance, is the answer to
// that; the previous roving-tabindex keyboard model went with it, because
// three independent disclosures do not form a tablist.
//
// All copy comes from `@/data/personas`. Nothing is retyped here.

import { useId, useState } from "react";
import {
  PERSONAS,
  PERSONAS_HEADING,
  personaPreview,
  personaRest,
  type PersonaId,
} from "@/data/personas";
import PersonaIcon from "@/components/personas-lab/PersonaIcon";
import { usePrefersReducedMotion } from "@/components/cta-lab/usePrefersReducedMotion";
import "@/components/personas.css";

/**
 * The plate behind the glass.
 *
 * `backdrop-filter` samples whatever is painted behind it inside the same
 * backdrop root, so this has to be a sibling of the cards. On flat #0a0a0a the
 * blur has nothing to sample and the cards read as plain dark rectangles.
 *
 * Both files are served same-origin on purpose: vercel.json's CSP has no
 * `media-src`, so it falls back to `default-src 'self'` and any external video
 * URL is blocked. The still is frame 0 of the clip, so it doubles as the poster
 * and as the reduced-motion fallback.
 */
const PLATE_SRC = "/personas-plate.mp4";
const PLATE_POSTER = "/personas-plate.jpg";

export default function PersonasSection() {
  // One card open at a time, and `null` is a legal state — the section rests
  // fully closed on load, which the tabs widget it replaced could not do. This
  // matches the lab's variant B rather than being an independent disclosure
  // set: a second click moves the open card, it does not add one. Hover is not
  // bound by that, because it is CSS on each card and never touches this state.
  const [open, setOpen] = useState<PersonaId | null>(null);
  const reducedMotion = usePrefersReducedMotion();
  const uid = useId();

  return (
    <section id="personas" className="personas">
      <h2 className="personas__heading">{PERSONAS_HEADING}</h2>

      <div className="personas__stage">
        <div className="personas__plate" aria-hidden="true">
          {reducedMotion ? (
            <img src={PLATE_POSTER} alt="" />
          ) : (
            <video
              src={PLATE_SRC}
              poster={PLATE_POSTER}
              autoPlay
              muted
              loop
              playsInline
            />
          )}
        </div>

        <div className="personas__grid">
          {PERSONAS.map((persona) => {
            const isOpen = open === persona.id;
            const bodyId = `personas-body-${uid}-${persona.id}`;
            return (
              <div
                key={persona.id}
                className={`personas__card ${isOpen ? "is-open" : ""}`.trim()}
              >
                {/* Only the header is the control. The bullets sit outside the
                    button so a screen reader reads them as copy rather than
                    swallowing all three into the button's own name. */}
                <button
                  type="button"
                  className="personas__toggle"
                  aria-expanded={isOpen}
                  aria-controls={bodyId}
                  onClick={() => setOpen(isOpen ? null : persona.id)}
                >
                  <span className="personas__mark plab-mark" data-mark="icon">
                    <PersonaIcon id={persona.id} className="plab-mark__icon" />
                  </span>
                  {/* No area label here. `persona.area` is still the short DYMO
                      name used by the "Let's work together" CTA — it is just not
                      repeated on the card, where the title already says it and a
                      gold line above the title only competed with it. */}
                  <span className="personas__title">{persona.title}</span>
                  <span className="personas__preview">
                    {personaPreview(persona)}
                  </span>
                </button>

                {/* Never `hidden`: the rest of the copy stays in the
                    accessibility tree at all times and is only visually held
                    back, so nothing about a role is reachable by hover alone. */}
                <div className="personas__body" id={bodyId}>
                  <div className="personas__list">
                    {personaRest(persona).map((bullet) => (
                      <p key={bullet} className="personas__item">
                        {bullet}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
