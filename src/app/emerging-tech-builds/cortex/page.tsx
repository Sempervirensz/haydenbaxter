import { socialCard } from "@/data/site";
import type { Metadata } from "next";
import ProjectDetailPage from "@/components/etb-page/ProjectDetailPage";
import CortexMarkHero from "@/components/etb-page/cortex/CortexMarkHero";
import "@/components/etb-page/cortex/cortex-mark.css";
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
  ...socialCard({ title: "Cortex | Selected AI Work | Hayden Baxter", description: DESCRIPTION, path: "/emerging-tech-builds/cortex" }),

};

// The mark leads this page as a disc seal — cut to a circle, vignetted
// free of its knit, with a mono legend turning slowly around it. Cortex only:
// the treatment lives in components/etb-page/cortex and reaches this page via
// the `cortex-skin` wrapper. See that folder's README for why.
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
      <div className="cortex-skin" data-cortex-variant="seal">
        <ProjectDetailPage
          project={PROJECT}
          hero={<CortexMarkHero project={PROJECT} variant="seal" />}
        />
      </div>
    </>
  );
}
