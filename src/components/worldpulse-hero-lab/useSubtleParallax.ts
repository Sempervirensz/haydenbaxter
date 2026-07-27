"use client";

// Subtle, removable parallax for a single mobile card.
//
// Deliberately small: one rAF loop, one CSS custom property, no dependency and
// no animation library. It mirrors the pattern already proven in
// useCinematicParallax (IntersectionObserver gate + rAF + transform only) but is
// scoped to ONE element so a concept can drop it by deleting one hook call.
//
//   - writes `--wpm-plx` (a px translate) onto `targetRef`
//   - the element composes it as `translate3d(0, var(--wpm-plx), 0)` — nothing
//     else in the concept touches that wrapper's transform, so the parallax and
//     the concept's own state transforms never fight
//   - the loop only runs while the card intersects the viewport
//   - `prefers-reduced-motion: reduce` short-circuits before the loop starts
//   - `enabled` is read through a ref so the lab's Motion toggle can kill it
//     mid-flight without re-subscribing
//
// `scrollRootRef` is the element the card scrolls inside (the lab's phone
// frame). Progress is measured from rects, so it works whether the scroller is
// the window or a nested overflow container.

import { useEffect, useRef, type RefObject } from "react";

/** Peak travel in px. Small on purpose — depth, not drama. Must stay under the
 *  vertical bleed the concept gives its media wrapper (12px), or the drift
 *  exposes an edge. */
const TRAVEL_PX = 10;

export function useSubtleParallax(
  targetRef: RefObject<HTMLElement | null>,
  scrollRootRef: RefObject<HTMLElement | null>,
  enabled: () => boolean = () => true
) {
  const enabledRef = useRef(enabled);
  enabledRef.current = enabled;

  useEffect(() => {
    const target = targetRef.current;
    const root = scrollRootRef.current;
    if (!target || !root) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      target.style.setProperty("--wpm-plx", "0px");
      return;
    }

    let rafId = 0;
    let running = false;
    let last = NaN;

    const tick = () => {
      if (!enabledRef.current()) {
        if (last !== 0) {
          target.style.setProperty("--wpm-plx", "0px");
          last = 0;
        }
      } else {
        const rootRect = root.getBoundingClientRect();
        const cardRect = target.getBoundingClientRect();
        // -1 when the card sits a full frame below centre, +1 when a full frame
        // above. 0 while it is centred, so a card that fills the frame and never
        // scrolls simply never moves.
        const span = rootRect.height || 1;
        const delta =
          rootRect.top + rootRect.height / 2 - (cardRect.top + cardRect.height / 2);
        const p = Math.max(-1, Math.min(1, delta / span));
        const px = Math.round(p * TRAVEL_PX * 100) / 100;
        if (px !== last) {
          target.style.setProperty("--wpm-plx", `${px}px`);
          last = px;
        }
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
      { root, rootMargin: "20% 0px" }
    );
    io.observe(target);

    return () => {
      io.disconnect();
      running = false;
      cancelAnimationFrame(rafId);
      target.style.removeProperty("--wpm-plx");
    };
  }, [targetRef, scrollRootRef]);
}
