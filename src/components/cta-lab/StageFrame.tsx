"use client";

// The environment: everything around the concept.
//
// Reproduces the production Consulting card closely enough to judge the
// interaction honestly — the same cityscape, the same "04 — Consulting" header
// rule, the same filmic card edge — plus the depth treatment the concepts
// depend on (blur, vignette, grain, scale) driven off the flow step.

import { useEffect, useRef } from "react";
import { SECTION_LABELS, STAGE_BACKGROUND, type SectionLabelKey } from "@/data/ctaLab";
import type { ConceptId } from "@/data/ctaLab";
import type { CtaFlow } from "./useCtaFlow";
import SplitConcept from "./concepts/SplitConcept";
import RailConcept from "./concepts/RailConcept";
import FoldConcept from "./concepts/FoldConcept";

const CONCEPT_COMPONENTS = {
  split: SplitConcept,
  rail: RailConcept,
  fold: FoldConcept,
} as const;

interface Props {
  concept: ConceptId;
  flow: CtaFlow;
  reducedMotion: boolean;
  sectionLabel: SectionLabelKey;
  /** "desktop" | "narrow" — sets the frame width the container queries read. */
  width: "desktop" | "narrow";
  primary?: boolean;
}

export default function StageFrame({
  concept,
  flow,
  reducedMotion,
  sectionLabel,
  width,
  primary,
}: Props) {
  const stageRef = useRef<HTMLDivElement | null>(null);
  const Concept = CONCEPT_COMPONENTS[concept];
  const { state, back } = flow;

  // Escape steps back one level — same meaning at every level, every concept.
  useEffect(() => {
    if (!primary || state.step === "intro") return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") back();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [primary, state.step, back]);

  // Move focus to whatever the new level made primary. Marked in the concepts
  // with data-autofocus so each one decides its own entry point.
  useEffect(() => {
    if (!primary) return;
    const el = stageRef.current?.querySelector<HTMLElement>(
      `[data-autofocus="${state.step}"]`
    );
    el?.focus({ preventScroll: true });
  }, [primary, state.step, concept]);

  return (
    <div className={`ctal-frame ctal-frame--${width}`}>
      <div
        ref={stageRef}
        className={`ctal-stage ctal-stage--${concept}`}
        data-step={state.step}
        data-motion={reducedMotion ? "reduced" : "full"}
      >
        <div
          className="ctal-bg"
          aria-hidden
          style={{
            ["--bg-wide" as string]: `url("${STAGE_BACKGROUND.wide}")`,
            ["--bg-narrow" as string]: `url("${STAGE_BACKGROUND.narrow}")`,
          }}
        />
        <div className="ctal-focus" aria-hidden />
        <div className="ctal-vignette" aria-hidden />
        <div className="ctal-grain" aria-hidden />
        <div className="ctal-scrim" aria-hidden />

        <header className="ctal-head">
          <span className="ctal-head__label">{SECTION_LABELS[sectionLabel]}</span>
          <span className="ctal-head__rule" />
        </header>

        {/* Exactly one Back control at every level. At `destination` that's the
            one inside the screen itself, so this pill stands down rather than
            doubling it. */}
        {state.step === "paths" && (
          <button
            type="button"
            className="ctal-back"
            onClick={back}
            aria-label="Back to the start"
          >
            <span aria-hidden>←</span> Back
          </button>
        )}

        <div className="ctal-body">
          <Concept flow={flow} primary={primary} />
        </div>
      </div>

      {width === "narrow" && <p className="ctal-frame__tag">390 × 780</p>}
    </div>
  );
}
