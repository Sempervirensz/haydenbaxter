"use client";

import { useState } from "react";
import type { SCLabVariantProps } from "@/data/scLab";
import TextTreatments from "./TextTreatments";
import GlobeWrapper from "./GlobeWrapper";

export default function VariantD({
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
    <div className="scLab-variantD">
      <GlobeWrapper
        mode={globeMode}
        motionLevel={motionLevel}
        activeLineIndex={activeLineIndex}
      />

      <div className="scLab-variantD__content">
        <div className="scLab-variantD__lines">
          <TextTreatments
            lines={quoteLines}
            mode={textMode}
            fontMode={fontMode}
            motionLevel={motionLevel}
            onLineActivate={setActiveLineIndex}
            autoPlay={globeMode === "text-driven"}
          />
        </div>

        {density !== "sparse" && (
          <div className="scLab-variantD__supporting scLab-supporting">
            <p>{supportingLines[0]}</p>
          </div>
        )}
      </div>
    </div>
  );
}
