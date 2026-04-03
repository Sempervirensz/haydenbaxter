"use client";

import { useState, useCallback } from "react";
import type { SCLabVariantProps } from "@/data/scLab";
import TextTreatments from "./TextTreatments";
import GlobeWrapper from "./GlobeWrapper";

export default function VariantB({
  quoteLines,
  supportingLines,
  textMode,
  fontMode,
  globeMode,
  motionLevel,
  density,
}: SCLabVariantProps) {
  const [activeLineIndex, setActiveLineIndex] = useState<number | undefined>();

  const upperLines = quoteLines.slice(0, 2);
  const lowerLines = quoteLines.slice(2);

  // Upper lines are index 0-1, lower lines are index 2-3
  const onUpperActivate = useCallback((i: number) => setActiveLineIndex(i), []);
  const onLowerActivate = useCallback((i: number) => setActiveLineIndex(i + 2), []);

  return (
    <div className="scLab-variantB">
      <div className="scLab-variantB__upper">
        <TextTreatments
          lines={upperLines}
          mode={textMode}
          fontMode={fontMode}
          motionLevel={motionLevel}
          onLineActivate={onUpperActivate}
          autoPlay={globeMode === "text-driven"}
        />
      </div>

      <div className="scLab-variantB__globeWrap">
        <GlobeWrapper
          mode={globeMode}
          motionLevel={motionLevel}
          activeLineIndex={activeLineIndex}
        />
      </div>

      <div className="scLab-variantB__lower">
        <TextTreatments
          lines={lowerLines}
          mode={textMode}
          fontMode={fontMode}
          motionLevel={motionLevel}
          onLineActivate={onLowerActivate}
        />
        <div className="scLab-supporting" style={{ marginTop: 16 }}>
          {supportingLines.slice(0, density === "dense" ? 3 : 1).map((line) => (
            <p key={line}>{line}</p>
          ))}
        </div>
      </div>
    </div>
  );
}
