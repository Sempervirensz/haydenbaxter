"use client";

// The CD-scroll landing chapter (disc/clock + numbered project labels) — the
// signature Work intro. Extracted verbatim from WorkSection so the merged
// cinematic section can reuse it without modifying the original WorkSection.

import { WORK_LANDING, WORK_SCROLL_CONFIG } from "@/data/work";
import WorkChapterList from "./WorkChapterList";
import ScrollCue from "./ScrollCue";

export default function WorkLanding({ activeLabel }: { activeLabel: string }) {
  return (
    <div className="work__chapter work__chapter--landing" style={{ zIndex: 1 }}>
      <article className="work__screen work__screen--landing">
        <WorkChapterList activeLabel={activeLabel} />

        <div className="cd-player-wrap" aria-hidden="true">
          <img src="/playershellpngtransparent.webp" alt="" className="cd-player-shell" />
          <img src="/playerforeground.webp" alt="" className="cd-player-fg" />
          <div className="cd-disc-overlay">
            <div className="cd-disc" />
          </div>
        </div>

        <ScrollCue />
      </article>
    </div>
  );
}
