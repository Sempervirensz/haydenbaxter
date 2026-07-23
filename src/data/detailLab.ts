// Detail-page layout lab. A single DUMMY project carries every candidate
// content block so the variants below can experiment with arrangement.
// Real projects (Cortex, AtomicOS, CaseBrief) get reformatted to whichever
// pattern wins — this lab is about the wireframe, not final copy.

export interface LabStat {
  value: string;
  label: string;
  detail: string;
}

export interface LabScreenshot {
  /** Placeholder uses a label + tint; no real image needed for wireframing. */
  label: string;
  caption: string;
  /** Aspect ratio as width/height, drives the placeholder frame. */
  ratio: number;
  tint: string;
  /** "phone" renders a narrow portrait frame. */
  variant?: "wide" | "phone";
}

export interface LabContentBox {
  kind: "note" | "callout" | "metric" | "quote";
  label?: string;
  title?: string;
  body: string;
}

export interface LabMetaItem {
  label: string;
  value: string;
}

export interface LabProject {
  mark: string;
  category: string;
  name: string;
  oneLiner: string;
  tags: string[];
  badge: string;
  status: string;
  summary: string;
  problem: string;
  meta: LabMetaItem[];
  stack: string[];
  stats: LabStat[];
  screenshots: LabScreenshot[];
  pullQuote: { text: string; attribution: string };
  contentBoxes: LabContentBox[];
  techBreakdown: string[];
  outcomes: string[];
  lessonsLearned: string[];
  liveUrl: string;
  liveLabel: string;
}

export const DUMMY_PROJECT: LabProject = {
  mark: "/assets/cortex-mark.webp",
  category: "Project Category",
  name: "Project Name",
  oneLiner:
    "A one-line positioning statement that frames the build in a single confident sentence.",
  tags: ["Tag One", "Tag Two", "Tag Three"],
  badge: "Demo showcase",
  status: "Prototype",
  summary:
    "An opening paragraph that sets the stakes — what the system is, the single biggest problem it solves, and the shape of the result. Long enough to give the reader a real mental model, short enough that they keep going. This is the lede that every other block hangs off of.",
  problem:
    "The expensive failure mode this build exists to prevent, stated plainly. One or two sentences naming the pain, who feels it, and why the obvious approaches fall short.",
  meta: [
    { label: "Role", value: "Design + Build" },
    { label: "Timeline", value: "6 weeks" },
    { label: "Team", value: "Solo" },
    { label: "Stage", value: "Working prototype" },
  ],
  stack: ["Next.js", "TypeScript", "Postgres", "Tailwind", "Edge Functions"],
  stats: [
    { value: "93", label: "Primary metric", detail: "What this number measures" },
    { value: "+22pp", label: "Lift", detail: "Improvement against baseline" },
    { value: "<30s", label: "Speed", detail: "Time to the key result" },
    { value: "9", label: "Coverage", detail: "Breadth of the system" },
  ],
  screenshots: [
    { label: "Overview", caption: "The cockpit — the primary view a user lands on.", ratio: 16 / 10, tint: "cobalt" },
    { label: "Detail view", caption: "A focused secondary screen showing depth.", ratio: 16 / 10, tint: "violet" },
    { label: "Data state", caption: "How the system represents its core object.", ratio: 16 / 10, tint: "teal" },
    { label: "Pipeline", caption: "The workflow encoded as a visible structure.", ratio: 16 / 10, tint: "amber" },
    { label: "Mobile", caption: "The art-directed small-screen capture.", ratio: 9 / 19, tint: "rose", variant: "phone" },
  ],
  pullQuote: {
    text: "A short, quotable line that captures the thesis of the project in one breath.",
    attribution: "The takeaway",
  },
  contentBoxes: [
    { kind: "note", label: "Context", title: "A framed note", body: "A supporting paragraph that adds context without earning its own full section. Good for caveats, background, or a design rationale." },
    { kind: "callout", label: "Key idea", title: "A callout box", body: "A highlighted idea you want the reader to stop on — the one insight that reframes how they read the rest of the page." },
    { kind: "metric", label: "By the numbers", title: "An inline metric", body: "A number with a sentence of meaning, used when a full stat tile row would be too heavy." },
  ],
  techBreakdown: [
    "First architectural decision and the substrate it runs on, stated as a portable, durable choice.",
    "A custom piece of tooling that is the difference between a config and a product.",
    "The data model / schema decision that makes the system queryable rather than just stored.",
    "How automation or AI is bounded so it accelerates without compromising correctness.",
  ],
  outcomes: [
    "The headline result, encoded directly into how the system works rather than bolted on.",
    "The default-safe behavior that makes the bad outcome structurally hard.",
    "The breadth of coverage the system reaches in its current state.",
  ],
  lessonsLearned: [
    "The general principle this build taught, phrased so it transfers to the next project.",
    "The thing that only works if it is cheap — the friction lesson.",
    "Where custom beats configuration, and where it does not.",
  ],
  liveUrl: "#",
  liveLabel: "Open live demo",
};

// ---- Variants ----

export type VariantId =
  | "classic"
  | "screens-first"
  | "split-rail"
  | "meta-sidebar"
  | "editorial"
  | "dossier"
  | "tabbed"
  | "accordion"
  | "mosaic"
  | "story-scroll"
  | "centered"
  | "hero-banner";

export interface VariantDef {
  id: VariantId;
  code: string;
  label: string;
  description: string;
}

export const VARIANTS: VariantDef[] = [
  { id: "classic", code: "V01", label: "Classic Stack", description: "Single column, sections stacked top to bottom. The current pattern, refined." },
  { id: "screens-first", code: "V02", label: "Screens First", description: "Screenshot carousel leads as a hero; narrative follows underneath." },
  { id: "split-rail", code: "V03", label: "Split Rail", description: "Two columns — narrative left, sticky media right. Collapses on mobile." },
  { id: "meta-sidebar", code: "V04", label: "Meta Sidebar", description: "Left rail holds stats / role / stack; main content fills the right." },
  { id: "editorial", code: "V05", label: "Editorial", description: "Alternating full-width media and text rows with a large pull-quote." },
  { id: "dossier", code: "V06", label: "Dossier", description: "Dense, DYMO-label driven, compact rows. Maximum information density." },
  { id: "tabbed", code: "V07", label: "Tabbed", description: "Sections live behind tabs: Overview / Screens / Tech / Outcomes." },
  { id: "accordion", code: "V08", label: "Accordion", description: "Collapsible sections — expand and contract each block in place." },
  { id: "mosaic", code: "V09", label: "Mosaic", description: "A grid of content cards rather than a vertical stack." },
  { id: "story-scroll", code: "V10", label: "Story Scroll", description: "Sticky section nav with scroll-spy down a long narrative." },
  { id: "centered", code: "V11", label: "Centered Column", description: "Narrow, centered editorial column — generous margins, reading-first." },
  { id: "hero-banner", code: "V12", label: "Hero Banner", description: "Full-bleed screenshot banner with overlaid title, then content." },
];

// ---- Toggleable sections ----

export type SectionKey =
  | "badge"
  | "summary"
  | "problem"
  | "meta"
  | "stack"
  | "stats"
  | "screenshots"
  | "pullQuote"
  | "contentBoxes"
  | "techBreakdown"
  | "outcomes"
  | "lessonsLearned"
  | "cta";

export interface SectionDef {
  key: SectionKey;
  label: string;
}

export const SECTIONS: SectionDef[] = [
  { key: "badge", label: "Badge / status" },
  { key: "summary", label: "Summary lede" },
  { key: "problem", label: "Problem statement" },
  { key: "meta", label: "Role / timeline meta" },
  { key: "stack", label: "Stack chips" },
  { key: "stats", label: "Stat tiles" },
  { key: "screenshots", label: "Screenshots" },
  { key: "pullQuote", label: "Pull-quote" },
  { key: "contentBoxes", label: "Content boxes" },
  { key: "techBreakdown", label: "Technical breakdown" },
  { key: "outcomes", label: "Outcomes" },
  { key: "lessonsLearned", label: "Lessons learned" },
  { key: "cta", label: "Live CTA" },
];

export type SectionState = Record<SectionKey, boolean>;

export const DEFAULT_SECTIONS: SectionState = {
  badge: true,
  summary: true,
  problem: true,
  meta: true,
  stack: true,
  stats: true,
  screenshots: true,
  pullQuote: true,
  contentBoxes: true,
  techBreakdown: true,
  outcomes: true,
  lessonsLearned: true,
  cta: true,
};

export type ViewportMode = "desktop" | "mobile";
export type Density = "spacious" | "compact";
export type ShotMode = "carousel" | "grid" | "stacked";
