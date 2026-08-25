import type { ETBProject } from "@/data/work";

/* AtomicOS-only hero treatments.
 *
 * Nothing here is shared with Cortex or CaseBrief, and it could not be: this
 * mark is a different object with a different problem. It is cream thread on
 * near-black fabric — monochrome, austere, and already sitting on the page's
 * own background — so unlike Cortex's rainbow-on-grey it does not need a
 * frame to survive. Crush the fabric's blacks and the atom simply floats.
 *
 * The directions below are drawn from what AtomicOS *is* — orbits, cycles,
 * repetition, discipline — not from what looked good on another project. */

export type AtomicOSHeroVariant =
  | "current"
  | "float"
  | "orbit"
  | "ledger"
  | "cadence";

export interface AtomicOSHeroDirection {
  id: AtomicOSHeroVariant;
  label: string;
  note: string;
  group: string;
}

export const ATOMICOS_HERO_DIRECTIONS: AtomicOSHeroDirection[] = [
  {
    id: "current",
    label: "Current",
    note: "What ships today — the mark as a 72–96px seal above the kicker.",
    group: "Baseline",
  },
  {
    id: "float",
    label: "A · Free float",
    note: "No frame at all. The fabric's blacks are crushed to page black so only the cream stitching remains, at 340px, sitting in the type like a piece of it.",
    group: "Directions",
  },
  {
    id: "orbit",
    label: "B · Orbit field",
    note: "The atom oversized and bled off the left edge at low contrast, with the title set in the negative space its orbits leave. The mark becomes the layout.",
    group: "Directions",
  },
  {
    id: "ledger",
    label: "C · Ledger plate",
    note: "The austere read: hairline rules above and below, mark centred small between them, mono metadata either side. Matches the mark's own restraint.",
    group: "Directions",
  },
  {
    id: "cadence",
    label: "D · Cadence row",
    note: "The mark repeated five times, fading left to right. AtomicOS is a product about repetition — the logo becomes the rhythm rather than a single stamp.",
    group: "Directions",
  },
];

/* The cadence row's repeats: scale and opacity per step. The first is the
 * mark proper; the rest are its echo. */
const CADENCE = [
  { scale: 1, opacity: 1 },
  { scale: 0.86, opacity: 0.52 },
  { scale: 0.74, opacity: 0.3 },
  { scale: 0.64, opacity: 0.17 },
  { scale: 0.56, opacity: 0.09 },
];

interface Props {
  project: ETBProject;
  variant: AtomicOSHeroVariant;
}

export default function AtomicOSMarkHero({ project, variant }: Props) {
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

  /* ── A · Free float ───────────────────────────────────────────────────── */
  if (variant === "float") {
    return (
      <header className="etb-page__hero aos-hero aos-hero--float">
        <div className="aos-float">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className="aos-float__img"
            src={mark.src}
            alt={mark.alt}
            width={mark.width}
            height={mark.height}
          />
          <div className="aos-float__text">
            {kicker}
            {title}
          </div>
        </div>
        {oneLiner}
        {tags}
      </header>
    );
  }

  /* ── B · Orbit field ──────────────────────────────────────────────────── */
  if (variant === "orbit") {
    return (
      <header className="etb-page__hero aos-hero aos-hero--orbit">
        <div className="aos-orbit">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className="aos-orbit__img"
            src={mark.src}
            alt={mark.alt}
            width={mark.width}
            height={mark.height}
          />
          <div className="aos-orbit__text">
            {kicker}
            {title}
            {oneLiner}
            {tags}
          </div>
        </div>
      </header>
    );
  }

  /* ── C · Ledger plate ─────────────────────────────────────────────────── */
  if (variant === "ledger") {
    return (
      <header className="etb-page__hero aos-hero aos-hero--ledger">
        <div className="aos-ledger">
          <span className="aos-ledger__rule" aria-hidden="true" />
          <div className="aos-ledger__row">
            <span className="aos-ledger__meta">{category}</span>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              className="aos-ledger__img"
              src={mark.src}
              alt={mark.alt}
              width={mark.width}
              height={mark.height}
            />
            <span className="aos-ledger__meta aos-ledger__meta--end">
              {project.status}
            </span>
          </div>
          <span className="aos-ledger__rule" aria-hidden="true" />
        </div>
        {title}
        {oneLiner}
        {tags}
      </header>
    );
  }

  /* ── D · Cadence row ──────────────────────────────────────────────────── */
  return (
    <header className="etb-page__hero aos-hero aos-hero--cadence">
      <div className="aos-cadence">
        {CADENCE.map((step, i) => (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            key={i}
            className="aos-cadence__img"
            src={mark.src}
            /* Only the first repeat is the mark; the rest are its echo and
               would otherwise be announced five times over. */
            alt={i === 0 ? mark.alt : ""}
            aria-hidden={i === 0 ? undefined : "true"}
            width={mark.width}
            height={mark.height}
            style={{
              opacity: step.opacity,
              width: `calc(var(--aos-cadence-size) * ${step.scale})`,
            }}
          />
        ))}
      </div>
      {kicker}
      {title}
      {oneLiner}
      {tags}
    </header>
  );
}
