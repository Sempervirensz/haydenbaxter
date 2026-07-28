import Navbar from "./Navbar";
import { SITE_CONTENT } from "@/data/siteContent";

export default function HeroSection() {
  const { hero } = SITE_CONTENT;

  return (
    <section className="flex flex-col items-center relative bg-[#0a0a0a] overflow-hidden">
      <Navbar />

      {/* Hero text. Sizing comes from the fluid scale rather than Tailwind's
          fixed steps, which topped out at text-8xl/max-w-4xl — i.e. 96px type
          in an 896px column no matter how wide the display got. */}
      <div className="hero-copy flex flex-col items-center justify-center text-center">
        <p
          className="hero-eyebrow"
          style={{ fontFamily: "var(--font-sans)" }}
        >
          {hero.eyebrow}
        </p>
        <h1
          className="hero-heading font-normal"
          style={{ fontFamily: "var(--font-serif)" }}
        >
          {hero.heading}
        </h1>
      </div>
    </section>
  );
}
