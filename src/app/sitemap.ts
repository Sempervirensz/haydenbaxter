import type { MetadataRoute } from "next";
import { SITE_URL, PUBLIC_ROUTES, absoluteUrl } from "@/data/site";
import { BLOG_POSTS } from "@/data/journal";
import { toIsoDate } from "@/data/schema";

// Generated as a static /sitemap.xml at build time (output: export compatible).
export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  // No `lastModified` on the evergreen routes: build time is not the date the
  // page changed, and a wrong date is worse than no date. Blog posts carry a
  // real published date, so they get one.
  const staticRoutes: MetadataRoute.Sitemap = PUBLIC_ROUTES.map((route) => ({
    url: absoluteUrl(route),
    changeFrequency: route === "/" ? "monthly" : "yearly",
    priority: route === "/" ? 1 : 0.7,
  }));

  const posts: MetadataRoute.Sitemap = BLOG_POSTS.map((post) => {
    const published = toIsoDate(post.date);
    return {
      url: `${SITE_URL}/blog/${post.slug}`,
      ...(published ? { lastModified: published } : {}),
      changeFrequency: "yearly" as const,
      priority: 0.6,
    };
  });

  return [...staticRoutes, ...posts];
}
