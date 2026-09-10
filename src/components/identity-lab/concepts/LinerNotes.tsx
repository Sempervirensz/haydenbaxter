"use client";

// 04 — LINER NOTES
//
// Work is the album. About is the liner notes.
//
// The Work chapters are the site's ambitious, interactive stretch: a pinned CD
// player on blue velvet, full-bleed photography, 1,700vh of scroll. This
// section is the deliberate contrast — quiet, editorial, typographic, almost no
// UI. The visitor has just come out of a sequence that asked them to perform,
// and the whole idea here is that the interface stops asking.
//
// The sophistication is meant to come from typography, spacing, asymmetry,
// hierarchy and pacing. There is no card grid, no timeline, no accordion, no
// modal, no portrait hero, and nothing to click.
//
// COMPOSITION (desktop)
//   ABOUT / 05                       — mono index, hairline rule
//   I like understanding …           — serif, anchored LEFT, editorial title
//   PRODUCTS · COMPANIES · …         — tracked mono index line
//                        [body]      — reading column offset RIGHT
//   MANDARIN ↔ ENGLISH               — annotations in the LEFT margin,
//                                      beside the translation paragraph
//   The medium keeps changing …      — closing thesis returns LEFT
//
// The eye moves left → right → left. That zigzag is the editorial movement;
// a single centred column is what the brief is explicitly not asking for.
//
// MOTION
// Nearly invisible: opacity and a 10px rise, staggered by beat. Critically, it
// is armed from JS rather than authored in CSS — every element renders VISIBLE
// by default, and the effect only hides-then-reveals once an IntersectionObserver
// is known to be running. A lab in this repo has already been bitten by an
// observer that silently never fires (see the `#work` node-replacement note),
// and the failure mode there is an invisible section. This way the worst case
// is no animation, never no content.

import { useEffect, useRef } from "react";
import { LINER, LINER_PAIRS } from "@/data/identityLab";

export default function LinerNotes() {
  const root = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;

    // Reduced motion: never arm. The section is already complete without it.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (typeof IntersectionObserver === "undefined") return;

    const beats = Array.from(el.querySelectorAll<HTMLElement>("[data-beat]"));
    if (!beats.length) return;

    // Arming is what switches the CSS from "visible" to "hidden until seen".
    el.dataset.armed = "true";

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          (entry.target as HTMLElement).dataset.seen = "true";
          io.unobserve(entry.target);
        }
      },
      // A little lead so a beat resolves as it arrives rather than after.
      { rootMargin: "0px 0px -12% 0px", threshold: 0.01 }
    );
    beats.forEach((b) => io.observe(b));
    return () => io.disconnect();
  }, []);

  return (
    <section className="lnr" ref={root} aria-labelledby="lnr-opening">
      {/* The site's own film grain, at a quarter of the Work section's
          strength. Felt, not seen — and never a paper texture, because the
          liner-note idea has to stay a feeling rather than an illustration. */}
      <span className="lnr__grain" aria-hidden="true" />

      <div className="lnr__inner">
        {/* ---- Index ------------------------------------------------------ */}
        <p className="lnr__index" data-beat="0">
          <span>{LINER.index}</span>
          <span className="lnr__rule" aria-hidden="true" />
        </p>

        {/* ---- Opening statement ------------------------------------------ */}
        {/* Line breaks are authored rather than left to wrapping: this is the
            one element in the section where the rag is a design decision. They
            are `<br>` inside a single heading, so the sentence stays one
            string for a screen reader and one string for a crawler. */}
        {/* The explicit {" "} before each <br> is load-bearing. JSX collapses the
            newlines around a tag, so the text nodes carry no whitespace of
            their own — and the narrow-width rule below hides the breaks, which
            ran "became" and "what" together into "becamewhat". The space
            survives the hidden break; at desktop it collapses at line end. */}
        <h3 className="lnr__opening" id="lnr-opening" data-beat="1">
          I like understanding{" "}
          <br />
          how things became{" "}
          <br />
          what they are.
        </h3>

        {/* ---- Secondary line, as an index ------------------------------- */}
        {/* Inert typography. Not buttons, not links, not filters. */}
        <p className="lnr__set" data-beat="2">
          {LINER.secondary.map((word, i) => (
            <span key={word} className="lnr__set-word">
              {word}
              {i < LINER.secondary.length - 1 && (
                <span className="lnr__set-sep" aria-hidden="true">
                  ·
                </span>
              )}
            </span>
          ))}
        </p>

        {/* ---- Body, offset right ----------------------------------------- */}
        <div className="lnr__body">
          <p className="lnr__p" data-beat="3">
            {LINER.body[0]}
          </p>

          {/* The translation beat carries the annotations. They sit in the
              left margin on desktop and stack beneath on narrow, and they are
              `aria-hidden` because they restate the paragraph they annotate —
              a screen reader should hear the sentence once, not twice. */}
          <div className="lnr__translation">
            <p className="lnr__p" data-beat="4">
              {LINER.body[1]}
            </p>

            <ul className="lnr__pairs" aria-hidden="true" data-beat="5">
              {LINER_PAIRS.map(([a, b]) => (
                <li key={a} className="lnr__pair">
                  <span>{a}</span>
                  <span className="lnr__pair-arrow">↔</span>
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* ---- Closing thesis, returning left ----------------------------- */}
        <p className="lnr__close" data-beat="6">
          {LINER.body[2]}
        </p>
      </div>
    </section>
  );
}
