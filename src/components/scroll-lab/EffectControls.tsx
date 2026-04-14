"use client";

import { useCallback } from "react";

export interface FxValues {
  shadowHighlight: number;
  shadowVignette: number;
  shadowDrop: number;
  backlightOpacity: number;
  backlightHeight: number;
  vignetteOpacity: number;
  textureOpacity: number;
  sheenIntensity: number;
  borderBase: number;
  borderHover: number;
  cardRadius: number;
}

export const FX_DEFAULTS: FxValues = {
  shadowHighlight: 0.10,
  shadowVignette: 0.3,
  shadowDrop: 0.5,
  backlightOpacity: 0.35,
  backlightHeight: 120,
  vignetteOpacity: 0.45,
  textureOpacity: 0.02,
  sheenIntensity: 0.06,
  borderBase: 0.06,
  borderHover: 0.14,
  cardRadius: 14,
};

export function fxToVars(fx: FxValues): Record<string, string> {
  return {
    "--fx-shadow-highlight": String(fx.shadowHighlight),
    "--fx-shadow-vignette": String(fx.shadowVignette),
    "--fx-shadow-drop": String(fx.shadowDrop),
    "--fx-backlight-opacity": String(fx.backlightOpacity),
    "--fx-backlight-height": String(fx.backlightHeight),
    "--fx-vignette-opacity": String(fx.vignetteOpacity),
    "--fx-texture-opacity": String(fx.textureOpacity),
    "--fx-sheen-intensity": String(fx.sheenIntensity),
    "--fx-border-base": String(fx.borderBase),
    "--fx-border-hover": String(fx.borderHover),
    "--fx-card-radius": String(fx.cardRadius),
  };
}

interface SliderDef {
  key: keyof FxValues;
  label: string;
  min: number;
  max: number;
  step: number;
  group: string;
}

const SLIDERS: SliderDef[] = [
  { key: "shadowHighlight", label: "Top highlight", min: 0, max: 0.4, step: 0.01, group: "Shadow" },
  { key: "shadowVignette", label: "Inner vignette", min: 0, max: 1, step: 0.05, group: "Shadow" },
  { key: "shadowDrop", label: "Drop shadow", min: 0, max: 1, step: 0.05, group: "Shadow" },
  { key: "backlightOpacity", label: "Opacity", min: 0, max: 1, step: 0.05, group: "Backlight" },
  { key: "backlightHeight", label: "Height (px)", min: 0, max: 300, step: 10, group: "Backlight" },
  { key: "vignetteOpacity", label: "Edge darken", min: 0, max: 1, step: 0.05, group: "Vignette" },
  { key: "textureOpacity", label: "Grid lines", min: 0, max: 0.08, step: 0.005, group: "Texture" },
  { key: "sheenIntensity", label: "Sheen peak", min: 0, max: 0.2, step: 0.01, group: "Sheen" },
  { key: "borderBase", label: "Base border", min: 0, max: 0.3, step: 0.01, group: "Border" },
  { key: "borderHover", label: "Hover border", min: 0, max: 0.4, step: 0.01, group: "Border" },
  { key: "cardRadius", label: "Radius (px)", min: 0, max: 32, step: 1, group: "Shape" },
];

interface EffectControlsProps {
  values: FxValues;
  onChange: (next: FxValues) => void;
}

export default function EffectControls({ values, onChange }: EffectControlsProps) {
  const set = useCallback(
    (key: keyof FxValues, v: number) => onChange({ ...values, [key]: v }),
    [values, onChange]
  );

  const reset = useCallback(() => onChange({ ...FX_DEFAULTS }), [onChange]);

  const groups = SLIDERS.reduce<Record<string, SliderDef[]>>((acc, s) => {
    (acc[s.group] ??= []).push(s);
    return acc;
  }, {});

  return (
    <div className="sl-fx">
      <div className="sl-fx__head">
        <span className="sl-fx__title">Card Effects</span>
        <button className="sl-fx__reset" type="button" onClick={reset}>Reset</button>
      </div>
      <div className="sl-fx__groups">
        {Object.entries(groups).map(([group, sliders]) => (
          <div key={group} className="sl-fx__group">
            <span className="sl-fx__groupLabel">{group}</span>
            {sliders.map((s) => (
              <label key={s.key} className="sl-fx__slider">
                <span className="sl-fx__sliderLabel">{s.label}</span>
                <input
                  type="range"
                  min={s.min}
                  max={s.max}
                  step={s.step}
                  value={values[s.key]}
                  onChange={(e) => set(s.key, parseFloat(e.target.value))}
                />
                <span className="sl-fx__sliderValue">
                  {values[s.key] < 1 && s.max <= 1
                    ? (values[s.key] * 100).toFixed(0) + "%"
                    : String(values[s.key])}
                </span>
              </label>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
