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
