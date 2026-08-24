import type { Metadata } from "next";
import ProjectDetailPage from "@/components/etb-page/ProjectDetailPage";
import JsonLd from "@/components/JsonLd";
import { findEtbProject } from "@/data/etbProjects";
import { projectPageGraph } from "@/data/schema";
import { notFound } from "next/navigation";

const PATH = "/emerging-tech-builds/atomic-os";
const project = findEtbProject("atomicos");

export const metadata: Metadata = {
  title: "Atomic OS — Emerging Tech Builds",
  // Description mirrors the one-liner rendered in the page hero, so the
  // snippet and the visible content never disagree.
  description: project?.oneLiner,
  alternates: { canonical: PATH },
  openGraph: {
    title: "Atomic OS — Emerging Tech Builds",
    description: project?.oneLiner,
    url: PATH,
    type: "article",
  },
};

export default function AtomicOSPage() {
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
