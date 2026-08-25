"use client";

/* AtomicOS mark lab — /atomicos-mark-lab.
 *
 * Same question as Cortex's lab, deliberately not the same answers. The
 * AtomicOS mark is monochrome cream on near-black, so the problems Cortex had
 * to solve — a grey ground that had to be hidden, nine thread colours to put
 * somewhere — do not exist here, and none of Cortex's treatments are offered.
 *
 * Every direction renders the REAL page with only the hero swapped. */

import { useState } from "react";
import type { ETBProject } from "@/data/work";
import ProjectDetailPage from "@/components/etb-page/ProjectDetailPage";
import MarkLabShell from "@/components/etb-page/mark-lab/MarkLabShell";
import AtomicOSMarkHero, {
  ATOMICOS_HERO_DIRECTIONS,
  type AtomicOSHeroVariant,
} from "./AtomicOSMarkHero";
import "./atomicos-mark.css";

interface Props {
  project: ETBProject;
}

export default function AtomicOSMarkLab({ project }: Props) {
  const [variant, setVariant] = useState<AtomicOSHeroVariant>("float");

  // An element that renders null still counts as "a hero was given", so the
  // baseline has to hand the page `undefined` and let it draw its own.
  const hero =
    variant === "current" || !project.mark ? undefined : (
      <AtomicOSMarkHero project={project} variant={variant} />
    );

  return (
    <MarkLabShell
      title="AtomicOS mark"
      directions={ATOMICOS_HERO_DIRECTIONS}
      value={variant}
      onChange={setVariant}
    >
      <div className="aos-skin" data-aos-variant={variant}>
        <ProjectDetailPage project={project} hero={hero} />
      </div>
    </MarkLabShell>
  );
}
