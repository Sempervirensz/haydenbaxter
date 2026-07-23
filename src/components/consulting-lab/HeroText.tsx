"use client";

interface HeroTextProps {
  reducedMotion: boolean;
}

export default function HeroText({ reducedMotion }: HeroTextProps) {
  return (
    <div className="consultHero-textWrap" aria-live="polite">
      <h1 className={`consultHero-quote ${reducedMotion ? "is-static" : ""}`}>
        The best way to predict the future is to create it.
      </h1>
    </div>
  );
}
