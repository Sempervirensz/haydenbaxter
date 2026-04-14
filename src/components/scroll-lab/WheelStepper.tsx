"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import CardContent, { CARDS } from "./CardContent";

/**
 * Wheel Stepper — discrete event-driven card navigation.
 * Each wheel gesture advances exactly one card. No continuous scroll.
 * CSS transition animates between cards. Debounced to prevent rapid skipping.
 *
 * Tests: whether taking full control of scroll routing and using
 * discrete steps feels more intentional than continuous scroll models.
 */
const COOLDOWN_MS = 650;

export default function WheelStepper() {
  const [activeIndex, setActiveIndex] = useState(0);
  const cooldownRef = useRef(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const advance = useCallback((direction: 1 | -1) => {
    if (cooldownRef.current) return;

    setActiveIndex((prev) => {
      const next = prev + direction;
      if (next < 0 || next >= CARDS.length) return prev;
      cooldownRef.current = true;
      setTimeout(() => { cooldownRef.current = false; }, COOLDOWN_MS);
      return next;
    });
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      advance(e.deltaY > 0 ? 1 : -1);
    };

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown" || e.key === " ") {
        e.preventDefault();
        advance(1);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        advance(-1);
      }
    };

    el.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("keydown", onKeyDown);
    return () => {
      el.removeEventListener("wheel", onWheel);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [advance]);

  return (
    <div ref={containerRef} className="sl-stepper">
      {CARDS.map((card, i) => (
        <div
          key={card.id}
          className={`sl-stepper__panel ${
            i === activeIndex ? "is-active" : ""
          } ${i < activeIndex ? "is-past" : ""}`}
        >
          <CardContent card={card} />
        </div>
      ))}

      <div className="sl-stepper__hint">Scroll or arrow keys to navigate</div>

      <div className="sl-stepper__nav">
        {CARDS.map((_, i) => (
          <button
            key={i}
            className={`sl-stepper__dot ${i === activeIndex ? "is-active" : ""}`}
            onClick={() => {
              cooldownRef.current = false;
              setActiveIndex(i);
            }}
            aria-label={`Go to card ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
