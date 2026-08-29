"use client";

// Pieces every concept shares, so eight directions differ where they mean to
// and are identical everywhere else.
//
// The two actions are read from production (`workTogether.ts → EXPERIENCE`)
// rather than restated, for the same reason `ctaLab.ts` re-exports from there:
// the lab is judging the composition above them, and a lab that quietly
// invented its own CTA would be judging something the site does not ship.

import { getPath } from "@/data/workTogether";
import { Action } from "@/components/work/ConsultingPathsScreen";

const EXPERIENCE = getPath("experience").destination;

/** The sheet's terminal ask. Same markup, classes and hrefs as production. */
export function ConceptActions() {
  return (
    <div className="cpp-path__actions xlab-actions">
      <Action action={EXPERIENCE.primary} kind="primary" />
      {EXPERIENCE.secondary && <Action action={EXPERIENCE.secondary} kind="ghost" />}
    </div>
  );
}

/** A full-bleed hairline inside the sheet. */
export function Rule({ weight = "hair" }: { weight?: "hair" | "heavy" }) {
  return <span className={`xlab-rule xlab-rule--${weight}`} aria-hidden="true" />;
}
