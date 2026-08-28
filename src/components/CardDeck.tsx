"use client";

import { useCallback, useEffect, useState } from "react";
import { CARDS } from "@/data/cards";
import { useScrollProgress } from "@/hooks/useScrollProgress";
import PlayingCard from "./PlayingCard";

// Optional `onRevealedChange` reports how many cards are currently face-up, and
// WHICH ones — the second argument carries the set of face-up card ids, so a
// caller can render one marker per specific card rather than a running total.
// It is additive: callers that only take `count` are unaffected.
//
// Optional `progressOverride` replaces the SOURCE of the unveil progress without
// touching the transform maths in PlayingCard. Omitted (the homepage), the deck
// reads `useScrollProgress` exactly as before. Supplied, the deck uses the given
// value — a single number for all four cards, or one per card, which is what a
// staggered deal needs. Added for /lab/card-entry-motion so the motion options
// can be compared against the real deck instead of a reconstruction; the hook is
// still called unconditionally, so hook order is unchanged either way.
export default function CardDeck({
  onRevealedChange,
  progressOverride,
}: {
  onRevealedChange?: (count: number, flipped: ReadonlySet<number>) => void;
  progressOverride?: number | readonly number[] | null;
} = {}) {
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

  useEffect(() => {
    onRevealedChange?.(flippedCards.size, flippedCards);
  }, [flippedCards, onRevealedChange]);

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

  // `progressOverride` absent (the homepage) → the scroll hook, unchanged.
  const resolveProgress = (index: number): number => {
    if (progressOverride == null) return progress;
    if (typeof progressOverride === "number") return progressOverride;
    return progressOverride[index] ?? progress;
  };

  return (
    <div className="flex flex-col items-center">
      {/* Card row */}
      <div
        ref={ref}
        className="flex justify-center items-end gap-1 sm:gap-3 lg:gap-6 pb-4 sm:pb-2 px-2 sm:px-3 lg:px-4"
      >
        {CARDS.map((card, index) => (
          <PlayingCard
            key={card.id}
            card={card}
            isFlipped={flippedCards.has(card.id)}
            showCaption={!isMobile && flippedCards.has(card.id)}
            onFlip={() => handleFlip(card.id)}
            scrollProgress={resolveProgress(index)}
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
            <h2
              className="card-caption__title font-bold tracking-wider"
              style={{
                color: activeCard.color === "red" ? "#b91c1c" : "#ffffff",
                fontFamily: "var(--font-serif)",
              }}
            >
              {activeCard.title}
            </h2>
            <p
              className="card-caption__desc card-caption__desc--deck mt-0.5"
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
