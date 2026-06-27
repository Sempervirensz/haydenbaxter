"use client";

// The CD-scroll landing chapter (disc/clock + numbered project labels) — the
// signature Work intro. Extracted verbatim from WorkSection so the merged
// cinematic section can reuse it without modifying the original WorkSection.

import { WORK_LANDING, WORK_SCROLL_CONFIG } from "@/data/work";

export default function WorkLanding({ activeLabel }: { activeLabel: string }) {
  const trackList = WORK_SCROLL_CONFIG.zones.filter((z) => z.label !== "");

  return (
    <div className="work__chapter work__chapter--landing" style={{ zIndex: 1 }}>
      <article className="work__screen work__screen--landing">
        <ol className="wl-c2__list" aria-label={WORK_LANDING.title}>
          {trackList.map((zone, i) => {
            const isActive = zone.label === activeLabel;
            return (
              <li
                key={zone.label}
                className={`wl-c2__item ${isActive ? "is-active" : ""}`}
              >
                <span className="wl-c2__num">{String(i + 1).padStart(2, "0")}</span>
                <span className="wl-c2__name">{zone.label}</span>
              </li>
            );
          })}
        </ol>

        <div className="cd-player-wrap" aria-hidden="true">
          <img src="/playershellpngtransparent.png" alt="" className="cd-player-shell" />
          <img src="/playerforeground.png" alt="" className="cd-player-fg" />
          <div className="cd-disc-overlay">
            <div className="cd-disc" />
          </div>
        </div>
      </article>
    </div>
  );
}
