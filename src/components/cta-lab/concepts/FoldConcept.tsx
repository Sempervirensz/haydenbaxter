"use client";

// Concept C · Fold
//
// Spatial. The CTA sits on a single plate held at a slight tilt in a perspective
// scene. Pressing it pushes the city back — deeper blur, a touch of scale — and
// the plate opens like a trifold: the middle leaf settles in place while the
// upper and lower leaves rotate open from the two seams that touch it.
//
// Choosing a leaf rotates it face-on and lets it become the destination screen;
// the other two fold away behind. The leaf the visitor pressed is literally the
// surface they end up reading.

import { CTA_HINT, CTA_LABEL, PATHS, getPath } from "@/data/ctaLab";
import Destination from "../Destination";
import type { ConceptProps } from "./types";

/** Upper hinges off its bottom edge, middle is flat, lower off its top edge. */
const LEAVES = ["upper", "middle", "lower"] as const;

export default function FoldConcept({ flow, primary }: ConceptProps) {
  const { state, open, choosePath, back } = flow;
  // Gated on the step too, so an inconsistent state can never render a
  // destination on top of the options screen.
  const path = state.step === "destination" && state.path ? getPath(state.path) : null;

  return (
    <div className="ctal-fold" data-step={state.step}>
      <div className="ctal-fold__scene">
        {/* Intro plate — the thing that unfolds. */}
        <button
          type="button"
          className="ctal-fold__seed"
          onClick={open}
          tabIndex={state.step === "intro" ? 0 : -1}
          aria-hidden={state.step !== "intro"}
          {...(primary && state.step === "intro" ? { "data-autofocus": "intro" } : {})}
        >
          <span className="ctal-fold__seedText">{CTA_LABEL}</span>
          <span className="ctal-fold__seedHint">{CTA_HINT}</span>
        </button>

        {PATHS.map((p, i) => {
          const chosen = state.path === p.id;
          const dismissed = state.step === "destination" && !chosen;
          const classes = [
            "ctal-fold__leaf",
            `ctal-fold__leaf--${LEAVES[i]}`,
            chosen ? "is-chosen" : "",
            dismissed ? "is-dismissed" : "",
          ]
            .filter(Boolean)
            .join(" ");

          return (
            <div key={p.id} className={classes} style={{ ["--leaf-index" as string]: i }}>
              <button
                type="button"
                className="ctal-fold__leafBtn"
                onClick={() => choosePath(p.id)}
                tabIndex={state.step === "paths" ? 0 : -1}
                aria-hidden={state.step !== "paths"}
                {...(primary && state.step === "paths" && i === 0
                  ? { "data-autofocus": "paths" }
                  : {})}
              >
                <span className="ctal-fold__leafNum">{p.index}</span>
                <span className="ctal-fold__leafLabel">{p.label}</span>
                <span className="ctal-fold__leafLede">{p.lede}</span>
              </button>

              {/* The chosen leaf becomes the reading surface in place. */}
              {chosen && path && (
                <div className="ctal-fold__face">
                  <Destination
                    variant="fold"
                    path={path}
                    onBack={back}
                    primary={primary}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
