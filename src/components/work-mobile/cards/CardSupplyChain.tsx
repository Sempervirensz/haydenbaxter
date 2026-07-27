"use client";

// 03 — Supply Chain. "The Crossing".
//
// Two deliberate omissions:
//
//   1. No WebGL globe. A three.js canvas for one decorative sphere is the
//      heaviest thing that could go in this sequence, and it buys nothing a
//      phone-sized card can show.
//   2. No markers plotted on the map. The asset is Pacific-centred and the four
//      stops don't fit it — New York lands at the right edge and SE Asia below
//      the bottom, so projected dots would read as a bug. The map earns its
//      place as a darkened backdrop instead, because the story genuinely is a
//      crossing.
//
// What carries the meaning: the production hero's own credential lines, set in
// the same four type styles it uses, over a dated journey rail. Proof goes in
// the shared sheet, where the three tabs have room.

import { useId, useRef, useState } from "react";
import ChapterRail from "../ChapterRail";
import MobileSheet from "../MobileSheet";
import { chapterOf, supplyChainContent } from "@/data/workMobileSystem";
import { JOURNEY_STOPS } from "@/data/scLab";

const C = supplyChainContent();
const CH = chapterOf(3);

/** Maps the production quoteLines' style names onto the mobile type scale. */
const STYLE_CLASS: Record<string, string> = {
  "serif-heavy": "mws-sc__lineSerif",
  "mono-caps": "mws-sc__lineMono",
  "sans-light": "mws-sc__lineSans",
  "serif-italic": "mws-sc__lineItalic",
};

export default function CardSupplyChain() {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState(0);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const sheetId = useId();
  const tabs = C.proof.tabs;

  return (
    <article className={`mws-card mws-card--sc ${open ? "is-open" : ""}`}>
      <span className="mws-sc__wash" aria-hidden="true" />

      <ChapterRail ordinal={CH.ordinal} name={CH.name} tone="onPanel" />

      <div className="mws-sc__body">
        <h2 className="mws-headline">{CH.tagline}</h2>

        {/* The crossing itself. Landscape band, not a full-bleed plane: a
            portrait crop of a 2.36:1 Pacific map keeps ~20% of its width and
            shows open ocean, which is not geography. At band proportions Asia
            and North America are both in frame, which is the whole point. */}
        <div className="mws-band mws-sc__band">
          <img src={C.map} alt="" aria-hidden="true" />
          <span className="mws-band__fade" aria-hidden="true" />
        </div>

        <div className="mws-sc__lines">
          {C.quoteLines.map((l, i) => (
            <p key={i} className={STYLE_CLASS[l.style] ?? "mws-sc__lineSans"}>
              {l.text}
            </p>
          ))}
        </div>

        {/* Dated journey rail — the geographic framing, without fragile map
            projection. Presentational: the sheet holds the real content. */}
        <ol className="mws-sc__journey" aria-label="Career journey">
          {JOURNEY_STOPS.map((s) => (
            <li key={s.id} className="mws-sc__stop">
              <span className="mws-sc__stopDot" aria-hidden="true" />
              <span className="mws-sc__stopYear">{s.year}</span>
              <span className="mws-sc__stopPlace">{s.label}</span>
            </li>
          ))}
        </ol>
      </div>

      <div className="mws-foot">
        <button
          type="button"
          ref={triggerRef}
          className="mws-trigger"
          aria-expanded={open}
          aria-controls={sheetId}
          onClick={() => setOpen(true)}
        >
          {C.proof.promptLabel}
          <span className="mws-trigger__icon" aria-hidden="true">▸</span>
        </button>
      </div>

      <MobileSheet
        open={open}
        onClose={() => setOpen(false)}
        label="Operating proof"
        triggerRef={triggerRef}
        id={sheetId}
        height="62cqh"
      >
        <span className="mws-label">{C.featured.badge}</span>
        <h3 className="mws-sc__sheetTitle">{C.featured.title}</h3>

        <div className="mws-sc__tabs" role="tablist" aria-label="Proof area">
          {tabs.map((t, i) => (
            <button
              key={t.id}
              type="button"
              role="tab"
              aria-selected={tab === i}
              className={`mws-sc__tab ${tab === i ? "is-on" : ""}`}
              onClick={() => setTab(i)}
            >
              {t.label}
            </button>
          ))}
        </div>

        <ul className="mws-sc__bullets">
          {tabs[tab]?.bullets.map((b, i) => (
            <li key={i}>{b}</li>
          ))}
        </ul>

        <div className="mws-sc__tags">
          {tabs[tab]?.tags.map((t) => (
            <span key={t} className="mws-sc__tag">{t}</span>
          ))}
        </div>

        <p className="mws-note">{C.bridgeLine}</p>
      </MobileSheet>
    </article>
  );
}
