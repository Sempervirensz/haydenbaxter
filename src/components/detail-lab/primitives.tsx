"use client";

import { useState } from "react";
import type {
  LabContentBox,
  LabProject,
  LabScreenshot,
  LabStat,
  ShotMode,
} from "@/data/detailLab";

/* Reusable content blocks. Variants compose these; layout differences live in
   wrapper classes, so 12 arrangements share one set of primitives. */

export function Kicker({
  project,
  showBadge,
  overlay = false,
}: {
  project: LabProject;
  showBadge: boolean;
  overlay?: boolean;
}) {
  return (
    <header className={overlay ? "dl-hero dl-hero--overlay" : "dl-hero"}>
      {!overlay && (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img className="dl-hero__mark" src={project.mark} alt="" width={96} height={96} />
      )}
      {showBadge && (
        <span className="dl-hero__badge">
          <span className="dl-hero__badgeDot" aria-hidden="true" />
          {project.badge} · {project.status}
        </span>
      )}
      <span className="dl-hero__category">{project.category}</span>
      <h1 className="dl-hero__title">{project.name}</h1>
      <p className="dl-hero__oneLiner">{project.oneLiner}</p>
      <div className="dl-hero__tags">
        {project.tags.map((t) => (
          <span key={t} className="dl-tag">{t}</span>
        ))}
      </div>
    </header>
  );
}

export function Lede({ text }: { text: string }) {
  return <p className="dl-lede">{text}</p>;
}

export function ProblemBox({ text }: { text: string }) {
  return (
    <aside className="dl-problem" role="note">
      <span className="dl-problem__label">The problem</span>
      <p className="dl-problem__text">{text}</p>
    </aside>
  );
}

export function MetaRail({ project }: { project: LabProject }) {
  return (
    <dl className="dl-meta">
      {project.meta.map((m) => (
        <div key={m.label} className="dl-meta__row">
          <dt className="dl-meta__label">{m.label}</dt>
          <dd className="dl-meta__value">{m.value}</dd>
        </div>
      ))}
    </dl>
  );
}

export function StackChips({ items }: { items: string[] }) {
  return (
    <div className="dl-stack" aria-label="Stack">
      {items.map((s) => (
        <span key={s} className="dl-stack__chip">{s}</span>
      ))}
    </div>
  );
}

export function StatTiles({ stats }: { stats: LabStat[] }) {
  return (
    <div className="dl-stats">
      {stats.map((s) => (
        <div key={s.label} className="dl-stat">
          <span className="dl-stat__label">{s.label}</span>
          <span className="dl-stat__value">{s.value}</span>
          <span className="dl-stat__detail">{s.detail}</span>
        </div>
      ))}
    </div>
  );
}

function ScreenFrame({ shot }: { shot: LabScreenshot }) {
  return (
    <figure className={shot.variant === "phone" ? "dl-shot dl-shot--phone" : "dl-shot"}>
      <div
        className={`dl-shot__frame dl-shot__frame--${shot.tint}`}
        style={{ aspectRatio: String(shot.ratio) }}
      >
        <span className="dl-shot__label">{shot.label}</span>
      </div>
      <figcaption className="dl-shot__caption">{shot.caption}</figcaption>
    </figure>
  );
}

export function Screens({
  screenshots,
  mode,
}: {
  screenshots: LabScreenshot[];
  mode: ShotMode;
}) {
  const [index, setIndex] = useState(0);

  if (mode === "grid") {
    return (
      <div className="dl-shotGrid">
        {screenshots.map((s) => (
          <ScreenFrame key={s.label} shot={s} />
        ))}
      </div>
    );
  }

  if (mode === "stacked") {
    return (
      <div className="dl-shotStack">
        {screenshots.map((s) => (
          <ScreenFrame key={s.label} shot={s} />
        ))}
      </div>
    );
  }

  // carousel
  const count = screenshots.length;
  const go = (dir: number) => setIndex((i) => (i + dir + count) % count);
  return (
    <div className="dl-carousel">
      <div className="dl-carousel__viewport">
        <div
          className="dl-carousel__track"
          style={{ transform: `translateX(-${index * 100}%)` }}
        >
          {screenshots.map((s) => (
            <div key={s.label} className="dl-carousel__slide">
              <ScreenFrame shot={s} />
            </div>
          ))}
        </div>
      </div>
      <div className="dl-carousel__controls">
        <button type="button" className="dl-carousel__btn" onClick={() => go(-1)} aria-label="Previous">
          &larr;
        </button>
        <div className="dl-carousel__dots">
          {screenshots.map((s, i) => (
            <button
              key={s.label}
              type="button"
              className={i === index ? "dl-carousel__dot is-active" : "dl-carousel__dot"}
              onClick={() => setIndex(i)}
              aria-label={`Go to ${s.label}`}
            />
          ))}
        </div>
        <button type="button" className="dl-carousel__btn" onClick={() => go(1)} aria-label="Next">
          &rarr;
        </button>
      </div>
    </div>
  );
}

export function PullQuote({ text, attribution }: { text: string; attribution: string }) {
  return (
    <blockquote className="dl-quote">
      <p className="dl-quote__text">&ldquo;{text}&rdquo;</p>
      <cite className="dl-quote__cite">{attribution}</cite>
    </blockquote>
  );
}

export function ContentBoxes({ boxes }: { boxes: LabContentBox[] }) {
  return (
    <div className="dl-boxes">
      {boxes.map((b, i) => (
        <div key={i} className={`dl-box dl-box--${b.kind}`}>
          {b.label && <span className="dl-box__label">{b.label}</span>}
          {b.title && <h3 className="dl-box__title">{b.title}</h3>}
          <p className="dl-box__body">{b.body}</p>
        </div>
      ))}
    </div>
  );
}

export function DetailList({
  title,
  items,
}: {
  title: string;
  items: string[];
}) {
  return (
    <section className="dl-section" aria-label={title}>
      <h2 className="dl-sectionTitle">{title}</h2>
      <ul className="dl-list">
        {items.map((item) => (
          <li key={item} className="dl-list__item">{item}</li>
        ))}
      </ul>
    </section>
  );
}

export function CTA({ href, label }: { href: string; label: string }) {
  return (
    <a className="dl-cta" href={href}>
      <span>{label}</span>
      <span aria-hidden="true">&rarr;</span>
    </a>
  );
}

export function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h2 className="dl-sectionTitle">{children}</h2>;
}
