import type { Metadata } from "next";
import DesignLab from "@/components/design-lab/DesignLab";

export const metadata: Metadata = {
  title: "Design Lab",
  description: "A modular testing space for homepage interaction concepts.",
  robots: { index: false },
};

export default function DesignLabPage() {
  return <DesignLab />;
}
