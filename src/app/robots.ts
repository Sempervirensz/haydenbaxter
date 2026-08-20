import type { MetadataRoute } from "next";
import { SITE_URL, NON_PUBLIC_PREFIXES } from "@/data/site";

// Generated as a static /robots.txt at build time (output: export compatible).
export const dynamic = "force-static";

const protectedPaths = [...NON_PUBLIC_PREFIXES];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "OAI-SearchBot",
        allow: "/",
        disallow: protectedPaths,
      },
      {
        userAgent: "*",
        allow: "/",
        // Keep labs, sandboxes, previews, and the private page out of search.
        disallow: protectedPaths,
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
