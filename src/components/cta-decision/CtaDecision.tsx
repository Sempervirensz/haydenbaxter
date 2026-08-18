"use client";

// One person, three ways in, decided on the first screen.
//
// The organising idea is self-selection: identity first, three selectors that
// are always visible, one focused panel, one or two obvious actions. A visitor
// should know which of the three they are before they have finished reading.
//
// The selectors are TRACKS ON A DISC, not tabs. That is why they are numbered,
// why they sit in a list beside the object rather than in a strip above a
// content well, and why choosing one rewrites the handwritten label across the
// disc: every path is a track on the same record, which is the whole argument
// that these are not three unrelated careers.
//
// Isolated by construction — nothing here imports from the homepage, the Work
// section or the production CTA, and nothing outside this folder imports it.

import { useCallback, useId, useRef, useState } from "react";
import {
  DEFAULT_PATH,
  DISC_ALT,
  DISC_SRC,
  IDENTITY,
  PATHS,
  getPath,
  type DecisionAction,
  type PathKey,
} from "@/data/ctaDecision";
import "./cta-decision.css";

export default function CtaDecision() {
  const [active, setActive] = useState<PathKey>(DEFAULT_PATH);
  const path = getPath(active);
  const baseId = useId();
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);

  // Arrow keys move between tracks, which is what a tablist owes a keyboard
  // user — Tab alone would make the three selectors three separate stops and
  // lose the sense that they are one control.
  const onKeyDown = useCallback((e: React.KeyboardEvent, i: number) => {
    const last = PATHS.length - 1;
    let next: number | null = null;
    if (e.key === "ArrowRight" || e.key === "ArrowDown") next = i === last ? 0 : i + 1;
    if (e.key === "ArrowLeft" || e.key === "ArrowUp") next = i === 0 ? last : i - 1;
    if (e.key === "Home") next = 0;
    if (e.key === "End") next = last;
    if (next === null) return;
    e.preventDefault();
    setActive(PATHS[next].id);
    tabRefs.current[next]?.focus();
  }, []);

  return (
    <main className="cdx">
      <span className="cdx__grain" aria-hidden="true" />

      <div className="cdx__inner">
        {/* ---- One coherent person, before any choice is offered ---- */}
        <header className="cdx__id">
          <p className="cdx__name">{IDENTITY.name}</p>
          <h1 className="cdx__statement">{IDENTITY.statement}</h1>
          <p className="cdx__supporting">{IDENTITY.supporting}</p>
        </header>

        <div className="cdx__field">
          {/* ---- The tracklist ---- */}
          <div className="cdx__left">
            <p className="cdx__tracksLabel" id={`${baseId}-tracks`}>
              {IDENTITY.tracksLabel}
            </p>

            <div
              className="cdx__tracks"
              role="tablist"
              aria-labelledby={`${baseId}-tracks`}
            >
              {PATHS.map((p, i) => {
                const selected = p.id === active;
                return (
                  <button
                    key={p.id}
                    ref={(el) => {
                      tabRefs.current[i] = el;
                    }}
                    type="button"
                    role="tab"
                    id={`${baseId}-tab-${p.id}`}
                    aria-selected={selected}
                    aria-controls={`${baseId}-panel`}
                    /* Only the selected track is in the tab order; the arrow
                       keys above move between them. */
                    tabIndex={selected ? 0 : -1}
                    className={`cdx__track ${selected ? "is-active" : ""}`}
                    onClick={() => setActive(p.id)}
                    onKeyDown={(e) => onKeyDown(e, i)}
                  >
                    <span className="cdx__trackNum" aria-hidden="true">
                      {p.index}
                    </span>
                    <span className="cdx__trackMain">
                      <span className="cdx__trackLabel">{p.label}</span>
                      <span className="cdx__trackHint">{p.hint}</span>
                    </span>
                    <span className="cdx__trackMark" aria-hidden="true" />
                  </button>
                );
              })}
            </div>

            {/* ---- The one focused panel ---- */}
            <section
              className="cdx__panel"
              id={`${baseId}-panel`}
              role="tabpanel"
              aria-labelledby={`${baseId}-tab-${path.id}`}
              /* Keyed on the path so React remounts it: the entry animation
                 should replay on every change, and a persisted node would
                 animate once and then sit still. */
              key={path.id}
            >
              <h2 className="cdx__panelTitle">{path.title}</h2>
              <p className="cdx__panelLede">{path.lede}</p>

              {path.blocks && (
                <div className="cdx__blocks">
                  {path.blocks.map((b) => (
                    <div className="cdx__block" key={b.label}>
                      <h3 className="cdx__blockLabel">{b.label}</h3>
                      <p className="cdx__blockBody">{b.body}</p>
                      <div className="cdx__blockActions">
                        <Action action={b.primary} kind="primary" />
                        <Action action={b.proof} kind="proof" />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {path.actions && (
                <div className="cdx__actions">
                  {path.actions.map((a, i) => (
                    <Action key={a.label} action={a} kind={i === 0 ? "primary" : "proof"} />
                  ))}
                </div>
              )}

              {path.credibility && (
                <p className="cdx__credibility">{path.credibility}</p>
              )}
            </section>
          </div>

          {/* ---- The disc: one object, every path a track on it ---- */}
          <div className="cdx__discWrap" aria-hidden="true">
            <div
              className="cdx__disc"
              style={{ "--disc-angle": `${path.discAngle}deg` } as React.CSSProperties}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img className="cdx__discImg" src={DISC_SRC} alt="" />
              <span className="cdx__discSheen" />
              <span className="cdx__discHole" />
            </div>

            <p className="cdx__discLabel" key={path.id}>
              {path.discLabel}
            </p>

            <p className="cdx__discMeta">
              {path.index} / {String(PATHS.length).padStart(2, "0")}
            </p>
          </div>
        </div>
      </div>

      {/* The disc is decorative, so its alt text is empty above. The object is
          described once here for anyone not seeing it. */}
      <p className="cdx__srOnly">{DISC_ALT}</p>
    </main>
  );
}

/* ---------------------------------------------------------------------------
   Actions. `primary` is the DYMO plate; `proof` is a quiet link for the reader
   who wants evidence before they book anything.
   ------------------------------------------------------------------------ */
function Action({ action, kind }: { action: DecisionAction; kind: "primary" | "proof" }) {
  const external = action.external
    ? { target: "_blank", rel: "noopener noreferrer" as const }
    : {};
  return (
    <a className={`cdx__action cdx__action--${kind}`} href={action.href} {...external}>
      <span>{action.label}</span>
      <span className="cdx__chev" aria-hidden="true">
        ›
      </span>
    </a>
  );
}
