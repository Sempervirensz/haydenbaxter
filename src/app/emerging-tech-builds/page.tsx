import type { Metadata } from "next";
import Link from "next/link";
import ETBDetail from "@/components/work/ETBDetail";
import { WORK_SCREENS } from "@/data/work";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
  title: "Emerging Tech Builds",
};

export default function EmergingTechBuildsPage() {
  const screen = WORK_SCREENS.find((s) => s.type === "emerging-tech-builds");
  if (!screen || screen.type !== "emerging-tech-builds") notFound();

  return (
    <main className="etb-gallery">
      {/* Rail carries the shell's measure so the back link stays flush with the
          accordion's left edge once the shell stops filling the viewport. */}
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
