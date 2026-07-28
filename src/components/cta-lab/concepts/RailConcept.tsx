"use client";

// Concept A · Rail — the production candidate.
//
// Editorial, left-aligned, index-style. The CTA is set as a serif headline low
// in the frame. Pressing it demotes the headline to a mono eyebrow and three
// full-width rows rise in, staggered — an index of the three things a visitor
// could actually want, not a menu of capabilities.
//
// Choosing a row is the whole storytelling model: the other two slide out, the
// chosen row pins under the eyebrow as the live header of what follows, and the
// destination unfurls in place beneath it. No overlay, no modal, and nothing to
// navigate once you're there.

import { CTA_HINT, CTA_LABEL, PATHS, getPath } from "@/data/ctaLab";
import Destination from "../Destination";
import type { ConceptProps } from "./types";

export default function RailConcept({ flow, primary }: ConceptProps) {
  const { state, open, choosePath, back } = flow;
  // Gated on the step too, so an inconsistent state can never render a
  // destination on top of the options screen.
  const path = state.step === "destination" && state.path ? getPath(state.path) : null;

  return (
    <div className="ctal-rail" data-step={state.step}>
      <div className="ctal-rail__masthead">
        {state.step === "intro" ? (
          <button
            type="button"
            className="ctal-rail__cta"
            onClick={open}
            {...(primary ? { "data-autofocus": "intro" } : {})}
          >
            <span className="ctal-rail__ctaText">{CTA_LABEL}</span>
            <span className="ctal-rail__ctaHint">
              {CTA_HINT} <span aria-hidden>→</span>
            </span>
          </button>
        ) : (
          <p className="ctal-rail__eyebrow">{CTA_LABEL}</p>
        )}
        <span className="ctal-rail__rule" aria-hidden />
      </div>

      <div className="ctal-rail__rows">
        {PATHS.map((p, i) => {
          const chosen = state.path === p.id;
          const dismissed = state.step === "destination" && !chosen;
          const classes = [
            "ctal-rail__row",
            chosen ? "is-chosen" : "",
            dismissed ? "is-dismissed" : "",
          ]
            .filter(Boolean)
            .join(" ");

          return (
            <div key={p.id} className={classes} style={{ ["--row-index" as string]: i }}>
              <button
                type="button"
                className="ctal-rail__rowBtn"
                onClick={() => (chosen ? back() : choosePath(p.id))}
                tabIndex={state.step === "intro" ? -1 : 0}
                aria-expanded={chosen}
                {...(primary && state.step === "paths" && i === 0
                  ? { "data-autofocus": "paths" }
                  : {})}
              >
                <span className="ctal-rail__num">{p.index}</span>
                <span className="ctal-rail__rowMain">
                  <span className="ctal-rail__label">{p.label}</span>
                  <span className="ctal-rail__lede">{p.lede}</span>
                </span>
                <span className="ctal-rail__meta">{p.meta}</span>
                <span className="ctal-rail__chev" aria-hidden>
                  {chosen ? "↑" : "→"}
                </span>
              </button>
              <span className="ctal-rail__rowRule" aria-hidden />
            </div>
          );
        })}
      </div>

      {path && (
        <div className="ctal-rail__unfurl">
          <Destination variant="rail" path={path} onBack={back} primary={primary} />
        </div>
      )}
    </div>
  );
}
