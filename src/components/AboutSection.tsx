"use client";

// About — "Liner Notes". Work is the album; this is the booklet.
//
// Ported from `/identity-lab` treatment 04. The composition is an asymmetric
// editorial field and the eye moves left → right → left:
//
//   ABOUT / 05                       mono index + a rule that stops short
//   I like understanding …           serif, anchored LEFT, feature-title scale
//   PRODUCTS · COMPANIES · …         tracked mono index line, inert
//                        [body]      reading column offset RIGHT
//   MANDARIN ↔ ENGLISH               annotations hanging in the LEFT margin
//   The medium keeps changing …      closing thesis returns to the LEFT edge
//
// There is nothing operable in this section — no cards, no disclosure, no
// timeline, no photography, nothing to click. The sophistication is meant to
// be typography, spacing and pacing, and anything decorative that did not
// strengthen the story was removed rather than kept.
//
// MOTION
// Armed from JS rather than authored in CSS: every beat renders VISIBLE and the
// hide-then-reveal only engages once an IntersectionObserver is known to be
// running. This repo has already shipped an observer that silently watched a
// detached node and never fired, and the failure mode there would be an
// invisible About section. Worst case here is no animation, never no content.

import { useEffect, useRef } from "react";
import { ABOUT_DATA, ABOUT_PAIRS } from "@/data/about";
import "@/components/about.css";

export default function AboutSection() {
  const root = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (typeof IntersectionObserver === "undefined") return;

    const beats = Array.from(el.querySelectorAll<HTMLElement>("[data-beat]"));
    if (!beats.length) return;

    el.dataset.armed = "true";

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          (entry.target as HTMLElement).dataset.seen = "true";
          io.unobserve(entry.target);
        }
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.01 }
    );
    beats.forEach((b) => io.observe(b));
    return () => io.disconnect();
  }, []);

  return (
    <section id="about" className="about" ref={root} aria-labelledby="about-opening">
      {/* The site's own film grain, at a quarter of the Work section's
          strength. Felt, not seen — the liner-note idea stays a feeling and
          never becomes a paper texture or a jewel case. */}
      <span className="about__grain" aria-hidden="true" />

      <div className="about__inner">
        <p className="about__index" data-beat="0">
          <span>{ABOUT_DATA.index}</span>
          <span className="about__rule" aria-hidden="true" />
        </p>

        {/* The explicit {" "} before each <br> is load-bearing. JSX collapses
            the newlines around a tag, so the text nodes carry no whitespace of
            their own — and the narrow-width rule hides the breaks, which ran
            "became" and "what" together into "becamewhat". The space survives a
            hidden break; at desktop it collapses at line end. */}
        <h2 className="about__opening" id="about-opening" data-beat="1">
          I like understanding{" "}
          <br />
          how things became{" "}
          <br />
          what they are.
        </h2>

        <p className="about__set" data-beat="2">
          {ABOUT_DATA.secondary.map((word, i) => (
            <span key={word} className="about__set-word">
              {word}
              {i < ABOUT_DATA.secondary.length - 1 && (
                <span className="about__set-sep" aria-hidden="true">
                  ·
                </span>
              )}
            </span>
          ))}
        </p>

        <div className="about__body">
          <p className="about__p" data-beat="3">
            {ABOUT_DATA.body[0]}
          </p>

          <div className="about__translation">
            <p className="about__p" data-beat="4">
              {ABOUT_DATA.body[1]}
            </p>

            <ul className="about__pairs" aria-hidden="true" data-beat="5">
              {ABOUT_PAIRS.map(([a, b]) => (
                <li key={a} className="about__pair">
                  <span>{a}</span>
                  <span className="about__pair-arrow">↔</span>
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <p className="about__close" data-beat="6">
          {ABOUT_DATA.body[2]}
        </p>
      </div>
    </section>
  );
}
