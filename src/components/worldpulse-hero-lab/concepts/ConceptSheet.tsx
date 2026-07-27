"use client";

// Concept B — "Passport Sheet". Cinematic, closest to the approved desktop card.
//
// Full-bleed photo as the stage. The geometry here is the whole idea:
//
//   The hero is 2.36:1. Cropped to a portrait phone card it keeps only ~21% of
//   its width, and in that slice the phone sits left, her face sits right, and
//   together they fill the frame top to bottom. There is no empty corner to put
//   text in. Running the numbers, a bottom-anchored headline would need the
//   image scaled ~1.75× to clear the phone — which crops the subject away
//   entirely. So in the resting state ALL text lives in the top band, and the
//   only thing at the base is a single pill that covers her hand, never the
//   WorldPulse screen she is holding up.
//
//   When the sheet rises, the photo re-frames upward and inward at the same
//   time, so what is left above the sheet is a composed portrait rather than the
//   top third of the closed composition.
//
// Interaction is tap-first: the pill toggles, the scrim dismisses, Escape
// closes, and focus moves into the sheet and back to the trigger. Nothing
// depends on hover.

import { useCallback, useEffect, useId, useRef, useState } from "react";
import type { WorldPulseContent } from "@/data/worldpulseMobileLab";
import { useSubtleParallax } from "../useSubtleParallax";

interface Props {
  c: WorldPulseContent;
  /** Lab's phone frame — the scroll root the parallax measures against. */
  scrollRootRef: React.RefObject<HTMLElement | null>;
  /** Lab Motion toggle. Parallax also self-disables under reduced motion. */
  motion?: boolean;
}

export default function ConceptSheet({ c, scrollRootRef, motion = true }: Props) {
  const [open, setOpen] = useState(false);
  const sheetId = useId();
  const plxRef = useRef<HTMLDivElement | null>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const sheetRef = useRef<HTMLDivElement | null>(null);

  const motionRef = useRef(motion);
  motionRef.current = motion;
  useSubtleParallax(plxRef, scrollRootRef, () => motionRef.current);

  // preventScroll matters more than it looks: an `overflow: hidden` ancestor is
  // still programmatically scrollable, so a plain .focus() slides the whole card
  // out of its frame and the composition falls apart.
  const close = useCallback(() => {
    setOpen(false);
    triggerRef.current?.focus({ preventScroll: true });
  }, []);

  // Escape closes; opening moves focus into the sheet so a keyboard user lands
  // on the dossier rather than tabbing through the whole card to reach it.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        close();
      }
    };
    const node = sheetRef.current;
    node?.addEventListener("keydown", onKey);
    node?.focus({ preventScroll: true });
    return () => node?.removeEventListener("keydown", onKey);
  }, [open, close]);

  return (
    <article className={`wpc wpc-b ${open ? "is-open" : ""}`}>
      <div className="wpc-b__plx" ref={plxRef}>
        <img className="wpc-b__img" src={c.image} alt={c.imageAlt} />
      </div>
      <span className="wpc-b__scrimTop" aria-hidden="true" />
      <span className="wpc-b__scrimBottom" aria-hidden="true" />

      <header className="wpc-b__rail">
        <span className="wpc__num">
          {c.number} — {c.name}
        </span>
        <span className="wpc__line" aria-hidden="true" />
      </header>

      <h2 className="wpc__headline wpc-b__headline">{c.tagline}</h2>

      {/* Dismiss layer. Only live while open so it never eats a tap at rest. */}
      <button
        type="button"
        className="wpc-b__dismiss"
        tabIndex={-1}
        aria-hidden={!open}
        onClick={close}
      />

      <div className="wpc-b__foot">
        <button
          type="button"
          ref={triggerRef}
          className="wpc-b__trigger"
          aria-expanded={open}
          aria-controls={sheetId}
          onClick={() => (open ? close() : setOpen(true))}
        >
          {open ? "Close" : "Explore WorldPulse"}
          <span className="wpc-b__triggerIcon" aria-hidden="true">
            ▸
          </span>
        </button>
      </div>

      <div
        className="wpc-b__sheet"
        id={sheetId}
        ref={sheetRef}
        role="group"
        aria-label="WorldPulse details"
        tabIndex={-1}
        // Hidden from AT and from tab order while closed, without display:none —
        // the sheet has to stay in the layout so it can transform.
        inert={!open}
      >
        <span className="wpc-b__sheetSheen" aria-hidden="true" />
        {/* The grab handle IS the close control, so touch and keyboard share one
            affordance and the sheet is never a dead end. */}
        <button
          type="button"
          className="wpc-b__handle"
          onClick={close}
          aria-label="Close WorldPulse details"
        />

        <div className="wpc-b__sheetScroll">
          <img
            className="wpc__logo"
            src={c.logo?.src ?? ""}
            alt={c.logo?.alt ?? "WorldPulse"}
            width={4166}
            height={2000}
          />
          <span className="wpc__label">{c.label}</span>
          {c.paragraphs.map((p, i) => (
            <p key={i} className="wpc__para wpc-b__para">
              {p}
            </p>
          ))}
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
      </div>
    </article>
  );
}
