"use client";

// 02 — AI & Emerging Tech Builds, three fidelity variations.
//
// The candy-bar stack is non-negotiable and is preserved in all three: cream
// gradient bars, mono caps names at 0.22em with a mono summary beneath, the
// chevron, the sheen sweep, and Cobalt Select on the active bar. Those values
// are copied from .etb-bar in work-details.css, not re-derived.
//
// The one genuine translation problem: desktop drives all of it from :hover,
// which does not exist on touch. Every variation here fires the same visual
// state from ACTIVATION instead — tap does what hover did.
//
//   A  Production Faithful — bars + full-height Project File push (what
//                            ETBDetail already does under 767px).
//   B  Inline Dossier      — bar expands in place; sticky section header.
//   C  Cobalt Depth        — desktop's flex weighting, driven by tap.

import { useMemo, useRef, useState } from "react";
import { WORK_SCREENS, type ETBProject } from "@/data/work";
import { Rail, useEscape } from "../parts";
import type { VariantKey } from "@/data/workMobileVariants";

const SCREEN = WORK_SCREENS.find((s) => s.type === "emerging-tech-builds");
if (!SCREEN || SCREEN.type !== "emerging-tech-builds") throw new Error("ETB screen missing");
const ETB = SCREEN.etb;

/** Same map ETBDetail keeps: only these have a standalone detail page. */
const ROUTES: Record<string, string> = {
  casebrief: "/emerging-tech-builds/casebrief",
  atomicos: "/emerging-tech-builds/atomic-os",
  cortex: "/emerging-tech-builds/cortex",
};

/** Four bars fit a phone card; five overflow at 568px. ProcureBridge is kept
 *  over OpenClaw because it has a brand mark and a real product story. */
const BAR_IDS = ["atomicos", "casebrief", "cortex", "procurebridge"];

/** Production's own summary shortener, matching getBriefSummary in ETBDetail —
 *  bars show a single clamped line, not the whole one-liner. */
function briefSummary(project: ETBProject): string {
  if (project.keepFullSummary) return project.oneLiner;
  const text = project.oneLiner.trim().replace(/\s+/g, " ").replace(/[.!?]\s*$/, "");
  const parts = text.split(/[:;,]/);
  const candidate = parts.find((p) => p.trim().length >= 14 && p.trim().length <= 52);
  if (candidate) return candidate.trim();
  if (parts[0]?.trim()) return parts[0].trim();
  return text.split(" ").slice(0, 6).join(" ");
}

/** The off-white Project File card — the same content contract as DossierCard
 *  in ETBDetail: mark, meta, title, hook, description, tags, CTA. */
function DossierBody({ project }: { project: ETBProject }) {
  const panel = project.panel;
  const route = ROUTES[project.id];
  return (
    <>
      {project.mark && (
        <img
          className="wf-dos__mark"
          src={project.mark.src}
          alt=""
          aria-hidden="true"
          width={project.mark.width}
          height={project.mark.height}
        />
      )}
      <span className="wf-dos__category">
        {panel?.meta ?? project.category} · {project.status}
      </span>
      <h3 className="wf-dos__title">{project.name}</h3>
      {panel?.hook && <p className="wf-dos__hook">{panel.hook}</p>}
      <p className="wf-dos__text">{panel?.description ?? project.oneLiner}</p>
      <div className="wf-dos__tags">
        {project.tags.map((t) => (
          <span key={t} className="wf-dos__tag">{t}</span>
        ))}
      </div>
      {route ? (
        <a className="wf-dos__cta" href={route}>
          {panel?.cta ?? `Explore ${project.name}`} →
        </a>
      ) : (
        <span className="wf-dos__cta wf-dos__cta--disabled">Coming Soon</span>
      )}
    </>
  );
}

export default function EtbCard({ variant }: { variant: VariantKey }) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const barRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  const projects = useMemo(
    () =>
      BAR_IDS.map((id) => ETB.projects.find((p) => p.id === id)).filter(
        (p): p is ETBProject => Boolean(p)
      ),
    []
  );

  const active = projects.find((p) => p.id === activeId) ?? null;
  // B expands in place, so there is no pushed overlay to treat as "open".
  const pushed = variant !== "b" && !!active;

  const close = () => {
    const id = activeId;
    setActiveId(null);
    if (id) barRefs.current[id]?.focus({ preventScroll: true });
  };
  useEscape(!!active, close);

  const stackClass = [
    "wf-etb__stack",
    variant === "b" ? "wf-etb__stack--inline wf-etb__stack--scroll" : "",
    variant === "c" ? "wf-etb__stack--depth" : "",
    variant === "c" && active ? "has-active" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <article className={`wf-card wf-card--etb ${pushed ? "is-open" : ""}`}>
      <Rail id={2} tone="onPanel" />

      <div className="wf-etb__body">
        <div
          className={`wf-etb__intro ${variant === "b" ? "wf-etb__intro--sticky" : ""}`}
        >
          <span className="wf-label">{ETB.credibilityLine}</span>
          <p className="wf-etb__desc">{ETB.intro}</p>
        </div>

        <ul className={stackClass} role="list" aria-label="Projects">
          {projects.map((project) => {
            const isActive = activeId === project.id;
            return (
              <li
                key={project.id}
                className={`wf-bar ${isActive ? "is-active" : ""} ${
                  variant === "b" && isActive ? "is-open" : ""
                }`}
              >
                <button
                  type="button"
                  className="wf-bar__head"
                  ref={(el) => {
                    barRefs.current[project.id] = el;
                  }}
                  aria-pressed={isActive}
                  aria-expanded={variant === "b" ? isActive : undefined}
                  onClick={() => setActiveId(isActive ? null : project.id)}
                >
                  <span className="wf-bar__sheen" aria-hidden="true" />
                  <span className="wf-bar__content">
                    <span className="wf-bar__name">{project.name}</span>
                    <span className="wf-bar__summary">{briefSummary(project)}</span>
                  </span>
                  <span className="wf-bar__chevron" aria-hidden="true">›</span>
                </button>

                {/* B only: the dossier lives inside the bar, so the rest of the
                    stack stays on screen and position is never lost. */}
                {variant === "b" && (
                  <div className="wf-bar__panel">
                    <div className="wf-bar__panelInner">
                      <div className="wf-dos__card" style={{ margin: 0, boxShadow: "none" }}>
                        <DossierBody project={project} />
                      </div>
                    </div>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      </div>

      {/* A and C: the Project File pushes up over the stack, matching
          production's mobile overlay. */}
      {variant !== "b" && (
        <div className="wf-dos" role="group" aria-label="Project file" inert={!active}>
          <div className="wf-dos__topbar">
            <span className="wf-dos__eyebrow">Project File</span>
            <button type="button" className="wf-dos__close" onClick={close}>
              Close
            </button>
          </div>
          <div className="wf-dos__card">
            {active && <DossierBody project={active} />}
          </div>
        </div>
      )}
    </article>
  );
}
