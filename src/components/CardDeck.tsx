"use client";

import { useCallback, useState } from "react";
import { CARDS } from "@/data/cards";
import { useScrollProgress } from "@/hooks/useScrollProgress";
import PlayingCard from "./PlayingCard";

export default function CardDeck() {
  const [flippedCards, setFlippedCards] = useState<Set<number>>(new Set());
  const { ref, progress } = useScrollProgress();

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
  }, []);

  return (
    <div
      ref={ref}
      className="flex justify-center items-end gap-4 md:gap-6 pb-8"
    >
      {CARDS.map((card) => (
        <PlayingCard
          key={card.id}
          card={card}
          isFlipped={flippedCards.has(card.id)}
          onFlip={() => handleFlip(card.id)}
          scrollProgress={progress}
        />
      ))}
    </div>
  );
}
