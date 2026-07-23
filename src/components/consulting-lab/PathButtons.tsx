"use client";

const PATHS = [
  { id: "ai", label: "AI Implementation", href: "#ai-implementation" },
  { id: "supply", label: "Supply Chain", href: "#supply-chain" },
  { id: "worldpulse", label: "WorldPulse", href: "#worldpulse" },
] as const;

interface PathButtonsProps {
  revealed: boolean;
  reducedMotion: boolean;
}

export default function PathButtons({ revealed, reducedMotion }: PathButtonsProps) {
  return (
    <div className={`consultHero-paths ${revealed ? "is-visible" : ""} ${reducedMotion ? "is-static" : ""}`}>
      {PATHS.map((path, index) => (
        <a
          key={path.id}
          href={path.href}
          className="consultHero-pathButton tag"
          style={{ ["--path-index" as string]: index } as React.CSSProperties}
        >
          {path.label}
        </a>
      ))}
    </div>
  );
}
