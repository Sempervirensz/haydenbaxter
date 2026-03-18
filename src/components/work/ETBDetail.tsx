"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import type { ETBData, ETBProject } from "@/data/work";
import DetailModal from "@/components/work/DetailModal";
import TagPills from "@/components/work/TagPills";

interface ETBDetailProps {
  data: ETBData;
}

type ScoreField = "completenessScore" | "technicalScore" | "recencyScore";

type MediaState = "idle" | "loaded" | "broken";

function toSlug(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

function getInitials(name: string): string {
  const parts = name.match(/[A-Z][a-z]+|[A-Z]+(?![a-z])|[a-z]+|\d+/g) ?? [name];
  return parts
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");
}

function getBriefSummary(project: ETBProject): string {
  const text = project.oneLiner.trim().replace(/\s+/g, " ");
  if (!text) return "";

  const cleaned = text.replace(/[.!?]\s*$/, "");
  const parts = cleaned.split(/[:;,]/);
  const candidate = parts.find((part) => part.trim().length >= 14 && part.trim().length <= 52);
  if (candidate) return candidate.trim();
  if (parts[0]?.trim()) return parts[0].trim();
  return cleaned.split(" ").slice(0, 6).join(" ");
}

function getSystemSnapshot(project: ETBProject): string[] {
  const common = [
    "UX loop tuned for fast iteration + readable outputs",
    "State and decisions shaped for repeatable handoff",
  ];

  if (project.category === "Agents") {
    return [
      "Planner loop: input -> plan -> action -> review",
      "Routing layer selects task path by context + intent",
      "Evaluation checks gate low-confidence outputs",
      common[0],
    ];
  }
  if (project.category === "NLP/Privacy") {
    return [
      "Document pipeline optimized for long-context ingestion",
      "Structured output templates keep chronology consistent",
      "Privacy controls applied before downstream summarization",
      common[1],
    ];
  }
  if (project.category === "Voice/Video") {
    return [
      "Speech input -> parse -> scripted sequence generation",
      "Prompt-to-scene mapping favors predictable narration flow",
      "Tooling layer supports fast revisions for demos",
      common[0],
    ];
  }
  if (project.category === "Supply Chain Apps") {
    return [
      "Workflow states modeled around sourcing decision stages",
      "Data model supports supplier scoring + documentation trails",
      "UI favors operational clarity over feature sprawl",
      common[1],
    ];
  }

  return [
    "Reusable workflow templates for research/build/test loops",
    "Tool-calling guardrails reduce drift across repeated tasks",
    "Fast iteration path with reliability checks in-line",
    common[0],
  ];
}

function sortProjects(projects: ETBProject[], field: ScoreField): ETBProject[] {
  return projects
    .slice()
    .sort((a, b) => {
      if (b[field] !== a[field]) return b[field] - a[field];
      return a.name.localeCompare(b.name);
    });
}

function resolveSortField(data: ETBData): ScoreField {
  const byLabel = data.sortOptions.find((option) => option.label === data.defaultSort);
  if (
    byLabel?.field === "completenessScore" ||
    byLabel?.field === "technicalScore" ||
    byLabel?.field === "recencyScore"
  ) {
    return byLabel.field;
  }
  return "completenessScore";
}

function mediaClass(state: MediaState): string {
  if (state === "loaded") return "is-loaded";
  if (state === "broken") return "is-broken";
  return "";
}

function renderStatus(status: string, extraClass?: string): string {
  const base = `etb-status etb-status--${toSlug(status)}`;
  return extraClass ? `${base} ${extraClass}` : base;
}

function ETBMedia({
  project,
  variant,
  mediaState,
  onLoad,
  onError,
}: {
  project: ETBProject;
  variant: "modal";
  mediaState: MediaState;
  onLoad: () => void;
  onError: () => void;
}) {
  return (
    <div className={`etb-media etb-media--${variant} ${mediaClass(mediaState)}`}>
      <img
        className="etb-media__img"
        src={project.screenshot}
        alt={`${project.name} screenshot`}
        loading="lazy"
        onLoad={onLoad}
        onError={onError}
      />
      <div className="etb-media__fallback" aria-hidden="true">
        <span className="etb-media__fallback-badge">{getInitials(project.name)}</span>
        <div className="etb-media__fallback-title">{project.name}</div>
      </div>
      <div className="etb-media__fx" aria-hidden="true" />
    </div>
  );
}

export default function ETBDetail({ data }: ETBDetailProps) {
  const sortedProjects = useMemo(
    () => sortProjects(data.projects, resolveSortField(data)),
    [data]
  );

  const defaultSelectedId = useMemo(() => {
    if (sortedProjects.some((project) => project.id === data.defaultSelectedId)) {
      return data.defaultSelectedId;
    }
    return sortedProjects[0]?.id ?? "";
  }, [data.defaultSelectedId, sortedProjects]);

  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [openDetailId, setOpenDetailId] = useState<string | null>(null);
  const [modalProjectId, setModalProjectId] = useState<string | null>(null);
  const [mediaStates, setMediaStates] = useState<Record<string, MediaState>>({});
  const [portalTarget, setPortalTarget] = useState<HTMLElement | null>(null);
  const lastSelectedRef = useRef<string | null>(null);
  const savedScrollRef = useRef<number>(0);

  const selectedProject = useMemo(
    () => (openDetailId ? sortedProjects.find((project) => project.id === openDetailId) ?? null : null),
    [openDetailId, sortedProjects]
  );

  const modalProject = useMemo(
    () => (modalProjectId ? data.projects.find((project) => project.id === modalProjectId) ?? null : null),
    [modalProjectId, data.projects]
  );

  const updateMediaState = (id: string, nextState: MediaState) => {
    setMediaStates((prev) => {
      if (prev[id] === nextState) return prev;
      return { ...prev, [id]: nextState };
    });
  };

  // Set portal target after mount (client only)
  useEffect(() => {
    setPortalTarget(document.body);
  }, []);

  // Track last selected for focus restore
  useEffect(() => {
    if (openDetailId) lastSelectedRef.current = openDetailId;
  }, [openDetailId]);

  // Lock scroll on ALL parent containers when mobile overlay is open
  useEffect(() => {
    if (!openDetailId) return;

    const isMobile = window.matchMedia("(max-width: 767px)").matches;
    if (!isMobile) return;

    // Save scroll position of the detail screen
    const section = document.querySelector("[data-etb-section]");
    const scrollParent = section?.closest(".work__screen--detail") as HTMLElement | null;
    if (scrollParent) {
      savedScrollRef.current = scrollParent.scrollTop;
      scrollParent.style.overflow = "hidden";
    }

    // Also lock document body to prevent any background scroll
    const prevBodyOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      if (scrollParent) {
        scrollParent.style.overflow = "";
        scrollParent.scrollTop = savedScrollRef.current;
      }
      document.body.style.overflow = prevBodyOverflow;
    };
  }, [openDetailId]);

  // Escape key closes overlay
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && openDetailId && !modalProjectId) {
        setOpenDetailId(null);
        if (lastSelectedRef.current) {
          const bar = document.querySelector(
            `[data-etb-bar="${lastSelectedRef.current}"] .etb-bar__head`,
          ) as HTMLElement | null;
          bar?.focus();
        }
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [openDetailId, modalProjectId]);

  return (
    <section className="etb" data-etb-section>
      <div className="etb-topStrip">
        <h4 className="etb-topStrip__title">{data.title}</h4>
        <span className="etb-topStrip__cred">{data.credibilityLine}</span>
      </div>

      <div
        className={`etb-barStack ${hoveredId ? "has-hover" : ""} ${openDetailId ? "has-active" : ""}`}
        data-etb-bars
        role="list"
        aria-label="Projects"
        onMouseLeave={() => setHoveredId(null)}
      >
        {sortedProjects.map((project) => {
          const isActive = openDetailId === project.id;
          return (
            <div
              key={project.id}
              className={`etb-bar ${hoveredId === project.id ? "is-hovered" : ""} ${
                isActive ? "is-active" : ""
              }`}
              data-etb-bar={project.id}
              role="listitem"
              onMouseEnter={() => setHoveredId(project.id)}
            >
              <button
                className="etb-bar__head"
                type="button"
                aria-pressed={isActive}
                aria-label={project.name}
                onFocus={() => setHoveredId(project.id)}
                onClick={() =>
                  setOpenDetailId((prev) => (prev === project.id ? null : project.id))
                }
              >
                <span className="etb-bar__sheen" aria-hidden="true" />
                <div className="etb-bar__content">
                  <span className="etb-bar__name">{project.name}</span>
                  <span className="etb-bar__summary">
                    {getBriefSummary(project) || project.oneLiner}
                  </span>
                </div>
                <span className="etb-bar__chevron" aria-hidden="true">
                  ›
                </span>
              </button>
            </div>
          );
        })}

        {/* Overlay detail panel — System Dossier */}
        <aside
          className={`etb-overlay ${selectedProject ? "is-open" : ""}`}
          aria-hidden={!selectedProject}
        >
          {selectedProject ? (
            <div className="etb-dos">
              {/* Top bar */}
              <div className="etb-dos__topbar">
                <span className="etb-dos__eyebrow">Project File</span>
                <button
                  className="etb-dos__close"
                  type="button"
                  onClick={() => setOpenDetailId(null)}
                  aria-label="Close detail panel"
                >
                  Close
                </button>
              </div>

              {/* Off-white dossier card */}
              <div className="etb-dos__card">
                {/* Metadata strip */}
                <div className="etb-dos__meta">
                  <span className={`etb-dos__status etb-dos__status--${toSlug(selectedProject.status)}`}>
                    {selectedProject.status}
                  </span>
                  <span className="etb-dos__category">{selectedProject.category}</span>
                </div>

                {/* Title */}
                <h3 className="etb-dos__title">{selectedProject.name}</h3>

                {/* One-liner */}
                <p className="etb-dos__oneLiner">{selectedProject.oneLiner}</p>

                {/* Divider */}
                <hr className="etb-dos__rule" />

                {/* Capability bullets */}
                <ul className="etb-dos__bullets">
                  {selectedProject.bullets.slice(0, 3).map((line) => (
                    <li key={line}>{line}</li>
                  ))}
                </ul>

                {/* Tags */}
                <div className="etb-dos__tags">
                  {selectedProject.tags.map((tag) => (
                    <span key={tag} className="etb-dos__tag">{tag}</span>
                  ))}
                </div>

                {/* System notes */}
                <div className="etb-dos__notes">
                  <span className="etb-dos__notesLabel">System Notes</span>
                  <ul className="etb-dos__notesList">
                    {getSystemSnapshot(selectedProject).slice(0, 3).map((line) => (
                      <li key={line}>{line}</li>
                    ))}
                  </ul>
                </div>

                {/* CTA */}
                <button
                  className="etb-dos__cta"
                  type="button"
                  onClick={() => setModalProjectId(selectedProject.id)}
                >
                  View Full Detail &rarr;
                </button>
              </div>
            </div>
          ) : null}
        </aside>
      </div>

      {/* Mobile overlay is portaled to document.body — see below */}

      {/* Graduate work section hidden — placeholder content removed */}

      <DetailModal
        isOpen={Boolean(modalProject)}
        onClose={() => setModalProjectId(null)}
        classPrefix="etb-modal"
        eyebrow="Project detail"
        labelledBy="etb-modal-title"
        describedBy="etb-modal-desc"
      >
        {modalProject ? (
          <>
            <div className="etb-modal__hero">
              <ETBMedia
                project={modalProject}
                variant="modal"
                mediaState={mediaStates[modalProject.id] ?? "idle"}
                onLoad={() => updateMediaState(modalProject.id, "loaded")}
                onError={() => updateMediaState(modalProject.id, "broken")}
              />
            </div>
            <div className="etb-modal__layout">
              <section className="etb-modal__main">
                <div className="etb-modal__titleRow">
                  <h3 className="etb-modal__title" id="etb-modal-title">
                    {modalProject.name}
                  </h3>
                  <span className={renderStatus(modalProject.status)}>
                    {modalProject.status}
                  </span>
                </div>
                <p className="etb-modal__category">{modalProject.category}</p>
                <p className="etb-modal__oneLiner" id="etb-modal-desc">
                  {modalProject.oneLiner}
                </p>
                <ul className="etb-modal__bullets">
                  {modalProject.bullets.map((line) => (
                    <li key={line}>{line}</li>
                  ))}
                </ul>
                <div className="etb-modal__tags">
                  <TagPills tags={modalProject.tags} className="etb-pill etb-pill--preview" />
                </div>
              </section>

              <aside className="etb-modal__aside">
                <div className="etb-modal__snapshot">
                  <h4 className="etb-modal__snapshotTitle">System Snapshot</h4>
                  <ul className="etb-modal__snapshotList">
                    {getSystemSnapshot(modalProject).map((line) => (
                      <li key={line}>{line}</li>
                    ))}
                  </ul>
                </div>
              </aside>
            </div>
          </>
        ) : null}
      </DetailModal>

      {/* Mobile: full-push dossier — portaled to document.body to escape parent stacking/overflow */}
      {portalTarget && selectedProject
        ? createPortal(
            <div
              className="etb-mobileOverlay"
              role="dialog"
              aria-label={`${selectedProject.name} details`}
            >
              <div className="etb-dos">
                <div className="etb-dos__topbar">
                  <span className="etb-dos__eyebrow">Project File</span>
                  <button
                    className="etb-dos__close"
                    type="button"
                    onClick={() => setOpenDetailId(null)}
                    aria-label="Close detail panel"
                  >
                    Close
                  </button>
                </div>

                <div className="etb-dos__card">
                  <div className="etb-dos__meta">
                    <span className={`etb-dos__status etb-dos__status--${toSlug(selectedProject.status)}`}>
                      {selectedProject.status}
                    </span>
                    <span className="etb-dos__category">{selectedProject.category}</span>
                  </div>

                  <h3 className="etb-dos__title">{selectedProject.name}</h3>
                  <p className="etb-dos__oneLiner">{selectedProject.oneLiner}</p>
                  <hr className="etb-dos__rule" />

                  <ul className="etb-dos__bullets">
                    {selectedProject.bullets.slice(0, 3).map((line) => (
                      <li key={line}>{line}</li>
                    ))}
                  </ul>

                  <div className="etb-dos__tags">
                    {selectedProject.tags.map((tag) => (
                      <span key={tag} className="etb-dos__tag">{tag}</span>
                    ))}
                  </div>

                  <div className="etb-dos__notes">
                    <span className="etb-dos__notesLabel">System Notes</span>
                    <ul className="etb-dos__notesList">
                      {getSystemSnapshot(selectedProject).slice(0, 3).map((line) => (
                        <li key={line}>{line}</li>
                      ))}
                    </ul>
                  </div>

                  <button
                    className="etb-dos__cta"
                    type="button"
                    onClick={() => setModalProjectId(selectedProject.id)}
                  >
                    View Full Detail &rarr;
                  </button>
                </div>
              </div>
            </div>,
            portalTarget,
          )
        : null}
    </section>
  );
}
