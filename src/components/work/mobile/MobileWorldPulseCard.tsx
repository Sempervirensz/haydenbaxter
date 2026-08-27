"use client";

// 01 — WorldPulse · approved mobile design: Option B, "Smoother Flow".
//
// Full-bleed coastal photo, mono rail, serif headline — the desktop card's
// layer order, adapted to portrait. Smoother Flow's two decisions:
//   • the founder lede sits ON the card at rest (not gated behind the trigger)
//   • the primary CTA to worldxpulse.com is always present
// so a visitor understands WorldPulse and can act without opening anything. The
// frosted glass dossier (the desktop's own material) still holds the full story.
//
// Static by design — no scroll motion in this concept.

import { useRef, useState } from "react";
import { WORK_SCREENS } from "@/data/work";
import { Rail, Scrim, useEscape, useFocusReturn } from "./shared";

const SCREEN = WORK_SCREENS.find((s) => s.type === "full");
if (!SCREEN || SCREEN.type !== "full") throw new Error("WorldPulse screen missing");
const WP = SCREEN.full;
const LOGO = SCREEN.logo;

/** Mobile-only asset override.
 *
 *  WORK_SCREENS points `background` at WorldPulseCostal3.0.PNG — 6.45 MB. A
 *  byte-identical WebP of the same photo is committed alongside it at 85 KB
 *  (~75× smaller). Full-bleed on the first Work card, over cellular, the PNG is
 *  a multi-second blank card, so mobile serves the WebP.
 *
 *  Overridden HERE rather than in src/data/work.ts on purpose: that field also
 *  feeds the desktop cinematic card, and desktop is out of scope for this
 *  batch. Swapping it at the source would fix desktop too and is worth doing —
 *  as its own change, with desktop re-verified. */
const HERO_IMG = "/WorldPulseCostal3.0.webp";
/** The tagline the approved desktop cinematic card ships. */
const TAGLINE = "Digital product passports, made human.";
const IMG_ALT =
  "A woman on a rocky coastline holding a phone showing a WorldPulse digital product passport for a wool cable turtleneck.";

export default function MobileWorldPulseCard() {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);

  const close = () => setOpen(false);
  useEscape(open, close);
  useFocusReturn(open, triggerRef, panelRef);

  const [lede, ...rest] = WP.caption;

  return (
    <article className={`wm-card wm-card--wp ${open ? "is-open" : ""}`}>
      <div className="wm-wp__media">
        <img className="wm-wp__img" src={HERO_IMG} alt={IMG_ALT} loading="lazy" decoding="async" />
      </div>
      <span className="wm-wp__scrim" aria-hidden="true" />

      <Rail id={1} />

      <h2 className="wm-headline wm-wp__headline">{TAGLINE}</h2>

      {/* Smoother Flow: lede on the card at rest. */}
      <p className="wm-wp__lede">{lede}</p>

      <Scrim onClose={close} />

      <div className="wm-foot">
        <div className="wm-wp__footStack">
          <a
            className="wm-cta"
            href={WP.link.href}
            target="_blank"
            rel="noopener noreferrer"
          >
            {WP.link.label}
            <span aria-hidden="true">→</span>
          </a>
          <button
            type="button"
            ref={triggerRef}
            className="wm-trigger"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            The full story
            <span className="wm-trigger__icon" aria-hidden="true">▸</span>
          </button>
        </div>
      </div>

      <div
        className="wm-glass wm-glass--dark"
        ref={panelRef}
        role="group"
        aria-label="WorldPulse details"
        tabIndex={-1}
        inert={!open}
      >
        <span className="wm-glass__sheen" aria-hidden="true" />
        <button
          type="button"
          className="wm-glass__close"
          onClick={close}
          aria-label="Close WorldPulse details"
        >
          ×
        </button>
        <img
          className="wm-wp__logo"
          src={LOGO?.src ?? ""}
          alt={LOGO?.alt ?? "WorldPulse"}
          width={4166}
          height={2000} loading="lazy" decoding="async" />
        <span className="wm-label">WorldPulse · Founder</span>
        {/* The card already carries the lede, so the panel holds the rest. */}
        {rest.map((p, i) => (
          <p key={i} className="wm-para">{p}</p>
        ))}
        <a
          className="wm-cta"
          href={WP.link.href}
          target="_blank"
          rel="noopener noreferrer"
        >
          {WP.link.label}
          <span aria-hidden="true">→</span>
        </a>
      </div>
    </article>
  );
}
