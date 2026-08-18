// One offer, drawn in one layout.
//
// Every layout renders the SAME material in the same order — eyebrow, title,
// lede, two labelled blocks, the signals strip, the note, and the two actions.
// What changes is the structure that material is poured into, which is what
// makes the five comparable rather than five different pages.
//
// Layout is driven by `data-layout` on the root, so there are no per-layout
// branches in this markup beyond the one that genuinely needs a different DOM:
// Split needs its own two-pane wrapper. Everything else is CSS.

import type { OfferLayoutId, OfferSurfaceId, PathDef } from "@/data/offerLab";
// Imported HERE, not only in the lab shell. This component is also mounted
// from the CTA row in /cta-lab/in-site, which never loads the shell — and a
// missing stylesheet does not error, it just renders the markup naked.
import "./offer-lab.css";

interface Props {
  path: PathDef;
  layout: OfferLayoutId;
  surface: OfferSurfaceId;
}

export default function OfferScreen({ path, layout, surface }: Props) {
  const d = path.destination;
  const split = layout === "split";

  const identity = (
    <div className="ofr__identity">
      <p className="ofr__eyebrow">{d.eyebrow}</p>
      <h1 className="ofr__title">{d.title}</h1>
      <p className="ofr__lede">{d.lede}</p>
      <div className="ofr__actions">
        <a
          className="ofr-action ofr-action--primary"
          href={d.primary.href}
          {...(d.primary.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        >
          {d.primary.label}
          <span aria-hidden="true">→</span>
        </a>
        {d.secondary && (
          <a
            className="ofr-action ofr-action--ghost"
            href={d.secondary.href}
            {...(d.secondary.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
          >
            {d.secondary.label}
          </a>
        )}
      </div>
    </div>
  );

  const proof = (
    <div className="ofr__proof">
      <div className="ofr__blocks">
        {d.blocks.map((block, i) => (
          <section key={block.label} className="ofr__block">
            <header className="ofr__blockHead">
              {/* Index numbers its sections; every other layout hides this. */}
              <span className="ofr__blockNum" aria-hidden="true">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h2 className="ofr__blockLabel">{block.label}</h2>
            </header>
            <p className="ofr__blockDesc">{block.descriptor}</p>
            <ul className="ofr__list">
              {block.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>
        ))}
      </div>

      <ul className="ofr__signals" aria-label="Credentials">
        {d.signals.map((s) => (
          <li key={s}>{s}</li>
        ))}
      </ul>

      <p className="ofr__note">{d.note}</p>
    </div>
  );

  return (
    /* The container is this WRAPPER, not `.ofr` itself. A container query never
       matches the element that establishes the container, so with
       `container-type` on `.ofr` every rule targeting `.ofr[data-layout=...]`
       inside an `@container` block silently did nothing — which is how Split
       failed to collapse to one column and overflowed by 113px at 390. */
    <div className="ofr-shell">
      <article className="ofr" data-layout={layout} data-surface={surface}>
      {split ? (
        <>
          <div className="ofr__pane ofr__pane--identity">{identity}</div>
          <div className="ofr__pane ofr__pane--proof">{proof}</div>
        </>
      ) : (
        <>
          {identity}
          {proof}
        </>
        )}
      </article>
    </div>
  );
}
