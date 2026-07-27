"use client";

// 02 — Emerging Tech Builds. "The Shelf".
//
// The desktop card is the deployed candy-bar gallery: filters, sorts, a
// slide-in dossier. None of that belongs in a phone-sized card. The move here is
// to make the RESTING STATE the evidence — four builds as rows carrying their
// real product screenshots, so a visitor sees working software before tapping
// anything. Tapping a row raises the shared sheet with that project's own hook
// and description, then hands off to its existing detail page.
//
// No horizontal scroller, no filters, no sort. One vertical list, one tap.

import { useId, useRef, useState } from "react";
import ChapterRail from "../ChapterRail";
import MobileSheet from "../MobileSheet";
import { chapterOf, etbContent } from "@/data/workMobileSystem";

const C = etbContent();
const CH = chapterOf(2);

export default function CardEmergingTech() {
  const [openId, setOpenId] = useState<string | null>(null);
  const sheetId = useId();
  // One ref per row, so closing returns focus to the row that was tapped.
  const rowRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const activeRef = useRef<HTMLElement | null>(null);
  if (openId) activeRef.current = rowRefs.current[openId] ?? null;

  const active = C.shelf.find((s) => s.project.id === openId);

  return (
    <article className={`mws-card mws-card--etb ${openId ? "is-open" : ""}`}>
      <span className="mws-etb__wash" aria-hidden="true" />

      <ChapterRail ordinal={CH.ordinal} name={CH.name} tone="onPanel" />

      <div className="mws-etb__body">
        <h2 className="mws-headline">{CH.tagline}</h2>
        <p className="mws-etb__cred">{C.credibilityLine}</p>

        {/* Evidence band. A real dashboard, bled to the card edges, sized by
            flex so it absorbs whatever height the card has left instead of
            leaving a dead zone. This is the card saying "working software"
            before the visitor taps anything. */}
        {C.hero && (
          <div className="mws-band mws-etb__band">
            <img src={C.hero.src} alt={C.hero.alt} />
            <span className="mws-band__fade" aria-hidden="true" />
          </div>
        )}

        <ul className="mws-etb__shelf">
          {C.shelf.map(({ project, thumb, thumbKind }) => (
            <li key={project.id}>
              <button
                type="button"
                className="mws-etb__row"
                ref={(el) => {
                  rowRefs.current[project.id] = el;
                }}
                aria-expanded={openId === project.id}
                aria-controls={sheetId}
                onClick={() => setOpenId(project.id)}
              >
                <span className={`mws-etb__thumb mws-etb__thumb--${thumbKind}`}>
                  {thumb ? <img src={thumb} alt="" aria-hidden="true" /> : null}
                </span>
                <span className="mws-etb__rowText">
                  <span className="mws-etb__rowName">{project.name}</span>
                  <span className="mws-etb__rowMeta">{project.category}</span>
                </span>
                <span
                  className={`mws-etb__chip ${
                    project.comingSoon ? "is-concept" : "is-build"
                  }`}
                >
                  {project.comingSoon ? "Concept" : "Build"}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      <MobileSheet
        open={!!openId}
        onClose={() => setOpenId(null)}
        label={active ? `${active.project.name} details` : "Project details"}
        triggerRef={activeRef}
        id={sheetId}
        height="58cqh"
      >
        {active && (
          <>
            {active.project.mark && (
              <img
                className="mws-etb__mark"
                src={active.project.mark.src}
                alt=""
                aria-hidden="true"
                width={active.project.mark.width}
                height={active.project.mark.height}
              />
            )}
            <span className="mws-label">
              {active.project.panel?.meta ?? active.project.category} ·{" "}
              {active.project.status}
            </span>
            <h3 className="mws-etb__sheetName">{active.project.name}</h3>
            <p className="mws-etb__hook">
              {active.project.panel?.hook ?? active.project.oneLiner}
            </p>
            <p className="mws-para">
              {active.project.panel?.description ?? active.project.oneLiner}
            </p>
            {active.href ? (
              <a className="mws-cta" href={active.href}>
                {active.project.panel?.cta ?? `Explore ${active.project.name}`}
                <span className="mws-cta__arrow" aria-hidden="true">→</span>
              </a>
            ) : (
              <p className="mws-note">
                {active.project.detailFooter ?? "Coming soon."} Concept-stage —
                no detail page yet.
              </p>
            )}
          </>
        )}
      </MobileSheet>
    </article>
  );
}
