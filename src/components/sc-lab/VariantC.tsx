"use client";

import { useState } from "react";
import type { SCLabVariantProps } from "@/data/scLab";
import TextTreatments from "./TextTreatments";
import GlobeWrapper from "./GlobeWrapper";

const REGIONS = ["China", "Vietnam", "Indonesia", "Taiwan"];

export default function VariantC({
  quoteLines,
  supportingLines,
  textMode,
  fontMode,
  globeMode,
  motionLevel,
  density,
}: SCLabVariantProps) {
  const [activeLineIndex, setActiveLineIndex] = useState<number | undefined>();

  return (
    <div className="scLab-variantC">
      {/* Map hero with dossier overlay */}
      <div className="scLab-variantC__mapHero">
        <div className="scLab-variantC__mapBg" aria-hidden="true" />
        <div className="scLab-variantC__mapOverlay" aria-hidden="true" />

        <div className="scLab-variantC__dossier">
          <TextTreatments
            lines={quoteLines}
            mode={textMode === "static" ? "dossier" : textMode}
            fontMode={fontMode}
            motionLevel={motionLevel}
            onLineActivate={setActiveLineIndex}
            autoPlay={globeMode === "text-driven"}
          />
          <div className="scLab-variantC__regionTags">
            {REGIONS.map((r) => (
              <span key={r} className="scLab-variantC__regionTag">
                {r}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Content below map */}
      <div className="scLab-variantC__content">
        <div className="scLab-variantC__grid">
          <div className="scLab-variantC__brief">
            <div className="scLab-variantC__briefLabel">
              Operational Brief
            </div>
            <div className="scLab-supporting">
              {supportingLines
                .slice(0, density === "sparse" ? 2 : density === "dense" ? 5 : 3)
                .map((line) => (
                  <p key={line}>{line}</p>
                ))}
            </div>
          </div>

          <div style={{ position: "relative", minHeight: 280 }}>
            <GlobeWrapper
              mode={globeMode}
              motionLevel={motionLevel}
              activeLineIndex={activeLineIndex}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
