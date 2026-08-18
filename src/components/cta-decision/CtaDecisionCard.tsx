"use client";

// The decision interface as CHAPTER 04 of the Work section, not as a page.
//
// WHY THIS IS A SUBSET AND NOT THE WHOLE THING:
//
// The Consulting card is 1424x810 at a 1440px viewport, with `overflow: hidden`
// and a fixed height. Identity plus three tracks plus a content panel needs
// roughly 790px of that 810 with no margin, and Consulting's panel carries two
// capability blocks. Putting the full page in here reproduces exactly what
// DECISION.md settled: page-shaped content inside a fixed-height card, which
// bought nested scrolling and a 22px blur last time.
//
// So the card keeps the job it already has — CHOOSING — and hands the content
// to the routed offer pages, which exist and are built for it. What changes is
// the vocabulary of the chooser: the CD and a tracklist instead of a row of
// candy bars.
//
// That also closes a loop. The Work section OPENS on the CD in WorkLanding and
// now closes on it, so the same object introduces the body of work and then
// asks which part of it you want. The statue photograph is not competing here;
// it belongs to the offer pages, where it is the hero and the close.
//
// The tracks are real links, so middle-click, open-in-new-tab, copy-address and
// the back button all work — the thing DECISION.md called out as the reason the
// offers became routes in the first place.

import { useState } from "react";
import { DISC_SRC, IDENTITY, PATHS, type PathKey } from "@/data/ctaDecision";
import "./cta-decision.css";
import "./cta-decision-card.css";

interface Props {
  /** Where each track goes. Supplied by the host so the lab can steer it. */
  offerHref: (id: PathKey) => string;
  /** The photo plane, when the host wants the card to keep its plate. */
  media?: React.ReactNode;
}

export default function CtaDecisionCard({ offerHref, media }: Props) {
  // Which track the CD is currently showing. Hover and focus both drive it, so
  // the disc previews the choice before it is made — the label is the payoff
  // for pointing at something, which a keyboard user gets too.
  const [preview, setPreview] = useState<PathKey>(PATHS[0].id);
  const shown = PATHS.find((p) => p.id === preview) ?? PATHS[0];

  return (
    <div className="cdc">
      {media && <div className="cdc__media">{media}</div>}
      <span className="cdc__scrim" aria-hidden="true" />
      <span className="cdc__grain" aria-hidden="true" />

      <div className="cdc__inner">
        <div className="cdc__copy">
          <p className="cdc__name">{IDENTITY.name}</p>
          <h2 className="cdc__statement">{IDENTITY.statement}</h2>

          <p className="cdc__hint">{IDENTITY.tracksLabel}</p>

          <ul className="cdc__tracks">
            {PATHS.map((p, i) => (
              <li
                key={p.id}
                className="cdc__trackItem"
                style={{ "--row-index": i } as React.CSSProperties}
              >
                <a
                  className={`cdc__track ${preview === p.id ? "is-previewing" : ""}`}
                  href={offerHref(p.id)}
                  onMouseEnter={() => setPreview(p.id)}
                  onFocus={() => setPreview(p.id)}
                >
                  <span className="cdc__trackNum" aria-hidden="true">
                    {p.index}
                  </span>
                  <span className="cdc__trackMain">
                    <span className="cdc__trackLabel">{p.label}</span>
                    <span className="cdc__trackHint">{p.hint}</span>
                  </span>
                  <span className="cdc__chev" aria-hidden="true">
                    ›
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="cdc__discWrap" aria-hidden="true">
          <div
            className="cdc__disc"
            style={{ "--disc-angle": `${shown.discAngle}deg` } as React.CSSProperties}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="cdc__discImg" src={DISC_SRC} alt="" />
            <span className="cdc__discSheen" />
            <span className="cdc__discHole" />
          </div>

          {/* Keyed so the handwriting rewrites on every change rather than
              cross-fading in place, which reads as a label being swapped. */}
          <p className="cdc__discLabel" key={shown.id}>
            {shown.discLabel}
          </p>
        </div>
      </div>
    </div>
  );
}
