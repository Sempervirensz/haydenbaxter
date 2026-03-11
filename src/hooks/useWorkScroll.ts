"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { WORK_LANDING, WORK_SCROLL_CONFIG, type WorkScrollZone } from "@/data/work";

interface WorkScrollState {
  screenIndex: number;
  cdDeg: number;
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

export function useWorkScroll() {
  const ref = useRef<HTMLElement>(null);
  const [state, setState] = useState<WorkScrollState>({
    screenIndex: 0,
    cdDeg: 0,
    activeLabel: WORK_LANDING.activeLabel,
    hintHidden: false,
  });

  const screenBreaks = useMemo(() => WORK_SCROLL_CONFIG.screenBreaks, []);
  const zones = useMemo(() => WORK_SCROLL_CONFIG.zones, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // On mobile, skip scroll-driven interaction — CSS handles layout
    const mq = window.matchMedia("(max-width: 640px)");
    if (mq.matches) {
      setState({ screenIndex: -1, cdDeg: 0, activeLabel: "", hintHidden: true });
      return;
    }

    let ticking = false;

    const update = () => {
      const rect = el.getBoundingClientRect();
      const scrollHeight = Math.max(el.offsetHeight - window.innerHeight, 0);
      const scrolled = Math.max(0, Math.min(scrollHeight, -rect.top));
      const progress = scrollHeight > 0 ? scrolled / scrollHeight : 0;

      let nextScreenIndex = 0;
      for (let i = 1; i < screenBreaks.length; i += 1) {
        if (progress >= screenBreaks[i]) nextScreenIndex = i;
      }

      const maxScreenIndex = screenBreaks.length - 2;
      nextScreenIndex = Math.min(maxScreenIndex, nextScreenIndex);

      const nextHintHidden = progress > 0.08;

      setState((prev) => {
        let nextCdDeg = prev.cdDeg;
        let nextLabel = prev.activeLabel;

        if (nextScreenIndex === 0) {
          const firstBreak = screenBreaks[1] || 1;
          const landingProgress = firstBreak > 0 ? progress / firstBreak : 0;
          const cdState = getCdState(landingProgress, zones);
          nextCdDeg = cdState.deg;
          nextLabel = cdState.label;
        }

        if (
          prev.screenIndex === nextScreenIndex &&
          prev.hintHidden === nextHintHidden &&
          prev.cdDeg === nextCdDeg &&
          prev.activeLabel === nextLabel
        ) {
          return prev;
        }

        return {
          screenIndex: nextScreenIndex,
          cdDeg: nextCdDeg,
          activeLabel: nextLabel,
          hintHidden: nextHintHidden,
        };
      });

      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, [screenBreaks, zones]);

  return { ref, ...state };
}
