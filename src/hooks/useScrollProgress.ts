"use client";

import { useEffect, useRef } from "react";

/* Scroll-driven unveil with no React state.
 *
 * The shipped hook calls setProgress() on every scroll frame, which re-renders
 * CardDeck and all four PlayingCards, and reads getBoundingClientRect() plus
 * document.documentElement.scrollHeight inside the same frame — a forced
 * synchronous layout against a document that is ~21,000px once the gate opens.
 *
 * Here the rAF writes ONE custom property on the deck element and CSS computes
 * each card's transform from it. Same easing, same geometry, same output; no
 * React work and no layout read per frame. */
export function useScrollProgress() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const set = (p: number) => {
      const t = 1 - Math.pow(1 - Math.min(Math.max(p, 0), 1), 3); // easeOutCubic
      el.style.setProperty("--unveil", String(t));
    };

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      set(1);
      return;
    }

    // Geometry is measured on resize only, never inside the scroll frame.
    let docH = 0;
    let winH = 0;
    let elTop = 0;
    const measure = () => {
      winH = window.innerHeight;
      docH = document.documentElement.scrollHeight;
      elTop = el.getBoundingClientRect().top + window.scrollY;
    };

    let ticking = false;
    const update = () => {
      ticking = false;
      const scrollSpace = docH - winH;
      if (scrollSpace <= 0) return set(1);
      const scrollY = window.scrollY;
      const rectTop = elTop - scrollY;
      const rectBased = 1 - rectTop / (winH * 0.6);
      const scrollBased = scrollY / (scrollSpace * 0.5);
      set(winH < 700 ? scrollBased : rectBased);
    };

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    };
    /* Refresh the cached geometry, but do NOT recompute progress here.
     *
     * The shipped hook only ever recalculates inside a scroll event. Opening
     * the gate takes the document from 844px to ~20,000px WITHOUT firing one,
     * so shipped behaviour is: the cards stay exactly as they were until the
     * visitor actually scrolls. Recomputing on resize looks like a bug fix and
     * is a choreography change — the deck visibly re-bunches the instant the
     * gate opens. Caught by the filmstrip: baseline held matrix(1,0,0,1,0,0)
     * where this returned matrix(0.990995, -0.0598424, ...).
     *
     * So: measure on resize, apply on scroll. Same output as shipped, minus the
     * per-frame layout read. */
    const onResize = () => measure();

    measure();
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);

    // documentElement's border box does not grow with overflow, so observe the
    // body — that is what actually changes height when the gate opens.
    const ro = new ResizeObserver(onResize);
    ro.observe(document.body);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      ro.disconnect();
    };
  }, []);

  return { ref, progress: null as number | null };
}
