import type { Metadata } from "next";
import dynamic from "next/dynamic";
import HeroSection from "@/components/HeroSection";
import BrandsCarousel from "@/components/BrandsCarousel";
import ConnectSection from "@/components/ConnectSection";
import AboutSection from "@/components/AboutSection";
import JournalSection from "@/components/JournalSection";
import SiteFooter from "@/components/SiteFooter";
import SoftLockGate from "@/components/design-lab/SoftLockGate";
import NavLabStage from "@/components/nav-lab/NavLabStage";

// Mirrors the real homepage composition, section for section, from
// `src/app/page.tsx` — same order, same components, same soft-lock gate with
// the hero passed in as the pinned scene. The only additions are the overlay
// (`NavLabStage`) and the omission of `StructuredData` / `PerfProbe`, neither of
// which renders anything a navbar can sit on.
//
// It has to be the real page: a navbar is judged against what it covers, and
// the three surfaces that decide this one — the WorldPulse photography, the
// light Work Together bars, the pinned scenes that already use the top of the
// viewport — only exist here.
//
// Framed by the lab shell at /nav-lab in an iframe, which is what makes the
// device widths real: an iframe has its own viewport, so the concepts' media
// queries respond to the preset rather than to this machine's window.
const WorkSection = dynamic(() => import("@/components/work/WorkSectionResponsive"));

export const metadata: Metadata = {
  title: "Navbar lab — homepage stage",
  robots: { index: false },
};

export default function NavLabStagePage() {
  return (
    <main id="main" tabIndex={-1}>
      <NavLabStage />
      <SoftLockGate scene={<HeroSection />}>
        <BrandsCarousel />
        <WorkSection />
        {/* Order tracks `page.tsx`: About directly after the Work chapters as
            the album's liner notes, Connect below Journal. Personas is gone
            from the real page, so it is gone from here — a mirror that keeps a
            deleted section stops being a mirror. */}
        <AboutSection />
        <JournalSection />
        <ConnectSection />
        <SiteFooter />
      </SoftLockGate>
    </main>
  );
}
