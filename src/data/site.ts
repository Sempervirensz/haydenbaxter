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
] as const;

/** Absolute canonical URL for a site-relative path ("/" -> the bare origin). */
export function absoluteUrl(path: string): string {
  return path === "/" ? SITE_URL : `${SITE_URL}${path}`;
}
