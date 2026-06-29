import type { MetadataRoute } from "next";
import { SITE_URL, PUBLIC_ROUTES } from "@/data/site";

// Generated as a static /sitemap.xml at build time (output: export compatible).
export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return PUBLIC_ROUTES.map((route) => ({
    url: `${SITE_URL}${route === "/" ? "" : route}`,
    lastModified,
    changeFrequency: route === "/" ? "monthly" : "yearly",
    priority: route === "/" ? 1 : 0.7,
  }));
}
