"use client";

// Layered scroll-linked drift, opt-in per variation.
//
// Deliberately NOT applied to every variation — the point of the lab is to see
// which cards the technique actually helps. Only the variations tagged with
// `parallax` mount this.
//
// Writes three custom properties onto one root, so a card composes them onto
// separate planes and gets real depth from a single rAF loop:
//
//   --wf-plx-img    the photo, furthest back, moves most
//   --wf-plx-scrim  the gradient between, moves less
//   --wf-plx-text   the headline, nearest, moves least
//
// Everything is a transform. The loop is IntersectionObserver-gated and never
// starts under prefers-reduced-motion, so the composition is identical when
// motion is off — nothing here is load-bearing.

import { useEffect, useRef, type RefObject } from "react";

/** Peak travel per plane, px. Must stay inside the 14px vertical bleed the CSS
 *  gives the media layers, or drift exposes an edge. */
const PLANES: [prop: string, px: number][] = [
  ["--wf-plx-img", 12],
  ["--wf-plx-scrim", 7],
  ["--wf-plx-text", 3],
];

export function useLayeredDrift(
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

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let rafId = 0;
    let running = false;
    let last = NaN;

    const clear = () => {
      for (const [prop] of PLANES) root.style.setProperty(prop, "0px");
    };

    const tick = () => {
      if (!enabledRef.current()) {
        if (last !== 0) {
          clear();
          last = 0;
        }
      } else {
        const frame = scroller.getBoundingClientRect();
        const r = root.getBoundingClientRect();
        const vh = frame.height || 1;
        // -1 a full frame below centre, +1 a full frame above.
        const p = Math.max(
          -1,
          Math.min(1, (frame.top + vh / 2 - (r.top + r.height / 2)) / vh)
        );
        if (p !== last) {
          for (const [prop, px] of PLANES) {
            root.style.setProperty(prop, `${(p * px).toFixed(2)}px`);
          }
          last = p;
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
      { root: scroller, rootMargin: "25% 0px" }
    );
    io.observe(root);

    return () => {
      io.disconnect();
      running = false;
      cancelAnimationFrame(rafId);
      clear();
    };
  }, [rootRef, scrollRootRef]);
}
