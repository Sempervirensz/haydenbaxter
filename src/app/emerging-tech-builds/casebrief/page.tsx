import type { Metadata } from "next";
import ProjectDetailPage from "@/components/etb-page/ProjectDetailPage";
import JsonLd from "@/components/JsonLd";
import { findEtbProject } from "@/data/etbProjects";
import { projectPageGraph } from "@/data/schema";
import { notFound } from "next/navigation";

const PROJECT = findEtbProject("casebrief");
const DESCRIPTION =
  PROJECT?.panel?.description ??
  "Source-backed case intelligence that turns medical records into a clear injury, treatment, and recovery narrative.";

export const metadata: Metadata = {
  title: "CaseBrief | Selected AI Work",
  description: DESCRIPTION,
  alternates: { canonical: "/emerging-tech-builds/casebrief" },
  openGraph: {
    title: "CaseBrief | Selected AI Work | Hayden Baxter",
    description: DESCRIPTION,
    url: "/emerging-tech-builds/casebrief",
  },
};

export default function CaseBriefPage() {
  if (!PROJECT) notFound();
  return (
    <>
      <JsonLd
        data={projectPageGraph({
          path: "/emerging-tech-builds/casebrief",
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
