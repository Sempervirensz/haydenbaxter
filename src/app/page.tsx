import dynamic from "next/dynamic";
import HeroSection from "@/components/HeroSection";
import BrandsCarousel from "@/components/BrandsCarousel";
import ConnectSection from "@/components/ConnectSection";
import AboutSection from "@/components/AboutSection";
import JournalSection from "@/components/JournalSection";
import SiteFooter from "@/components/SiteFooter";
import SoftLockGate from "@/components/design-lab/SoftLockGate";

const WorkSection = dynamic(() => import("@/components/work/WorkSectionResponsive"));

export default function Home() {
  return (
    <main>
      <HeroSection />
      {/* Soft lock: the card deck + entry prompt. Holds the rest of the page
          until all four cards are flipped or Skip is pressed. */}
      <SoftLockGate>
        <BrandsCarousel />
        <WorkSection />
        <ConnectSection />
        <AboutSection />
        <JournalSection />
        <SiteFooter />
      </SoftLockGate>
    </main>
  );
}
