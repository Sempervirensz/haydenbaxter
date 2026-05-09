import type { Metadata } from "next";
import ProjectDetailPage from "@/components/etb-page/ProjectDetailPage";
import { findEtbProject } from "@/data/etbProjects";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
  title: "CaseBrief — Emerging Tech Builds",
};

export default function CaseBriefPage() {
  const project = findEtbProject("casebrief");
  if (!project) notFound();
  return <ProjectDetailPage project={project} />;
}
