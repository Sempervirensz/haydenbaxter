import type { Metadata } from "next";
import ProjectDetailPage from "@/components/etb-page/ProjectDetailPage";
import CaseBriefMarkHero from "@/components/etb-page/casebrief/CaseBriefMarkHero";
import "@/components/etb-page/casebrief/casebrief-mark.css";
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

// The mark leads this page as a navy plinth — the page adopts the cube's own
// #00253c for one panel, so the render needs no frame. CaseBrief only: the
// treatment lives in components/etb-page/casebrief and reaches this page via
// the `cb-skin` wrapper. See that folder's README for why.
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
      <div className="cb-skin" data-cb-variant="plinth">
        <ProjectDetailPage
          project={PROJECT}
          hero={<CaseBriefMarkHero project={PROJECT} variant="plinth" />}
        />
      </div>
    </>
  );
}
