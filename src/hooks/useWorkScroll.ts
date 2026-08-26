"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { WORK_LANDING, WORK_SCROLL_CONFIG, type WorkScrollZone } from "@/data/work";

interface WorkScrollState {
  screenIndex: number;
  activeLabel: string;
  hintHidden: boolean;
}

function ease(t: number): number {
  return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
}

function clamp01(value: number): number {
  return Math.max(0, Math.min(1, value));
}

function getCdState(progress: number, zones: WorkScrollZone[]) {
  const p = clamp01(progress);

  for (const zone of zones) {
    if (p >= zone.hold[0] && p <= zone.hold[1]) {
      return { deg: zone.deg, label: zone.label };
    }
  }

  const last = zones[zones.length - 1];
  if (p > last.hold[1]) {
    const extra = (p - last.hold[1]) / (1 - last.hold[1]);
    return {
      deg: last.deg - extra * extra * 720,
      label: last.label,
    };
  }

  for (let i = 0; i < zones.length - 1; i += 1) {
    const start = zones[i];
    const end = zones[i + 1];
    const tStart = start.hold[1];
    const tEnd = end.hold[0];

    if (p > tStart && p < tEnd) {
      const t = ease((p - tStart) / (tEnd - tStart));
      return {
        deg: start.deg + (end.deg - start.deg) * t,
        label: t < 0.5 ? start.label : end.label,
      };
    }
  }

  return { deg: 0, label: WORK_LANDING.activeLabel };
}

const LERP_SPEED = 0.08;

export function useWorkScroll() {
  const ref = useRef<HTMLElement>(null);
  const [state, setState] = useState<WorkScrollState>({
    screenIndex: 0,
    activeLabel: WORK_LANDING.activeLabel,
    hintHidden: false,
  });

  const screenBreaks = useMemo(() => WORK_SCROLL_CONFIG.screenBreaks, []);
  const zones = useMemo(() => WORK_SCROLL_CONFIG.zones, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const mq = window.matchMedia(
      "(max-width: 640px) and (hover: none), (max-width: 640px) and (pointer: coarse)"
    );
    if (mq.matches) {
      setState({ screenIndex: -1, activeLabel: "", hintHidden: true });
      return;
    }

    /* ETB-P2-02 — the CD lerp keeps moving after the user stops scrolling, which
       is motion, not a scroll-position mapping. `.claude/rules/perf-a11y.md`
       requires every animation to respect this; useCinematicParallax.ts already
       does. Under `reduce` the disc snaps to its scroll position instead. */
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let targetDeg = 0;
    let currentDeg = 0;
    let rafId = 0;
    let lastScreenIndex = 0;
    let lastLabel = WORK_LANDING.activeLabel;
    let lastStateLabel = WORK_LANDING.activeLabel;
    let lastHintHidden = false;

    const discEl = el.querySelector<HTMLElement>(".cd-disc");
    const labelEl = el.querySelector<HTMLElement>(".cd-active-label");

    const getProgress = () => {
      const rect = el.getBoundingClientRect();
      const scrollHeight = Math.max(el.offsetHeight - window.innerHeight, 0);
      const scrolled = Math.max(0, Math.min(scrollHeight, -rect.top));
      return scrollHeight > 0 ? scrolled / scrollHeight : 0;
    };

    const tick = () => {
      const progress = getProgress();

      let nextScreenIndex = 0;
      for (let i = 1; i < screenBreaks.length; i += 1) {
        if (progress >= screenBreaks[i]) nextScreenIndex = i;
      }
      const maxScreenIndex = screenBreaks.length - 2;
      nextScreenIndex = Math.min(maxScreenIndex, nextScreenIndex);

      const nextHintHidden = progress > 0.08;

      if (nextScreenIndex === 0) {
        const firstBreak = screenBreaks[1] || 1;
        const landingProgress = firstBreak > 0 ? progress / firstBreak : 0;
        const cdState = getCdState(landingProgress, zones);
        targetDeg = cdState.deg;

        if (cdState.label !== lastLabel) {
          lastLabel = cdState.label;
          if (labelEl) labelEl.textContent = lastLabel;
        }
      }

      currentDeg += (targetDeg - currentDeg) * (reduceMotion ? 1 : LERP_SPEED);

      if (Math.abs(targetDeg - currentDeg) < 0.01) {
        currentDeg = targetDeg;
      }

      if (discEl) {
        // Direct transform write (rather than animating a CSS custom property
        // via `--cd-deg`) — Safari has a significant perf cliff animating
        // `rotate(var(--prop))` per frame. Chrome is equally fast either way.
        discEl.style.transform = `translateZ(0) rotate(${currentDeg}deg)`;
      }

      if (
        nextScreenIndex !== lastScreenIndex ||
        nextHintHidden !== lastHintHidden ||
        lastLabel !== lastStateLabel
      ) {
        lastScreenIndex = nextScreenIndex;
        lastHintHidden = nextHintHidden;
        lastStateLabel = lastLabel;
        setState({
          screenIndex: nextScreenIndex,
          activeLabel: lastLabel,
          hintHidden: nextHintHidden,
        });
      }

      rafId = requestAnimationFrame(tick);
    };

    /* ETB-P2-01 — this loop used to run unconditionally for the whole session.
       Measured while parked at the top of the page with Work entirely
       off-screen: 482 rAF callbacks and 241 getBoundingClientRect() calls every
       2 seconds — ~120 forced layout reads per second, forever, on a page the
       user may never scroll into. Gate it on visibility instead.

       Two conditions, because they fail differently: an IntersectionObserver
       covers "scrolled away from Work", and visibilitychange covers "switched
       tab", where rAF is throttled but not necessarily stopped. */
    let onScreen = false;
    let running = false;

    const start = () => {
      if (running || !onScreen || document.hidden) return;
      running = true;
      rafId = requestAnimationFrame(tick);
    };
    const stop = () => {
      if (!running) return;
      running = false;
      cancelAnimationFrame(rafId);
    };

    const io = new IntersectionObserver(
      (entries) => {
        onScreen = entries.some((e) => e.isIntersecting);
        if (onScreen) start();
        else stop();
      },
      // A generous margin so the disc is already settled by the time the
      // section edges into view, rather than snapping on entry.
      { rootMargin: "200px 0px" }
    );
    io.observe(el);

    const onVisibility = () => (document.hidden ? stop() : start());
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      stop();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [screenBreaks, zones]);

  return { ref, ...state };
}
