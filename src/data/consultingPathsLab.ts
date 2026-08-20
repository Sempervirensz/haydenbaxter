// Consulting paths — the lab's axes.
//
// The lab at /consulting-paths-lab compares six directions, four palettes, four
// surfaces, four type schemes, fifteen button recipes, six track styles and
// four play keys against each other. Those definitions are here; the words the
// panel renders are production's and are re-exported below.
//
// One combination of these axes is what the site ships. It is named in
// `scripts/extract-consulting-scheme.mjs`, which copies exactly that
// combination out of the lab stylesheet into the one the live section loads.

// The two paths themselves live in `src/data/consultingPaths.ts` — production's
// copy — and are re-exported here so the lab and the live section render the
// same words. Everything below is lab-only: the axes.

export {
  CONSULTING_PATHS,
  CONSULTING_SCREEN,
} from "@/data/consultingPaths";
export type {
  ConsultingPath,
  ConsultingPathId,
  PathEngagement,
} from "@/data/consultingPaths";

/* ===========================================================================
   ITERATIONS
   ===========================================================================

   Four axes. The first is art direction — five complete directions for the same
   pair, each with its own layout, type scheme and accent expression. The other
   three are levers you can pull across any of them, so a direction can be
   judged on paper and on ink, in the site's own accents and in a warmer set,
   without re-authoring it.

   What is NOT an axis: the interaction. Every direction expands the chosen path
   upward from the floor of the sheet, keeps the other one legible beside it,
   and gives each its own Discuss a Project CTA. That is the thing being
   proposed; the rest is how it looks while doing it.
   ------------------------------------------------------------------------ */

export type LayoutId =
  | "dossier"
  | "ledger"
  | "plate"
  | "marquee"
  | "blueprint"
  | "tracklist";
export type PaletteId = "cobalt-brass" | "graphite-gold" | "signal" | "patina";
export type SurfaceId = "paper" | "ink" | "black" | "glass";
export type TypeSchemeId = "house" | "editorial" | "technical" | "press";
/**
 * How the three top-level choices are drawn in the Tracklist direction only.
 *
 * They are the first thing anyone presses and the hardest thing in this
 * direction to get right: the listing vocabulary that makes the panel below
 * work is the same vocabulary that makes a control look like a caption. Four
 * answers, all of them still a track listing.
 */
export type TrackStyleId =
  | "tabs"
  | "card"
  | "rail"
  | "case"
  | "player"
  | "liner";

/**
 * The transport key on the three choices, in the Tracklist direction.
 *
 * Two references, two keys: a solid wedge that takes whatever colour the ring
 * gives it, and a cream wedge carrying an accent edge down its flat side — a
 * misregistered print, the way an old sleeve's ink sits a hair off the plate.
 */
export type PlayKeyId = "solid" | "offset" | "short" | "plain";

export type ButtonId =
  | "tint"
  | "candy"
  | "dymo"
  | "rule"
  | "frosted"
  | "slab"
  | "solid"
  | "outline"
  | "pill"
  | "offset"
  | "gradient"
  | "etched"
  | "split"
  | "stamp"
  | "cue";

export interface LabOption<T extends string> {
  id: T;
  label: string;
  note: string;
}

export interface LayoutDef extends LabOption<LayoutId> {
  /** The type scheme this direction was drawn for. Overridable in the lab. */
  type: TypeSchemeId;
  /** The CTA recipe this direction was drawn for. Overridable in the lab. */
  button: ButtonId;
  /**
   * The chrome the three top-level BARS take when Buttons is on Auto.
   *
   * Separate from `button` because a bar and a CTA are not the same object at
   * the same scale: Dossier's CTA is the shipped screen's quiet accent wash,
   * while its bars are the Emerging Tech Builds candy plate the site actually
   * ships above the sheet. Forcing one value on both made the control
   * direction stop looking like production, which is the one thing it is for.
   */
  rowButton: ButtonId;
}

export const LAYOUTS: LayoutDef[] = [
  {
    id: "dossier",
    rowButton: "candy",
    button: "tint",
    label: "Dossier",
    type: "house",
    note: "The shipped panel's own vocabulary: two tinted cards, serif names, mono kickers, capability chips.",
  },
  {
    id: "ledger",
    rowButton: "rule",
    button: "rule",
    label: "Ledger",
    type: "editorial",
    note: "No cards at all. Outlined index numerals, a hairline spine, leader-dot capabilities, CTAs as ruled text links.",
  },
  {
    id: "plate",
    rowButton: "dymo",
    button: "dymo",
    label: "Plate",
    type: "technical",
    note: "The DYMO system pushed forward: embossed kicker plate on a slight rotation, label chips, a CTA that presses.",
  },
  {
    id: "marquee",
    rowButton: "solid",
    button: "solid",
    label: "Marquee",
    type: "press",
    note: "Poster scale. An accent band over an oversized serif name, capabilities on one mono line, a solid accent CTA.",
  },
  {
    id: "tracklist",
    rowButton: "rule",
    button: "cue",
    type: "house",
    label: "Tracklist",
    note: "The Work card's own CD track listing: numeral gutter, serif titles on hairlines, capabilities as a credits line.",
  },
  {
    id: "blueprint",
    rowButton: "outline",
    button: "outline",
    label: "Blueprint",
    type: "technical",
    note: "Spec sheet. Hairline grid, corner ticks, numbered capability rows, mono throughout, accent reduced to rules.",
  },
];

export const PALETTES: LabOption<PaletteId>[] = [
  {
    id: "cobalt-brass",
    label: "Cobalt & Brass",
    note: "The site's own two accents — #2563eb and #d8b15a. Nothing new enters the system.",
  },
  {
    id: "graphite-gold",
    label: "Graphite & Gold",
    note: "One accent, not two: supply chain keeps the gold, AI recedes to graphite. The most restrained pair.",
  },
  {
    id: "signal",
    label: "Signal",
    note: "Same relationship, more voltage — indigo against amber. Reads younger and louder.",
  },
  {
    id: "patina",
    label: "Patina",
    note: "A departure: verdigris and rust. Hues the site does not use anywhere else today.",
  },
];

export const SURFACES: LabOption<SurfaceId>[] = [
  {
    id: "paper",
    label: "Paper",
    note: "The off-white sheet the destination screens ship on.",
  },
  {
    id: "ink",
    label: "Ink",
    note: "A smoked sheet instead. Sits in the dark composition rather than cutting a white hole in it.",
  },
  {
    id: "black",
    label: "Black",
    note: "True black. The panels are drawn in light alone — hairlines, accents, and the tone of the type.",
  },
  {
    id: "glass",
    label: "Glass",
    note: "No sheet — a frosted plane over the photograph, lit by the accents.",
  },
];

export const TYPE_SCHEMES: LabOption<TypeSchemeId>[] = [
  {
    id: "house",
    label: "House",
    note: "DM Serif Display · DM Sans · DM Mono — exactly what the site ships.",
  },
  {
    id: "editorial",
    label: "Editorial",
    note: "Instrument Serif for the names: higher contrast, tighter, set larger.",
  },
  {
    id: "technical",
    label: "Technical",
    note: "Space Grotesk names over DM Mono labels. No serif anywhere.",
  },
  {
    id: "press",
    label: "Press",
    note: "Fraunces — a soft, optical-size serif, with its italic carrying the detail lede.",
  },
];

/* ---------------------------------------------------------------------------
   CTA recipes
   ---------------------------------------------------------------------------
   Six of these eight are ports of button styles the site already owns — five
   from the CTA row lab's variant axis (src/components/cta-row-lab/), which
   drew them from globals.css `.tag`, the Emerging Tech Builds bar, the
   personas cards and the destination screens' own paper. Reusing them keeps
   this panel inside the site's vocabulary and means a decision made here can
   be argued against a decision already made there.

   Each direction names the one it was drawn for; the lab can force any other.
   ------------------------------------------------------------------------ */

export const BUTTONS: LabOption<ButtonId>[] = [
  {
    id: "tint",
    label: "Tint",
    note: "The destination screen's own button: accent hairline, accent wash, accent text, filling on hover.",
  },
  {
    id: "candy",
    label: "Candy",
    note: "The Emerging Tech Builds bar — near-white slab, sheen wipe, accent fill on hover.",
  },
  {
    id: "dymo",
    label: "DYMO",
    note: "globals.css `.tag`: embossed plate, hard 3px edge that collapses under the press.",
  },
  {
    id: "rule",
    label: "Rule",
    note: "Type on a hairline. A 2px accent rule ranks the primary; nothing is boxed.",
  },
  {
    // NOT "Glass" and NOT "Ink": those are Surface options, and two identically
    // labelled chips in one panel is a control that cannot be operated — you
    // press the one you meant and the other one moves.
    id: "frosted",
    label: "Frosted",
    note: "The personas pill — frosted, hairline bordered, rounded to 999px.",
  },
  {
    id: "slab",
    label: "Slab",
    note: "A black slab with paper type, inverting to a paper slab on dark surfaces. The loudest neutral.",
  },
  {
    id: "solid",
    label: "Solid",
    note: "Filled with the path's own hue. No ambiguity about which conversation you are starting.",
  },
  {
    id: "outline",
    label: "Outline",
    note: "One accent hairline, no fill until hover. The quietest, and the most technical.",
  },
  {
    id: "pill",
    label: "Pill",
    note: "Fully rounded, accent-washed, no shadow at all. The softest of the set.",
  },
  {
    id: "offset",
    label: "Offset",
    note: "Sharp corners over a hard offset shadow in the path's hue. The press knocks it into place.",
  },
  {
    id: "gradient",
    label: "Gradient",
    note: "A lit accent gradient with an inner highlight and a coloured glow beneath it.",
  },
  {
    id: "etched",
    label: "Etched",
    note: "Cut into the sheet rather than sitting on it — inner shadow, no border, accent label.",
  },
  {
    id: "split",
    label: "Split",
    note: "Label and arrow in two cells divided by a hairline. Reads as a control, not a badge.",
  },
  {
    id: "stamp",
    label: "Stamp",
    note: "Dashed accent border on a 1.5° rotation, straightening on hover. Applied by hand.",
  },
  {
    id: "cue",
    label: "Cue",
    note: "A transport control: a play glyph in its own ring, filling with the accent on hover.",
  },
];

export const TRACK_STYLES: LabOption<TrackStyleId>[] = [
  {
    id: "tabs",
    label: "Tabs",
    note: "Padded wash, rounded top corners, the shared rule capping them. The most obviously pressable.",
  },
  {
    id: "card",
    label: "Card",
    note: "Each choice is a whole tile — border, tinted fill, a real lift on hover. The most obviously a button.",
  },
  {
    id: "rail",
    label: "Rail",
    note: "A thick accent rail down the leading edge, growing as you approach. Type stays the subject.",
  },
  {
    id: "case",
    label: "Case",
    note: "A jewel case: double hairline frame, mono index in the corner, the frame lighting up on hover.",
  },
  {
    id: "player",
    label: "Player",
    note: "Transport controls: the play button leads, and a scrub line fills across the title.",
  },
  {
    id: "liner",
    label: "Liner",
    note: "Type alone. Oversized numerals, no wash, and an accent rule that sweeps in under the title.",
  },
];

export const PLAY_KEYS: LabOption<PlayKeyId>[] = [
  {
    id: "solid",
    label: "Solid",
    note: "One colour, taken from the ring — grey at rest, inverting to the sheet inside a filled ring.",
  },
  {
    id: "offset",
    label: "Offset",
    note: "A cream key with the accent printed a hair off register down its flat edge.",
  },
  {
    id: "short",
    label: "Short",
    note: "A stubby cream key with the offset edge and nothing around it — no ring, no fill, no glow.",
  },
  {
    id: "plain",
    label: "Plain",
    note: "The short key with the offset edge dropped: one solid wedge, one solid pause, nothing else.",
  },
];

export const DEFAULT_TRACK_STYLE: TrackStyleId = "player";
export const DEFAULT_PLAY_KEY: PlayKeyId = "plain";

/* ---------------------------------------------------------------------------
   THE CHOSEN SCHEME
   ---------------------------------------------------------------------------
   The lab boots on the combination that was picked out of it rather than on the
   control direction it started from:

     Direction    tracklist        the Work card's own CD track listing
     Palette      cobalt-brass     the site's own two accents, nothing new
     Surface      paper            the sheet the destination screens ship on
     Type         auto → house     DM Serif Display · DM Sans · DM Mono
     Buttons      auto             CTA `cue`, top-bar chrome `rule`
     Track style  player           transport key leads, scrub line fills
     Play key     plain            stubby solid wedge, no ring, no offset edge
     Top bars     skin             the three choices follow the skin
     Answer       two paths        the redesign, not production

   Dossier is still in the Direction axis as the control — it is what the
   shipped panel would look like with a second column, and the argument for
   everything else is made against it.
   ------------------------------------------------------------------------ */

export const DEFAULT_LAYOUT: LayoutId = "tracklist";
export const DEFAULT_PALETTE: PaletteId = "cobalt-brass";
export const DEFAULT_SURFACE: SurfaceId = "paper";

export function getLayout(id: LayoutId): LayoutDef {
  return LAYOUTS.find((l) => l.id === id) ?? LAYOUTS[0];
}
