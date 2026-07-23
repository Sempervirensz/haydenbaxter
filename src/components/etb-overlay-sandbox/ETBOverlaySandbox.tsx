// ---------------------------------------------------------------------------
// ETB Overlay Sandbox — controller
// Manages variant selection, project selection, and renders the bar stack
// with whichever overlay iteration is active.
// Graduate Work is intentionally excluded from this sandbox.
// ---------------------------------------------------------------------------
"use client";

import { useEffect, useRef, useState } from "react";
import { ETB_LAB_PROJECTS, type ETBLabProject } from "@/data/etbLab";
import OverlayDossier from "./OverlayDossier";
import OverlayIPod from "./OverlayIPod";
import OverlayHybrid from "./OverlayHybrid";
import "./etb-overlay-sandbox.css";

type Iteration = "dossier" | "ipod" | "hybrid";

const ITERATIONS: { key: Iteration; label: string }[] = [
  { key: "dossier", label: "A \u2014 System Dossier" },
  { key: "ipod", label: "B \u2014 iPod Control Panel" },
  { key: "hybrid", label: "C \u2014 Hybrid Experimental" },
];

function getBriefSummary(oneLiner: string): string {
  const text = oneLiner.trim().replace(/\s+/g, " ");
  if (!text) return "";
  const cleaned = text.replace(/[.!?]\s*$/, "");
  const parts = cleaned.split(/[:;,]/);
  const candidate = parts.find(
    (p) => p.trim().length >= 14 && p.trim().length <= 52,
  );
  if (candidate) return candidate.trim();
  if (parts[0]?.trim()) return parts[0].trim();
  return cleaned.split(" ").slice(0, 6).join(" ");
}

function getSystemSnapshot(project: ETBLabProject): string[] {
  const common = [
    "UX loop tuned for fast iteration + readable outputs",
    "State and decisions shaped for repeatable handoff",
  ];
  if (project.category === "Agents") {
    return [
      "Planner loop: input \u2192 plan \u2192 action \u2192 review",
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

// Map for overlay components
const OVERLAY_MAP: Record<
  Iteration,
  React.ComponentType<{
    project: ETBLabProject;
    snapshot: string[];
    onClose: () => void;
  }>
> = {
  dossier: OverlayDossier,
  ipod: OverlayIPod,
  hybrid: OverlayHybrid,
};

export default function ETBOverlaySandbox() {
  const [iteration, setIteration] = useState<Iteration>("dossier");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const lastSelectedRef = useRef<string | null>(null);

  const selected = selectedId
    ? ETB_LAB_PROJECTS.find((p) => p.id === selectedId) ?? null
    : null;

  // Focus restore ref
  useEffect(() => {
    if (selectedId) lastSelectedRef.current = selectedId;
  }, [selectedId]);

  // Escape closes overlay
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && selectedId) {
        setSelectedId(null);
        if (lastSelectedRef.current) {
          const bar = document.querySelector(
            `[data-sandbox-bar="${lastSelectedRef.current}"] .sbx-bar__head`,
          ) as HTMLElement | null;
          bar?.focus();
        }
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [selectedId]);

  const OverlayComponent = OVERLAY_MAP[iteration];

  return (
    <div className="sbx">
      {/* ---- Header + iteration switcher ---- */}
      <header className="sbx-header">
        <h1 className="sbx-title">Overlay Sandbox</h1>
        <div
          className="sbx-switcher"
          role="radiogroup"
          aria-label="Overlay iteration"
        >
          {ITERATIONS.map((it) => (
            <button
              key={it.key}
              type="button"
              role="radio"
              aria-checked={iteration === it.key}
              className={`sbx-switcher__btn ${iteration === it.key ? "is-active" : ""}`}
              onClick={() => {
                setIteration(it.key);
                setSelectedId(null);
                setHoveredId(null);
              }}
            >
              {it.label}
            </button>
          ))}
        </div>
      </header>

      {/* ---- Stage: bars + overlay ---- */}
      <div className={`sbx-stage ${selectedId ? "has-selection" : ""}`}>
        <div
          className={`sbx-barStack ${hoveredId ? "has-hover" : ""} ${selectedId ? "has-active" : ""}`}
          role="list"
          aria-label="Projects"
          onMouseLeave={() => setHoveredId(null)}
        >
          {ETB_LAB_PROJECTS.map((project) => {
            const isActive = selectedId === project.id;
            const isHovered = hoveredId === project.id;
            return (
              <div
                key={project.id}
                className={`etb-bar ${isHovered ? "is-hovered" : ""} ${isActive ? "is-active" : ""}`}
                data-sandbox-bar={project.id}
                role="listitem"
                onMouseEnter={() => setHoveredId(project.id)}
              >
                <button
                  className="sbx-bar__head"
                  type="button"
                  aria-pressed={isActive}
                  aria-label={project.name}
                  onFocus={() => setHoveredId(project.id)}
                  onClick={() =>
                    setSelectedId((prev) =>
                      prev === project.id ? null : project.id,
                    )
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

        {/* Desktop overlay */}
        <aside
          className={`sbx-overlay sbx-overlay--${iteration} ${selected ? "is-open" : ""}`}
          aria-hidden={!selected}
        >
          {selected ? (
            <OverlayComponent
              project={selected}
              snapshot={getSystemSnapshot(selected)}
              onClose={() => setSelectedId(null)}
            />
          ) : null}
        </aside>

        {/* Mobile full-screen overlay */}
        {selected ? (
          <div
            className="sbx-mobileOverlay"
            role="dialog"
            aria-label={`${selected.name} details`}
          >
            <OverlayComponent
              project={selected}
              snapshot={getSystemSnapshot(selected)}
              onClose={() => setSelectedId(null)}
            />
          </div>
        ) : null}
      </div>

      {/* ---- Debug tag ---- */}
      <div className="sbx-debugTag" aria-live="polite">
        {ITERATIONS.find((i) => i.key === iteration)?.label}
        {selectedId ? ` \u00b7 ${selectedId}` : " \u00b7 none selected"}
      </div>
    </div>
  );
}
