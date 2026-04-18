import { SITE_CONTENT, type BrandLogo } from "@/data/siteContent";

export default function BrandsCarousel() {
  const { logos, repeats, note } = SITE_CONTENT.brands;

  const items: BrandLogo[] = [];
  for (let i = 0; i < repeats; i++) {
    for (const logo of logos) {
      items.push(logo);
    }
  }

  return (
    <section className="brands" aria-label="Brands worked with">
      <div className="brands__track">
        {items.map((brand, idx) =>
          brand.imageSrc ? (
            <span key={idx} className="brands__logo brands__logo--img" data-brand={brand.label.toLowerCase()}>
              <img src={brand.imageSrc} alt={brand.label} loading="lazy" decoding="async" />
            </span>
          ) : (
            <span key={idx} className="brands__logo">
              {brand.label}
            </span>
          )
        )}
      </div>
      <p className="brands__note">{note}</p>
    </section>
  );
}
