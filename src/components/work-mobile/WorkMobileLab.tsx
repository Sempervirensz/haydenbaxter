"use client";

// Mobile Work System — review lab.
//
// The lab is a wrapper, not the product. MobileWorkSequence holds no lab chrome
// and takes no lab-only props, so what you review here is exactly what would be
// promoted.
//
// Phones are real fixed-size containers rather than iframes: the sequence is
// sized by container queries, so a plain sized div reproduces a phone truthfully
// AND lets the proposed system sit beside the current production mobile Work
// section for comparison.

import { useCallback, useRef, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import MobileWorkSequence from "./MobileWorkSequence";
import { SYSTEM_RULES, CARD_NOTES, chapterOf } from "@/data/workMobileSystem";
import "./work-mobile-lab.css";

// Only mounted when the comparison is switched on — it pulls in the CD player
// art, the globe, and the whole production detail stack.
const ProductionWork = dynamic(() => import("@/components/WorkSection"), {
  ssr: false,
  loading: () => <div className="wml-loading">loading production…</div>,
});

interface Preset {
  label: string;
  w: number;
  h: number;
}

const PRESETS: Preset[] = [
  { label: "SE (1st)", w: 320, h: 568 },
  { label: "SE (2/3)", w: 375, h: 667 },
  { label: "Android", w: 360, h: 740 },
  { label: "iPhone 15", w: 393, h: 852 },
  { label: "Pro Max", w: 430, h: 932 },
];

const CHAPTERS = [1, 2, 3, 4] as const;

function clamp(v: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(hi, v));
}

export default function WorkMobileLab() {
  const [w, setW] = useState(393);
  const [h, setH] = useState(852);
  const [motion, setMotion] = useState(true);
  const [stillSim, setStillSim] = useState(false);
  const [compare, setCompare] = useState(false);
  const [noteId, setNoteId] = useState<1 | 2 | 3 | 4>(1);

  const scrollRef = useRef<HTMLDivElement | null>(null);

  const activePreset = PRESETS.find((p) => p.w === w && p.h === h)?.label ?? "Custom";
  const note = CARD_NOTES.find((n) => n.id === noteId)!;

  // Jump the phone to a chapter. Instant rather than smooth: a mandatory-height
  // chapter track plus an animated scroll is exactly where scroll animations get
  // interrupted, and an instant jump is also correct under reduced motion.
  const jumpTo = useCallback((i: number) => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTop = i * el.clientHeight;
  }, []);

  return (
    <div className={`wml ${stillSim ? "mws-sim-still" : ""}`}>
      <aside className="wml__panel">
        <div>
          <span className="wml__kicker">Lab · Batch 5</span>
          <h1 className="wml__title">Mobile Work System</h1>
          <p className="wml__sub">
            All four Work chapters as one phone sequence. WorldPulse keeps the
            approved Passport Sheet; the other three are built to match it.
          </p>
        </div>

        <div className="wml__group">
          <span className="wml__groupLabel">Jump to chapter</span>
          <div className="wml__chapters">
            {CHAPTERS.map((id, i) => {
              const ch = chapterOf(id);
              return (
                <button
                  key={id}
                  type="button"
                  className={`wml__chapter ${noteId === id ? "is-on" : ""}`}
                  onClick={() => {
                    jumpTo(i);
                    setNoteId(id);
                  }}
                >
                  <span className="wml__chapterNum">{ch.num}</span>
                  <span className="wml__chapterName">{ch.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="wml__group">
          <span className="wml__groupLabel">Device</span>
          <div className="wml__presets">
            {PRESETS.map((p) => (
              <button
                key={p.label}
                type="button"
                className={`wml__preset ${activePreset === p.label ? "is-on" : ""}`}
                onClick={() => {
                  setW(p.w);
                  setH(p.h);
                }}
              >
                <span className="wml__presetName">{p.label}</span>
                <span className="wml__presetDim">{p.w}×{p.h}</span>
              </button>
            ))}
          </div>
          <label className="wml__slider">
            <span className="wml__sliderMeta"><span>Width</span><span>{w}px</span></span>
            <input
              type="range"
              min={320}
              max={480}
              value={w}
              onChange={(e) => setW(clamp(Number(e.target.value), 320, 480))}
            />
          </label>
          <label className="wml__slider">
            <span className="wml__sliderMeta"><span>Height</span><span>{h}px</span></span>
            <input
              type="range"
              min={540}
              max={960}
              value={h}
              onChange={(e) => setH(clamp(Number(e.target.value), 540, 960))}
            />
          </label>
        </div>

        <div className="wml__group">
          <span className="wml__groupLabel">Motion</span>
          <button
            type="button"
            className={`wml__btn ${motion ? "is-on" : ""}`}
            aria-pressed={motion}
            onClick={() => setMotion((v) => !v)}
          >
            Sequence motion {motion ? "· on" : "· off"}
          </button>
          <button
            type="button"
            className={`wml__btn ${stillSim ? "is-on" : ""}`}
            aria-pressed={stillSim}
            onClick={() => setStillSim((v) => !v)}
          >
            Simulate reduced motion {stillSim ? "· on" : "· off"}
          </button>
          <p className="wml__hint">
            One rAF loop drives the whole sequence: chapter handoff on all four,
            image drift on the two photo cards only. The real{" "}
            <code>prefers-reduced-motion</code> is honoured independently.
          </p>
        </div>

        <div className="wml__group">
          <span className="wml__groupLabel">Compare</span>
          <button
            type="button"
            className={`wml__btn ${compare ? "is-on" : ""}`}
            aria-pressed={compare}
            onClick={() => setCompare((v) => !v)}
          >
            Production mobile {compare ? "· shown" : "· hidden"}
          </button>
          <p className="wml__hint">
            Mounts today&rsquo;s live mobile Work section beside the proposal, at the
            same phone size. Heavy — it loads the CD player and the globe.
          </p>
        </div>

        <nav className="wml__links">
          <Link href="/worldpulse-hero-lab/mobile" className="wml__btn">
            ← WorldPulse mobile lab
          </Link>
          <Link href="/site-parallax-lab/work-cinema" className="wml__btn">
            Desktop cinematic stack
          </Link>
        </nav>
      </aside>

      <main className="wml__stage">
        <div className="wml__frames">
          <figure className="wml-phone">
            <div className="wml-phone__shell" style={{ width: w, height: h }}>
              <div className="wml-phone__screen" ref={scrollRef}>
                <MobileWorkSequence scrollRootRef={scrollRef} motion={motion && !stillSim} />
              </div>
            </div>
            <figcaption className="wml-phone__cap">
              Proposed · {w}×{h}
            </figcaption>
          </figure>

          {compare && (
            <figure className="wml-phone">
              <div className="wml-phone__shell" style={{ width: w, height: h }}>
                <div className="wml-phone__screen wml-phone__screen--prod">
                  <ProductionWork />
                </div>
              </div>
              <figcaption className="wml-phone__cap">
                Production today · {w}×{h}
              </figcaption>
            </figure>
          )}
        </div>

        <section className="wml__notes">
          <div className="wml__notesCol">
            <h2>Shared system</h2>
            <p className="wml__notesLede">
              Eight rules every card obeys. This is what makes four different
              compositions read as one portfolio.
            </p>
            <dl className="wml__rules">
              {SYSTEM_RULES.map((r) => (
                <div key={r.label}>
                  <dt>{r.label}</dt>
                  <dd>{r.rule}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="wml__notesCol">
            <h2>{note.title}</h2>
            <p className="wml__notesLede">{note.reasoning}</p>
            <h3>Card-specific</h3>
            <ul className="wml__specific">
              {note.specific.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
            <p className="wml__notesFoot">
              Content comes from <code>WORK_SCREENS</code>,{" "}
              <code>CINEMATIC_CARDS</code>, <code>scLab</code>, and{" "}
              <code>CALENDLY_URL</code> — the same sources production reads, so
              this lab cannot drift from the site.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}
