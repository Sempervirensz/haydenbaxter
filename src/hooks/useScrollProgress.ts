"use client";

import { useEffect, useRef, useState } from "react";

export function useScrollProgress() {
  const ref = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let ticking = false;

    const updateProgress = () => {
      const rect = el.getBoundingClientRect();
      const windowH = window.innerHeight;
      // Map: when deck bottom is at viewport bottom → 0 (bunched)
      //       when deck is fully in view → 1 (unbunched/straight)
      const raw = 1 - rect.top / (windowH * 0.6);
      setProgress(Math.min(Math.max(raw, 0), 1));
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(updateProgress);
        ticking = true;
      }
    };

    // Initial calculation
    updateProgress();

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return { ref, progress };
}
