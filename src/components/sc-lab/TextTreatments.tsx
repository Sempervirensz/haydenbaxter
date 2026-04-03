"use client";

import { useEffect, useRef, useState } from "react";
import type { QuoteLine, TextMode, FontMode, MotionLevel } from "@/data/scLab";
import { CHOREOGRAPHY_TIMING } from "@/data/scLab";

interface TextTreatmentsProps {
  lines: QuoteLine[];
  mode: TextMode;
  fontMode?: FontMode;
  motionLevel: MotionLevel;
  className?: string;
  /** Called when a line becomes active (hover, animation, click) */
  onLineActivate?: (lineIndex: number) => void;
  /** Auto-cycle through lines using choreography timing */
  autoPlay?: boolean;
}

export default function TextTreatments({
  lines,
  mode,
  fontMode = "mixed",
  motionLevel,
  className = "",
  onLineActivate,
  autoPlay = false,
}: TextTreatmentsProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const onLineActivateRef = useRef(onLineActivate);
  onLineActivateRef.current = onLineActivate;
  const [activeIdx, setActiveIdx] = useState<number | null>(null);

  // Wrapper that fires callback AND tracks local active index
  const activateRef = useRef((i: number) => {
    setActiveIdx(i);
    onLineActivateRef.current?.(i);
  });
  activateRef.current = (i: number) => {
    setActiveIdx(i);
    onLineActivateRef.current?.(i);
  };

  // Effective mode: fall back to static when motion is off
  const effectiveMode = motionLevel === "off" ? "static" : mode;

  // Glow mode: pointer tracking + line activation
  useEffect(() => {
    const el = containerRef.current;
    if (!el || effectiveMode !== "glow") return;

    const lineEls = Array.from(
      el.querySelectorAll<HTMLElement>(".scLab-line")
    );

    // Touch fallback
    const isCoarse = window.matchMedia(
      "(hover: none), (pointer: coarse)"
    ).matches;

    if (isCoarse) {
      let clearTimer: number | undefined;
      const handlers = lineEls.map((line, i) => {
        const onClick = () => {
          lineEls.forEach((l) => l.classList.remove("is-active"));
          line.classList.add("is-active");
          activateRef.current(i);
          if (clearTimer) window.clearTimeout(clearTimer);
          clearTimer = window.setTimeout(() => {
            lineEls.forEach((l) => l.classList.remove("is-active"));
          }, 1800);
        };
        line.addEventListener("click", onClick);
        return () => line.removeEventListener("click", onClick);
      });

      return () => {
        handlers.forEach((d) => d());
        if (clearTimer) window.clearTimeout(clearTimer);
      };
    }

    // Desktop: hover activates line
    const handlers = lineEls.map((line, i) => {
      const onEnter = () => activateRef.current(i);
      line.addEventListener("mouseenter", onEnter);
      return () => line.removeEventListener("mouseenter", onEnter);
    });

    return () => handlers.forEach((d) => d());
  }, [effectiveMode]);

  // Static mode: hover-based line activation for choreography
  useEffect(() => {
    const el = containerRef.current;
    if (!el || effectiveMode !== "static") return;

    const lineEls = Array.from(
      el.querySelectorAll<HTMLElement>(".scLab-line")
    );

    const handlers = lineEls.map((line, i) => {
      const onEnter = () => activateRef.current(i);
      line.addEventListener("mouseenter", onEnter);
      return () => line.removeEventListener("mouseenter", onEnter);
    });

    return () => handlers.forEach((d) => d());
  }, [effectiveMode]);

  // Stagger mode: fire onLineActivate on animation end per line
  useEffect(() => {
    const el = containerRef.current;
    if (!el || effectiveMode !== "stagger") return;

    const lineEls = Array.from(
      el.querySelectorAll<HTMLElement>(".scLab-line")
    );

    const handlers = lineEls.map((line, i) => {
      const onEnd = () => activateRef.current(i);
      line.addEventListener("animationend", onEnd);
      return () => line.removeEventListener("animationend", onEnd);
    });

    // Also fire line 0 immediately since it starts first
    activateRef.current(0);

    return () => handlers.forEach((d) => d());
  }, [effectiveMode]);

  // Cycle mode: timer-based activation (3s per line)
  useEffect(() => {
    if (effectiveMode !== "cycle") return;
    const total = lines.length;
    let idx = 0;
    activateRef.current(0);
    const interval = setInterval(() => {
      idx = (idx + 1) % total;
      activateRef.current(idx);
    }, 3000);
    return () => clearInterval(interval);
  }, [effectiveMode, lines.length]);

  // Typewriter mode: fire activation with staggered delays matching CSS
  useEffect(() => {
    if (effectiveMode !== "typewriter") return;
    const timers: number[] = [];
    lines.forEach((_, i) => {
      // Each line starts 1.2s after the previous (matching CSS stagger)
      const t = window.setTimeout(() => {
        activateRef.current(i);
      }, i * 1200);
      timers.push(t);
    });
    activateRef.current(0);
    return () => timers.forEach((t) => window.clearTimeout(t));
  }, [effectiveMode, lines.length]);

  // Dossier mode: hover activation
  useEffect(() => {
    const el = containerRef.current;
    if (!el || effectiveMode !== "dossier") return;

    const lineEls = Array.from(
      el.querySelectorAll<HTMLElement>(".scLab-line")
    );

    const handlers = lineEls.map((line, i) => {
      const onEnter = () => activateRef.current(i);
      line.addEventListener("mouseenter", onEnter);
      return () => line.removeEventListener("mouseenter", onEnter);
    });

    return () => handlers.forEach((d) => d());
  }, [effectiveMode]);

  // Auto-play: cycle through lines with choreography timing
  useEffect(() => {
    if (!autoPlay || !onLineActivate || motionLevel === "off") return;
    let idx = 0;
    activateRef.current(0);

    const scheduleNext = () => {
      const delay = CHOREOGRAPHY_TIMING[idx] ?? 3000;
      return window.setTimeout(() => {
        idx = (idx + 1) % lines.length;
        activateRef.current(idx);
        timerId = scheduleNext();
      }, delay);
    };

    let timerId = scheduleNext();
    return () => window.clearTimeout(timerId);
  }, [autoPlay, motionLevel, lines.length, onLineActivate]);

  // Re-trigger stagger animation on mode/key change
  const staggerKey =
    effectiveMode === "stagger" ? `stagger-${Date.now()}` : undefined;

  return (
    <div
      ref={containerRef}
      className={`scLab-text scLab-text--${effectiveMode} scLab-font--${fontMode} ${className}`}
      key={staggerKey}
    >
      {lines.map((line, i) => (
        <div
          key={`${line.text}-${i}`}
          className={`scLab-line scLab-line--${line.style}${onLineActivate && activeIdx === i ? " is-globe-active" : ""}`}
          tabIndex={effectiveMode === "glow" ? 0 : undefined}
          style={{ cursor: onLineActivate ? "pointer" : undefined }}
        >
          {line.text}
        </div>
      ))}
    </div>
  );
}
