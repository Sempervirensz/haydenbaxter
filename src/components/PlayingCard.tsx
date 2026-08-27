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
  scrollProgress: number | null;
}

export default function PlayingCard({
  card,
  isFlipped,
  showCaption,
  onFlip,
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

  const flipTransform = `rotateY(${isFlipped ? 180 : 0}deg)`;

  const isRed = card.color === "red";
  const textColor = isRed ? "#8f1414" : "#ffffff";

  // Bunched geometry handed to CSS. --unveil is written once per frame on the
  // deck container by useScrollProgress; the transform below is the exact
  // algebra computeUnveilTransform used, evaluated by the style engine.
  const vars = {
    "--bx": card.bunchedTransform.translateX,
    "--by": card.bunchedTransform.translateY,
    "--br": card.bunchedTransform.rotate,
    "--bs": card.bunchedTransform.scale,
    "--cscale": transformScale,
  } as React.CSSProperties;

  return (
    <div className="card-column">
      <div className="card-perspective-wrapper card-perspective-wrapper--cssvar" style={vars}>
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
            <div className="card-face card-front">
              <CardBack variant={card.backVariant} />
            </div>
            <div className="card-face card-back">
              <CardFront card={card} />
            </div>
          </div>
        </button>
      </div>
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
          style={{ color: textColor, fontFamily: "var(--font-serif)" }}
        >
          {card.title}
        </h2>
        <p className="card-caption__desc mt-0.5" style={{ fontFamily: "var(--font-sans)" }}>
          {card.description}
        </p>
      </div>
    </div>
  );
}
