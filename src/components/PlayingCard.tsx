"use client";

import type { CardData } from "@/data/cards";
import CardBack from "./CardBack";
import CardFront from "./CardFront";
import Tooltip from "./Tooltip";

interface PlayingCardProps {
  card: CardData;
  isFlipped: boolean;
  onFlip: () => void;
  scrollProgress: number;
}

function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

function computeTransform(
  progress: number,
  bunched: CardData["bunchedTransform"],
  isFlipped: boolean
): string {
  const t = easeOutCubic(Math.min(Math.max(progress, 0), 1));
  const tx = bunched.translateX * (1 - t);
  const ty = bunched.translateY * (1 - t);
  const rot = bunched.rotate * (1 - t);
  const sc = bunched.scale + (1 - bunched.scale) * t;
  const flipY = isFlipped ? 180 : 0;
  return `translateX(${tx}px) translateY(${ty}px) rotate(${rot}deg) scale(${sc}) rotateY(${flipY}deg)`;
}

export default function PlayingCard({
  card,
  isFlipped,
  onFlip,
  scrollProgress,
}: PlayingCardProps) {
  const transform = computeTransform(
    scrollProgress,
    card.bunchedTransform,
    isFlipped
  );

  return (
    <div className="card-perspective-wrapper">
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
  );
}
