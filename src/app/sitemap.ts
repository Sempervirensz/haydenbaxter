import type { MetadataRoute } from "next";
import { BLOG_POSTS } from "@/data/journal";
import { SITE_URL, PUBLIC_ROUTES } from "@/data/site";

// Generated as a static /sitemap.xml at build time (output: export compatible).
export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const journalRoutes = BLOG_POSTS.map((post) => `/blog/${post.slug}`);
  const routes = [...PUBLIC_ROUTES, ...journalRoutes];

  return routes.map((route) => ({
    url: `${SITE_URL}${route === "/" ? "" : route}`,
    changeFrequency:
      route === "/" ? "monthly" : route.startsWith("/blog") ? "monthly" : "yearly",
    priority: route === "/" ? 1 : route.startsWith("/blog/") ? 0.8 : 0.7,
  }));
}
