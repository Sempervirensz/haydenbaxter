"use client";

import { useEffect, useRef } from "react";
import CardContent, { CARDS } from "./CardContent";

/**
 * Continuous Progress — scroll-linked transforms with zero discrete snaps.
 * Each card's translateY is a direct function of scroll progress.
 * No CSS transitions, no threshold breakpoints, no class toggles.
 * Visual state exactly equals scroll state at all times.
 *
 * Tests: whether eliminating all transition delays and discrete snaps
 * removes the stall entirely and provides perfect scroll-to-visual tracking.
 */

function getTranslateY(index: number, progress: number): number {
  const n = CARDS.length;
  const band = 1 / n;
  const start = index * band;
  const end = (index + 1) * band;

  if (progress <= start) return 100;
  if (progress >= end) return -100;

  const t = (progress - start) / band;
  const enterEnd = 0.15;
  const exitStart = 0.85;

  if (t <= enterEnd) return 100 * (1 - t / enterEnd);
  if (t >= exitStart) return -100 * ((t - exitStart) / (1 - exitStart));
  return 0;
}

export default function ContinuousProgress() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const panelRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    let rafId = 0;

    const tick = () => {
      const max = el.scrollHeight - el.clientHeight;
      const progress = max > 0 ? el.scrollTop / max : 0;

      for (let i = 0; i < CARDS.length; i++) {
        const panel = panelRefs.current[i];
        if (!panel) continue;
        const ty = getTranslateY(i, progress);
        panel.style.transform = `translateY(${ty}%)`;
      }

      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return (
    <div ref={scrollRef} className="sl-continuous">
      <div className="sl-continuous__track">
        <div className="sl-continuous__inner">
          {CARDS.map((card, i) => (
            <div
              key={card.id}
              ref={(el) => { panelRefs.current[i] = el; }}
              className="sl-continuous__panel"
              style={{ transform: "translateY(100%)" }}
            >
              <CardContent card={card} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
