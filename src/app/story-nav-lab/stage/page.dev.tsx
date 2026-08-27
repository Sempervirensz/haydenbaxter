// The framed stage: the REAL homepage, with the navigator painted on top.
//
// This mirrors src/app/page.tsx component-for-component — the same HeroSection,
// the same SoftLockGate holding the same children, the same
// WorkSectionResponsive that picks the cinematic or mobile branch by measuring
// its own viewport. Because the lab frames this in an iframe, that measurement
// is the FRAME's width, so selecting 390px here really does mount the mobile
// Work section, not a shrunk desktop one.
//
// Only two things from the real page are left out, both invisible: the JSON-LD
// StructuredData block and PerfProbe (which renders nothing without ?perf=1).
//
// If src/app/page.tsx gains or loses a section, this mirror has to follow — the
// same standing caveat that already applies to /design-lab/soft-lock.

import type { Metadata } from "next";
import dynamic from "next/dynamic";
import HeroSection from "@/components/HeroSection";
import BrandsCarousel from "@/components/BrandsCarousel";
import PersonasSection from "@/components/PersonasSection";
import ConnectSection from "@/components/ConnectSection";
import AboutSection from "@/components/AboutSection";
import JournalSection from "@/components/JournalSection";
import SiteFooter from "@/components/SiteFooter";
import SoftLockGate from "@/components/design-lab/SoftLockGate";
import StoryNavOverlay from "@/components/story-nav-lab/StoryNavOverlay";

const WorkSection = dynamic(() => import("@/components/work/WorkSectionResponsive"));

export const metadata: Metadata = {
  title: "Story nav stage — real homepage",
  robots: { index: false, follow: false },
};

export default function StoryNavStagePage() {
  return (
    <main id="main" tabIndex={-1}>
      <HeroSection />
      <SoftLockGate>
        <BrandsCarousel />
        <WorkSection />
        <PersonasSection />
        <ConnectSection />
        <AboutSection />
        <JournalSection />
        <SiteFooter />
      </SoftLockGate>
      {/* Paints on top; owns no content. */}
      <StoryNavOverlay />
    </main>
  );
}
