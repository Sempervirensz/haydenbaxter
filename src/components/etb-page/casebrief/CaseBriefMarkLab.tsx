"use client";

/* CaseBrief mark lab — /casebrief-mark-lab.
 *
 * Same question as the other two labs, deliberately different answers. The
 * CaseBrief mark is a flat isometric render on a uniform navy, not a
 * photograph of cloth, so none of Cortex's feathering or AtomicOS's black
 * crush applies — and none of their treatments are offered here.
 *
 * Every direction renders the REAL page with only the hero swapped. */

import { useState } from "react";
import type { ETBProject } from "@/data/work";
import ProjectDetailPage from "@/components/etb-page/ProjectDetailPage";
import MarkLabShell from "@/components/etb-page/mark-lab/MarkLabShell";
import CaseBriefMarkHero, {
  CASEBRIEF_HERO_DIRECTIONS,
  type CaseBriefHeroVariant,
} from "./CaseBriefMarkHero";
// The shipped treatment...
import "./casebrief-mark.css";
// ...plus the ones it beat, which only this lab renders.
import "./casebrief-directions.css";

interface Props {
  project: ETBProject;
}

export default function CaseBriefMarkLab({ project }: Props) {
  const [variant, setVariant] = useState<CaseBriefHeroVariant>("plinth");

  // An element that renders null still counts as "a hero was given", so the
  // baseline has to hand the page `undefined` and let it draw its own.
  const hero =
    variant === "current" || !project.mark ? undefined : (
      <CaseBriefMarkHero project={project} variant={variant} />
    );

  return (
    <MarkLabShell
      title="CaseBrief mark"
      directions={CASEBRIEF_HERO_DIRECTIONS}
      value={variant}
      onChange={setVariant}
    >
      <div className="cb-skin" data-cb-variant={variant}>
        <ProjectDetailPage project={project} hero={hero} />
      </div>
    </MarkLabShell>
  );
}
