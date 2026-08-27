"use client";

// Story progress spine — the right-edge guide through the four Work chapters.
//
// Section-only, deliberately: four markers on a hairline rule, no continuous
// fill and no labels. Two findings from /story-nav-lab drove that shape.
//   - A continuous filled rule on the right edge is the native scrollbar,
//     redrawn an inch to the left. Discrete markers are not.
//   - Anything that extends a label leftward crosses the white ETB candy-bars
//     and WorldPulse's white CTA pill, where white ink is invisible. Everything
//     here stays inside the scrollbar gutter, which the page never paints into.
//
// It owns no content and reads no production state. It finds the live chapters
// with the same selectors the soft-lock gate already relies on (see
// CONSULTING_TARGET in src/data/entryChoice.ts) and paints on top.
//
// WHY IT DOES NOT USE useWorkScroll
// That hook short-circuits entirely at <=640px with a coarse pointer, so on a
// real phone it reports nothing at all. This needs a position on every device,
// so it reads element positions itself — cheaply, and only while Work is on
// screen.

import { useCallback, useEffect, useRef, useState } from "react";
import { WORK_CHAPTERS } from "@/data/workChapters";
import "./story-progress-spine.css";

/** Ordinal + name per chapter. WORK_CHAPTERS is the shared source WORK_SCREENS
 *  spreads, so the spine and the chapter rail cannot disagree — and importing
 *  it does not drag the AtomicOS / CaseBrief / Cortex demo payloads that
 *  src/data/work.ts carries into the homepage's initial bundle. */
const CHAPTERS = WORK_CHAPTERS;

/**
 * The live chapter elements, in order.
 *
 * Desktop (WorkSectionCinematic, >=1024px) tags each chapter with
 * `data-cstack-id`; mobile (WorkSectionMobile) renders the same four
 * `.work__chapter--detail` tracks untagged. Empty means Work has not mounted
 * yet — WorkSectionResponsive renders a bare `<section id="work">` until it has
 * measured the viewport and its dynamic import has landed.
 */
function findChapters(): HTMLElement[] {
  const tagged = Array.from(
    document.querySelectorAll<HTMLElement>("[data-cstack-id]")
  ).sort((a, b) => Number(a.dataset.cstackId) - Number(b.dataset.cstackId));
  if (tagged.length) return tagged;
  return Array.from(
    document.querySelectorAll<HTMLElement>("#work .work__chapter--detail")
  );
}

export default function StoryProgressSpine() {
  const [section, setSection] = useState(0); // 0 = outside the story
  const chaptersRef = useRef<HTMLElement[]>([]);
  const reduceRef = useRef(false);

  useEffect(() => {
    reduceRef.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  // One effect: discovering the chapters and reading position are the same
  // machine. Split apart, the observer that notices Work mounting updated a ref
  // and nothing re-read from it — so after Skip-ahead (which jumps straight to
  // Consulting and fires no further scroll) the spine stayed hidden forever.
  //
  // NO IntersectionObserver, deliberately. useWorkScroll needs one because it
  // runs a continuous rAF loop that would otherwise burn frames forever. This
  // is event-driven: it does nothing at all between scrolls, and each read is
  // four getBoundingClientRect calls. Observing #work was also actively wrong —
  // WorkSectionResponsive renders a placeholder <section id="work"> and then
  // REPLACES it once it has measured the viewport, so the observer ended up
  // watching a detached node and never fired again.
  useEffect(() => {
    let frame = 0;

    const read = () => {
      frame = 0;
      const chapters = chaptersRef.current;
      if (!chapters.length) {
        setSection(0);
        return;
      }
      const mid = window.innerHeight / 2;
      let current = 0;
      for (let i = 0; i < chapters.length; i += 1) {
        if (chapters[i].getBoundingClientRect().top <= mid) current = i + 1;
      }
      const first = chapters[0].getBoundingClientRect();
      const last = chapters[chapters.length - 1].getBoundingClientRect();
      // Only while the Work section is the thing on screen.
      setSection(first.top <= mid && last.bottom > 0 ? current : 0);
    };

    const schedule = () => {
      if (frame) return;
      frame = requestAnimationFrame(read);
    };

    // Work mounts asynchronously and swaps branch wholesale at 1024px, so
    // re-resolve rather than caching once — and re-read when the set changes.
    const sync = () => {
      const next = findChapters();
      const changed =
        next.length !== chaptersRef.current.length ||
        next.some((el, i) => el !== chaptersRef.current[i]);
      chaptersRef.current = next;
      if (changed) schedule();
    };

    sync();
    const mo = new MutationObserver(sync);
    mo.observe(document.body, { childList: true, subtree: true });

    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule, { passive: true });
    schedule();

    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      mo.disconnect();
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  const go = useCallback((id: number) => {
    const el = chaptersRef.current[id - 1];
    el?.scrollIntoView({
      // Reduced motion gets direct movement. Smooth-scrolling several thousand
      // pixels through Work animates the CD spin and the parallax at once.
      behavior: reduceRef.current ? "auto" : "smooth",
      block: "start",
    });
  }, []);

  if (!section) return null;

  return (
    <nav className="spine" aria-label="Work chapters">
      <ol className="spine__list">
        <span className="spine__rail" aria-hidden="true" />
        {CHAPTERS.map((c) => {
          const isActive = c.id === section;
          const isDone = c.id < section;
          return (
            <li
              key={c.id}
              className={`spine__item${isActive ? " is-active" : ""}${isDone ? " is-done" : ""}`}
            >
              <button
                type="button"
                className="spine__btn"
                onClick={() => go(c.id)}
                aria-current={isActive ? "step" : undefined}
                // The visible mark is a 6px dot; the accessible name never is.
                aria-label={`${c.number} — ${c.name}`}
              >
                <span className="spine__marker" aria-hidden="true" />
              </button>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
