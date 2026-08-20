import type { Metadata } from "next";
import ProjectDetailPage from "@/components/etb-page/ProjectDetailPage";
import { findEtbProject } from "@/data/etbProjects";
import { notFound } from "next/navigation";

const PROJECT = findEtbProject("atomicos");
const DESCRIPTION =
  PROJECT?.panel?.description ??
  "A personal operating system that turns natural-language check-ins into useful patterns for habits, energy, and follow-through.";

export const metadata: Metadata = {
  title: "AtomicOS | Emerging Tech Builds",
  description: DESCRIPTION,
  alternates: { canonical: "/emerging-tech-builds/atomic-os" },
  openGraph: {
    title: "AtomicOS | Emerging Tech Builds | Hayden Baxter",
    description: DESCRIPTION,
    url: "/emerging-tech-builds/atomic-os",
  },
};

export default function AtomicOSPage() {
  if (!PROJECT) notFound();
  return <ProjectDetailPage project={PROJECT} />;
}
