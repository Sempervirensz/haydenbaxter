"use client";

import { useEffect, useRef } from "react";
import {
  HERO_CTA_LABEL,
  HERO_PATHS,
  HERO_QUOTE,
  type HeroTransitionState,
} from "@/data/consultingHeroTransition";
import { CONSULTING_OFFERS } from "@/data/consultingOffers";
import OfferDossier from "./OfferDossier";

interface Props {
  state: HeroTransitionState;
  revealed: boolean;
  onReveal: () => void;
  selectedOfferId: string | null;
  onSelectOffer: (id: string | null) => void;
  /** Step back one stage — 3 → 2 → 1. */
  onBack: () => void;
  /** Bumps whenever user hits "replay" — forces re-mount of animated quote */
  replayKey: number;
}

export default function Stage({
  state,
  revealed,
  onReveal,
  selectedOfferId,
  onSelectOffer,
  onBack,
  replayKey,
}: Props) {
  const stageRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    el.style.setProperty("--overlay-darkness", String(state.overlayStrength));
    el.style.setProperty("--overlay-blur", `${(state.overlayStrength / 100) * 22}px`);
    el.style.setProperty("--btn-rise", `${state.buttonRise}px`);
    el.style.setProperty("--btn-stagger", `${state.buttonStagger}ms`);
  }, [state.overlayStrength, state.buttonRise, state.buttonStagger]);

  // ESC steps back one stage (3 → 2 → 1) — matches ETBLab's escape pattern.
  useEffect(() => {
    if (!revealed) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onBack();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [revealed, onBack]);

  const activeOffer = selectedOfferId ? CONSULTING_OFFERS[selectedOfferId] : null;

  return (
    <div
      ref={stageRef}
      className={`cht-stage ${revealed ? "is-revealed" : ""}`}
      data-anim={state.textAnimation}
    >
      <div className="cht-bg" aria-hidden />
      <div className="cht-overlay" aria-hidden />

      {revealed && (
        <button
          type="button"
          className="cht-back"
          onClick={onBack}
          aria-label={selectedOfferId ? "Close offer" : "Back to intro"}
        >
          <span aria-hidden>&larr;</span> Back
        </button>
      )}

      <QuoteText animation={state.textAnimation} replayKey={replayKey} />

      {/* CTA — state 1 only, disappears on reveal */}
      <div className="cht-cta-wrap">
        <button
          type="button"
          className={`cht-cta is-${state.ctaStyle}`}
          onClick={onReveal}
          disabled={revealed}
        >
          {HERO_CTA_LABEL}
        </button>
      </div>

      {/* State 2: path buttons. Clicking one advances to state 3. */}
      <div
        className={`cht-paths ${selectedOfferId ? "has-selection" : ""}`}
        aria-hidden={!revealed}
      >
        {HERO_PATHS.map((path, i) => {
          const isSelected = selectedOfferId === path.id;
          return (
            <div
              key={path.id}
              className={`cht-path ${isSelected ? "is-selected" : ""}`}
              style={{ ["--path-index" as string]: i }}
            >
              <button
                type="button"
                className={`cht-path-btn is-${state.buttonTreatment} ${
                  isSelected ? "is-selected" : ""
                }`}
                onClick={() => onSelectOffer(isSelected ? null : path.id)}
                tabIndex={revealed ? 0 : -1}
                aria-expanded={isSelected}
              >
                {path.label}
              </button>
            </div>
          );
        })}
      </div>

      {/* State 3: offer dossier — hovering off-white file over the blurred background */}
      <aside
        className={`cht-offerOverlay ${activeOffer ? "is-open" : ""}`}
        data-transition={state.dossierTransition}
        aria-hidden={!activeOffer}
      >
        {activeOffer && (
          <OfferDossier offer={activeOffer} onClose={() => onSelectOffer(null)} />
        )}
      </aside>
    </div>
  );
}

function QuoteText({
  animation,
  replayKey,
}: {
  animation: HeroTransitionState["textAnimation"];
  replayKey: number;
}) {
  if (animation === "cursive") {
    return (
      <p key={`cursive-${replayKey}`} className="cht-quote is-cursive">
        {HERO_QUOTE}
      </p>
    );
  }

  const words = HERO_QUOTE.split(" ");
  return (
    <p key={`${animation}-${replayKey}`} className={`cht-quote is-${animation}`}>
      {words.map((word, i) => (
        <span
          key={i}
          className="cht-word"
          style={{ ["--word-index" as string]: i }}
        >
          {word}
          {i < words.length - 1 ? "\u00a0" : ""}
        </span>
      ))}
    </p>
  );
}
