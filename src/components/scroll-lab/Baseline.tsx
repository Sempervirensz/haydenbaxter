"use client";

import { useEffect, useRef, useState } from "react";
import CardContent, { CARDS } from "./CardContent";

/**
 * Baseline — reproduces the production scroll system.
 * Tall section → sticky inner → RAF progress → threshold breakpoints →
 * CSS transition (900ms) between discrete states.
 *
 * Known issue: the last card's dead zone + the 900ms transition create
 * a stall-then-jump on upward reversal. That's what we're comparing against.
 */
const BREAKS = [0.15, 0.4, 0.65, 0.88];

export default function Baseline() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [screenIndex, setScreenIndex] = useState(0);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    let rafId = 0;
    let last = 0;

    const tick = () => {
      const max = el.scrollHeight - el.clientHeight;
      const progress = max > 0 ? el.scrollTop / max : 0;

      let idx = 0;
      for (let i = 0; i < BREAKS.length; i++) {
        if (progress >= BREAKS[i]) idx = i;
      }

      if (idx !== last) {
        last = idx;
        setScreenIndex(idx);
      }
      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return (
    <div ref={scrollRef} className="sl-baseline">
      <div className="sl-baseline__track">
        <div className="sl-baseline__inner">
          {CARDS.map((card, i) => (
            <div
              key={card.id}
              className={`sl-baseline__panel ${
                i === screenIndex ? "is-active" : ""
              } ${i < screenIndex ? "is-past" : ""}`}
            >
              <CardContent card={card} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
