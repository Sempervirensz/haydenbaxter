// Schema.org entity graph for the site.
//
// One canonical entity per thing, addressed by a stable `@id`, so every page's
// JSON-LD points at the SAME Person / WebSite / Organization node instead of
// re-declaring its own copy. `@id` values are URL fragments on the canonical
// origin — the convention search engines expect for cross-page entity joins.
//
// GROUND RULE: every property here must be backed by something a visitor can
// actually see in the server-rendered page. No invented employers, credentials,
// awards, ratings, prices, locations, or contact details. When in doubt, leave
// it out — a smaller true graph beats a bigger speculative one.

import { CONNECT_LINKS } from "@/data/connect";
import {
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_ROLE,
  SITE_URL,
  absoluteUrl,
} from "@/data/site";

export const PERSON_ID = `${SITE_URL}/#person`;
export const WEBSITE_ID = `${SITE_URL}/#website`;
export const WORLDPULSE_URL = "https://worldxpulse.com";
export const WORLDPULSE_ID = `${WORLDPULSE_URL}/#organization`;

export const personRef = { "@id": PERSON_ID } as const;
export const websiteRef = { "@id": WEBSITE_ID } as const;

/**
 * `#webpage` node id for a site-relative path. The homepage is special-cased so
 * its id reads `https://haydenbaxter.com/#webpage`, matching the `/#person` and
 * `/#website` ids rather than gluing the fragment onto the bare origin.
 */
export function webPageId(path: string): string {
  return path === "/" ? `${SITE_URL}/#webpage` : `${absoluteUrl(path)}#webpage`;
}

// LinkedIn is the one verified public profile. Read from the Connect data so
// the graph can't drift from the link the page actually renders.
const linkedIn = CONNECT_LINKS.find((l) => l.id === "linkedin")?.href;

/**
 * The canonical Person entity.
 *
 * No `image`: the only portrait-ish asset on the site is a candid street frame
 * in the About collage, not a portrait suitable for an entity/knowledge panel,
 * and the OpenGraph card is typographic branding rather than a photo of a
 * person. An accurate omission beats a misleading picture.
 */
export const personEntity = {
  "@type": "Person",
  "@id": PERSON_ID,
  name: SITE_NAME,
  url: SITE_URL,
  jobTitle: SITE_ROLE,
  description: SITE_DESCRIPTION,
  // Every term below is named in visible page copy (hero, personas, About,
  // journal).
  knowsAbout: [
    "Artificial Intelligence",
    "AI Product Development",
    "Global Supply Chain Management",
    "Sourcing and Procurement",
    "Supply Chain Traceability",
    "Digital Product Passports",
    "Sustainable Apparel and Textiles",
    "Product Design",
  ],
  // Personal profiles only. WorldPulse is a company site, not a profile of
  // Hayden, so it is modeled as a separate Organization below instead.
  ...(linkedIn ? { sameAs: [linkedIn] } : {}),
  worksFor: { "@id": WORLDPULSE_ID },
} as const;

export const websiteEntity = {
  "@type": "WebSite",
  "@id": WEBSITE_ID,
  url: SITE_URL,
  name: SITE_NAME,
  description: SITE_DESCRIPTION,
  inLanguage: "en-US",
  creator: personRef,
  publisher: personRef,
} as const;

/**
 * WorldPulse. Supported by the visible persona panel ("Founder and product
 * designer at WorldPulse developing Digital Product Passport technology for
 * supply chain transparency") and the outbound worldxpulse.com link. Nothing
 * about size, funding, location, or headcount is claimed.
 */
export const worldPulseEntity = {
  "@type": "Organization",
  "@id": WORLDPULSE_ID,
  name: "WorldPulse",
  url: WORLDPULSE_URL,
  description:
    "Digital Product Passport technology for supply chain transparency, connecting traceability, sustainability data, compliance, and product storytelling.",
  founder: personRef,
} as const;

/**
 * Homepage graph. `ProfilePage` because the homepage's primary job is
 * presenting who Hayden is — identity, personas, work, capabilities, and ways
 * to make contact — with the Person as its `mainEntity`.
 */
export function homePageGraph() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      personEntity,
      websiteEntity,
      worldPulseEntity,
      {
        "@type": "ProfilePage",
        "@id": webPageId("/"),
        url: SITE_URL,
        name: `${SITE_NAME} — ${SITE_ROLE}`,
        description: SITE_DESCRIPTION,
        isPartOf: websiteRef,
        mainEntity: personRef,
        inLanguage: "en-US",
      },
    ],
  };
}

/** Breadcrumb trail. `items` are [name, site-relative path] pairs, in order. */
function breadcrumb(path: string, items: [string, string][]) {
  return {
    "@type": "BreadcrumbList",
    "@id": `${absoluteUrl(path)}#breadcrumb`,
    itemListElement: items.map(([name, itemPath], i) => ({
      "@type": "ListItem",
      position: i + 1,
      name,
      item: absoluteUrl(itemPath),
    })),
  };
}

/**
 * A portfolio project page.
 *
 * `CreativeWork`, not `SoftwareApplication`: these pages are case studies about
 * front-end builds and prototypes — screenshots, a write-up, and lessons — with
 * no publicly installable or launchable application behind them. Claiming
 * SoftwareApplication would describe something the page does not offer.
 */
export function projectPageGraph(opts: {
  path: string;
  name: string;
  description: string;
  keywords: string[];
  image?: string;
  parentName: string;
  parentPath: string;
}) {
  const url = absoluteUrl(opts.path);
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CreativeWork",
        "@id": `${url}#project`,
        name: opts.name,
        description: opts.description,
        url,
        creator: personRef,
        keywords: opts.keywords,
        ...(opts.image ? { image: absoluteUrl(opts.image) } : {}),
        isPartOf: websiteRef,
      },
      {
        "@type": "WebPage",
        "@id": webPageId(opts.path),
        url,
        name: opts.name,
        description: opts.description,
        isPartOf: websiteRef,
        mainEntity: { "@id": `${url}#project` },
        breadcrumb: { "@id": `${url}#breadcrumb` },
        inLanguage: "en-US",
      },
      breadcrumb(opts.path, [
        ["Home", "/"],
        [opts.parentName, opts.parentPath],
        [opts.name, opts.path],
      ]),
    ],
  };
}

/** The Emerging Tech Builds gallery — a collection of the project pages. */
export function collectionPageGraph(opts: {
  path: string;
  name: string;
  description: string;
  parts: { path: string; name: string }[];
}) {
  const url = absoluteUrl(opts.path);
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": webPageId(opts.path),
        url,
        name: opts.name,
        description: opts.description,
        isPartOf: websiteRef,
        about: personRef,
        breadcrumb: { "@id": `${url}#breadcrumb` },
        inLanguage: "en-US",
        hasPart: opts.parts.map((p) => ({
          "@type": "CreativeWork",
          "@id": `${absoluteUrl(p.path)}#project`,
          name: p.name,
          url: absoluteUrl(p.path),
        })),
      },
      breadcrumb(opts.path, [
        ["Home", "/"],
        [opts.name, opts.path],
      ]),
    ],
  };
}

/** The Journal index. */
export function blogIndexGraph(opts: {
  path: string;
  name: string;
  description: string;
  posts: { path: string; title: string; datePublished?: string; image?: string }[];
}) {
  const url = absoluteUrl(opts.path);
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Blog",
        "@id": `${url}#blog`,
        url,
        name: opts.name,
        description: opts.description,
        author: personRef,
        publisher: personRef,
        isPartOf: websiteRef,
        inLanguage: "en-US",
        blogPost: opts.posts.map((p) => ({
          "@type": "BlogPosting",
          "@id": `${absoluteUrl(p.path)}#article`,
          headline: p.title,
          url: absoluteUrl(p.path),
          ...(p.datePublished ? { datePublished: p.datePublished } : {}),
          ...(p.image ? { image: absoluteUrl(p.image) } : {}),
          author: personRef,
        })),
      },
      breadcrumb(opts.path, [
        ["Home", "/"],
        [opts.name, opts.path],
      ]),
    ],
  };
}

/**
 * A single Journal article. `dateModified` is deliberately absent — the posts
 * carry a published date only, and inventing a modification date would be a
 * false signal.
 */
export function blogPostingGraph(opts: {
  path: string;
  headline: string;
  description: string;
  datePublished?: string;
  image?: string;
  keywords: string[];
}) {
  const url = absoluteUrl(opts.path);
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BlogPosting",
        "@id": `${url}#article`,
        headline: opts.headline,
        description: opts.description,
        url,
        mainEntityOfPage: { "@id": webPageId(opts.path) },
        author: personRef,
        publisher: personRef,
        isPartOf: { "@id": `${absoluteUrl("/blog")}#blog` },
        inLanguage: "en-US",
        ...(opts.datePublished ? { datePublished: opts.datePublished } : {}),
        ...(opts.image ? { image: absoluteUrl(opts.image) } : {}),
        ...(opts.keywords.length ? { keywords: opts.keywords } : {}),
      },
      {
        "@type": "WebPage",
        "@id": webPageId(opts.path),
        url,
        name: opts.headline,
        description: opts.description,
        isPartOf: websiteRef,
        breadcrumb: { "@id": `${url}#breadcrumb` },
        inLanguage: "en-US",
      },
      breadcrumb(opts.path, [
        ["Home", "/"],
        ["Journal", "/blog"],
        [opts.headline, opts.path],
      ]),
    ],
  };
}

/**
 * "July 29, 2026" → "2026-07-29". Returns undefined for anything that doesn't
 * parse, so a malformed date is omitted rather than emitted wrong.
 */
export function toIsoDate(input: string): string | undefined {
  const d = new Date(input);
  if (Number.isNaN(d.getTime())) return undefined;
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}
