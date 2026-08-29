"use client";

// EXPERIENCE LAB — eight answers to one section.
//
// Scope: path 03 of the Consulting chapter ("Review My Experience"), and
// nothing else. The Consulting page around it is reproduced, not redesigned.
//
// HOW TO READ IT
//
// Every concept renders inside a replica of the real card — statue, chapter
// rail, demoted eyebrow, the three track rows with 03 playing — because the
// brief's actual question is whether a direction feels native to that, and an
// artboard cannot answer it. `BASE` renders production's shipped Experience
// screen through the real component, so the comparison has a floor.
//
// THE READOUT
//
// Each frame reports the sheet's content height against the sheet's own height.
// The shipped section measures 873 / 518 at 402px wide: 355px of the record is
// below the fold of a nested scroller that gives no sign of being scrollable,
// inside a card that is itself a scroll stop. `FITS` versus `+NNN` is the one
// number that separates a direction that works on a phone from one that only
// works in a screenshot.

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  CONCEPTS,
  DEVICE_PRESETS,
  getConcept,
  type ConceptId,
  type DevicePreset,
} from "@/data/experienceLab";
import ExperienceCard, { type FitReading } from "./ExperienceCard";
import Ledger from "./concepts/Ledger";
import Trajectory from "./concepts/Trajectory";
import Axes from "./concepts/Axes";
import Scale from "./concepts/Scale";
import LinerNotes from "./concepts/LinerNotes";
import Sentence from "./concepts/Sentence";
import Record from "./concepts/Record";
import Playhead from "./concepts/Playhead";
import "./experience-lab.css";

const BODIES: Record<ConceptId, () => React.ReactElement> = {
  ledger: Ledger,
  trajectory: Trajectory,
  axes: Axes,
  scale: Scale,
  liner: LinerNotes,
  sentence: Sentence,
  record: Record,
  playhead: Playhead,
};

/** `null` selects production's shipped screen. */
type Selection = ConceptId | "baseline" | "compare";

/* ---------------------------------------------------------------------------
   One framed phone
   ------------------------------------------------------------------------ */

function Frame({
  id,
  preset,
  scale,
}: {
  id: ConceptId | "baseline";
  preset: DevicePreset;
  scale: number;
}) {
  const [fit, setFit] = useState<FitReading | null>(null);
  const onFit = useCallback((r: FitReading) => {
    setFit((prev) =>
      prev && prev.content === r.content && prev.box === r.box ? prev : r
    );
  }, []);

  const meta = id === "baseline" ? null : getConcept(id);
  const Body = id === "baseline" ? null : BODIES[id];
  const over = fit ? fit.content - fit.box : 0;

  return (
    <figure className="xlab-frame">
      <figcaption className="xlab-frame__cap">
        <span className="xlab-frame__idx">{meta ? meta.index : "BASE"}</span>
        <span className="xlab-frame__name">
          {meta ? meta.name : "Shipping today"}
        </span>
        {fit && (
          <span
            className="xlab-frame__fit"
            data-over={over > 8 || undefined}
            title={`${fit.content}px of content in a ${fit.box}px sheet`}
          >
            {over > 8 ? `+${over}px below the fold` : "Fits"}
          </span>
        )}
      </figcaption>

      <div
        className="xlab-frame__scaler"
        style={{
          width: preset.w * scale,
          height: preset.h * scale,
        }}
      >
        <div
          className="xlab-frame__screen"
          style={{
            width: preset.w,
            height: preset.h,
            transform: scale === 1 ? undefined : `scale(${scale})`,
          }}
        >
          <div className="xlab-frame__chapter">
            {id === "baseline" ? (
              <ExperienceCard baseline concept="baseline" onFit={onFit} />
            ) : (
              <ExperienceCard concept={id} onFit={onFit}>
                {Body && <Body />}
              </ExperienceCard>
            )}
          </div>
        </div>
      </div>
    </figure>
  );
}

/* ---------------------------------------------------------------------------
   The lab
   ------------------------------------------------------------------------ */

export default function ExperienceLab() {
  const [selected, setSelected] = useState<Selection>("ledger");
  const [preset, setPreset] = useState<DevicePreset>(DEVICE_PRESETS[2]);
  const [avail, setAvail] = useState(1200);

  /* The lab is meant to be opened ON the phone it is designing for, so a frame
     wider than the window is scaled to fit rather than cropped or reflowed —
     the composition inside still lays out at true device pixels, which is what
     keeps the container queries and the fit readout honest. */
  useEffect(() => {
    const read = () => setAvail(window.innerWidth);
    read();
    window.addEventListener("resize", read);
    return () => window.removeEventListener("resize", read);
  }, []);

  const scale = useMemo(() => {
    const gutter = avail < 700 ? 20 : 48;
    return Math.min(1, (avail - gutter) / preset.w);
  }, [avail, preset.w]);

  const compare = selected === "compare";
  const active = compare || selected === "baseline" ? null : getConcept(selected);

  const order: (ConceptId | "baseline")[] = useMemo(
    () => ["baseline", ...CONCEPTS.map((c) => c.id)],
    []
  );

  return (
    <div className="xlab-page">
      <header className="xlab-bar">
        <div className="xlab-bar__brand">
          <span className="xlab-bar__kicker">Lab · section only</span>
          <h1 className="xlab-bar__title">My Experience</h1>
          <p className="xlab-bar__sub">
            Path 03 of the Consulting chapter, in situ. Production is untouched.
          </p>
        </div>

        <div className="xlab-bar__group">
          <span className="xlab-bar__label">Concept</span>
          <div className="xlab-switch" role="tablist" aria-label="Concept">
            <button
              type="button"
              role="tab"
              aria-selected={selected === "baseline"}
              className={`xlab-switch__btn ${selected === "baseline" ? "is-on" : ""}`}
              onClick={() => setSelected("baseline")}
            >
              Base
            </button>
            {CONCEPTS.map((c) => (
              <button
                key={c.id}
                type="button"
                role="tab"
                aria-selected={selected === c.id}
                className={`xlab-switch__btn ${selected === c.id ? "is-on" : ""}`}
                onClick={() => setSelected(c.id)}
              >
                {c.index}
              </button>
            ))}
            <button
              type="button"
              role="tab"
              aria-selected={compare}
              className={`xlab-switch__btn xlab-switch__btn--wide ${compare ? "is-on" : ""}`}
              onClick={() => setSelected("compare")}
            >
              Compare all
            </button>
          </div>
        </div>

        <div className="xlab-bar__group">
          <span className="xlab-bar__label">Width</span>
          <div className="xlab-switch">
            {DEVICE_PRESETS.map((p) => (
              <button
                key={p.label}
                type="button"
                aria-pressed={p.w === preset.w}
                className={`xlab-switch__btn ${p.w === preset.w ? "is-on" : ""}`}
                onClick={() => setPreset(p)}
              >
                {p.w}
              </button>
            ))}
          </div>
          <p className="xlab-bar__hint">
            {preset.label} · rendering at {Math.round(scale * 100)}%
          </p>
        </div>

        {active && (
          <div className="xlab-bar__read">
            <p className="xlab-bar__thesis">{active.thesis}</p>
            <p className="xlab-bar__solves">
              <span>Solving</span> {active.solves}
            </p>
          </div>
        )}
      </header>

      <main className={`xlab-stage ${compare ? "xlab-stage--compare" : ""}`}>
        {compare ? (
          order.map((id) => (
            <Frame key={id} id={id} preset={preset} scale={scale} />
          ))
        ) : (
          <Frame
            key={selected}
            id={selected === "baseline" ? "baseline" : (selected as ConceptId)}
            preset={preset}
            scale={scale}
          />
        )}
      </main>

      {compare && (
        <footer className="xlab-notes">
          <h2 className="xlab-notes__head">Directions</h2>
          <ol className="xlab-notes__list">
            {CONCEPTS.map((c) => (
              <li key={c.id} className="xlab-notes__item">
                <span className="xlab-notes__idx">{c.index}</span>
                <div>
                  <h3 className="xlab-notes__name">{c.name}</h3>
                  <p className="xlab-notes__thesis">{c.thesis}</p>
                  <p className="xlab-notes__solves">{c.solves}</p>
                </div>
              </li>
            ))}
          </ol>
        </footer>
      )}
    </div>
  );
}
