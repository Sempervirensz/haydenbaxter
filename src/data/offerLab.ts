// Offer page lab — configuration.
//
// The three offers already have their content in `src/data/workTogether.ts`,
// which is what the live destination screens render. This file re-exports it
// so the lab can never drift from what ships, and adds only the lab's own
// axes: the layout roster and the surface roster.
//
// Nothing here is new copy. Every offer's eyebrow, title, lede, blocks,
// signals, note and actions come from the production source.

export { PATHS, getPath } from "@/data/workTogether";
export type {
  Destination,
  DestinationAction,
  DestinationBlock,
  PathDef,
  PathId,
} from "@/data/workTogether";

/* ---------------------------------------------------------------------------
   Layouts

   Five structural directions for the same offer. They differ in how the
   material is ORGANISED, not in what it says — same eyebrow, title, lede, two
   blocks, signals, note and actions in every one. That is what makes them
   comparable rather than five different pages.
   ------------------------------------------------------------------------ */

export type OfferLayoutId = "dossier" | "editorial" | "index" | "stack" | "split";

export interface OfferLayout {
  id: OfferLayoutId;
  name: string;
  note: string;
  verdict: string;
}

export const OFFER_LAYOUTS: OfferLayout[] = [
  {
    id: "dossier",
    name: "A · Dossier",
    note: "What ships today — the paper panel, two blocks side by side.",
    verdict:
      "The baseline, included so every other direction is judged against the real thing rather than against memory. It is compact and it reads as a document, which suits a panel that unfurls inside a photograph. Its limit is exactly why we are here: everything is one weight and one rhythm, so the title, the two proof blocks, the credential strip and the actions all compete equally for the eye. It also stops scaling — past about 1600px the panel is a dense card stranded in a large frame.",
  },
  {
    id: "editorial",
    name: "B · Editorial",
    note: "No panel. Serif headline, type on hairlines, dark like the rest of the site.",
    verdict:
      "Drops the paper entirely and lets the offer sit on the site's own dark ground, which makes it feel like a chapter of the page rather than a document handed to you. The headline gets real display scale, the lede gets a proper measure, and the two blocks become columns of type separated by hairlines instead of boxes. Strongest for a standalone offer page. The trade is that it needs vertical room — it is the least suited of the five to living inside a card.",
  },
  {
    id: "index",
    name: "C · Index",
    note: "Numbered and tabular. Mono-forward, everything scannable.",
    verdict:
      "Treats the offer as a specification rather than a pitch: numbered sections, items as rows, labels in mono at the left margin. The fastest of the five to scan, and the one that best suits a reader comparing three offers against each other. It is also the coldest — a procurement document more than an invitation — so it works better for Experience and Supply Chain than for a first conversation.",
  },
  {
    id: "stack",
    name: "D · Stack",
    note: "One column, generous rhythm. The mobile shape brought to desktop.",
    verdict:
      "One column at every width, with each block a distinct step. Nothing reflows between phone and desktop, which removes an entire class of responsive bugs and makes the reading order identical everywhere. The rhythm gives each claim room to land. Costs horizontal space on wide displays — the measure caps and the rest of the frame goes unused, which reads as generous or as empty depending on the surface behind it.",
  },
  {
    id: "split",
    name: "E · Split",
    note: "Sticky identity pane left, the proof scrolls on the right.",
    verdict:
      "The conventional offer-page structure, and conventional for good reason: the title, the lede and the two actions stay pinned on the left while the proof scrolls past on the right, so the ask is never off screen no matter how far down the reader gets. Best conversion shape of the five. It is also the most ordinary-looking, and it needs two real columns — below about 900px it has to collapse to the Stack, so it is really two layouts to maintain.",
  },
];

export const DEFAULT_LAYOUT: OfferLayoutId = "editorial";

export function getLayout(id: OfferLayoutId): OfferLayout {
  return OFFER_LAYOUTS.find((l) => l.id === id) ?? OFFER_LAYOUTS[0];
}

/* ---------------------------------------------------------------------------
   Surface

   Dark is the site's documented default. Paper is not a new theme — #f5f4f1
   on #111116 is the surface the destination screens, the ETB dossier and the
   personas lab already use. Both are here because the choice genuinely changes
   which layout wins.
   ------------------------------------------------------------------------ */

export type OfferSurfaceId = "dark" | "paper";

export const OFFER_SURFACES: Array<{ id: OfferSurfaceId; label: string; note: string }> = [
  { id: "dark", label: "Dark", note: "#0a0b0f — the site's documented ground." },
  { id: "paper", label: "Paper", note: "#f5f4f1 / #111116 — the destination screens' surface." },
];

export const DEFAULT_SURFACE: OfferSurfaceId = "dark";
