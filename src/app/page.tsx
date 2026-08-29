import type { Metadata } from "next";
import dynamic from "next/dynamic";
import HeroSection from "@/components/HeroSection";
import BrandsCarousel from "@/components/BrandsCarousel";
import PersonasSection from "@/components/PersonasSection";
import ConnectSection from "@/components/ConnectSection";
import AboutSection from "@/components/AboutSection";
import JournalSection from "@/components/JournalSection";
import SiteFooter from "@/components/SiteFooter";
import StructuredData from "@/components/StructuredData";
import SoftLockGate from "@/components/design-lab/SoftLockGate";
import PerfProbe from "@/components/x-perf/PerfProbe";
import { SITE_TITLE, SITE_DESCRIPTION } from "@/data/site";

const WorkSection = dynamic(() => import("@/components/work/WorkSectionResponsive"));

export const metadata: Metadata = {
  alternates: { canonical: "/" },
  openGraph: {
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    url: "/",
  },
};

export default function Home() {
  return (
    <main id="main" tabIndex={-1}>
      <StructuredData />
      {/* Renders nothing unless ?perf=1 — see PerfProbe. */}
      <PerfProbe />
      {/* Soft lock: the card deck + entry prompt. Holds the rest of the page
          until all four cards are flipped or Skip is pressed.

          The hero is passed IN as `scene` rather than rendered beside the gate:
          the entry now pins as one object while the cards deal, and a hero left
          outside the scene would slide out from over the deck. */}
      <SoftLockGate scene={<HeroSection />}>
        <BrandsCarousel />
        <WorkSection />
        {/* Directly below the Work section's closing "Let's work together"
            chapter, so the three areas that CTA names resolve into what each
            one actually covers before the page reaches Connect. */}
        <PersonasSection />
        <ConnectSection />
        <AboutSection />
        <JournalSection />
        <SiteFooter />
      </SoftLockGate>
    </main>
  );
}
