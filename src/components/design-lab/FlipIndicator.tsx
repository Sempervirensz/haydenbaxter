"use client";

// Flip indicator — four mini cards between the deck and the entry choice, one
// per playing card, in deck order.
//
// Face-down is an empty outline the shape of the deck above; face-up fills with
// card stock and the card's own rank and suit appear. Completion is carried by
// that SHAPE change, not by colour — the marks stay legible in greyscale and to
// colour-blind visitors. Colour only says which card.
//
// Passive by construction: no handlers, `pointer-events: none`, and the row is
// hidden from assistive tech in favour of one sentence stating the count, which
// the gate's `aria-live` region announces as each card turns.
//
// State comes from `CardDeck` via the gate — this renders it, it does not track
// it. There is deliberately no second source of progress truth.

import { CARDS } from "@/data/cards";
import { DECK_SIZE } from "@/data/entryChoice";

const SUIT_GLYPH: Record<string, string> = {
  club: "♣",
  heart: "♥",
  diamond: "♦",
  spade: "♠",
};

export default function FlipIndicator({ flipped }: { flipped: ReadonlySet<number> }) {
  return (
    <div className="dlab-soft__ind">
      <span className="dlab-soft__indRow" aria-hidden="true">
        {CARDS.slice(0, DECK_SIZE).map((card) => (
          <span
            key={card.id}
            className={`dlab-soft__mark ${flipped.has(card.id) ? "is-on" : ""}`}
            data-color={card.color}
          >
            <b className="dlab-soft__markRank">{card.rank}</b>
            <b className="dlab-soft__markPip">{SUIT_GLYPH[card.suit]}</b>
          </span>
        ))}
      </span>

      <span className="dlab-soft__srOnly">
        {flipped.size} of {DECK_SIZE} cards flipped
      </span>
    </div>
  );
}
