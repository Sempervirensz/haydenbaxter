"use client";

// Concept C — "Two-Up". Image-led, the strongest alternative found in the labs.
//
// The existing labs all solve WorldPulse the same way: put a panel ON the photo
// and reveal it. On a phone that is a zero-sum fight — the photo's subject fills
// the frame, so every pixel the dossier gains, the product loses. This concept
// refuses the trade and gives each one its own screen:
//
//   pane 1 — the cinematic poster, photo completely uncovered
//   pane 2 — the story, dark editorial page, copy at full width
//
// A persistent bottom bar holds the pager and the CTA, so the primary action is
// never a pane away. Paging is native CSS scroll-snap: no JS animation, and the
// pager buttons make it fully keyboard-operable.

import { useEffect, useId, useRef, useState } from "react";
import type { WorldPulseContent } from "@/data/worldpulseMobileLab";

const PANES = ["Poster", "Story"] as const;

export default function ConceptTwoUp({ c }: { c: WorldPulseContent }) {
  const [pane, setPane] = useState(0);
  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const baseId = useId();

  // Which pane is showing — read from the scroller itself, so a swipe and a
  // pager tap can never disagree. A rAF-throttled scroll read is both cheaper
  // and more dependable here than an IntersectionObserver rooted on a
  // snap container.
  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    // Read synchronously rather than through a rAF latch: rAF is paused while
    // the tab is hidden, so a latched frame never fires and the pager silently
    // stops tracking for the rest of the session. Two property reads per scroll
    // event is cheaper than that risk, and React no-ops an unchanged setState.
    const read = () => {
      const w = scroller.clientWidth || 1;
      setPane(Math.round(scroller.scrollLeft / w));
    };
    scroller.addEventListener("scroll", read, { passive: true });
    read();
    return () => scroller.removeEventListener("scroll", read);
  }, []);

  // Easing comes from CSS `scroll-behavior` on the scroller, which the
  // reduced-motion block switches back to `auto`. Assigning scrollLeft rather
  // than calling scrollTo keeps that one source of truth.
  const goto = (i: number) => {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    scroller.scrollLeft = i * scroller.clientWidth;
  };

  return (
    <article className="wpc wpc-c">
      <div
        className="wpc-c__scroller"
        ref={scrollerRef}
        tabIndex={0}
        role="group"
        aria-label="WorldPulse — swipe between poster and story"
      >
        {/* Pane 1 — poster. Nothing overlays the subject. */}
        <section
          className="wpc-c__pane wpc-c__pane--poster"
          data-pane="0"
          id={`${baseId}-0`}
          aria-label="Poster"
        >
          <img className="wpc-c__img" src={c.image} alt={c.imageAlt} />
          <span className="wpc-c__scrimTop" aria-hidden="true" />
          <header className="wpc-c__rail">
            <span className="wpc__num">
              {c.number} — {c.name}
            </span>
            <span className="wpc__line" aria-hidden="true" />
          </header>
          <h2 className="wpc__headline wpc-c__headline">{c.tagline}</h2>
        </section>

        {/* Pane 2 — story. Full width, nothing cramped. */}
        <section
          className="wpc-c__pane wpc-c__pane--story"
          data-pane="1"
          id={`${baseId}-1`}
          aria-label="Story"
        >
          {/* The rail repeats so the two panes read as one card, not two pages. */}
          <header className="wpc-c__rail wpc-c__rail--story">
            <span className="wpc__num">
              {c.number} — {c.name}
            </span>
            <span className="wpc__line" aria-hidden="true" />
          </header>
          <div className="wpc-c__storyInner">
            <img
              className="wpc__logo"
              src={c.logo?.src ?? ""}
              alt={c.logo?.alt ?? "WorldPulse"}
              width={4166}
              height={2000}
            />
            <span className="wpc__label">{c.label}</span>
            {c.paragraphs.map((p, i) => (
              <p key={i} className="wpc__para">
                {p}
              </p>
            ))}
          </div>
        </section>
      </div>

      {/* Persistent bar — the CTA never scrolls away. */}
      <div className="wpc-c__bar">
        <div className="wpc-c__pager" role="tablist" aria-label="Pane">
          {PANES.map((label, i) => (
            <button
              key={label}
              type="button"
              role="tab"
              aria-selected={pane === i}
              aria-controls={`${baseId}-${i}`}
              className={`wpc-c__dot ${pane === i ? "is-on" : ""}`}
              onClick={() => goto(i)}
            >
              <span className="wpc-c__dotMark" aria-hidden="true" />
              <span className="wpc-c__dotLabel">{label}</span>
            </button>
          ))}
        </div>

        <a
          className="wpc__cta wpc-c__cta"
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
    </article>
  );
}
