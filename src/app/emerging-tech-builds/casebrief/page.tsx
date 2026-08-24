import type { Metadata } from "next";
import ProjectDetailPage from "@/components/etb-page/ProjectDetailPage";
import { findEtbProject } from "@/data/etbProjects";
import { notFound } from "next/navigation";

const PROJECT = findEtbProject("casebrief");
const DESCRIPTION =
  PROJECT?.panel?.description ??
  "Source-backed case intelligence that turns medical records into a clear injury, treatment, and recovery narrative.";

export const metadata: Metadata = {
  title: "CaseBrief | Emerging Tech Builds",
  description: DESCRIPTION,
  alternates: { canonical: "/emerging-tech-builds/casebrief" },
  openGraph: {
    title: "CaseBrief | Emerging Tech Builds | Hayden Baxter",
    description: DESCRIPTION,
    url: "/emerging-tech-builds/casebrief",
  },
};

export default function CaseBriefPage() {
  if (!PROJECT) notFound();
  return <ProjectDetailPage project={PROJECT} />;
}
