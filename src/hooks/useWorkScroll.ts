"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { WORK_LANDING, WORK_SCROLL_CONFIG, type WorkScrollZone } from "@/data/work";

interface WorkScrollState {
  screenIndex: number;
  activeLabel: string;
  hintHidden: boolean;
}

/* Phones: no scroll-lock, no sticky chapters — globals.css:1279 puts the whole
   Work section back into normal flow. The disc still spins here, but off a
   different mapping (see `phoneTick`). */
const PHONE_MQ =
  "(max-width: 640px) and (hover: none), (max-width: 640px) and (pointer: coarse)";

/* How far the disc turns across one full pass of the CD through a phone
   viewport. Desktop's landing arc is one -360 turn, so 1.5 turns keeps it
   recognisably the same object while staying legible against a fast flick —
   and the sign matches, so the disc always turns the same way on every device. */
const PHONE_SWEEP_DEG = -540;

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

  /* Tracked as state rather than read once inside the loop effect, so a
     portrait→landscape rotation that crosses 640px tears down the wrong loop
     and builds the right one. `null` = not measured yet; the loop effect sits
     out that first tick so a phone never briefly runs the scroll-lock branch
     and flashes an active TOC row. */
  const [isPhone, setIsPhone] = useState<boolean | null>(null);

  useEffect(() => {
    const mq = window.matchMedia(PHONE_MQ);
    const update = () => setIsPhone(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  const screenBreaks = useMemo(() => WORK_SCROLL_CONFIG.screenBreaks, []);
  const zones = useMemo(() => WORK_SCROLL_CONFIG.zones, []);

  useEffect(() => {
    const el = ref.current;
    if (!el || isPhone === null) return;

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

    const applyDeg = () => {
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
    };

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

      applyDeg();

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

    /* The CD player block on phones — the thing the phone mapping tracks, and
       the element worth observing (the section itself is many screens tall, so
       observing it would run the loop long after the disc is gone). */
    const cdEl = isPhone ? el.querySelector<HTMLElement>(".cd-player-wrap") : null;

    /* Phone spin. The chapter mapping above is meaningless here: with the
       scroll-lock gone the disc would be pinned to whole-section progress and
       barely move across the short window where it is actually on screen, at
       an angle set by chapters the reader has not reached. So map the CD's OWN
       travel through the viewport instead — 0 as its top edge enters at the
       bottom, 1 as its bottom edge leaves at the top. Same scroll-position
       mapping, same lerp, same reduced-motion snap; only the input differs. */
    const phoneTick = () => {
      const rect = cdEl!.getBoundingClientRect();
      const travel = window.innerHeight + rect.height;
      const p = travel > 0 ? clamp01((window.innerHeight - rect.top) / travel) : 0;

      targetDeg = p * PHONE_SWEEP_DEG;
      applyDeg();

      rafId = requestAnimationFrame(phoneTick);
    };

    if (isPhone) {
      /* Chapter state stays exactly as it was: no scroll-lock means no active
         chapter, which is what renders the tracklist as a static TOC
         (globals.css:1370) and hides the scroll hint. Only the disc changes. */
      setState({ screenIndex: -1, activeLabel: "", hintHidden: true });
      if (!cdEl || !discEl) return;
    }

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

    const frame = isPhone ? phoneTick : tick;

    const start = () => {
      if (running || !onScreen || document.hidden) return;
      running = true;
      rafId = requestAnimationFrame(frame);
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
    io.observe(isPhone && cdEl ? cdEl : el);

    const onVisibility = () => (document.hidden ? stop() : start());
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      stop();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [screenBreaks, zones, isPhone]);

  return { ref, ...state };
}
