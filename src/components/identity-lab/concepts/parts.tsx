// Shared furniture for the identity treatments.
//
// There is very little of it, on purpose. Rounds one and two both grew a
// vocabulary — chapter rules, DYMO fact strips, eyebrows — and every piece of
// it turned out to be another place to restate what the copy already said. The
// fact strip in particular repeated Nike / Disney / Mandarin three lines under
// a sentence that had just named them, which is precisely the redundancy this
// lab exists to remove. It is gone.
//
// What is left is the one thing a photographic treatment genuinely needs.

/** Full-bleed art plus the scrim that keeps 145 words legible over it. */
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
