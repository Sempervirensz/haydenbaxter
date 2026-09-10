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
   Round three — the career arc, in prose

   Rounds one and two both designed a SECTION: a heading, a composition, a
   grid. Research into the sites that share Hayden's shape says none of them
   has one. rauno.me states identity in a single sentence and lets an index
   carry the range. vanschneider.com — the closest structural twin, one person
   with a studio and three ventures — names the ventures inline in a two
   sentence bio and lets full-bleed project galleries do the rest.
   brianlovin.com/about runs ~180 words of plain reverse-chronological prose,
   where "Before that…" turns range into an arc instead of a list.

   That last one is the format here, chosen because Hayden's credibility IS the
   order: Mandarin, then the factory floor, then Fortune 100 operations, then
   AI. Prose makes that a trajectory. A grid of cards makes it a résumé.

   NO FACT STRIP. Rounds one and two hung a DYMO strip of Mandarin / Nike /
   Disney under everything. Here the prose names them in sequence, so a strip
   would repeat the section's own sentences three lines later — which is the
   exact habit this whole lab exists to break.
   ------------------------------------------------------------------------ */

/**
 * The arc. Four beats: now, before, how he got there, and what it means for
 * the work today.
 *
 * The shape is deliberately now → back → back → now. A purely reverse
 * chronology reads as a job history; returning to the present at the end is
 * what makes it an argument about how he works rather than a record of where
 * he has been.
 *
 * Every fact is already on the site — WorldPulse and Digital Product Passports
 * from work.ts, the brands from siteContent.ts and personas.ts, Taiwan 2012
 * from the Supply Chain timeline, the builds and the degree from work.ts. The
 * interpretive clauses are new; they are the deliverable.
 */
export const PROSE: string[] = [
  "I’m Hayden. I run WorldPulse, where we build Digital Product Passports — a way to make where a product came from legible to the person holding it, rather than only to a compliance team.",
  "Before that I spent eight years in global sourcing and supply chain operations: procurement, supplier onboarding, compliance and traceability for Nike, Converse, Disney and Aosom, across China, Vietnam and Indonesia.",
  "I got there by moving to Taiwan in 2012 and learning Mandarin first — which is the reason a supplier tells you what is actually going wrong, instead of what is on the report.",
  "I build with AI now; five shipped products, and a master’s in it. But I start where I always started. What counts as a record here, who owns it, and which decision it changes. Automation is worth very little until it has something true to stand on.",
];

/** Sits under the prose in place of a heading. The only label in the section. */
export const PROSE_SIGNOFF = "Between the U.S. and Asia.";

/* ---------------------------------------------------------------------------
   Concepts

   ------------------------------------------------------------------------ */

export type ConceptId = "plain" | "ground";

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
  thesis: string;
  shape: string;
  /** The reference site this treatment is arguing from. */
  reference: string;
  strengths: string[];
  weaknesses: string[];
  moves: SiteMove[];
  seo: { title: string; description: string; schema: string[] };
}

/* Both entries share one set of words. Only the treatment differs, so the
   strengths and weaknesses below are strictly about whether the photograph
   earns its place — everything the copy does is identical. */
export const CONCEPTS: ConceptMeta[] = [
  {
    id: "plain",
    index: "01",
    name: "Plain",
    thesis:
      "145 words of first-person prose on the site's own ground. No heading, no strip, no image.",
    shape:
      "Four paragraphs: now, before, how he got there, and what it means for the work today. The opening paragraph takes the serif; the rest sit in the body sans.",
    reference:
      "brianlovin.com/about — ~180 words, reverse-chronological, no photograph. Also rauno.me and stephango.com, which state identity in one sentence and show no image at all.",
    strengths: [
      "This is what every reference site with Hayden's shape actually does — identity is words, and the imagery lives in the work.",
      "Range reads as a trajectory. “Before that…” makes eight years of sourcing the reason the AI work is credible, rather than a second career competing with it.",
      "Nike, Disney, Mandarin and the master's arrive inside sentences, in order, so they compound instead of repeating.",
      "Nothing to maintain: no art direction, no crop, no interaction, no breakpoint that can break it.",
      "Strongest SEO surface of anything built in this lab — 145 words of natural prose carrying every topic the schema claims.",
    ],
    weaknesses: [
      "It is the least visual thing on a site whose whole argument is visual craft. It will look plain next to the Work chapters, and that is the trade.",
      "145 words is still a reading commitment for a visitor who is skimming.",
      "No photograph means no face; the site's only picture of Hayden would then live in the Work chapters or nowhere.",
      "The format's power is entirely in the writing, so it fails quietly if the voice ever drifts.",
    ],
    moves: [
      { section: "Personas", verb: "drops", detail: "Deleted. Paragraph two says what it said, in one sentence, with the reason attached." },
      { section: "About", verb: "moves", detail: "Becomes this passage, and moves above Connect." },
      { section: "About gallery", verb: "drops", detail: "Five unattached travel photos. The prose does not need them and they were never about anything being said." },
      { section: "Brands carousel", verb: "drops", detail: "Nike, Disney and Aosom are named in paragraph two with the work attached — stronger than a logo belt." },
      { section: "Hero eyebrow", verb: "drops", detail: "Redundant against a section that now introduces the person properly." },
      { section: "Work chapters", verb: "owns", detail: "Own every piece of proof and all the photography. This section shows none." },
      { section: "Let’s work together", verb: "owns", detail: "Owns routing only. Its three paths stop having to explain who he is." },
    ],
    seo: {
      title: "Hayden Baxter | Supply Chain, Applied AI, and WorldPulse",
      description:
        "I run WorldPulse, building Digital Product Passports. Before that, eight years in global sourcing and traceability for Nike, Converse, Disney and Aosom across China, Vietnam and Indonesia.",
      schema: [
        "Person.description can finally be a real sentence instead of a stack of three coined titles.",
        "Person.jobTitle narrows to “Founder, WorldPulse” — one role anyone actually holds.",
        "Every knowsAbout topic is now supported by prose on the same page, in natural language, with no keyword stuffing.",
        "Person.alumniOf becomes defensible: the master's is stated on-page.",
      ],
    },
  },
  {
    id: "ground",
    index: "02",
    name: "Ground",
    thesis:
      "The identical 145 words, set over a photograph. The only question is whether the image earns its place.",
    shape:
      "Same four paragraphs, same order, same type. A full-bleed photographic ground with a directional scrim behind them, and the reading column held left so the copy never crosses the busy half of the frame.",
    reference:
      "vanschneider.com — the closest structural twin to this site: one person, a studio and three ventures, photography-led, with a short bio that names the ventures inline.",
    strengths: [
      "Sits closer to the rest of the homepage. A plain type block risks reading as a different site pasted into the middle of this one.",
      "Gives the section the same weight as a Work chapter, which is an argument that About deserves that weight.",
      "The night coast is already the Consulting chapter's ground, so it borrows a surface the site owns rather than introducing one.",
      "Identical copy to 01, so choosing it costs nothing in words — this is purely a decision about material.",
    ],
    weaknesses: [
      "Contradicts the research. Not one reference site with this shape puts a photograph behind its bio, and the reason is legibility: 145 words over an image is a lot of reading on a busy ground.",
      "The scrim has to be heavy enough to protect four paragraphs, at which point the photograph is mostly darkness and is barely earning its bandwidth.",
      "Risks the exact failure of round two — every concept becoming a variation on “short text over a hero image”.",
      "Ties the section to a crop: the composition has to be re-checked at every width, and a phone sees a very different frame.",
    ],
    moves: [
      { section: "Personas", verb: "drops", detail: "Deleted, exactly as in 01." },
      { section: "About", verb: "moves", detail: "Becomes this passage, above Connect." },
      { section: "About gallery", verb: "drops", detail: "The one photographic ground replaces the five-frame collage." },
      { section: "Brands carousel", verb: "drops", detail: "Named in the prose instead." },
      { section: "Consulting chapter", verb: "owns", detail: "Watch for collision — it already uses this photograph, and reusing it here may read as a repeat rather than as a motif." },
      { section: "Work chapters", verb: "owns", detail: "Still own the proof." },
    ],
    seo: {
      title: "Hayden Baxter | Supply Chain, Applied AI, and WorldPulse",
      description:
        "I run WorldPulse, building Digital Product Passports. Before that, eight years in global sourcing and traceability for Nike, Converse, Disney and Aosom across China, Vietnam and Indonesia.",
      schema: [
        "Identical to 01 — same copy, same entities, same crawlable text.",
        "One extra decorative image with an empty alt, which is correct: it depicts nothing the page is claiming.",
        "Marginal LCP cost the plain treatment does not pay.",
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
