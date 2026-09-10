// Shared furniture for the five identity concepts.
//
// Everything here is the site's own vocabulary — the DYMO `.tag`, the serif
// heading step, the mono meta step — restated with `ilab-` classes so the lab
// can never leak a rule back into globals.css.

export function Eyebrow({ children }: { children: React.ReactNode }) {
  return <p className="ilab-eyebrow">{children}</p>;
}

/** Section heading, matching the serif single-word headings the site uses. */
export function Heading({ children }: { children: React.ReactNode }) {
  return <h2 className="ilab-heading">{children}</h2>;
}

/** A hairline. The site separates blocks with these rather than with boxes. */
export function Rule() {
  return <div className="ilab-rule" aria-hidden="true" />;
}

/** Quiet mono metadata — never body copy, per the readability floors. */
export function Meta({ items }: { items: readonly string[] }) {
  return (
    <ul className="ilab-meta">
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}
