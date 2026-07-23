"use client";

import { useMemo, type CSSProperties } from "react";
import { DEFAULT_PATHS, type HeroLabState } from "@/data/consultingHeroLab";
import { VARIANT_DEFINITIONS } from "./variantDefinitions";

interface Props {
  state: HeroLabState;
  revealed: boolean;
  animate: boolean;
  onReveal: () => void;
}

export default function ConsultingHeroRenderer({ state, revealed, animate, onReveal }: Props) {
  const variant = VARIANT_DEFINITIONS[state.variant];
  const showDescriptors = state.variant === "strategyStudio" || variant.showDescriptorByDefault;

  const rootStyle = {
    ["--overlay-darkness" as string]: `${state.overlayDarkness}%`,
    ["--motion-mult" as string]: `${state.motionIntensity / 100}`,
  } as CSSProperties;

  const heroClass = [
    "heroLab-preview",
    variant.heroClass,
    `is-${state.typographyMode}`,
    `is-${state.textPosition}`,
    `is-${state.pathLayout}`,
    `anim-${state.revealAnimation}`,
    revealed ? "is-revealed" : "",
    animate ? "is-animate" : "is-static",
  ]
    .filter(Boolean)
    .join(" ");

  const pathItems = useMemo(() => DEFAULT_PATHS, []);

  return (
    <section className={heroClass} style={rootStyle}>
      <div className="heroLab-bg" aria-hidden="true" />
      <div className="heroLab-overlay" aria-hidden="true" />

      <header className="heroLab-top">
        <span className="heroLab-label">Consulting</span>
      </header>

      <div className="heroLab-copy">
        <h1 className="heroLab-thesis">{state.thesisLine}</h1>
        {state.supportLineEnabled && state.supportLineText ? <p className="heroLab-support">{state.supportLineText}</p> : null}
        <button type="button" className="heroLab-cta" onClick={onReveal}>
          {state.buttonLabel}
        </button>
      </div>

      <section className="heroLab-paths" aria-label="Service paths">
        {pathItems.map((path, index) => (
          <article
            key={path.id}
            className={`heroLab-path ${path.id === "ai" && state.featuredAIPath ? "is-featured" : ""}`}
            style={{ ["--path-index" as string]: index } as CSSProperties}
          >
            <h2>{path.title}</h2>
            {showDescriptors && path.descriptor ? <p>{path.descriptor}</p> : null}
          </article>
        ))}
      </section>
    </section>
  );
}
