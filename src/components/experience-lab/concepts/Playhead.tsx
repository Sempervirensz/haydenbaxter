"use client";

// 08 — PLAYHEAD. Short at rest, deep on demand.
//
// The measured problem this direction is aimed at: the shipped section is 873px
// of content inside a 518px sheet at 402px wide, with no scroll affordance. Any
// direction that wants to carry the whole record has to either cut it or reveal
// it. This one reveals it.
//
// The interaction is the one directly above it, one level down. The three
// choices are a track listing with a scrub line that fills on the current row;
// these four stops are the same gesture inside the sheet — one open at a time,
// the others receding to the `.wl-c2__item` third, the scrub filling to the
// chosen position.
//
// WHAT THE REVEAL IS ALLOWED TO SAY
//
// Role and position in the arc, and nothing else. Attributing a capability or a
// figure to a single employer would be a claim the brief did not make — "100+
// factories" is a career total, not a Nike total — so the shared proof line
// stays shared and only the phase changes with the selection.

import { useState } from "react";
import { CAREER, FIGURES, PHASE_LABEL } from "@/data/experienceLab";
import { ConceptActions } from "./parts";

export default function Playhead() {
  // Opens on the venture: it is the current stop and the strongest single item.
  const [openId, setOpenId] = useState(CAREER[CAREER.length - 1].id);

  return (
    <div className="xlab xlab--playhead">
      <ol className="xlab-play__list">
        {CAREER.map((stop) => {
          const open = stop.id === openId;
          return (
            <li key={stop.id} className="xlab-play__item" data-open={open || undefined}>
              <button
                type="button"
                className="xlab-play__btn"
                aria-expanded={open}
                onClick={() => setOpenId(stop.id)}
              >
                <span className="xlab-play__num">{stop.index}</span>
                <span className="xlab-play__main">
                  <span className="xlab-play__company">{stop.company}</span>
                  <span className="xlab-play__reveal">
                    <span className="xlab-play__role">{stop.role}</span>
                    <span className="xlab-play__phase">{PHASE_LABEL[stop.phase]}</span>
                  </span>
                  <span
                    className="xlab-play__scrub"
                    aria-hidden="true"
                    style={{ ["--fill" as string]: open ? "100%" : "0%" }}
                  />
                </span>
              </button>
            </li>
          );
        })}
      </ol>

      <p className="xlab-play__proof">
        {FIGURES.map((f, i) => (
          <span key={f.id}>
            {i > 0 && <span className="xlab-dot" aria-hidden="true" />}
            {f.inline}
          </span>
        ))}
      </p>

      <ConceptActions />
    </div>
  );
}
