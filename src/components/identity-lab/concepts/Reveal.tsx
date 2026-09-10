"use client";

// CONCEPT 05 — REVEAL
//
// One sentence that assembles itself.
//
// Three phrases in the sentence are marked. Hover, focus, or tap one and the
// full-bleed image behind swaps and one supporting fact appears.
//
// THE RULE THIS CONCEPT IS BUILT ON
// The sentence is complete before anything is touched, and all three facts are
// in the DOM at all times — only their visibility changes. A disclosure that
// hid the answer would be the live Personas cards again in a new costume, and
// the brief is explicit that interaction must improve comprehension rather
// than hide essential information.
//
// Untouched, this renders as concept 01: an image, a sentence, a fact strip.
// That is also exactly what it degrades to under reduced motion, so there is
// no second design to maintain.

import { useState } from "react";
import { REVEAL, REVEAL_PARTS, STRIP } from "@/data/identityLab";
import { ChapterRule } from "./parts";

/** Index of the phrase currently being pointed at. `null` is the rest state. */
type Active = number | null;

export default function Reveal() {
  const [active, setActive] = useState<Active>(null);

  return (
    <section className="ilab-reveal" data-active={active !== null || undefined}>
      {/* All three grounds are mounted; opacity selects. Swapping `src` would
          flash a decode on every hover. */}
      <div className="ilab-reveal__grounds" aria-hidden="true">
        <img
          className="ilab-reveal__ground"
          data-on={active === null || undefined}
          src="/consulting/hero-2.webp"
          alt=""
          width={3440}
          height={1440}
          style={{ objectPosition: "50% 62%" }}
          loading="lazy"
          decoding="async"
        />
        {REVEAL_PARTS.map((p, i) => (
          <img
            key={p.id}
            className="ilab-reveal__ground"
            data-kind={p.id}
            data-on={active === i || undefined}
            src={p.img.src}
            alt=""
            width={p.img.w}
            height={p.img.h}
            loading="lazy"
            decoding="async"
          />
        ))}
        <span className="ilab-reveal__scrim" />
      </div>

      <div className="ilab-reveal__body">
        <ChapterRule label="About" />

        <p className="ilab-reveal__sentence">
          {REVEAL.before}
          {REVEAL_PARTS.map((p, i) => (
            <span key={p.id}>
              {/* A button, because it is operable. Pointer and keyboard use the
                  same state, so a keyboard visitor gets the identical reveal. */}
              <button
                type="button"
                className="ilab-reveal__phrase"
                data-on={active === i || undefined}
                aria-describedby={`ilab-fact-${p.id}`}
                onMouseEnter={() => setActive(i)}
                onMouseLeave={() => setActive(null)}
                onFocus={() => setActive(i)}
                onBlur={() => setActive(null)}
                onClick={() => setActive(active === i ? null : i)}
              >
                {p.phrase}
              </button>
              {p.joiner}
            </span>
          ))}
          {REVEAL.after}
        </p>

        {/* Always in the DOM and always in the accessibility tree — only
            visually held back, so nothing is reachable by hover alone. */}
        <div className="ilab-reveal__facts">
          {REVEAL_PARTS.map((p, i) => (
            <p
              key={p.id}
              id={`ilab-fact-${p.id}`}
              className="ilab-reveal__fact"
              data-on={active === i || undefined}
            >
              {p.fact}
            </p>
          ))}
        </div>

        <ul className="ilab-strip ilab-reveal__strip" data-dim={active !== null || undefined}>
          {STRIP.map((f) => (
            <li key={f} className="ilab-strip__tag">
              {f}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
