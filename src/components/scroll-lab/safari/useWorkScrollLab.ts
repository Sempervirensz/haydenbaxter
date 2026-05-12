"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { WORK_LANDING, WORK_SCROLL_CONFIG, type WorkScrollZone } from "@/data/work";
import type { CdTransformMode, ScrollHookMode } from "./config";

interface WorkScrollState {
  screenIndex: number;
  activeLabel: string;
  hintHidden: boolean;
}

function ease(t: number): number {
  return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
}

function clamp01(v: number) {
  return Math.max(0, Math.min(1, v));
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
    return { deg: last.deg - extra * extra * 720, label: last.label };
  }

  for (let i = 0; i < zones.length - 1; i += 1) {
    const a = zones[i];
    const b = zones[i + 1];
    if (p > a.hold[1] && p < b.hold[0]) {
      const t = ease((p - a.hold[1]) / (b.hold[0] - a.hold[1]));
      return { deg: a.deg + (b.deg - a.deg) * t, label: t < 0.5 ? a.label : b.label };
    }
  }

  return { deg: 0, label: WORK_LANDING.activeLabel };
}

const LERP_SPEED = 0.08;

export function useWorkScrollLab(opts: {
  mode: ScrollHookMode;
  cdTransform: CdTransformMode;
}) {
  const { mode, cdTransform } = opts;
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
      "(max-width: 640px) and (hover: none), (max-width: 640px) and (pointer: coarse)",
    );
    if (mq.matches) {
      setState({ screenIndex: -1, activeLabel: "", hintHidden: true });
      return;
    }

    let targetDeg = 0;
    let currentDeg = 0;
    let rafId = 0;
    let lerping = false;
    let lastScreenIndex = 0;
    let lastLabel = WORK_LANDING.activeLabel;
    let lastStateLabel = WORK_LANDING.activeLabel;
    let lastHintHidden = false;

    // Cache layout-dependent measurements; refresh on resize. Avoids
    // getBoundingClientRect in the hot path.
    let sectionTop = 0;
    let sectionHeight = 0;
    const measure = () => {
      const rect = el.getBoundingClientRect();
      sectionTop = rect.top + window.scrollY;
      sectionHeight = el.offsetHeight;
    };
    measure();

    const discEl = el.querySelector<HTMLElement>(".cd-disc");
    const labelEl = el.querySelector<HTMLElement>(".cd-active-label");

    const writeDisc = (deg: number) => {
      if (!discEl) return;
      if (cdTransform === "direct-transform") {
        discEl.style.transform = `translateZ(0) rotate(${deg}deg)`;
      } else {
        discEl.style.setProperty("--cd-deg", `${deg}deg`);
      }
    };

    const computeProgress = () => {
      const scrollable = Math.max(sectionHeight - window.innerHeight, 0);
      const scrolled = Math.max(0, Math.min(scrollable, window.scrollY - sectionTop));
      return scrollable > 0 ? scrolled / scrollable : 0;
    };

    const updateZones = (progress: number) => {
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
    };

    const stepLerp = () => {
      currentDeg += (targetDeg - currentDeg) * LERP_SPEED;
      const settled = Math.abs(targetDeg - currentDeg) < 0.01;
      if (settled) currentDeg = targetDeg;

      writeDisc(currentDeg);

      if (!settled) {
        rafId = requestAnimationFrame(stepLerp);
      } else {
        lerping = false;
        rafId = 0;
      }
    };

    const kickLerp = () => {
      if (lerping) return;
      lerping = true;
      rafId = requestAnimationFrame(stepLerp);
    };

    // ── Mode: raf-always — original behaviour, full RAF loop ──
    const tickAlways = () => {
      const p = computeProgress();
      updateZones(p);
      currentDeg += (targetDeg - currentDeg) * LERP_SPEED;
      if (Math.abs(targetDeg - currentDeg) < 0.01) currentDeg = targetDeg;
      writeDisc(currentDeg);
      rafId = requestAnimationFrame(tickAlways);
    };

    // ── Mode: raf-while-lerping — passive scroll updates zones, RAF only animates the disc to its target ──
    const onScrollLerping = () => {
      const p = computeProgress();
      updateZones(p);
      kickLerp();
    };

    // ── Mode: passive-scroll-only — snap CD on each scroll event, no rAF lerp at all ──
    const onScrollPassive = () => {
      const p = computeProgress();
      updateZones(p);
      writeDisc(targetDeg);
    };

    const onResize = () => measure();

    if (mode === "raf-always") {
      rafId = requestAnimationFrame(tickAlways);
    } else if (mode === "raf-while-lerping") {
      window.addEventListener("scroll", onScrollLerping, { passive: true });
      onScrollLerping();
    } else {
      window.addEventListener("scroll", onScrollPassive, { passive: true });
      onScrollPassive();
    }

    window.addEventListener("resize", onResize);

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      window.removeEventListener("scroll", onScrollLerping);
      window.removeEventListener("scroll", onScrollPassive);
      window.removeEventListener("resize", onResize);
    };
  }, [mode, cdTransform, screenBreaks, zones]);

  return { ref, ...state };
}
