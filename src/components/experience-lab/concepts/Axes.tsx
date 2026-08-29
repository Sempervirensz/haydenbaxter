"use client";

// 03 — TWO AXES. Global operations × emerging technology.
//
// The brief's real problem is that Nike, Disney, Aosom, Mandarin, AI, sourcing
// and supply chain read as unrelated résumé fragments. Every other direction
// answers that with order or with weight. This one answers it with structure:
// two bands, each with its own evidence, joined by a single multiplication mark
// on the gutter rail — and the conclusion set at the BOTTOM, after the proof,
// rather than as a headline that asks to be believed first.

import { CAREER, EDUCATION, FIGURES, PERSPECTIVE } from "@/data/experienceLab";
import { ConceptActions } from "./parts";

const OPS = CAREER.filter((c) => c.phase === "operations");
const TECH = CAREER.filter((c) => c.phase === "technology");

export default function Axes() {
  return (
    <div className="xlab xlab--axes">
      <div className="xlab-axes__band" data-axis="a">
        <span className="xlab-axes__label">{PERSPECTIVE.axisA}</span>
        <p className="xlab-axes__names">
          {OPS.map((s, i) => (
            <span key={s.id}>
              {i > 0 && <span className="xlab-dot" aria-hidden="true" />}
              {s.company}
            </span>
          ))}
        </p>
        <p className="xlab-axes__proof">
          {FIGURES.map((f) => (
            <span key={f.id} className="xlab-axes__fig">
              {f.inline}
            </span>
          ))}
        </p>
      </div>

      <div className="xlab-axes__join" aria-hidden="true">
        <span className="xlab-axes__cross">×</span>
      </div>

      <div className="xlab-axes__band" data-axis="b">
        <span className="xlab-axes__label">{PERSPECTIVE.axisB}</span>
        <p className="xlab-axes__names">
          {TECH.map((s) => (
            <span key={s.id}>{s.company}</span>
          ))}
        </p>
        <p className="xlab-axes__proof">
          <span className="xlab-axes__fig">{EDUCATION[0].programShort}</span>
          <span className="xlab-axes__fig">Digital Product Passports</span>
        </p>
      </div>

      <p className="xlab-axes__conclusion">{PERSPECTIVE.join}</p>

      <ConceptActions />
    </div>
  );
}
