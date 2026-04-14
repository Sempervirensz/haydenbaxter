"use client";

import CardContent, { CARDS } from "./CardContent";

/**
 * Sticky Stack — progressive card stacking, pure CSS.
 * Each card lives inside a tall "chapter." The card itself is position: sticky.
 * As you scroll, each new card stacks on top of the previous one.
 * Scrolling back naturally unstacks them.
 *
 * Tests: whether a real stacking metaphor gives a premium feel
 * with perfect reversal symmetry — no thresholds, no JS scroll logic.
 */
export default function StickyStack() {
  return (
    <div className="sl-sticky">
      {CARDS.map((card, i) => (
        <div
          key={card.id}
          className="sl-sticky__chapter"
          style={{ zIndex: i + 1 }}
        >
          <div className="sl-sticky__card">
            <CardContent card={card} />
          </div>
        </div>
      ))}
    </div>
  );
}
