"use client";

import CardContent, { CARDS } from "./CardContent";

/**
 * Scroll Snap — CSS-native snap behavior, zero JS.
 * Each card is a full-viewport section with scroll-snap-align: start.
 * The browser handles all snap logic including reversal.
 *
 * Tests: whether native snap provides perfectly symmetric reversal
 * with zero custom scroll logic.
 */
export default function ScrollSnap() {
  return (
    <div className="sl-snap">
      {CARDS.map((card) => (
        <section key={card.id} className="sl-snap__section">
          <CardContent card={card} />
        </section>
      ))}
    </div>
  );
}
