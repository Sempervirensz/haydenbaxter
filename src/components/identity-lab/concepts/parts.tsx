// Shared furniture for the identity concepts.
//
// This is the Work chapters' own grammar, lifted deliberately: a mono eyebrow
// with a hairline rule running off to the right (`01 — WORLDPULSE ————`), and
// a DYMO strip of facts. Round one invented its own furniture and looked like
// a text document sitting next to the site; these two pieces are what make a
// section read as native here.

import { STRIP } from "@/data/identityLab";

/** Mono chapter rule — the `01 — WORLDPULSE ————` device from the Work stack. */
export function ChapterRule({ label }: { label: string }) {
  return (
    <p className="ilab-rule-label">
      <span>{label}</span>
      <span className="ilab-rule-label__line" aria-hidden="true" />
    </p>
  );
}

/**
 * The credential strip, as DYMO labels.
 *
 * Facts only, and no sentence in any concept repeats them — that separation is
 * what stops the section from stating its credibility twice, which is the
 * live page's habit.
 */
export function FactStrip({ className = "" }: { className?: string }) {
  return (
    <ul className={`ilab-strip ${className}`.trim()}>
      {STRIP.map((f) => (
        <li key={f} className="ilab-strip__tag">
          {f}
        </li>
      ))}
    </ul>
  );
}

/** Full-bleed image plus the scrim that keeps white type legible over it. */
export function Bleed({
  src,
  alt,
  w,
  h,
  position,
}: {
  src: string;
  alt: string;
  w: number;
  h: number;
  position?: string;
}) {
  return (
    <div className="ilab-bleed" aria-hidden={alt === "" || undefined}>
      <img
        src={src}
        alt={alt}
        width={w}
        height={h}
        loading="lazy"
        decoding="async"
        style={position ? { objectPosition: position } : undefined}
      />
      <span className="ilab-bleed__scrim" />
    </div>
  );
}
