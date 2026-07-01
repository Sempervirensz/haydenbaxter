"use client";

// WorldPulse hero card — layout + interaction lab.
//
// Tests three placements for the headline + the hover-reveal "Explore WorldPulse"
// panel over the cinematic beach photo, all sharing ONE fixed interaction model:
//
//   - The trigger button and the expanded glass panel live in one .wpl-info group.
//   - The panel is a DOM child of that group and carries an invisible ::before
//     "bridge" that spans the gap to the trigger, so pointer travel from button to
//     panel never leaves the group  → the panel no longer vanishes mid-reach and
//     the WorldPulse link is always clickable.
//   - Reveal is driven by :hover, :focus-within (keyboard), and an is-open state
//     toggled on click/tap (touch + preview).
//
// Options only move WHERE the headline + trigger sit; the interaction is identical.
//
//   A — Headline lower-left, tucked into the corner clear of the phone; trigger
//       bottom-right, panel opens up + inward.
//   B — Headline upper-left in the clean sky band; trigger mid-right, panel opens
//       sideways (inward / leftward).
//   C — Balanced safe zones: slim headline upper-left, trigger bottom-right with a
//       roomy panel opening straight up. Headline + button never share a row.

import { useRef, useState } from "react";
import { WORK_SCREENS } from "@/data/work";
import "./worldpulse-hero-lab.css";

type Option = "a" | "b" | "c";

const OPTIONS: { id: Option; label: string; blurb: string }[] = [
  { id: "a", label: "A · Lower-left refined", blurb: "Headline tucked into the bottom-left corner, clear of the phone. Trigger bottom-right, panel opens up + inward." },
  { id: "b", label: "B · Right-side, opens inward", blurb: "Headline in the clean upper-left sky band. Trigger on the right edge, panel slides inward (leftward)." },
  { id: "c", label: "C · Balanced safe zones", blurb: "Slim headline upper-left, roomy trigger + panel bottom-right. Headline and button never share a row." },
];

const BUTTON_COPY = "Explore WorldPulse";

function useWorldPulse() {
  const wp = WORK_SCREENS.find((s) => s.type === "full");
  return wp && wp.type === "full" ? wp.full : null;
}

export default function WorldPulseHeroLab() {
  const [option, setOption] = useState<Option>("a");
  const [open, setOpen] = useState(false);
  const full = useWorldPulse();
  const active = OPTIONS.find((o) => o.id === option)!;

  // Hover-intent: opening is instant, closing is deferred ~140ms so the panel
  // never vanishes while the pointer crosses the gap toward the panel / link.
  // Re-entering the group cancels the pending close.
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const cancelClose = () => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  };
  const openNow = () => {
    cancelClose();
    setOpen(true);
  };
  const closeSoon = () => {
    cancelClose();
    closeTimer.current = setTimeout(() => setOpen(false), 140);
  };

  return (
    <div className="wpl-page">
      <header className="wpl-bar">
        <div className="wpl-bar__title">
          <span className="wpl-bar__kicker">Lab</span>
          <h1>WorldPulse hero — layout &amp; interaction</h1>
        </div>
        <div className="wpl-bar__toggle" role="tablist" aria-label="Layout option">
          {OPTIONS.map((o) => (
            <button
              key={o.id}
              role="tab"
              aria-selected={option === o.id}
              className={`wpl-tab ${option === o.id ? "is-active" : ""}`}
              onClick={() => {
                setOption(o.id);
                setOpen(false);
              }}
            >
              {o.label}
            </button>
          ))}
        </div>
      </header>

      <p className="wpl-blurb">{active.blurb}</p>

      <div className="wpl-stage">
        <article className={`wpl-card wpl-card--${option}`}>
          <div
            className="wpl-heroImg"
            style={{ backgroundImage: 'url("/WorldPulseCostal3.0.png")' }}
          />
          <div className="wpl-scrim" aria-hidden="true" />

          {/* Header label, mirrors the production cinematic card */}
          <header className="wpl-head">
            <span className="wpl-num">01 — WorldPulse</span>
            <span className="wpl-line" />
          </header>

          {/* Headline — placement varies by option */}
          <p className="wpl-caption">Digital product passports, made human.</p>

          {/* Trigger + expandable glass panel — placement varies, interaction fixed */}
          <div
            className={`wpl-info ${open ? "is-open" : ""}`}
            onMouseEnter={openNow}
            onMouseLeave={closeSoon}
            onFocus={openNow}
            onBlur={closeSoon}
          >
            <button
              type="button"
              className="wpl-trigger"
              aria-expanded={open}
              onClick={() => (open ? setOpen(false) : openNow())}
            >
              {BUTTON_COPY} <span aria-hidden="true">▸</span>
            </button>

            {/* Invisible hover bridge — spans the gap between trigger and panel so
                pointer travel never leaves the group and the panel can't vanish
                mid-reach. Kept as a real element (not a ::before) so the panel's
                overflow:auto doesn't clip it. */}
            <span className="wpl-bridge" aria-hidden="true" />

            <div className="wpl-panel" role="group" aria-label="WorldPulse details">
              <span className="wpl-panel__sheen" aria-hidden="true" />
              <span className="wpl-panel__label">WorldPulse · Founder</span>
              {full?.caption.map((para, i) => (
                <p key={i} className="wpl-panel__text">{para}</p>
              ))}
              {full && (
                <a
                  className="wpl-panel__link"
                  href={full.link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {full.link.label}
                  <span className="wpl-panel__linkArrow" aria-hidden="true">→</span>
                </a>
              )}
            </div>
          </div>
        </article>
      </div>
    </div>
  );
}
