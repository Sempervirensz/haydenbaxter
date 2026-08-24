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
  SITE_TITLE,
  SITE_URL,
  absoluteUrl,
} from "@/data/site";

export const PERSON_ID = `${SITE_URL}/#person`;
export const WEBSITE_ID = `${SITE_URL}/#website`;

export const personRef = { "@id": PERSON_ID } as const;
export const websiteRef = { "@id": WEBSITE_ID } as const;

// Read from the Connect data so the graph can't drift from the links the page
// actually renders.
const linkedIn = CONNECT_LINKS.find((l) => l.id === "linkedin")?.href;
const worldPulse = CONNECT_LINKS.find((l) => l.id === "worldpulse")?.href;
const worldPulseId = worldPulse
  ? `${worldPulse.replace(/\/$/, "")}/#organization`
  : null;

/**
 * `#webpage` node id for a site-relative path. The homepage is special-cased so
 * its id reads `<origin>/#webpage`, matching the `/#person` and `/#website` ids
 * rather than gluing the fragment onto the bare origin.
 */
export function webPageId(path: string): string {
  return path === "/" ? `${SITE_URL}/#webpage` : `${absoluteUrl(path)}#webpage`;
}

/** Absolute URL for an image that may be site-relative or already absolute. */
export function absoluteImage(src: string): string {
  return src.startsWith("http") ? src : `${SITE_URL}${src}`;
}

/**
 * Human date ("July 29, 2026") to an ISO-8601 string, or `undefined` if it
 * doesn't parse. Guarded because `new Date("garbage").toISOString()` throws a
 * RangeError, which during a static export takes the whole build down rather
 * than just omitting one property.
 */
export function toIsoDate(value: string): string | undefined {
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? undefined : d.toISOString();
}

/** The canonical Person entity. */
export const personEntity = {
  "@type": "Person",
  "@id": PERSON_ID,
  name: SITE_NAME,
  url: SITE_URL,
  jobTitle:
    "Global Business Leader, AI Strategy Partner, and WorldPulse Founder",
  description: SITE_DESCRIPTION,
  image: `${SITE_URL}/about/portrait.webp`,
  sameAs: linkedIn ? [linkedIn] : undefined,
  knowsAbout: [
    "AI Strategy",
    "AI Product Development",
    "Global Supply Chains",
    "Digital Product Passports",
    "Supply Chain Traceability",
    "Sustainability Technology",
    "Cross-Cultural Business",
  ],
  affiliation: worldPulseId ? { "@id": worldPulseId } : undefined,
} as const;

/** The canonical WebSite entity. */
export const websiteEntity = {
  "@type": "WebSite",
  "@id": WEBSITE_ID,
  url: SITE_URL,
  name: SITE_NAME,
  description: SITE_DESCRIPTION,
  inLanguage: "en-US",
  publisher: personRef,
} as const;

/** WorldPulse, present only while the Connect data actually links to it. */
export const worldPulseEntity = worldPulse && worldPulseId
  ? ({
      "@type": "Organization",
      "@id": worldPulseId,
      name: "WorldPulse",
      url: worldPulse,
      description:
        "Digital Product Passport technology for supply chain transparency.",
      founder: personRef,
    } as const)
  : null;

function graph(nodes: unknown[]) {
  return { "@context": "https://schema.org", "@graph": nodes.filter(Boolean) };
}

/**
 * Homepage — the canonical entity page. Declares Person, WebSite, WorldPulse,
 * and the ProfilePage that ties them together.
 */
export function homePageGraph() {
  return graph([
    personEntity,
    websiteEntity,
    {
      "@type": "ProfilePage",
      "@id": webPageId("/"),
      url: SITE_URL,
      name: SITE_TITLE,
      isPartOf: websiteRef,
      mainEntity: personRef,
      about: personRef,
      inLanguage: "en-US",
    },
    worldPulseEntity,
  ]);
}

/** A single journal post. */
export function blogPostingGraph(post: {
  path: string;
  headline: string;
  description: string;
  author: string;
  datePublished?: string;
  image?: string;
  keywords?: string[];
}) {
  const url = absoluteUrl(post.path);
  return graph([
    {
      "@type": "BlogPosting",
      "@id": `${url}#article`,
      mainEntityOfPage: url,
      url,
      headline: post.headline,
      description: post.description,
      image: post.image ? absoluteImage(post.image) : undefined,
      datePublished: post.datePublished,
      author: {
        "@type": "Person",
        "@id": PERSON_ID,
        name: post.author,
        url: SITE_URL,
      },
      publisher: personRef,
      isPartOf: websiteRef,
      keywords: post.keywords,
      inLanguage: "en-US",
    },
  ]);
}

/** The journal index — a Blog listing its posts. */
export function blogIndexGraph(input: {
  path: string;
  name: string;
  description: string;
  posts: { path: string; title: string; datePublished?: string }[];
}) {
  const url = absoluteUrl(input.path);
  return graph([
    {
      "@type": "Blog",
      "@id": `${url}#blog`,
      url,
      name: input.name,
      description: input.description,
      isPartOf: websiteRef,
      author: personRef,
      publisher: personRef,
      inLanguage: "en-US",
      blogPost: input.posts.map((p) => ({
        "@type": "BlogPosting",
        "@id": `${absoluteUrl(p.path)}#article`,
        url: absoluteUrl(p.path),
        headline: p.title,
        datePublished: p.datePublished,
        author: personRef,
      })),
    },
    {
      "@type": "CollectionPage",
      "@id": webPageId(input.path),
      url,
      name: input.name,
      description: input.description,
      isPartOf: websiteRef,
      about: personRef,
      inLanguage: "en-US",
    },
  ]);
}

/** A gallery/index page that collects child pages. */
export function collectionPageGraph(input: {
  path: string;
  name: string;
  description: string;
  parts: { path: string; name: string }[];
}) {
  const url = absoluteUrl(input.path);
  return graph([
    {
      "@type": "CollectionPage",
      "@id": webPageId(input.path),
      url,
      name: input.name,
      description: input.description,
      isPartOf: websiteRef,
      about: personRef,
      inLanguage: "en-US",
      hasPart: input.parts.map((p) => ({
        "@type": "WebPage",
        "@id": webPageId(p.path),
        url: absoluteUrl(p.path),
        name: p.name,
      })),
    },
  ]);
}

/**
 * A project detail page. `CreativeWork` rather than `SoftwareApplication`:
 * these are builds and prototypes, not listed apps with an operating system,
 * a price, or a download — claiming otherwise invites a structured-data
 * penalty for properties the page can't back up.
 */
export function projectPageGraph(input: {
  path: string;
  name: string;
  description: string;
  keywords?: string[];
  image?: string;
  parentName: string;
  parentPath: string;
}) {
  const url = absoluteUrl(input.path);
  return graph([
    {
      "@type": "CreativeWork",
      "@id": `${url}#project`,
      url,
      name: input.name,
      description: input.description,
      image: input.image ? absoluteImage(input.image) : undefined,
      keywords: input.keywords,
      creator: personRef,
      isPartOf: websiteRef,
      inLanguage: "en-US",
    },
    {
      "@type": "WebPage",
      "@id": webPageId(input.path),
      url,
      name: input.name,
      description: input.description,
      isPartOf: websiteRef,
      about: { "@id": `${url}#project` },
      inLanguage: "en-US",
      breadcrumb: {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: input.parentName,
            item: absoluteUrl(input.parentPath),
          },
          { "@type": "ListItem", position: 2, name: input.name, item: url },
        ],
      },
    },
  ]);
}
