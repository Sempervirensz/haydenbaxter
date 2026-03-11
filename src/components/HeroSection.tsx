import Navbar from "./Navbar";
import { SITE_CONTENT } from "@/data/siteContent";

export default function HeroSection() {
  const { hero } = SITE_CONTENT;

  return (
    <section className="flex flex-col items-center relative bg-[#0a0a0a] overflow-hidden">
      <Navbar />

      {/* Hero text */}
      <div className="flex flex-col items-center justify-center text-center px-5 sm:px-4 pt-20 sm:pt-32 pb-12 sm:pb-20">
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
    </section>
  );
}
