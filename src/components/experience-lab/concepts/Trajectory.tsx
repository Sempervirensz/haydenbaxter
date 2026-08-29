"use client";

// 02 — TRAJECTORY. Career-story-first.
//
// The brands marquee near the top of the page already shows Nike, Disney and
// Aosom as three equal logos. Flattened like that they read as a list of places
// he has been. The one thing a list cannot carry is direction — which came
// first, what the move was, where it ended up.
//
// So this is a spine: one brass hairline running top to bottom with a node at
// each stop, chronological, the last node open like the cue button's ring
// because it is the one still running. The scale figures sit under the spine as
// a runtime rather than as a headline claim.

import { CAREER, FIGURES, PHASE_LABEL } from "@/data/experienceLab";
import { ConceptActions } from "./parts";

export default function Trajectory() {
  return (
    <div className="xlab xlab--trajectory">
      <ol className="xlab-traj__spine">
        {CAREER.map((stop, i) => {
          const last = i === CAREER.length - 1;
          const phaseChanges = i > 0 && CAREER[i - 1].phase !== stop.phase;
          return (
            <li
              key={stop.id}
              className="xlab-traj__stop"
              data-last={last || undefined}
              data-phase={stop.phase}
            >
              <span className="xlab-traj__node" aria-hidden="true" />
              {phaseChanges && (
                <span className="xlab-traj__turn">{PHASE_LABEL[stop.phase]}</span>
              )}
              <span className="xlab-traj__role">{stop.role}</span>
              <span className="xlab-traj__company">{stop.company}</span>
            </li>
          );
        })}
      </ol>

      <p className="xlab-traj__runtime">
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
