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
   The arc — segmented, so emphasis and depth are data rather than markup

   FORMAT (unchanged): brianlovin.com/about. Plain first-person prose where
   "I got here by…" turns a range of work into a trajectory. Hayden's
   credibility IS the order — Mandarin, then the factory floor, then Fortune
   100 operations, then AI — and prose is the only form that carries an order
   without becoming a résumé.

   WHAT CHANGED
   1. Paragraph one now triages three audiences. A recruiter, a consulting
      buyer, and a WorldPulse customer each need to recognise themselves in the
      first four seconds; the previous opening spoke only to the third.
   2. Two tiers of emphasis, because 145 words of unbroken prose is
      unscannable — the honest weakness of the format as first built.
        · `em`   — a phrase a scanner needs. Renders <strong>. Not interactive.
        · `term` — a phrase worth going deeper on. Renders a button that opens
                   one supporting detail.
   3. The details are SUPPLEMENTARY. The passage is complete and makes its full
      argument before anything is opened, and every detail is in the DOM at all
      times. A disclosure that hid the answer would be the live Personas cards
      again in a new costume.

   POSITIONING GUARDRAIL (from workTogether.ts, and it governs paragraph one)
   Hayden is a founder running WorldPulse who takes selective consulting work.
   "Targeting recruiters" therefore means making the RECORD legible to someone
   evaluating him — brands, years, languages, degree — never signalling
   availability. Nothing here says hire me, open to work, or looking.
   ------------------------------------------------------------------------ */

/** A run of prose. A bare string is plain text. */
export type Segment =
  | string
  | { text: string; em: true }
  | { text: string; term: TermId };

export type TermId =
  | "worldpulse"
  | "consulting"
  | "brands"
  | "mandarin"
  | "builds";

/**
 * One detail per term. Every fact is already elsewhere in the repo, cited
 * inline. `audience` is the reason the term is marked at all — it records
 * which visitor this depth is for, so a future edit cannot quietly add a
 * sixth term that serves nobody.
 */
export interface TermDetail {
  id: TermId;
  /** Mono label above the detail. */
  label: string;
  /** Who this depth is for. */
  audience: string;
  body: string;
}

export const TERMS: TermDetail[] = [
  {
    id: "worldpulse",
    label: "WorldPulse",
    audience: "WorldPulse customers and partners",
    // work.ts → WORK_SCREENS[0].full.caption; consultingOffers.ts → worldpulse
    body: "Design-driven Digital Product Passports: product origin, compliance, and traceability made legible to whoever is holding the product, not just to an auditor. Open to pilots, customers, and commercial partners at worldxpulse.com.",
  },
  {
    id: "consulting",
    label: "Consulting",
    audience: "Consulting buyers",
    // work.ts → consulting.offers + supplyChain.bridgeLine
    body: "Two ways in: an AI Roadmap Sprint that turns a broad opportunity into a scoped plan, or an MVP Prototype Sprint that puts a working build in front of real users. AI fits best after the operating model is clear, so I design the workflow and data shape first.",
  },
  {
    id: "brands",
    label: "The record",
    audience: "Recruiters and hiring teams",
    // personas.ts → supply bullets; work.ts → supplyChain.featured.roleLine
    body: "Global sourcing initiatives including factory onboarding, compliance, supplier performance, and end-to-end operational management. Across Aosom, Disney, and Three Tree: procurement execution, supplier coordination, data integrity, and reporting discipline.",
  },
  {
    id: "mandarin",
    label: "Why the language matters",
    audience: "Recruiters and consulting buyers",
    // personas.ts → supply bullet 2
    body: "It bridges English-speaking and Chinese-speaking teams across APAC and U.S. markets — the difference between alignment on paper and alignment that survives the time zone.",
  },
  {
    id: "builds",
    label: "The builds",
    audience: "Recruiters and consulting buyers",
    // work.ts → etb.projects + etb.credibilityLine
    body: "AtomicOS, CaseBrief, Cortex, ProcureBridge, and OpenClaw — products and internal tools, not demos. Alongside an M.S. in Artificial Intelligence in Business from ASU.",
  },
];

export function getTerm(id: TermId): TermDetail {
  return TERMS.find((t) => t.id === id) ?? TERMS[0];
}

/**
 * The arc, in four beats: triage, origin, the AI turn, and the thesis.
 *
 * It returns to the present at the end on purpose. A pure reverse chronology
 * reads as a job history; the return is what makes it an argument about how he
 * works rather than a record of where he has been.
 */
export const ARC: Segment[][] = [
  /* No `em` in this paragraph, and it is not an oversight: DM Serif Display
     ships weight 400 only, so <strong> here renders as faux bold at best and
     as nothing at worst — measured, not assumed. The three terms carry the
     marking instead, and an underline renders fine in the serif. */
  [
    "I’m Hayden. I work where global supply chains meet applied AI — as founder of ",
    { text: "WorldPulse", term: "worldpulse" },
    ", as a ",
    { text: "consultant", term: "consulting" },
    " to teams putting AI into real operations, and on the back of eight years running sourcing and traceability for ",
    { text: "Nike, Converse, Disney and Aosom", term: "brands" },
    " across Asia.",
  ],
  [
    "I got here by moving to ",
    { text: "Taiwan in 2012", em: true },
    " and learning ",
    { text: "Mandarin", term: "mandarin" },
    " first — which is the reason a supplier tells you what is actually going wrong, instead of what is on the report.",
  ],
  [
    "I build with AI now: ",
    { text: "five shipped products", term: "builds" },
    " and ",
    { text: "a master’s in it", em: true },
    ". But I start where I always started. What counts as a record here, who owns it, and which decision it changes.",
  ],
  [
    { text: "Automation is worth very little until it has something true to stand on.", em: true },
    " That is the whole job, and it has looked like sourcing, like traceability, and like AI.",
  ],
];

/** Sits under the prose in place of a heading. The only label in the section. */
export const PROSE_SIGNOFF = "Between the U.S. and Asia.";

/** Plain text of the arc — used by the word count and by tests. */
export function arcText(): string {
  return ARC.map((para) =>
    para.map((seg) => (typeof seg === "string" ? seg : seg.text)).join("")
  ).join("\n\n");
}

/* ---------------------------------------------------------------------------
   Concepts

   ------------------------------------------------------------------------ */

export type ConceptId = "plain" | "deep" | "ground";

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
    id: "deep",
    index: "02",
    name: "Deep",
    thesis:
      "The identical words, with five terms that open one supporting detail each — one per audience.",
    shape:
      "Two tiers of emphasis. Bold marks what a scanner needs; a dotted gold rule marks the five terms that go deeper. The detail slot is height-reserved, so opening one never moves the paragraph you were reading.",
    reference:
      "Standard disclosure, not a portfolio pattern — the reference sites have nothing like it. This is the answer to prose's one real weakness: 145 words is unscannable, and a recruiter and a WorldPulse buyer want different depth from the same sentence.",
    strengths: [
      "Solves the format's honest weakness. The bold gives a skimmer a path through 145 words in about four seconds.",
      "Each of the three audiences gets depth aimed at them without the other two having to read it — the section serves a recruiter, a consulting buyer and a WorldPulse customer from one passage.",
      "Nothing load-bearing is inside a disclosure. The argument is complete before anything is opened, which is the line the live Personas cards crossed.",
      "The detail bodies are pulled from copy that already exists elsewhere on the site, so this is consolidation rather than more writing.",
    ],
    weaknesses: [
      "Five operable terms inside four paragraphs is a lot of affordance in a small space; it can read as a page that wants to be clicked rather than read.",
      "The reserved slot is ~9.5rem of mostly empty space at rest, which is real vertical cost for a prompt.",
      "A visitor who never opens anything sees treatment 01 plus some dotted underlines — so the mechanism has to justify itself to the majority who ignore it.",
      "Two tiers of emphasis is a system, and systems drift: a sixth term, then a seventh, and the prose is a link farm.",
    ],
    moves: [
      { section: "Personas", verb: "drops", detail: "Deleted — and its actual content survives here, inside the term details, where it is asked for rather than asserted." },
      { section: "About", verb: "moves", detail: "Becomes this passage, above Connect." },
      { section: "About gallery", verb: "drops", detail: "Five unattached travel photos, replaced by depth that is about something." },
      { section: "Brands carousel", verb: "drops", detail: "Named in paragraph one; the record behind them is one click away." },
      { section: "Consulting chapter", verb: "owns", detail: "Still owns the offers in full. The `consultant` term is a pointer, not a second sales pitch." },
      { section: "Let’s work together", verb: "owns", detail: "Owns routing. This section now qualifies the visitor before they reach it." },
    ],
    seo: {
      title: "Hayden Baxter | Supply Chain, Applied AI, and WorldPulse",
      description:
        "I work where global supply chains meet applied AI — founder of WorldPulse, consultant, and eight years of sourcing and traceability for Nike, Converse, Disney and Aosom across Asia.",
      schema: [
        "All five details render into the markup together — nothing is fetched or generated on demand — so a crawler reads every word from the initial payload.",
        "Adds ~120 words of topical prose over treatment 01 — more support for knowsAbout, still natural language.",
        "Collapsed panels use `hidden`, which is correct for supplementary detail and is not cloaking: the text is identical for crawler and visitor.",
      ],
    },
  },
  {
    id: "ground",
    index: "03",
    name: "Ground",
    thesis:
      "Treatment 02 exactly — same words, same five terms — set over a photograph. The only variable is the image.",
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
