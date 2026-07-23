"use client";

import {
  HERO_VARIANTS,
  HERO_VARIANT_LABELS,
  PATH_LAYOUT_LABELS,
  PATH_LAYOUT_OPTIONS,
  REVEAL_ANIMATION_LABELS,
  REVEAL_ANIMATION_OPTIONS,
  REVEAL_TRIGGER_LABELS,
  REVEAL_TRIGGER_OPTIONS,
  TEXT_POSITION_LABELS,
  TEXT_POSITION_OPTIONS,
  TYPOGRAPHY_LABELS,
  TYPOGRAPHY_OPTIONS,
  type HeroLabState,
  type HeroVariant,
} from "@/data/consultingHeroLab";

interface Props {
  state: HeroLabState;
  onChange: (partial: Partial<HeroLabState>) => void;
  onVariantChange: (variant: HeroVariant) => void;
}

export default function ConsultingLabControls({ state, onChange, onVariantChange }: Props) {
  return (
    <aside className="heroLab-controls" aria-label="Consulting Hero Lab controls">
      <h2 className="heroLab-controls__title">Consulting Hero Lab</h2>

      <Group label="Variant Selector">
        <ChipRow value={state.variant} options={HERO_VARIANTS} labels={HERO_VARIANT_LABELS} onChange={onVariantChange} />
      </Group>

      <Group label="Thesis Line Text">
        <input className="heroLab-input" value={state.thesisLine} onChange={(e) => onChange({ thesisLine: e.target.value })} />
      </Group>

      <Group label="Support Line">
        <Toggle label="Support line" checked={state.supportLineEnabled} onChange={(v) => onChange({ supportLineEnabled: v })} />
        <input
          className="heroLab-input"
          value={state.supportLineText}
          disabled={!state.supportLineEnabled}
          onChange={(e) => onChange({ supportLineText: e.target.value })}
        />
      </Group>

      <Group label="Button Label">
        <input className="heroLab-input" value={state.buttonLabel} onChange={(e) => onChange({ buttonLabel: e.target.value })} />
      </Group>

      <Group label="Reveal Trigger">
        <ChipRow
          value={state.revealTrigger}
          options={REVEAL_TRIGGER_OPTIONS}
          labels={REVEAL_TRIGGER_LABELS}
          onChange={(v) => onChange({ revealTrigger: v })}
        />
      </Group>

      <Group label="Reveal Animation">
        <ChipRow
          value={state.revealAnimation}
          options={REVEAL_ANIMATION_OPTIONS}
          labels={REVEAL_ANIMATION_LABELS}
          onChange={(v) => onChange({ revealAnimation: v })}
        />
      </Group>

      <Group label="Path Layout">
        <ChipRow value={state.pathLayout} options={PATH_LAYOUT_OPTIONS} labels={PATH_LAYOUT_LABELS} onChange={(v) => onChange({ pathLayout: v })} />
      </Group>

      <Group label="Featured AI Path">
        <Toggle label="Feature AI" checked={state.featuredAIPath} onChange={(v) => onChange({ featuredAIPath: v })} />
      </Group>

      <Group label="Typography Mode">
        <ChipRow
          value={state.typographyMode}
          options={TYPOGRAPHY_OPTIONS}
          labels={TYPOGRAPHY_LABELS}
          onChange={(v) => onChange({ typographyMode: v })}
        />
      </Group>

      <Group label="Text Position">
        <ChipRow
          value={state.textPosition}
          options={TEXT_POSITION_OPTIONS}
          labels={TEXT_POSITION_LABELS}
          onChange={(v) => onChange({ textPosition: v })}
        />
      </Group>

      <Group label="Overlay Darkness">
        <Slider value={state.overlayDarkness} onChange={(v) => onChange({ overlayDarkness: v })} min={20} max={88} unit="%" />
      </Group>

      <Group label="Motion Intensity">
        <Slider value={state.motionIntensity} onChange={(v) => onChange({ motionIntensity: v })} min={0} max={100} unit="%" />
      </Group>
    </aside>
  );
}

function Group({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <section className="heroLab-group">
      <h3 className="heroLab-group__title">{label}</h3>
      <div className="heroLab-group__body">{children}</div>
    </section>
  );
}

function ChipRow<T extends string>({
  value,
  options,
  labels,
  onChange,
}: {
  value: T;
  options: readonly T[];
  labels: Record<T, string>;
  onChange: (value: T) => void;
}) {
  return (
    <div className="heroLab-chipRow">
      {options.map((option) => (
        <button
          type="button"
          key={option}
          className={`heroLab-chip ${value === option ? "is-active" : ""}`}
          onClick={() => onChange(option)}
        >
          {labels[option]}
        </button>
      ))}
    </div>
  );
}

function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (value: boolean) => void }) {
  return (
    <button type="button" className={`heroLab-toggle ${checked ? "is-active" : ""}`} onClick={() => onChange(!checked)}>
      <span className="heroLab-toggle__dot" />
      <span>{label}</span>
    </button>
  );
}

function Slider({
  value,
  min,
  max,
  unit,
  onChange,
}: {
  value: number;
  min: number;
  max: number;
  unit: string;
  onChange: (value: number) => void;
}) {
  return (
    <label className="heroLab-slider">
      <span className="heroLab-slider__meta">{value}{unit}</span>
      <input type="range" min={min} max={max} value={value} onChange={(e) => onChange(Number(e.target.value))} />
    </label>
  );
}
