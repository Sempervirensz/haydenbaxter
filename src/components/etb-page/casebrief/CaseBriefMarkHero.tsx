import type { ETBProject } from "@/data/work";

/* CaseBrief-only hero treatments.
 *
 * Nothing here is shared with Cortex or AtomicOS. Those two marks are
 * photographs of embroidery; this one is a flat isometric render sitting on a
 * perfectly uniform navy field — sampled at #00253c in all four corners.
 *
 * That uniformity is the whole opportunity. Where Cortex had to hide a grey
 * ground and AtomicOS had to crush a black one, CaseBrief can simply hand its
 * ground to the page: paint the container the mark's own navy and the image's
 * square edge stops existing. Every direction below is built on that, and on
 * the product's own metaphor — scattered records compressed into one solid,
 * inspectable object. */

export type CaseBriefHeroVariant =
  | "current"
  | "plinth"
  | "monolith"
  | "stack"
  | "chip";

export interface CaseBriefHeroDirection {
  id: CaseBriefHeroVariant;
  label: string;
  note: string;
  group: string;
}

export const CASEBRIEF_HERO_DIRECTIONS: CaseBriefHeroDirection[] = [
  {
    id: "current",
    label: "Current",
    note: "What ships today — the mark as a 72–96px seal above the kicker.",
    group: "Baseline",
  },
  {
    id: "plinth",
    label: "A · Navy plinth",
    note: "The page adopts the mark's own #00253c for one panel. The cube sits large on it with the title beside — no frame, because the panel is the frame.",
    group: "Directions",
  },
  {
    id: "monolith",
    label: "B · Corner monolith",
    note: "Full-bleed navy band with the cube oversized and cropped by the right edge, fading to page black. Architectural rather than illustrative.",
    group: "Directions",
  },
  {
    id: "stack",
    label: "C · Case stack",
    note: "Three navy cards fanned like files, the cube on the top one. The product's own metaphor: scattered records resolving into one case.",
    group: "Directions",
  },
  {
    id: "chip",
    label: "D · Chip lockup",
    note: "The restrained option. Cube at ~210px in a rounded navy chip with a soft glow, title beside, tags recoloured to the cube's own green and teal.",
    group: "Directions",
  },
];

interface Props {
  project: ETBProject;
  variant: CaseBriefHeroVariant;
}

export default function CaseBriefMarkHero({ project, variant }: Props) {
  const category = project.demo?.heroCategory ?? project.category;
  const mark = project.mark;

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

  /* ── A · Navy plinth ──────────────────────────────────────────────────── */
  if (variant === "plinth") {
    return (
      <header className="etb-page__hero cb-hero cb-hero--plinth">
        <div className="cb-plinth">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className="cb-plinth__img"
            src={mark.src}
            alt={mark.alt}
            width={mark.width}
            height={mark.height}
          />
          <div className="cb-plinth__text">
            {kicker}
            {title}
          </div>
        </div>
        {oneLiner}
        {tags}
      </header>
    );
  }

  /* ── B · Corner monolith ──────────────────────────────────────────────── */
  if (variant === "monolith") {
    return (
      <header className="etb-page__hero cb-hero cb-hero--monolith">
        <div className="cb-monolith">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className="cb-monolith__img"
            src={mark.src}
            alt={mark.alt}
            width={mark.width}
            height={mark.height}
          />
          <span className="cb-monolith__veil" aria-hidden="true" />
          <div className="cb-monolith__text">
            {kicker}
            {title}
          </div>
        </div>
        {oneLiner}
        {tags}
      </header>
    );
  }

  /* ── C · Case stack ───────────────────────────────────────────────────── */
  if (variant === "stack") {
    return (
      <header className="etb-page__hero cb-hero cb-hero--stack">
        <div className="cb-stack">
          {/* The two behind are the files this one was built from — plain
              navy, no content, doing the work of depth and nothing else. */}
          <span className="cb-stack__card cb-stack__card--back" aria-hidden="true" />
          <span className="cb-stack__card cb-stack__card--mid" aria-hidden="true" />
          <div className="cb-stack__card cb-stack__card--front">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              className="cb-stack__img"
              src={mark.src}
              alt={mark.alt}
              width={mark.width}
              height={mark.height}
            />
          </div>
        </div>
        {kicker}
        {title}
        {oneLiner}
        {tags}
      </header>
    );
  }

  /* ── D · Chip lockup ──────────────────────────────────────────────────── */
  return (
    <header className="etb-page__hero cb-hero cb-hero--chip">
      <div className="cb-chip">
        <div className="cb-chip__plate">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className="cb-chip__img"
            src={mark.src}
            alt={mark.alt}
            width={mark.width}
            height={mark.height}
          />
        </div>
        <div className="cb-chip__text">
          {kicker}
          {title}
          {oneLiner}
          {tags}
        </div>
      </div>
    </header>
  );
}
