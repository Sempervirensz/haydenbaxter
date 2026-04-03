"use client";

import type { GlobeMode, MotionLevel, GlobeCue } from "@/data/scLab";
import {
  ASIA_PACIFIC_CENTER,
  REGION_COORDS,
  NETWORK_ARCS,
  GLOBE_CHOREOGRAPHY,
} from "@/data/scLab";
import RotatingEarth from "@/components/ui/wireframe-dotted-globe";

interface GlobeWrapperProps {
  mode: GlobeMode;
  motionLevel: MotionLevel;
  /** Active line index for text-driven choreography */
  activeLineIndex?: number;
  className?: string;
}

const PULSE_DOTS: [number, number][] = [
  REGION_COORDS.china,
  REGION_COORDS.vietnam,
  REGION_COORDS.indonesia,
];

const ARC_COORDS = NETWORK_ARCS.map((a) => ({
  from: REGION_COORDS[a.from],
  to: REGION_COORDS[a.to],
}));

function propsForMode(
  mode: GlobeMode,
  motionLevel: MotionLevel,
  activeLineIndex?: number,
) {
  const autoRotate = motionLevel !== "off";
  const cue =
    activeLineIndex !== undefined
      ? GLOBE_CHOREOGRAPHY[activeLineIndex] ?? undefined
      : undefined;

  switch (mode) {
    case "geographic-anchor":
      return {
        width: 500,
        height: 500,
        autoRotate,
        initialRotation: ASIA_PACIFIC_CENTER,
        showPulseDots: PULSE_DOTS,
        transparentBg: true,
        cue, // choreography when line is active
      };
    case "network-visualizer":
      return {
        width: 500,
        height: 500,
        autoRotate,
        initialRotation: ASIA_PACIFIC_CENTER,
        showArcs: ARC_COORDS,
        transparentBg: true,
        cue,
      };
    case "scale-contrast":
      return {
        width: 800,
        height: 800,
        autoRotate,
        transparentBg: true,
        cue,
      };
    case "text-driven":
      return {
        width: 600,
        height: 600,
        autoRotate: false,
        initialRotation: ASIA_PACIFIC_CENTER,
        transparentBg: true,
        cue: cue ?? GLOBE_CHOREOGRAPHY[0], // always cue-driven
      };
  }
}

export default function GlobeWrapper({
  mode,
  motionLevel,
  activeLineIndex,
  className = "",
}: GlobeWrapperProps) {
  const globeProps = propsForMode(mode, motionLevel, activeLineIndex);

  return (
    <div
      className={`scLab-globe scLab-globe--${mode} ${className}`}
      aria-hidden="true"
    >
      <RotatingEarth {...globeProps} />
    </div>
  );
}
