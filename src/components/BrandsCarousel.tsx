import { SITE_CONTENT } from "@/data/siteContent";

export default function BrandsCarousel() {
  const { logos, repeats, note } = SITE_CONTENT.brands;

  const items: string[] = [];
  for (let i = 0; i < repeats; i++) {
    for (const logo of logos) {
      items.push(logo);
    }
  }

  return (
    <section className="brands" aria-label="Brands worked with">
      <div className="brands__track">
        {items.map((logo, idx) => (
          <span key={idx} className="brands__logo">
            {logo}
          </span>
        ))}
      </div>
      <p className="brands__note">{note}</p>
    </section>
  );
}
