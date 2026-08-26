import type { Metadata } from "next";
import OfferLab from "@/components/offer-lab/OfferLab";

// Five structural directions for the three offer pages.

export const metadata: Metadata = {
  title: "Offer page lab",
  description:
    "Five layouts for the three offers — dossier, editorial, index, stack and split — against dark and paper surfaces.",
  robots: { index: false, follow: false },
};

export default function OfferLabPage() {
  return <OfferLab />;
}
