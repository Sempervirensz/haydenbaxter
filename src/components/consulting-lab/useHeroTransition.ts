"use client";

import { useCallback, useEffect, useState } from "react";

export function useHeroTransition() {
  const [revealed, setRevealed] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReducedMotion(media.matches);
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);

  const onExploreClick = useCallback(() => {
    setRevealed(true);
  }, []);

  return { revealed, reducedMotion, onExploreClick };
}
