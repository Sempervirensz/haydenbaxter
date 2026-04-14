"use client";

import { useEffect, useRef } from "react";
import CardContent, { CARDS } from "./CardContent";

/**
 * Depth Stack — cards layered in Z-space.
 * The front card shrinks + fades as you scroll, revealing the next card
 * scaling up from behind. Reversing pulls the top card back toward you.
 * Feels like looking through a deck of cards in depth.
 */

function getCardStyle(index: number, progress: number) {
  const n = CARDS.length;
  const band = 1 / n;
  const start = index * band;
  const end = (index + 1) * band;

  const t = Math.max(0, Math.min(1, (progress - start) / band));

  const enterEnd = 0.1;
  const exitStart = 0.9;

  let scale: number;
  let opacity: number;
  let z: number;

  if (progress < start) {
    scale = 0.75;
    opacity = 0;
    z = -1;
  } else if (progress >= end) {
    scale = 1.15;
    opacity = 0;
    z = index;
  } else if (t <= enterEnd) {
    const e = t / enterEnd;
    scale = 0.75 + 0.25 * e;
    opacity = e;
    z = index;
  } else if (t >= exitStart) {
    const e = (t - exitStart) / (1 - exitStart);
    scale = 1 + 0.15 * e;
    opacity = 1 - e;
    z = index;
  } else {
    scale = 1;
    opacity = 1;
    z = index;
  }

  return {
    transform: `scale(${scale})`,
    opacity,
    zIndex: Math.round(z * 10),
  };
}

export default function DepthStack() {
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
        const s = getCardStyle(i, progress);
        panel.style.transform = s.transform;
        panel.style.opacity = String(s.opacity);
        panel.style.zIndex = String(s.zIndex);
      }

      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return (
    <div ref={scrollRef} className="sl-depth">
      <div className="sl-depth__track">
        <div className="sl-depth__inner">
          {CARDS.map((card, i) => (
            <div
              key={card.id}
              ref={(el) => { panelRefs.current[i] = el; }}
              className="sl-depth__panel"
              style={{ opacity: i === 0 ? 1 : 0, transform: i === 0 ? "scale(1)" : "scale(0.75)" }}
            >
              <CardContent card={card} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
