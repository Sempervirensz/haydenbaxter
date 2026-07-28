"use client";

// The off-white destination screen.
//
// There is deliberately no navigation of any kind in here beyond "Back to
// options": the visitor already made their one choice, and this is the whole
// answer to it. Both blocks are always visible — nobody should have to pick
// between AI and supply chain before they can read the offer or get in touch.

import type { DestinationAction, PathDef } from "@/data/workTogether";

export default function WorkTogetherScreen({
  path,
  onBack,
}: {
  path: PathDef;
  onBack: () => void;
}) {
  const d = path.destination;

  return (
    <section className="wt-screen" aria-label={path.label}>
      <header className="wt-screen__head">
        <span className="wt-screen__eyebrow">{d.eyebrow}</span>
        <button
          type="button"
          className="wt-screen__back"
          onClick={onBack}
          data-wt-focus="destination"
        >
          <span aria-hidden="true">&larr;</span> Back to options
        </button>
      </header>

      <div className="wt-screen__body">
        <h3 className="wt-screen__title">{d.title}</h3>
        <p className="wt-screen__lede">{d.lede}</p>

        <div className="wt-screen__blocks">
          {d.blocks.map((block) => (
            <div key={block.label} className="wt-screen__block">
              <h4 className="wt-screen__blockLabel">{block.label}</h4>
              <p className="wt-screen__blockDesc">{block.descriptor}</p>
              <ul className="wt-screen__list">
                {block.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <ul className="wt-screen__signals">
          {d.signals.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ul>

        <footer className="wt-screen__foot">
          <p className="wt-screen__note">{d.note}</p>
          <div className="wt-screen__actions">
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
    <a className={`wt-action wt-action--${kind}`} href={action.href} {...external}>
      {action.label}
    </a>
  );
}
