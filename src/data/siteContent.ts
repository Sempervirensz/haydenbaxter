import { CTA_LABEL, RESUME_HREF } from "@/data/workTogether";

/** Text label, or image asset path under /public */
export type BrandLogo = {
  label: string;
  imageSrc?: string;
};

export const SITE_CONTENT = {
  header: {
    wordmark: "Hayden Baxter",
    /* Four destinations and a CTA that is not one of them.

       CONNECT is deliberately absent. Booking used to be the nav's CTA
       ("Book a Call" → Calendly), which asked a visitor to commit to a call
       before the page had said which of three conversations it would be. The
       CTA below opens the Work Together hub instead, and its Consulting path
       still ends at the same Calendly link in `data/connect` — so the booking
       route is one press longer and correctly qualified, rather than gone. The
       Connect section itself is unchanged and still sits in the scroll. */
    navLinks: [
      { label: "Work", href: "#work" },
      { label: "About", href: "#about" },
      // The journal moved to its own subdomain; `/blog` still builds and is
      // still what JournalSection links, so that route is a redirect candidate
      // rather than something to delete alongside this.
      { label: "Journal", href: "https://journal.haydenbaxter.com", external: true },
      // Same PDF the Work Together record (path 03) already offers.
      { label: "Resume", href: RESUME_HREF },
    ],
    /* Not a link — it discloses the hub. Label read from `workTogether.ts` so
       the nav and the section it opens cannot drift apart. */
    cta: { label: CTA_LABEL, glyph: "→", short: "Work with me" },
  },
  hero: {
    eyebrow: "View the work, the supply chain background, and where WorldPulse fits in.",
    heading:
      "I help orgs put AI to work, strengthen global supply chains, and innovate where sustainability meets next-gen tech.",
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
