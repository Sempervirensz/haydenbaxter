// ---------------------------------------------------------------------------
// Iteration B — iPod Control Panel
// iPod UX principles: clear selection state, strong list-to-detail hierarchy,
// navigable list modules, "Now Playing" information framing, thin signal bars,
// tactile rhythm, restrained chrome. Premium and modern, not kitschy.
// To promote: copy overlay markup into ETBDetail.tsx, port .sbx-ipod-* CSS.
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

export default function OverlayIPod({ project, snapshot, onClose }: Props) {
  return (
    <div className="sbx-ipod">
      {/* Navigation bar — restrained chrome */}
      <div className="sbx-ipod__nav">
        <button
          className="sbx-ipod__back"
          type="button"
          onClick={onClose}
          aria-label="Close detail panel"
        >
          <span className="sbx-ipod__backChevron" aria-hidden="true">&lsaquo;</span>
          Projects
        </button>
      </div>

      {/* Now Playing-inspired hero strip */}
      <div className="sbx-ipod__hero">
        <div className="sbx-ipod__heroText">
          <h3 className="sbx-ipod__title">{project.name}</h3>
          <span className="sbx-ipod__subtitle">{project.category}</span>
        </div>
        <span className={`sbx-ipod__badge sbx-ipod__badge--${toSlug(project.status)}`}>
          {project.status}
        </span>
      </div>

      {/* Signal bar — thin progress-inspired accent */}
      <div className="sbx-ipod__signal" aria-hidden="true">
        <div className="sbx-ipod__signalFill" />
      </div>

      {/* Content modules — clean navigable list sections */}
      <div className="sbx-ipod__modules">
        {/* Summary module */}
        <div className="sbx-ipod__module">
          <p className="sbx-ipod__summary">{project.oneLiner}</p>
        </div>

        {/* Capabilities module */}
        <div className="sbx-ipod__module">
          <span className="sbx-ipod__moduleLabel">Capabilities</span>
          <ul className="sbx-ipod__list">
            {project.bullets.slice(0, 3).map((line) => (
              <li key={line} className="sbx-ipod__listItem">{line}</li>
            ))}
          </ul>
        </div>

        {/* Tags module */}
        <div className="sbx-ipod__module">
          <span className="sbx-ipod__moduleLabel">Stack</span>
          <div className="sbx-ipod__tags">
            {project.tags.map((tag) => (
              <span key={tag} className="sbx-ipod__tag">{tag}</span>
            ))}
          </div>
        </div>

        {/* System module */}
        <div className="sbx-ipod__module">
          <span className="sbx-ipod__moduleLabel">System</span>
          <ul className="sbx-ipod__list sbx-ipod__list--system">
            {snapshot.slice(0, 3).map((line) => (
              <li key={line} className="sbx-ipod__listItem">{line}</li>
            ))}
          </ul>
        </div>
      </div>

      {/* CTA — minimal iconic affordance */}
      <div className="sbx-ipod__footer">
        <button className="sbx-ipod__cta" type="button">
          Open Full Detail &rarr;
        </button>
      </div>
    </div>
  );
}
