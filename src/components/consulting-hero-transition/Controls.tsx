"use client";

import type {
  ButtonTreatment,
  CtaStyle,
  DossierTransition,
  HeroTransitionState,
  TextAnimation,
} from "@/data/consultingHeroTransition";

interface Props {
  state: HeroTransitionState;
  onChange: <K extends keyof HeroTransitionState>(key: K, value: HeroTransitionState[K]) => void;
  onReplay: () => void;
}

const TEXT_ANIM_OPTIONS: Array<{ value: TextAnimation; label: string }> = [
  { value: "cursive", label: "Cursive" },
  { value: "fade", label: "Fade" },
  { value: "slide", label: "Slide" },
];

const CTA_OPTIONS: Array<{ value: CtaStyle; label: string }> = [
  { value: "glass", label: "Glass" },
  { value: "dymo", label: "DYMO" },
];

const TREATMENT_OPTIONS: Array<{ value: ButtonTreatment; label: string }> = [
  { value: "candy", label: "Candy" },
  { value: "dymo", label: "DYMO" },
  { value: "glass", label: "Glass" },
];

const DOSSIER_TRANSITION_OPTIONS: Array<{ value: DossierTransition; label: string }> = [
  { value: "rise", label: "Rise" },
  { value: "expand", label: "Expand" },
  { value: "float", label: "Float" },
  { value: "slide", label: "Slide" },
];

export default function Controls({ state, onChange, onReplay }: Props) {
  return (
    <aside className="cht-controls">
      <h1 className="cht-controls__title">Consulting Hero</h1>
      <p className="cht-controls__subtitle">Two-state entry · cinematic → paths</p>

      <ChipGroup
        title="Quote animation"
        options={TEXT_ANIM_OPTIONS}
        value={state.textAnimation}
        onChange={(v) => onChange("textAnimation", v)}
      />

      <ChipGroup
        title="CTA style"
        options={CTA_OPTIONS}
        value={state.ctaStyle}
        onChange={(v) => onChange("ctaStyle", v)}
      />

      <ChipGroup
        title="Path button treatment"
        options={TREATMENT_OPTIONS}
        value={state.buttonTreatment}
        onChange={(v) => onChange("buttonTreatment", v)}
      />

      <ChipGroup
        title="Offer file entrance"
        options={DOSSIER_TRANSITION_OPTIONS}
        value={state.dossierTransition}
        onChange={(v) => onChange("dossierTransition", v)}
      />

      <SliderGroup
        title="Overlay strength"
        value={state.overlayStrength}
        min={0}
        max={100}
        suffix="%"
        onChange={(v) => onChange("overlayStrength", v)}
      />

      <SliderGroup
        title="Button rise distance"
        value={state.buttonRise}
        min={20}
        max={140}
        suffix="px"
        onChange={(v) => onChange("buttonRise", v)}
      />

      <SliderGroup
        title="Button stagger"
        value={state.buttonStagger}
        min={0}
        max={260}
        suffix="ms"
        onChange={(v) => onChange("buttonStagger", v)}
      />

      <button className="cht-replay" type="button" onClick={onReplay}>
        Replay from state 1
      </button>
    </aside>
  );
}

function ChipGroup<T extends string>({
  title,
  options,
  value,
  onChange,
}: {
  title: string;
  options: Array<{ value: T; label: string }>;
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <div className="cht-group">
      <h3 className="cht-group__title">{title}</h3>
      <div className="cht-group__body">
        <div className="cht-chipRow">
          {options.map((opt) => (
            <button
              key={opt.value}
              type="button"
              className={`cht-chip ${value === opt.value ? "is-active" : ""}`}
              onClick={() => onChange(opt.value)}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function SliderGroup({
  title,
  value,
  min,
  max,
  suffix,
  onChange,
}: {
  title: string;
  value: number;
  min: number;
  max: number;
  suffix: string;
  onChange: (v: number) => void;
}) {
  return (
    <div className="cht-group">
      <h3 className="cht-group__title">{title}</h3>
      <div className="cht-group__body">
        <label className="cht-slider">
          <span className="cht-slider__meta">
            <span>value</span>
            <span>
              {value}
              {suffix}
            </span>
          </span>
          <input
            type="range"
            min={min}
            max={max}
            value={value}
            onChange={(e) => onChange(Number(e.target.value))}
          />
        </label>
      </div>
    </div>
  );
}
