/* Labels and notes for the landing affordance arms. Lab-only, like
   disc-technique-catalog.ts and for the same reason: nothing on the shipped
   path may import this file. */

import type { LandingVariant } from "./landing-variants";

export interface LandingVariantDef {
  id: LandingVariant;
  label: string;
  note: string;
}

export const LANDING_VARIANTS: LandingVariantDef[] = [
  {
    id: "inert",
    label: "inert",
    note: "Shipped. The titles look like a menu and do nothing. Leave this on to test whether the cue and the turning disc fix it on their own.",
  },
  {
    id: "chapter",
    label: "chapter",
    note: "A tapped title goes where it says. Least surprising, and it keeps faith with the visitor who taps 04 because Consulting is what they came for.",
  },
  {
    id: "funnel",
    label: "funnel",
    note: "Every title scrolls to 01. Protects the story order and every tap moves someone forward — at the cost of a control that lies about its destination.",
  },
  {
    id: "first",
    label: "first only",
    note: "01 is a control; 02–04 are visibly preview, not menu. Nothing lies, everyone lands on card 1, and deep-linking never has to be decided.",
  },
];

const BY_ID = new Map(LANDING_VARIANTS.map((v) => [v.id, v]));

export function landingDef(id: LandingVariant): LandingVariantDef {
  return BY_ID.get(id) ?? LANDING_VARIANTS[0];
}
