import dynamic from "next/dynamic";
import HeroSection from "@/components/HeroSection";

const WorkSection = dynamic(() => import("@/components/WorkSection"));

export default function Home() {
  return (
    <main>
      <HeroSection />
      <WorkSection />
    </main>
  );
}
