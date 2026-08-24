import type { Metadata } from "next";
import ProjectDetailPage from "@/components/etb-page/ProjectDetailPage";
import JsonLd from "@/components/JsonLd";
import { findEtbProject } from "@/data/etbProjects";
import { projectPageGraph } from "@/data/schema";
import { notFound } from "next/navigation";

const PATH = "/emerging-tech-builds/cortex";
const project = findEtbProject("cortex");

export const metadata: Metadata = {
  title: "Cortex — Emerging Tech Builds",
  // Description mirrors the one-liner rendered in the page hero, so the
  // snippet and the visible content never disagree.
  description: project?.oneLiner,
  alternates: { canonical: PATH },
  openGraph: {
    title: "Cortex — Emerging Tech Builds",
    description: project?.oneLiner,
    url: PATH,
    type: "article",
  },
};

export default function CortexPage() {
  if (!project) notFound();
  return (
    <>
      <JsonLd
        data={projectPageGraph({
          path: PATH,
          name: project.name,
          description: project.oneLiner,
          keywords: project.tags,
          image: project.mark?.src ?? project.screenshot,
          parentName: "Emerging Tech Builds",
          parentPath: "/emerging-tech-builds",
        })}
      />
      <ProjectDetailPage project={project} />
    </>
  );
}
