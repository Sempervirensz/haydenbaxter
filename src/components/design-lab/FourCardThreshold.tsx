"use client";

// Experiment 01 — Four-Card Threshold.
// Four identity cards form a refined entry. The visitor reveals each (flip), and
// once all four are face-up the experience "opens". Reuses the production
// PlayingCard so the visual + flip match the homepage deck; scrollProgress={1}
// holds the cards in their spread (un-bunched) position. Reveal is one-way — a
// threshold, not a toggle.

import { useCallback, useState } from "react";
import { CARDS } from "@/data/cards";
import PlayingCard from "@/components/PlayingCard";

export default function FourCardThreshold() {
  const [revealed, setRevealed] = useState<Set<number>>(new Set());
  const [lastRevealed, setLastRevealed] = useState<number | null>(null);

  const reveal = useCallback((id: number) => {
    setRevealed((prev) => {
      if (prev.has(id)) return prev;
      const next = new Set(prev);
      next.add(id);
      return next;
    });
    setLastRevealed(id);
  }, []);

  const count = revealed.size;
  const total = CARDS.length;
  const open = count === total;
  const activeCard = lastRevealed !== null ? CARDS.find((c) => c.id === lastRevealed) ?? null : null;

  return (
    <section className={`dlab-thresh ${open ? "is-open" : ""}`} aria-labelledby="dlab-thresh-title">
      <header className="dlab-thresh__head">
        <p className="dlab-thresh__kicker">Experiment 01 · Threshold</p>
        <h2 id="dlab-thresh-title" className="dlab-thresh__title">
          Four cards. One operating system.
        </h2>
        <p className="dlab-thresh__instruction" aria-live="polite">
          {open ? "The system is open." : "Reveal each card to continue."}
        </p>

        <div className="dlab-thresh__meter" role="img" aria-label={`${count} of ${total} revealed`}>
          {CARDS.map((c) => (
            <span key={c.id} className={`dlab-thresh__pip ${revealed.has(c.id) ? "is-on" : ""}`} />
          ))}
        </div>
      </header>

      <div className="dlab-thresh__row">
        {CARDS.map((card) => (
          <PlayingCard
            key={card.id}
            card={card}
            isFlipped={revealed.has(card.id)}
            showCaption={revealed.has(card.id)}
            onFlip={() => reveal(card.id)}
            scrollProgress={1}
          />
        ))}
      </div>

      {/* Shared caption for mobile (PlayingCard hides its own below sm). */}
      <div className="dlab-thresh__mobileCaption sm:hidden" aria-live="polite">
        {activeCard && (
          <>
            <h3 style={{ color: activeCard.color === "red" ? "#b91c1c" : "#fff" }}>{activeCard.title}</h3>
            <p>{activeCard.description}</p>
          </>
        )}
      </div>

      {/* Completion — the threshold clears. */}
      <div className="dlab-thresh__open" aria-hidden={!open}>
        <span className="dlab-thresh__openLabel">The system is open</span>
        <a href="/" className="dlab-thresh__enter">
          Enter the site <span aria-hidden="true">→</span>
        </a>
      </div>
    </section>
  );
}
