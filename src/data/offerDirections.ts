// Offer pages — ART DIRECTION axis, and the per-offer templates.
//
// This file adds two things to the offer lab and changes nothing about the
// structure, which DECISION.md settles: the offers are routes, one scroll, no
// nested scrollers. What was missing was a LOOK, and a reason for the three
// pages to differ from one another.
//
//   `direction`  how the page LOOKS — five complete treatments plus the
//                baseline that ships today, so the comparison includes the
//                real thing rather than a memory of it.
//
//   `kind`       what the offer IS — service | venture | credential. This
//                drives section ORDER and EMPHASIS, not styling. It is the
//                answer to "the three offers are not parallel and the template
//                pretends they are".
//
// No copy is invented here. Every section below is an arrangement of material
// that already exists in `src/data/workTogether.ts`.

import { PATHS, type PathId } from "@/data/workTogether";

/* ---------------------------------------------------------------------------
   Directions

   These are deliberately NOT one idea in five colourways. Each one leads with
   a different asset — the photograph, the scroll, the surface, the furniture,
   the typography — and each gives something up to do it. The `cost` field is
   as load-bearing as the `note`: a direction with no stated cost has not been
   thought about hard enough to choose.
   ------------------------------------------------------------------------ */

export type OfferDirectionId =
  | "baseline"
  | "cinematic"
  | "chaptered"
  | "alternating"
  | "furniture"
  | "broadsheet";

export interface OfferDirection {
  id: OfferDirectionId;
  name: string;
  /** One line for the control panel. */
  note: string;
  /** What leading with this asset buys. */
  buys: string;
  /** What it costs. Never empty. */
  cost: string;
  /** Whether the direction renders the photograph. Drives asset preloading. */
  usesPhoto: boolean;
  /** Whether the direction has scroll-driven motion to switch off. */
  usesMotion: boolean;
}

export const OFFER_DIRECTIONS: OfferDirection[] = [
  {
    id: "baseline",
    name: "0 · Baseline",
    note: "What ships today — the structural layouts, no art direction.",
    buys:
      "The control. Every other direction is judged against the real current page rather than against a memory of it, and the structural layout axis stays usable underneath.",
    cost:
      "It is the thing being replaced: flat, one tonal value top to bottom, no imagery, no motion, and none of the vocabulary of the row that opens it.",
    usesPhoto: false,
    usesMotion: false,
  },
  {
    id: "cinematic",
    name: "A · Cinematic",
    note: "Photograph-led. Full-bleed statue hero, sharp, then drops into type.",
    buys:
      "Continuity with the door. You press a near-white bar over a night photograph and land on the same photograph — the page is visibly the next room. It also puts the site's strongest asset back to work instead of throwing it away, and gives the page an unmistakable top.",
    cost:
      "The statue is CONSULTING's identity — it is the Work chapter's own plate. Reusing it on WorldPulse and Experience spends that association three times and weakens it everywhere. A 2.5MB PNG also lands on a page whose job is to be linked and opened cold, and the hero needs a real art-directed crop per breakpoint or the statue leaves the frame.",
    usesPhoto: true,
    usesMotion: true,
  },
  {
    id: "chaptered",
    name: "B · Chaptered",
    note: "The page as its own scroll. Numbered movements, sticky chapter rail.",
    buys:
      "Beats. Hero, proof, method, ask become distinct movements with a rail that tracks where you are, which is the site's own scroll vocabulary applied to a page that currently has none. It is the only direction that fixes 'one continuous column' structurally rather than decoratively.",
    cost:
      "Real machinery — an IntersectionObserver, an active-chapter state, and a rail that has to go somewhere at 390px. It also needs enough material per movement; with two proof blocks and a signals strip, a five-chapter page risks chapters that are one paragraph long, which reads as padding.",
    usesPhoto: false,
    usesMotion: true,
  },
  {
    id: "alternating",
    name: "C · Alternating",
    note: "Surface rhythm. Dark hero, paper proof slab, dark close.",
    buys:
      "Tonal rhythm from surfaces the site already owns, with no new colour and no imagery cost. The paper slab makes the proof read as a document handed to you, and the dark close returns the ask to the site's ground. It is the cheapest direction that genuinely fixes 'one tonal value throughout'.",
    cost:
      "Two token sets live in one page: the accent has to invert mid-scroll — gold darkens to #8a6a1f on paper, blue drops back to #2563eb — and every component inside a band has to be correct on both. Band edges are also unforgiving at narrow widths, where a full-bleed slab with content at a measure can leave heavy dead margins.",
    usesPhoto: false,
    usesMotion: false,
  },
  {
    id: "furniture",
    name: "D · Furniture",
    note: "Signature objects. DYMO plates for metadata, candy bars for capabilities.",
    buys:
      "The most literal continuation of the door. The candy bar, the DYMO plate and the mono-at---track-dymo label arrive on the page in the same materials the row used, so the vocabulary is unbroken and the page could not belong to another site.",
    cost:
      "In the CTA row the candy bar is a CONTROL — it is pressable and it fills cobalt when you touch it. Using the same object for a non-interactive capability list teaches a false affordance, and visitors will click it. The bars have to be visibly demoted (no cobalt, no chevron, no sheen) or the vocabulary becomes a lie.",
    usesPhoto: false,
    usesMotion: false,
  },
  {
    id: "broadsheet",
    name: "E · Broadsheet",
    note: "Type-led magazine. Drop cap, pull quote, asymmetric grid, big numerals.",
    buys:
      "Editorial authority with zero asset weight and zero motion machinery. The lede gets a drop cap and a real measure, the note becomes a pull quote at display scale, and the asymmetric grid gives the page rhythm through position rather than through colour. It is the direction that reads most like a considered publication.",
    cost:
      "It lives or dies on the copy actually being long enough to carry it, and the note is one sentence — set at pull-quote scale it can look inflated. The asymmetric grid also has to collapse to one column at 768px, at which point most of what makes it distinctive is gone, so it is the direction with the biggest gap between its desktop and phone self.",
    usesPhoto: false,
    usesMotion: false,
  },
];

export const DEFAULT_DIRECTION: OfferDirectionId = "cinematic";

const DIRECTION_IDS = new Set<string>(OFFER_DIRECTIONS.map((d) => d.id));

export function isDirection(v: string): v is OfferDirectionId {
  return DIRECTION_IDS.has(v);
}

export function getDirection(id: OfferDirectionId): OfferDirection {
  return OFFER_DIRECTIONS.find((d) => d.id === id) ?? OFFER_DIRECTIONS[0];
}

/* ---------------------------------------------------------------------------
   Per-offer templates

   The three offers are not parallel, and one shape for all three is why every
   layout compromised somewhere. The shape now follows the JOB:

     service     Consulting. The reader wants scope, method, and how to start.
                 Its `note` is literally a method statement ("I design the
                 workflow and data shape first, then layer automation where it
                 compounds"), and its `signals` are literally engagement names
                 (AI Roadmap Sprint, MVP Prototype Sprint). So the note is
                 promoted to a METHOD movement and the signals become the
                 ENGAGEMENTS on offer — neither is a decorative strip.

     venture     WorldPulse. The reader wants positioning, who it is for, and
                 what conversation is open. Its second block is already titled
                 "Conversations open now", i.e. it is an AUDIENCE list, not a
                 second capability list. It is promoted out of the pair and
                 given the weight the ask would otherwise carry.

     credential  Experience. The reader wants record and proof. Its `signals`
                 are brands and qualifications — Nike, Disney, Aosom, fluent
                 Mandarin, an M.S. in AI. Proof leads for a credential, so the
                 strip moves ABOVE the blocks instead of sitting under them.

   Nothing here rewrites copy. It reorders it and changes which piece gets the
   display treatment.
   ------------------------------------------------------------------------ */

export type OfferKind = "service" | "venture" | "credential";

/** The movements a page can contain. Every one maps to existing copy. */
export type SectionId =
  | "hero"
  | "scope" // the two blocks, as a pair
  | "lead" // block A alone, given the frame
  | "audience" // block B alone, as "who this is for"
  | "method" // the note, promoted to a movement
  | "engagements" // the signals, as things on offer
  | "proof" // the signals, as credentials
  | "ask"; // the actions, plus the note when it has not been promoted

export interface SectionDef {
  id: SectionId;
  /** Mono chapter label. Describes the movement, never restates the copy. */
  label: string;
}

export interface OfferTemplate {
  kind: OfferKind;
  /** One line naming what this template is for. */
  premise: string;
  sections: SectionDef[];
}

export const OFFER_TEMPLATES: Record<OfferKind, OfferTemplate> = {
  service: {
    kind: "service",
    premise: "A service. Scope, method, and how to start.",
    sections: [
      { id: "hero", label: "The offer" },
      { id: "scope", label: "Scope" },
      { id: "method", label: "How it works" },
      { id: "engagements", label: "Engagements" },
      { id: "ask", label: "Start" },
    ],
  },
  venture: {
    kind: "venture",
    premise: "A venture. Positioning, who it is for, what conversation is open.",
    sections: [
      { id: "hero", label: "The venture" },
      { id: "lead", label: "What we build" },
      { id: "audience", label: "Who this is for" },
      { id: "proof", label: "Markers" },
      { id: "ask", label: "Talk" },
    ],
  },
  credential: {
    kind: "credential",
    premise: "A credential. Record, chronology, proof.",
    sections: [
      { id: "hero", label: "The record" },
      { id: "proof", label: "Proof" },
      { id: "lead", label: "Leadership" },
      { id: "audience", label: "Selected work" },
      { id: "ask", label: "Request" },
    ],
  },
};

/** Which offer is which kind. Derived from the offer's job, not its styling. */
export const OFFER_KINDS: Record<PathId, OfferKind> = {
  consulting: "service",
  worldpulse: "venture",
  experience: "credential",
};

export function getKind(id: PathId): OfferKind {
  return OFFER_KINDS[id] ?? "service";
}

export function getTemplate(id: PathId): OfferTemplate {
  return OFFER_TEMPLATES[getKind(id)];
}

/**
 * Whether templates are applied at all.
 *
 * `uniform` runs all three offers through the service shape, which is what the
 * page does today. Keeping it switchable is the only way to SEE that the three
 * offers were being forced through one template — with per-offer shapes always
 * on, the compromise is invisible because it is gone.
 */
export type OfferTemplateModeId = "perOffer" | "uniform";

export const OFFER_TEMPLATE_MODES: Array<{
  id: OfferTemplateModeId;
  label: string;
  note: string;
}> = [
  {
    id: "perOffer",
    label: "Per offer",
    note: "Service, venture and credential each get their own shape.",
  },
  {
    id: "uniform",
    label: "Uniform",
    note: "All three forced through the service shape — today's compromise.",
  },
];

export function resolveTemplate(id: PathId, mode: OfferTemplateModeId): OfferTemplate {
  return mode === "uniform" ? OFFER_TEMPLATES.service : getTemplate(id);
}

/* ---------------------------------------------------------------------------
   Chrome

   How the offer page ARRIVES — the difference between reading as a separate
   document and reading as the Work chapter continuing.

   `expanded` carries the photograph over, puts the three choices back at the
   top of the plate with the pressed one still filled cobalt, and unfurls the
   answer beneath them. The reader can see the thing they touched, and moving
   between offers is sideways along a row that is already there.

   `standalone` is the earlier chrome: a sticky "back to the site" bar, a
   crumb, and an "also worth a look" footer restating the same three choices at
   the bottom of every page. Kept switchable so the two can be compared.

   Neither changes the fact that each offer is a real route with its own URL —
   that is what DECISION.md settles, and both modes honour it.
   ------------------------------------------------------------------------ */

export type OfferChromeId = "expanded" | "standalone";

export const OFFER_CHROMES: Array<{
  id: OfferChromeId;
  label: string;
  note: string;
}> = [
  {
    id: "expanded",
    label: "Expanded",
    note: "The row travels with you. Photo carries over, pressed bar stays lit.",
  },
  {
    id: "standalone",
    label: "Standalone",
    note: "Sticky back bar, crumb, sibling footer — reads as its own document.",
  },
];

export const DEFAULT_CHROME: OfferChromeId = "expanded";

const CHROME_IDS = new Set<string>(OFFER_CHROMES.map((c) => c.id));

export function isChrome(v: string): v is OfferChromeId {
  return CHROME_IDS.has(v);
}

/** Offer roster with kinds attached, for the lab's own labelling. */
export const OFFERS_WITH_KIND = PATHS.map((p) => ({
  id: p.id,
  eyebrow: p.destination.eyebrow,
  kind: getKind(p.id),
}));
