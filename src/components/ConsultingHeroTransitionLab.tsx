"use client";

import { useCallback, useState } from "react";
import Controls from "./consulting-hero-transition/Controls";
import Stage from "./consulting-hero-transition/Stage";
import { DEFAULT_STATE, type HeroTransitionState } from "@/data/consultingHeroTransition";
import "./consulting-hero-transition.css";

export default function ConsultingHeroTransitionLab() {
  const [state, setState] = useState<HeroTransitionState>(DEFAULT_STATE);
  const [revealed, setRevealed] = useState(false);
  const [selectedOfferId, setSelectedOfferId] = useState<string | null>(null);
  const [replayKey, setReplayKey] = useState(0);

  const handleChange = useCallback(
    <K extends keyof HeroTransitionState>(key: K, value: HeroTransitionState[K]) => {
      setState((prev) => ({ ...prev, [key]: value }));
    },
    []
  );

  const handleReveal = useCallback(() => setRevealed(true), []);

  // Step back one stage: 3 → 2 (close dossier) or 2 → 1 (un-reveal).
  const handleBack = useCallback(() => {
    if (selectedOfferId) {
      setSelectedOfferId(null);
    } else if (revealed) {
      setRevealed(false);
    }
  }, [revealed, selectedOfferId]);

  const handleReplay = useCallback(() => {
    setRevealed(false);
    setSelectedOfferId(null);
    setReplayKey((k) => k + 1);
  }, []);

  return (
    <div className="cht-root">
      <Controls state={state} onChange={handleChange} onReplay={handleReplay} />
      <div className="cht-stageWrap">
        <Stage
          state={state}
          revealed={revealed}
          onReveal={handleReveal}
          selectedOfferId={selectedOfferId}
          onSelectOffer={setSelectedOfferId}
          onBack={handleBack}
          replayKey={replayKey}
        />
      </div>
    </div>
  );
}
