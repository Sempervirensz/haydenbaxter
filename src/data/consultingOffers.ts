// Consulting offer content. Concise, scanable, premium — descriptor + bullets.
// Visual layout & dossier interactions stay unchanged; only the content
// architecture is refined.

export interface ConsultingOffer {
  id: string;
  name: string;
  descriptor: string;
  bullets: string[];
}

export const CONSULTING_OFFERS: Record<string, ConsultingOffer> = {
  ai: {
    id: "ai",
    name: "AI Systems & Integration",
    descriptor:
      "Bridging AI, systems design, and user experience into practical tools and products.",
    bullets: [
      "AI workflow design",
      "Intelligent interfaces",
      "Internal tools & agents",
      "Automation systems",
      "Rapid prototyping",
      "Strategy & implementation",
    ],
  },
  supply: {
    id: "supply",
    name: "Supply Chain & Traceability",
    descriptor:
      "Bridging operational strategy, supplier systems, and product visibility across global networks.",
    bullets: [
      "Procurement & sourcing",
      "Supplier relationships",
      "Traceability systems",
      "Sustainability initiatives",
      "Logistics & operations",
      "International coordination",
    ],
  },
  worldpulse: {
    id: "worldpulse",
    name: "WorldPulse",
    descriptor:
      "Exploring how products, materials, and supply chains can become more transparent, intelligent, and connected.",
    bullets: [
      "Digital Product Passports",
      "Product storytelling",
      "Traceability systems",
      "Sustainability visibility",
      "AI-enhanced experiences",
      "Connected ecosystems",
    ],
  },
};
