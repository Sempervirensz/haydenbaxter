"use client";

// The off-white destination screen, shared by all three concepts.
//
// Replaces the old tabbed DetailPanel. There is deliberately no navigation of
// any kind in here beyond "Back to options": the visitor already made their one
// choice, and this is the whole answer to it. Both blocks are always visible —
// nobody should have to pick between AI and supply chain before they can read
// the offer or get in touch.
//
// Concepts wrap this in their own container and animate that container; the
// screen itself never knows how it arrived. That keeps the comparison honest —
// only structure and motion change between concepts, not content density.

import type { DestinationAction, PathDef } from "@/data/ctaLab";

interface Props {
  path: PathDef;
  onBack: () => void;
  /** Only the primary stage takes focus, so a side-by-side compare doesn't fight. */
  primary?: boolean;
  /** Concept-specific modifier, e.g. "rail" → .ctal-screen--rail */
  variant: string;
}

export default function Destination({ path, onBack, primary, variant }: Props) {
  const d = path.destination;

  return (
    <section className={`ctal-screen ctal-screen--${variant}`} aria-label={path.label}>
      <header className="ctal-screen__head">
        <span className="ctal-screen__eyebrow">{d.eyebrow}</span>
        <button
          type="button"
          className="ctal-screen__back"
          onClick={onBack}
          {...(primary ? { "data-autofocus": "destination" } : {})}
        >
          <span aria-hidden>&larr;</span> Back to options
        </button>
      </header>

      <div className="ctal-screen__body">
        <h3 className="ctal-screen__title">{d.title}</h3>
        <p className="ctal-screen__lede">{d.lede}</p>

        <div className="ctal-screen__blocks">
          {d.blocks.map((block) => (
            <div key={block.label} className="ctal-screen__block">
              <h4 className="ctal-screen__blockLabel">{block.label}</h4>
              <p className="ctal-screen__blockDesc">{block.descriptor}</p>
              <ul className="ctal-screen__list">
                {block.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <ul className="ctal-screen__signals">
          {d.signals.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ul>

        <footer className="ctal-screen__foot">
          <p className="ctal-screen__note">{d.note}</p>
          <div className="ctal-screen__actions">
            <Action action={d.primary} kind="primary" />
            {d.secondary && <Action action={d.secondary} kind="ghost" />}
          </div>
        </footer>
      </div>
    </section>
  );
}

function Action({
  action,
  kind,
}: {
  action: DestinationAction;
  kind: "primary" | "ghost";
}) {
  const external = action.external
    ? { target: "_blank", rel: "noopener noreferrer" }
    : {};
  return (
    <a className={`ctal-action ctal-action--${kind}`} href={action.href} {...external}>
      {action.label}
    </a>
  );
}
