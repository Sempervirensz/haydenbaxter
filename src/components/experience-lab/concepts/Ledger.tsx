"use client";

// 01 — LEDGER. The extremely restrained one.
//
// Nothing is explained. Four companies in the display face, four roles in mono
// on the same baseline, on hairlines. Then one proof line, one education line,
// and the ask.
//
// Newest first, deliberately: this is a record being read, not a story being
// told, and Founder at WorldPulse is the strongest single item available. The
// chronological reading is concept 02's argument, not this one's.

import { CAREER_RECENT, EDUCATION, FIGURES } from "@/data/experienceLab";
import { ConceptActions, Rule } from "./parts";

export default function Ledger() {
  const asu = EDUCATION[0];
  return (
    <div className="xlab xlab--ledger">
      <ol className="xlab-ledger__list">
        {CAREER_RECENT.map((stop) => (
          <li key={stop.id} className="xlab-ledger__row">
            <span className="xlab-ledger__company">{stop.company}</span>
            <span className="xlab-ledger__role">{stop.role}</span>
          </li>
        ))}
      </ol>

      <p className="xlab-ledger__proof">
        {FIGURES.map((f, i) => (
          <span key={f.id}>
            {i > 0 && <span className="xlab-dot" aria-hidden="true" />}
            {f.inline}
          </span>
        ))}
      </p>

      <Rule />

      <p className="xlab-ledger__edu">
        <span className="xlab-ledger__degree">{asu.program}</span>
        <span className="xlab-ledger__school">{asu.school}</span>
      </p>

      <ConceptActions />
    </div>
  );
}
