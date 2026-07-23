// Copy + config for the Site Parallax Lab — a scrollable "vision reel" that
// re-imagines every homepage section with a parallax system tailored to it.
// Nothing here ships to the live site; treatments that earn their keep get
// ported section-by-section.

export interface PlxPanelMeta {
  id: string;
  /** Mono chip label, e.g. "PLX 01" */
  num: string;
  /** Treatment name shown as the panel kicker. */
  name: string;
  /** Which live section this re-imagines. */
  section: string;
  /** One-liner: what moves, and why it works for this section. */
  note: string;
}

export const PLX_PANELS: Record<string, PlxPanelMeta> = {
  hero: {
    id: "hero",
    num: "PLX 01",
    name: "Depth Type",
    section: "Hero",
    note: "Headline lines sit on three depth planes — nearer lines outrun deeper ones, and the whole lockup recedes as you leave.",
  },
  deck: {
    id: "deck",
    num: "PLX 02",
    name: "Fanned Depth",
    section: "Card Deck",
    note: "Each card rides its own rate and settles into the fan as the row crosses center — the deck feels dealt, not placed.",
  },
  brands: {
    id: "brands",
    num: "PLX 03",
    name: "Scroll-Linked Marquee",
    section: "Brands",
    note: "Two logo rails shear in opposite directions, driven by your scroll instead of a timer — you drive the conveyor.",
  },
  work: {
    id: "work",
    num: "PLX 04",
    name: "Sticky Depth Handoff",
    section: "Work (CD stack)",
    note: "As the next chapter slides over, the outgoing card sinks — scales down, dims, drops back a plane. The stack reads as physical depth.",
  },
  connect: {
    id: "connect",
    num: "PLX 05",
    name: "Label Cloud",
    section: "Connect",
    note: "DYMO tags hang at different depths and drift at different rates — the embossed labels become a dimensional cloud.",
  },
  about: {
    id: "about",
    num: "PLX 06",
    name: "Collage Depths",
    section: "About",
    note: "Each photo travels at its own rate while the image counter-drifts inside its frame — a two-layer parallax per picture.",
  },
  journal: {
    id: "journal",
    num: "PLX 07",
    name: "Editorial Reveal",
    section: "Journal",
    note: "Cards stagger up on separate planes; each cover image slides within its mask at a slower rate than the card carrying it.",
  },
};

export const PLX_INTRO = {
  kicker: "Lab · Site Parallax Reel",
  title: "The whole site, in depth",
  lede: "Scroll once, top to bottom. Every section of the homepage rebuilt with a parallax system designed for what it holds — type, cards, logos, chapters, labels, photos, posts. Use the intensity dial to find the line between cinematic and seasick.",
  hint: "Scroll",
  outro:
    "End of reel. Each panel is a candidate, not a commitment — treatments get ported to the live site one section at a time.",
};

/** Mock journal entries for the reveal panel (the live blog has one test
 *  post; these exist purely to art-direct the panel). */
export const PLX_JOURNAL_MOCKS = [
  {
    date: "Jun 2026",
    title: "Why traceability is a design problem",
    excerpt: "Compliance data nobody reads is a UX failure, not a data failure.",
    image: "/about/landscape-1.jpeg",
  },
  {
    date: "May 2026",
    title: "Shipping AI inside operations",
    excerpt: "The model is the easy part. The workflow is the product.",
    image: "/about/landscape-2.jpeg",
  },
  {
    date: "Apr 2026",
    title: "Notes from the factory floor",
    excerpt: "What eight years across Asia taught me about systems that survive contact.",
    image: "/about/pano.jpg",
  },
];
