import type { Metadata } from "next";
import MobileLab from "@/components/mobile-lab/MobileLab";

// EXPERIMENTAL lab route — see src/app/mobile-lab/NOTES.md.
// Kept out of search via NON_PUBLIC_PREFIXES (robots.txt) + noindex here.
export const metadata: Metadata = {
  title: "Mobile Lab",
  robots: { index: false, follow: false },
};

export default function MobileLabPage() {
  return <MobileLab />;
}
