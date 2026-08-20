import JsonLd from "@/components/JsonLd";
import { CONNECT_LINKS } from "@/data/connect";
import {
  SITE_URL,
  SITE_NAME,
  SITE_TITLE,
  SITE_DESCRIPTION,
} from "@/data/site";

// JSON-LD for the homepage, the canonical entity page for Hayden Baxter.
export default function StructuredData() {
  const linkedIn = CONNECT_LINKS.find((link) => link.id === "linkedin")?.href;
  const worldPulse = CONNECT_LINKS.find(
    (link) => link.id === "worldpulse",
  )?.href;

  const personId = `${SITE_URL}/#person`;
  const websiteId = `${SITE_URL}/#website`;
  const profilePageId = `${SITE_URL}/#webpage`;
  const worldPulseId = worldPulse
    ? `${worldPulse.replace(/\/$/, "")}/#organization`
    : null;

  const graph: Record<string, unknown>[] = [
    {
      "@type": "Person",
      "@id": personId,
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
    },
    {
      "@type": "WebSite",
      "@id": websiteId,
      url: SITE_URL,
      name: SITE_NAME,
      description: SITE_DESCRIPTION,
      inLanguage: "en-US",
      publisher: { "@id": personId },
    },
    {
      "@type": "ProfilePage",
      "@id": profilePageId,
      url: SITE_URL,
      name: SITE_TITLE,
      isPartOf: { "@id": websiteId },
      mainEntity: { "@id": personId },
      about: { "@id": personId },
      inLanguage: "en-US",
    },
  ];

  if (worldPulse && worldPulseId) {
    graph.push({
      "@type": "Organization",
      "@id": worldPulseId,
      name: "WorldPulse",
      url: worldPulse,
      description:
        "Digital Product Passport technology for supply chain transparency.",
      founder: { "@id": personId },
    });
  }

  return <JsonLd data={{ "@context": "https://schema.org", "@graph": graph }} />;
}
