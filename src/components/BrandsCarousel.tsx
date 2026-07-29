import type { CSSProperties } from "react";
import { SITE_CONTENT, type BrandLogo } from "@/data/siteContent";

export default function BrandsCarousel() {
  const { logos, repeats, context, note } = SITE_CONTENT.brands;

  const items: BrandLogo[] = [];
  for (let i = 0; i < repeats; i++) {
    for (const logo of logos) {
      items.push(logo);
    }
  }

  // The keyframe shifts the track by exactly one pass through `logos`. The CSS
  // needs the set size to compute that distance; everything else about the
  // marquee (slot width, duration, tiering) lives in globals.css. It goes on
  // the section because that is where --brands-cycle's calc() is declared, and
  // a custom property resolves against the element that declares it — set on
  // the track, this would silently fall back to the default instead.
  const shellStyle = { "--brands-logos": logos.length } as CSSProperties;

  return (
    <section className="brands" aria-label="Brands worked with" style={shellStyle}>
      {/* Only the first pass is real content — the rest exists so the belt can
          cover the viewport. Hiding the repeats keeps a screen reader from
          hearing "Nike Disney Aosom" six times over. */}
      <div className="brands__track">
        {items.map((brand, idx) => {
          const echo = idx >= logos.length;
          return brand.imageSrc ? (
            <span
              key={idx}
              className="brands__logo brands__logo--img"
              data-brand={brand.label.toLowerCase()}
              aria-hidden={echo || undefined}
            >
              <img
                src={brand.imageSrc}
                alt={echo ? "" : brand.label}
                loading="lazy"
                decoding="async"
              />
            </span>
          ) : (
            <span key={idx} className="brands__logo" aria-hidden={echo || undefined}>
              {brand.label}
            </span>
          );
        })}
      </div>
      <p className="brands__context">{context}</p>
      <p className="brands__note">{note}</p>
    </section>
  );
}
