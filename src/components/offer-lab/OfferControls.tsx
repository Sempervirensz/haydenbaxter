"use client";

// Experiment panel. Deliberately not in the portfolio's visual language —
// flat, tool-grey, no serif — so it never reads as part of what is being
// judged. Same shape as the CTA labs' panels.

import {
  OFFER_LAYOUTS,
  OFFER_SURFACES,
  PATHS,
  getLayout,
  type OfferLayoutId,
  type OfferSurfaceId,
  type PathId,
} from "@/data/offerLab";

export type ViewportMode = "desktop" | "narrow" | "both";

export interface OfferSettings {
  offer: PathId;
  layout: OfferLayoutId;
  surface: OfferSurfaceId;
  viewport: ViewportMode;
}

const VIEWPORTS: Array<{ value: ViewportMode; label: string }> = [
  { value: "desktop", label: "Desktop" },
  { value: "narrow", label: "Narrow" },
  { value: "both", label: "Both" },
];

function Group({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="ofrl__group">
      <h2 className="ofrl__groupTitle">{title}</h2>
      {children}
    </div>
  );
}

export default function OfferControls({
  settings,
  onChange,
  open,
  onToggleOpen,
}: {
  settings: OfferSettings;
  onChange: <K extends keyof OfferSettings>(key: K, value: OfferSettings[K]) => void;
  open: boolean;
  onToggleOpen: () => void;
}) {
  const layout = getLayout(settings.layout);

  return (
    <aside className={`ofrl ${open ? "is-open" : ""}`} aria-label="Experiment controls">
      <button type="button" className="ofrl__toggle" onClick={onToggleOpen} aria-expanded={open}>
        <span className="ofrl__dot" aria-hidden />
        Lab
        <span className="ofrl__state">{layout.name}</span>
      </button>

      {open && (
        <div className="ofrl__body">
          <Group title="Offer">
            <div className="ofrl__seg" role="group" aria-label="Offer">
              {PATHS.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  className={`ofrl__segBtn ${settings.offer === p.id ? "is-active" : ""}`}
                  aria-pressed={settings.offer === p.id}
                  onClick={() => onChange("offer", p.id)}
                >
                  {p.destination.eyebrow}
                </button>
              ))}
            </div>
          </Group>

          <Group title="Layout">
            <div className="ofrl__col">
              {OFFER_LAYOUTS.map((l) => (
                <button
                  key={l.id}
                  type="button"
                  className={`ofrl__row ${settings.layout === l.id ? "is-active" : ""}`}
                  aria-pressed={settings.layout === l.id}
                  onClick={() => onChange("layout", l.id)}
                >
                  <span className="ofrl__rowName">{l.name}</span>
                  <span className="ofrl__rowNote">{l.note}</span>
                </button>
              ))}
            </div>
          </Group>

          <Group title="Surface">
            <div className="ofrl__seg" role="group" aria-label="Surface">
              {OFFER_SURFACES.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  className={`ofrl__segBtn ${settings.surface === s.id ? "is-active" : ""}`}
                  aria-pressed={settings.surface === s.id}
                  onClick={() => onChange("surface", s.id)}
                >
                  {s.label}
                </button>
              ))}
            </div>
            <p className="ofrl__readout">
              {OFFER_SURFACES.find((s) => s.id === settings.surface)?.note}
            </p>
          </Group>

          <Group title="Viewport">
            <div className="ofrl__seg" role="group" aria-label="Viewport">
              {VIEWPORTS.map((v) => (
                <button
                  key={v.value}
                  type="button"
                  className={`ofrl__segBtn ${settings.viewport === v.value ? "is-active" : ""}`}
                  aria-pressed={settings.viewport === v.value}
                  onClick={() => onChange("viewport", v.value)}
                >
                  {v.label}
                </button>
              ))}
            </div>
          </Group>

          <Group title="Verdict">
            <p className="ofrl__verdict">{layout.verdict}</p>
          </Group>
        </div>
      )}
    </aside>
  );
}
