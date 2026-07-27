// ---------------------------------------------------------------------------
// Mobile Work System — the four Work chapters as one phone experience.
//
// Content comes from the SAME sources production uses: WORK_SCREENS for copy,
// CINEMATIC_CARDS for the chapter numbers + taglines the approved desktop stack
// already ships, CALENDLY_URL for booking. Nothing here restates real copy, so
// the lab cannot drift from the site.
//
// What DOES live here is the system contract: the rules every card obeys, and
// the per-card notes shown in the lab so the shared/specific split is legible.
// ---------------------------------------------------------------------------

import { WORK_SCREENS, type ETBProject } from "@/data/work";
import { CINEMATIC_CARDS, type CardId } from "@/components/work/CinematicCardBody";
import { CALENDLY_URL } from "@/data/connect";

// ---------------------------------------------------------------------------
// Content selectors — thin readers over production data
// ---------------------------------------------------------------------------

function screenOf<T extends (typeof WORK_SCREENS)[number]["type"]>(type: T) {
  const s = WORK_SCREENS.find((x) => x.type === type);
  if (!s) throw new Error(`Work screen "${type}" missing from WORK_SCREENS`);
  return s;
}

/** Chapter identity — shared with the desktop cinematic stack, so the rail can
 *  never disagree with what desktop shows (including the pending ETB rename). */
export function chapterOf(id: CardId) {
  const c = CINEMATIC_CARDS.find((x) => x.id === id);
  if (!c) throw new Error(`Cinematic card ${id} missing`);
  const screen = WORK_SCREENS.find((s) => s.id === id);
  return {
    num: c.num,
    /** "01 / 04" — production's own numbering, used as the navigation cue. */
    ordinal: screen?.number ?? `${c.num} / 04`,
    name: c.name,
    tagline: c.tagline,
  };
}

export function worldPulseContent() {
  const s = screenOf("full");
  if (s.type !== "full") throw new Error("bad screen");
  return {
    logo: s.logo,
    image: s.full.background ?? "",
    imageAlt:
      "A woman on a rocky coastline holding a phone showing a WorldPulse digital product passport for a wool cable turtleneck.",
    label: "WorldPulse · Founder",
    paragraphs: s.full.caption,
    link: s.full.link,
  };
}

/** The four builds worth previewing on a phone, in the order they should read.
 *  OpenClaw is deliberately excluded — five rows overflows a 568px card, and it
 *  is the least developed of the concepts. */
export const ETB_SHELF_IDS = ["atomicos", "casebrief", "cortex", "procurebridge"] as const;

/** Detail routes that actually exist. Concepts have no page yet. */
const ETB_ROUTES: Record<string, string> = {
  atomicos: "/emerging-tech-builds/atomic-os",
  casebrief: "/emerging-tech-builds/casebrief",
  cortex: "/emerging-tech-builds/cortex",
};

export interface ShelfItem {
  project: ETBProject;
  /** Detail page, or null for concept-stage builds with no page. */
  href: string | null;
  /** Thumbnail: the real screenshot when there is one, else the brand mark. */
  thumb: string;
  thumbKind: "shot" | "mark";
}

export function etbContent() {
  const s = screenOf("emerging-tech-builds");
  if (s.type !== "emerging-tech-builds") throw new Error("bad screen");
  const byId = new Map(s.etb.projects.map((p) => [p.id, p]));
  const shelf: ShelfItem[] = ETB_SHELF_IDS.flatMap((id) => {
    const project = byId.get(id);
    if (!project) return [];
    const shot = project.screenshot;
    return [
      {
        project,
        href: ETB_ROUTES[id] ?? null,
        thumb: shot || project.mark?.src || "",
        thumbKind: shot ? ("shot" as const) : ("mark" as const),
      },
    ];
  });
  // Evidence band. Production's own default selection decides which build
  // fronts the section, so the lab can't disagree with the site about which
  // work leads.
  const lead = byId.get(s.etb.defaultSelectedId);
  const hero = lead?.screenshot
    ? { src: lead.screenshot, alt: `${lead.name} — ${lead.oneLiner}` }
    : null;

  return {
    credibilityLine: s.etb.credibilityLine,
    intro: s.etb.intro,
    description: s.etb.description,
    hero,
    shelf,
  };
}

export function supplyChainContent() {
  const s = screenOf("supply-chain");
  if (s.type !== "supply-chain") throw new Error("bad screen");
  return {
    map: s.supplyChain.heroArt.mapAsset,
    /** The four credential lines the production hero already sets in type. */
    quoteLines: s.supplyChain.heroArt.quoteLines,
    proof: s.supplyChain.proofDrawer,
    featured: s.supplyChain.featured,
    bridgeLine: s.supplyChain.bridgeLine,
  };
}

export function consultingContent() {
  const s = screenOf("consulting");
  if (s.type !== "consulting") throw new Error("bad screen");
  return {
    eyebrow: s.consulting.eyebrow,
    heroTitle: s.consulting.heroTitle,
    heroSubtitle: s.consulting.heroSubtitle,
    identityLine: s.consulting.identityLine,
    founderLine: s.consulting.founderLine,
    /** Live offers only — the reserved slot is not something to sell. */
    offers: s.consulting.offers.filter((o) => o.status !== "Reserved"),
    bookingUrl: CALENDLY_URL,
    /** Art-directed portrait capture. 900×2000 is within 3% of a phone card's
     *  aspect ratio, so this one card needs essentially no crop. */
    image: "/consulting/mobile-statue.webp",
    imageAlt:
      "A winged victory statue lit against a golden hillside cityscape at night, above still water.",
  };
}

// ---------------------------------------------------------------------------
// System contract — shown in the lab so shared vs card-specific is legible
// ---------------------------------------------------------------------------

export interface SystemRule {
  label: string;
  rule: string;
}

export const SYSTEM_RULES: SystemRule[] = [
  {
    label: "Card frame",
    rule: "Every chapter is exactly one card, 100cqh, 6px inset, 18px radius, hairline edge + filmic inner shadow. Same frame as the desktop stack, scaled down.",
  },
  {
    label: "Rail",
    rule: "Mono chapter rail pinned top-left: “01 / 04 — WorldPulse” plus a hairline. The ordinal is the navigation cue, so no separate pager is needed.",
  },
  {
    label: "Typography",
    rule: "Serif headline clamp(23–33px), mono label 9.5px/0.24em, sans body 13–14px/1.55, mono CTA. Identical scale on all four.",
  },
  {
    label: "Spacing",
    rule: "18px gutter, 14px under a 344px container. Rail 15px. One rhythm everywhere.",
  },
  {
    label: "Touch targets",
    rule: "Nothing interactive under 44px. Primary CTA is a full-width pill at 50px minimum.",
  },
  {
    label: "Disclosure",
    rule: "One pattern, four cards: a frosted bottom sheet rising from the base. Handle closes, scrim dismisses, Escape closes, focus moves in and back, inert while shut.",
  },
  {
    label: "Motion",
    rule: "One rAF loop for the whole sequence — sink + dim handoff between chapters, plus image drift on photo cards only. IntersectionObserver-gated, transform-only, off under reduced motion.",
  },
  {
    label: "Gestures",
    rule: "Vertical page scroll is the only gesture. No horizontal paging, no nested scrollers except inside an open sheet.",
  },
];

export interface CardNote {
  id: CardId;
  title: string;
  /** The composition decision and why. */
  reasoning: string;
  /** What this card does that the others do not. */
  specific: string[];
}

export const CARD_NOTES: CardNote[] = [
  {
    id: 1,
    title: "WorldPulse — Passport Sheet",
    reasoning:
      "Unchanged from the approved mobile lab. Full-bleed photo anchored at 38% (the only crop holding both the phone and her face), all resting text in the top band because a bottom-anchored headline is geometrically impossible on a 2.36:1 image, one CTA at the base over her hand. The sheet re-frames the photo upward as it rises so the subject stays composed.",
    specific: [
      "Coordinated media re-frame on open — the only card where the photo moves in response to the sheet.",
      "Sheet height is solved (48cqh) from the subject's face height, not chosen.",
      "Image drift parallax.",
    ],
  },
  {
    id: 2,
    title: "Emerging Tech Builds — The Shelf",
    reasoning:
      "A phone should not carry the desktop candy-bar gallery with its filters, sorts, and slide-in dossier. Instead the resting state IS the evidence: four real builds as a shelf of rows, each with its actual product screenshot, name, category, and status. You learn these are real systems in about two seconds without tapping anything. Tapping a row opens the same sheet with that project's own hook and description, and hands off to its existing detail page.",
    specific: [
      "The only card whose sheet has four different contents, selected by which row you tapped.",
      "Uses real product screenshots as thumbnails, so the card is proof rather than a list of buttons.",
      "No photo, so no drift — panel cards stay still by system rule.",
    ],
  },
  {
    id: 3,
    title: "Supply Chain — The Crossing",
    reasoning:
      "The WebGL globe is the wrong tool inside a phone card — a three.js canvas for one decorative sphere is the heaviest thing in the sequence. The Pacific map earns its place as a darkened backdrop instead, because the story genuinely is a crossing: Taiwan to China to New York to SE Asia. Stops are not plotted on it — New York sits at the map's right edge and SE Asia below its bottom, so projected markers would look broken. The journey reads as a dated rail instead, under the three credential lines set in the production hero's own type styles.",
    specific: [
      "Editorial type stack (serif-heavy / mono-caps / sans-light) lifted from the production heroArt quote lines.",
      "Dated journey rail — the only card with an internal timeline.",
      "Sheet carries the three proof tabs, so tab state lives inside the sheet rather than on the card.",
    ],
  },
  {
    id: 4,
    title: "Consulting — The Invitation",
    reasoning:
      "The one card that inverts the system's own layout rule, on purpose: text sits at the BOTTOM, not the top. It can, because mobile-statue.webp was shot for portrait — 900×2000, within 3% of the card's aspect — and its lower half is still water with nothing in it. That inversion is the signal that the sequence has changed mode: the first three cards show work, this one asks for a conversation. It is also the only card whose primary CTA leaves the portfolio entirely, going to the booking link rather than a project.",
    specific: [
      "Bottom-weighted composition — deliberate inversion marking the end of the sequence.",
      "Only card with a booking CTA (CALENDLY_URL) rather than a project link.",
      "Two offer chips open the shared sheet with deliverables and best-fit.",
    ],
  },
];
