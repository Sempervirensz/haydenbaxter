import { CALENDLY_URL } from "@/data/connect";

export const SPLASH_WORDS = [
  "Hello",
  "你好",
  "Olá",
  "नमस्ते",
  "こんにちは",
  "Step Inside\n\nScroll through each section.\nClick cards to flip them.\nUse the globe timeline to move through the journey.\n\nStart Exploring ↓",
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
    eyebrow: "View the work, the supply chain background, and where WorldPulse fits in.",
    heading:
      "Helping orgs put AI to work, strengthening global supply chains, and innovating where sustainability meets next-gen tech.",
  },
  brands: {
    logos: [
      { label: "Nike", imageSrc: "/brands/nike-logo.svg" },
      { label: "Disney", imageSrc: "/brands/disney-logo.png" },
      { label: "Aosom", imageSrc: "/brands/aosom-logo.svg" },
    ] satisfies BrandLogo[],
    /* Passes through `logos` laid end to end. The marquee shifts by one pass
       per cycle, so the belt has to be at least one viewport PLUS one pass
       wide or a gap opens at the trailing edge. With the 300px slot ceiling in
       globals.css, 6 passes (18 slots, 5400px) covers a 3840px display with
       room to spare; 4 passes left 2493px of blank at that width. */
    repeats: 6,
    context: "Past employers that shaped how I build.",
    note: "Logos are trademarks of their respective owners and are shown for identification only. No endorsement implied.",
  },
};
