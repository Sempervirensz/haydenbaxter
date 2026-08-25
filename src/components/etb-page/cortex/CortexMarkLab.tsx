"use client";

/* Cortex mark lab — /cortex-mark-lab.
 *
 * One question: how prominent should the embroidered brain be on the Cortex
 * detail page, and what shape does that prominence take?
 *
 * Every direction renders the REAL page — the same record, the same story,
 * stats, screenshots and accordions — with only the hero swapped. That is the
 * point: a mark treatment is only judgeable against the content it has to
 * lead into, so nothing here is a mockup of the page.
 *
 * Scope: Cortex only. AtomicOS and CaseBrief have their own labs, their own
 * heroes and their own stylesheets, and none of the three import from each
 * other — only the switcher chrome is shared. */

import { useState } from "react";
import type { ETBProject } from "@/data/work";
import ProjectDetailPage from "@/components/etb-page/ProjectDetailPage";
import MarkLabShell from "@/components/etb-page/mark-lab/MarkLabShell";
import CortexMarkHero, {
  CORTEX_HERO_DIRECTIONS,
  type CortexHeroVariant,
} from "./CortexMarkHero";
// The shipped treatment...
import "./cortex-mark.css";
// ...plus the ones it beat, which only this lab renders.
import "./cortex-directions.css";

interface Props {
  project: ETBProject;
}

export default function CortexMarkLab({ project }: Props) {
  const [variant, setVariant] = useState<CortexHeroVariant>("seal");

  // Passing an element that renders null still counts as "a hero was given",
  // so the baseline has to hand the page `undefined` and let it draw its own.
  const hero =
    variant === "current" || !project.mark ? undefined : (
      <CortexMarkHero project={project} variant={variant} />
    );

  return (
    <MarkLabShell
      title="Cortex mark"
      directions={CORTEX_HERO_DIRECTIONS}
      value={variant}
      onChange={setVariant}
    >
      <div className="cortex-skin" data-cortex-variant={variant}>
        <ProjectDetailPage project={project} hero={hero} />
      </div>
    </MarkLabShell>
  );
}
