import type { Metadata } from "next";
import ExperienceLab from "@/components/experience-lab/ExperienceLab";

// `.dev.tsx`, so the route only exists under `next dev` — see `pageExtensions`
// in next.config.ts. The static-export production build never sees it.

export const metadata: Metadata = {
  title: "Experience Lab — My Experience, in situ",
  robots: { index: false },
};

export default function ExperienceLabPage() {
  return <ExperienceLab />;
}
