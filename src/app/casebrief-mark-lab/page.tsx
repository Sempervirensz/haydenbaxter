import type { Metadata } from "next";
import { notFound } from "next/navigation";
import CaseBriefMarkLab from "@/components/etb-page/casebrief/CaseBriefMarkLab";
import { findEtbProject } from "@/data/etbProjects";

// Four ways the CaseBrief cube could lead its detail page, each rendered over
// the real page content, plus today's hero as the baseline.
//
// CaseBrief only. Its mark is a flat render carrying its own navy, so it gets
// treatments built on that rather than Cortex's or AtomicOS's. Production
// imports nothing from here.

export const metadata: Metadata = {
  title: "CaseBrief mark lab",
  description:
    "Four hero treatments for the CaseBrief cube — navy plinth, corner monolith, case stack, chip lockup — against the live detail page.",
  robots: { index: false, follow: false },
};

const PROJECT = findEtbProject("casebrief");

export default function CaseBriefMarkLabPage() {
  if (!PROJECT) notFound();
  return <CaseBriefMarkLab project={PROJECT} />;
}
