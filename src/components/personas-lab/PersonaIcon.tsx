// Persona marks.
//
// Three different kinds of mark, on purpose:
//
//   worldpulse  the real WorldPulse logo mark, cropped out of the lockup in
//               public/images/worldpulse/worldpulse-digital-product-passport-logo.png. A brand mark, so it keeps its own
//               gold and does NOT follow the colour scheme. Recolouring a logo
//               to match a theme is the one thing you do not do to a logo.
//   supply      a real globe, built from public/textures/earth-blue-marble.jpg
//               (already in the repo for the particle globe). Cropped to the
//               APAC sourcing region this persona is actually about, then made
//               spherical in CSS with limb darkening rather than left as a
//               flat disc.
//   ai          the winged-victory emblem from the CD label, cropped out of
//               public/images/portfolio/hayden-baxter-work-portfolio-cd.png. Its own navy starfield comes with
//               it, so like the globe it is rendered as a disc rather than
//               keyed out: that navy IS the CD, and the mark reads as a track
//               lifted off the disc the whole Work section is built around.
//
// Nothing is fetched from a CDN. vercel.json pins img-src to 'self' and data:,
// so an external icon host would be blocked outright.

import type { PersonaId } from "@/data/personas";
// The mark's own look travels with the component, so the lab and the shipped
// section cannot drift apart.
import "@/components/persona-mark.css";

export default function PersonaIcon({
  id,
  className = "",
}: {
  id: PersonaId;
  className?: string;
}) {
  // The WorldPulse mark. Transparent PNG, so it sits on the glass directly.
  if (id === "worldpulse") {
    return (
      <img
        src="/worldpulse-mark.png"
        alt=""
        // Explicit dimensions: the repo's perf rule is to define them so the
        // row never reflows once the mark decodes.
        width={256}
        height={256}
        loading="lazy"
        decoding="async"
        className={`${className} plab-mark__img`}
        aria-hidden="true"
      />
    );
  }

  // A real globe rather than a globe glyph. The sphere is CSS (see
  // .plab-mark__globe): the source is a flat equirectangular crop, and a disc
  // is not a planet without limb darkening on it.
  if (id === "supply") {
    return (
      <span
        className={`${className} plab-mark__globe`}
        role="presentation"
        aria-hidden="true"
      />
    );
  }

  // The angel emblem off the CD label. Same disc treatment as the globe, so
  // the two photographic marks sit together instead of one being a circle and
  // the other a square.
  return (
    <span
      className={`${className} plab-mark__angel`}
      role="presentation"
      aria-hidden="true"
    />
  );
}
