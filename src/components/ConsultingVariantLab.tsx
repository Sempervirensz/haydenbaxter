"use client";

import { useMemo, useState } from "react";
import {
  DEFAULT_HERO_LAB_STATE,
  VARIANT_PRESETS,
  type HeroLabState,
  type HeroVariant,
} from "@/data/consultingHeroLab";
import ConsultingLabControls from "./consulting-lab/ConsultingLabControls";
import ConsultingHeroRenderer from "./consulting-lab/ConsultingHeroRenderer";
import { useConsultingReveal } from "./consulting-lab/useConsultingReveal";
import "./consulting-lab.css";

export default function ConsultingVariantLab() {
  const [state, setState] = useState<HeroLabState>(DEFAULT_HERO_LAB_STATE);

  const resetKey = useMemo(
    () => [state.variant, state.revealTrigger, state.revealAnimation, state.pathLayout].join("|"),
    [state.pathLayout, state.revealAnimation, state.revealTrigger, state.variant]
  );

  const { revealed, reveal, reset, animate } = useConsultingReveal({
    trigger: state.revealTrigger,
    resetKey,
    motionIntensity: state.motionIntensity,
  });

  function update(partial: Partial<HeroLabState>) {
    setState((prev) => ({ ...prev, ...partial }));
  }

  function onVariantChange(variant: HeroVariant) {
    const preset = VARIANT_PRESETS[variant];
    setState((prev) => ({
      ...prev,
      variant,
      thesisLine: preset.thesisLine,
      supportLineEnabled: preset.supportLineEnabled,
      supportLineText: preset.supportLineText,
      buttonLabel: preset.buttonLabel,
      revealAnimation: variant === "cinematicThesis" ? "slideUp" : prev.revealAnimation,
      pathLayout: variant === "cinematicThesis" ? "horizontal" : prev.pathLayout,
    }));
    reset();
  }

  function onPrimaryAction() {
    if (state.revealTrigger === "click") {
      if (revealed) {
        reset();
        return;
      }
      reveal();
    }
  }

  return (
    <main className="heroLab-root">
      <ConsultingLabControls state={state} onChange={update} onVariantChange={onVariantChange} />
      <div className="heroLab-stageWrap">
        <ConsultingHeroRenderer state={state} revealed={revealed} animate={animate} onReveal={onPrimaryAction} />
      </div>
    </main>
  );
}
