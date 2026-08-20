"use client";

// "Let's work together" — the final Work section's interaction.
//
// Promoted from the CTA lab's ETB row (see src/components/cta-row-lab/). One
// component serves both breakpoints: the desktop cinematic card and the mobile
// Consulting card each supply their own background and chapter header, and
// mount this on top. Every layout rule is a `@container` query against this
// element, so the narrow layout is a property of the composition, not of the
// viewport.
//
// WHAT CHANGED FROM THE RAIL MODEL IT REPLACES
//
// The Rail opened on the headline alone: the three paths only existed once you
// pressed it, and choosing one dismissed the other two. This shows all three
// choices from the first frame and keeps them there. The row is persistent
// navigation — switching path is one click rather than back-then-forward — and
// "the choices are always visible" stays true after the first click instead of
// only before it.
//
// The photograph is now SHARP at rest. The Rail blurred it by degrees as you
// descended; with nothing to descend from, there is nothing to blur for. The
// blur arrives only when a screen is open and there is a panel to read.
//
// Two states, and the second is terminal:
//
//   intro        the headline and the three choices
//   destination  one complete screen, opened beneath the row
//
// The three choices are drawn as a CD track listing and the consulting screen
// answers with two named paths — both out of the lab at /consulting-paths-lab.
// See `consulting-paths.css` for the scheme and why its attributes are on the
// element below rather than compiled away.
//
// The choices are `<button>` with `aria-expanded`, because they disclose a
// panel in place rather than navigating. If they ever become links to real
// offer pages, `aria-expanded` must go with them — it is a lie to a screen
// reader on something that navigates.

import { useCallback, useEffect, useRef, useState } from "react";
import { CTA_HINT, CTA_LABEL, PATHS, getPath, type PathId } from "@/data/workTogether";
import ConsultingPathsScreen from "@/components/work/ConsultingPathsScreen";
import WorkTogetherSolo from "@/components/work/WorkTogetherSolo";
import "@/components/work/work-together.css";
// The three bars are styled by the shipped scheme too, and they exist before
// any screen is opened — so the section depends on this stylesheet directly
// rather than only through the screens it opens.
import "@/components/work/consulting-paths.css";

interface Props {
  /**
   * The photo plane. It must render INSIDE this component, not behind it:
   * `.wt__focus`'s backdrop-filter only samples what is painted beneath it
   * within the same backdrop root, and `.wt` is that root. A photo supplied by
   * the host instead sits outside it and the whole blur ladder silently does
   * nothing — the dim still lands, so it looks merely "too dark" rather than
   * broken.
   */
  media: React.ReactNode;
  /** Scroll-driven activity from the host card. Leaving the chapter resets. */
  isActive?: boolean;
  /** Extra class for host-specific spacing. */
  className?: string;
}

export default function WorkTogether({ media, isActive, className = "" }: Props) {
  const [openId, setOpenId] = useState<PathId | null>(null);
  const rootRef = useRef<HTMLDivElement | null>(null);

  const close = useCallback(() => setOpenId(null), []);

  // Scrolling away from the chapter returns it to the start, so the section is
  // always found in its opening state.
  useEffect(() => {
    if (isActive === false) setOpenId(null);
  }, [isActive]);

  // Escape closes the screen. stopPropagation so it doesn't also close a
  // parent card on the mobile stack.
  useEffect(() => {
    if (!openId) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      e.stopPropagation();
      close();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [openId, close]);

  // Focus moves into the screen when one opens and back to the button that
  // opened it when it closes — otherwise closing drops focus to <body> and a
  // keyboard user loses their place in the row.
  const prevOpen = useRef<PathId | null>(null);
  useEffect(() => {
    if (prevOpen.current === openId) return;
    const opening = openId !== null;
    const returnTo = prevOpen.current;
    prevOpen.current = openId;

    const root = rootRef.current;
    if (!root) return;

    if (opening) {
      root
        .querySelector<HTMLElement>("[data-wt-focus='destination']")
        ?.focus({ preventScroll: true });
    } else if (returnTo) {
      root
        .querySelector<HTMLElement>(`[data-wt-row='${returnTo}']`)
        ?.focus({ preventScroll: true });
    }
  }, [openId]);

  const path = openId ? getPath(openId) : null;

  return (
    <div
      ref={rootRef}
      className={`wt ${className}`.trim()}
      data-step={openId ? "destination" : "intro"}
      /* The shipped scheme, out of the lab at /consulting-paths-lab. These name
         the combination `consulting-paths.css` was filtered to, and they live
         on the element the three bars are inside because that stylesheet styles
         the bars as well as the panel. Removing one does not "simplify" the
         markup — it drops a point of specificity out of every selector that
         matched on it. */
      data-rows="skin"
      data-layout="tracklist"
      data-palette="cobalt-brass"
      data-surface="paper"
      data-type="house"
      data-button="cue"
      data-row-button="rule"
      data-track="player"
      data-key="plain"
    >
      <div className="wt__media" aria-hidden="true">
        {media}
      </div>
      <div className="wt__focus" aria-hidden="true" />
      <div className="wt__scrim" aria-hidden="true" />
      <div className="wt__grain" aria-hidden="true" />

      <div className="wt__copy">
        {/* Same id either way, so nothing referencing it breaks. Swapping the
            element rather than restyling it avoids a serif-to-mono
            font-family change mid-transition, which cannot tween. */}
        {openId ? (
          <p className="wt__eyebrow">{CTA_LABEL}</p>
        ) : (
          <h2 className="wt__title">{CTA_LABEL}</h2>
        )}

        <p className="wt__hint" id="wt-hint">
          {CTA_HINT}
        </p>

        <nav className="wt__rows" aria-labelledby="wt-hint">
          {PATHS.map((p, i) => {
            const current = openId === p.id;
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
                onClick={() => setOpenId(current ? null : p.id)}
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

        {path && (
          <div className="wt__unfurl">
            {/* Consulting is the one being answered differently: two named
                paths, each with its own detail and its own ask. The other two
                keep production's information architecture exactly and only
                take the same skin, so the three tabs read as one section. */}
            {openId === "consulting" ? (
              <ConsultingPathsScreen onBack={close} />
            ) : (
              <WorkTogetherSolo path={path} onBack={close} />
            )}
          </div>
        )}
      </div>
    </div>
  );
}
