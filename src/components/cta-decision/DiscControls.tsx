"use client";

// Experiment panel for the disc axes.
//
// Deliberately NOT in the portfolio's visual language — flat, tool-grey, mono,
// no serif — so it never reads as part of what is being judged. Same posture
// and shape as the offer lab's panel.
//
// Every option prints its cost next to it. An axis whose options have no
// stated cost is a knob rather than a decision.

import {
  DISC_FINISHES,
  DISC_MOTIONS,
  DISC_PLACES,
  DISC_ROLES,
  DISC_SCALES,
  type DiscSettings,
} from "@/data/ctaDecisionAxes";

interface Props {
  settings: DiscSettings;
  onChange: <K extends keyof DiscSettings>(key: K, value: DiscSettings[K]) => void;
  open: boolean;
  onToggle: () => void;
  /** Shown in the toggle so the current combination is readable when closed. */
  summary: string;
}

function Group({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="dcl__group">
      <h2 className="dcl__groupTitle">{title}</h2>
      {children}
    </div>
  );
}

export default function DiscControls({
  settings,
  onChange,
  open,
  onToggle,
  summary,
}: Props) {
  const roleNote = DISC_ROLES.find((o) => o.id === settings.role)?.note;
  const motionNote = DISC_MOTIONS.find((o) => o.id === settings.motion)?.note;
  const finishNote = DISC_FINISHES.find((o) => o.id === settings.finish)?.note;
  const scaleNote = DISC_SCALES.find((o) => o.id === settings.scale)?.note;
  const placeNote = DISC_PLACES.find((o) => o.id === settings.place)?.note;

  // Placement and the finer disc controls mean nothing without a disc.
  const hasDisc = settings.role !== "none";
  const isAnchor = settings.role === "anchor";

  return (
    <aside className={`dcl ${open ? "is-open" : ""}`} aria-label="Disc controls">
      <button
        type="button"
        className="dcl__toggle"
        onClick={onToggle}
        aria-expanded={open}
      >
        <span className="dcl__dot" aria-hidden="true" />
        Disc
        <span className="dcl__state">{summary}</span>
      </button>

      {open && (
        <div className="dcl__body">
          <Group title="Role">
            <div className="dcl__col">
              {DISC_ROLES.map((o) => (
                <button
                  key={o.id}
                  type="button"
                  className={`dcl__row ${settings.role === o.id ? "is-active" : ""}`}
                  aria-pressed={settings.role === o.id}
                  onClick={() => onChange("role", o.id)}
                >
                  <span className="dcl__rowName">{o.label}</span>
                  <span className="dcl__rowNote">{o.note}</span>
                </button>
              ))}
            </div>
            <p className="dcl__readout">{roleNote}</p>
          </Group>

          {hasDisc && (
            <Group title="Motion">
              <div className="dcl__col">
                {DISC_MOTIONS.map((o) => (
                  <button
                    key={o.id}
                    type="button"
                    className={`dcl__row ${settings.motion === o.id ? "is-active" : ""}`}
                    aria-pressed={settings.motion === o.id}
                    onClick={() => onChange("motion", o.id)}
                  >
                    <span className="dcl__rowName">{o.label}</span>
                    <span className="dcl__rowNote">{o.note}</span>
                  </button>
                ))}
              </div>
              <p className="dcl__readout">{motionNote}</p>
              <p className="dcl__readout dcl__readout--warn">
                All of these are switched off under prefers-reduced-motion, so
                every option here is judged against the same still page.
              </p>
            </Group>
          )}

          {hasDisc && (
            <Group title="Finish">
              <div className="dcl__seg" role="group" aria-label="Finish">
                {DISC_FINISHES.map((o) => (
                  <button
                    key={o.id}
                    type="button"
                    className={`dcl__segBtn ${settings.finish === o.id ? "is-active" : ""}`}
                    aria-pressed={settings.finish === o.id}
                    onClick={() => onChange("finish", o.id)}
                  >
                    {o.label}
                  </button>
                ))}
              </div>
              <p className="dcl__readout">{finishNote}</p>
            </Group>
          )}

          {hasDisc && (
            <Group title="Scale">
              <div className="dcl__seg" role="group" aria-label="Scale">
                {DISC_SCALES.map((o) => (
                  <button
                    key={o.id}
                    type="button"
                    className={`dcl__segBtn ${settings.scale === o.id ? "is-active" : ""}`}
                    aria-pressed={settings.scale === o.id}
                    onClick={() => onChange("scale", o.id)}
                  >
                    {o.label}
                  </button>
                ))}
              </div>
              <p className="dcl__readout">{scaleNote}</p>
            </Group>
          )}

          {isAnchor && (
            <Group title="Placement">
              <div className="dcl__seg" role="group" aria-label="Placement">
                {DISC_PLACES.map((o) => (
                  <button
                    key={o.id}
                    type="button"
                    className={`dcl__segBtn ${settings.place === o.id ? "is-active" : ""}`}
                    aria-pressed={settings.place === o.id}
                    onClick={() => onChange("place", o.id)}
                  >
                    {o.label}
                  </button>
                ))}
              </div>
              <p className="dcl__readout">{placeNote}</p>
            </Group>
          )}

          <p className="dcl__readout dcl__readout--foot">
            Every axis rides in the URL, so a combination you like stays
            linkable. Placement applies to the anchor only; a backdrop has no
            side to sit on.
          </p>
        </div>
      )}
    </aside>
  );
}
