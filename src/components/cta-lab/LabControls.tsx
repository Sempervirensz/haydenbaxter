"use client";

// The experiment panel. Deliberately not part of the portfolio language —
// flat, tool-grey, no DYMO, no serif — so it never reads as part of the
// composition being judged. Collapses to a single chip.

import {
  CONCEPTS,
  CONCEPT_STATUS_LABEL,
  type ConceptId,
  type SectionLabelKey,
} from "@/data/ctaLab";

export type ViewportMode = "desktop" | "narrow" | "both";

export interface LabSettings {
  concept: ConceptId;
  viewport: ViewportMode;
  forceReducedMotion: boolean;
  sectionLabel: SectionLabelKey;
}

interface Props {
  settings: LabSettings;
  onChange: <K extends keyof LabSettings>(key: K, value: LabSettings[K]) => void;
  open: boolean;
  onToggleOpen: () => void;
  /** Live flow readout, e.g. "detail · advisory · worldpulse". */
  stateLabel: string;
  osReducedMotion: boolean;
  onReset: () => void;
  onBack: () => void;
  canGoBack: boolean;
}

const VIEWPORTS: Array<{ value: ViewportMode; label: string }> = [
  { value: "desktop", label: "Desktop" },
  { value: "narrow", label: "Narrow" },
  { value: "both", label: "Both" },
];

const LABELS: Array<{ value: SectionLabelKey; label: string }> = [
  { value: "consulting", label: "Consulting" },
  { value: "work", label: "Work Together" },
];

export default function LabControls({
  settings,
  onChange,
  open,
  onToggleOpen,
  stateLabel,
  osReducedMotion,
  onReset,
  onBack,
  canGoBack,
}: Props) {
  const active = CONCEPTS.find((c) => c.id === settings.concept);

  return (
    <aside className={`ctal-lab ${open ? "is-open" : ""}`} aria-label="Experiment controls">
      <button
        type="button"
        className="ctal-lab__toggle"
        onClick={onToggleOpen}
        aria-expanded={open}
      >
        <span className="ctal-lab__dot" aria-hidden />
        Lab
        <span className="ctal-lab__state">{stateLabel}</span>
      </button>

      {open && (
        <div className="ctal-lab__body">
          <Group title="Concept">
            <div className="ctal-lab__col">
              {CONCEPTS.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  className={`ctal-lab__row ${settings.concept === c.id ? "is-active" : ""}`}
                  onClick={() => {
                    onChange("concept", c.id);
                    onReset();
                  }}
                >
                  <span className="ctal-lab__rowName">
                    {c.name}
                    <span className={`ctal-lab__status is-${c.status}`}>
                      {CONCEPT_STATUS_LABEL[c.status]}
                    </span>
                  </span>
                  <span className="ctal-lab__rowNote">{c.premise}</span>
                </button>
              ))}
            </div>
          </Group>

          <Group title="Viewport">
            <ChipRow
              options={VIEWPORTS}
              value={settings.viewport}
              onSelect={(v) => onChange("viewport", v)}
            />
          </Group>

          <Group title="Section label">
            <ChipRow
              options={LABELS}
              value={settings.sectionLabel}
              onSelect={(v) => onChange("sectionLabel", v)}
            />
          </Group>

          <Group title="Motion">
            <label className="ctal-lab__check">
              <input
                type="checkbox"
                checked={settings.forceReducedMotion}
                onChange={(e) => onChange("forceReducedMotion", e.target.checked)}
              />
              <span>Force reduced motion</span>
            </label>
            <p className="ctal-lab__hint">
              OS preference: {osReducedMotion ? "reduce" : "no-preference"}
              {osReducedMotion && " (already applied)"}
            </p>
          </Group>

          <Group title="Flow">
            <p className="ctal-lab__readout">{stateLabel}</p>
            <div className="ctal-lab__btnRow">
              <button
                type="button"
                className="ctal-lab__btn"
                onClick={onBack}
                disabled={!canGoBack}
              >
                Back one level
              </button>
              <button type="button" className="ctal-lab__btn" onClick={onReset}>
                Reset to start
              </button>
            </div>
            <p className="ctal-lab__hint">Escape also steps back one level.</p>
          </Group>

          {active && (
            <Group title="Verdict">
              <p className="ctal-lab__hint">{active.verdict}</p>
            </Group>
          )}
        </div>
      )}
    </aside>
  );
}

function Group({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="ctal-lab__group">
      <h2 className="ctal-lab__groupTitle">{title}</h2>
      {children}
    </section>
  );
}

function ChipRow<T extends string>({
  options,
  value,
  onSelect,
}: {
  options: Array<{ value: T; label: string }>;
  value: T;
  onSelect: (v: T) => void;
}) {
  return (
    <div className="ctal-lab__chips">
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          className={`ctal-lab__chip ${value === o.value ? "is-active" : ""}`}
          onClick={() => onSelect(o.value)}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}
