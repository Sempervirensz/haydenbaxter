// CTA Interaction Lab — lab-only configuration.
//
// The copy and structure live in `src/data/workTogether.ts`, which is what the
// production Work section renders. This file re-exports it so the lab always
// shows exactly what ships, and adds only the things that exist for comparison:
// the concept roster, the split-plate segments, and the section-label toggle.

export type {
  Destination,
  DestinationAction,
  DestinationBlock,
  PathDef,
  PathId,
  Step,
} from "@/data/workTogether";

export {
  CTA_HINT,
  CTA_LABEL,
  PATHS,
  RESUME_HREF,
  getPath,
} from "@/data/workTogether";

export type ConceptId = "split" | "rail" | "fold";

/** The CTA pre-split — three segments, one per path, for Concept B. */
export const CTA_LABEL_SEGMENTS: [string, string, string] = ["Let's", "work", "together"];

/** Section label variants — toggleable from the lab panel. */
export const SECTION_LABELS = {
  consulting: "04 — Consulting",
  work: "04 — Work Together",
} as const;

export type SectionLabelKey = keyof typeof SECTION_LABELS;

/* ---------------------------------------------------------------------------
   Concepts
   ------------------------------------------------------------------------ */

/** Where each concept stands after the three-path rework. */
export type ConceptStatus = "recommended" | "comparison" | "removal-candidate";

export interface ConceptDef {
  id: ConceptId;
  name: string;
  status: ConceptStatus;
  /** One line describing the structural idea. */
  premise: string;
  /** Why it holds this status. */
  verdict: string;
}

export const CONCEPT_STATUS_LABEL: Record<ConceptStatus, string> = {
  recommended: "Shipped",
  comparison: "Keep for comparison",
  "removal-candidate": "Likely removal",
};

export const CONCEPTS: ConceptDef[] = [
  {
    id: "rail",
    name: "A · Rail",
    status: "recommended",
    premise: "Three editorial rows; the chosen row pins and its screen unfurls in place.",
    verdict:
      "Shipped. This is what the live Work section renders at both breakpoints — the row the visitor pressed becomes the header of the screen they're reading, and a vertical list is already the right shape on a phone.",
  },
  {
    id: "split",
    name: "B · Split",
    status: "comparison",
    premise: "The DYMO plate splits into three; the chosen one widens into a header.",
    verdict:
      "Strongest tactile entry — the branch is unmistakably caused by the click. Redundant with Rail past that first beat, and the header ribbon competes with the screen for height.",
  },
  {
    id: "fold",
    name: "C · Fold",
    status: "removal-candidate",
    premise: "A trifold plate opens into three leaves; the chosen leaf becomes the screen.",
    verdict:
      "The most cinematic and the weakest bet. The whole idea is the fold, and reduced motion has to flatten it — so a real slice of visitors never see the concept at all.",
  },
];

/* ---------------------------------------------------------------------------
   Environment
   ------------------------------------------------------------------------ */

/** Both committed — see `git ls-files public/consulting`. */
export const STAGE_BACKGROUND = {
  wide: "/consulting/hero-2.png",
  narrow: "/consulting/mobile-statue.png",
} as const;
