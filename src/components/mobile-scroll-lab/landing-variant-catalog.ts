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
    id: "shipped",
    label: "shipped",
    note: "What is live: a tapped title goes where it says. Keeps faith with the visitor who taps 04 because Consulting is what they came for.",
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
