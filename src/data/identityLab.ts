// IDENTITY LAB — five answers to "who is Hayden, and why is it one person?"
//
// Scope: the About + Personas pair, and the redundancy those two sections
// create with the rest of the homepage. Read only by `/identity-lab`.
// Nothing here reaches production.
//
// FACT DISCIPLINE
// Every claim below already exists somewhere in this repo, cited inline to the
// file it comes from. Nothing is invented: no dates, titles, metrics, clients,
// or credentials beyond what the site already says out loud. Where a concept
// needed a fact the repo does not have, the concept was rewritten instead.
//
// The interpretive sentences — the ones that say what a fact MEANS — are new,
// because that is the actual deliverable. They are marked `voice` where the
// distinction matters.

/* ---------------------------------------------------------------------------
   The diagnosis this lab is answering
   ------------------------------------------------------------------------ */

/**
 * Every place the live homepage states Hayden's identity, in page order.
 *
 * The point of the list is the count, not any single entry: the same triad
 * (AI · supply chain · WorldPulse) is asserted six times in six vocabularies
 * before a visitor reaches the footer.
 */
export interface Restatement {
  where: string;
  says: string;
  /** Which of the three areas this instance names. */
  triad: boolean;
}

export const RESTATEMENTS: Restatement[] = [
  {
    where: "Hero eyebrow",
    says: "“View the work, the supply chain background, and where WorldPulse fits in.”",
    triad: true,
  },
  {
    where: "Hero heading",
    says: "“I help orgs put AI to work, strengthen global supply chains, and innovate where sustainability meets next-gen tech.”",
    triad: true,
  },
  {
    where: "Card deck",
    says: "Jack of All Trades · Queen of Vision · King of Strategy · Ace of Execution — a fourth character portrait, in a fourth vocabulary.",
    triad: false,
  },
  {
    where: "Work chapters 01–04",
    says: "WorldPulse · Selected AI Work · Supply Chain · Consulting — the triad again, as work.",
    triad: true,
  },
  {
    where: "Let’s work together",
    says: "Start a Consulting Project · Explore WorldPulse · Review My Experience — the triad again, as routes.",
    triad: true,
  },
  {
    where: "Personas",
    says: "AI Strategy · Global Supply Chain · WorldPulse — the triad again, as job titles, after the CTA.",
    triad: true,
  },
  {
    where: "About",
    says: "“I’m Hayden, a global business leader, AI strategy partner, and founder of WorldPulse…” — the triad again, as a paragraph, below Connect.",
    triad: true,
  },
  {
    where: "<title> + schema jobTitle",
    says: "“Global Business Leader, AI Strategy Partner, and WorldPulse Founder” — the triad again, to search engines.",
    triad: true,
  },
];

/** The structural faults, stated once each. */
export const FAULTS: { title: string; body: string }[] = [
  {
    title: "Personas paraphrases Work",
    body: "Personas 01/02/03 are the same three areas the Work chapters just spent 1,700vh of scroll showing. It restates them as titles, in résumé grammar (“Led Nike and Converse global sourcing initiatives including factory onboarding, compliance, supplier performance…”), after the visitor has already been given a CTA.",
  },
  {
    title: "About sits below Connect",
    body: "The one section that says who Hayden is renders after the contact links and the scheduler. The page asks for a booking before it finishes the introduction.",
  },
  {
    title: "The connection is never stated",
    body: "Nothing on the page says why one person does all three. The nearest thing to a thesis — “AI fits best after the operating model is clear. I design the workflow and data shape first, then layer automation where it compounds” — is buried in the supply-chain bridge line and repeated as a footnote inside a consulting destination.",
  },
  {
    title: "Four coined titles",
    body: "Global Business Leader · AI Strategy Partner · Cross-Cultural Leader · Sustainability-Tech Innovator. None is a role anyone holds; all four are the register the brief is trying to leave.",
  },
  {
    title: "Credibility never compounds",
    body: "Nike and Disney appear in the brands carousel, again in a persona bullet, again in an experience signal strip. Mandarin appears three times, 8+ years four. Scattered across five surfaces, each mention reads as a repeat rather than as accumulation.",
  },
];

/* ---------------------------------------------------------------------------
   Facts — every one already on the site
   ------------------------------------------------------------------------ */

export const FACTS = {
  // about.ts → intro; work.ts → supplyChain.heroArt.quoteLines
  yearsAsia: "8+ years across Asia",
  mandarin: "Fluent in Mandarin",
  // siteContent.ts → brands; personas.ts → supply bullets
  brands: ["Nike", "Converse", "Disney", "Aosom"],
  // work.ts → supplyChain.heroArt.quoteLines
  networks: "Supplier networks across China, Vietnam, and Indonesia",
  fortune: "Fortune 100 sourcing leader",
  // work.ts → etb.credibilityLine (via workTogether.ts EXPERIENCE.signals)
  degree: "M.S. Artificial Intelligence in Business, ASU",
  // work.ts → WORK_SCREENS[0]
  worldpulse: "Founder, WorldPulse — design-driven Digital Product Passports",
  // work.ts → supplyChain.featured
  tools: ["SAP", "Tableau", "Excel", "ERP data"],
  // work.ts → etb.projects
  builds: ["AtomicOS", "CaseBrief", "Cortex", "ProcureBridge", "OpenClaw"],
  // work.ts → consulting.offers
  offers: ["AI Roadmap Sprint", "MVP Prototype Sprint"],
  // work.ts → supplyChain.bridgeLine — the sentence this lab argues is the thesis
  bridge:
    "AI fits best after the operating model is clear. I design the workflow and data shape first, then layer automation where it compounds.",
} as const;

/* ---------------------------------------------------------------------------
   Round-two copy — the whole section, in under 60 words

   Round one wrote five essays. Production's About + Personas is 216 words, and
   every round-one concept came in at 200–350 — i.e. the fix was longer than the
   problem. It was also flat: type on #0a0a0a with hairlines, next to a site
   whose Work chapters are full-bleed photography, a physical CD player on blue
   velvet, and five-word serif headlines.

   Round two inverts both. Each concept below is capped at 60 words of body copy
   and is built on real site material — the consulting night coast, the Pacific
   supply-chain map, the WorldPulse shoot, the DYMO emboss, the media plate.

   The lab measures the rendered word count live and shows it against 216, so
   "too long" stays a number rather than an opinion.
   ------------------------------------------------------------------------ */

/** The credential strip. Facts only — no sentence ever repeats these. */
export const STRIP: string[] = [
  "Fluent in Mandarin",
  "8+ years across Asia",
  "Nike · Disney",
  "M.S. AI in Business",
  "Founder, WorldPulse",
];

/** 01 — Statement. One sentence over the night coast. */
export const STATEMENT = {
  headline: "I make complicated operations legible.",
  line: "It has looked like sourcing, like traceability, and like AI. It has been one job.",
};

/**
 * 02 — Triptych. Three site images, three labels, one short line each.
 *
 * The AI panel carries the four product marks rather than a photograph: the
 * builds are the evidence, and four real marks in a row say "shipped things"
 * faster than any stock-feeling image of a screen could.
 */
export interface Panel {
  label: string;
  line: string;
  img?: { src: string; alt: string; w: number; h: number; position?: string };
  /** Product marks, shown instead of a photograph. */
  marks?: { src: string; alt: string }[];
}

export const PANELS: Panel[] = [
  {
    label: "Global supply chain",
    line: "Nike and Disney. Eight years, in Mandarin.",
    img: {
      src: "/images/supply-chain/pacific-supply-chain-network-map.webp",
      alt: "Pacific supply chain network map",
      w: 6336,
      h: 2688,
    },
  },
  {
    label: "Applied AI",
    line: "Five products shipped. A master's in the subject.",
    marks: [
      { src: "/assets/atomicos-mark.webp", alt: "AtomicOS" },
      { src: "/assets/casebrief-mark.webp", alt: "CaseBrief" },
      { src: "/assets/cortex-mark.webp", alt: "Cortex" },
      { src: "/assets/procurebridge-mark.webp", alt: "ProcureBridge" },
    ],
  },
  {
    label: "WorldPulse",
    line: "Digital Product Passports. Founder.",
    img: {
      src: "/WorldPulseCostal3.0.webp",
      alt: "A WorldPulse Digital Product Passport open on a phone",
      w: 1600,
      h: 679,
      position: "62% 40%",
    },
  },
];

export const TRIPTYCH = {
  headline: "Same job. Three rooms.",
  closer: "Operations first. AI last, on purpose.",
};

/** 03 — Plate. The DYMO material used literally, as an object. */
export const PLATE = {
  stamp: "Hayden Baxter",
  line: "Operations first, software second. One job, three rooms.",
};

/** 04 — Margin. Handwritten annotations on a portrait. */
export const MARGIN_NOTES: string[] = [
  "Mandarin first —",
  "then the factory floor —",
  "AI came last, on purpose.",
];

export const MARGIN = {
  headline: "The order is the point.",
};

/**
 * 05 — Reveal. One sentence; three marked phrases swap the image behind it.
 *
 * The sentence is complete before anything is touched: interaction adds a
 * photograph and one fact, and removes nothing. A disclosure that hides the
 * answer would be the live Personas cards again, in a new costume.
 */
export const REVEAL = {
  before: "I spent eight years making ",
  after: ".",
} as const;

export const REVEAL_PARTS: {
  id: string;
  phrase: string;
  /** Text between this phrase and the next. */
  joiner: string;
  fact: string;
  img: { src: string; alt: string; w: number; h: number };
}[] = [
  {
    id: "supply",
    phrase: "supply chains",
    joiner: " work, learned to ",
    fact: "Nike, Converse, Disney, Aosom — sourcing across China, Vietnam, Indonesia.",
    img: {
      src: "/images/supply-chain/pacific-supply-chain-network-map.webp",
      alt: "Pacific supply chain network map",
      w: 6336,
      h: 2688,
    },
  },
  {
    id: "ai",
    phrase: "build with AI",
    joiner: ", and now put both into ",
    fact: "Five shipped products, and an M.S. in Artificial Intelligence in Business.",
    img: {
      src: "/images/portfolio/hayden-baxter-work-portfolio-cd.webp",
      alt: "Work portfolio disc",
      w: 1200,
      h: 1200,
    },
  },
  {
    id: "worldpulse",
    phrase: "WorldPulse",
    joiner: "",
    fact: "Founder. Design-driven Digital Product Passports.",
    img: {
      src: "/WorldPulseCostal3.0.webp",
      alt: "WorldPulse Digital Product Passport on a phone",
      w: 1600,
      h: 679,
    },
  },
];

/* ---------------------------------------------------------------------------
   Concepts

   ------------------------------------------------------------------------ */

export type ConceptId =
  | "statement"
  | "triptych"
  | "plate"
  | "margin"
  | "reveal";

export interface SiteMove {
  section: string;
  /** "owns" — keeps or gains this idea. "drops" — gives it up. */
  verb: "owns" | "drops" | "moves";
  detail: string;
}

export interface ConceptMeta {
  id: ConceptId;
  index: string;
  name: string;
  /** The thesis in one line — what this concept claims identity IS. */
  thesis: string;
  /** How it is built. */
  shape: string;
  /** The material it is built on. Round one had none; that was the problem. */
  material: string;
  strengths: string[];
  weaknesses: string[];
  moves: SiteMove[];
  /** Proposed section heading, replacing "About" / "Personas". */
  heading: string;
  seo: { title: string; description: string; schema: string[] };
}

export const CONCEPTS: ConceptMeta[] = [
  {
    id: "statement",
    index: "01",
    name: "Statement",
    thesis: "One sentence, held at scale, over a photograph. Nothing else.",
    shape:
      "The Work chapters' own grammar, borrowed exactly: mono rule top-left, a six-word serif headline, one supporting line, a DYMO fact strip. Twenty-two words of prose.",
    material: "Full-bleed — the consulting night coast (3440×1440).",
    strengths: [
      "Shortest thing on the homepage, and reads as the most confident for exactly that reason.",
      "Native by construction: it is the WorldPulse chapter's layout applied to a person.",
      "Nothing to interact with, nothing to mis-tap, identical on a phone and at 4K.",
      "Answers “why one person” in the sentence itself rather than in a structure around it.",
    ],
    weaknesses: [
      "Everything rests on one sentence. If it is not the right sentence there is no recovery.",
      "Credibility is a strip of facts, not a story — a visitor who wants proof has to go to Work.",
      "Least differentiated visually: portfolio sites open with a photo and a claim constantly.",
    ],
    moves: [
      { section: "Personas", verb: "drops", detail: "Deleted. The sentence names all three areas once." },
      { section: "About", verb: "moves", detail: "Becomes this, and moves above Connect. The 75-word paragraph goes." },
      { section: "Hero eyebrow", verb: "drops", detail: "It is this sentence already, in navigation grammar." },
      { section: "Work chapters", verb: "owns", detail: "Own every piece of proof. This section deliberately shows none." },
    ],
    heading: "About",
    seo: {
      title: "Hayden Baxter | Supply Chain, Applied AI, and WorldPulse",
      description:
        "Eight-plus years making global supply chains work, in Mandarin, across Asia. Now building applied AI products and Digital Product Passports as founder of WorldPulse.",
      schema: [
        "Person.jobTitle narrows to “Founder, WorldPulse” — one real role, not three coined ones.",
        "Person.description becomes the headline sentence rather than a title stack.",
        "Thin on-page text is the trade: knowsAbout leans on the Work chapters for support.",
      ],
    },
  },
  {
    id: "triptych",
    index: "02",
    name: "Triptych",
    thesis: "Show the three rooms instead of describing them. Images do the work.",
    shape:
      "Three site images edge to edge, each with a mono label and one six-word line, under a four-word serif headline. Twenty-seven words of prose.",
    material: "The Pacific supply-chain map, the portfolio disc, the WorldPulse shoot.",
    strengths: [
      "The triad is finally shown rather than asserted for a sixth time.",
      "Scans in about two seconds — the only concept that works at a glance.",
      "Reuses the site's own section imagery, so it reads as a contents page for the Work chapters.",
      "Each panel carries its credibility inline, so Nike and Disney land as evidence, not as a logo belt.",
    ],
    weaknesses: [
      "Three panels is structurally the Personas grid again. The improvement is real but the shape rhymes with what it replaces.",
      "Still does not say why one person does all three — it shows the three and leaves the join implied.",
      "Depends on three images being equally strong; the disc is a product shot next to two photographs.",
    ],
    moves: [
      { section: "Personas", verb: "drops", detail: "Deleted and directly replaced — same three areas, a third of the words, with pictures." },
      { section: "Brands carousel", verb: "drops", detail: "Nike and Disney are named in panel one with the work attached." },
      { section: "About", verb: "moves", detail: "Becomes this, above Connect." },
      { section: "Work chapters", verb: "owns", detail: "Own the depth. This is the index to them." },
    ],
    heading: "Same job. Three rooms.",
    seo: {
      title: "Hayden Baxter | Global Supply Chain, Applied AI, WorldPulse",
      description:
        "Sourcing for Nike and Disney across Asia, five shipped AI products, and Digital Product Passports at WorldPulse — three applications of one practice.",
      schema: [
        "Three labelled images with real alt text: the strongest image-entity signal of the five.",
        "knowsAbout gains on-page support for supply chain, applied AI, and DPPs in one view.",
        "Keep the labels as headings, not as links — this is a summary, not a nav.",
      ],
    },
  },
  {
    id: "plate",
    index: "03",
    name: "Plate",
    thesis: "Identity as an object, not a passage. The DYMO material, used literally.",
    shape:
      "One embossed plate on the media texture, the way the CD player sits on blue velvet: a stamped name, one serif line, five facts around it. Twenty-four words of prose.",
    material: "The DYMO emboss on the personas media plate.",
    strengths: [
      "The most on-brand object the site could make — its whole design language is embossed labels.",
      "Physically small: it occupies a fraction of a screen and never becomes a wall of reading.",
      "Object-like the way the CD player is, which is the site's strongest existing visual idea.",
      "Impossible to mistake for a résumé or a consulting brochure.",
    ],
    weaknesses: [
      "A label plate is decorative furniture on a site that already has a lot of it — it risks reading as style with nothing underneath.",
      "Five facts on a plate is a credential list; it states credibility without ever demonstrating it.",
      "The emboss is a hard material to scale: what looks crisp at 200px looks like a sticker at 900px.",
    ],
    moves: [
      { section: "Personas", verb: "drops", detail: "Deleted. Its media plate is reused as this section's ground." },
      { section: "About", verb: "moves", detail: "Becomes the plate, above Connect." },
      { section: "Brands carousel", verb: "drops", detail: "The names sit on the plate instead." },
      { section: "Let’s work together", verb: "owns", detail: "Owns routing. The plate hands off to it and says nothing about offers." },
    ],
    heading: "About",
    seo: {
      title: "Hayden Baxter | Founder, WorldPulse",
      description:
        "Operations first, software second. Eight-plus years in global sourcing across Asia, in Mandarin, now building Digital Product Passports and applied AI at WorldPulse.",
      schema: [
        "Weakest of the five: very little crawlable prose, and facts sit as short fragments.",
        "Would need the Work chapters to carry knowsAbout support entirely.",
        "Keep the plate as real text, never an image, or the section becomes invisible to search.",
      ],
    },
  },
  {
    id: "margin",
    index: "04",
    name: "Margin",
    thesis: "A photograph, annotated by hand. The order of the career is the whole note.",
    shape:
      "A portrait with three handwritten annotations tied to it by hairlines, and one serif line. Uses the site's Caveat face, which is loaded and almost never used. Twenty words of prose.",
    material: "Portrait photography + the site's handwriting face.",
    strengths: [
      "The most human thing the site could put in an About section, and the least corporate.",
      "Uses a loaded font the site barely touches, so it feels like the same world without repeating any existing section.",
      "Twenty words. It cannot become long, structurally.",
      "The annotation form makes the sequence argument without a timeline's résumé grammar.",
    ],
    weaknesses: [
      "Handwriting is the highest-risk register here — a hair too much and the whole site reads as scrapbook.",
      "Annotations pointing at a portrait can look like a diagram of a person, which is faintly absurd.",
      "The available portraits are travel snapshots, not a shot made for this; the concept wants a photograph that does not exist yet.",
      "Handwritten type is a legibility and localisation liability at small sizes.",
    ],
    moves: [
      { section: "Personas", verb: "drops", detail: "Deleted. The annotations carry the sequence instead." },
      { section: "About", verb: "moves", detail: "Becomes this, above Connect. The gallery collapses to one frame." },
      { section: "About gallery", verb: "drops", detail: "Five unattached photos become one photograph that is actually about something." },
      { section: "Supply Chain timeline", verb: "owns", detail: "Keeps the dated version. This is the compressed reading of it." },
    ],
    heading: "About",
    seo: {
      title: "Hayden Baxter | Mandarin, Global Sourcing, and Applied AI",
      description:
        "Mandarin first, then the factory floor, then AI — eight-plus years across Asia in sourcing and traceability, now founder of WorldPulse building Digital Product Passports.",
      schema: [
        "Annotations must be real text, not baked into the image, or they index as nothing.",
        "Person.image finally points at a portrait the page actually features.",
        "Sparse prose; relies on the Work chapters for topical depth.",
      ],
    },
  },
  {
    id: "reveal",
    index: "05",
    name: "Reveal",
    thesis:
      "One sentence that assembles itself. Touch a phrase and the evidence comes up behind it.",
    shape:
      "A single sentence with three marked phrases. Hover, focus, or tap one and the full-bleed image swaps and one fact appears. The sentence is complete before anything is touched.",
    material: "Three full-bleed site images, cross-faded behind the type.",
    strengths: [
      "The only concept where interaction adds instead of hides — the answer is on screen before you touch it.",
      "One sentence carries the join between the three areas, in the order that makes it credible.",
      "Cinematic in the way the Work chapters are, without adding a fifth chapter.",
      "Degrades to concept 01 exactly when motion is reduced, so there is no second design to maintain.",
    ],
    weaknesses: [
      "Hover is not a thing on a phone; the mobile version is three taps most visitors will never make.",
      "Cross-fading full-bleed imagery is the heaviest thing here — three large images on a section that is mostly one sentence.",
      "It is a mechanism, and mechanisms invite tuning; this is the concept most likely to grow.",
      "Someone who never interacts sees concept 01, which raises a fair question about why the mechanism is there.",
    ],
    moves: [
      { section: "Personas", verb: "drops", detail: "Deleted. The three marked phrases are the three areas, in one sentence." },
      { section: "About", verb: "moves", detail: "Becomes this, above Connect." },
      { section: "Brands carousel", verb: "drops", detail: "The supply-chain reveal names them with the work attached." },
      { section: "Work chapters", verb: "owns", detail: "Own the depth. The reveal shows one fact per area and stops." },
    ],
    heading: "About",
    seo: {
      title: "Hayden Baxter | Supply Chain, Applied AI, and WorldPulse",
      description:
        "Eight years making global supply chains work, then building with AI, now both inside WorldPulse — Digital Product Passports for traceable, transparent products.",
      schema: [
        "All three facts render in the DOM regardless of interaction, so nothing is hidden from a crawler.",
        "Person.knowsAbout supported by the sentence plus the three revealed facts.",
        "Watch image weight: three full-bleed sources on one section is a real LCP risk.",
      ],
    },
  },
];

export function getConcept(id: ConceptId): ConceptMeta {
  return CONCEPTS.find((c) => c.id === id) ?? CONCEPTS[0];
}

/** Homepage order every concept agrees on. The one change none of them argue about. */
export const SHARED_ORDER: { step: string; note?: string }[] = [
  { step: "Hero" },
  { step: "Entry deck" },
  { step: "Work — 01 WorldPulse · 02 Selected AI Work · 03 Supply Chain · 04 Consulting" },
  { step: "Let’s work together", note: "routing only" },
  { step: "Identity", note: "← the section this lab is designing. Was “Personas + About”, split across the CTA." },
  { step: "Connect", note: "moved below the introduction, not above it" },
  { step: "Journal" },
];
