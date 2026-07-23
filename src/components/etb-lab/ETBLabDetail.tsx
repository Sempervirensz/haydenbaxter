"use client";

import type { ETBLabProject } from "@/data/etbLab";

function toSlug(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

interface ETBLabDetailProps {
  project: ETBLabProject;
  onClose: () => void;
}

export default function ETBLabDetail({ project, onClose }: ETBLabDetailProps) {
  return (
    <div className="etbLab-detailContent">
      <button
        className="etbLab-detailBack"
        type="button"
        onClick={onClose}
        aria-label="Close detail"
      >
        <span aria-hidden="true">&larr;</span> Back
      </button>

      <h3 className="etb-detail__name">{project.name}</h3>
      <p className="etb-detail__category">{project.category}</p>
      <span className={`etb-status etb-status--${toSlug(project.status)}`}>
        {project.status}
      </span>
      <p className="etb-detail__desc">{project.oneLiner}</p>

      <ul className="etb-detail__bullets">
        {project.bullets.slice(0, 3).map((line) => (
          <li key={line}>{line}</li>
        ))}
      </ul>

      <div className="etb-detail__tags">
        {project.tags.map((tag) => (
          <span key={tag} className="etb-pill etb-pill--detail">
            {tag}
          </span>
        ))}
      </div>

      <button className="etbLab-detailCta" type="button">
        View Full Detail &rarr;
      </button>
    </div>
  );
}
