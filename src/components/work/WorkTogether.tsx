"use client";

// "Let's work together" — the final Work section's interaction.
//
// Promoted from the CTA lab's Concept A (Rail). One component serves both
// breakpoints: the desktop cinematic card and the mobile Consulting card each
// supply their own background and chapter header, and mount this on top. Every
// layout rule is a `@container` query against this element, so the narrow
// layout is a property of the composition, not of the viewport.
//
// Two levels, and the second is terminal:
//
//   intro       →  the CTA, alone
//   paths       →  the three things a visitor could actually want
//   destination →  one complete screen. Nothing branches out of it.
//
// `back` steps up exactly one level, so Back and Escape mean the same thing
// everywhere, and there is exactly one back control at each level.

import { useCallback, useEffect, useReducer, useRef } from "react";
import { CTA_HINT, CTA_LABEL, PATHS, getPath, type PathId, type Step } from "@/data/workTogether";
import WorkTogetherScreen from "@/components/work/WorkTogetherScreen";
import "@/components/work/work-together.css";

interface FlowState {
  step: Step;
  path: PathId | null;
}

type FlowAction =
  | { type: "open" }
  | { type: "choosePath"; path: PathId }
  | { type: "back" }
  | { type: "reset" };

const INITIAL: FlowState = { step: "intro", path: null };

function reducer(state: FlowState, action: FlowAction): FlowState {
  switch (action.type) {
    case "open":
      return state.step === "intro" ? { step: "paths", path: null } : state;
    case "choosePath":
      return { step: "destination", path: action.path };
    case "back":
      if (state.step === "destination") return { step: "paths", path: null };
      if (state.step === "paths") return INITIAL;
      return state;
    case "reset":
      return INITIAL;
    default:
      return state;
  }
}

interface Props {
  /**
   * The photo plane. It must render INSIDE this component, not behind it:
   * `.wt__focus`'s backdrop-filter only samples what is painted beneath it
   * within the same backdrop root, and `.wt` is that root. A photo supplied by
   * the host instead sits outside it and the whole blur ladder silently does
   * nothing — the dim still lands, so it looks merely "too dark" rather than
   * broken.
   */
  media: React.ReactNode;
  /** Scroll-driven activity from the host card. Leaving the chapter resets. */
  isActive?: boolean;
  /** Extra class for host-specific spacing. */
  className?: string;
}

export default function WorkTogether({ media, isActive, className = "" }: Props) {
  const [state, dispatch] = useReducer(reducer, INITIAL);
  const rootRef = useRef<HTMLDivElement | null>(null);

  const open = useCallback(() => dispatch({ type: "open" }), []);
  const back = useCallback(() => dispatch({ type: "back" }), []);
  const choosePath = useCallback(
    (path: PathId) => dispatch({ type: "choosePath", path }),
    []
  );

  // Scrolling away from the chapter returns it to the start, so the section is
  // always found in its opening state — matches the previous Stage behaviour.
  useEffect(() => {
    if (isActive === false) dispatch({ type: "reset" });
  }, [isActive]);

  // Escape steps up one level. stopPropagation so it doesn't also close a
  // parent card on the mobile stack.
  useEffect(() => {
    if (state.step === "intro") return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      e.stopPropagation();
      back();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [state.step, back]);

  // Move focus to whatever the new level made primary.
  const stepRef = useRef<Step>(state.step);
  useEffect(() => {
    if (stepRef.current === state.step) return;
    stepRef.current = state.step;
    rootRef.current
      ?.querySelector<HTMLElement>(`[data-wt-focus="${state.step}"]`)
      ?.focus({ preventScroll: true });
  }, [state.step]);

  const path = state.step === "destination" && state.path ? getPath(state.path) : null;

  return (
    <div
      ref={rootRef}
      className={`wt ${className}`.trim()}
      data-step={state.step}
    >
      <div className="wt__media" aria-hidden="true">
        {media}
      </div>
      <div className="wt__focus" aria-hidden="true" />
      <div className="wt__grain" aria-hidden="true" />

      {state.step === "paths" && (
        <button type="button" className="wt__back" onClick={back}>
          <span aria-hidden="true">←</span> Back
        </button>
      )}

      <div className="wt__masthead">
        {state.step === "intro" ? (
          <button
            type="button"
            className="wt__cta"
            onClick={open}
            data-wt-focus="intro"
          >
            <span className="wt__ctaText">{CTA_LABEL}</span>
            <span className="wt__ctaHint">
              {CTA_HINT} <span aria-hidden="true">→</span>
            </span>
          </button>
        ) : (
          <p className="wt__eyebrow">{CTA_LABEL}</p>
        )}
        <span className="wt__rule" aria-hidden="true" />
      </div>

      <div className="wt__rows">
        {PATHS.map((p, i) => {
          const chosen = state.path === p.id;
          const dismissed = state.step === "destination" && !chosen;
          return (
            <div
              key={p.id}
              className={`wt__row ${chosen ? "is-chosen" : ""} ${
                dismissed ? "is-dismissed" : ""
              }`}
              style={{ ["--row-index" as string]: i }}
            >
              <button
                type="button"
                className="wt__rowBtn"
                onClick={() => (chosen ? back() : choosePath(p.id))}
                tabIndex={state.step === "intro" ? -1 : 0}
                aria-expanded={chosen}
                {...(i === 0 ? { "data-wt-focus": "paths" } : {})}
              >
                <span className="wt__num">{p.index}</span>
                <span className="wt__rowMain">
                  <span className="wt__label">{p.label}</span>
                  <span className="wt__lede">{p.lede}</span>
                </span>
                <span className="wt__meta">{p.meta}</span>
                <span className="wt__chev" aria-hidden="true">
                  {chosen ? "↑" : "→"}
                </span>
              </button>
              <span className="wt__rowRule" aria-hidden="true" />
            </div>
          );
        })}
      </div>

      {path && (
        <div className="wt__unfurl">
          <WorkTogetherScreen path={path} onBack={back} />
        </div>
      )}
    </div>
  );
}
