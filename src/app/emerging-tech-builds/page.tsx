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
      <div className="etb-gallery__rail">
        <Link href="/" className="etb-gallery__back">
          <span aria-hidden="true">&larr;</span>
          <span>Back to home</span>
        </Link>
      </div>

      {/* The h1 was `visually-hidden` because the design had no title slot, so
          the loudest thing on the route was five identical rows and someone
          arriving from a link had nothing telling them what they were looking
          at. It is visible now, which is also the better answer for WCAG 2.4.6
          than a hidden heading.

          It lives HERE and not in `ETBDetail`: the homepage card mounts that
          same component and supplies its own chapter header, so a title inside
          it would render twice there. Both strings come from the screen's own
          data rather than being retyped. */}
      <header className="etb-gallery__masthead">
        <p className="etb-gallery__kicker">{screen.etb.credibilityLine}</p>
        <h1 className="etb-gallery__title">{screen.etb.title}</h1>
      </header>
      <div className="etb-gallery__shell">
        <ETBDetail data={screen.etb} />
      </div>
    </main>
  );
}
