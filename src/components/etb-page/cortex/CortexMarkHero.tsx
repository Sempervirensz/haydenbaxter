import type { ETBProject } from "@/data/work";
import CortexStickyBadge from "./CortexStickyBadge";

/* Cortex-only hero treatments. Seven ways the embroidered brain mark can lead
 * its detail page, plus the hero that ships today as a baseline.
 *
 * This is art direction for ONE project. Nothing here is shared with AtomicOS,
 * CaseBrief or any other build — those get their own treatments when their turn
 * comes. Every variant reuses the page's own hero classes for the kicker,
 * title, one-liner and tags, so what differs between them is the mark and the
 * composition around it, and only that. */

export type CortexHeroVariant =
  | "current"
  | "plate"
  | "lockup"
  | "field"
  | "seal"
  | "macro"
  | "sleeve"
  | "badge";

export interface CortexHeroDirection {
  id: CortexHeroVariant;
  label: string;
  note: string;
  group: string;
}

export const CORTEX_HERO_DIRECTIONS: CortexHeroDirection[] = [
  {
    id: "current",
    label: "Current",
    note: "What ships today — the mark as a 72–96px seal above the kicker.",
    group: "Baseline",
  },
  {
    id: "plate",
    label: "A · Specimen plate",
    note: "The mark as a full-measure editorial plate with a mono caption strip and the thread palette spelled out.",
    group: "Round one",
  },
  {
    id: "lockup",
    label: "B · Masthead lockup",
    note: "Patch and title side by side at 230px, merrowed stitch edge, spectrum hairline, tags recoloured in thread.",
    group: "Round one",
  },
  {
    id: "field",
    label: "C · Fabric field",
    note: "Full-bleed textile band — the mark becomes the environment and the title grows out of the fabric.",
    group: "Round one",
  },
  {
    id: "seal",
    label: "D · Disc seal",
    note: "Cut to a circle and vignetted free of its cloth, with a mono type ring turning slowly around it. Mirrored — emblem right, type left.",
    group: "Round two",
  },
  {
    id: "macro",
    label: "E · Macro band",
    note: "A full-bleed strip of the thread itself — no whole mark — with the complete mark kept small and sharp beside the title. Zoom is capped by the 1024² asset.",
    group: "Round two",
  },
  {
    id: "sleeve",
    label: "F · Sleeve",
    note: "Album-sleeve composition: one big square mark centred, everything under it centred with it. The hero becomes a cover.",
    group: "Round two",
  },
  {
    id: "badge",
    label: "G · Persistent badge",
    note: "Prominent by never leaving: a modest circular mark in the hero, then a corner badge that pins once the hero scrolls past and stays for the whole page.",
    group: "Round two",
  },
];

/* The thread colours read off the embroidery, warm to cool. Used as the
 * caption swatches, the hairline and the tag tints. */
const THREADS = [
  "--cx-red",
  "--cx-orange",
  "--cx-gold",
  "--cx-green",
  "--cx-teal",
  "--cx-blue",
  "--cx-indigo",
  "--cx-violet",
  "--cx-mauve",
];

/* Circumference of the ring path below, so the mono legend can be forced to
 * wrap the circle exactly once instead of leaving a gap or overlapping. */
const RING_RADIUS = 184;
const RING_PATH = `M 200,${200 - RING_RADIUS} a ${RING_RADIUS},${RING_RADIUS} 0 1,1 -0.01,0`;
const RING_LENGTH = 2 * Math.PI * RING_RADIUS;
const RING_TEXT =
  "CORTEX · EDITORIAL BRAIN · CONNECTED RESEARCH · SOURCE-TO-PUBLISHING · ";

interface Props {
  project: ETBProject;
  variant: CortexHeroVariant;
}

export default function CortexMarkHero({ project, variant }: Props) {
  const category = project.demo?.heroCategory ?? project.category;
  const mark = project.mark;

  // No mark on the record means there is nothing to art-direct — fall through
  // to the page's own hero rather than render an empty frame.
  if (!mark || variant === "current") return null;

  const kicker = <span className="etb-page__category">{category}</span>;
  const title = <h1 className="etb-page__title">{project.name}</h1>;
  const oneLiner = <p className="etb-page__oneLiner">{project.oneLiner}</p>;
  const tags = (
    <div className="etb-page__tags">
      {project.tags.map((tag) => (
        <span key={tag} className="etb-page__tag">
          {tag}
        </span>
      ))}
    </div>
  );

  /* ── A · Specimen plate ───────────────────────────────────────────────── */
  if (variant === "plate") {
    return (
      <header className="etb-page__hero cortex-hero cortex-hero--plate">
        <figure className="cortex-plate">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className="cortex-plate__img"
            src={mark.src}
            alt={mark.alt}
            width={mark.width}
            height={mark.height}
          />
          <figcaption className="cortex-plate__caption">
            <span className="cortex-plate__captionText">
              {project.name} — embroidered mark
            </span>
            <span className="cortex-plate__threads" aria-hidden="true">
              {THREADS.map((thread) => (
                <i key={thread} style={{ background: `var(${thread})` }} />
              ))}
            </span>
          </figcaption>
        </figure>
        {kicker}
        {title}
        {oneLiner}
        {tags}
      </header>
    );
  }

  /* ── B · Masthead lockup ──────────────────────────────────────────────── */
  if (variant === "lockup") {
    return (
      <header className="etb-page__hero cortex-hero cortex-hero--lockup">
        <div className="cortex-lockup">
          <div className="cortex-patch">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              className="cortex-patch__img"
              src={mark.src}
              alt={mark.alt}
              width={mark.width}
              height={mark.height}
            />
            <span className="cortex-patch__stitch" aria-hidden="true" />
          </div>
          <div className="cortex-lockup__text">
            {kicker}
            {title}
            {oneLiner}
            {tags}
          </div>
        </div>
      </header>
    );
  }

  /* ── C · Fabric field ─────────────────────────────────────────────────── */
  if (variant === "field") {
    return (
      <header className="etb-page__hero cortex-hero cortex-hero--field">
        <div className="cortex-field">
          {/* The same photograph twice: once blurred wide as the knit ground
              the band is made of, once sharp and oversized as the mark. Same
              fabric in both layers, so the patch reads as stitched into the
              field rather than pasted onto it. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className="cortex-field__ground"
            src={mark.src}
            alt=""
            aria-hidden="true"
            width={mark.width}
            height={mark.height}
          />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className="cortex-field__mark"
            src={mark.src}
            alt={mark.alt}
            width={mark.width}
            height={mark.height}
          />
          <span className="cortex-field__veil" aria-hidden="true" />
          <div className="cortex-field__text">
            {kicker}
            {title}
          </div>
        </div>
        {oneLiner}
        {tags}
      </header>
    );
  }

  /* ── D · Disc seal ────────────────────────────────────────────────────── */
  if (variant === "seal") {
    return (
      <header className="etb-page__hero cortex-hero cortex-hero--seal">
        <div className="cortex-seal">
          <div className="cortex-seal__text">
            {kicker}
            {title}
            {oneLiner}
            {tags}
          </div>
          <div className="cortex-seal__emblem">
            <div className="cortex-seal__disc">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                className="cortex-seal__img"
                src={mark.src}
                alt={mark.alt}
                width={mark.width}
                height={mark.height}
              />
              <span className="cortex-seal__vignette" aria-hidden="true" />
            </div>
            <svg
              className="cortex-seal__ring"
              viewBox="0 0 400 400"
              aria-hidden="true"
              focusable="false"
            >
              <defs>
                <path id="cortex-seal-ring" d={RING_PATH} fill="none" />
              </defs>
              <text>
                <textPath
                  href="#cortex-seal-ring"
                  textLength={RING_LENGTH}
                  lengthAdjust="spacing"
                >
                  {RING_TEXT}
                </textPath>
              </text>
            </svg>
          </div>
        </div>
      </header>
    );
  }

  /* ── E · Macro band ───────────────────────────────────────────────────── */
  if (variant === "macro") {
    return (
      <header className="etb-page__hero cortex-hero cortex-hero--macro">
        <div className="cortex-macro">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className="cortex-macro__zoom"
            src={mark.src}
            alt=""
            aria-hidden="true"
            width={mark.width}
            height={mark.height}
          />
          <span className="cortex-macro__veil" aria-hidden="true" />
        </div>
        <div className="cortex-macro__row">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className="cortex-macro__chip"
            src={mark.src}
            alt={mark.alt}
            width={mark.width}
            height={mark.height}
          />
          <div className="cortex-macro__head">
            {kicker}
            {title}
          </div>
        </div>
        {oneLiner}
        {tags}
      </header>
    );
  }

  /* ── F · Sleeve ───────────────────────────────────────────────────────── */
  if (variant === "sleeve") {
    return (
      <header className="etb-page__hero cortex-hero cortex-hero--sleeve">
        <div className="cortex-sleeve">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className="cortex-sleeve__img"
            src={mark.src}
            alt={mark.alt}
            width={mark.width}
            height={mark.height}
          />
          <span className="cortex-sleeve__gloss" aria-hidden="true" />
        </div>
        {kicker}
        {title}
        {oneLiner}
        {tags}
      </header>
    );
  }

  /* ── G · Persistent badge ─────────────────────────────────────────────── */
  return (
    <>
      <header className="etb-page__hero cortex-hero cortex-hero--badge">
        <div className="cortex-badgeHero">
          <div className="cortex-badgeHero__disc">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              className="cortex-badgeHero__img"
              src={mark.src}
              alt={mark.alt}
              width={mark.width}
              height={mark.height}
            />
            <span className="cortex-badgeHero__vignette" aria-hidden="true" />
          </div>
          <div className="cortex-badgeHero__text">
            {kicker}
            {title}
          </div>
        </div>
        {oneLiner}
        {tags}
      </header>
      <CortexStickyBadge src={mark.src} name={project.name} />
    </>
  );
}
