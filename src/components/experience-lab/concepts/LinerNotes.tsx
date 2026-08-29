"use client";

// 05 — LINER NOTES. The risk.
//
// The chapter this sheet opens inside is a CD player: a spinning disc on the
// Work landing, the three choices set as a track listing with scrub lines, the
// panel's own grooves drawn from its right edge. Every direction in this lab is
// asked whether it feels native. This one asks the harder version — if the
// section is already inside a record, why is the career being listed instead of
// pressed?
//
// So: Side A is the operating years, Side B is the venture, and the two are the
// same record. That is the coherence argument the brief asks for, made by the
// form rather than by a sentence. It is also the direction most likely to be
// judged too much, which is why it exists.

import { CAPABILITIES, CAREER, EDUCATION, FIGURES } from "@/data/experienceLab";
import { ConceptActions } from "./parts";

const SIDES = [
  { key: "A", label: "Operations", stops: CAREER.filter((c) => c.phase === "operations") },
  { key: "B", label: "Technology", stops: CAREER.filter((c) => c.phase === "technology") },
];

export default function LinerNotes() {
  return (
    <div className="xlab xlab--liner">
      {SIDES.map((side) => (
        <section key={side.key} className="xlab-liner__side">
          <h4 className="xlab-liner__sideHead">
            <span className="xlab-liner__sideKey">Side {side.key}</span>
            <span className="xlab-liner__sideName">{side.label}</span>
          </h4>
          <ol className="xlab-liner__tracks">
            {side.stops.map((stop, i) => (
              <li key={stop.id} className="xlab-liner__track">
                <span className="xlab-liner__cat">{`${side.key}${i + 1}`}</span>
                <span className="xlab-liner__company">{stop.company}</span>
                <span className="xlab-liner__role">{stop.role}</span>
              </li>
            ))}
          </ol>
        </section>
      ))}

      <section className="xlab-liner__notes">
        <h4 className="xlab-liner__notesHead">Credits</h4>
        <p className="xlab-liner__credits">
          {CAPABILITIES.slice(0, 4).map((c, i) => (
            <span key={c}>
              {i > 0 && <span className="xlab-dot" aria-hidden="true" />}
              {c}
            </span>
          ))}
        </p>
      </section>

      <section className="xlab-liner__notes">
        <h4 className="xlab-liner__notesHead">Pressed at</h4>
        <p className="xlab-liner__credits">
          {EDUCATION.map((e, i) => (
            <span key={e.id}>
              {i > 0 && <span className="xlab-dot" aria-hidden="true" />}
              {e.schoolShort} — {e.programShort}
            </span>
          ))}
        </p>
      </section>

      <p className="xlab-liner__runtime">
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
