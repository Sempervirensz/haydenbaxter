"use client";

import { useState } from "react";
import type { SCLabVariantProps } from "@/data/scLab";
import TextTreatments from "./TextTreatments";
import GlobeWrapper from "./GlobeWrapper";

export default function VariantF({
  quoteLines,
  supportingLines,
  textMode,
  fontMode,
  globeMode,
  motionLevel,
  density,
}: SCLabVariantProps) {
  const [activeLineIndex, setActiveLineIndex] = useState<number | undefined>();

  // Force typewriter mode for this variant
  const effectiveTextMode = textMode === "static" ? "typewriter" : textMode;

  return (
    <div className="scLab-variantF">
      <div className="scLab-variantF__scanlines" aria-hidden="true" />

      <GlobeWrapper
        mode={globeMode}
        motionLevel={motionLevel}
        activeLineIndex={activeLineIndex}
      />

      <div className="scLab-variantF__content">
        <div className="scLab-variantF__header">
          Signal Dispatch // Supply Chain Intelligence
        </div>

        <div className="scLab-variantF__lines">
          <TextTreatments
            lines={quoteLines}
            mode={effectiveTextMode}
            fontMode={fontMode}
            motionLevel={motionLevel}
            onLineActivate={setActiveLineIndex}
            autoPlay={globeMode === "text-driven"}
          />
        </div>

        <div className="scLab-variantF__supporting scLab-supporting">
          {supportingLines
            .slice(0, density === "sparse" ? 1 : density === "dense" ? 4 : 2)
            .map((line) => (
              <p key={line}>{line}</p>
            ))}
        </div>

        <div className="scLab-variantF__timestamp">
          {new Date().toISOString().split("T")[0]} // ACTIVE
        </div>
      </div>
    </div>
  );
}
