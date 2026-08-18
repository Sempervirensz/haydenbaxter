"use client";

// The choice row, travelling with you.
//
// On the homepage this row lives at the end of the Work chapter and links out.
// Here it is the SAME row, carried onto the offer page and pinned to the top of
// the plate, with the bar you pressed filled cobalt. That is what makes the
// offer read as the chapter expanding rather than as a different document:
// the thing you pressed is still on screen, still lit, and the answer has
// unfurled beneath it.
//
// It also replaces the bespoke back bar. Switching offers is SIDEWAYS movement
// along a row that is already there — no reversing out, no "also worth a look"
// footer restating the same three choices at the bottom of every page.
//
// BORROWED, NOT SHARED. Every value here is copied from `.wt__row` in
// `work-together.css` — the near-white plate, the 14px radius, the white inset
// over a deep drop shadow, mono uppercase at `--track-dymo`, the '›', the
// 105deg sheen, and Cobalt Select. It is deliberately NOT an import of that
// file: the homepage shipped today and nothing in a lab should be able to
// reach into it. If the row ever changes for real, these two move together on
// purpose, not by accident.

import { PATHS, type PathId } from "@/data/workTogether";
import "./offer-expanded.css";

interface Props {
  /** The offer whose page this is. Its bar carries the fill and does not link. */
  current: PathId;
  /** Query string carried across, so switching offers keeps the treatment. */
  qs?: string;
}

export default function OfferChoiceRow({ current, qs = "" }: Props) {
  return (
    <ul className="ofx__rows">
      {PATHS.map((p, i) => {
        const isCurrent = p.id === current;

        const inner = (
          <>
            <span className="ofx__rowMain">
              <span className="ofx__label">{p.label}</span>
              <span className="ofx__lede">{p.lede}</span>
            </span>
            <span className="ofx__chev" aria-hidden="true">
              ›
            </span>
            <span className="ofx__rowSheen" aria-hidden="true" />
          </>
        );

        return (
          <li
            key={p.id}
            className="ofx__rowItem"
            style={{ "--row-index": i } as React.CSSProperties}
          >
            {isCurrent ? (
              // The current offer is NOT a link. Navigating to the page you are
              // already on is a dead control, and `aria-current="page"` says
              // what the cobalt fill says visually — that blue means "this one,
              // right now", which is exactly what it means on the homepage.
              <span className="ofx__row is-current" aria-current="page">
                {inner}
              </span>
            ) : (
              <a className="ofx__row" href={`/offer-lab/${p.id}${qs}`}>
                {inner}
              </a>
            )}
          </li>
        );
      })}
    </ul>
  );
}
