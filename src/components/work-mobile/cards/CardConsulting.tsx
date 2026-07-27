"use client";

// 04 — Consulting. "The Invitation".
//
// The one card that inverts the system's layout rule, on purpose. Cards 01–03
// put their text in the top band because their imagery fills the frame. This one
// puts it at the BOTTOM, because mobile-statue.webp was shot for portrait
// (900×2000, within 3% of the card's own aspect, so almost no crop) and its
// lower half is still water with nothing in it.
//
// That inversion is doing work: it is the signal that the sequence has changed
// mode. Three cards showed what was built and operated; this one asks for a
// conversation. It is also the only card whose primary action leaves the
// portfolio — the booking link rather than a project.

import { useId, useRef, useState } from "react";
import ChapterRail from "../ChapterRail";
import MobileSheet from "../MobileSheet";
import { chapterOf, consultingContent } from "@/data/workMobileSystem";

const C = consultingContent();
const CH = chapterOf(4);

export default function CardConsulting() {
  const [openId, setOpenId] = useState<string | null>(null);
  const sheetId = useId();
  const chipRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const activeRef = useRef<HTMLElement | null>(null);
  if (openId) activeRef.current = chipRefs.current[openId] ?? null;

  const active = C.offers.find((o) => o.id === openId);

  return (
    <article className={`mws-card mws-card--cns ${openId ? "is-open" : ""}`}>
      <div className="mws-card__media" data-mws-drift>
        <img className="mws-cns__img" src={C.image} alt={C.imageAlt} />
      </div>
      <span className="mws-cns__scrim" aria-hidden="true" />

      <ChapterRail ordinal={CH.ordinal} name={CH.name} />

      <div className="mws-cns__body">
        <span className="mws-label">{C.eyebrow}</span>
        <h2 className="mws-headline">{C.heroTitle}</h2>
        <p className="mws-cns__sub">{C.heroSubtitle}</p>

        <div className="mws-cns__offers">
          {C.offers.map((o) => (
            <button
              key={o.id}
              type="button"
              className="mws-cns__offer"
              ref={(el) => {
                chipRefs.current[o.id] = el;
              }}
              aria-expanded={openId === o.id}
              aria-controls={sheetId}
              onClick={() => setOpenId(o.id)}
            >
              <span className="mws-cns__offerName">{o.title}</span>
              <span className="mws-cns__offerArrow" aria-hidden="true">→</span>
            </button>
          ))}
        </div>

        <a
          className="mws-cta mws-cns__book"
          href={C.bookingUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          Book a 30-minute call
          <span className="mws-cta__arrow" aria-hidden="true">→</span>
        </a>
      </div>

      <MobileSheet
        open={!!openId}
        onClose={() => setOpenId(null)}
        label={active ? `${active.title} details` : "Offer details"}
        triggerRef={activeRef}
        id={sheetId}
        height="62cqh"
      >
        {active && (
          <>
            <span className="mws-label">{active.status}</span>
            <h3 className="mws-cns__sheetTitle">{active.title}</h3>
            <p className="mws-para">{active.oneLiner}</p>

            <span className="mws-cns__subhead">What you get</span>
            <ul className="mws-cns__list">
              {active.deliverables.map((d) => (
                <li key={d}>{d}</li>
              ))}
            </ul>

            <span className="mws-cns__subhead">Best for</span>
            <p className="mws-para">{active.bestFor}</p>

            <a
              className="mws-cta"
              href={C.bookingUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              Book a 30-minute call
              <span className="mws-cta__arrow" aria-hidden="true">→</span>
            </a>
          </>
        )}
      </MobileSheet>
    </article>
  );
}
