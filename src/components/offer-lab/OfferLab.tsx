"use client";

// Offer page lab — shell.
//
// The three offers currently resolve into one fixed screen: the paper dossier
// panel that unfurls inside the Consulting card. This lab asks a different
// question — if each offer were a PAGE, what shape should it be? Five layouts
// against two surfaces, all rendering the same production copy.
//
// Nothing on the live site imports any of this.

import { useCallback, useEffect, useState } from "react";
import {
  DEFAULT_LAYOUT,
  DEFAULT_SURFACE,
  PATHS,
  getPath,
} from "@/data/offerLab";
import { DEFAULT_CHROME, DEFAULT_DIRECTION } from "@/data/offerDirections";
import OfferControls, { type OfferSettings } from "./OfferControls";
import OfferRender from "./OfferRender";
import "./offer-lab.css";

const DEFAULT_SETTINGS: OfferSettings = {
  offer: PATHS[0].id,
  direction: DEFAULT_DIRECTION,
  layout: DEFAULT_LAYOUT,
  surface: DEFAULT_SURFACE,
  templateMode: "perOffer",
  chrome: DEFAULT_CHROME,
  viewport: "desktop",
};

export default function OfferLab() {
  const [settings, setSettings] = useState<OfferSettings>(DEFAULT_SETTINGS);
  const [panelOpen, setPanelOpen] = useState(true);

  // Below 1100px the root stops reserving a gutter for the panel, so an open
  // panel would sit on top of the page being judged.
  useEffect(() => {
    if (window.innerWidth < 1100) setPanelOpen(false);
  }, []);

  const change = useCallback(
    <K extends keyof OfferSettings>(key: K, value: OfferSettings[K]) => {
      setSettings((s) => ({ ...s, [key]: value }));
    },
    []
  );

  const path = getPath(settings.offer);
  const screen = {
    path,
    direction: settings.direction,
    layout: settings.layout,
    surface: settings.surface,
    templateMode: settings.templateMode,
  };

  return (
    <main className="ofr-root" data-surface={settings.surface}>
      <div className="ofr-stages">
        {settings.viewport !== "narrow" && (
          <div className="ofr-frame ofr-frame--desktop">
            <OfferRender {...screen} idPrefix="ofd-desktop" />
            <p className="ofr-frame__tag">desktop</p>
          </div>
        )}
        {settings.viewport !== "desktop" && (
          <div className="ofr-frame ofr-frame--narrow">
            <OfferRender {...screen} idPrefix="ofd-narrow" />
            <p className="ofr-frame__tag">390px — container query</p>
          </div>
        )}
      </div>

      <OfferControls
        settings={settings}
        onChange={change}
        open={panelOpen}
        onToggleOpen={() => setPanelOpen((o) => !o)}
      />
    </main>
  );
}
