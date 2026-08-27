"use client";

// 02 — AI & Emerging Tech Builds · approved mobile design: Option B,
// "Inline Dossier".
//
// The candy-bar stack is preserved exactly — cream gradient bars, mono caps
// names at 0.22em, the mono summary, the chevron, the sheen sweep, and Cobalt
// Select on the active bar (values copied from .etb-bar in work-details.css).
// Desktop drives all of that from :hover, which touch does not have, so every
// state fires from ACTIVATION instead.
//
// Inline Dossier: tapping a bar expands it IN PLACE into its off-white Project
// File, so the other projects stay on screen and you never lose your position
// in the stack. The stack scrolls; a sticky section header keeps the section
// identified.

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { WORK_SCREENS, type ETBProject } from "@/data/work";
import {
  sortProjects,
  resolveSortField,
  ETB_DETAIL_ROUTES,
} from "@/components/work/ETBDetail";
import { Rail, useEscape } from "./shared";

const SCREEN = WORK_SCREENS.find((s) => s.type === "emerging-tech-builds");
if (!SCREEN || SCREEN.type !== "emerging-tech-builds") throw new Error("ETB screen missing");
const ETB = SCREEN.etb;

/* Project set + order come from production, not from a list here.
 *
 * An earlier version hardcoded four ids in a hand-picked order, which drifted
 * from the site in two ways at once: it dropped OpenClaw, and it ordered the
 * bars AtomicOS-first while /emerging-tech-builds sorts by completenessScore
 * (CaseBrief-first). Same projects, two different orders on one site.
 *
 * Reusing ETBDetail's own sort keeps the homepage card and the gallery in
 * lockstep — including if `defaultSort` ever changes.
 *
 * Verified at 320×568 (smallest supported phone): with all five bars, every
 * dossier's "Explore…" CTA is still reachable. */

/** Production's own summary shortener, matching getBriefSummary in ETBDetail. */
function briefSummary(project: ETBProject): string {
  if (project.keepFullSummary) return project.oneLiner;
  const text = project.oneLiner.trim().replace(/\s+/g, " ").replace(/[.!?]\s*$/, "");
  const parts = text.split(/[:;,]/);
  const candidate = parts.find((p) => p.trim().length >= 14 && p.trim().length <= 52);
  if (candidate) return candidate.trim();
  if (parts[0]?.trim()) return parts[0].trim();
  return text.split(" ").slice(0, 6).join(" ");
}

/** The off-white Project File — same content contract as DossierCard in
 *  ETBDetail: mark, meta, title, hook, description, tags, CTA. */
function DossierBody({ project }: { project: ETBProject }) {
  const panel = project.panel;
  const route = ETB_DETAIL_ROUTES[project.id];
  return (
    <>
      {project.mark && (
        <img
          className="wm-dos__mark"
          src={project.mark.src}
          alt=""
          aria-hidden="true"
          width={project.mark.width}
          height={project.mark.height} loading="lazy" decoding="async" />
      )}
      <span className="wm-dos__category">
        {panel?.meta ?? project.category} · {project.status}
      </span>
      <h3 className="wm-dos__title">{project.name}</h3>
      {panel?.hook && <p className="wm-dos__hook">{panel.hook}</p>}
      <p className="wm-dos__text">{panel?.description ?? project.oneLiner}</p>
      <div className="wm-dos__tags">
        {project.tags.map((t) => (
          <span key={t} className="wm-dos__tag">{t}</span>
        ))}
      </div>
      {/* next/link, matching ETBDetail's ProjectCTA exactly.
          A plain <a> here did a FULL document load: the app remounted, which
          reset the soft-lock gate and lost scroll position, and pressing Back
          re-loaded the homepage from scratch. Client-side
          navigation keeps Back/Forward and the session intact. */}
      {route ? (
        <Link
          className="wm-dos__cta"
          href={route}
          aria-label={`${panel?.cta ?? `Explore ${project.name}`} for ${project.name}`}
        >
          {panel?.cta ?? `Explore ${project.name}`} →
        </Link>
      ) : (
        <span className="wm-dos__cta wm-dos__cta--disabled">Coming Soon</span>
      )}
    </>
  );
}

export default function MobileEtbCard() {
  const [activeId, setActiveId] = useState<string | null>(null);
  const barRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const stackRef = useRef<HTMLUListElement | null>(null);

  // When a bar opens, bring its head to the top of the stack scroller so the
  // whole dossier is reachable by scrolling down inside the stack. Without this,
  // opening a LOWER bar on a short phone (the dossier is taller than the stack
  // viewport) leaves its CTA below the fold with no way to reach it. Internal
  // scroll only — never touches the page scroll. Column-reverse math is avoided
  // by measuring rects rather than offsetTop (the card is the offset parent).
  useEffect(() => {
    if (!activeId) return;
    const head = barRefs.current[activeId];
    const stack = stackRef.current;
    if (!head || !stack) return;
    const li = head.closest("li");
    if (!li) return;
    // Next frame, so the sticky intro + any layout have settled.
    const id = requestAnimationFrame(() => {
      const delta =
        li.getBoundingClientRect().top - stack.getBoundingClientRect().top;
      stack.scrollTo({
        top: stack.scrollTop + delta - 6,
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
          ? "auto"
          : "smooth",
      });
    });
    return () => cancelAnimationFrame(id);
  }, [activeId]);

  const projects = useMemo(
    () => sortProjects(ETB.projects, resolveSortField(ETB)),
    []
  );

  const close = () => {
    const id = activeId;
    setActiveId(null);
    if (id) barRefs.current[id]?.focus({ preventScroll: true });
  };
  useEscape(!!activeId, close);

  return (
    <article className="wm-card wm-card--etb">
      <Rail id={2} tone="onPanel" />

      <div className="wm-etb__body">
        <div className="wm-etb__intro wm-etb__intro--sticky">
          <span className="wm-label">{ETB.credibilityLine}</span>
          <p className="wm-etb__desc">{ETB.intro}</p>
        </div>

        <ul
          className="wm-etb__stack wm-etb__stack--inline wm-etb__stack--scroll"
          role="list"
          aria-label="Projects"
          ref={stackRef}
        >
          {projects.map((project) => {
            const isActive = activeId === project.id;
            return (
              <li
                key={project.id}
                className={`wm-bar ${isActive ? "is-active is-open" : ""}`}
              >
                <button
                  type="button"
                  className="wm-bar__head"
                  ref={(el) => {
                    barRefs.current[project.id] = el;
                  }}
                  aria-pressed={isActive}
                  aria-expanded={isActive}
                  onClick={() => setActiveId(isActive ? null : project.id)}
                >
                  <span className="wm-bar__sheen" aria-hidden="true" />
                  <span className="wm-bar__content">
                    <span className="wm-bar__name">{project.name}</span>
                    <span className="wm-bar__summary">{briefSummary(project)}</span>
                  </span>
                  <span className="wm-bar__chevron" aria-hidden="true">›</span>
                </button>

                <div className="wm-bar__panel">
                  <div className="wm-bar__panelInner">
                    <div
                      className="wm-dos__card"
                      style={{ margin: 0, boxShadow: "none" }}
                    >
                      <DossierBody project={project} />
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </article>
  );
}
