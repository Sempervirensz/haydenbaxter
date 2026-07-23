"use client";

import type { ETBLabProject } from "@/data/etbLab";
import ETBLabDetail from "./ETBLabDetail";

interface VariantAProps {
  projects: ETBLabProject[];
  selectedId: string | null;
  hoveredId: string | null;
  onSelect: (id: string | null) => void;
  onHover: (id: string | null) => void;
  getBriefSummary: (oneLiner: string) => string;
}

export default function VariantA({
  projects,
  selectedId,
  hoveredId,
  onSelect,
  onHover,
  getBriefSummary,
}: VariantAProps) {
  const selected = selectedId
    ? projects.find((p) => p.id === selectedId) ?? null
    : null;

  return (
    <div className={`etbLab-layout--a ${selectedId ? "has-selection" : ""}`}>
      <div
        className={`etbLab-bars ${hoveredId ? "has-hover" : ""} ${selectedId ? "has-active" : ""}`}
        role="list"
        aria-label="Projects"
        onMouseLeave={() => onHover(null)}
      >
        {projects.map((project) => {
          const isActive = selectedId === project.id;
          const isHovered = hoveredId === project.id;
          return (
            <div
              key={project.id}
              className={`etb-bar ${isHovered ? "is-hovered" : ""} ${isActive ? "is-active" : ""}`}
              data-bar-id={project.id}
              role="listitem"
              onMouseEnter={() => onHover(project.id)}
            >
              <button
                className="etb-bar__head"
                type="button"
                aria-label={project.name}
                aria-pressed={isActive}
                onFocus={() => onHover(project.id)}
                onClick={() =>
                  onSelect(selectedId === project.id ? null : project.id)
                }
              >
                <span className="etb-bar__sheen" aria-hidden="true" />
                <div className="etb-bar__content">
                  <span className="etb-bar__name">{project.name}</span>
                  <span className="etb-bar__summary">
                    {getBriefSummary(project.oneLiner)}
                  </span>
                </div>
                <span className="etb-bar__chevron" aria-hidden="true">
                  ›
                </span>
              </button>
            </div>
          );
        })}
      </div>

      <div
        className="etbLab-detail etbLab-detail--a"
        aria-hidden={!selected}
      >
        {selected ? (
          <ETBLabDetail project={selected} onClose={() => onSelect(null)} />
        ) : null}
      </div>

      {/* Mobile: fixed overlay */}
      {selected ? (
        <div className="etbLab-mobileDetail" role="dialog" aria-label={`${selected.name} details`}>
          <ETBLabDetail project={selected} onClose={() => onSelect(null)} />
        </div>
      ) : null}
    </div>
  );
}
