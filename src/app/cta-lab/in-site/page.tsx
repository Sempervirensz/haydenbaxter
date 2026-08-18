import type { Metadata } from "next";
import InSitePreview from "@/components/cta-row-lab/InSitePreview";

// The CTA row seen in the context of the real page.
//
// Renders the homepage's own sections — hero, brands, the Work stack, personas,
// connect, about, journal, footer — with the Consulting chapter opted in to the
// row prototype via CtaVariantProvider. Everything above and below it is the
// production component, unmodified, so what you are judging is how the CTA sits
// among its neighbours rather than how it looks in isolation.
//
// The soft-lock gate is deliberately omitted: on the real homepage it holds the
// page until four cards are flipped, which is the wrong tax for a preview whose
// entire purpose is to scroll to chapter 04 and look at it.
//
// The homepage itself is untouched — it renders no provider, and the context
// defaults to "live".

export const metadata: Metadata = {
  title: "CTA row — in site",
  description:
    "The CTA row prototype rendered inside the real page, surrounded by its actual neighbours.",
  robots: { index: false, follow: false },
};

export default function CtaInSitePage() {
  return <InSitePreview />;
}
