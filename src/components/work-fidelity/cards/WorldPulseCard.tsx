"use client";

// 01 — WorldPulse, three fidelity variations.
//
// All three keep the desktop card's layer order: photo → scrim → rail →
// headline → control → frosted glass dossier. The desktop panel floats beside
// the headline because a 16:9 frame has room beside it; a portrait frame does
// not, so the panel anchors to the bottom edge. That is the only structural
// concession, and it is forced by the viewport rather than chosen.
//
//   A  Production Faithful — the adaptation, nothing more.
//   B  Smoother Flow       — lede on the card, CTA never gated.
//   C  Cinematic Parallax  — A plus three-plane drift.

import { useRef, useState } from "react";
import { WORK_SCREENS } from "@/data/work";
import { Rail, Scrim, useEscape, useFocusReturn } from "../parts";
import { useLayeredDrift } from "../useLayeredDrift";
import type { VariantKey } from "@/data/workMobileVariants";

const SCREEN = WORK_SCREENS.find((s) => s.type === "full");
if (!SCREEN || SCREEN.type !== "full") throw new Error("WorldPulse screen missing");
const WP = SCREEN.full;
const LOGO = SCREEN.logo;
/** The tagline the approved desktop cinematic card ships. */
const TAGLINE = "Digital product passports, made human.";
const IMG_ALT =
  "A woman on a rocky coastline holding a phone showing a WorldPulse digital product passport for a wool cable turtleneck.";

export default function WorldPulseCard({
  variant,
  scrollRootRef,
  motion = true,
}: {
  variant: VariantKey;
  scrollRootRef: React.RefObject<HTMLElement | null>;
  motion?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLElement | null>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);

  const motionRef = useRef(motion);
  motionRef.current = motion;
  // Only variation C mounts the drift. A and B are static by design.
  useLayeredDrift(
    variant === "c" ? rootRef : { current: null },
    scrollRootRef,
    () => motionRef.current
  );

  const close = () => setOpen(false);
  useEscape(open, close);
  useFocusReturn(open, triggerRef, panelRef);

  const [lede, ...rest] = WP.caption;
  // B shows the lede on the card, so the panel carries only what is left.
  const panelParas = variant === "b" ? rest : WP.caption;

  return (
    <article
      ref={rootRef as React.RefObject<HTMLElement>}
      className={`wf-card wf-card--wp ${open ? "is-open" : ""}`}
    >
      <div className="wf-wp__media">
        <img className="wf-wp__img" src={WP.background ?? ""} alt={IMG_ALT} />
      </div>
      <span className="wf-wp__scrim" aria-hidden="true" />

      <Rail id={1} />

      <h2 className="wf-headline wf-wp__headline">{TAGLINE}</h2>

      {variant === "b" && <p className="wf-wp__lede">{lede}</p>}

      <Scrim onClose={close} />

      <div className="wf-foot">
        <div className="wf-wp__footStack">
          {/* B keeps the primary action present at rest — the desktop card's
              link lives inside the panel, but on a phone that is one tap of
              friction in front of the only conversion on the card. */}
          {variant === "b" && (
            <a
              className="wf-cta"
              href={WP.link.href}
              target="_blank"
              rel="noopener noreferrer"
            >
              {WP.link.label}
              <span aria-hidden="true">→</span>
            </a>
          )}
          <button
            type="button"
            ref={triggerRef}
            className="wf-trigger"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            {variant === "b" ? "The full story" : "Explore WorldPulse"}
            <span className="wf-trigger__icon" aria-hidden="true">▸</span>
          </button>
        </div>
      </div>

      {/* The desktop dossier, same material, anchored to the bottom edge. */}
      <div
        className="wf-glass wf-glass--dark"
        ref={panelRef}
        role="group"
        aria-label="WorldPulse details"
        tabIndex={-1}
        inert={!open}
      >
        <span className="wf-glass__sheen" aria-hidden="true" />
        <button
          type="button"
          className="wf-glass__close"
          onClick={close}
          aria-label="Close WorldPulse details"
        >
          ×
        </button>
        <img
          className="wf-wp__logo"
          src={LOGO?.src ?? ""}
          alt={LOGO?.alt ?? "WorldPulse"}
          width={4166}
          height={2000}
        />
        <span className="wf-label">WorldPulse · Founder</span>
        {panelParas.map((p, i) => (
          <p key={i} className="wf-para">{p}</p>
        ))}
        <a
          className="wf-cta"
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
