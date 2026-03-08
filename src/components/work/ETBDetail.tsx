"use client";

import { useMemo, useState } from "react";
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
  const [openDetailId, setOpenDetailId] = useState<string | null>(defaultSelectedId);
  const [modalProjectId, setModalProjectId] = useState<string | null>(null);
  const [mediaStates, setMediaStates] = useState<Record<string, MediaState>>({});

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

  return (
    <section className="etb" data-etb-section>
      <div className="etb-topStrip">
        <h4 className="etb-topStrip__title">{data.title}</h4>
        <span className="etb-topStrip__cred">{data.credibilityLine}</span>
      </div>

      <div
        className={`etb-barStack ${hoveredId ? "has-hover" : ""} ${openDetailId ? "has-expanded" : ""}`}
        data-etb-bars
        role="list"
        aria-label="Projects"
        onMouseLeave={() => setHoveredId(null)}
      >
        {sortedProjects.map((project) => {
          const isExpanded = openDetailId === project.id;
          return (
            <div
              key={project.id}
              className={`etb-bar ${hoveredId === project.id ? "is-hovered" : ""} ${
                isExpanded ? "is-expanded is-active" : ""
              }`}
              data-etb-bar={project.id}
              role="listitem"
              onMouseEnter={() => setHoveredId(project.id)}
            >
              <button
                className="etb-bar__head"
                type="button"
                aria-expanded={isExpanded}
                aria-label={project.name}
                aria-controls={`etb-panel-${project.id}`}
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

              <div
                className="etb-bar__body"
                id={`etb-panel-${project.id}`}
                role="region"
                aria-hidden={!isExpanded}
                aria-label={`${project.name} details`}
              >
                <div className="etb-bar__bodyInner">
                  <div className="etb-bar__copy">
                    <p className="etb-bar__desc">{project.oneLiner}</p>
                    <ul className="etb-bar__bullets">
                      {project.bullets.slice(0, 4).map((line) => (
                        <li key={line}>{line}</li>
                      ))}
                      {project.bullets.length > 4 ? (
                        <li className="etb-bar__bulletsMore">
                          +{project.bullets.length - 4} more in full detail
                        </li>
                      ) : null}
                    </ul>
                  </div>

                  <div className="etb-bar__side">
                    <div className="etb-bar__tags">
                      <TagPills tags={project.tags} className="etb-pill" />
                    </div>
                    <div className="etb-bar__dataMeta">
                      <span className="etb-bar__dataMetaItem">
                        Bullets {project.bullets.length}
                      </span>
                      <span className="etb-bar__dataMetaItem">Tags {project.tags.length}</span>
                      <span className="etb-bar__dataMetaItem">
                        Complete {project.completenessScore}%
                      </span>
                    </div>
                    <button
                      className="etb-bar__cta"
                      type="button"
                      onClick={() => setModalProjectId(project.id)}
                    >
                      Open Detail →
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <aside className={`etb-detail-panel ${selectedProject ? "is-open" : ""}`}>
        <div className="etb-detail-panel__header">
          <button
            className="etb-detail-panel__close"
            type="button"
            onClick={() => setOpenDetailId(null)}
            aria-label="Close detail panel"
          >
            ×
          </button>
        </div>

        <div className="etb-detail-panel__body">
          {selectedProject ? (
            <div className="etb-detail__project">
              <h3 className="etb-detail__name">{selectedProject.name}</h3>
              <p className="etb-detail__category">{selectedProject.category}</p>
              <span className={renderStatus(selectedProject.status)}>
                {selectedProject.status}
              </span>
              <p className="etb-detail__desc">{selectedProject.oneLiner}</p>
              <ul className="etb-detail__bullets">
                {selectedProject.bullets.map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
              <div className="etb-detail__tags">
                <TagPills tags={selectedProject.tags} className="etb-pill etb-pill--detail" />
              </div>
              <div className="etb-detail__snapshot">
                <h4 className="etb-detail__snapshotTitle">System Snapshot</h4>
                <ul className="etb-detail__snapshotList">
                  {getSystemSnapshot(selectedProject).map((line) => (
                    <li key={line}>{line}</li>
                  ))}
                </ul>
              </div>
              <button
                className="etb-bar__cta"
                type="button"
                onClick={() => setModalProjectId(selectedProject.id)}
              >
                Open Detail →
              </button>
            </div>
          ) : (
            <div className="etb-detail__empty">Select a project to inspect details.</div>
          )}
        </div>
      </aside>

      <section className="etb-graduate" aria-label="Graduate work">
        <h4 className="etb-graduate__title">{data.graduateWork.title}</h4>
        <p className="etb-graduate__subtitle">{data.graduateWork.subtitle}</p>
        <div className="etb-graduate__grid">
          {data.graduateWork.cards.map((card) => (
            <article key={card.title} className="etb-graduateCard">
              <h5 className="etb-graduateCard__title">{card.title}</h5>
              <p className="etb-graduateCard__outcome">{card.outcomeLine}</p>
              <ul className="etb-graduateCard__bullets">
                {card.bullets.map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
              <div className="etb-graduateCard__tags">
                <TagPills tags={card.tags} className="etb-pill etb-pill--soft" />
              </div>
            </article>
          ))}
        </div>
      </section>

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
    </section>
  );
}
