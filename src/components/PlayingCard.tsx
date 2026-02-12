"use client";

import { useEffect, useRef, useState } from "react";
import type { CardData } from "@/data/cards";
import CardBack from "./CardBack";
import CardFront from "./CardFront";
import Tooltip from "./Tooltip";

const DESKTOP_CARD_WIDTH = 280;

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

function computeTransform(
  progress: number,
  bunched: CardData["bunchedTransform"],
  isFlipped: boolean,
  scale: number
): string {
  const t = easeOutCubic(Math.min(Math.max(progress, 0), 1));
  const tx = bunched.translateX * scale * (1 - t);
  const ty = bunched.translateY * scale * (1 - t);
  const rot = bunched.rotate * (1 - t);
  const sc = bunched.scale + (1 - bunched.scale) * t;
  const flipY = isFlipped ? 180 : 0;
  return `translateX(${tx}px) translateY(${ty}px) rotate(${rot}deg) scale(${sc}) rotateY(${flipY}deg)`;
}

export default function PlayingCard({
  card,
  isFlipped,
  showCaption,
  onFlip,
  scrollProgress,
}: PlayingCardProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
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

  const transform = computeTransform(
    scrollProgress,
    card.bunchedTransform,
    isFlipped,
    transformScale
  );

  const isRed = card.color === "red";
  const textColor = isRed ? "#b91c1c" : "#ffffff";

  return (
    <div className="card-column">
      <div ref={wrapperRef} className="card-perspective-wrapper">
        <div className="card-hover-wrapper" onClick={onFlip}>
          <Tooltip visible={!isFlipped} color={card.color} />
          <div className="card-inner" style={{ transform }}>
            {/* Front face — the card back design (initially visible) */}
            <div className="card-face card-front">
              <CardBack variant={card.backVariant} />
            </div>
            {/* Back face — the card content (revealed on flip) */}
            <div className="card-face card-back">
              <CardFront card={card} />
            </div>
          </div>
        </div>
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
        <h3
          className="text-xs font-bold tracking-wider leading-tight"
          style={{
            color: textColor,
            fontFamily: "var(--font-serif)",
          }}
        >
          {card.title}
        </h3>
        <p
          className="text-[10px] mt-0.5 text-white/60 leading-tight"
          style={{ fontFamily: "var(--font-sans)" }}
        >
          {card.description}
        </p>
      </div>
    </div>
  );
}
