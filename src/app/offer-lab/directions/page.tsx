import type { Metadata } from "next";
import DirectionsCompare from "@/components/offer-lab/DirectionsCompare";

// Six art directions for the offer pages, stacked for a direct comparison.
//
// A static segment, so it takes precedence over the `[offer]` dynamic route
// alongside it. "directions" is never a valid offer id — `generateStaticParams`
// there enumerates only the three real ones — so the two cannot collide.

export const metadata: Metadata = {
  title: "Offer directions — side by side",
  description:
    "Six art directions for the three offer pages, compared at one width against the same copy.",
  robots: { index: false, follow: false },
};

export default function OfferDirectionsPage() {
  return <DirectionsCompare />;
}
