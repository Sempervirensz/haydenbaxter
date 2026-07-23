"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { RevealTrigger } from "@/data/consultingHeroLab";

interface Params {
  trigger: RevealTrigger;
  resetKey: string;
  motionIntensity: number;
}

export function useConsultingReveal({ trigger, resetKey, motionIntensity }: Params) {
  const [revealed, setRevealed] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  const reveal = useCallback(() => setRevealed(true), []);
  const reset = useCallback(() => setRevealed(false), []);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReducedMotion(media.matches);
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    setRevealed(false);
  }, [resetKey]);

  useEffect(() => {
    if (trigger !== "scroll" || revealed) return;
    const onScroll = () => {
      if (window.scrollY > 80) setRevealed(true);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [trigger, revealed]);

  const animate = useMemo(() => !reducedMotion && motionIntensity > 0, [reducedMotion, motionIntensity]);

  return { revealed, reveal, reset, animate };
}
