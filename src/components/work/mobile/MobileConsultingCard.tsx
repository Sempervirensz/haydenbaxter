"use client";

// 04 — Consulting · approved mobile design: Option C, "Refined Motion".
//
// Production's three-state Stage, kept intact and re-timed for a phone:
//   1. cursive quote + glass "Explore What's Possible" CTA over the statue
//   2. tap → frosted wash blooms, the three candy path buttons rise on
//      production's own buttonRise (72px) + stagger (90ms)
//   3. tap a path → the off-white offer file
// Back / Escape step 3 → 2 → 1, matching ConsultingHeroStage.
//
// The candy path buttons carry consulting's own Cobalt Select — the same motif
// as the ETB bars, which is much of why the two chapters read as one site.
// Refined Motion also drifts the statue subtly as the card crosses the
// viewport (useCardDrift): the "settle" that gives the final chapter a sense of
// arrival. All motion is transform/opacity only and disables under
// prefers-reduced-motion.

import { useCallback, useRef, useState } from "react";
import { HERO_QUOTE, HERO_CTA_LABEL, HERO_PATHS } from "@/data/consultingHeroTransition";
import { CONSULTING_OFFERS } from "@/data/consultingOffers";
import { WORK_SCREENS } from "@/data/work";
import { CALENDLY_URL } from "@/data/connect";
import { Rail, useEscape } from "./shared";
import { useCardDrift } from "./useCardDrift";

const SCREEN = WORK_SCREENS.find((s) => s.type === "consulting");
if (!SCREEN || SCREEN.type !== "consulting") throw new Error("Consulting screen missing");
const CNS = SCREEN.consulting;

/** Production swaps to this asset at ≤640px — shot for portrait (900×2000). */
const IMG = "/consulting/mobile-statue.webp";
const IMG_ALT =
  "A winged victory statue lit against a golden hillside cityscape at night, above still water.";

export default function MobileConsultingCard() {
  const [revealed, setRevealed] = useState(false);
  const [offerId, setOfferId] = useState<string | null>(null);

  const rootRef = useRef<HTMLElement | null>(null);
  const ctaRef = useRef<HTMLButtonElement | null>(null);
  const pathRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  // Refined Motion drifts the statue as the card crosses the viewport.
  useCardDrift(rootRef);

  // Back steps 3 → 2 → 1, and Escape does the same.
  const back = useCallback(() => {
    if (offerId) {
      const id = offerId;
      setOfferId(null);
      pathRefs.current[id]?.focus({ preventScroll: true });
    } else if (revealed) {
      setRevealed(false);
      ctaRef.current?.focus({ preventScroll: true });
    }
  }, [offerId, revealed]);
  useEscape(revealed || !!offerId, back);

  const offer = offerId ? CONSULTING_OFFERS[offerId] : null;

  return (
    <article
      ref={rootRef as React.RefObject<HTMLElement>}
      className={`wm-card wm-card--cns ${revealed ? "is-revealed" : ""} ${
        offer ? "has-offer" : ""
      }`}
      style={{ "--wm-btn-rise": "72px", "--wm-btn-stagger": "90ms" } as React.CSSProperties}
    >
      <div className="wm-cns__media">
        <img className="wm-cns__img" src={IMG} alt={IMG_ALT} />
      </div>
      <span className="wm-cns__wash" aria-hidden="true" />
      <span className="wm-cns__vignette" aria-hidden="true" />

      <Rail id={4} />

      <button
        type="button"
        className="wm-cns__back"
        onClick={back}
        aria-label={offer ? "Close offer" : "Back to intro"}
      >
        ← Back
      </button>

      <div className="wm-cns__stage">
        <p className="wm-cns__quote">{HERO_QUOTE}</p>

        <span className="wm-label wm-cns__eyebrow">{CNS.eyebrow}</span>
        <h2 className="wm-headline" style={{ textAlign: "center" }}>
          {CNS.heroTitle}
        </h2>

        <button
          type="button"
          ref={ctaRef}
          className="wm-cns__ctaGlass"
          onClick={() => setRevealed(true)}
          aria-expanded={revealed}
        >
          {HERO_CTA_LABEL}
        </button>

        <div
          className="wm-cns__paths wm-cns__paths--gated"
          aria-hidden={!revealed}
        >
          {HERO_PATHS.map((path, i) => {
            const isSelected = offerId === path.id;
            return (
              <button
                key={path.id}
                type="button"
                className={`wm-cns__path ${isSelected ? "is-selected" : ""}`}
                style={{ ["--path-index" as string]: i }}
                ref={(el) => {
                  pathRefs.current[path.id] = el;
                }}
                tabIndex={revealed ? 0 : -1}
                aria-expanded={isSelected}
                onClick={() => setOfferId(isSelected ? null : path.id)}
              >
                {path.label}
                <span className="wm-cns__pathArrow" aria-hidden="true">→</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* State 3 — the off-white offer file. */}
      <div
        className="wm-cns__offer"
        role="group"
        aria-label={offer ? `${offer.name} details` : "Offer details"}
        inert={!offer}
      >
        {offer && (
          <>
            <button
              type="button"
              className="wm-glass__close"
              onClick={back}
              aria-label="Close offer"
              style={{
                borderColor: "rgba(17,17,22,0.18)",
                background: "rgba(17,17,22,0.06)",
                color: "rgba(17,17,22,0.7)",
              }}
            >
              ×
            </button>
            <h3 className="wm-cns__offerName">{offer.name}</h3>
            <p className="wm-cns__offerDesc">{offer.descriptor}</p>
            <ul className="wm-cns__offerList">
              {offer.bullets.map((b) => (
                <li key={b}>{b}</li>
              ))}
            </ul>
            <a
              className="wm-dos__cta"
              href={CALENDLY_URL}
              target="_blank"
              rel="noopener noreferrer"
            >
              Book a 30-minute call →
            </a>
          </>
        )}
      </div>
    </article>
  );
}
