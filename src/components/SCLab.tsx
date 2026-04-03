"use client";

import { useReducer, useState } from "react";
import {
  SC_LAB_VARIANTS,
  TEXT_MODES,
  GLOBE_MODES,
  MOTION_LEVELS,
  DENSITY_LEVELS,
  CORE_QUOTE_LINES,
  SUPPORTING_LINES,
  DEFAULT_CONFIG,
  VARIANT_LABELS,
  TEXT_MODE_LABELS,
  GLOBE_MODE_LABELS,
  MOTION_LEVEL_LABELS,
  DENSITY_LEVEL_LABELS,
  FONT_MODES,
  FONT_MODE_LABELS,
  type SCLabConfig,
  type SCLabVariant,
} from "@/data/scLab";
import VariantA from "./sc-lab/VariantA";
import VariantB from "./sc-lab/VariantB";
import VariantC from "./sc-lab/VariantC";
import VariantD from "./sc-lab/VariantD";
import VariantE from "./sc-lab/VariantE";
import VariantF from "./sc-lab/VariantF";
import JourneyGlobe from "./sc-lab/JourneyGlobe";
import "./sc-lab.css";

function configReducer(
  state: SCLabConfig,
  action: Partial<SCLabConfig>
): SCLabConfig {
  return { ...state, ...action };
}

export default function SCLab() {
  const [config, dispatch] = useReducer(configReducer, DEFAULT_CONFIG);
  const [controlsOpen, setControlsOpen] = useState(false);

  const motionOff =
    config.reducedMotionOverride || config.motionLevel === "off";
  const effectiveMotion = motionOff ? "off" : config.motionLevel;

  const rootClass = [
    "scLab",
    motionOff ? "scLab--motionOff" : "",
    config.density !== "normal" ? `scLab--${config.density}` : "",
  ]
    .filter(Boolean)
    .join(" ");

  const sharedProps = {
    quoteLines: CORE_QUOTE_LINES,
    supportingLines: SUPPORTING_LINES,
    textMode: config.textMode,
    fontMode: config.fontMode,
    globeMode: config.globeMode,
    motionLevel: effectiveMotion,
    density: config.density,
  } as const;

  return (
    <div className={rootClass}>
      {/* Header */}
      <div className="scLab-header">
        <h1 className="scLab-title">Supply Chain Lab</h1>
        <div
          className="scLab-switcher"
          role="radiogroup"
          aria-label="Layout variant"
        >
          {SC_LAB_VARIANTS.map((v) => (
            <button
              key={v}
              type="button"
              role="radio"
              aria-checked={config.variant === v}
              className={`scLab-switcher__btn ${config.variant === v ? "is-active" : ""}`}
              onClick={() => dispatch({ variant: v })}
            >
              {VARIANT_LABELS[v]}
            </button>
          ))}
        </div>
      </div>

      {/* Body: controls + stage */}
      <div className="scLab-body">
        {/* Control panel */}
        <aside
          className={`scLab-controls ${controlsOpen ? "is-open" : ""}`}
          aria-label="Lab controls"
        >
          {/* Text mode */}
          <RadioGroup
            label="Text Treatment"
            options={TEXT_MODES}
            labels={TEXT_MODE_LABELS}
            value={config.textMode}
            onChange={(v) => dispatch({ textMode: v })}
          />

          {/* Font mode */}
          <RadioGroup
            label="Font Style"
            options={FONT_MODES}
            labels={FONT_MODE_LABELS}
            value={config.fontMode}
            onChange={(v) => dispatch({ fontMode: v })}
          />

          {/* Globe mode */}
          <RadioGroup
            label="Globe Mode"
            options={GLOBE_MODES}
            labels={GLOBE_MODE_LABELS}
            value={config.globeMode}
            onChange={(v) => dispatch({ globeMode: v })}
          />

          {/* Motion */}
          <RadioGroup
            label="Motion"
            options={MOTION_LEVELS}
            labels={MOTION_LEVEL_LABELS}
            value={config.motionLevel}
            onChange={(v) => dispatch({ motionLevel: v })}
          />

          {/* Density */}
          <RadioGroup
            label="Density"
            options={DENSITY_LEVELS}
            labels={DENSITY_LEVEL_LABELS}
            value={config.density}
            onChange={(v) => dispatch({ density: v })}
          />

          {/* Reduced motion override */}
          <Toggle
            label="Force reduced motion"
            checked={config.reducedMotionOverride}
            onChange={(v) => dispatch({ reducedMotionOverride: v })}
          />
        </aside>

        {/* Stage */}
        <div className="scLab-stage">
          {config.variant === "A" && <VariantA {...sharedProps} />}
          {config.variant === "B" && <VariantB {...sharedProps} />}
          {config.variant === "C" && <VariantC {...sharedProps} />}
          {config.variant === "D" && <VariantD {...sharedProps} />}
          {config.variant === "E" && <VariantE {...sharedProps} />}
          {config.variant === "F" && <VariantF {...sharedProps} />}
          {config.variant === "G" && <JourneyGlobe design="base" />}
          {config.variant === "H" && <JourneyGlobe design="floating" />}
          {config.variant === "I" && <JourneyGlobe design="timeline" />}
          {config.variant === "J" && <JourneyGlobe design="fullbleed" />}
          {config.variant === "K" && <JourneyGlobe design="hybrid" />}
          {config.variant === "L" && <JourneyGlobe design="topnav" />}
        </div>
      </div>

      {/* Mobile controls toggle */}
      <button
        type="button"
        className="scLab-controlsToggle"
        onClick={() => setControlsOpen((p) => !p)}
        aria-label={controlsOpen ? "Close controls" : "Open controls"}
      >
        {controlsOpen ? "\u2715" : "\u2699"}
      </button>

      {/* Debug tag */}
      <div className="scLab-activeTag" aria-live="polite">
        {VARIANT_LABELS[config.variant]} &middot; {config.textMode} &middot;{" "}
        {config.globeMode}
      </div>
    </div>
  );
}

/* ---- Inline sub-components ---- */

function RadioGroup<T extends string>({
  label,
  options,
  labels,
  value,
  onChange,
}: {
  label: string;
  options: readonly T[];
  labels: Record<T, string>;
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <div className="scLab-controlGroup">
      <div className="scLab-controlLabel">{label}</div>
      <div className="scLab-controlOptions" role="radiogroup" aria-label={label}>
        {options.map((opt) => (
          <button
            key={opt}
            type="button"
            role="radio"
            aria-checked={value === opt}
            className={`scLab-radio ${value === opt ? "is-active" : ""}`}
            onClick={() => onChange(opt)}
          >
            {labels[opt]}
          </button>
        ))}
      </div>
    </div>
  );
}

function Toggle({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="scLab-controlGroup">
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        className="scLab-toggle"
        onClick={() => onChange(!checked)}
      >
        <span className="scLab-toggleTrack">
          <span className="scLab-toggleDot" />
        </span>
        {label}
      </button>
    </div>
  );
}
