// Central site identity. SITE_URL is the canonical production origin used by
// metadata, canonical tags, sitemap, robots, OpenGraph, and every JSON-LD
// `@id`. Override per environment with NEXT_PUBLIC_SITE_URL (no trailing
// slash).
//
// `www`, not the apex, because that is what production actually serves:
// https://haydenbaxter.com/privacy 301s to https://www.haydenbaxter.com/privacy
// (path preserved). Pointing canonicals at the apex told search engines the
// canonical URL was one that immediately redirects somewhere else. Both
// hostnames keep working — the apex redirect is what makes them equivalent —
// but only one may be named as canonical, and this is the one.

export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.haydenbaxter.com"
).replace(/\/$/, "");

export const SITE_NAME = "Hayden Baxter";

// Positioning is derived from what the page actually says: the hero h1 ("I help
// orgs put AI to work, strengthen global supply chains, and innovate where
// sustainability meets next-gen tech"), the About intro ("product builder,
// supply chain operator, and emerging-tech generalist"), and the three
// personas. Keep these in sync with that copy — search engines and the JSON-LD
// Person entity both read from here, and structured data must never claim
// something a visitor can't see.
export const SITE_ROLE = "AI Product Builder & Global Supply Chain Strategist";

export const SITE_TITLE = `${SITE_NAME} | ${SITE_ROLE}`;

export const SITE_DESCRIPTION =
  "Hayden Baxter builds AI products, supply chain systems, and Digital Product Passport experiences that connect data, design, and real-world operations.";

// Public, indexable routes (used to generate the sitemap). Everything not
// listed here — labs, sandboxes, previews, the private birthday page — is
// kept out of the sitemap and disallowed in robots. Blog posts are appended
// by the sitemap from `journal.ts` so a new post can't be forgotten here.
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
  "/consulting-hero-lab",
  "/consulting-parallax-lab",
  "/consulting-paths-lab",
  "/cta-lab",
  "/entry-cta-lab",
  "/hero-type-lab",
  "/offer-lab",
  "/personas-lab",
  "/etb-lab",
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

/** Absolute canonical URL for a site-relative path ("/" → the bare origin). */
export function absoluteUrl(path: string): string {
  return path === "/" ? SITE_URL : `${SITE_URL}${path}`;
}
