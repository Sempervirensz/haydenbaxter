import { socialCard } from "@/data/site";
import type { Metadata } from "next";
import ProjectDetailPage from "@/components/etb-page/ProjectDetailPage";
import AtomicOSMarkHero from "@/components/etb-page/atomicos/AtomicOSMarkHero";
import "@/components/etb-page/atomicos/atomicos-mark.css";
import JsonLd from "@/components/JsonLd";
import { findEtbProject } from "@/data/etbProjects";
import { projectPageGraph } from "@/data/schema";
import { notFound } from "next/navigation";

const PROJECT = findEtbProject("atomicos");
const DESCRIPTION =
  PROJECT?.panel?.description ??
  "A personal operating system that turns natural-language check-ins into useful patterns for habits, energy, and follow-through.";

export const metadata: Metadata = {
  title: "AtomicOS | Selected AI Work",
  description: DESCRIPTION,
  alternates: { canonical: "/emerging-tech-builds/atomic-os" },
  ...socialCard({ title: "AtomicOS | Selected AI Work | Hayden Baxter", description: DESCRIPTION, path: "/emerging-tech-builds/atomic-os" }),

};

// The mark leads this page as a ledger plate — two hairlines with the atom
// centred between them and mono metadata either side. AtomicOS only: the
// treatment lives in components/etb-page/atomicos and reaches this page via
// the `aos-skin` wrapper. See that folder's README for why.
export default function AtomicOSPage() {
  if (!PROJECT) notFound();
  return (
    <>
      <JsonLd
        data={projectPageGraph({
          path: "/emerging-tech-builds/atomic-os",
          name: PROJECT.name,
          description: DESCRIPTION,
          keywords: PROJECT.tags,
          image: PROJECT.screenshot,
          parentName: "Selected AI Work",
          parentPath: "/emerging-tech-builds",
        })}
      />
      <div className="aos-skin" data-aos-variant="ledger">
        <ProjectDetailPage
          project={PROJECT}
          hero={<AtomicOSMarkHero project={PROJECT} variant="ledger" />}
        />
      </div>
    </>
  );
}
