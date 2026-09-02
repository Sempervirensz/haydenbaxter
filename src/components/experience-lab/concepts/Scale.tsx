"use client";

// 04 — SCALE. Oversized numbers, employers as the footnote.
//
// What the shipped section does today, measured: the M.S. chip wraps to three
// lines and becomes the largest object on the sheet, while NIKE is a chip the
// size of a word. The least decisive credential carries the most weight and the
// most decisive one carries almost none.
//
// This inverts it. Three figures at display scale — and the third figure is a
// language rather than a number, which is the move: it makes Mandarin a
// quantity of difference instead of a line item. The employers drop to a mono
// footnote, where they are still doing their job because the visitor has
// already met all three in the brands marquee at the top of the page.
//
// Both schools sit in that footnote with them. Neither is set as a degree
// abbreviation beyond what the source gives — Arizona State carries the M.S.,
// Utah State is named by its programme — because inventing degree letters is
// exactly the kind of résumé filler this direction exists to strip out.

import { CAREER, EDUCATION, FIGURES } from "@/data/experienceLab";
import { ConceptActions, Rule } from "./parts";

export default function Scale() {
  return (
    <div className="xlab xlab--scale">
      <dl className="xlab-scale__figs">
        {FIGURES.map((f) => (
          <div key={f.id} className="xlab-scale__fig" data-fig={f.id}>
            <dt className="xlab-scale__num" lang={f.id === "language" ? "zh" : undefined}>
              {f.figure}
            </dt>
            <dd className="xlab-scale__cap">{f.caption}</dd>
          </div>
        ))}
      </dl>

      <Rule />

      {/* The footnote is ONE block, not three siblings. Both schools are named
          here now, and three lines spaced by the concept's 12px stack gap read
          as a list of unrelated facts; held together at 4px they read as the
          single citation the figures rest on. It also buys back most of the
          height the second school costs. */}
      <div className="xlab-scale__notes">
        <p className="xlab-scale__foot">
          {CAREER.map((s, i) => (
            <span key={s.id}>
              {i > 0 && <span className="xlab-dot" aria-hidden="true" />}
              {s.company}
            </span>
          ))}
        </p>
        {EDUCATION.map((e) => (
          <p key={e.id} className="xlab-scale__foot xlab-scale__foot--edu">
            {e.programShort}
            <span className="xlab-dot" aria-hidden="true" />
            {e.schoolShort}
          </p>
        ))}
      </div>

      <ConceptActions />
    </div>
  );
}
