// ---------------------------------------------------------------------------
// WorldPulse mobile experience lab — concept metadata + device presets.
//
// The concepts themselves pull their CONTENT from WORK_SCREENS (the same source
// the production card uses), so nothing here duplicates real copy. What lives
// here is lab chrome: the concept descriptions Hayden reads while evaluating,
// and the phone sizes the frames snap to.
// ---------------------------------------------------------------------------

import { WORK_SCREENS } from "@/data/work";

export type ConceptId = "dossier" | "sheet" | "twoup";

export interface ConceptMeta {
  id: ConceptId;
  /** Tab label. */
  label: string;
  /** One-word character of the concept, shown as a chip. */
  temper: string;
  /** The design idea, in one or two sentences. */
  idea: string;
  strengths: string[];
  tradeoffs: string[];
  /** True for the concept put forward as the recommended direction. */
  recommended?: boolean;
  /** Why this one, in the recommended concept's own words. */
  why?: string;
  /** Does this concept use the optional scroll-driven parallax? */
  parallax?: boolean;
}

export const CONCEPTS: ConceptMeta[] = [
  {
    id: "dossier",
    label: "A · Dossier",
    temper: "Restrained",
    idea:
      "The photo gets its own window instead of the whole card, so the ultra-wide frame keeps both the phone and her face at a comfortable crop. Everything else stacks beneath it on a dark plate — mono rail, serif headline, the opening paragraph, and one white CTA. The second paragraph is folded behind a disclosure so the resting card stays a three-second read.",
    strengths: [
      "Text and image can never collide — there is no overlay anywhere.",
      "The wider photo window shows the whole subject, not a 20% slice of it.",
      "Reads top-to-bottom in one pass; the CTA is the last and largest thing.",
      "No motion required, so it is identical under prefers-reduced-motion.",
      "Survives a 320px viewport and a 568px-tall viewport without scrolling.",
    ],
    tradeoffs: [
      "Least cinematic of the three — the photo is a picture, not a stage.",
      "Loses the desktop card's full-bleed drama.",
      "Expanding the story reflows the layout (the photo window shrinks).",
    ],
  },
  {
    id: "sheet",
    label: "B · Passport Sheet",
    temper: "Cinematic",
    idea:
      "Full-bleed photo as the stage, closest in spirit to the approved desktop card. The resting state carries only the mono rail, the serif headline in the top band, and one CTA at the very base — the phone in her hand is never covered. Tapping raises a frosted bottom sheet with the full dossier, and the photograph re-frames upward at the same time so the subject stays composed above the sheet instead of being buried by it.",
    strengths: [
      "The most direct translation of the approved desktop composition.",
      "Progressive disclosure is preserved, but driven by tap rather than hover.",
      "The coordinated re-frame means the subject is composed in BOTH states.",
      "Bottom sheet is the most familiar touch pattern on a phone.",
    ],
    tradeoffs: [
      "Most moving parts — sheet, scrim, re-frame, focus trap, Escape handling.",
      "backdrop-filter on a full-width sheet is the heaviest paint of the three.",
      "The full-bleed crop only shows ~21% of the photo's width; framing is exact and fragile.",
      "When the sheet is open the photo is cropped tight, losing the coastline context.",
    ],
    recommended: true,
    why:
      "A and B score about level on the five criteria — A wins performance and accessibility, B wins storytelling and consistency, and they tie on usability once you notice that B's extra tap is the same cost desktop already pays for its hover reveal. The tiebreak is the brief itself: the complaint about mobile today is that it lacks the desktop's cinematic quality, hierarchy, and intention. A fixes hierarchy and intention but gives up the full-bleed frame that defines the Work stack; B fixes all three. B's costs — one backdrop-filter surface, a focus trap, and ~40 lines of parallax — are engineering costs that can be bounded or deleted, not costs the visitor pays. If the backdrop-filter or the focus-management surface is judged too expensive, A is the fallback: it is a real improvement on what mobile ships today and needs no new interaction machinery at all.",
    parallax: true,
  },
  {
    id: "twoup",
    label: "C · Two-Up",
    temper: "Image-led",
    idea:
      "The card becomes two snap-scrolling panes: a pristine cinematic poster, then a dark editorial story page. Neither one compromises for the other — the photo is never covered and the copy is never cramped. A persistent bottom bar carries the pager and the CTA, so the primary action is on screen the whole time no matter which pane you are on.",
    strengths: [
      "The photograph is completely untouched — no scrim over the subject at all.",
      "The story page gets a full screen, so both paragraphs breathe.",
      "Pure CSS scroll-snap: no JS animation, best performance of the three.",
      "The CTA never moves and never scrolls away.",
    ],
    tradeoffs: [
      "The story is one gesture away, so some visitors will never see it.",
      "Horizontal paging nested inside the Work section's vertical scroll track is a real gesture conflict, and the hardest thing here to integrate safely.",
      "At rest it looks close to B — the two only diverge once you interact. Choosing between them is a behaviour decision, not a look decision.",
      "Two panes is a heavier mental model than one card.",
    ],
  },
];

export interface DevicePreset {
  label: string;
  note: string;
  w: number;
  h: number;
}

/** Representative phones, smallest to largest. The two extremes are the ones
 *  that break layouts: 320×568 (iPhone SE 1st gen) and 430×932 (Pro Max). */
export const DEVICE_PRESETS: DevicePreset[] = [
  { label: "SE (1st)", note: "smallest still in use", w: 320, h: 568 },
  { label: "SE (2/3)", note: "small modern", w: 375, h: 667 },
  { label: "Android", note: "common mid-size", w: 360, h: 740 },
  { label: "iPhone 15", note: "current baseline", w: 393, h: 852 },
  { label: "Pro Max", note: "largest phone", w: 430, h: 932 },
];

/** Real WorldPulse content, read straight from the production Work data. */
export function getWorldPulseContent() {
  const screen = WORK_SCREENS.find((s) => s.type === "full");
  if (!screen || screen.type !== "full") {
    throw new Error("WorldPulse screen missing from WORK_SCREENS");
  }
  return {
    /** "01 / 04" in the data; the cinematic rail renders "01 — WorldPulse". */
    number: screen.number.split(" ")[0],
    name: screen.name,
    logo: screen.logo,
    /** Same tagline the approved desktop card uses (CINEMATIC_CARDS[0]). */
    tagline: "Digital product passports, made human.",
    label: "WorldPulse · Founder",
    image: screen.full.background ?? "",
    imageAlt:
      "A woman on a rocky coastline holding a phone showing a WorldPulse digital product passport for a wool cable turtleneck.",
    paragraphs: screen.full.caption,
    link: screen.full.link,
  };
}

export type WorldPulseContent = ReturnType<typeof getWorldPulseContent>;
