import type { Metadata } from "next";
import ProjectDetailPage from "@/components/etb-page/ProjectDetailPage";
import { findEtbProject } from "@/data/etbProjects";
import { notFound } from "next/navigation";

const PROJECT = findEtbProject("cortex");
const DESCRIPTION =
  PROJECT?.panel?.description ??
  "A source-connected editorial intelligence system for defensible research and publishing.";

export const metadata: Metadata = {
  title: "Cortex | Emerging Tech Builds",
  description: DESCRIPTION,
  alternates: { canonical: "/emerging-tech-builds/cortex" },
  openGraph: {
    title: "Cortex | Emerging Tech Builds | Hayden Baxter",
    description: DESCRIPTION,
    url: "/emerging-tech-builds/cortex",
  },
};

export default function CortexPage() {
  if (!PROJECT) notFound();
  return <ProjectDetailPage project={PROJECT} />;
}
