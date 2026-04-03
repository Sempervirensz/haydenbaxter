"use client";

import { useState } from "react";
import type { SCLabVariantProps } from "@/data/scLab";
import TextTreatments from "./TextTreatments";
import GlobeWrapper from "./GlobeWrapper";

export default function VariantA({
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
    <div className="scLab-variantA">
      <div className="scLab-variantA__text">
        <div className="scLab-variantA__eyebrow">
          Procurement strategy + supplier operations
        </div>

        <div className="scLab-variantA__lines">
          <TextTreatments
            lines={quoteLines}
            mode={textMode}
            fontMode={fontMode}
            motionLevel={motionLevel}
            onLineActivate={setActiveLineIndex}
            autoPlay={globeMode === "text-driven"}
          />
        </div>

        <div className="scLab-supporting">
          {supportingLines.slice(0, density === "sparse" ? 1 : density === "dense" ? 4 : 2).map((line) => (
            <p key={line}>{line}</p>
          ))}
        </div>
      </div>

      <div className="scLab-variantA__globe">
        <GlobeWrapper
          mode={globeMode}
          motionLevel={motionLevel}
          activeLineIndex={activeLineIndex}
        />
      </div>
    </div>
  );
}
