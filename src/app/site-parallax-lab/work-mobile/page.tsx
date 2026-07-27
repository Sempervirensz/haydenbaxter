import type { Metadata } from "next";
import WorkMobileLab from "@/components/work-mobile/WorkMobileLab";

export const metadata: Metadata = {
  title: "Work — mobile system (all four chapters)",
  robots: { index: false },
};

export default function WorkMobileLabPage() {
  return <WorkMobileLab />;
}
