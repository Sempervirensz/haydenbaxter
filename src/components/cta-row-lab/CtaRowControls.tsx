"use client";

// The experiment panel. Deliberately not in the portfolio's visual language —
// flat, tool-grey, no DYMO, no serif — so it never reads as part of the
// composition being judged. Same shape as the sibling lab's panel so moving
// between the two costs nothing. Collapses to a single chip.

import {
  CTA_ROW_ACCENTS,
  CTA_ROW_VARIANTS,
  getVariant,
  type CtaRowAccentId,
  type CtaRowVariantId,
} from "@/data/ctaRowLab";

export type ViewportMode = "desktop" | "narrow" | "both";

export interface LabSettings {
  variant: CtaRowVariantId;
  accent: CtaRowAccentId;
  viewport: ViewportMode;
  forceReducedMotion: boolean;
}

interface Props {
  settings: LabSettings;
  onChange: <K extends keyof LabSettings>(key: K, value: LabSettings[K]) => void;
  open: boolean;
  onToggleOpen: () => void;
  osReducedMotion: boolean;
}

const VIEWPORTS: Array<{ value: ViewportMode; label: string }> = [
  { value: "desktop", label: "Desktop" },
  { value: "narrow", label: "Narrow" },
  { value: "both", label: "Both" },
];

function Group({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="ctarl__group">
      <h2 className="ctarl__groupTitle">{title}</h2>
      {children}
    </div>
  );
}

export default function CtaRowControls({
  settings,
  onChange,
  open,
  onToggleOpen,
  osReducedMotion,
}: Props) {
  const active = getVariant(settings.variant);
  const reduced = osReducedMotion || settings.forceReducedMotion;

  return (
    <aside className={`ctarl ${open ? "is-open" : ""}`} aria-label="Experiment controls">
      <button
        type="button"
        className="ctarl__toggle"
        onClick={onToggleOpen}
        aria-expanded={open}
      >
        <span className="ctarl__dot" aria-hidden />
        Lab
        <span className="ctarl__state">{active.name}</span>
      </button>

      {open && (
        <div className="ctarl__body">
          <Group title="Iteration">
            <div className="ctarl__col">
              {CTA_ROW_VARIANTS.map((v) => (
                <button
                  key={v.id}
                  type="button"
                  className={`ctarl__row ${settings.variant === v.id ? "is-active" : ""}`}
                  aria-pressed={settings.variant === v.id}
                  onClick={() => onChange("variant", v.id)}
                >
                  <span className="ctarl__rowName">{v.name}</span>
                  <span className="ctarl__rowNote">{v.note}</span>
                </button>
              ))}
            </div>
          </Group>

          <Group title="Accent">
            <div className="ctarl__seg" role="group" aria-label="Accent">
              {CTA_ROW_ACCENTS.map((a) => (
                <button
                  key={a.id}
                  type="button"
                  className={`ctarl__segBtn ctarl__segBtn--swatch ${
                    settings.accent === a.id ? "is-active" : ""
                  }`}
                  data-accent={a.id}
                  aria-pressed={settings.accent === a.id}
                  onClick={() => onChange("accent", a.id)}
                >
                  <span className="ctarl__swatch" aria-hidden />
                  {a.label}
                </button>
              ))}
            </div>
            <p className="ctarl__readout">
              {CTA_ROW_ACCENTS.find((a) => a.id === settings.accent)?.note}
            </p>
          </Group>

          <Group title="Viewport">
            <div className="ctarl__seg" role="group" aria-label="Viewport">
              {VIEWPORTS.map((v) => (
                <button
                  key={v.value}
                  type="button"
                  className={`ctarl__segBtn ${settings.viewport === v.value ? "is-active" : ""}`}
                  aria-pressed={settings.viewport === v.value}
                  onClick={() => onChange("viewport", v.value)}
                >
                  {v.label}
                </button>
              ))}
            </div>
          </Group>

          <Group title="Motion">
            <label className="ctarl__check">
              <input
                type="checkbox"
                checked={settings.forceReducedMotion}
                onChange={(e) => onChange("forceReducedMotion", e.target.checked)}
              />
              Force reduced motion
            </label>
            <p className="ctarl__readout">
              OS preference: {osReducedMotion ? "reduce" : "no-preference"} · stage:{" "}
              {reduced ? "reduced" : "full"}
            </p>
          </Group>

          <Group title="Verdict">
            <p className="ctarl__verdict">{active.verdict}</p>
          </Group>
        </div>
      )}
    </aside>
  );
}
