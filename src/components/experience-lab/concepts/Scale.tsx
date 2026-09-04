"use client";

// 04 — SCALE. Oversized numbers, employers as the footnote.  *** SHIPPED ***
//
// This direction won the review and is now production: the composition below is
// `ExperienceRecord` from `src/components/work/ExperienceScreen.tsx`, the real
// component the Consulting chapter renders, not a copy of it. Concept 04 in
// this lab therefore cannot show something the site does not.
//
// THE ARGUMENT IT WON ON
//
// What the shipped section did before, measured: the M.S. chip wrapped to three
// lines and became the largest object on the sheet, while NIKE was a chip the
// size of a word. The least decisive credential carried the most weight and the
// most decisive one carried almost none.
//
// This inverts it. Three figures at display scale — and the third figure is a
// language rather than a number, which is the move: it makes Mandarin a
// quantity of difference instead of a line item. The employers drop to a mono
// footnote, where they are still doing their job because the visitor has
// already met all three in the brands marquee at the top of the page.
//
// Both schools sit in that footnote with them. Neither is set as a degree
// abbreviation beyond what the source gives — Arizona State carries the M.S.,
// Utah State is named by its programme — because inventing degree letters is
// exactly the kind of résumé filler this direction exists to strip out.
//
// The lab frame supplies the two actions so all eight concepts end on the same
// ask; production's own screen supplies them itself.

import { ExperienceRecord } from "@/components/work/ExperienceScreen";
import { ConceptActions } from "./parts";

export default function Scale() {
  return (
    <>
      <ExperienceRecord />
      <ConceptActions />
    </>
  );
}
