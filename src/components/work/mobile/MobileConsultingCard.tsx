"use client";

// 04 — Consulting, mobile (<1024px).
//
// Now renders the same `WorkTogether` interaction the desktop card does, so the
// final Work section asks the same three questions at every width. What stays
// from the approved "Refined Motion" card is its identity: the portrait statue
// plate, the shared chapter rail, the grounding vignette, and useCardDrift —
// the subtle settle as the card crosses the viewport that gives the last
// chapter its sense of arrival.
//
// What's gone is the old three-state flow (cursive quote → frosted wash → candy
// path buttons → offer file). Its frosted wash is replaced by WorkTogether's
// own blur/dim ladder, driven by the interaction's step rather than a single
// revealed/not-revealed flag.

import { useRef } from "react";
import WorkTogether from "@/components/work/WorkTogether";
import { Rail } from "./shared";
import { useCardDrift } from "./useCardDrift";

/** Production swaps to this asset at ≤640px — shot for portrait (900×2000). */
const IMG = "/consulting/mobile-statue.webp";
const IMG_ALT =
  "A winged victory statue lit against a golden hillside cityscape at night, above still water.";

export default function MobileConsultingCard() {
  const rootRef = useRef<HTMLElement | null>(null);

  // Refined Motion drifts the statue as the card crosses the viewport. It
  // writes --wm-plx-img onto this root; the custom property inherits down to
  // .wm-cns__media wherever that ends up in the tree.
  useCardDrift(rootRef);

  return (
    <article ref={rootRef as React.RefObject<HTMLElement>} className="wm-card wm-card--cns">
      <WorkTogether
        media={
          <>
            <div className="wm-cns__media">
              <img className="wm-cns__img" src={IMG} alt={IMG_ALT} />
            </div>
            <span className="wm-cns__vignette" aria-hidden="true" />
          </>
        }
      />

      {/* Outside .wt so it keeps resolving its cq units against .wmob-screen,
          exactly like the other three chapters. */}
      <Rail id={4} />
    </article>
  );
}
