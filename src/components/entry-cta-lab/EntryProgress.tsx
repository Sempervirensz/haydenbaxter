"use client";

// Flip indicator — four markers between the deck and the route choice, one per
// card, in deck order.
//
// Three designs share this component and this DOM; only the class changes, so a
// design cannot win by also occupying different space. The markers are passive:
// no handlers, `pointer-events: none`, and the whole row is hidden from
// assistive tech in favour of one sentence that states the count.
//
// Completion is never carried by colour alone. Each design changes SHAPE as well
// — an outline becomes a face-up card, a ring becomes a solid disc, an empty
// square fills — so the state survives greyscale and colour-blindness.

import { CARDS } from "@/data/cards";
import {
  DECK_SIZE,
  DEFAULT_INDICATOR,
  type IndicatorDesign,
} from "@/data/entryCtaLab";

const SUIT_GLYPH: Record<string, string> = {
  club: "♣",
  heart: "♥",
  diamond: "♦",
  spade: "♠",
};

export default function EntryProgress({
  design = DEFAULT_INDICATOR,
  flipped,
}: {
  design?: IndicatorDesign;
  /** Face-up card ids, straight from CardDeck. */
  flipped: ReadonlySet<number>;
}) {
  return (
    <div className={`ecta__ind ecta__ind--${design}`}>
      <span className="ecta__indRow" aria-hidden="true">
        {CARDS.slice(0, DECK_SIZE).map((card) => (
          <span
            key={card.id}
            className={`ecta__mark ${flipped.has(card.id) ? "is-on" : ""}`}
            data-suit={card.suit}
            data-color={card.color}
          >
            {/* Rank and pip only surface in the mini-card design, but they are
                rendered in all three so the DOM stays identical across them. */}
            <b className="ecta__markRank">{card.rank}</b>
            <b className="ecta__markPip">{SUIT_GLYPH[card.suit]}</b>
          </span>
        ))}
      </span>

      {/* The visible markers are decorative; this is the real announcement. It
          sits inside the guide's aria-live region, so each flip is spoken. */}
      <span className="ecta__srOnly">
        {flipped.size} of {DECK_SIZE} cards flipped
      </span>
    </div>
  );
}
