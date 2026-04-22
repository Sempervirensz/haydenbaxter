"use client";

import { useCallback, useEffect, useState } from "react";
import Stage from "@/components/consulting-hero-transition/Stage";
import type { HeroTransitionState } from "@/data/consultingHeroTransition";
import "@/components/consulting-hero-transition.css";

const STAGE_STATE: HeroTransitionState = {
  textAnimation: "cursive",
  ctaStyle: "glass",
  buttonTreatment: "candy",
  dossierTransition: "float",
  overlayStrength: 30,
  buttonRise: 72,
  buttonStagger: 90,
};

export default function ConsultingHeroStage({ isActive }: { isActive?: boolean }) {
  const [revealed, setRevealed] = useState(false);
  const [selectedOfferId, setSelectedOfferId] = useState<string | null>(null);

  useEffect(() => {
    if (!isActive) {
      setRevealed(false);
      setSelectedOfferId(null);
    }
  }, [isActive]);

  const handleBack = useCallback(() => {
    if (selectedOfferId) setSelectedOfferId(null);
    else if (revealed) setRevealed(false);
  }, [revealed, selectedOfferId]);

  return (
    <section className="cns-photo cns-photo--hero">
      <Stage
        state={STAGE_STATE}
        revealed={revealed}
        onReveal={() => setRevealed(true)}
        selectedOfferId={selectedOfferId}
        onSelectOffer={setSelectedOfferId}
        onBack={handleBack}
        replayKey={0}
      />
    </section>
  );
}
