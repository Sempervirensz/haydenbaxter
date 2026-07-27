"use client";

// Concept A — "Dossier". Restrained, production-safe.
//
// The ultra-wide hero (3168×1344) is given its OWN window rather than the whole
// card. A shorter window means a wider slice of the photo survives the crop, so
// the phone AND her face both stay in frame instead of the ~21% vertical band a
// full-bleed portrait crop leaves. Everything else stacks underneath on solid
// dark, so no text is ever over the subject.
//
// The window is `flex: 1` with a floor: on a tall phone it grows toward 4:5, on
// a 568px-tall phone it shrinks and simply shows more of the coastline. Opening
// the story shrinks it further — a deliberate, legible trade rather than a
// scroll.

import { useId, useState } from "react";
import type { WorldPulseContent } from "@/data/worldpulseMobileLab";

export default function ConceptDossier({ c }: { c: WorldPulseContent }) {
  const [open, setOpen] = useState(false);
  const storyId = useId();
  const [lede, ...rest] = c.paragraphs;

  return (
    <article className="wpc wpc-a" aria-labelledby={`${storyId}-h`}>
      <header className="wpc-a__rail">
        <span className="wpc__num">
          {c.number} — {c.name}
        </span>
        <span className="wpc__line" aria-hidden="true" />
      </header>

      <div className="wpc-a__media">
        <img className="wpc-a__img" src={c.image} alt={c.imageAlt} />
        <span className="wpc-a__mediaEdge" aria-hidden="true" />
      </div>

      <div className="wpc-a__body">
        <span className="wpc__label">{c.label}</span>
        <h2 className="wpc__headline" id={`${storyId}-h`}>
          {c.tagline}
        </h2>

        <p className="wpc__para">{lede}</p>

        {rest.length > 0 && (
          <>
            <div
              className={`wpc-a__more ${open ? "is-open" : ""}`}
              id={storyId}
              role="region"
              aria-label="More about WorldPulse"
            >
              <div className="wpc-a__moreInner">
                {rest.map((p, i) => (
                  <p key={i} className="wpc__para">
                    {p}
                  </p>
                ))}
              </div>
            </div>

            <button
              type="button"
              className="wpc-a__disclose"
              aria-expanded={open}
              aria-controls={storyId}
              onClick={() => setOpen((o) => !o)}
            >
              {open ? "Less" : "Read the full story"}
              <span className="wpc-a__discloseIcon" aria-hidden="true">
                {open ? "−" : "+"}
              </span>
            </button>
          </>
        )}

        <a
          className="wpc__cta"
          href={c.link.href}
          target="_blank"
          rel="noopener noreferrer"
        >
          {c.link.label}
          <span className="wpc__ctaArrow" aria-hidden="true">
            →
          </span>
        </a>
      </div>
    </article>
  );
}
