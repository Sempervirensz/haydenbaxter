import type { Metadata } from "next";
import ProjectDetailPage from "@/components/etb-page/ProjectDetailPage";
import { findEtbProject } from "@/data/etbProjects";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
  title: "Cortex · AI & Emerging Tech Builds",
};

export default function CortexPage() {
  const project = findEtbProject("cortex");
  if (!project) notFound();
  return <ProjectDetailPage project={project} />;
}
