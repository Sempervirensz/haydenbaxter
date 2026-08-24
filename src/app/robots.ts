import type { MetadataRoute } from "next";
import { SITE_URL, NON_PUBLIC_PREFIXES } from "@/data/site";

// Generated as a static /robots.txt at build time (output: export compatible).
export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  // Labs, sandboxes, previews, and the private page. Nothing that a crawler
  // needs to render or understand a public page (CSS, JS, images, /_next) is
  // listed — those must stay fetchable.
  const disallow = [...NON_PUBLIC_PREFIXES];

  return {
    rules: [
      { userAgent: "*", allow: "/", disallow },
      // ChatGPT Search's retrieval crawler, named explicitly so the public
      // portfolio is unambiguously open to it. This is a search/citation
      // crawler and is separate from GPTBot (model training), whose policy is
      // intentionally left to the wildcard rule above — unchanged.
      { userAgent: "OAI-SearchBot", allow: "/", disallow },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
