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
      // On mobile, cards may already be in view on load.
      // Use the distance the user has scrolled relative to the scroll space below the fold.
      const scrollY = window.scrollY || window.pageYOffset;
      const docH = document.documentElement.scrollHeight;
      const scrollSpace = docH - windowH;

      if (scrollSpace <= 0) {
        // No scroll space available — show unbunched
        setProgress(1);
      } else {
        // Use a blend: primarily scroll-based on mobile, rect-based on desktop
        const rectBased = 1 - rect.top / (windowH * 0.6);
        const scrollBased = scrollY / (scrollSpace * 0.5); // unbunch within first 50% of scroll

        // On small screens (mobile), prefer scroll-based to avoid starting already unbunched
        const isMobile = windowH < 700;
        const raw = isMobile ? scrollBased : rectBased;
        setProgress(Math.min(Math.max(raw, 0), 1));
      }
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
