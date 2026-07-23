// ---------------------------------------------------------------------------
// Iteration A — System Dossier
// Most aligned with current site language. Dark shell, off-white inner card,
// quiet metadata strip, strong title, concise copy. Minimal nesting.
// To promote: copy this overlay markup into ETBDetail.tsx .etb-overlay block,
// and port .sbx-dos-* CSS into work-details.css.
// ---------------------------------------------------------------------------
"use client";

import type { ETBLabProject } from "@/data/etbLab";

function toSlug(v: string) {
  return v.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

interface Props {
  project: ETBLabProject;
  snapshot: string[];
  onClose: () => void;
}

export default function OverlayDossier({ project, snapshot, onClose }: Props) {
  return (
    <div className="sbx-dos">
      {/* Close control */}
      <div className="sbx-dos__topbar">
        <span className="sbx-dos__eyebrow">Project File</span>
        <button
          className="sbx-dos__close"
          type="button"
          onClick={onClose}
          aria-label="Close detail panel"
        >
          Close
        </button>
      </div>

      {/* Off-white dossier card */}
      <div className="sbx-dos__card">
        {/* Metadata strip */}
        <div className="sbx-dos__meta">
          <span className={`sbx-dos__status sbx-dos__status--${toSlug(project.status)}`}>
            {project.status}
          </span>
          <span className="sbx-dos__category">{project.category}</span>
        </div>

        {/* Title */}
        <h3 className="sbx-dos__title">{project.name}</h3>

        {/* One-liner */}
        <p className="sbx-dos__oneLiner">{project.oneLiner}</p>

        {/* Divider */}
        <hr className="sbx-dos__rule" />

        {/* Capability bullets */}
        <ul className="sbx-dos__bullets">
          {project.bullets.slice(0, 3).map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>

        {/* Tags */}
        <div className="sbx-dos__tags">
          {project.tags.map((tag) => (
            <span key={tag} className="sbx-dos__tag">{tag}</span>
          ))}
        </div>

        {/* System notes (compact) */}
        <div className="sbx-dos__notes">
          <span className="sbx-dos__notesLabel">System Notes</span>
          <ul className="sbx-dos__notesList">
            {snapshot.slice(0, 3).map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
        </div>

        {/* CTA */}
        <button className="sbx-dos__cta" type="button">
          View Full Detail &rarr;
        </button>
      </div>
    </div>
  );
}
