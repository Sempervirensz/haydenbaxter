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
import StoryProgressSpine from "@/components/work/StoryProgressSpine";
import { SITE_TITLE, SITE_DESCRIPTION } from "@/data/site";

const WorkSection = dynamic(() => import("@/components/work/WorkSectionResponsive"));

/* Mobile scroll lab HUD — `?disc=off|rect|cached` on the real page.
 *
 * Imported through a dead branch rather than at the top of the file. A plain
 * `import` + `NODE_ENV &&` guard stops the component RENDERING in production
 * but not being BUNDLED: its markup strings and its stylesheet both end up in
 * the production page chunk, which is the opposite of what this branch is for.
 * Behind a statically-false ternary the whole import is dropped instead. */
const MobileScrollProbe =
  process.env.NODE_ENV === "development"
    ? dynamic(() => import("@/components/mobile-scroll-lab/MobileScrollProbe"))
    : null;

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
      {/* Dev-only. `?perf=1` prints load/paint timings and the slowest requests
          with their wait-vs-download split — built to diagnose a reported 26s
          mobile load that turned out to be network conditions, not the site.
          The NODE_ENV check compiles it out of production entirely, so it costs
          real visitors nothing while staying available under `npm run dev`. */}
      {process.env.NODE_ENV === "development" && <PerfProbe />}
      {MobileScrollProbe && <MobileScrollProbe />}
      <HeroSection />
      {/* Soft lock: the card deck + entry prompt. Holds the rest of the page
          until all four cards are flipped or Skip is pressed. */}
      <SoftLockGate>
        <BrandsCarousel />
        <WorkSection />
        {/* Right-edge guide through the four Work chapters. Renders nothing
            until Work is on screen, and nothing at all if it never mounts. */}
        <StoryProgressSpine />
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
