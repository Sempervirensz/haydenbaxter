import type { Metadata } from "next";
import WorkFidelityLab from "@/components/work-fidelity/WorkFidelityLab";

export const metadata: Metadata = {
  title: "Work — mobile fidelity variations",
  robots: { index: false },
};

export default function WorkMobileVariantsPage() {
  return <WorkFidelityLab />;
}
