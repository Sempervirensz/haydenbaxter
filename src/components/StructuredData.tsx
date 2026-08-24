import JsonLd from "@/components/JsonLd";
import { homePageGraph } from "@/data/schema";

// JSON-LD for the homepage — the canonical entity page. Declares the Person,
// the WebSite, WorldPulse, and the ProfilePage that ties them together, so
// search engines can associate this site with Hayden Baxter. The graph itself
// lives in `src/data/schema.ts`; this is just the mount point.
export default function StructuredData() {
  return <JsonLd data={homePageGraph()} />;
}
