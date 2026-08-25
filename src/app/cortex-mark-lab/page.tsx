import type { Metadata } from "next";
import { notFound } from "next/navigation";
import CortexMarkLab from "@/components/etb-page/cortex/CortexMarkLab";
import { findEtbProject } from "@/data/etbProjects";

// Three ways the Cortex embroidered mark could lead its detail page, each
// rendered over the real page content, plus today's hero as the baseline.
//
// Cortex only. This is an art-direction exercise for one build, not a new
// shared ETB template — the other projects get their own when their turn
// comes. Production imports nothing from here.

export const metadata: Metadata = {
  title: "Cortex mark lab",
  description:
    "Three hero treatments for the Cortex embroidered mark — specimen plate, masthead lockup, fabric field — against the live detail page.",
  robots: { index: false, follow: false },
};

const PROJECT = findEtbProject("cortex");

export default function CortexMarkLabPage() {
  if (!PROJECT) notFound();
  return <CortexMarkLab project={PROJECT} />;
}
