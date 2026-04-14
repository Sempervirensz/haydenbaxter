"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import CardContent, { CARDS } from "./CardContent";

/**
 * Drag / Throw — physics-based card flicking.
 * Grab a card and drag it up to fling it away, revealing the next.
 * Pull down to bring the previous card back. Momentum-based.
 * Feels like handling real cards.
 */

const THROW_THRESHOLD = 80;
const VELOCITY_THRESHOLD = 0.4;

export default function DragThrow() {
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const panelRefs = useRef<(HTMLDivElement | null)[]>([]);
  const dragging = useRef(false);
  const startY = useRef(0);
  const currentY = useRef(0);
  const lastTime = useRef(0);
  const velocity = useRef(0);

  const applyTransform = useCallback((dragOffset: number) => {
    const panel = panelRefs.current[activeIndex];
    if (panel) {
      panel.style.transition = "none";
      panel.style.transform = `translateY(${dragOffset}px)`;
      const absFrac = Math.min(Math.abs(dragOffset) / 300, 1);
      panel.style.opacity = String(1 - absFrac * 0.4);
    }
  }, [activeIndex]);

  const settle = useCallback((dragOffset: number, vel: number) => {
    const panel = panelRefs.current[activeIndex];
    const shouldAdvance =
      (dragOffset < -THROW_THRESHOLD || vel < -VELOCITY_THRESHOLD) &&
      activeIndex < CARDS.length - 1;
    const shouldRetreat =
      (dragOffset > THROW_THRESHOLD || vel > VELOCITY_THRESHOLD) &&
      activeIndex > 0;

    if (panel) {
      panel.style.transition = "transform 400ms cubic-bezier(0.22,0.61,0.36,1), opacity 400ms ease";
    }

    if (shouldAdvance) {
      if (panel) {
        panel.style.transform = "translateY(-120%)";
        panel.style.opacity = "0";
      }
      setTimeout(() => {
        setActiveIndex((p) => Math.min(p + 1, CARDS.length - 1));
      }, 200);
    } else if (shouldRetreat) {
      if (panel) {
        panel.style.transform = "translateY(120%)";
        panel.style.opacity = "0";
      }
      setTimeout(() => {
        setActiveIndex((p) => Math.max(p - 1, 0));
      }, 200);
    } else {
      if (panel) {
        panel.style.transform = "translateY(0)";
        panel.style.opacity = "1";
      }
    }
  }, [activeIndex]);

  useEffect(() => {
    panelRefs.current.forEach((panel, i) => {
      if (!panel) return;
      if (i === activeIndex) {
        panel.style.transition = "transform 350ms ease, opacity 350ms ease";
        panel.style.transform = "translateY(0)";
        panel.style.opacity = "1";
      } else {
        panel.style.transition = "none";
        panel.style.transform = i < activeIndex ? "translateY(-120%)" : "translateY(120%)";
        panel.style.opacity = "0";
      }
    });
  }, [activeIndex]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const onPointerDown = (e: PointerEvent) => {
      dragging.current = true;
      startY.current = e.clientY;
      currentY.current = e.clientY;
      lastTime.current = Date.now();
      velocity.current = 0;
      el.setPointerCapture(e.pointerId);
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!dragging.current) return;
      const now = Date.now();
      const dt = now - lastTime.current;
      const dy = e.clientY - currentY.current;
      if (dt > 0) velocity.current = dy / dt;
      currentY.current = e.clientY;
      lastTime.current = now;
      applyTransform(e.clientY - startY.current);
    };

    const onPointerUp = () => {
      if (!dragging.current) return;
      dragging.current = false;
      settle(currentY.current - startY.current, velocity.current);
    };

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const vel = e.deltaY > 0 ? -VELOCITY_THRESHOLD - 0.1 : VELOCITY_THRESHOLD + 0.1;
      settle(e.deltaY > 0 ? -THROW_THRESHOLD - 1 : THROW_THRESHOLD + 1, vel);
    };

    el.addEventListener("pointerdown", onPointerDown);
    el.addEventListener("pointermove", onPointerMove);
    el.addEventListener("pointerup", onPointerUp);
    el.addEventListener("pointercancel", onPointerUp);
    el.addEventListener("wheel", onWheel, { passive: false });

    return () => {
      el.removeEventListener("pointerdown", onPointerDown);
      el.removeEventListener("pointermove", onPointerMove);
      el.removeEventListener("pointerup", onPointerUp);
      el.removeEventListener("pointercancel", onPointerUp);
      el.removeEventListener("wheel", onWheel);
    };
  }, [applyTransform, settle]);

  return (
    <div ref={containerRef} className="sl-drag" style={{ touchAction: "none" }}>
      {CARDS.map((card, i) => (
        <div
          key={card.id}
          ref={(el) => { panelRefs.current[i] = el; }}
          className="sl-drag__panel"
          style={{
            transform: i === 0 ? "translateY(0)" : "translateY(120%)",
            opacity: i === 0 ? 1 : 0,
          }}
        >
          <CardContent card={card} />
        </div>
      ))}
      <div className="sl-drag__hint">Drag cards up to advance · down to go back</div>
      <div className="sl-stepper__nav">
        {CARDS.map((_, i) => (
          <button
            key={i}
            className={`sl-stepper__dot ${i === activeIndex ? "is-active" : ""}`}
            onClick={() => setActiveIndex(i)}
            aria-label={`Go to card ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
