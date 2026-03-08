"use client";

import { useCallback, useEffect, useState } from "react";
import { CARDS } from "@/data/cards";
import { useScrollProgress } from "@/hooks/useScrollProgress";
import PlayingCard from "./PlayingCard";

export default function CardDeck() {
  const [flippedCards, setFlippedCards] = useState<Set<number>>(new Set());
  const [lastFlippedId, setLastFlippedId] = useState<number | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const { ref, progress } = useScrollProgress();

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const handleFlip = useCallback((cardId: number) => {
    setFlippedCards((prev) => {
      const next = new Set(prev);
      if (next.has(cardId)) {
        next.delete(cardId);
      } else {
        next.add(cardId);
      }
      return next;
    });
    // Track the last card that was flipped TO face-up
    setLastFlippedId((prev) => (prev === cardId ? null : cardId));
  }, []);

  // Find the active card for the mobile shared caption
  const activeCard =
    lastFlippedId !== null && flippedCards.has(lastFlippedId)
      ? CARDS.find((c) => c.id === lastFlippedId) ?? null
      : null;
  const showMobileCaption = isMobile && activeCard !== null;

  return (
    <div className="flex flex-col items-center">
      {/* Card row */}
      <div
        ref={ref}
        className="flex justify-center items-end gap-1 sm:gap-3 md:gap-6 pb-4 sm:pb-8 px-2 sm:px-4"
      >
        {CARDS.map((card) => (
          <PlayingCard
            key={card.id}
            card={card}
            isFlipped={flippedCards.has(card.id)}
            showCaption={!isMobile && flippedCards.has(card.id)}
            onFlip={() => handleFlip(card.id)}
            scrollProgress={progress}
          />
        ))}
      </div>

      {/* Shared mobile caption — centered below the entire card row */}
      <div
        className="sm:hidden text-center px-6 h-14 flex flex-col items-center justify-start transition-all duration-500"
        aria-live="polite"
        style={{
          opacity: showMobileCaption ? 1 : 0,
          transform: showMobileCaption ? "translateY(0)" : "translateY(-6px)",
          pointerEvents: showMobileCaption ? "auto" : "none",
        }}
      >
        {activeCard && (
          <>
            <h3
              className="text-xs font-bold tracking-wider"
              style={{
                color: activeCard.color === "red" ? "#b91c1c" : "#ffffff",
                fontFamily: "var(--font-serif)",
              }}
            >
              {activeCard.title}
            </h3>
            <p
              className="text-[10px] mt-0.5 text-white/60 max-w-[260px]"
              style={{ fontFamily: "var(--font-sans)" }}
            >
              {activeCard.description}
            </p>
          </>
        )}
      </div>
    </div>
  );
}
