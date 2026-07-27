"use client";

// One rAF loop for the whole four-chapter sequence.
//
// Deliberately a single loop rather than per-card hooks: four independent
// observers and four rAF loops on a phone is exactly the kind of thing that
// causes scroll jank on Safari. This mirrors useCinematicParallax (the desktop
// engine) but is scoped to the mobile sequence and writes only two things:
//
//   - `--mws-sink` on each chapter's card: the handoff. As the next chapter
//     rises over it, the outgoing card sinks and dims — the same depth move the
//     approved desktop stack makes, which is most of why the four cards read as
//     one system rather than four pages.
//   - `--mws-plx` on any [data-mws-drift] element: image drift. Only the two
//     photo cards carry one; panel cards stay still by system rule.
//
// Everything is a transform or an opacity, so it stays on the compositor.
// The loop only runs while the sequence is on screen, and never starts at all
// under prefers-reduced-motion.

import { useEffect, useRef, type RefObject } from "react";

/** Peak drift in px. Must stay under the vertical bleed the CSS gives a drift
 *  layer (12px), or the drift exposes an edge. */
const DRIFT_PX = 10;

function clamp(v: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(hi, v));
}

export function useSequenceMotion(
  rootRef: RefObject<HTMLElement | null>,
  scrollRootRef: RefObject<HTMLElement | null>,
  enabled: () => boolean = () => true
) {
  const enabledRef = useRef(enabled);
  enabledRef.current = enabled;

  useEffect(() => {
    const root = rootRef.current;
    const scroller = scrollRootRef.current;
    if (!root || !scroller) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      root.classList.add("mws--still");
      return;
    }

    let chapters: HTMLElement[] = [];
    let rafId = 0;
    let running = false;
    let lastOff = false;

    const collect = () => {
      chapters = Array.from(root.querySelectorAll<HTMLElement>("[data-mws-chapter]"));
    };

    const reset = () => {
      for (const ch of chapters) {
        ch.style.setProperty("--mws-sink", "0");
        ch.querySelectorAll<HTMLElement>("[data-mws-drift]").forEach((el) =>
          el.style.setProperty("--mws-plx", "0px")
        );
      }
    };

    const tick = () => {
      if (!enabledRef.current()) {
        if (!lastOff) {
          reset();
          lastOff = true;
        }
        if (running) rafId = requestAnimationFrame(tick);
        return;
      }
      lastOff = false;

      const frame = scroller.getBoundingClientRect();
      const vh = frame.height || 1;

      for (let i = 0; i < chapters.length; i += 1) {
        const ch = chapters[i];
        const next = chapters[i + 1];

        // Handoff: 0 while this chapter owns the frame, 1 once the next has
        // fully covered it.
        let sink = 0;
        if (next) {
          const nr = next.getBoundingClientRect();
          sink = clamp((frame.top + vh * 0.92 - nr.top) / (vh * 0.8), 0, 1);
        }
        ch.style.setProperty("--mws-sink", sink.toFixed(3));

        // Drift: -1 a frame below centre, +1 a frame above.
        const r = ch.getBoundingClientRect();
        const delta = frame.top + vh / 2 - (r.top + r.height / 2);
        const p = clamp(delta / vh, -1, 1);
        const px = `${(p * DRIFT_PX).toFixed(2)}px`;
        ch.querySelectorAll<HTMLElement>("[data-mws-drift]").forEach((el) =>
          el.style.setProperty("--mws-plx", px)
        );
      }

      if (running) rafId = requestAnimationFrame(tick);
    };

    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries.some((e) => e.isIntersecting);
        if (visible && !running) {
          running = true;
          rafId = requestAnimationFrame(tick);
        } else if (!visible && running) {
          running = false;
          cancelAnimationFrame(rafId);
        }
      },
      { rootMargin: "20% 0px" }
    );

    collect();
    io.observe(root);

    const mo = new MutationObserver(collect);
    mo.observe(root, { childList: true, subtree: true });

    return () => {
      io.disconnect();
      mo.disconnect();
      running = false;
      cancelAnimationFrame(rafId);
      reset();
    };
  }, [rootRef, scrollRootRef]);
}
