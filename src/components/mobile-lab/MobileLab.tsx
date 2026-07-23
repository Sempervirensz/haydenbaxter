"use client";

// ═══════════════════════════════════════════════════════════════════════════
// [EXPERIMENT] Mobile Lab shell — /mobile-lab (local-only, noindex)
//
// Lab chrome only — never ships. Desktop: renders <MobileExperience> inside a
// 390×844 phone frame with a control panel for A/B-ing the CD treatment.
// On a real phone (<768px) the frame dissolves to full-bleed and the controls
// collapse behind a floating DYMO toggle, so you can test on-device.
// ═══════════════════════════════════════════════════════════════════════════

import { useState } from "react";
import MobileExperience, { type CdMode } from "./MobileExperience";
import "./mobile-lab.css";

const CD_MODES: { id: CdMode; label: string; blurb: string }[] = [
  {
    id: "player-dock",
    label: "A · Player + mini dock",
    blurb:
      "Discman landing card plus a sticky mini disc that spins with scroll and opens the track sheet.",
  },
  {
    id: "player",
    label: "B · Player only",
    blurb:
      "The suede Discman landing is the sole CD moment. Track sheet stays reachable via the menu button.",
  },
  {
    id: "off",
    label: "C · No CD (baseline)",
    blurb: "Skips the CD landing entirely — tests comprehension without the metaphor.",
  },
];

export default function MobileLab() {
  const [cdMode, setCdMode] = useState<CdMode>("player-dock");
  const [controlsOpen, setControlsOpen] = useState(false);

  return (
    <div className="mlab-shell">
      <div className="mlab-stage">
        <span className="mlab-stage-title">Mobile Lab — cinematic field guide</span>
        <div className="mlab-frame">
          {/* Remount on mode switch so scroll/progress state resets cleanly */}
          <MobileExperience key={cdMode} cdMode={cdMode} />
        </div>
      </div>

      {/* On-device toggle for the controls panel */}
      <button
        type="button"
        className="tag mlab-controls-toggle"
        aria-expanded={controlsOpen}
        onClick={() => setControlsOpen((v) => !v)}
      >
        Lab
      </button>

      <aside className="mlab-controls" data-open={controlsOpen}>
        <h2>CD treatment</h2>
        {CD_MODES.map((mode) => (
          <button
            key={mode.id}
            type="button"
            className="mlab-option"
            aria-pressed={cdMode === mode.id}
            onClick={() => {
              setCdMode(mode.id);
              setControlsOpen(false);
            }}
          >
            {mode.label}
            <small>{mode.blurb}</small>
          </button>
        ))}

        <h2>What to evaluate</h2>
        <p>
          Does this read as HaydenBaxter.com on a phone — suede, Discman, tape
          labels, DYMO, playing cards? Can a recruiter get positioning + proof
          in the first screen? Does the CD landing earn its scroll height?
        </p>
        <p>
          Promotion notes: <code>src/app/mobile-lab/NOTES.md</code>
        </p>
      </aside>
    </div>
  );
}
