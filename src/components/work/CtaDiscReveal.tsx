"use client";

// Chapter 04, unchanged, with a quarter of the disc turning in behind it.
//
// WHAT THIS KEEPS: everything. The photograph stays sharp and uncovered, the
// "Let's work together" headline stays, and the three near-white candy bars
// are the REAL shipped ones — this renders `WorkTogether` itself rather than a
// copy of it. Nothing in that component is edited or reimplemented.
//
// WHAT IT ADDS: a disc that lives mostly outside the frame. Point at a bar and
// it turns so that bar's own mark on the printed rim comes into the window:
//
//     CONSULTING   -> the word CONSULTING, at 297 degrees on the rim
//     WORLDPULSE   -> the word WORLDPULSE, at 53 degrees
//     EXPERIENCE   -> the winged victory mark at the top of the disc, 355
//
// Those angles are measured off `public/images/portfolio/hayden-baxter-work-portfolio-cd.png`, not guessed. The
// disc already carries this vocabulary printed on it, so the reveal is showing
// something that was always there rather than decorating the card.
//
// HOW IT READS THE ROW WITHOUT TOUCHING IT: CSS `:has()`, in the stylesheet.
// The bars are children of `.wt__rows`, so hovering or focusing the nth bar is
// matchable from an ancestor. No listener, no prop, no edit to the shipped
// component — this layer is `pointer-events: none` and cannot intercept a
// press.
//
// The statue is the reason the card exists, so the disc enters from an edge and
// only a quarter of it is ever in frame. Placement is an axis because where it
// comes from changes whether it enchants or interrupts.

import WorkTogether from "./WorkTogether";
import "./cta-disc-reveal.css";

export type DiscPlacement = "right" | "corner" | "left" | "bottom";

interface Props {
  media: React.ReactNode;
  placement?: DiscPlacement;
  /** Keeps a quarter of the disc in frame at rest instead of fully retracted. */
  restPeek?: boolean;
  /**
   * Forwarded straight through to WorkTogether. The Work stack passes this to
   * the chapter to say it is the active one, and dropping it here would change
   * live behaviour while looking like a pure addition.
   */
  isActive?: boolean;
}

export default function CtaDiscReveal({
  media,
  placement = "right",
  restPeek = false,
  isActive,
}: Props) {
  return (
    <div
      className="cdr"
      data-place={placement}
      data-rest={restPeek ? "peek" : "hidden"}
    >
      {/* The disc goes IN THE MEDIA PLANE, not in a layer beside the row.
          `.wt` carries z-index 5 and therefore its own stacking context, so a
          sibling layer underneath it sits under the PHOTOGRAPH too — which is
          inside `.wt` — and the disc was invisible while computed styles
          insisted it was on screen.

          As a sibling of the photo inside `.wt__media` it paints above the
          plate and below the scrim, the grain and the copy, which is exactly
          the depth it wants. WorkTogether is still not edited: `media` is the
          prop it already takes for this plane. */}
      <WorkTogether
        isActive={isActive}
        media={
          <>
            {media}
            <div className="cdr__stage" aria-hidden="true">
              <div className="cdr__disc">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img className="cdr__discImg" src="/images/portfolio/hayden-baxter-work-portfolio-cd.png" alt="" />
                <span className="cdr__discSheen" />
              </div>
            </div>
          </>
        }
      />
    </div>
  );
}
