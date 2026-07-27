"use client";

// WorldPulse — mobile experience lab.
//
// Companion to the desktop WorldPulseHeroLab (/worldpulse-hero-lab), which
// settled the ≥1024px composition. This route asks the separate question the
// desktop lab could not: what should the FIRST WorldPulse card be on a narrow
// touch screen?
//
// Deliberately NOT an iframe viewer like ResponsiveViewer — the concepts are
// sized by CSS container queries against the phone frame, not by viewport media
// queries, so a plain fixed-size frame reproduces phone dimensions exactly and
// three of them can sit side by side in Compare mode. That also means every
// concept is already container-driven if it is later promoted into the
// cinematic card.
//
// Production is untouched: nothing here imports from CinematicCardBody /
// WorkSection*, and no production stylesheet is modified.

import { useRef, useState } from "react";
import Link from "next/link";
import {
  CONCEPTS,
  DEVICE_PRESETS,
  getWorldPulseContent,
  type ConceptId,
  type DevicePreset,
} from "@/data/worldpulseMobileLab";
import ConceptDossier from "./concepts/ConceptDossier";
import ConceptSheet from "./concepts/ConceptSheet";
import ConceptTwoUp from "./concepts/ConceptTwoUp";
import "./worldpulse-mobile-lab.css";

const CONTENT = getWorldPulseContent();

function clamp(v: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(hi, v));
}

/** One phone. Owns its own scroll root so the parallax has something to measure
 *  against, and so Scroll-stage mode is per-frame rather than page-wide. */
function PhoneFrame({
  concept,
  w,
  h,
  stage,
  motion,
  label,
}: {
  concept: ConceptId;
  w: number;
  h: number;
  stage: boolean;
  motion: boolean;
  label?: string;
}) {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const meta = CONCEPTS.find((c) => c.id === concept)!;

  const card =
    concept === "dossier" ? (
      <ConceptDossier c={CONTENT} />
    ) : concept === "sheet" ? (
      <ConceptSheet c={CONTENT} scrollRootRef={scrollRef} motion={motion} />
    ) : (
      <ConceptTwoUp c={CONTENT} />
    );

  return (
    <figure className="wpm-phone">
      <div className="wpm-phone__shell" style={{ width: w, height: h }}>
        <div
          className={`wpm-phone__screen ${stage ? "is-stage" : ""}`}
          ref={scrollRef}
        >
          {stage ? (
            <div className="wpm-stage">
              <div className="wpm-stage__lead">
                <span>previous chapter</span>
                <span aria-hidden="true">↓</span>
              </div>
              <div className="wpm-stage__slot">{card}</div>
              <div className="wpm-stage__trail">
                <span>next chapter</span>
              </div>
            </div>
          ) : (
            card
          )}
        </div>
      </div>
      <figcaption className="wpm-phone__cap">
        {label ?? meta.label} · {w}×{h}
      </figcaption>
    </figure>
  );
}

export default function WorldPulseMobileLab() {
  const [concept, setConcept] = useState<ConceptId>("sheet");
  const [w, setW] = useState(DEVICE_PRESETS[3].w);
  const [h, setH] = useState(DEVICE_PRESETS[3].h);
  const [compare, setCompare] = useState(false);
  const [stage, setStage] = useState(false);
  const [motion, setMotion] = useState(true);
  const [noMotion, setNoMotion] = useState(false);

  const meta = CONCEPTS.find((c) => c.id === concept)!;
  const activePreset =
    DEVICE_PRESETS.find((p) => p.w === w && p.h === h)?.label ?? "Custom";

  const applyPreset = (p: DevicePreset) => {
    setW(p.w);
    setH(p.h);
  };

  return (
    <div className={`wpm ${noMotion ? "wpm--noMotion" : ""}`}>
      <aside className="wpm__panel">
        <div className="wpm__brand">
          <span className="wpm__kicker">Lab · Batch 4</span>
          <h1 className="wpm__title">WorldPulse — mobile</h1>
          <p className="wpm__sub">
            Three directions for the first Work card on a narrow touch screen.
            Desktop is settled; this is the phone question.
          </p>
        </div>

        <div className="wpm__group">
          <span className="wpm__groupLabel">Concept</span>
          <div className="wpm__concepts" role="tablist" aria-label="Concept">
            {CONCEPTS.map((c) => (
              <button
                key={c.id}
                type="button"
                role="tab"
                aria-selected={concept === c.id}
                className={`wpm__concept ${concept === c.id ? "is-on" : ""}`}
                onClick={() => setConcept(c.id)}
              >
                <span className="wpm__conceptName">{c.label}</span>
                <span className="wpm__conceptTemper">{c.temper}</span>
                {c.recommended && (
                  <span className="wpm__rec" title="Recommended direction">
                    ★
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="wpm__group">
          <span className="wpm__groupLabel">Device</span>
          <div className="wpm__presets">
            {DEVICE_PRESETS.map((p) => (
              <button
                key={p.label}
                type="button"
                className={`wpm__preset ${activePreset === p.label ? "is-on" : ""}`}
                onClick={() => applyPreset(p)}
              >
                <span className="wpm__presetName">{p.label}</span>
                <span className="wpm__presetDim">
                  {p.w}×{p.h}
                </span>
              </button>
            ))}
          </div>
          <label className="wpm__slider">
            <span className="wpm__sliderMeta">
              <span>Width</span>
              <span>{w}px</span>
            </span>
            <input
              type="range"
              min={320}
              max={480}
              step={1}
              value={w}
              onChange={(e) => setW(clamp(Number(e.target.value), 320, 480))}
            />
          </label>
          <label className="wpm__slider">
            <span className="wpm__sliderMeta">
              <span>Height</span>
              <span>{h}px</span>
            </span>
            <input
              type="range"
              min={540}
              max={960}
              step={1}
              value={h}
              onChange={(e) => setH(clamp(Number(e.target.value), 540, 960))}
            />
          </label>
        </div>

        <div className="wpm__group">
          <span className="wpm__groupLabel">View</span>
          <button
            type="button"
            className={`wpm__btn ${compare ? "is-on" : ""}`}
            aria-pressed={compare}
            onClick={() => setCompare((v) => !v)}
          >
            Compare all three {compare ? "· on" : "· off"}
          </button>
          <button
            type="button"
            className={`wpm__btn ${stage ? "is-on" : ""}`}
            aria-pressed={stage}
            onClick={() => setStage((v) => !v)}
          >
            Scroll stage {stage ? "· on" : "· off"}
          </button>
          <p className="wpm__hint">
            Scroll stage drops the card into a chapter track like the production
            cinematic stack, so it can be scrolled past. Concept B&rsquo;s parallax
            is only observable here.
          </p>
        </div>

        <div className="wpm__group">
          <span className="wpm__groupLabel">Motion</span>
          <button
            type="button"
            className={`wpm__btn ${motion ? "is-on" : ""}`}
            aria-pressed={motion}
            onClick={() => setMotion((v) => !v)}
          >
            Parallax {motion ? "· on" : "· off"}
          </button>
          <button
            type="button"
            className={`wpm__btn ${noMotion ? "is-on" : ""}`}
            aria-pressed={noMotion}
            onClick={() => setNoMotion((v) => !v)}
          >
            Simulate reduced motion {noMotion ? "· on" : "· off"}
          </button>
          <p className="wpm__hint">
            The real <code>prefers-reduced-motion</code> is honoured
            independently; this switch only lets you check it without changing OS
            settings.
          </p>
        </div>

        <nav className="wpm__links">
          <Link href="/worldpulse-hero-lab" className="wpm__btn">
            ← Desktop hero lab
          </Link>
          <Link href="/site-parallax-lab/work-cinema" className="wpm__btn">
            Cinematic stack
          </Link>
        </nav>
      </aside>

      <main className="wpm__stageArea">
        <div className={`wpm__frames ${compare ? "is-compare" : ""}`}>
          {compare ? (
            CONCEPTS.map((c) => (
              <PhoneFrame
                key={c.id}
                concept={c.id}
                w={w}
                h={h}
                stage={stage}
                motion={motion && !noMotion}
                label={c.label}
              />
            ))
          ) : (
            <PhoneFrame
              concept={concept}
              w={w}
              h={h}
              stage={stage}
              motion={motion && !noMotion}
            />
          )}
        </div>

        <section className="wpm__notes" aria-live="polite">
          <header className="wpm__notesHead">
            <h2>
              {meta.label}
              <span className="wpm__notesTemper">{meta.temper}</span>
              {meta.recommended && <span className="wpm__notesRec">Recommended</span>}
              {meta.parallax && <span className="wpm__notesPlx">Uses parallax</span>}
            </h2>
            <p className="wpm__notesIdea">{meta.idea}</p>
          </header>

          {meta.why && (
            <div className="wpm__why">
              <h3>Why this one</h3>
              <p>{meta.why}</p>
            </div>
          )}

          <div className="wpm__notesCols">
            <div>
              <h3>Strengths</h3>
              <ul>
                {meta.strengths.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ul>
            </div>
            <div>
              <h3>Tradeoffs</h3>
              <ul>
                {meta.tradeoffs.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ul>
            </div>
          </div>
          <p className="wpm__notesFoot">
            All three use the real hero, the real copy from{" "}
            <code>WORK_SCREENS</code>, the real WorldPulse mark, and the real
            destination. Nothing here is wired into production.
          </p>
        </section>
      </main>
    </div>
  );
}
