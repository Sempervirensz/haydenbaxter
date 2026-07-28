"use client";

// Concept B · Split
//
// The CTA is one DYMO plate reading "LET'S / WORK / TOGETHER" with two hairline
// seams. Pressing it splits the plate three ways: the segments travel apart and
// the middle line of each crossfades into a path label, while index and meta
// lines unfold above and below.
//
// The shared element is real — the same three DOM nodes carry the label from
// intro through to the header of the destination — so the motion is always
// traceable to the click. Choosing a path collapses the other two columns to
// 0fr; the survivor widens into a header ribbon and its screen rises beneath.

import { CTA_HINT, CTA_LABEL, CTA_LABEL_SEGMENTS, PATHS, getPath } from "@/data/ctaLab";
import Destination from "../Destination";
import type { ConceptProps } from "./types";

const SLOTS = ["a", "b", "c"] as const;

export default function SplitConcept({ flow, primary }: ConceptProps) {
  const { state, open, choosePath, back } = flow;
  // Gated on the step too, so an inconsistent state can never render a
  // destination on top of the options screen.
  const path = state.step === "destination" && state.path ? getPath(state.path) : null;

  return (
    <div className="ctal-split" data-step={state.step}>
      <div className="ctal-split__stack">
        <div
          className="ctal-split__plate"
          role={state.step === "intro" ? "group" : undefined}
        >
          {PATHS.map((p, i) => {
            const chosen = state.path === p.id;
            const dismissed = state.step === "destination" && !chosen;
            // At intro the three segments read as ONE control, so only the
            // first is exposed — screen readers hear one CTA, not three.
            const decorative = state.step === "intro" && i > 0;

            const classes = [
              "ctal-split__seg",
              `ctal-split__seg--${SLOTS[i]}`,
              chosen ? "is-chosen" : "",
              dismissed ? "is-dismissed" : "",
            ]
              .filter(Boolean)
              .join(" ");

            return (
              <button
                key={p.id}
                type="button"
                className={classes}
                onClick={() => (state.step === "intro" ? open() : choosePath(p.id))}
                aria-hidden={decorative}
                tabIndex={decorative ? -1 : 0}
                aria-label={
                  state.step === "intro" ? CTA_LABEL : `${p.label} — ${p.lede}`
                }
                {...(primary &&
                i === 0 &&
                (state.step === "intro" || state.step === "paths")
                  ? { "data-autofocus": state.step }
                  : {})}
              >
                {/* The index and meta lines unfold from zero height, so the
                    plate grows rather than jumping. Only the middle line
                    crossfades — it's the same line that read "Let's". */}
                <span className="ctal-split__faces">
                  <span className="ctal-split__slot">
                    <span className="ctal-split__index">{p.index}</span>
                  </span>
                  <span className="ctal-split__line">
                    <span className="ctal-split__face ctal-split__face--from">
                      {CTA_LABEL_SEGMENTS[i]}
                    </span>
                    <span className="ctal-split__face ctal-split__face--to">
                      {p.label}
                    </span>
                  </span>
                  <span className="ctal-split__slot">
                    <span className="ctal-split__meta">{p.lede}</span>
                  </span>
                </span>
              </button>
            );
          })}
        </div>

        <p className="ctal-split__hint" aria-hidden={state.step !== "intro"}>
          {CTA_HINT}
        </p>
      </div>

      {path && (
        <div className="ctal-split__screenSlot">
          <Destination variant="split" path={path} onBack={back} primary={primary} />
        </div>
      )}
    </div>
  );
}
