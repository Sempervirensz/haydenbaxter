import CardDeck from "./CardDeck";

export default function HeroSection() {
  return (
    <section className="min-h-screen flex flex-col items-center justify-between relative bg-[#0a0a0a]">
      {/* Subtle glow behind cards */}
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full opacity-20 blur-[120px] pointer-events-none"
        style={{ background: "radial-gradient(ellipse, rgba(255,255,255,0.15), transparent)" }}
      />

      {/* Hero text */}
      <div className="flex flex-col items-center justify-center text-center px-4 pt-32 pb-16">
        <p
          className="text-sm tracking-[0.2em] uppercase text-white/60 mb-6"
          style={{ fontFamily: "var(--font-sans)" }}
        >
          I&apos;m Hayden, A Digital Product Designer
        </p>
        <h1
          className="text-5xl md:text-7xl lg:text-8xl font-normal leading-[1.05] max-w-4xl"
          style={{ fontFamily: "var(--font-serif)" }}
        >
          I Create Designs That Appeal, Engage &amp; Sell
        </h1>
      </div>

      {/* Card deck */}
      <div className="w-full relative z-10 mt-auto">
        <CardDeck />
      </div>

      {/* Extra scroll space so cards can unbunch */}
      <div className="h-[50vh]" />
    </section>
  );
}
