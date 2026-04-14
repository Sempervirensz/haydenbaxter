"use client";

import { useEffect, useRef } from "react";
import { CARDS } from "./CardContent";

const MORPH_DATA = CARDS.map((c) => ({
  id: c.id,
  num: c.num,
  name: c.name,
  desc:
    c.screen.type === "full"
      ? c.screen.full.caption
      : c.screen.type === "consulting"
        ? c.screen.consulting.heroSubtitle
        : c.screen.type === "emerging-tech-builds"
          ? c.screen.etb.intro
          : "End-to-end supply chain operations and sourcing",
  accent: c.accent,
}));

/**
 * Morphing Panel — one card on screen that transforms into the next.
 * No sliding, no stacking. Card number, name, description, and accent
 * color all interpolate smoothly between states as you scroll.
 * Only ever ONE card visible — it morphs into the next identity.
 */

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

function lerpColor(a: string, b: string, t: number): string {
  const pa = [parseInt(a.slice(1, 3), 16), parseInt(a.slice(3, 5), 16), parseInt(a.slice(5, 7), 16)];
  const pb = [parseInt(b.slice(1, 3), 16), parseInt(b.slice(3, 5), 16), parseInt(b.slice(5, 7), 16)];
  const r = Math.round(lerp(pa[0], pb[0], t));
  const g = Math.round(lerp(pa[1], pb[1], t));
  const bl = Math.round(lerp(pa[2], pb[2], t));
  return `rgb(${r},${g},${bl})`;
}

export default function MorphPanel() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const numRef = useRef<HTMLSpanElement>(null);
  const nameRef = useRef<HTMLHeadingElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);
  const accentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    let rafId = 0;
    let lastIdx = -1;

    const tick = () => {
      const max = el.scrollHeight - el.clientHeight;
      const progress = max > 0 ? el.scrollTop / max : 0;

      const n = MORPH_DATA.length;
      const scaled = progress * (n - 1);
      const idx = Math.min(Math.floor(scaled), n - 2);
      const t = scaled - idx;
      const from = MORPH_DATA[idx];
      const to = MORPH_DATA[Math.min(idx + 1, n - 1)];

      if (numRef.current) {
        const numVal = lerp(parseInt(from.num), parseInt(to.num), t);
        numRef.current.textContent = `${String(Math.round(numVal)).padStart(2, "0")} / 04`;
      }

      if (nameRef.current && Math.floor(scaled) !== lastIdx) {
        lastIdx = Math.floor(scaled);
        const closest = t < 0.5 ? from : to;
        nameRef.current.textContent = closest.name;
      }

      if (descRef.current) {
        const closest = t < 0.5 ? from : to;
        descRef.current.textContent = closest.desc;
      }

      if (accentRef.current) {
        accentRef.current.style.background = lerpColor(from.accent, to.accent, t);
      }

      if (cardRef.current) {
        const pulse = 1 + Math.sin(t * Math.PI) * 0.008;
        cardRef.current.style.transform = `scale(${pulse})`;
      }

      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

  const first = MORPH_DATA[0];

  return (
    <div ref={scrollRef} className="sl-morph">
      <div className="sl-morph__track">
        <div className="sl-morph__inner">
          <div ref={cardRef} className="sl-morph__card" style={{ "--card-accent": first.accent } as React.CSSProperties}>
            <div ref={accentRef} className="sl-morph__accent" style={{ background: first.accent }} />
            <div className="sl-morph__body">
              <span ref={numRef} className="sl-morph__num">{first.num} / 04</span>
              <h2 ref={nameRef} className="sl-morph__name">{first.name}</h2>
              <p ref={descRef} className="sl-morph__desc">{first.desc}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
