// Dev-only route: `page.dev.tsx` keeps this out of the production export, which
// is how every lab in this repo stays unindexable (see 92fbecf / ETB-P1-04).
import type { Metadata } from "next";
import CardEntryMotionLab from "@/components/card-entry-motion-lab/CardEntryMotionLab";

export const metadata: Metadata = {
  title: "Card entry motion lab",
  robots: { index: false, follow: false },
};

export default function CardEntryMotionLabPage() {
  return <CardEntryMotionLab />;
}
