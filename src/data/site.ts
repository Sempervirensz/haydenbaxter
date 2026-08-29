// Central site identity. SITE_URL is the canonical production origin used by
// metadata, canonical tags, sitemap, robots, JSON-LD, and OpenGraph. Override
// per environment with NEXT_PUBLIC_SITE_URL (no trailing slash).

export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.haydenbaxter.com"
).replace(/\/$/, "");

export const SITE_NAME = "Hayden Baxter";

export const SITE_TITLE =
  "Hayden Baxter | Global Business Leader, AI Strategy Partner, and WorldPulse Founder";

export const SITE_DESCRIPTION =
  "Hayden Baxter is a global business leader, AI strategy partner, and founder of WorldPulse, helping organizations turn emerging technology into practical products, smarter operations, and more transparent supply chains.";

// Public, indexable routes (used to generate the sitemap). Dynamic journal
// routes are added from BLOG_POSTS in sitemap.ts.
export const PUBLIC_ROUTES = [
  "/",
  "/emerging-tech-builds",
  "/emerging-tech-builds/cortex",
  "/emerging-tech-builds/atomic-os",
  "/emerging-tech-builds/casebrief",
  "/blog",
  "/privacy",
] as const;

// Non-public path prefixes: labs / sandboxes / previews / private pages.
// Disallowed in robots.txt and given noindex where applicable.
export const NON_PUBLIC_PREFIXES = [
  "/admin",
  "/lab/",
  "/cd-lab",
  "/cd-lab-desktop",
  "/sc-lab",
  "/supply-chain-lab",
  "/supply-chain-mobile-lab",
  "/mobile-lab",
  "/consulting-lab",
  "/consulting-paths-lab",
  "/consulting-color-lab",
  "/consulting-hero-lab",
  "/consulting-parallax-lab",
  "/cta-lab",
  "/entry-cta-lab",
  "/hero-type-lab",
  "/personas-lab",
  "/offer-lab",
  "/etb-lab",
  "/lab",
  "/etb-overlay-sandbox",
  "/globe-sandbox",
  "/globe-card-lab",
  "/design-lab",
  "/detail-lab",
  "/description-lab",
  "/narrative-lab",
  "/handwriting-lab",
  "/responsive-lab",
  "/site-parallax-lab",
  "/work-display-lab",
  "/worldpulse-hero-lab",
  "/work-preview",
  "/procurebridge-preview",
  "/atomicos-preview",
  "/happybirthdaykemmerlee",
  // Temporary: the mobile load lab. Ships deliberately (it must be measured on a
  // real phone on cellular) but must never be indexed. Delete with the route.
  "/x-perf",
] as const;

/** Absolute canonical URL for a site-relative path ("/" -> the bare origin). */
export function absoluteUrl(path: string): string {
  return path === "/" ? SITE_URL : `${SITE_URL}${path}`;
}

/* Social card for a route.
 *
 * Next replaces the parent `openGraph` object wholesale when a child declares
 * its own, and `opengraph-image.tsx` only applies to the segment it sits in —
 * so every child route that set `openGraph` silently lost the site image while
 * still declaring `twitter:card: summary_large_image`. The result was a
 * large-card layout with an empty image well, and Twitter tags that fell back
 * to the homepage's title.
 *
 * Building both blocks from one place makes that failure impossible to repeat.
 */
export function socialCard(opts: {
  title: string;
  description: string;
  path: string;
  type?: "website" | "article";
}) {
  const image = { url: "/opengraph-image", width: 1200, height: 630, alt: opts.title };
  return {
    openGraph: {
      type: opts.type ?? "website",
      siteName: SITE_NAME,
      title: opts.title,
      description: opts.description,
      url: opts.path,
      images: [image],
    },
    twitter: {
      card: "summary_large_image" as const,
      title: opts.title,
      description: opts.description,
      images: [image],
    },
  };
}
