"use client";

// Subtle image drift for a single card, measured against the VIEWPORT.
//
// The lab hook measured against a scroll-container ref (the phone frame). In
// production the page itself scrolls the window, and each phone chapter is a
// 100dvh block, so the correct reference is simply the viewport: the card's
// centre relative to the viewport centre drives the drift.
//
// Writes `--wm-plx-img` onto the card root; the CSS composes it onto
// `.wm-cns__media`. IntersectionObserver-gated so it never runs offscreen, and
// short-circuited under prefers-reduced-motion so the composition is identical
// with motion off. Transform-only → stays on the compositor, no Safari jank.
//
// Only Consulting (Refined Motion) mounts this. Every other approved card is
// static by design.

import { useEffect, useRef, type RefObject } from "react";

/** Peak travel, px. Must stay inside the 14px vertical bleed the media plane
 *  gives itself, or the drift exposes an edge. */
const TRAVEL = 12;

export function useCardDrift(
  targetRef: RefObject<HTMLElement | null>,
  enabled: () => boolean = () => true
) {
  const enabledRef = useRef(enabled);
  enabledRef.current = enabled;

  useEffect(() => {
    const el = targetRef.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let rafId = 0;
    let running = false;
    let last = NaN;

    const tick = () => {
      if (!enabledRef.current()) {
        if (last !== 0) {
          el.style.setProperty("--wm-plx-img", "0px");
          last = 0;
        }
      } else {
        const vh = window.innerHeight || 1;
        const r = el.getBoundingClientRect();
        // -1 a full viewport below centre, +1 a full viewport above.
        const p = Math.max(-1, Math.min(1, (vh / 2 - (r.top + r.height / 2)) / vh));
        if (p !== last) {
          el.style.setProperty("--wm-plx-img", `${(p * TRAVEL).toFixed(2)}px`);
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
      { rootMargin: "20% 0px" }
    );
    io.observe(el);

    return () => {
      io.disconnect();
      running = false;
      cancelAnimationFrame(rafId);
      el.style.removeProperty("--wm-plx-img");
    };
  }, [targetRef]);
}
