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

/** The route, from the live Supply Chain chapter's timeline. */
export interface Stop {
  year: string;
  place: string;
  /** What happened — carried from the live timeline copy. */
  fact: string;
  /** What it made possible for the next stop. New interpretive line. */
  voice: string;
}

export const ROUTE: Stop[] = [
  {
    year: "2012",
    place: "Taiwan",
    fact: "Built Mandarin and cultural fluency — the language skills and adaptability that later strengthened supplier relationships and international operations.",
    voice:
      "Not a credential. It is the reason a supplier tells you what is actually going wrong instead of what is on the report.",
  },
  {
    year: "2016",
    place: "China",
    fact: "Real-world sourcing experience: practical exposure to supplier management, operations, and procurement processes.",
    voice:
      "Procurement stops being an abstraction the first time you are standing on the floor it describes.",
  },
  {
    year: "2022",
    place: "New York",
    fact: "Fortune 100 operational experience across procurement, finance, and legal — vendor onboarding, contract coordination, large-scale operational launches.",
    voice:
      "Where I learned the difference between a good idea and one a large organisation can actually absorb.",
  },
  {
    year: "2023–24",
    place: "Southeast Asia",
    fact: "Supplier data, onboarding, and compliance systems supporting global manufacturing and traceability operations.",
    voice:
      "Traceability turns out to be a data-modelling problem wearing a logistics costume.",
  },
  {
    year: "Now",
    place: "WorldPulse · AI builds",
    fact: "Founder at WorldPulse building Digital Product Passports, plus an M.S. in Artificial Intelligence in Business and a run of shipped AI products.",
    voice: "Everything above is the training data. AI came last on purpose.",
  },
];

/** Problem-first framing — the questions a visitor actually arrives with. */
export interface Ask {
  /** In the visitor's voice. */
  question: string;
  /** What the problem usually turns out to be. */
  reframe: string;
  /** What Hayden does about it, in the site's existing vocabulary. */
  answer: string;
  /** Which existing offer or surface it resolves into. */
  resolves: string;
}

export const ASKS: Ask[] = [
  {
    question: "We have run three AI pilots. None of them reached a workflow.",
    reframe: "The pilot was rarely the problem. The workflow underneath it was never designed.",
    answer:
      "I map where the work actually gets stuck, rank the openings by feasibility against business leverage, and scope one pilot with acceptance criteria you can hold it to.",
    resolves: "AI Roadmap Sprint",
  },
  {
    question: "We cannot prove where this product came from.",
    reframe: "Provenance is a data-shape question long before it is a compliance one.",
    answer:
      "I build the record — supplier, material, process — so the audit trail is something you verify rather than reconstruct, and so the story is legible to a customer, not just to a regulator.",
    resolves: "WorldPulse · Digital Product Passports",
  },
  {
    question: "Our supplier data lives in three spreadsheets and a WeChat thread.",
    reframe: "Two teams mean different things by the same field, and no dashboard reconciles that.",
    answer:
      "I settle what each field means and who owns it, standardise the status logic, and make exceptions something reviewed on purpose instead of buried in a snapshot.",
    resolves: "Supplier ops + data governance",
  },
  {
    question: "Our team in Asia and our team here keep agreeing, and then not agreeing.",
    reframe: "Alignment usually failed at translation, not at intent.",
    answer:
      "Eight-plus years working in Mandarin across China, Vietnam, and Indonesia — I sit in both rooms and make the handoff explicit enough to survive the time zone.",
    resolves: "International coordination",
  },
  {
    question: "We know what to build. We need it standing up by next quarter.",
    reframe: "Most prototypes die of scope, not of difficulty.",
    answer:
      "I build the smallest version that a real user can hold, in front of the people who have to live with it, and hand it over in a state someone else can carry.",
    resolves: "MVP Prototype Sprint",
  },
];

/** The three moves, used by Throughline. */
export const METHOD: { label: string; line: string }[] = [
  {
    label: "See the system",
    line: "Sit inside the operation until the real constraint is obvious. It is usually not the one in the brief.",
  },
  {
    label: "Shape the record",
    line: "Decide what a record means and who owns it. Every automation downstream inherits that decision.",
  },
  {
    label: "Build the thing",
    line: "Ship the smallest working version to the people who have to use it, then keep it alive.",
  },
];

/** The same job, in three rooms. Used by Throughline. */
export const ROOMS: {
  room: string;
  area: string;
  line: string;
  proof: string;
}[] = [
  {
    room: "In a factory",
    area: "Global supply chain",
    line: "The constraint is a supplier who will not say the schedule slipped. The record is what “shipped” means to four teams. The thing is the operating rhythm that survives the next disruption.",
    proof: "Nike · Converse · Disney · Aosom — sourcing, procurement, compliance, traceability",
  },
  {
    room: "In a codebase",
    area: "Applied AI",
    line: "The constraint is a workflow nobody mapped. The record is the data shape a model has to stand on. The thing is a tool someone uses on a Tuesday without being asked to.",
    proof: "AtomicOS · CaseBrief · Cortex · ProcureBridge — and an M.S. in AI in Business",
  },
  {
    room: "In a product",
    area: "WorldPulse",
    line: "The constraint is that provenance is invisible. The record is the passport itself. The thing is a product story a customer can read without a compliance background.",
    proof: "Founder — design-driven Digital Product Passports",
  },
];

/** Plain-text concept. First person, no titles. */
export const PLAIN: string[] = [
  "I’m Hayden. For about eight years my job was making sure things made a long way away arrived the way they were supposed to. Most of that time was spent in Taiwan, China, and Southeast Asia, in Mandarin, in rooms where the spreadsheet and the factory floor disagreed.",
  "You learn one specific thing doing that. At the point where an operational problem actually hurts, it is almost never a technology problem. It is a definitions problem. Two teams mean different things by “shipped”, and no dashboard ever built reconciles that for them.",
  "So when I build with AI now — and I do, mostly products, internal tools, and prototypes — I start where I used to start. What is a record here. Who owns it. Which decision does it change. Automation is worth very little until it has something true to stand on, and it compounds quickly once it does.",
  "WorldPulse is that argument in product form. Supply chain data is usually cold, hidden, and technical; a Digital Product Passport is an attempt to make the same facts legible to the person holding the product. It is the venture I run, and it is where most of my week goes.",
  "The rest of the week is consulting — teams who need the operating model made clear before the AI, or a working prototype in front of real users, or both.",
];

/** The margin index for the plain-text concept. Quiet metadata, not claims. */
export const MARGIN: string[] = [
  "Fluent in Mandarin",
  "8+ years across Asia",
  "Nike · Converse",
  "Disney · Aosom",
  "M.S. AI in Business, ASU",
  "Founder, WorldPulse",
];

/** Passport concept — the DPP structure applied to a person. */
export const PASSPORT: {
  field: string;
  hint: string;
  values: { value: string; note?: string }[];
}[] = [
  {
    field: "Origin",
    hint: "Where the work was formed",
    values: [
      { value: "Taiwan, 2012", note: "Mandarin, cultural fluency" },
      { value: "China, 2016", note: "Sourcing, supplier management" },
      { value: "New York, 2022", note: "Fortune 100 operations" },
      { value: "Southeast Asia, 2023–24", note: "Traceability systems" },
    ],
  },
  {
    field: "Composition",
    hint: "What the practice is made of",
    values: [
      { value: "Operations" },
      { value: "Mandarin" },
      { value: "Systems design" },
      { value: "Applied AI" },
      { value: "Product" },
    ],
  },
  {
    field: "Chain of custody",
    hint: "Who the work passed through",
    values: [
      { value: "Nike · Converse", note: "Global sourcing, factory onboarding, compliance" },
      { value: "Disney", note: "Procurement, finance, legal coordination" },
      { value: "Aosom", note: "Procurement execution, data governance" },
      { value: "WorldPulse", note: "Founder — Digital Product Passports" },
    ],
  },
  {
    field: "Verified",
    hint: "Each claim has somewhere to check it",
    values: [
      { value: "M.S. Artificial Intelligence in Business, ASU", note: "Resume" },
      { value: "Five shipped AI builds", note: "Selected AI Work" },
      { value: "Digital Product Passports in market", note: "worldxpulse.com" },
      { value: "Sourcing and procurement record", note: "LinkedIn" },
    ],
  },
  {
    field: "Current state",
    hint: "What is live right now",
    values: [
      { value: "Active — founder-led", note: "WorldPulse is the main build" },
      { value: "Selective consulting", note: "AI roadmap or prototype work" },
    ],
  },
];

/* ---------------------------------------------------------------------------
   Concepts
   ------------------------------------------------------------------------ */

export type ConceptId =
  | "throughline"
  | "route"
  | "asks"
  | "plain"
  | "passport";

export interface SiteMove {
  /** A production section. */
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
  strengths: string[];
  weaknesses: string[];
  /** What the rest of the homepage does if this one ships. */
  moves: SiteMove[];
  /** Proposed section heading, replacing "About" / "Personas". */
  heading: string;
  seo: {
    title: string;
    description: string;
    /** Structured-data deltas this concept supports honestly. */
    schema: string[];
  };
}

export const CONCEPTS: ConceptMeta[] = [
  {
    id: "throughline",
    index: "01",
    name: "Throughline",
    thesis:
      "It has been one job the whole time. AI, supply chain, and WorldPulse are the same method in three rooms.",
    shape:
      "One statement held large, the method named in three moves, then the three areas demoted from identities to worked examples of that method — each carrying its own credibility inline.",
    strengths: [
      "The only concept that answers the question the brief actually asks: why is this one person?",
      "Kills Personas outright — the three areas appear once, as evidence, not as three job titles.",
      "Promotes the site’s buried thesis (the supply-chain bridge line) to the position it earns.",
      "Reads as a point of view rather than a claim, which is what separates it from a résumé.",
    ],
    weaknesses: [
      "The whole section rests on one sentence. If a visitor does not buy it, there is no second door.",
      "Abstract until the three rooms land — the opening statement is doing a lot of unassisted work.",
      "Least literal about credentials; Nike and Disney arrive as supporting detail, not as headline.",
    ],
    moves: [
      { section: "Personas", verb: "drops", detail: "Deleted. Its three areas are the three rooms, stated once." },
      { section: "About", verb: "moves", detail: "Becomes this section, and moves above Connect." },
      { section: "Hero", verb: "owns", detail: "Keeps the three-area headline — it is now a promise the identity section pays off, not a duplicate." },
      { section: "Hero eyebrow", verb: "drops", detail: "“View the work, the supply chain background, and where WorldPulse fits in” is the heading again in navigation grammar." },
      { section: "Work chapters", verb: "owns", detail: "Own the proof: what was built, where, and what it did." },
      { section: "Let’s work together", verb: "owns", detail: "Owns routing only. Its three paths stop having to explain who he is." },
    ],
    heading: "One job, three rooms",
    seo: {
      title: "Hayden Baxter | Systems, Supply Chain, and Applied AI",
      description:
        "Hayden Baxter makes complicated operations legible — in factories, in codebases, and in products. Eight-plus years in global sourcing across Asia, now building applied AI and Digital Product Passports at WorldPulse.",
      schema: [
        "Person.description rewritten to the throughline rather than the three-title stack.",
        "Person.jobTitle narrows to “Founder, WorldPulse” — one real role instead of three coined ones.",
        "Person.knowsAbout keeps its seven topics; they are now supported by prose on the same page.",
      ],
    },
  },
  {
    id: "route",
    index: "02",
    name: "The Route",
    thesis:
      "The order it happened in is the differentiator. Operations first, Mandarin first, AI last — on purpose.",
    shape:
      "Five stops, each stating what it made possible for the next. The compounding is the argument; the credential strip is a consequence of the route rather than a list beside it.",
    strengths: [
      "Credibility that accumulates instead of repeating — the single hardest thing the live page fails at.",
      "Genuinely differentiated: plenty of people know AI, far fewer learned a factory floor in Mandarin first.",
      "Uses copy the site already owns (the Supply Chain timeline), so it consolidates rather than adds.",
      "Answers “what makes his background credible” without a single coined title.",
    ],
    weaknesses: [
      "Closest of the five to a résumé; it survives only if every stop keeps its interpretive line.",
      "Duplicates the Supply Chain chapter’s timeline unless production gives that one up — a bigger change than the others require.",
      "Chronology implies “career so far”, which reads more backward-looking than the other four.",
    ],
    moves: [
      { section: "Personas", verb: "drops", detail: "Deleted. The route carries the same facts with a reason attached." },
      { section: "Supply Chain timeline", verb: "drops", detail: "Moves here. The chapter keeps the map, the quote lines, and the featured operator story." },
      { section: "About", verb: "moves", detail: "Becomes this section, above Connect. The paragraph goes." },
      { section: "Brands carousel", verb: "drops", detail: "Nike / Disney / Aosom appear inside the route with dates and context, which is stronger than a logo belt." },
      { section: "Let’s work together", verb: "drops", detail: "“Review My Experience” collapses into this section — it is the same content, better told." },
    ],
    heading: "How I got here, in order",
    seo: {
      title: "Hayden Baxter | Global Sourcing, Mandarin, and Applied AI",
      description:
        "Taiwan, China, New York, Southeast Asia — eight-plus years in global sourcing, procurement, and traceability, in Mandarin. Now founder of WorldPulse, building Digital Product Passports and applied AI.",
      schema: [
        "Person.alumniOf becomes supportable — ASU appears with the rest of the route on-page.",
        "Person.workLocation / nationality left alone: the route names cities of work, which is not the same claim.",
        "Strong entity signal for “Mandarin”, “APAC sourcing”, “traceability” from real surrounding prose.",
      ],
    },
  },
  {
    id: "asks",
    index: "03",
    name: "What to Bring Me",
    thesis:
      "Identity by fit. Do not describe the person — show the problems they can be handed.",
    shape:
      "Five problems in the visitor’s own words, each reframed and then answered, resolving into an existing offer. Who is answering arrives last, small.",
    strengths: [
      "Directly answers the brief’s hardest requirement: what someone should contact him about.",
      "Turns identity into recognition — a visitor sees their own situation before they see a title.",
      "The most natural SEO surface on the site: real long-tail phrasing, no keyword stuffing needed.",
      "Zero coined titles, zero inflated language; the copy is diagnostic rather than promotional.",
    ],
    weaknesses: [
      "Offer-shaped, so it collides with “Let’s work together” — one of the two must give up ground.",
      "Says nothing to a visitor who is not in a buying posture: a partner, an investor, or a recruiter gets no read on the person.",
      "Five problems is a lot of reading; the format tempts a sixth and a seventh until it becomes a services menu.",
    ],
    moves: [
      { section: "Personas", verb: "drops", detail: "Deleted. What each area covers is now stated as a problem someone brings." },
      { section: "Let’s work together", verb: "moves", detail: "Demotes to a routing row — three destinations, no explanatory copy. This section does the qualifying." },
      { section: "Consulting chapter", verb: "drops", detail: "The offer bullets duplicate these answers; the chapter keeps the two named sprints only." },
      { section: "About", verb: "moves", detail: "Becomes this section plus a two-line “who’s answering”, above Connect." },
      { section: "Connect", verb: "owns", detail: "Gains the strongest hand-off on the page: the visitor arrives having already recognised their problem." },
    ],
    heading: "What to bring me",
    seo: {
      title: "Hayden Baxter | AI Strategy and Supply Chain Consulting",
      description:
        "Stalled AI pilots, unprovable product origins, supplier data spread across three spreadsheets — the problems I take on, and what I do with them. Founder of WorldPulse; eight-plus years in global sourcing.",
      schema: [
        "Supports a real FAQPage graph: five question/answer pairs already in the visible copy.",
        "Person.knowsAbout gains on-page evidence for each topic rather than asserting a list.",
        "Risk to watch: FAQ markup is only legitimate while these stay genuine questions, not slogans.",
      ],
    },
  },
  {
    id: "plain",
    index: "04",
    name: "Plain Text",
    thesis:
      "Drop every title and just talk. Credentials belong in the margin, not in the sentence.",
    shape:
      "One sustained first-person passage in the site’s serif and sans, with the credential strip demoted to a quiet mono index alongside it. No cards, no labels, no disclosure.",
    strengths: [
      "The furthest thing on the site from a consulting brochure — which is the stated design goal.",
      "Voice is the differentiator no competitor can copy; specifics like “the spreadsheet and the factory floor disagreed” do more than any title.",
      "Best raw SEO material: real prose carrying real terminology in natural language.",
      "Cheapest to maintain and the only concept with no interaction to get wrong.",
    ],
    weaknesses: [
      "Unscannable by design. A visitor skimming at speed leaves with nothing.",
      "No hook — nothing on screen rewards a glance, which is most of the traffic.",
      "Puts all the weight on the writing; it fails quietly and completely if the voice ever drifts.",
    ],
    moves: [
      { section: "Personas", verb: "drops", detail: "Deleted. Everything it asserted is said once, in a sentence, with a reason." },
      { section: "About", verb: "moves", detail: "Becomes this passage, above Connect." },
      { section: "Brands carousel", verb: "drops", detail: "Nike / Disney / Aosom move into the margin index, where they read as fact rather than as endorsement." },
      { section: "Hero eyebrow", verb: "drops", detail: "Redundant against a section that now introduces the person properly." },
      { section: "Work chapters", verb: "owns", detail: "Carry all the proof. This section deliberately shows none." },
    ],
    heading: "About",
    seo: {
      title: "Hayden Baxter | Supply Chain, Applied AI, and WorldPulse",
      description:
        "Eight-plus years making sure things built a long way away arrived as promised — in Mandarin, across Taiwan, China, and Southeast Asia. Now building applied AI products and Digital Product Passports at WorldPulse.",
      schema: [
        "Person.description can finally be a real sentence rather than a title stack.",
        "Highest natural-language density of the five — strongest passage-level retrieval material.",
        "No new schema types; this concept improves what exists rather than adding nodes.",
      ],
    },
  },
  {
    id: "passport",
    index: "05",
    name: "Provenance",
    thesis:
      "Prove the product by using it. A Digital Product Passport, applied to the person who builds them.",
    shape:
      "Origin, composition, chain of custody, verified claims, current state — the DPP fields, each pointing at somewhere the claim can be checked.",
    strengths: [
      "Demonstrates WorldPulse instead of describing it — the section is the pitch.",
      "“Every claim has somewhere to check it” is an unusually honest credibility device, and it is the exact opposite of an inflated title.",
      "Structurally impossible to mistake for a résumé, which no other concept can fully claim.",
      "Makes the sustainability and traceability vocabulary native rather than bolted on.",
    ],
    weaknesses: [
      "Highest gimmick risk of the five. If the metaphor is not instantly legible it costs comprehension rather than adding it.",
      "Teaches the visitor what a DPP is at the moment they were trying to learn who Hayden is — two jobs, one section.",
      "Over-indexes identity on the venture; if WorldPulse ever changes shape, so does the About section.",
      "A person rendered as a product is a register that will not suit every reader.",
    ],
    moves: [
      { section: "Personas", verb: "drops", detail: "Deleted. Composition and chain of custody carry the same three areas." },
      { section: "About", verb: "moves", detail: "Becomes the passport, above Connect." },
      { section: "WorldPulse chapter", verb: "drops", detail: "Stops having to explain what a Digital Product Passport is — this section already showed one." },
      { section: "Brands carousel", verb: "drops", detail: "Chain of custody states the same names with the work attached." },
      { section: "Let’s work together", verb: "owns", detail: "Owns routing. “Current state” hands off to it explicitly." },
    ],
    heading: "Provenance",
    seo: {
      title: "Hayden Baxter | Digital Product Passports and Traceable Supply Chains",
      description:
        "Founder of WorldPulse, building design-driven Digital Product Passports. Eight-plus years in global sourcing and traceability across Asia, in Mandarin, now applied to AI products and sustainability technology.",
      schema: [
        "Strongest Organization ↔ Person join: WorldPulse is demonstrated, not just linked.",
        "Every verified-claim row is a real outbound citation — good for entity reconciliation.",
        "Keep it CreativeWork-free: the passport is a layout, not a product listing, and marking it up as one would be a misrepresentation.",
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
