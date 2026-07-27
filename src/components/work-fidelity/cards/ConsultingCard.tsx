"use client";

// 04 — Consulting, three fidelity variations.
//
// Production's Stage is a three-state machine: cursive quote + glass CTA →
// frosted blur wash + candy path buttons → off-white offer dossier. All three
// variations keep that machine and its materials; they differ only in how much
// of it a phone should gate behind a tap.
//
// The candy path buttons use consulting's own Cobalt Select values, which are
// the same motif as the ETB bars — that shared language is most of why the two
// cards feel like one site.
//
//   A  Production Faithful — the three states as they ship.
//   B  Open Invitation     — states 1+2 merged; booking always reachable.
//   C  Refined Motion      — A's staging with production's rise + stagger,
//                            plus a settle on the statue.

import { useCallback, useRef, useState } from "react";
import { HERO_QUOTE, HERO_CTA_LABEL, HERO_PATHS } from "@/data/consultingHeroTransition";
import { CONSULTING_OFFERS } from "@/data/consultingOffers";
import { WORK_SCREENS } from "@/data/work";
import { CALENDLY_URL } from "@/data/connect";
import { Rail, useEscape } from "../parts";
import { useLayeredDrift } from "../useLayeredDrift";
import type { VariantKey } from "@/data/workMobileVariants";

const SCREEN = WORK_SCREENS.find((s) => s.type === "consulting");
if (!SCREEN || SCREEN.type !== "consulting") throw new Error("Consulting screen missing");
const CNS = SCREEN.consulting;

/** Production swaps to this asset at ≤640px — it was shot for portrait
 *  (900×2000, within 3% of a phone card's aspect, so almost no crop). */
const IMG = "/consulting/mobile-statue.webp";
const IMG_ALT =
  "A winged victory statue lit against a golden hillside cityscape at night, above still water.";

export default function ConsultingCard({
  variant,
  scrollRootRef,
  motion = true,
}: {
  variant: VariantKey;
  scrollRootRef: React.RefObject<HTMLElement | null>;
  motion?: boolean;
}) {
  // B has no gate: it starts revealed and cannot un-reveal.
  const gated = variant !== "b";
  const [revealed, setRevealed] = useState(!gated);
  const [offerId, setOfferId] = useState<string | null>(null);

  const rootRef = useRef<HTMLElement | null>(null);
  const ctaRef = useRef<HTMLButtonElement | null>(null);
  const pathRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  const motionRef = useRef(motion);
  motionRef.current = motion;
  // Only C drifts — A and B hold the statue still, as production does.
  useLayeredDrift(
    variant === "c" ? rootRef : { current: null },
    scrollRootRef,
    () => motionRef.current
  );

  // Production's Back steps 3 → 2 → 1, and Escape does the same.
  const back = useCallback(() => {
    if (offerId) {
      const id = offerId;
      setOfferId(null);
      pathRefs.current[id]?.focus({ preventScroll: true });
    } else if (gated && revealed) {
      setRevealed(false);
      ctaRef.current?.focus({ preventScroll: true });
    }
  }, [offerId, gated, revealed]);
  useEscape(revealed || !!offerId, back);

  const offer = offerId ? CONSULTING_OFFERS[offerId] : null;

  return (
    <article
      ref={rootRef as React.RefObject<HTMLElement>}
      className={`wf-card wf-card--cns ${revealed ? "is-revealed" : ""} ${
        offer ? "has-offer" : ""
      }`}
      style={
        variant === "c"
          ? ({ "--wf-btn-rise": "72px", "--wf-btn-stagger": "90ms" } as React.CSSProperties)
          : variant === "b"
            ? // Production blurs the hero in state 2 because you have moved past
              // it. The ungated variant has no state 1 to move past, so a full
              // wash would hide the statue for the card's whole life. It gets a
              // light haze — enough to seat the candy buttons, not enough to
              // lose the image.
              ({ "--wf-wash-blur": "3px" } as React.CSSProperties)
            : undefined
      }
    >
      <div className="wf-cns__media">
        <img className="wf-cns__img" src={IMG} alt={IMG_ALT} />
      </div>
      <span className="wf-cns__wash" aria-hidden="true" />
      <span className="wf-cns__vignette" aria-hidden="true" />

      <Rail id={4} />

      {gated && (
        <button
          type="button"
          className="wf-cns__back"
          onClick={back}
          aria-label={offer ? "Close offer" : "Back to intro"}
        >
          ← Back
        </button>
      )}

      <div className="wf-cns__stage">
        <p className="wf-cns__quote">{HERO_QUOTE}</p>

        <span className="wf-label wf-cns__eyebrow">{CNS.eyebrow}</span>
        <h2 className="wf-headline" style={{ textAlign: "center" }}>
          {CNS.heroTitle}
        </h2>

        {gated ? (
          <button
            type="button"
            ref={ctaRef}
            className="wf-cns__ctaGlass"
            onClick={() => setRevealed(true)}
            aria-expanded={revealed}
          >
            {HERO_CTA_LABEL}
          </button>
        ) : (
          <p
            className="wf-para"
            style={{ textAlign: "center", color: "rgba(255,255,255,0.72)" }}
          >
            {CNS.heroSubtitle}
          </p>
        )}

        <div
          className={`wf-cns__paths ${gated ? "wf-cns__paths--gated" : ""}`}
          aria-hidden={gated && !revealed}
        >
          {HERO_PATHS.map((path, i) => {
            const isSelected = offerId === path.id;
            return (
              <button
                key={path.id}
                type="button"
                className={`wf-cns__path ${isSelected ? "is-selected" : ""}`}
                style={{ ["--path-index" as string]: i }}
                ref={(el) => {
                  pathRefs.current[path.id] = el;
                }}
                tabIndex={gated && !revealed ? -1 : 0}
                aria-expanded={isSelected}
                onClick={() => setOfferId(isSelected ? null : path.id)}
              >
                {path.label}
                <span className="wf-cns__pathArrow" aria-hidden="true">→</span>
              </button>
            );
          })}
        </div>

        {/* B keeps booking permanently reachable — the last chapter's whole job
            is to start a conversation, and on a phone that should never be two
            taps deep. */}
        {variant === "b" && (
          <a
            className="wf-cta"
            href={CALENDLY_URL}
            target="_blank"
            rel="noopener noreferrer"
          >
            Book a 30-minute call
            <span aria-hidden="true">→</span>
          </a>
        )}
      </div>

      {/* State 3 — the off-white offer file. */}
      <div
        className="wf-cns__offer"
        role="group"
        aria-label={offer ? `${offer.name} details` : "Offer details"}
        inert={!offer}
      >
        {offer && (
          <>
            <button
              type="button"
              className="wf-glass__close"
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
            <h3 className="wf-cns__offerName">{offer.name}</h3>
            <p className="wf-cns__offerDesc">{offer.descriptor}</p>
            <ul className="wf-cns__offerList">
              {offer.bullets.map((b) => (
                <li key={b}>{b}</li>
              ))}
            </ul>
            <a
              className="wf-dos__cta"
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
