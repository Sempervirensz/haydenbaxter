"use client";

// The Consulting card, rebuilt around a swappable sheet.
//
// WHY IT IS A REPLICA AND NOT AN IFRAME
//
// The question the lab is asking is "does this feel native to the page", and
// that cannot be answered on a white artboard. What sits above the sheet — the
// statue, the chapter rail, the demoted eyebrow, the three track rows with 03
// playing — is most of the context the section has to survive. So the card is
// reproduced here with production's own markup and production's own two
// stylesheets, and only the body of the paper sheet is the lab's.
//
// Everything structural is copied from what ships:
//   .wm-card / .wm-rail / .wm-cns__*   work/mobile/MobileConsultingCard.tsx
//   .wt[data-*] + rows + unfurl        work/WorkTogether.tsx
//   .cpp-screen head                   work/WorkTogetherSolo.tsx
//
// The nine `data-` attributes on `.wt` are the shipped scheme and are copied
// verbatim, attribute for attribute. They are not decoration: consulting-paths
// .css selects on them, and dropping one drops a point of specificity out of
// every rule that matched it.
//
// PRODUCTION IS NOT TOUCHED. Nothing here is imported by the site; this file is
// imported only by /experience-lab.

import { useEffect, useRef, type ReactNode } from "react";
import { CTA_LABEL, PATHS, getPath } from "@/data/workTogether";
import WorkTogetherSolo from "@/components/work/WorkTogetherSolo";
import { Rail } from "@/components/work/mobile/shared";
import "@/components/work/work-together.css";
import "@/components/work/consulting-paths.css";
import "@/components/work/mobile/work-mobile-cards.css";

/** Production swaps to this asset at <=640px — shot for portrait (900x2000). */
const IMG = "/consulting/mobile-statue.webp";
const IMG_ALT =
  "A winged victory statue lit against a golden hillside cityscape at night, above still water.";

const EXPERIENCE_PATH = getPath("experience");

export interface FitReading {
  /** Height of the sheet's scrollable content. */
  content: number;
  /** Height the sheet actually has. */
  box: number;
}

export default function ExperienceCard({
  children,
  concept,
  baseline = false,
  onFit,
}: {
  /** The concept's sheet body. Ignored when `baseline` is set. */
  children?: ReactNode;
  /**
   * Which concept `children` is. The measure effect keys off THIS and never off
   * `children`: a React element is a fresh object on every render, so listing it
   * as a dependency re-runs the effect each pass, and an effect that observes a
   * box and sets state is then an infinite loop.
   */
  concept?: string;
  /** Render production's real Experience screen instead of a concept. */
  baseline?: boolean;
  /** Reports how much taller the content is than the sheet that holds it. */
  onFit?: (r: FitReading) => void;
}) {
  const sheetRef = useRef<HTMLDivElement | null>(null);

  /* The one number this lab exists to expose. The shipped section measures
     873px of content in a 518px sheet at 402px wide — a nested scroller with no
     affordance, inside a card that is itself a scroll stop. Every concept gets
     the same reading so "does it fit" is a fact rather than an impression. */
  useEffect(() => {
    if (!onFit) return;
    const el = baseline
      ? sheetRef.current?.querySelector<HTMLElement>(".cpp-screen")
      : sheetRef.current;
    if (!el) return;

    const read = () => onFit({ content: el.scrollHeight, box: el.clientHeight });
    read();

    const ro = new ResizeObserver(read);
    ro.observe(el);
    return () => ro.disconnect();
  }, [onFit, baseline, concept]);

  return (
    <article className="wm-card wm-card--cns xlab-card">
      <div className="wt" data-step="destination" {...SCHEME}>
        <div className="wt__media" aria-hidden="true">
          <div className="wm-cns__media">
            <img className="wm-cns__img" src={IMG} alt="" loading="lazy" decoding="async" />
          </div>
          <span className="wm-cns__vignette" />
        </div>
        <div className="wt__focus" aria-hidden="true" />
        <div className="wt__scrim" aria-hidden="true" />
        <div className="wt__grain" aria-hidden="true" />

        <div className="wt__copy">
          {/* Demoted to the mono eyebrow, exactly as production does once a
              screen is open — the serif headline is not on screen at this step
              and a lab that kept it would be judging a composition that never
              happens. */}
          <p className="wt__eyebrow">{CTA_LABEL}</p>

          {/* The three choices stay. They are the section's ceiling: ~200px of
              the card is spent before the sheet starts. */}
          <nav className="wt__rows" aria-label="Choices">
            {PATHS.map((p, i) => {
              const current = p.id === "experience";
              return (
                <button
                  key={p.id}
                  type="button"
                  data-wt-row={p.id}
                  className={`wt__row ${p.id === "consulting" ? "is-primary" : "is-secondary"} ${
                    current ? "is-current" : ""
                  }`}
                  style={{ ["--row-index" as string]: i }}
                  aria-expanded={current}
                  /* Inert on purpose: the lab is judging one screen, and a row
                     that swapped it would be a second variable. */
                  disabled
                >
                  <span className="wt__rowSheen" aria-hidden="true" />
                  <span className="wt__rowMain">
                    <span className="wt__label">{p.label}</span>
                    <span className="wt__lede">{p.lede}</span>
                  </span>
                  <span className="wt__chev" aria-hidden="true">
                    {current ? "↑" : "›"}
                  </span>
                </button>
              );
            })}
          </nav>

          <div className="wt__unfurl">
            {baseline ? (
              <div className="xlab-baseline" ref={sheetRef}>
                <WorkTogetherSolo path={EXPERIENCE_PATH} onBack={() => {}} />
              </div>
            ) : (
              <section
                ref={sheetRef}
                className="cpp-screen xlab-sheet"
                aria-label="Review My Experience"
                data-open="none"
                data-layout="tracklist"
                data-palette="cobalt-brass"
                data-surface="paper"
                data-type="house"
                data-button="cue"
              >
                <header className="cpp-screen__head">
                  <span className="cpp-screen__eyebrow">
                    {EXPERIENCE_PATH.destination.eyebrow}
                  </span>
                  <button type="button" className="cpp-screen__back" disabled>
                    <span aria-hidden="true">&larr;</span> Back to options
                  </button>
                </header>

                {/* `data-path="supply"` is what production's ACCENT_FOR map
                    resolves Experience to, so the brass hue and its grooves are
                    the ones the section actually ships with. */}
                <div className="cpp-path xlab-body" data-path="supply" data-state="closed">
                  {children}
                </div>
              </section>
            )}
          </div>
        </div>
      </div>

      <Rail id={4} />
    </article>
  );
}

/** The shipped scheme, copied attribute for attribute from WorkTogether.tsx. */
const SCHEME = {
  "data-rows": "skin",
  "data-layout": "tracklist",
  "data-palette": "cobalt-brass",
  "data-surface": "paper",
  "data-type": "house",
  "data-button": "cue",
  "data-row-button": "rule",
  "data-track": "player",
  "data-key": "plain",
} as const;
