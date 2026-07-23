import { CALENDLY_URL } from "@/data/connect";

export const SPLASH_WORDS = [
  "Hello",
  "你好",
  "Olá",
  "नमस्ते",
  "こんにちは",
  "Explore the Site\n\nScroll through each section.\nClick cards to flip them.\nUse the globe timeline to move through the journey.\n\nStart Exploring ↓",
];

/** Text label, or image asset path under /public */
export type BrandLogo = {
  label: string;
  imageSrc?: string;
};

export const SITE_CONTENT = {
  header: {
    wordmark: "Hayden Baxter",
    navLinks: [
      { label: "Work", href: "#work" },
      { label: "About", href: "#about" },
      { label: "Connect", href: "#connect" },
      { label: "Journal", href: "/blog" },
      // Booking always points at the single source of truth in `data/connect`
      // so the nav CTA can't drift from the Connect-section embed again.
      { label: "Book a Call", href: CALENDLY_URL, cta: true },
    ],
  },
  hero: {
    eyebrow: "Explore the builds, the supply chain background, and where WorldPulse fits in.",
    heading: "I build AI products and supply chain systems where data, design, and the real world meet.",
  },
  brands: {
    logos: [
      { label: "Nike", imageSrc: "/brands/nike-logo.svg" },
      { label: "Disney", imageSrc: "/brands/disney-logo.png" },
      { label: "Aosom", imageSrc: "/brands/aosom-logo.svg" },
    ] satisfies BrandLogo[],
    repeats: 4,
    context: "Past employers that shaped how I build.",
    note: "Logos are trademarks of their respective owners and are shown for identification only. No endorsement implied.",
  },
};
