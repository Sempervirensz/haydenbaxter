"use client";

import { useEffect, useRef } from "react";
import CardContent, { CARDS } from "./CardContent";

/**
 * Horizontal Swipe — scroll-driven cross-axis card peel.
 * Vertical scroll input drives horizontal card motion.
 * The active card peels away to the left as you scroll down,
 * revealing the next card from the right. Creates a surprising
 * directional tension between input and output.
 */

function getTranslateX(index: number, progress: number): number {
  const n = CARDS.length;
  const band = 1 / n;
  const start = index * band;
  const end = (index + 1) * band;

  if (progress <= start) return 100;
  if (progress >= end) return -100;

  const t = (progress - start) / band;
  const enterEnd = 0.12;
  const exitStart = 0.88;

  if (t <= enterEnd) return 100 * (1 - t / enterEnd);
  if (t >= exitStart) return -100 * ((t - exitStart) / (1 - exitStart));
  return 0;
}

export default function HorizontalSwipe() {
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
        const tx = getTranslateX(i, progress);
        panel.style.transform = `translateX(${tx}%)`;
        panel.style.opacity = String(Math.abs(tx) > 80 ? 0 : 1);
      }

      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return (
    <div ref={scrollRef} className="sl-hswipe">
      <div className="sl-hswipe__track">
        <div className="sl-hswipe__inner">
          {CARDS.map((card, i) => (
            <div
              key={card.id}
              ref={(el) => { panelRefs.current[i] = el; }}
              className="sl-hswipe__panel"
              style={{ transform: i === 0 ? "translateX(0)" : "translateX(100%)" }}
            >
              <CardContent card={card} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
