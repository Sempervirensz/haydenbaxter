import CardDeck from "./CardDeck";
import Navbar from "./Navbar";
import { SITE_CONTENT } from "@/data/siteContent";

export default function HeroSection() {
  const { hero } = SITE_CONTENT;

  return (
    <section className="min-h-screen flex flex-col items-center justify-between relative bg-[#0a0a0a] overflow-hidden">
      <Navbar />

      {/* Subtle glow behind cards */}
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full opacity-20 blur-[120px] pointer-events-none"
        style={{ background: "radial-gradient(ellipse, rgba(255,255,255,0.15), transparent)" }}
      />

      {/* Hero text */}
      <div className="flex flex-col items-center justify-center text-center px-5 sm:px-4 pt-20 sm:pt-32 pb-6 sm:pb-16">
        <p
          className="text-[10px] sm:text-sm tracking-[0.12em] sm:tracking-[0.2em] uppercase text-white/60 mb-3 sm:mb-6"
          style={{ fontFamily: "var(--font-sans)" }}
        >
          {hero.eyebrow}
        </p>
        <h1
          className="text-[22px] sm:text-5xl md:text-7xl lg:text-8xl font-normal leading-[1.1] sm:leading-[1.05] max-w-4xl"
          style={{ fontFamily: "var(--font-serif)" }}
        >
          {hero.heading}
        </h1>
      </div>

      {/* Card deck */}
      <div className="w-full relative z-10 mt-auto">
        <CardDeck />
      </div>

      {/* Extra scroll space so cards can unbunch (desktop only; mobile scroll-space comes from the 2500vh work section) */}
      <div className="hidden sm:block sm:h-[50vh]" />
    </section>
  );
}
