// The nav CTA opens the Work Together hub, and choosing one of its three paths
// has to land on that path's screen — not merely somewhere near the section.
//
// `WorkTogether` owns `openId` and nothing outside it could ever set that, so
// the hub had no way to say "open 02". This is the channel, deliberately shaped
// like `design-lab/softLockEvents.ts`: a window CustomEvent, one exported
// dispatcher, and the component that owns the state subscribing to it. Same
// reason as the soft lock — the two live in different branches of the tree, and
// threading a setter from the page through the Work stack to reach one of them
// would be a much larger change than the behaviour warrants.
//
// The nav fires this AFTER releasing the soft lock and scrolling, because the
// Work section mounts lazily: `WorkTogether` cannot subscribe before it exists.
// See `openWorkTogetherPath`'s retry note below.

import type { PathId } from "@/data/workTogether";

export const WORK_TOGETHER_OPEN = "worktogether:open";

export type WorkTogetherOpenDetail = { path: PathId };

/**
 * Ask the Work Together section to open one of its three paths.
 *
 * Fire-and-forget by design: if the section has not mounted yet the event lands
 * with no listener and nothing happens, which is why callers that have just
 * triggered a scroll should send it once the target is in the DOM rather than
 * on the same tick as the press.
 */
export function openWorkTogetherPath(path: PathId) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(
    new CustomEvent<WorkTogetherOpenDetail>(WORK_TOGETHER_OPEN, { detail: { path } })
  );
}
