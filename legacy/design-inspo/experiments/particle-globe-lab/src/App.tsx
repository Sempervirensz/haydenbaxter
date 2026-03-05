import { useEffect, useMemo, useState } from "react";
import { ParticleGlobe } from "./components/ParticleGlobe";

type QualityMode = "auto" | "low" | "medium" | "high";

const QUALITY_MAP: Record<Exclude<QualityMode, "auto">, number> = {
  low: 7000,
  medium: 12000,
  high: 16000,
};

function App() {
  const isEmbed = useMemo(() => {
    if (typeof window === "undefined") return false;
    return new URLSearchParams(window.location.search).get("embed") === "1";
  }, []);
  const [quality, setQuality] = useState<QualityMode>("auto");
  const [interactive, setInteractive] = useState(true);
  const [rotationSpeed, setRotationSpeed] = useState(0.09);

  const count = useMemo(() => (quality === "auto" ? undefined : QUALITY_MAP[quality]), [quality]);

  useEffect(() => {
    if (typeof document === "undefined") return;
    document.documentElement.classList.toggle("lab-embed", isEmbed);
    document.body.classList.toggle("lab-embed", isEmbed);
    document.getElementById("root")?.classList.toggle("lab-embed-root", isEmbed);
    return () => {
      document.documentElement.classList.remove("lab-embed");
      document.body.classList.remove("lab-embed");
      document.getElementById("root")?.classList.remove("lab-embed-root");
    };
  }, [isEmbed]);

  if (isEmbed) {
    return (
      <main className="lab-page lab-page--embed" aria-label="Interactive particle globe">
        <div className="lab-embed-shell">
          <ParticleGlobe
            className="lab-globe lab-globe--embed"
            particleCount={count}
            rotationSpeed={rotationSpeed}
            interactive={interactive}
          />
        </div>
      </main>
    );
  }

  return (
    <main className="lab-page">
      <div className="lab-shell">
        <header className="lab-header">
          <p className="lab-kicker">Sandbox Prototype</p>
          <h1>Particle Globe Lab</h1>
          <p>
            Cinematic monochrome dotted globe with spring-based shell retention, turbulence, and
            gesture-driven interactions.
          </p>
        </header>

        <section className="lab-stage">
          <ParticleGlobe
            className="lab-globe"
            size={260}
            particleCount={count}
            rotationSpeed={rotationSpeed}
            interactive={interactive}
          />
        </section>

        <section className="lab-controls" aria-label="Globe tuning controls">
          <label>
            Quality
            <select
              value={quality}
              onChange={(event) => setQuality(event.target.value as QualityMode)}
            >
              <option value="auto">Auto (device adaptive)</option>
              <option value="low">Low (~7k particles)</option>
              <option value="medium">Medium (~12k particles)</option>
              <option value="high">High (~18k particles)</option>
            </select>
          </label>

          <label>
            Rotation speed ({rotationSpeed.toFixed(2)})
            <input
              type="range"
              min="0.04"
              max="0.35"
              step="0.01"
              value={rotationSpeed}
              onChange={(event) => setRotationSpeed(Number(event.target.value))}
            />
          </label>

          <label className="lab-toggle">
            <input
              type="checkbox"
              checked={interactive}
              onChange={(event) => setInteractive(event.target.checked)}
            />
            <span>Interactions enabled</span>
          </label>
        </section>
      </div>
    </main>
  );
}

export default App;
