"use client";

// 01 — WorldPulse. The approved Passport Sheet, carried over intact.
//
// The geometry is unchanged from the mobile lab and is not up for casual
// revision: the hero is 2.36:1, a portrait crop keeps ~19.6% of its width, 38%
// is the one anchor holding both the phone and her face, and a bottom-anchored
// headline would need the image scaled ~1.75× (which crops the subject away).
// Hence: all resting text in the top band, one CTA at the base over her hand.
//
// The only changes for the sequence are systemic, not compositional — it now
// uses the shared MobileSheet and the shared rail.

import { useId, useRef, useState } from "react";
import ChapterRail from "../ChapterRail";
import MobileSheet from "../MobileSheet";
import { chapterOf, worldPulseContent } from "@/data/workMobileSystem";

const C = worldPulseContent();
const CH = chapterOf(1);

export default function CardWorldPulse() {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const sheetId = useId();

  return (
    <article className={`mws-card mws-card--wp ${open ? "is-open" : ""}`}>
      <div className="mws-card__media" data-mws-drift>
        <img className="mws-wp__img" src={C.image} alt={C.imageAlt} />
      </div>
      <span className="mws-wp__scrimTop" aria-hidden="true" />
      <span className="mws-wp__scrimBottom" aria-hidden="true" />

      <ChapterRail ordinal={CH.ordinal} name={CH.name} />

      <h2 className="mws-headline mws-wp__headline">{CH.tagline}</h2>

      <div className="mws-foot">
        <button
          type="button"
          ref={triggerRef}
          className="mws-trigger"
          aria-expanded={open}
          aria-controls={sheetId}
          onClick={() => setOpen(true)}
        >
          Explore WorldPulse
          <span className="mws-trigger__icon" aria-hidden="true">▸</span>
        </button>
      </div>

      <MobileSheet
        open={open}
        onClose={() => setOpen(false)}
        label="WorldPulse details"
        triggerRef={triggerRef}
        id={sheetId}
        height="48cqh"
      >
        <img
          className="mws-logo"
          src={C.logo?.src ?? ""}
          alt={C.logo?.alt ?? "WorldPulse"}
          width={4166}
          height={2000}
        />
        <span className="mws-label">{C.label}</span>
        {C.paragraphs.map((p, i) => (
          <p key={i} className="mws-para">{p}</p>
        ))}
        <a
          className="mws-cta"
          href={C.link.href}
          target="_blank"
          rel="noopener noreferrer"
        >
          {C.link.label}
          <span className="mws-cta__arrow" aria-hidden="true">→</span>
        </a>
      </MobileSheet>
    </article>
  );
}
