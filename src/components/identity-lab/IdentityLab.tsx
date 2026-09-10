"use client";

// IDENTITY LAB — five answers to "who is Hayden, and why is it one person?"
//
// SCOPE
// The About + Personas pair, and the redundancy those two create with the rest
// of the homepage. Production is untouched: this route is `page.dev.tsx`, so it
// exists under `next dev` and is never registered in the static-export build.
//
// HOW TO READ IT
//
// `BASELINE` renders production's real AboutSection and PersonasSection — the
// shipped components, not a reconstruction — so every comparison has a floor.
// A redrawn baseline would hide the exact thing being judged.
//
// Each concept renders on the site's own ground (#0a0a0a, the fluid type
// scale, the serif/sans/mono voices) at the width it would ship at. The
// question is whether a direction feels native to this site, and an artboard
// cannot answer that.
//
// THE PHONE FRAME
// Concept layout is written with `@container` queries against the frame, not
// `@media` queries against the viewport, so the 390px frame is a REAL narrow-
// width test rather than a scaled screenshot. The baseline is the exception —
// production's own CSS is viewport-driven, so the baseline only reflows when
// the actual window is narrow. The frame says so rather than pretending.
//
// THE READOUT
// Every concept ships with the same four panels: thesis, strengths, the honest
// weaknesses, and the site map — what the rest of the homepage does if this
// one ships. The last panel is the point. An identity section cannot be judged
// alone, because the redundancy being fixed is not inside it.

import { useEffect, useId, useState } from "react";
import {
  CONCEPTS,
  FAULTS,
  RESTATEMENTS,
  SHARED_ORDER,
  getConcept,
  type ConceptId,
} from "@/data/identityLab";
import AboutSection from "@/components/AboutSection";
import PersonasSection from "@/components/PersonasSection";
import Prose from "./concepts/Prose";
import "./identity-lab.css";

// One component, three treatments. The copy is identical in all three by
// construction, so each comparison isolates exactly one variable: 01 vs 02 is
// emphasis alone, 02 vs 03 is material alone.
const BODIES: Record<ConceptId, () => React.ReactElement> = {
  plain: () => <Prose />,
  deep: () => <Prose deep />,
  ground: () => <Prose deep ground />,
};

/**
 * Production's About + Personas, counted: a 75-word intro plus three titles and
 * nine bullets. Every treatment is measured against it live, so length stays a
 * number rather than an opinion — round one lost on exactly this and nothing on
 * screen was counting.
 *
 * The warn threshold is NOT a target. This format is deliberately ~145 words:
 * prose that carries an argument is not the same commitment as 216 words of
 * bullets, and an earlier 108-word threshold (half the baseline) flagged the
 * intended length as a failure. Warn only when a treatment stops being
 * meaningfully shorter than what ships today.
 */
const BASELINE_WORDS = 216;
const WARN_WORDS = 180;

type Selection = ConceptId | "baseline";
type Width = "page" | "phone";

/* ---------------------------------------------------------------------------
   Panels
   ------------------------------------------------------------------------ */

function Panel({
  title,
  children,
  tone,
}: {
  title: string;
  children: React.ReactNode;
  tone?: "warn";
}) {
  return (
    <section className="ilab-panel" data-tone={tone}>
      <h3 className="ilab-panel__title">{title}</h3>
      {children}
    </section>
  );
}

function Readout({ id }: { id: ConceptId }) {
  const c = getConcept(id);
  return (
    <div className="ilab-readout">
      <Panel title="Thesis">
        <p className="ilab-panel__lede">{c.thesis}</p>
        <p className="ilab-panel__body">{c.shape}</p>
      </Panel>

      <Panel title="Strengths">
        <ul className="ilab-panel__list">
          {c.strengths.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ul>
      </Panel>

      <Panel title="Weaknesses" tone="warn">
        <ul className="ilab-panel__list">
          {c.weaknesses.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ul>
      </Panel>

      <Panel title="What the rest of the homepage does">
        <ul className="ilab-moves">
          {c.moves.map((m) => (
            <li key={m.section + m.detail} className="ilab-move">
              <span className="ilab-move__verb" data-verb={m.verb}>
                {m.verb}
              </span>
              <span className="ilab-move__section">{m.section}</span>
              <span className="ilab-move__detail">{m.detail}</span>
            </li>
          ))}
        </ul>
      </Panel>

      <Panel title="SEO">
        <dl className="ilab-seo">
          <dt>Title</dt>
          <dd>{c.seo.title}</dd>
          <dt>Description</dt>
          <dd>{c.seo.description}</dd>
          <dt>Structured data</dt>
          <dd>
            <ul className="ilab-panel__list">
              {c.seo.schema.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
          </dd>
        </dl>
      </Panel>
    </div>
  );
}

/** The diagnosis. Shown with the baseline, because it is a reading OF the baseline. */
function Diagnosis() {
  const triad = RESTATEMENTS.filter((r) => r.triad).length;
  return (
    <div className="ilab-readout">
      <Panel title="The count" tone="warn">
        <p className="ilab-panel__lede">
          The same triad — AI, supply chain, WorldPulse — is asserted{" "}
          <strong>{triad} times</strong> in {triad} different vocabularies
          before a visitor reaches the footer.
        </p>
        <ol className="ilab-count">
          {RESTATEMENTS.map((r) => (
            <li key={r.where} className="ilab-count__row" data-triad={r.triad}>
              <span className="ilab-count__where">{r.where}</span>
              <span className="ilab-count__says">{r.says}</span>
            </li>
          ))}
        </ol>
      </Panel>

      <Panel title="What is structurally wrong">
        <ul className="ilab-faults">
          {FAULTS.map((f) => (
            <li key={f.title}>
              <strong>{f.title}.</strong> {f.body}
            </li>
          ))}
        </ul>
      </Panel>

      <Panel title="The order all five concepts agree on">
        <ol className="ilab-order">
          {SHARED_ORDER.map((s) => (
            <li key={s.step}>
              <span className="ilab-order__step">{s.step}</span>
              {s.note && <span className="ilab-order__note">{s.note}</span>}
            </li>
          ))}
        </ol>
        <p className="ilab-panel__body">
          None of the five argues about this part. Connect currently renders
          above About, so the live page asks for a booking before it finishes
          the introduction — that is a fix independent of which concept wins.
        </p>
      </Panel>
    </div>
  );
}

/* ---------------------------------------------------------------------------
   Shell
   ------------------------------------------------------------------------ */

export default function IdentityLab() {
  const [sel, setSel] = useState<Selection>("plain");
  const [width, setWidth] = useState<Width>("page");
  const uid = useId();

  // Number keys pick a concept, 0 picks the baseline — the lab is a comparison
  // tool and reaching for the mouse between two directions loses the compare.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const target = e.target as HTMLElement | null;
      if (target && /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName)) return;
      if (e.key === "0") setSel("baseline");
      const n = Number(e.key);
      if (n >= 1 && n <= CONCEPTS.length) setSel(CONCEPTS[n - 1].id);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const isBase = sel === "baseline";
  const meta = isBase ? null : getConcept(sel);
  const Body = isBase ? null : BODIES[sel];

  // Word count, measured off the rendered surface rather than the data file:
  // it counts what a visitor actually reads. `null` until after paint so the
  // server and first client render agree.
  const [words, setWords] = useState<number | null>(null);
  useEffect(() => {
    const el = document.querySelector(".ilab-surface");
    if (!el) return;
    const id = requestAnimationFrame(() => {
      const text = (el as HTMLElement).innerText ?? "";
      setWords(text.split(/\s+/).filter(Boolean).length);
    });
    return () => cancelAnimationFrame(id);
  }, [sel, width]);

  return (
    <main className="ilab" id="main" tabIndex={-1}>
      <header className="ilab-head">
        <p className="ilab-head__kicker">Identity Lab · not indexed</p>
        <h1 className="ilab-head__title">
          Who is Hayden, and why is it one person?
        </h1>
        <p className="ilab-head__lede">
          One format — the career arc in prose, after{" "}
          <span className="ilab-head__ref">brianlovin.com/about</span> — in three
          treatments over identical copy. <strong>0</strong> is what ships today.{" "}
          <strong>1</strong> is bolded only. <strong>2</strong> makes five terms
          open a detail. <strong>3</strong> sets the same words over a
          photograph. Paragraph one triages all three audiences.
        </p>
      </header>

      {/* Switcher. A real toolbar of buttons rather than a tablist: the panel
          below is a page region, not a tabpanel, and mislabelling it would
          promise a keyboard model this does not implement. */}
      <nav className="ilab-switch" aria-label="Concepts">
        <button
          type="button"
          className="ilab-switch__btn"
          data-active={isBase || undefined}
          aria-pressed={isBase}
          onClick={() => setSel("baseline")}
        >
          <span className="ilab-switch__idx">00</span>
          <span className="ilab-switch__name">Shipping today</span>
        </button>
        {CONCEPTS.map((c) => (
          <button
            key={c.id}
            type="button"
            className="ilab-switch__btn"
            data-active={sel === c.id || undefined}
            aria-pressed={sel === c.id}
            onClick={() => setSel(c.id)}
          >
            <span className="ilab-switch__idx">{c.index}</span>
            <span className="ilab-switch__name">{c.name}</span>
          </button>
        ))}

        <span className="ilab-switch__spacer" />

        {/* The number round one was missing. Production's About + Personas is
            216 words; anything at or above that is not a simplification. */}
        {words !== null && (
          <span
            className="ilab-count-meter"
            data-over={words > WARN_WORDS || undefined}
            title={`${words} words rendered · production's About + Personas is ${BASELINE_WORDS}`}
          >
            <strong>{words}</strong> words
            <span className="ilab-count-meter__vs">/ {BASELINE_WORDS} today</span>
          </span>
        )}

        <span className="ilab-widths" role="group" aria-label="Frame width">
          {(["page", "phone"] as Width[]).map((w) => (
            <button
              key={w}
              type="button"
              className="ilab-switch__btn ilab-switch__btn--w"
              data-active={width === w || undefined}
              aria-pressed={width === w}
              onClick={() => setWidth(w)}
            >
              {w === "page" ? "Page" : "390px"}
            </button>
          ))}
        </span>
      </nav>

      {/* The stage. `--ilab-frame` drives the container query inside the
          concepts, so the phone frame is a real narrow-width test. */}
      <div className="ilab-stage" data-width={width}>
        <div className="ilab-frame" id={`${uid}-frame`}>
          <section
            className="ilab-surface"
            aria-label={
              isBase ? "Shipping today" : `Concept ${meta?.index} — ${meta?.name}`
            }
          >
            {isBase ? (
              <>
                {/* Production's real sections, in production's order: Personas
                    sits above Connect, About sits below it. Connect is not
                    rendered here, but the order it separates is. */}
                <PersonasSection />
                <div className="ilab-gap" aria-hidden="true">
                  <span>Connect renders here on the live page</span>
                </div>
                <AboutSection />
              </>
            ) : (
              /* No shared heading wrapper: every concept carries its own
                 chapter rule and owns its full width, because full-bleed art
                 cannot live inside a gutter. */
              Body && <Body />
            )}
          </section>
        </div>

        {width === "phone" && isBase && (
          <p className="ilab-note">
            The baseline’s own CSS is viewport-driven, not container-driven, so
            it does not reflow inside this frame. Narrow the window to see
            production’s real phone layout.
          </p>
        )}
      </div>

      {isBase ? <Diagnosis /> : <Readout id={sel} />}
    </main>
  );
}
