// ---------------------------------------------------------------------------
// Iteration C — Hybrid Experimental
// Blends the current retro-futurist dossier feel with iPod-like interaction
// ideas. Off-white inner surface with cobalt accents, navigable sections,
// a thin signal strip, and editorial typography. Pushes the concept further
// while remaining portfolio-appropriate and believable.
// To promote: copy overlay markup into ETBDetail.tsx, port .sbx-hyb-* CSS.
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

export default function OverlayHybrid({ project, snapshot, onClose }: Props) {
  return (
    <div className="sbx-hyb">
      {/* Chrome strip — blended nav + "now viewing" */}
      <div className="sbx-hyb__chrome">
        <button
          className="sbx-hyb__back"
          type="button"
          onClick={onClose}
          aria-label="Close detail panel"
        >
          <span aria-hidden="true">&lsaquo;</span> Back
        </button>
        <span className="sbx-hyb__chromeLabel">Detail View</span>
      </div>

      {/* Signal accent — cobalt bar */}
      <div className="sbx-hyb__accent" aria-hidden="true" />

      {/* Inner card — off-white surface */}
      <div className="sbx-hyb__card">
        {/* Header row */}
        <div className="sbx-hyb__header">
          <div>
            <h3 className="sbx-hyb__title">{project.name}</h3>
            <span className="sbx-hyb__category">{project.category}</span>
          </div>
          <span className={`sbx-hyb__status sbx-hyb__status--${toSlug(project.status)}`}>
            {project.status}
          </span>
        </div>

        {/* Summary */}
        <p className="sbx-hyb__summary">{project.oneLiner}</p>

        {/* Capabilities — list rows with subtle dividers */}
        <div className="sbx-hyb__section">
          <span className="sbx-hyb__sectionLabel">Capabilities</span>
          <ul className="sbx-hyb__rows">
            {project.bullets.slice(0, 3).map((line) => (
              <li key={line} className="sbx-hyb__row">{line}</li>
            ))}
          </ul>
        </div>

        {/* Tags */}
        <div className="sbx-hyb__section">
          <span className="sbx-hyb__sectionLabel">Stack</span>
          <div className="sbx-hyb__tags">
            {project.tags.map((tag) => (
              <span key={tag} className="sbx-hyb__tag">{tag}</span>
            ))}
          </div>
        </div>

        {/* System snapshot — compact */}
        <div className="sbx-hyb__section sbx-hyb__section--system">
          <span className="sbx-hyb__sectionLabel">System</span>
          <ul className="sbx-hyb__rows sbx-hyb__rows--system">
            {snapshot.slice(0, 3).map((line) => (
              <li key={line} className="sbx-hyb__row">{line}</li>
            ))}
          </ul>
        </div>
      </div>

      {/* CTA */}
      <div className="sbx-hyb__footer">
        <button className="sbx-hyb__cta" type="button">
          View Full Detail &rarr;
        </button>
      </div>
    </div>
  );
}
