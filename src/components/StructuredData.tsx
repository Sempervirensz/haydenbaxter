import { CONNECT_LINKS } from "@/data/connect";
import { SITE_URL, SITE_NAME, SITE_DESCRIPTION } from "@/data/site";

// JSON-LD structured data for the homepage (the canonical entity page).
// Helps search engines understand this site represents the person Hayden
// Baxter — supports name-search rich results / knowledge panel eligibility.
// type="application/ld+json" is a data block, not executable script, so it is
// not subject to CSP script-src.
export default function StructuredData() {
  const linkedIn = CONNECT_LINKS.find((l) => l.id === "linkedin")?.href;
  const personId = `${SITE_URL}/#person`;

  const graph = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": personId,
        name: SITE_NAME,
        url: SITE_URL,
        jobTitle: "Designer & Builder",
        description: SITE_DESCRIPTION,
        image: `${SITE_URL}/opengraph-image`,
        sameAs: linkedIn ? [linkedIn] : undefined,
        knowsAbout: [
          "Product Design",
          "Brand Systems",
          "User Interface Design",
          "AI Products",
          "Supply Chain Systems",
        ],
      },
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        url: SITE_URL,
        name: SITE_NAME,
        description: SITE_DESCRIPTION,
        inLanguage: "en-US",
        publisher: { "@id": personId },
      },
      {
        "@type": "ProfilePage",
        "@id": `${SITE_URL}/#webpage`,
        url: SITE_URL,
        name: `${SITE_NAME} — Designer & Builder`,
        isPartOf: { "@id": `${SITE_URL}/#website` },
        about: { "@id": personId },
        inLanguage: "en-US",
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }}
    />
  );
}
