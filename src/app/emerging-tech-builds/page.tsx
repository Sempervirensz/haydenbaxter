import { socialCard } from "@/data/site";
import type { Metadata } from "next";
import Link from "next/link";
import ETBDetail from "@/components/work/ETBDetail";
import { WORK_SCREENS } from "@/data/work";
import JsonLd from "@/components/JsonLd";
import { collectionPageGraph } from "@/data/schema";
import { notFound } from "next/navigation";

const DESCRIPTION =
  "AI systems Hayden Baxter has designed and built to solve real business problems, including Cortex, AtomicOS, and CaseBrief.";

// Only the projects that have their own detail route are listed as parts.
const PROJECT_PAGES = [
  { path: "/emerging-tech-builds/cortex", name: "Cortex" },
  { path: "/emerging-tech-builds/atomic-os", name: "AtomicOS" },
  { path: "/emerging-tech-builds/casebrief", name: "CaseBrief" },
];

export const metadata: Metadata = {
  title: "Selected AI Work",
  description: DESCRIPTION,
  alternates: { canonical: "/emerging-tech-builds" },
  ...socialCard({ title: "Selected AI Work | Hayden Baxter", description: DESCRIPTION, path: "/emerging-tech-builds" }),

};

export default function EmergingTechBuildsPage() {
  const screen = WORK_SCREENS.find((s) => s.type === "emerging-tech-builds");
  if (!screen || screen.type !== "emerging-tech-builds") notFound();

  return (
    <main className="etb-gallery">
      <JsonLd
        data={collectionPageGraph({
          path: "/emerging-tech-builds",
          name: "Selected AI Work",
          description: DESCRIPTION,
          parts: PROJECT_PAGES,
        })}
      />
      {/* Rail carries the shell's measure so the back link stays flush with the
          accordion's left edge once the shell stops filling the viewport. */}
      {/* The design has no visible title slot, so this is visually hidden rather
          than added to the composition — it still gives Google its primary
          relevance signal and gives screen-reader users an entry point
          (WCAG 2.4.6). Route had zero h1 elements before this. */}
      <h1 className="visually-hidden">Selected AI Work</h1>
      <div className="etb-gallery__rail">
        <Link href="/" className="etb-gallery__back">
          <span aria-hidden="true">&larr;</span>
          <span>Back to home</span>
        </Link>
      </div>
      <div className="etb-gallery__shell">
        <ETBDetail data={screen.etb} />
      </div>
    </main>
  );
}
