// Scroll-dealt entry — the tuning for the card spread on the homepage.
//
// Chosen from /lab/card-entry-motion (option 02) after the four options were
// compared on the real entry. The deck's `bunchedTransform` values and the
// transform maths in PlayingCard are unchanged; what changed is where the
// progress comes from, and the fact that there is now somewhere to scroll.
//
// Why a pinned scene rather than the `50vh` spacer this site used to carry:
// that spacer let the whole entry scroll away, which is what put the guidance
// below the fold at 1440x900 (ETB-P1-03). Pinning keeps the composition exactly
// where the fit-to-fold work left it and puts the scroll distance BEHIND it, so
// the runway costs the entry nothing in vertical space.

/** Scroll distance, in px, that carries the cards from bunched to settled. */
export const RUNWAY_VH_SHARE = 0.85;
export const RUNWAY_MIN = 380;
export const RUNWAY_MAX = 760;

export function resolveRunway(viewportHeight: number): number {
  return Math.round(
    Math.min(Math.max(viewportHeight * RUNWAY_VH_SHARE, RUNWAY_MIN), RUNWAY_MAX)
  );
}

/**
 * Where the pinned scene sticks.
 *
 * Normally 0 — the composition fits the fold, so it holds at the top and the
 * runway passes behind it. When the entry is TALLER than the viewport (measured
 * at 375x667, 1280x700 and 1280x720, where it overruns by 19–67px) sticking at 0
 * would strand the bottom of the guidance off-screen with no way to reach it,
 * because the scroll is being spent on the runway. Offsetting by the overflow
 * lets the scene ride up just far enough to show its own bottom edge, and pin
 * there — so the skip link stays reachable at every size.
 */
export function resolveSceneTop(viewportHeight: number, sceneHeight: number): number {
  if (!viewportHeight || !sceneHeight) return 0;
  return Math.min(0, viewportHeight - sceneHeight);
}

/**
 * How hard the bunched pose is thrown, given the rendered card width.
 *
 * The pose in `cards.ts` is written in desktop pixels and PlayingCard scales it
 * by `cardWidth / 280`. That keeps the deal proportionally identical at every
 * size — and perceptually absent on a phone, where a 78-92px card scales the
 * throw down to ~28px horizontally and ~6px vertically. Proportion is the wrong
 * unit here: what reads as "the cards were dealt" is absolute travel against a
 * fixed viewing distance, and a phone is not held proportionally closer.
 *
 * So the scale gets a floor. Desktop is untouched (0.76 at 1440, 1.0 at 1920 —
 * both already above it); phones jump from ~0.28 to the floor, which roughly
 * doubles the throw. The bunched offsets all point INWARD, so a bigger throw
 * clusters the deck toward centre rather than pushing it past the viewport:
 * measured at 390px the row draws in from 338px wide to 216px, with the outer
 * cards overlapping their neighbours by ~33px.
 */
export const MIN_DEAL_SCALE = 0.62;

export function resolveDealScale(cardWidth: number): number {
  return Math.max(cardWidth / DESKTOP_CARD_WIDTH, MIN_DEAL_SCALE);
}

/** The width the bunched pose in `cards.ts` is authored against. */
export const DESKTOP_CARD_WIDTH = 280;
