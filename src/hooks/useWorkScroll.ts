"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { WORK_LANDING, WORK_SCROLL_CONFIG } from "@/data/work";
import { getCdState, LERP_SPEED } from "@/hooks/cdChoreography";
import {
  readDiscMode,
  recordReadCost,
  subscribeDiscMode,
} from "@/components/mobile-scroll-lab/disc-scroll-probe";
import {
  makeSmoother,
  techniqueRunsLoop,
  techniqueUsesCache,
} from "@/components/mobile-scroll-lab/disc-techniques";

interface WorkScrollState {
  screenIndex: number;
  activeLabel: string;
  hintHidden: boolean;
}

export function useWorkScroll() {
  const ref = useRef<HTMLElement>(null);
  const [state, setState] = useState<WorkScrollState>({
    screenIndex: 0,
    activeLabel: WORK_LANDING.activeLabel,
    hintHidden: false,
  });

  const screenBreaks = useMemo(() => WORK_SCROLL_CONFIG.screenBreaks, []);
  const zones = useMemo(() => WORK_SCROLL_CONFIG.zones, []);

  /* Lets the mobile scroll lab tear down and re-arm the loop when the HUD
     switches arms, so all three can be compared in one session on one device.
     Compiled to a no-op in production: nothing ever calls setDiscMode there. */
  const [discArm, setDiscArm] = useState(0);
  useEffect(() => {
    if (process.env.NODE_ENV !== "development") return;
    return subscribeDiscMode(() => setDiscArm((n) => n + 1));
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const mq = window.matchMedia(
      "(max-width: 640px) and (hover: none), (max-width: 640px) and (pointer: coarse)"
    );

    /* Phones keep the disc frozen: the loop never starts, so nothing reads
       layout while the user flicks through 20,000px of document.

       The mobile scroll lab is the only thing that lifts this, and only under
       `npm run dev` — see disc-scroll-probe.ts. `readDiscMode()` returns "off"
       in production unconditionally, so this branch is exactly what shipped. */
    /* Every lab call below hangs off this. In a production build it folds to
       `false`, the branches that reach into the lab modules become unreachable,
       and the technique table stops being bundled — which is not theoretical:
       it shipped once, and the export was grepped to prove it stopped. */
    const LAB = process.env.NODE_ENV === "development";
    const discMode = LAB ? readDiscMode() : "off";
    /* Two separate reasons the loop might not run, and they are not the same
       condition. `native` never runs it, on any device, because CSS is already
       driving the disc. `off` is the shipped build, which runs the loop on
       desktop and freezes it on phones — so that one is gated on the device. */
    if ((LAB && !techniqueRunsLoop(discMode)) || (mq.matches && discMode === "off")) {
      if (LAB) {
        // Leaving a JS arm: drop the inline transform it left behind, or the
        // disc stays frozen mid-turn under whatever runs next.
        el.querySelector<HTMLElement>(".cd-disc")?.style.removeProperty("transform");
      }
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

    /* Shipped read. Two layout queries per frame, and the tick writes the
       disc's transform before the next one, so each is a forced synchronous
       layout against the full document. Desktop has always paid this. */
    const getProgressByRect = () => {
      const rect = el.getBoundingClientRect();
      const scrollHeight = Math.max(el.offsetHeight - window.innerHeight, 0);
      const scrolled = Math.max(0, Math.min(scrollHeight, -rect.top));
      return scrollHeight > 0 ? scrolled / scrollHeight : 0;
    };

    /* Lab arm "cached" — identical arithmetic, no layout read in the frame.
       `-rect.top` is `scrollY - elTop` by definition, and the section's height
       only changes when something resizes, so both are measured outside the
       scroll path and re-measured when they can actually have changed. */
    let elTop = 0;
    let elHeight = 0;
    let winH = 0;
    const measure = () => {
      elTop = el.getBoundingClientRect().top + window.scrollY;
      elHeight = el.offsetHeight;
      winH = window.innerHeight;
    };

    const getProgressCached = () => {
      const scrollHeight = Math.max(elHeight - winH, 0);
      const scrolled = Math.max(0, Math.min(scrollHeight, window.scrollY - elTop));
      return scrollHeight > 0 ? scrolled / scrollHeight : 0;
    };

    const usesCachedGeometry = LAB && techniqueUsesCache(discMode);
    const getProgress = usesCachedGeometry ? getProgressCached : getProgressByRect;

    let ro: ResizeObserver | undefined;
    if (usesCachedGeometry) {
      measure();
      window.addEventListener("resize", measure);
      /* The Work section grows as its chapters mount, and the URL bar
         collapsing mid-scroll changes innerHeight without a resize event on
         some mobile browsers — observe the element itself as well. */
      ro = new ResizeObserver(measure);
      ro.observe(el);
    }

    /* Read-cost accounting for the lab. False on every shipped path, so the
       tick below does byte-for-byte the work it does today. Frame cadence is
       measured by the HUD instead — it has to exist in the `off` arm too,
       where this loop never runs. */
    const instrument = discMode !== "off";

    /* How the written angle follows the curve. Shipped is the lerp; the lab's
       `direct` and `freewheel` arms swap only this, so a difference between
       them is a difference in feel and not in choreography. */
    const smooth = LAB && discMode !== "off" ? makeSmoother(discMode, reduceMotion) : null;

    const tick = () => {
      let progress: number;
      if (instrument) {
        /* a→b times nothing and b→c times the read, on the same frame and in
           the same cold state. Reporting c-b alone measures the clock as much
           as the geometry, which is how both arms first came back identical. */
        const a = performance.now();
        const b = performance.now();
        progress = getProgress();
        const c = performance.now();
        recordReadCost(c - b, b - a);
      } else {
        progress = getProgress();
      }

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

      currentDeg = smooth
        ? smooth(currentDeg, targetDeg, progress)
        : currentDeg + (targetDeg - currentDeg) * (reduceMotion ? 1 : LERP_SPEED);

      /* Only the position-mapped arms settle onto the target — freewheel is an
         impulse model and never converges on one, so snapping it would delete
         the coast that is the whole point of it. */
      if (discMode !== "freewheel" && Math.abs(targetDeg - currentDeg) < 0.01) {
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
      if (ro) {
        ro.disconnect();
        window.removeEventListener("resize", measure);
      }
    };
  }, [screenBreaks, zones, discArm]);

  return { ref, ...state };
}
