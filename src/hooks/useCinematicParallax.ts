"use client";

// Cinematic parallax engine — one rAF loop that drives the depth handoff for a
// stack of cinematic cards. Shared by the standalone lab stack
// (CinematicWorkStack) and the merged Work section (WorkSectionCinematic) so
// they never drift apart.
//
// For every [data-cstack-chapter] under `rootRef` it:
//   - sinks + dims the inner .cstack__card as the next chapter covers it
//   - drifts the hero image (.cstack__heroImg), caption (.cstack__caption), and
//     the Consulting cityscape (.cht-bg) as the card travels through its track
//
// `getMultiplier` returns the motion strength (0 = off, 1 = full); defaults to 1
// so production needs no controls. Respects prefers-reduced-motion (loop never
// starts; cards stay put).

import { useEffect, useRef, type RefObject } from "react";

function clamp(v: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, v));
}

export function useCinematicParallax(
  rootRef: RefObject<HTMLElement | null>,
  getMultiplier: () => number = () => 1
) {
  const mulRef = useRef(getMultiplier);
  mulRef.current = getMultiplier;

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) root.classList.add("cstack--off");

    let chapters: HTMLElement[] = [];
    let rafId = 0;
    let running = false;
    let vh = window.innerHeight;
    let vw = window.innerWidth;

    const collect = () => {
      chapters = Array.from(root.querySelectorAll<HTMLElement>("[data-cstack-chapter]"));
    };

    const tick = () => {
      const k = mulRef.current();

      for (let i = 0; i < chapters.length; i += 1) {
        const card = chapters[i].querySelector<HTMLElement>(".cstack__card");
        if (!card) continue;

        const next = chapters[i + 1];
        let p = 0;
        if (next) {
          const nr = next.getBoundingClientRect();
          p = clamp((vh * 0.92 - nr.top) / (vh * 0.8), 0, 1);
        }
        const sink = p * k;
        card.style.transform = `translate3d(0, ${-0.075 * sink * vh}px, 0) scale(${1 - 0.14 * sink})`;
        const dim = card.querySelector<HTMLElement>(".cstack__dim");
        if (dim) dim.style.opacity = String(0.72 * sink);

        const chr = chapters[i].getBoundingClientRect();
        const range = chr.height - vh;
        const cprog = range > 0 ? clamp(-chr.top / range, 0, 1) : 0.5;
        const drift = (cprog * 2 - 1) * k;
        // Tiered zoom: phones loose (full composition in frame), desktop richer.
        const heroBase = vw <= 600 ? 1.04 : vw <= 1024 ? 1.07 : 1.12;
        const hero = card.querySelector<HTMLElement>(".cstack__heroImg");
        if (hero) hero.style.transform = `scale(${heroBase}) translate3d(0, ${(drift * -3).toFixed(2)}%, 0)`;
        const cap = card.querySelector<HTMLElement>(".cstack__caption");
        if (cap) cap.style.transform = `translate3d(0, ${(drift * -14).toFixed(1)}px, 0)`;
        // Consulting cityscape — deeper drift (more zoom headroom + larger
        // travel) so the city reads with real dimension behind the reveal.
        const cht = card.querySelector<HTMLElement>(".cht-bg");
        if (cht) cht.style.transform = `scale(1.12) translate3d(0, ${(drift * -5).toFixed(2)}%, 0)`;
      }

      if (running) rafId = requestAnimationFrame(tick);
    };

    const onResize = () => {
      vh = window.innerHeight;
      vw = window.innerWidth;
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
      { rootMargin: "10% 0px" }
    );

    collect();
    if (!reduce) io.observe(root);
    window.addEventListener("resize", onResize);
    return () => {
      io.disconnect();
      running = false;
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", onResize);
    };
  }, [rootRef]);
}
