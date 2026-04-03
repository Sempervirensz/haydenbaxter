"use client";

import { useState, useCallback } from "react";
import type { SCLabVariantProps } from "@/data/scLab";
import TextTreatments from "./TextTreatments";
import GlobeWrapper from "./GlobeWrapper";

export default function VariantE({
  quoteLines,
  supportingLines,
  textMode,
  fontMode,
  globeMode,
  motionLevel,
  density,
}: SCLabVariantProps) {
  const [activeLineIndex, setActiveLineIndex] = useState<number | undefined>();

  const heroLines = quoteLines.slice(0, 2);
  const bridgeLines = quoteLines.slice(2);

  const onHeroActivate = useCallback((i: number) => setActiveLineIndex(i), []);

  return (
    <div className="scLab-variantE">
      <GlobeWrapper
        mode={globeMode}
        motionLevel={motionLevel}
        activeLineIndex={activeLineIndex}
      />

      <div className="scLab-variantE__hero">
        <div className="scLab-variantE__heroLines">
          <TextTreatments
            lines={heroLines}
            mode={textMode}
            fontMode={fontMode}
            motionLevel={motionLevel}
            onLineActivate={onHeroActivate}
            autoPlay={globeMode === "text-driven"}
          />
        </div>
        <div className="scLab-variantE__bridge">
          {bridgeLines.map((line, i) => (
            <span
              key={line.text}
              onMouseEnter={() => setActiveLineIndex(i + 2)}
              style={{ cursor: "pointer" }}
            >
              {line.text}{" "}
            </span>
          ))}
        </div>
      </div>

      {density !== "sparse" && (
        <div className="scLab-supporting" style={{ textAlign: "center", maxWidth: 560, margin: "0 auto" }}>
          {supportingLines
            .slice(0, density === "dense" ? 3 : 1)
            .map((line) => (
              <p key={line}>{line}</p>
            ))}
        </div>
      )}
    </div>
  );
}
