"use client";

import { useEffect, useRef, useState } from "react";
import type { CardData } from "@/data/cards";
import { DESKTOP_CARD_WIDTH, resolveDealScale } from "@/data/entryMotion";
import CardBack from "./CardBack";
import CardFront from "./CardFront";
import Tooltip from "./Tooltip";

// Card width the bunched pose is authored against, and the throw floor that
// keeps that pose legible once the card shrinks — both in src/data/entryMotion.ts.

interface PlayingCardProps {
  card: CardData;
  isFlipped: boolean;
  showCaption: boolean;
  onFlip: () => void;
  scrollProgress: number;
}

function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

function computeUnveilTransform(
  progress: number,
  bunched: CardData["bunchedTransform"],
  scale: number
): string {
  const t = easeOutCubic(Math.min(Math.max(progress, 0), 1));
  // Floored: a phone-sized card would otherwise scale the throw down to nothing.
  const throwScale = resolveDealScale(scale * DESKTOP_CARD_WIDTH);
  const tx = bunched.translateX * throwScale * (1 - t);
  const ty = bunched.translateY * throwScale * (1 - t);
  const rot = bunched.rotate * (1 - t);
  const sc = bunched.scale + (1 - bunched.scale) * t;
  return `translateX(${tx}px) translateY(${ty}px) rotate(${rot}deg) scale(${sc})`;
}

export default function PlayingCard({
  card,
  isFlipped,
  showCaption,
  onFlip,
  scrollProgress,
}: PlayingCardProps) {
  const wrapperRef = useRef<HTMLButtonElement>(null);
  const [transformScale, setTransformScale] = useState(1);

  useEffect(() => {
    const updateScale = () => {
      if (wrapperRef.current) {
        const actualWidth = wrapperRef.current.offsetWidth;
        setTransformScale(actualWidth / DESKTOP_CARD_WIDTH);
      }
    };
    updateScale();
    window.addEventListener("resize", updateScale);
    return () => window.removeEventListener("resize", updateScale);
  }, []);

  const unveilTransform = computeUnveilTransform(
    scrollProgress,
    card.bunchedTransform,
    transformScale
  );
  const flipTransform = `rotateY(${isFlipped ? 180 : 0}deg)`;

  const isRed = card.color === "red";
  // #b91c1c measured 3.06:1 on the card face at 12.2px — under AA (4.5:1).
  // Darkened only the red; the suit colour reads the same at this size.
  const textColor = isRed ? "#8f1414" : "#ffffff";

  return (
    <div className="card-column">
      <div className="card-perspective-wrapper" style={{ transform: unveilTransform }}>
        <button
          ref={wrapperRef}
          type="button"
          className="card-hover-wrapper"
          onClick={onFlip}
          aria-label={`${card.title} — flip card`}
          aria-pressed={isFlipped}
        >
          <Tooltip visible={!isFlipped} color={card.color} />
          <div className="card-inner" style={{ transform: flipTransform }}>
            {/* Front face — the card back design (initially visible) */}
            <div className="card-face card-front">
              <CardBack variant={card.backVariant} />
            </div>
            {/* Back face — the card content (revealed on flip) */}
            <div className="card-face card-back">
              <CardFront card={card} />
            </div>
          </div>
        </button>
      </div>
      {/* Caption below card — desktop only (mobile uses shared caption in CardDeck) */}
      <div
        className="card-caption hidden sm:block"
        style={{
          opacity: showCaption ? 1 : 0,
          transform: showCaption ? "translateY(0)" : "translateY(-8px)",
          pointerEvents: showCaption ? "auto" : "none",
        }}
      >
        <h2
          className="card-caption__title font-bold tracking-wider leading-tight"
          style={{
            color: textColor,
            fontFamily: "var(--font-serif)",
          }}
        >
          {card.title}
        </h2>
        <p
          className="card-caption__desc mt-0.5"
          style={{ fontFamily: "var(--font-sans)" }}
        >
          {card.description}
        </p>
      </div>
    </div>
  );
}
