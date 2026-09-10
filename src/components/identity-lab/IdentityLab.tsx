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
import Throughline from "./concepts/Throughline";
import Route from "./concepts/Route";
import Asks from "./concepts/Asks";
import Plain from "./concepts/Plain";
import Passport from "./concepts/Passport";
import "./identity-lab.css";

const BODIES: Record<ConceptId, () => React.ReactElement> = {
  throughline: Throughline,
  route: Route,
  asks: Asks,
  plain: Plain,
  passport: Passport,
};

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
  const [sel, setSel] = useState<Selection>("throughline");
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

  return (
    <main className="ilab" id="main" tabIndex={-1}>
      <header className="ilab-head">
        <p className="ilab-head__kicker">Identity Lab · not indexed</p>
        <h1 className="ilab-head__title">
          Who is Hayden, and why is it one person?
        </h1>
        <p className="ilab-head__lede">
          Five directions for the About + Personas pair, each rendered on the
          site’s own ground. <strong>0</strong> shows what ships today —
          production’s real components, not a redraw. <strong>1–5</strong> pick
          a concept.
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
              <div className="ilab-section">
                <h2 className="ilab-section__heading">{meta?.heading}</h2>
                {Body && <Body />}
              </div>
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
