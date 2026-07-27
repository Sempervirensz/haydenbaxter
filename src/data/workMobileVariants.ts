// ---------------------------------------------------------------------------
// Mobile Work — fidelity variations registry.
//
// Batch 6. The previous mobile batch drifted into a separate redesign; this one
// is fidelity-first. Every variation starts from a production desktop card and
// asks what the smaller viewport actually forces, rather than what a
// conventional mobile pattern would prefer.
//
// This file holds ONLY lab metadata — the variation labels, and the explicit
// list of desktop elements each one is contractually preserving. All real
// content still comes from WORK_SCREENS / scLab / consultingOffers.
// ---------------------------------------------------------------------------

export type CardKey = "worldpulse" | "etb" | "supply" | "consulting";
export type VariantKey = "a" | "b" | "c";

/** Which techniques a variation is actually testing. Deliberately not applied
 *  uniformly — the point of the lab is to see which ones earn their place. */
export interface MotionTags {
  parallax?: boolean;
  scrollDynamic?: boolean;
  strongMotion?: boolean;
}

export interface Variant {
  key: VariantKey;
  /** Lab-only label. Never ships. */
  label: string;
  /** What this variation is for, in one line. */
  purpose: string;
  /** What changed relative to variation A of the same card. */
  changed: string;
  motion: MotionTags;
}

export interface CardDef {
  key: CardKey;
  num: string;
  name: string;
  /** The production surface this is adapted from. */
  desktopSource: string;
  /** Non-negotiables — the elements that make the desktop card recognisable.
   *  Every variation of this card preserves all of these. */
  preserve: string[];
  variants: Variant[];
}

export const CARDS: CardDef[] = [
  {
    key: "worldpulse",
    num: "01",
    name: "WorldPulse",
    desktopSource: "CinematicCardBody card 1 — full-bleed coastal photo, mono rail, serif headline, hover-revealed frosted glass dossier.",
    preserve: [
      "The cinematic coastal photograph, full-bleed",
      "Mono chapter rail top-left with hairline",
      "Serif headline “Digital product passports, made human.”",
      "Frosted liquid-glass dossier panel — the desktop's own material",
      "WorldPulse mark + founder story from WORK_SCREENS",
      "One primary action to worldxpulse.com",
    ],
    variants: [
      {
        key: "a",
        label: "Production Faithful",
        purpose:
          "The desktop card adapted, not redesigned: same layers in the same order, with the glass dossier anchored to the bottom edge because a portrait frame has no room for it to float beside the headline.",
        changed: "—",
        motion: {},
      },
      {
        key: "b",
        label: "Smoother Flow",
        purpose:
          "Same composition, less friction. The founder line is visible at rest instead of hidden behind the trigger, and the primary CTA never requires opening anything first.",
        changed:
          "Lede promoted out of the panel onto the card; panel demoted to “the rest of the story”; CTA always present.",
        motion: {},
      },
      {
        key: "c",
        label: "Cinematic Parallax",
        purpose:
          "The production card with real depth: photo, scrim and headline move at three different rates, and the glass deepens as the card settles.",
        changed:
          "Adds layered scroll-linked drift on three planes; disclosure is unchanged from A.",
        motion: { parallax: true },
      },
    ],
  },
  {
    key: "etb",
    num: "02",
    name: "AI & Emerging Tech Builds",
    desktopSource:
      "ETBDetail — the candy-bar stack: cream bars, Cobalt Select on hover/focus, sheen sweep, mono caps names, chevron, “Project File” dossier.",
    preserve: [
      "The candy bars themselves — cream gradient, inset highlight, drop shadow",
      "Cobalt Select — the blue fill on the active bar",
      "The sheen sweep across a bar on activation",
      "Mono uppercase project names at 0.22em, mono summary beneath",
      "The chevron affordance",
      "The off-white “Project File” dossier card",
      "AtomicOS · CaseBrief · Cortex · ProcureBridge as bar entries",
    ],
    variants: [
      {
        key: "a",
        label: "Production Faithful",
        purpose:
          "Production's own mobile behaviour, tightened: the candy bars stack vertically, tapping one fills it cobalt and pushes the full-screen Project File dossier — exactly what ETBDetail already does under 767px.",
        changed: "—",
        motion: {},
      },
      {
        key: "b",
        label: "Inline Dossier",
        purpose:
          "Removes the full-screen push. Tapping a bar expands it in place into its own dossier, so the other projects stay on screen and you never lose your position in the stack.",
        changed:
          "Overlay replaced by in-place accordion expansion; the stack header sticks so the section is always identified.",
        motion: { scrollDynamic: true },
      },
      {
        key: "c",
        label: "Cobalt Depth",
        purpose:
          "Brings desktop's flex-weighting to touch: the tapped bar lifts and takes more height while its neighbours recede and dim — the same emphasis desktop gets from hover, driven by tap.",
        changed:
          "Adds depth/scale weighting and a longer sheen; dossier still pushes as in A.",
        motion: { strongMotion: true },
      },
    ],
  },
  {
    key: "supply",
    num: "03",
    name: "Supply Chain",
    desktopSource:
      "SupplyChainDetail — RealisticGlobe with journey dots and arcs, plus the timeline. Production ALREADY ships a mobile rail layout: globe pinned top, vertical timeline below.",
    preserve: [
      "The rotating three.js globe — the real RealisticGlobe component",
      "Journey dots + arcs at their true coordinates",
      "Production's own mobile framing: clouds style, lonOffset -69, latOffset 40",
      "The four stops: Taiwan · China · New York · SE Asia",
      "Progressive dot reveal, then auto-select",
      "The vertical rail with year · label · headline · description",
    ],
    variants: [
      {
        key: "a",
        label: "Production Faithful",
        purpose:
          "Production's existing mobile rail, unchanged in structure: globe at top, stops revealing in sequence beneath it, tapping a stop selects its dot on the globe.",
        changed: "—",
        motion: {},
      },
      {
        key: "b",
        label: "Sticky Globe",
        purpose:
          "The globe stops scrolling away. It pins to the top of the card while the rail scrolls beneath it, so the geography stays on screen for the whole story — the thing the card is actually about.",
        changed:
          "Globe becomes sticky; rail scrolls under it; the stop nearest the top auto-selects, so scrolling itself drives the globe.",
        motion: { scrollDynamic: true },
      },
      {
        key: "c",
        label: "Scroll-Linked Globe",
        purpose:
          "Scroll position drives the globe directly — the sphere rotates as you move through the journey, so the crossing is something you perform rather than read.",
        changed:
          "Adds scroll-driven longitude; stop selection is continuous rather than discrete.",
        motion: { scrollDynamic: true, strongMotion: true },
      },
    ],
  },
  {
    key: "consulting",
    num: "04",
    name: "Consulting",
    desktopSource:
      "ConsultingHeroStage / Stage — three states: cursive quote + glass CTA → frosted blur wash + candy path buttons → off-white offer dossier.",
    preserve: [
      "The statue hero — production already swaps to mobile-statue at ≤640px",
      "The cursive quote in Caveat",
      "The glass “Explore What's Possible” CTA",
      "Candy path buttons with the same Cobalt Select as the ETB bars",
      "The three paths: AI Systems · Supply Chain · WorldPulse",
      "The off-white offer dossier with its Back affordance",
    ],
    variants: [
      {
        key: "a",
        label: "Production Faithful",
        purpose:
          "The three-state stage as it ships, adapted to a portrait card: quote and CTA centred over the statue, then the blur wash and candy buttons, then the dossier.",
        changed: "—",
        motion: {},
      },
      {
        key: "b",
        label: "Open Invitation",
        purpose:
          "Drops the reveal gate. On a phone the extra tap costs more than the reveal earns, so the three paths are present at rest and booking is always one tap away.",
        changed:
          "State 1 and 2 merged; adds a persistent booking CTA; dossier unchanged.",
        motion: {},
      },
      {
        key: "c",
        label: "Refined Motion",
        purpose:
          "Production's staging with better timing: the wash blooms, the candy buttons rise on the same stagger desktop uses, and the statue settles — a real sense of arriving at the last chapter.",
        changed:
          "Keeps A's structure; adds staged reveal timing, statue drift, and a closing settle.",
        motion: { parallax: true, strongMotion: true },
      },
    ],
  },
];

export function getCard(key: CardKey): CardDef {
  const c = CARDS.find((x) => x.key === key);
  if (!c) throw new Error(`Unknown card ${key}`);
  return c;
}

/** Shared structural rules — what holds the four chapters together without
 *  flattening them into one template. */
export const SHARED_RULES: { label: string; rule: string }[] = [
  {
    label: "Outer margin",
    rule: "6px card inset, 18px inner gutter on every card (14px under 344px). One token.",
  },
  {
    label: "Card proportion",
    rule: "Each chapter is exactly one card at 100cqh. Vertical scroll moves between chapters; nothing scrolls horizontally.",
  },
  {
    label: "Chapter numbering",
    rule: "Mono rail top-left, “01 / 04 — WorldPulse”, from production's own WORK_SCREENS numbering.",
  },
  {
    label: "Typography roles",
    rule: "Serif = headline. Mono caps = label, chapter, and candy-bar name. Sans = body. Cursive = the consulting quote only.",
  },
  {
    label: "Touch targets",
    rule: "Nothing interactive under 44px; candy bars and primary CTAs at 52px+.",
  },
  {
    label: "Expanded state",
    rule: "Every card's deeper detail closes the same way: a visible Close/Back control, Escape, and focus returning to the control that opened it.",
  },
  {
    label: "Transition timing",
    rule: "Reveals use production's own cubic-bezier(0.22, 1, 0.36, 1) at 420–620ms. Nothing snaps, nothing floats.",
  },
  {
    label: "Colour + material",
    rule: "Cream candy → Cobalt Select is the site's interaction signature and is used identically in ETB and Consulting. Frosted glass is for dossiers only.",
  },
];
