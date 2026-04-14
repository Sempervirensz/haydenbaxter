"use client";

import { useEffect, useRef } from "react";
import CardContent, { CARDS } from "./CardContent";

/**
 * Carousel Wheel — cards on a 3D vertical cylinder.
 * Scrolling rotates the cylinder. The active card faces forward,
 * adjacent cards curve away with perspective. Pairs with the
 * CD-player aesthetic already on the site.
 */

const CARD_ANGLE = 360 / CARDS.length;

export default function CarouselWheel() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const wheelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = scrollRef.current;
    const wheel = wheelRef.current;
    if (!el || !wheel) return;

    let rafId = 0;

    const tick = () => {
      const max = el.scrollHeight - el.clientHeight;
      const progress = max > 0 ? el.scrollTop / max : 0;
      const totalRotation = progress * CARD_ANGLE * (CARDS.length - 1);
      wheel.style.transform = `rotateX(${totalRotation}deg)`;
      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return (
    <div ref={scrollRef} className="sl-carousel">
      <div className="sl-carousel__track">
        <div className="sl-carousel__stage">
          <div ref={wheelRef} className="sl-carousel__wheel">
            {CARDS.map((card, i) => (
              <div
                key={card.id}
                className="sl-carousel__face"
                style={{
                  transform: `rotateX(${-i * CARD_ANGLE}deg) translateZ(var(--carousel-radius))`,
                }}
              >
                <CardContent card={card} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
