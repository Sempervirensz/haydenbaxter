"use client";

// CTA Interaction Lab — shell.
//
// Owns the lab settings and one flow state, renders one or two stages against
// it. Nothing here is production code; the whole thing lives behind /cta-lab.

import { useCallback, useState } from "react";
import type { ConceptId } from "@/data/ctaLab";
import LabControls, { type LabSettings } from "./LabControls";
import StageFrame from "./StageFrame";
import { useCtaFlow } from "./useCtaFlow";
import { usePrefersReducedMotion } from "./usePrefersReducedMotion";
import "./cta-lab.css";

const DEFAULT_SETTINGS: LabSettings = {
  // Rail is the production candidate, so it's what the lab opens on.
  concept: "rail" as ConceptId,
  viewport: "desktop",
  forceReducedMotion: false,
  sectionLabel: "consulting",
};

export default function CtaLab() {
  const [settings, setSettings] = useState<LabSettings>(DEFAULT_SETTINGS);
  const [panelOpen, setPanelOpen] = useState(true);
  const flow = useCtaFlow();
  const osReducedMotion = usePrefersReducedMotion();

  const reducedMotion = osReducedMotion || settings.forceReducedMotion;

  const change = useCallback(
    <K extends keyof LabSettings>(key: K, value: LabSettings[K]) => {
      setSettings((s) => ({ ...s, [key]: value }));
    },
    []
  );

  const stageProps = {
    concept: settings.concept,
    flow,
    reducedMotion,
    sectionLabel: settings.sectionLabel,
  };

  return (
    <main className="ctal-root" data-viewport={settings.viewport}>
      <div className="ctal-stages">
        {settings.viewport !== "narrow" && (
          <StageFrame {...stageProps} width="desktop" primary />
        )}
        {settings.viewport !== "desktop" && (
          <StageFrame
            {...stageProps}
            width="narrow"
            // In "both", the desktop stage is primary — only one takes focus.
            primary={settings.viewport === "narrow"}
          />
        )}
      </div>

      <LabControls
        settings={settings}
        onChange={change}
        open={panelOpen}
        onToggleOpen={() => setPanelOpen((o) => !o)}
        stateLabel={flow.label}
        osReducedMotion={osReducedMotion}
        onReset={flow.reset}
        onBack={flow.back}
        canGoBack={flow.state.step !== "intro"}
      />
    </main>
  );
}
