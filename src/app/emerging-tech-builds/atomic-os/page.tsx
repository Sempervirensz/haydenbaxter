import type { Metadata } from "next";
import ProjectDetailPage from "@/components/etb-page/ProjectDetailPage";
import { findEtbProject } from "@/data/etbProjects";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
  title: "Atomic OS — Emerging Tech Builds",
};

export default function AtomicOSPage() {
  const project = findEtbProject("atomicos");
  if (!project) notFound();
  return <ProjectDetailPage project={project} />;
}
