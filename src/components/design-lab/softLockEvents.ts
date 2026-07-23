// The soft lock hides everything below the card deck (`display: none`) until
// the visitor flips all four cards or presses Skip. That also makes the nav's
// in-page anchors (#work / #about / #connect) no-ops on first load, because
// their targets aren't in the layout yet.
//
// Clicking a nav destination is an explicit "take me there", so it counts as
// engaging with the entry the same way Skip does: the nav fires this event
// with the anchor it wants, the gate opens, and the gate scrolls there once
// the content has actually been committed to the DOM.

export const SOFT_LOCK_RELEASE = "softlock:release";

export type SoftLockReleaseDetail = { hash?: string };

export function releaseSoftLock(hash?: string) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(
    new CustomEvent<SoftLockReleaseDetail>(SOFT_LOCK_RELEASE, {
      detail: { hash },
    })
  );
}
