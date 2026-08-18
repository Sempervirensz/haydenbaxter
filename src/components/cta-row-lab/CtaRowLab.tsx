"use client";

// Direct CTA row — the lab at /cta-lab.
//
// The live section (`src/components/work/WorkTogether.tsx`) opens on the
// headline alone: the three paths only exist once you press it. This lab keeps
// the composition — same photograph, same serif headline low in the frame,
// same grain and vignette — and puts the three choices on screen immediately
// as a small button row underneath the headline.
//
// The shell owns the settings and nothing else. Every iteration renders through
// one `CtaRowStage`, so what differs between them is the skin and only the
// skin — the markup, the copy, the links, and the layout are identical, which
// is the whole point of comparing them here.
//
// Nothing on the live homepage imports any of this.

import { useCallback, useState } from "react";
import { DEFAULT_ACCENT, DEFAULT_VARIANT, type PathId } from "@/data/ctaRowLab";
import { usePrefersReducedMotion } from "@/components/cta-lab/usePrefersReducedMotion";
import CtaRowControls, { type LabSettings } from "./CtaRowControls";
import CtaRowStage from "./CtaRowStage";
import "@/components/work/work-together.css";
import "./cta-row-lab.css";

const DEFAULT_SETTINGS: LabSettings = {
  variant: DEFAULT_VARIANT,
  accent: DEFAULT_ACCENT,
  viewport: "desktop",
  forceReducedMotion: false,
};

export default function CtaRowLab() {
  const [settings, setSettings] = useState<LabSettings>(DEFAULT_SETTINGS);
  const [panelOpen, setPanelOpen] = useState(true);
  // Which destination screen is showing. Owned here, not by the stage: in a
  // side-by-side compare both widths must show ONE state, and switching
  // viewport mode unmounts a stage, which would otherwise drop the screen.
  const [openId, setOpenId] = useState<PathId | null>(null);
  const osReducedMotion = usePrefersReducedMotion();

  const reducedMotion = osReducedMotion || settings.forceReducedMotion;

  const change = useCallback(
    <K extends keyof LabSettings>(key: K, value: LabSettings[K]) => {
      setSettings((s) => ({ ...s, [key]: value }));
    },
    []
  );

  const stageProps = {
    variant: settings.variant,
    accent: settings.accent,
    reducedMotion,
    openId,
    onOpenChange: setOpenId,
  };

  return (
    <main className="ctar-root" data-viewport={settings.viewport}>
      <div className="ctar-stages">
        {settings.viewport !== "narrow" && (
          <CtaRowStage {...stageProps} width="desktop" primary />
        )}
        {settings.viewport !== "desktop" && (
          <CtaRowStage
            {...stageProps}
            width="narrow"
            // In "both", the desktop stage is primary — only one takes focus.
            primary={settings.viewport === "narrow"}
          />
        )}
      </div>

      <CtaRowControls
        settings={settings}
        onChange={change}
        open={panelOpen}
        onToggleOpen={() => setPanelOpen((o) => !o)}
        osReducedMotion={osReducedMotion}
      />
    </main>
  );
}
