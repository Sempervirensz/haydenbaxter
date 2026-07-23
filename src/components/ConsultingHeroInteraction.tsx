"use client";

import HeroText from "./consulting-lab/HeroText";
import PathButtons from "./consulting-lab/PathButtons";
import { useHeroTransition } from "./consulting-lab/useHeroTransition";
import "./consulting-hero-interaction.css";

export default function ConsultingHeroInteraction() {
  const { revealed, reducedMotion, onExploreClick } = useHeroTransition();

  return (
    <section className={`consultHero ${revealed ? "is-revealed" : ""}`}>
      <img className="consultHero-bg" src="/consulting/consulting-hero.png" alt="Night city skyline" />

      <div className="consultHero-vignette" aria-hidden="true" />
      <div className={`consultHero-glassWash ${revealed ? "is-visible" : ""}`} aria-hidden="true" />

      <header className="consultHero-topLeft">
        <span className="consultHero-label">Consulting</span>
      </header>

      <HeroText reducedMotion={reducedMotion} />

      {!revealed ? (
        <button type="button" className="consultHero-cta tag" onClick={onExploreClick}>
          Explore your path
        </button>
      ) : null}

      <PathButtons revealed={revealed} reducedMotion={reducedMotion} />
    </section>
  );
}
