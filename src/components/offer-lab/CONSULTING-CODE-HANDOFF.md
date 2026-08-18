# Consulting offer page — code handoff

Self-contained extract of the implementation, generated from the working tree so
it matches what is committed. Pairs with `CONSULTING-BRIEF.md` for the *why*.

Repo: Next.js (App Router), dark-only design-forward portfolio.
Branch: `offer-art-direction`.

```
de8a7ca Steer the routed pages from the in-site flow
0ffdb2b Make each direction linkable on the comparison page
c545a4c Carry the choice row onto the offer page
fa21ffb Fix the measures, the paper slab, and the duplicated labels
ca06315 Wire the direction and template axes into the lab and the route
8841cf6 Add the art-direction and per-offer-template axes
```

## How the pieces fit

```
/offer-lab/[offer]            route
  |- OfferRouteClient         reads direction | template | chrome | layout | surface
  |                           from the query string, validates each
  |- OfferPage                page shell; builds the travelling row as `masthead`
  |                           when chrome === "expanded"
  |- OfferRender              baseline      -> original OfferScreen (.ofr)
  |                           anything else -> OfferDirectionScreen (.ofd)
  \- OfferDirectionScreen
        sections come from the TEMPLATE   (which movements exist, in what order)
        skin comes from `data-direction`  (how they look — entirely CSS)
```

Two axes, deliberately independent: **template** decides structure, **direction**
decides appearance. The markup is identical across all six directions — that is
what makes them comparable rather than six unrelated pages, and it means adding
a seventh direction is a stylesheet, not a component.

---

## 1. The model — directions, templates, chrome

### `src/data/offerDirections.ts`

Every direction carries a `cost` field alongside `buys`. A direction with no stated cost has not been thought about hard enough to choose.

```ts
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
```


---

## 2. The screen — movements per template, skin per direction

### `src/components/offer-lab/directions/OfferDirectionScreen.tsx`

The `masthead` slot is how the choice row travels onto the page in expanded chrome.

```tsx
"use client";

// One offer, drawn in one ART DIRECTION, through its own TEMPLATE.
//
// Two axes meet here and they are deliberately independent:
//
//   `direction`  how it looks   — cinematic | chaptered | alternating |
//                                 furniture | broadsheet
//   `template`   what shape it is — service | venture | credential, which
//                                 decides which movements exist and in what
//                                 order (see src/data/offerDirections.ts)
//
// The MOVEMENTS are markup; the SKIN is CSS. A section renders the same DOM
// whichever direction is active, and `data-direction` on the root does the
// rest — so adding a sixth direction is a stylesheet, not a component.
//
// The two exceptions are the two directions that genuinely need extra DOM: the
// cinematic photo plane, and the chaptered rail. Both are additive; neither
// changes how a section itself is built.

import { useEffect, useRef, useState, type ReactNode } from "react";
import type { OfferSurfaceId, PathDef } from "@/data/offerLab";
import {
  type OfferDirectionId,
  type OfferTemplateModeId,
  type SectionDef,
  getDirection,
  getKind,
  resolveTemplate,
} from "@/data/offerDirections";
// Imported HERE, on the component that needs it — not only on the lab shell.
// A missing stylesheet does not error; it renders the markup naked while every
// structural test still passes.
import "./offer-directions.css";

interface Props {
  path: PathDef;
  direction: OfferDirectionId;
  surface: OfferSurfaceId;
  templateMode: OfferTemplateModeId;
  /** The lab renders several of these at once; ids must not collide. */
  idPrefix?: string;
  /**
   * Rendered at the TOP of the hero movement, on the plate.
   *
   * This is how the choice row travels onto the page: the shell hands it in,
   * the hero pins it to the top of the photograph and keeps its own copy at
   * the bottom. Passing it here rather than wrapping the screen means the row
   * shares the hero's plate instead of needing a second one.
   */
  masthead?: ReactNode;
}

const HERO_WIDE = "/consulting/hero-2.png";
const HERO_NARROW = "/consulting/mobile-statue.png";
const HERO_ALT =
  "A winged victory statue lit against a golden hillside cityscape at night, above still water.";

/* ---------------------------------------------------------------------------
   Band assignment — the Alternating direction only.

   Dark hero, paper proof, dark close. Assigned by POSITION rather than by
   section id, so it stays correct for all three templates without a table of
   special cases: the first movement and the last movement are dark, and the
   middle of the page is the paper slab.
   ------------------------------------------------------------------------ */
function bandFor(index: number, total: number): "dark" | "paper" {
  if (index === 0) return "dark";
  if (index >= total - 1) return "dark";
  return "paper";
}

export default function OfferDirectionScreen({
  path,
  direction,
  surface,
  templateMode,
  idPrefix = "ofd",
  masthead,
}: Props) {
  const d = path.destination;
  const kind = getKind(path.id);
  const template = resolveTemplate(path.id, templateMode);
  const meta = getDirection(direction);
  const sections = template.sections;

  // The note is one sentence and must appear exactly once. When the template
  // promotes it to a Method movement, the ask must not repeat it.
  const noteIsPromoted = sections.some((s) => s.id === "method");

  const rootRef = useRef<HTMLDivElement | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  // Chapter tracking for the rail. Only the chaptered direction mounts a rail,
  // so the observer is not worth running for anything else.
  const trackChapters = direction === "chaptered";

  useEffect(() => {
    if (!trackChapters) return;
    const root = rootRef.current;
    if (!root) return;

    const nodes = Array.from(root.querySelectorAll<HTMLElement>("[data-sec-index]"));
    if (nodes.length === 0) return;

    // Reduced motion still gets an accurate rail — the rail is information,
    // not decoration. What it loses is the smooth scroll on press.
    const io = new IntersectionObserver(
      (entries) => {
        // The topmost intersecting section wins, so scrolling up and down
        // resolves to the same chapter at the same offset.
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible.length === 0) return;
        const i = Number((visible[0].target as HTMLElement).dataset.secIndex);
        if (!Number.isNaN(i)) setActiveIndex(i);
      },
      // A band across the upper-middle of the viewport: a section is "current"
      // once its top has passed the top third and before it leaves the bottom.
      { rootMargin: "-30% 0px -55% 0px", threshold: 0 }
    );

    nodes.forEach((n) => io.observe(n));
    return () => io.disconnect();
  }, [trackChapters, sections.length, path.id, templateMode]);

  const railId = `${idPrefix}-rail`;

  const renderSection = (s: SectionDef, i: number) => {
    const band = direction === "alternating" ? bandFor(i, sections.length) : undefined;
    const num = String(i + 1).padStart(2, "0");

    return (
      <section
        key={s.id}
        id={`${idPrefix}-sec-${s.id}`}
        className="ofd-sec"
        data-sec={s.id}
        data-sec-index={i}
        data-band={band}
        aria-labelledby={`${idPrefix}-sech-${s.id}`}
      >
        <header className="ofd-sec__head">
          <span className="ofd-sec__num" aria-hidden="true">
            {num}
          </span>
          <h2 className="ofd-sec__label" id={`${idPrefix}-sech-${s.id}`}>
            {s.label}
          </h2>
        </header>
        <div className="ofd-sec__body">{sectionBody(s)}</div>
      </section>
    );
  };

  function sectionBody(s: SectionDef) {
    switch (s.id) {
      case "hero":
        // The masthead is a SIBLING of the copy, not a child: the hero body is
        // a column that fills the plate and pushes these two apart, so the row
        // pins to the top of the photograph and the title stays at the bottom
        // where the scrim is strongest.
        return (
          <>
            {masthead}
            <div className="ofd-hero">
              <p className="ofd-hero__eyebrow">{d.eyebrow}</p>
              <h1 className="ofd-hero__title">{d.title}</h1>
              {/* The drop cap is a CSS ::first-letter on this element in the
                  broadsheet direction; no extra span, so the text stays one
                  selectable, screen-reader-correct run. */}
              <p className="ofd-hero__lede">{d.lede}</p>
            </div>
          </>
        );

      case "scope":
        return (
          <div className="ofd-blocks">
            {d.blocks.map((b, bi) => (
              <Block key={b.label} block={b} index={bi} />
            ))}
          </div>
        );

      // A single-block movement is ALREADY named by its chapter header — the
      // credential template's "Leadership" section rendered a "Leadership"
      // heading directly under a "Leadership" chapter label. The block's own
      // label is dropped rather than the section's, because the section
      // heading is what `aria-labelledby` points at and what the rail lists.
      case "lead":
        return (
          <div className="ofd-blocks ofd-blocks--single">
            <Block block={d.blocks[0]} index={0} showLabel={false} />
          </div>
        );

      case "audience":
        return (
          <div className="ofd-blocks ofd-blocks--single">
            <Block block={d.blocks[1]} index={1} showLabel={false} />
          </div>
        );

      case "method":
        // The note IS a method statement for a service, so it is set as one
        // rather than shrunk into a footnote above the buttons.
        return (
          <blockquote className="ofd-method">
            <p className="ofd-method__text">{d.note}</p>
          </blockquote>
        );

      case "engagements":
        // Signals as things you can actually buy — the service template's
        // reading of the same strip the credential template treats as proof.
        return (
          <ul className="ofd-engagements" aria-label="Engagements">
            {d.signals.map((sig, si) => (
              <li key={sig} className="ofd-engagement">
                <span className="ofd-engagement__num" aria-hidden="true">
                  {String(si + 1).padStart(2, "0")}
                </span>
                <span className="ofd-engagement__name">{sig}</span>
              </li>
            ))}
          </ul>
        );

      case "proof":
        return (
          <ul className="ofd-proof" aria-label="Credentials">
            {d.signals.map((sig) => (
              <li key={sig} className="ofd-proof__item">
                {sig}
              </li>
            ))}
          </ul>
        );

      case "ask":
        return (
          <div className="ofd-ask">
            {!noteIsPromoted && <p className="ofd-ask__note">{d.note}</p>}
            <div className="ofd-ask__actions">
              <a
                className="ofd-action ofd-action--primary"
                href={d.primary.href}
                {...(d.primary.external
                  ? { target: "_blank", rel: "noopener noreferrer" }
                  : {})}
              >
                <span className="ofd-action__label">{d.primary.label}</span>
                <span className="ofd-action__chev" aria-hidden="true">
                  ›
                </span>
              </a>
              {d.secondary && (
                <a
                  className="ofd-action ofd-action--ghost"
                  href={d.secondary.href}
                  {...(d.secondary.external
                    ? { target: "_blank", rel: "noopener noreferrer" }
                    : {})}
                >
                  <span className="ofd-action__label">{d.secondary.label}</span>
                  <span className="ofd-action__chev" aria-hidden="true">
                    ›
                  </span>
                </a>
              )}
            </div>
          </div>
        );

      default:
        return null;
    }
  }

  return (
    /* The container is this WRAPPER. A container query never matches the
       element that establishes the container, so `container-type` must not go
       on `.ofd` — every `@container` rule targeting `.ofd[data-direction=...]`
       would silently do nothing while descendant rules kept working, which is
       the failure mode that cost a thread last time. */
    <div className="ofd-shell">
      <article
        ref={rootRef}
        className="ofd"
        data-direction={direction}
        data-surface={surface}
        data-kind={kind}
        data-template={templateMode}
        /* Declared on the root rather than sniffed with `:has(~ ...)`: the
           plate is a SIBLING of the flow that contains the row, so matching it
           structurally meant a selector that broke the moment anything was
           nested differently. */
        data-masthead={masthead ? "true" : undefined}
      >
        {meta.usesPhoto && (
          <div className="ofd__plate" aria-hidden="true">
            <picture>
              <source media="(max-width: 640px)" srcSet={HERO_NARROW} />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img className="ofd__plateImg" src={HERO_WIDE} alt="" />
            </picture>
            <span className="ofd__plateScrim" />
            <span className="ofd__plateGrain" />
          </div>
        )}

        {trackChapters && (
          <nav className="ofd-rail" aria-label="Sections" id={railId}>
            <ol className="ofd-rail__list">
              {sections.map((s, i) => (
                <li key={s.id} className="ofd-rail__item">
                  <a
                    className={`ofd-rail__link ${i === activeIndex ? "is-current" : ""}`}
                    href={`#${idPrefix}-sec-${s.id}`}
                    aria-current={i === activeIndex ? "true" : undefined}
                  >
                    <span className="ofd-rail__tick" aria-hidden="true" />
                    <span className="ofd-rail__num" aria-hidden="true">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="ofd-rail__name">{s.label}</span>
                  </a>
                </li>
              ))}
            </ol>
          </nav>
        )}

        <div className="ofd__flow">{sections.map(renderSection)}</div>
      </article>
    </div>
  );
}

/* ---------------------------------------------------------------------------
   A labelled block. Same DOM in every direction — the Furniture direction
   turns the items into candy bars purely in CSS, which is why they must not
   be buttons: in the CTA row that object is a control, and it is a false
   affordance the moment it stops navigating.
   ------------------------------------------------------------------------ */
function Block({
  block,
  index,
  showLabel = true,
}: {
  block: PathDef["destination"]["blocks"][number];
  index: number;
  /** False when the section header already carries this block's name. */
  showLabel?: boolean;
}) {
  return (
    <div className="ofd-block" data-block-index={index}>
      {showLabel && <h3 className="ofd-block__label">{block.label}</h3>}
      <p className="ofd-block__desc">{block.descriptor}</p>
      <ul className="ofd-block__list">
        {block.items.map((item) => (
          <li key={item} className="ofd-block__item">
            <span className="ofd-block__itemText">{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
```


---

## 3. The travelling choice row

### `src/components/offer-lab/OfferChoiceRow.tsx`

Copied from the production `.wt__row`, deliberately **not** imported — the homepage shipped and nothing in a lab should be able to reach into it.

```tsx
"use client";

// The choice row, travelling with you.
//
// On the homepage this row lives at the end of the Work chapter and links out.
// Here it is the SAME row, carried onto the offer page and pinned to the top of
// the plate, with the bar you pressed filled cobalt. That is what makes the
// offer read as the chapter expanding rather than as a different document:
// the thing you pressed is still on screen, still lit, and the answer has
// unfurled beneath it.
//
// It also replaces the bespoke back bar. Switching offers is SIDEWAYS movement
// along a row that is already there — no reversing out, no "also worth a look"
// footer restating the same three choices at the bottom of every page.
//
// BORROWED, NOT SHARED. Every value here is copied from `.wt__row` in
// `work-together.css` — the near-white plate, the 14px radius, the white inset
// over a deep drop shadow, mono uppercase at `--track-dymo`, the '›', the
// 105deg sheen, and Cobalt Select. It is deliberately NOT an import of that
// file: the homepage shipped today and nothing in a lab should be able to
// reach into it. If the row ever changes for real, these two move together on
// purpose, not by accident.

import { PATHS, type PathId } from "@/data/workTogether";
import "./offer-expanded.css";

interface Props {
  /** The offer whose page this is. Its bar carries the fill and does not link. */
  current: PathId;
  /** Query string carried across, so switching offers keeps the treatment. */
  qs?: string;
}

export default function OfferChoiceRow({ current, qs = "" }: Props) {
  return (
    <ul className="ofx__rows">
      {PATHS.map((p, i) => {
        const isCurrent = p.id === current;

        const inner = (
          <>
            <span className="ofx__rowMain">
              <span className="ofx__label">{p.label}</span>
              <span className="ofx__lede">{p.lede}</span>
            </span>
            <span className="ofx__chev" aria-hidden="true">
              ›
            </span>
            <span className="ofx__rowSheen" aria-hidden="true" />
          </>
        );

        return (
          <li
            key={p.id}
            className="ofx__rowItem"
            style={{ "--row-index": i } as React.CSSProperties}
          >
            {isCurrent ? (
              // The current offer is NOT a link. Navigating to the page you are
              // already on is a dead control, and `aria-current="page"` says
              // what the cobalt fill says visually — that blue means "this one,
              // right now", which is exactly what it means on the homepage.
              <span className="ofx__row is-current" aria-current="page">
                {inner}
              </span>
            ) : (
              <a className="ofx__row" href={`/offer-lab/${p.id}${qs}`}>
                {inner}
              </a>
            )}
          </li>
        );
      })}
    </ul>
  );
}
```


---

## 4. CSS — the parts that carry decisions

Full files: `directions/offer-directions.css` (1221 lines),
`offer-expanded.css` (335 lines). Excerpted here.

### Surface tokens — dark / paper, and the accent inversion

```css
/* ---- Surfaces -------------------------------------------------------- */

.ofd[data-surface="dark"],
.ofd [data-band="dark"] {
  --ofd-bg: #0a0b0f;
  --ofd-ink: rgba(255, 255, 255, 0.94);
  --ofd-body: rgba(255, 255, 255, 0.82);
  --ofd-muted: rgba(255, 255, 255, 0.66);
  --ofd-faint: rgba(255, 255, 255, 0.5);
  --ofd-rule: rgba(255, 255, 255, 0.14);
  --ofd-rule-strong: rgba(255, 255, 255, 0.3);
  --ofd-gold: #d8b15a;
  /* #2563eb fails as text on near-black; the site lifts it to this. */
  --ofd-blue: #7aa2ff;
  --ofd-blue-edge: #2563eb;
  --ofd-focus: rgba(255, 255, 255, 0.85);
}

.ofd[data-surface="paper"],
.ofd [data-band="paper"] {
  --ofd-bg: #f5f4f1;
  --ofd-ink: #111116;
  --ofd-body: rgba(17, 17, 22, 0.82);
  --ofd-muted: rgba(17, 17, 22, 0.64);
  --ofd-faint: rgba(17, 17, 22, 0.46);
  --ofd-rule: rgba(17, 17, 22, 0.14);
  --ofd-rule-strong: rgba(17, 17, 22, 0.3);
  /* Gold at #d8b15a on #f5f4f1 is ~1.9:1 — unreadable. Darkened, as the site
     does elsewhere on paper. */
  --ofd-gold: #8a6a1f;
  --ofd-blue: #2563eb;
  --ofd-blue-edge: #2563eb;
  --ofd-focus: rgba(37, 99, 235, 0.75);
}
```

### The Cinematic skin

```css

/* ===========================================================================
   A · CINEMATIC — photograph-led
   ===========================================================================

   The page opens on the same plate the CTA row sits on, SHARP. The row taught
   the visitor that this photograph means "work together"; landing on it is what
   makes the offer page the next room rather than a different building.

   Sharpness is the whole point, so the treatment is a gradient scrim and grain
   — never a filter, and never `backdrop-filter`. The scrim ramps to fully
   transparent by 55% because the statue sits around 64% up the frame.
   ======================================================================== */

.ofd[data-direction="cinematic"] .ofd__plate {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: clamp(460px, 64cqw, 880px);
  z-index: 0;
  overflow: hidden;
  pointer-events: none;
}

.ofd[data-direction="cinematic"] .ofd__plateImg {
  width: 100%;
  height: 100%;
  /* `object-fit` does nothing to an element that has not been given a box to
     fit into — the intrinsic 3440×1440 has to be overridden first. */
  object-fit: cover;
  /* `cover` crops horizontally here and the statue sits at x≈70%, so it is the
     first thing off the right edge as the frame narrows. */
  object-position: 56% 44%;
  display: block;
}

.ofd[data-direction="cinematic"] .ofd__plateScrim {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to top,
    #0a0b0f 0%,
    rgba(10, 11, 15, 0.92) 12%,
    rgba(4, 5, 10, 0.62) 30%,
    rgba(4, 5, 10, 0.22) 44%,
    transparent 55%
  );
}

/* Film grain, generated inline — no asset, no dependency. Same recipe the row
   uses, so the two surfaces sit in the same film stock. */
.ofd[data-direction="cinematic"] .ofd__plateGrain {
  position: absolute;
  inset: 0;
  opacity: 0.34;
  mix-blend-mode: overlay;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='180' height='180' filter='url(%23n)' opacity='0.3'/%3E%3C/svg%3E");
  background-size: 180px 180px;
}

/* The hero movement occupies the plate: photo above, type below — the
   cinematic read the Work chapter is built on. */
.ofd[data-direction="cinematic"] .ofd-sec[data-sec="hero"] {
  min-height: clamp(460px, 64cqw, 880px);
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  background: transparent;
  padding-bottom: clamp(36px, 5cqw, 76px);
}

/* When the choice row travels onto the page, the hero body becomes the column
   that holds both: the row pinned to the top of the plate, the title held at
   the bottom where the scrim is strongest. Without `flex: 1` the body would
   shrink to its content and `space-between` would have nothing to distribute,
   which reads as the row simply sitting on top of the title. */
.ofd[data-masthead] .ofd-sec[data-sec="hero"] .ofd-sec__body {
  flex: 1 1 auto;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: clamp(30px, 5cqw, 68px);
}

/* The plate has to clear the row AND the title now, so the hero is taller and
   the section stops pushing its copy right to the bottom edge. */
.ofd[data-direction="cinematic"][data-masthead] .ofd-sec[data-sec="hero"] {
  min-height: clamp(560px, 58cqw, 840px);
  justify-content: stretch;
  padding-top: clamp(24px, 3.2cqw, 44px);
}

.ofd[data-direction="cinematic"][data-masthead] .ofd__plate {
  height: clamp(560px, 58cqw, 840px);
}

/* The hero's own chapter header is redundant against a full-bleed photograph
   and a display headline — the eyebrow already names the offer. */
.ofd[data-direction="cinematic"] .ofd-sec[data-sec="hero"] .ofd-sec__head {
  display: none;
}

/* The eyebrow sits highest in the copy block, which at narrow widths lands it
   on the lit buildings where the scrim has already ramped out. The title and
   lede carried a shadow and it did not, so gold-on-city-lights was the one
   unreadable element in the hero. */
.ofd[data-direction="cinematic"] .ofd-sec[data-sec="hero"] .ofd-hero__eyebrow {
  text-shadow: 0 2px 12px rgba(0, 0, 0, 0.85), 0 0 26px rgba(0, 0, 0, 0.6);
}

.ofd[data-direction="cinematic"] .ofd-sec[data-sec="hero"] .ofd-hero__title {
  text-shadow: 0 4px 28px rgba(0, 0, 0, 0.62);
}

.ofd[data-direction="cinematic"] .ofd-sec[data-sec="hero"] .ofd-hero__lede {
  max-width: 56ch;
  text-shadow: 0 2px 16px rgba(0, 0, 0, 0.6);
}

/* Below the plate the page is the site's own dark ground — the photograph is
   the top of the page, not a texture running under the whole thing. */
.ofd[data-direction="cinematic"] .ofd-sec:not([data-sec="hero"]) {
  border-top: 1px solid var(--ofd-rule);
}
```

### Motion — scroll-driven, no listeners, fully optional

```css

/* ===========================================================================
   MOTION — grounded, scroll-driven, and entirely optional
   ===========================================================================

   Scroll-driven CSS animations rather than scroll handlers: no listener, no
   rAF, no layout reads in a hot path. Where `animation-timeline` is not
   supported the page simply renders in its final state, because every base
   style below IS the final state and the keyframe only supplies the offset it
   arrives FROM.

   That is also why the fill mode is `backwards` and never `both`. `both` pins
   the end-state transform for good and silently kills hover and press on
   anything underneath it.
   ======================================================================== */

@media (prefers-reduced-motion: no-preference) {
  @supports (animation-timeline: view()) {
    /* Movements rise into place as they enter. Small — 14px and 320ms of
       range — because the site's motion is grounded, not floaty. */
    .ofd[data-direction="chaptered"] .ofd-sec__body,
    .ofd[data-direction="cinematic"] .ofd-sec:not([data-sec="hero"]) .ofd-sec__body,
    .ofd[data-direction="alternating"] .ofd-sec__body {
      animation: ofd-rise linear backwards;
      animation-timeline: view();
      animation-range: entry 8% entry 46%;
    }

    /* The plate drifts against the scroll. 4% of its own height, which at a
       880px plate is ~35px across the whole hero — enough to feel like depth,
       not enough to read as parallax for its own sake. */
    .ofd[data-direction="cinematic"] .ofd__plateImg {
      animation: ofd-drift linear backwards;
      animation-timeline: view();
      animation-range: cover;
    }
  }
}

@keyframes ofd-rise {
  from {
    opacity: 0;
    transform: translateY(14px);
  }
}

@keyframes ofd-drift {
  from {
    transform: scale(1.06) translateY(-2%);
  }
  to {
    transform: scale(1.06) translateY(2%);
  }
}

/* ===========================================================================
   REDUCED MOTION
   Every state above is a static rule and every animation supplies only the
   offset it arrives from, so switching motion off is just removing the
   tweening — nothing is left mid-flight or half-transparent.
   ======================================================================== */

@media (prefers-reduced-motion: reduce) {
  .ofd,
  .ofd *,
  .ofd *::before,
  .ofd *::after {
    animation: none !important;
    transition: none !important;
    scroll-behavior: auto !important;
  }
}
```

### The expanded arrival — Cobalt Select and the unfurl

### `src/components/offer-lab/offer-expanded.css`

```css
/* ===========================================================================
   The expanded chapter. Scoped under .ofx-.
   ===========================================================================

   The offer page as a CONTINUATION of the Work chapter rather than a separate
   document. Three things make that read:

     1. The photograph carries over, sharp, from the card you pressed in.
     2. The three choices ride at the top of the plate, with the one you
        pressed filled cobalt — the thing you touched is still on screen.
     3. The answer unfurls DOWNWARD from that row, so the page is visibly
        caused by the press.

   What it replaces: a sticky "Back to the site" bar that announced a new
   document, and an "also worth a look" footer that restated the same three
   choices at the bottom of every page.

   Every plate value below is copied from `.wt__row` in work-together.css.
   Copied, not imported — the homepage shipped and a lab must not be able to
   reach into it.
   ======================================================================== */

.ofx__masthead {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 16px;
}

/* The escape hatch. A quiet mono link, NOT a bar: a bordered sticky strip is
   what made the page announce itself as somewhere else. */
.ofx__back {
  align-self: flex-start;
  display: inline-flex;
  align-items: center;
  gap: 9px;
  font-family: var(--font-mono);
  font-size: var(--text-label);
  font-weight: 500;
  letter-spacing: var(--track-dymo);
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.62);
  text-decoration: none;
  text-shadow: 0 2px 12px rgba(0, 0, 0, 0.8);
  transition: color 160ms ease;
}

.ofx__back:hover,
.ofx__back:focus-visible {
  color: #fff;
}

.ofx__back:focus-visible {
  outline: 2px solid rgba(255, 255, 255, 0.8);
  outline-offset: 4px;
  border-radius: 3px;
}

/* Labels the row rather than repeating it — the same job `.wt__hint` does on
   the homepage, and the same copy (CTA_HINT). */
.ofx__hint {
  margin: 0;
  font-family: var(--font-mono);
  font-size: var(--text-label);
  letter-spacing: var(--track-dymo);
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.55);
  text-shadow: 0 2px 12px rgba(0, 0, 0, 0.8);
}

.ofx__hint::after {
  content: "";
  display: block;
  height: 1px;
  margin-top: 12px;
  background: rgba(255, 255, 255, 0.18);
}

/* ---- The three choices ---- */

.ofx__rows {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-wrap: wrap;
  align-items: stretch;
  gap: 14px;
}

.ofx__rowItem {
  flex: 1 1 0;
  min-width: 0;
  display: flex;
}

.ofx__row {
  box-sizing: border-box;
  position: relative;
  overflow: hidden;
  flex: 1 1 auto;
  min-width: 0;
  display: inline-flex;
  align-items: center;
  gap: 12px;
  padding: 14px clamp(16px, 2cqw, 24px);
  border-radius: 14px;
  border: 1px solid rgba(255, 255, 255, 0.28);
  background: linear-gradient(180deg, #fefefe 0%, #f6f5f2 100%);
  text-decoration: none;
  box-shadow:
    0 1px 0 rgba(255, 255, 255, 0.85) inset,
    0 -1px 0 rgba(0, 0, 0, 0.04) inset,
    0 4px 16px rgba(0, 0, 0, 0.45),
    0 1px 3px rgba(0, 0, 0, 0.3);
  transition:
    background 170ms ease,
    border-color 170ms ease,
    box-shadow 170ms ease,
    opacity 200ms ease,
    filter 200ms ease;
  /* `backwards`, not `both`: a filled-forwards animation keeps its end-state
     transform applied for good and would win the cascade over the press. */
  animation: ofx-row-in 420ms cubic-bezier(0.22, 1, 0.36, 1) backwards;
  animation-delay: calc(var(--row-index) * 70ms + 120ms);
}

a.ofx__row {
  cursor: pointer;
}

@keyframes ofx-row-in {
  from {
    opacity: 0;
    transform: translateY(9px);
  }
}

.ofx__rowMain {
  min-width: 0;
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 4px;
  text-align: left;
}

.ofx__label {
  font-family: var(--font-mono);
  font-size: var(--text-control);
  font-weight: 500;
  letter-spacing: var(--track-dymo);
  text-transform: uppercase;
  line-height: 1;
  color: #111116;
}

.ofx__lede {
  font-family: var(--font-mono);
  font-size: var(--text-sm);
  font-weight: 400;
  line-height: 1.35;
  letter-spacing: 0.02em;
  color: rgba(17, 17, 22, 0.62);
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.ofx__chev {
  flex-shrink: 0;
  font-family: var(--font-mono);
  font-size: 18px;
  font-weight: 600;
  color: rgba(17, 17, 22, 0.42);
  transition: color 200ms ease, transform 200ms ease;
}

.ofx__rowSheen {
  position: absolute;
  inset: 0;
  pointer-events: none;
  background: linear-gradient(
    105deg,
    transparent 32%,
    rgba(255, 255, 255, 0.7) 46%,
    rgba(255, 255, 255, 0.15) 54%,
    transparent 66%
  );
  opacity: 0;
  transform: translateX(-160%);
  transition:
    transform 1s cubic-bezier(0.16, 0.84, 0.44, 1),
    opacity 300ms ease;
}

/* ---- Cobalt Select ----
   Blue is an interaction state, not a rank. Here the current offer's bar holds
   it because the reader IS on that one right now — the same meaning it carries
   on the homepage, where the fill persists while that bar's screen is open. */

.ofx__row.is-current,
a.ofx__row:hover,
a.ofx__row:focus-visible {
  background: linear-gradient(180deg, #2563eb 0%, #1d4ed8 100%);
  border-color: rgba(37, 99, 235, 0.6);
  box-shadow:
    0 1px 0 rgba(255, 255, 255, 0.2) inset,
    0 -1px 0 rgba(0, 0, 0, 0.15) inset,
    0 6px 24px rgba(37, 99, 235, 0.25),
    0 2px 6px rgba(0, 0, 0, 0.4);
}

.ofx__row.is-current .ofx__label,
a.ofx__row:hover .ofx__label,
a.ofx__row:focus-visible .ofx__label {
  color: #fff;
}

.ofx__row.is-current .ofx__lede,
.ofx__row.is-current .ofx__chev,
a.ofx__row:hover .ofx__lede,
a.ofx__row:focus-visible .ofx__lede,
a.ofx__row:hover .ofx__chev,
a.ofx__row:focus-visible .ofx__chev {
  color: rgba(255, 255, 255, 0.72);
}

a.ofx__row:hover .ofx__chev,
a.ofx__row:focus-visible .ofx__chev {
  transform: translateX(2px);
}

a.ofx__row:hover .ofx__rowSheen,
a.ofx__row:focus-visible .ofx__rowSheen {
  opacity: 0.5;
  transform: translateX(160%);
  background: linear-gradient(
    105deg,
    transparent 32%,
    rgba(255, 255, 255, 0.18) 46%,
    rgba(255, 255, 255, 0.04) 54%,
    transparent 66%
  );
}

a.ofx__row:active {
  transform: translateY(1px);
  transition-duration: 60ms;
}

/* DELIBERATELY NOT the homepage's 0.45 dim.
   There, dimming the other two is right: a panel has opened below them and it
   is the focus, so the unchosen bars step back. Here the row IS the
   navigation — those two bars are the only way to move sideways, and there is
   no sibling footer repeating them. Dimmed to 0.45 over a near-black sky they
   stopped reading as near-white plates at all and looked disabled, which
   discourages the exact action this chrome exists to enable.

   So the setback is slight, and the cobalt fill does the work of marking which
   one is current. The `:not()` guard is load-bearing rather than decorative —
   without it this would also mute the bar being hovered. */
.ofx__rows:has(.ofx__row.is-current) a.ofx__row:not(:hover):not(:focus-visible) {
  opacity: 0.9;
}

/* Inset and white: the bar clips its own overflow at a 14px radius, and focus
   always coincides with the cobalt fill, so white is guaranteed to contrast. */
a.ofx__row:focus-visible {
  outline: 2px solid #fff;
  outline-offset: -4px;
}

/* ===========================================================================
   THE UNFURL — the answer arrives from the row that opened it
   ======================================================================== */

.ofx__unfurl {
  animation: ofx-unfurl 520ms cubic-bezier(0.22, 1, 0.36, 1) 120ms backwards;
}

@keyframes ofx-unfurl {
  from {
    opacity: 0;
    transform: translateY(-14px);
    clip-path: inset(0 0 100% 0);
  }
}

/* ===========================================================================
   NARROW
   ======================================================================== */

@container ofd (max-width: 760px) {
  /* `flex: 1 1 0` distributes WIDTH across a row. Once this is a column it
     distributes HEIGHT instead and the bars get crushed against a
     height-constrained plate, with `overflow: hidden` eating the labels.
     Stacked bars size to their content. */
  .ofx__rows {
    flex-direction: column;
    align-items: stretch;
    gap: 10px;
  }

  .ofx__rowItem {
    flex: 0 0 auto;
  }

  .ofx__row {
    justify-content: space-between;
    padding: 13px 16px;
  }

  .ofx__hint {
    letter-spacing: 0.24em;
  }
}

/* ===========================================================================
   REDUCED MOTION
   Every state above is a static rule and each animation supplies only the
   offset it arrives from, so removing the tweening leaves nothing mid-flight.
   ======================================================================== */

@media (prefers-reduced-motion: reduce) {
  .ofx__row,
  .ofx__rowSheen,
  .ofx__unfurl,
  .ofx__back {
    animation: none !important;
    transition: none !important;
  }
}
```


---

## Rules any change here must hold

1. **Never edit the live homepage** — `src/app/page.tsx`, `WorkTogether.tsx`,
   `work-together.css`. Borrow the vocabulary; copy, never import.
2. **All copy comes from `src/data/workTogether.ts`.** Invent none, retype none.
3. **`container-type` goes on the wrapper** (`.ofd-shell`), never on `.ofd` — a
   container query does not match the element that establishes it, and it fails
   silently while descendant rules keep working.
4. **Import CSS on the component that needs it**, and assert *computed styles*,
   not element existence — a missing stylesheet renders naked markup and passes
   every structural check.
5. **No `backdrop-filter`** unless something is genuinely visible behind it;
   declaring it promotes the backdrop to a resampled texture.
6. **`animation-fill-mode: backwards`**, never `both`, and make the base style
   the final state so unsupported and reduced-motion cases render correctly.
7. **`ch` resolves against the element's own font-size** — put measures on the
   element carrying the type size, not on a wrapper.
8. Dark-only. No new brand colour. `prefers-reduced-motion` respected, keyboard
   reachable, visible focus.

## Verification used

Playwright against a running `next dev` (never the repo's `playwright.config.ts`
— it runs `next build`, which clobbers a live dev server). 39 checks across
1440 / 768 / 390 x three offers x six directions: homepage untouched by computed
style, no horizontal overflow, zero nested scrollers, no `backdrop-filter`,
container on the wrapper, keyboard reachable with visible focus, reduced motion
leaves nothing invisible.
