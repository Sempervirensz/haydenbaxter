import type { Metadata } from "next";
import ProjectDetailPage from "@/components/etb-page/ProjectDetailPage";
import JsonLd from "@/components/JsonLd";
import { findEtbProject } from "@/data/etbProjects";
import { projectPageGraph } from "@/data/schema";
import { notFound } from "next/navigation";

const PROJECT = findEtbProject("cortex");
const DESCRIPTION =
  PROJECT?.panel?.description ??
  "A source-connected editorial intelligence system for defensible research and publishing.";

export const metadata: Metadata = {
  title: "Cortex | Selected AI Work",
  description: DESCRIPTION,
  alternates: { canonical: "/emerging-tech-builds/cortex" },
  openGraph: {
    title: "Cortex | Selected AI Work | Hayden Baxter",
    description: DESCRIPTION,
    url: "/emerging-tech-builds/cortex",
  },
};

export default function CortexPage() {
  if (!PROJECT) notFound();
  return (
    <>
      <JsonLd
        data={projectPageGraph({
          path: "/emerging-tech-builds/cortex",
          name: PROJECT.name,
          description: DESCRIPTION,
          keywords: PROJECT.tags,
          image: PROJECT.screenshot,
          parentName: "Selected AI Work",
          parentPath: "/emerging-tech-builds",
        })}
      />
      <ProjectDetailPage project={PROJECT} />
    </>
  );
}
