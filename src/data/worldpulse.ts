// "Explore WorldPulse" — path 02 of the Consulting chapter.
//
// WHAT THIS REPLACED, AND WHY
//
// WorldPulse was the last destination still on `WorkTogetherSolo`'s generic
// two-block sheet — the placeholder shape written when only the consulting
// answer was being redesigned. Experience left it for `ExperienceScreen`, the
// consulting pair has `ConsultingPathsScreen`, and the comment at the top of
// WorkTogetherSolo describing "these two screens" had come to describe one.
//
// Measured on that sheet, framed at production's own card widths
// (/worldpulse-panel-lab):
//
//   card width   capability chips shown   sheet overflow
//   375px        3 of 5, 3 of 5           +361px
//   680px        3 of 5, 3 of 5           +112px
//   701px        3 of 5, 3 of 5            +76px
//   1180px       5 of 5, 5 of 5           fits
//
// Two separate faults. The overflow is a nested scroller with no affordance
// inside a card that is itself a scroll stop. The clipping is a rule written
// for the consulting PAIR that also matches the solo panel, so below ~710px
// every block silently dropped its last two items — including "Investors",
// which is the single conversation this path exists to start.
//
// THE CONTENT MODEL
//
// The old panel stated the same claim four times: a founder paragraph, a
// five-item capability list restating its own descriptor, a credential strip
// repeating that list word for word, and a note above the buttons restating
// the eyebrow, the descriptor and both CTAs in one sentence. What survives is
// one claim at display scale and two mono spec rows — Drafting's own idiom,
// the same one `ExperienceScreen` sets its employers and schools in.
//
// Sources: work.ts → WORK_SCREENS[0].full.caption, consultingOffers.ts →
// worldpulse. The eyebrow, title and both actions still come from
// workTogether.ts, so the three destinations keep one head and one button row.

export interface SpecRow {
  /** Mono label above the row. */
  label: string;
  /**
   * The row itself. Each entry is its own element rather than a run of text
   * with separators between: Drafting sets a spec row with hairline dividers
   * instead of middots, and a rule can only hang off an element.
   */
  items: string[];
}

/**
 * The one claim the panel has to land, at display scale.
 *
 * It names the product (Digital Product Passports), the transformation (supply
 * chain data into a product story) and the differentiator (you can see it) in
 * one sentence. The founder framing the panel used to open with is carried by
 * the eyebrow and by the stage line below; repeating it in prose was the single
 * largest block of duplicated information on the screen.
 */
export const CLAIM =
  "Digital Product Passports that turn supply chain data into a product story you can see.";

/**
 * Deliberately does NOT repeat the claim. "Digital Product Passports" and
 * "product storytelling" both live in the sentence above, so the row carries
 * only the scope the claim leaves unsaid — which is the whole reason the old
 * five-item list read as filler.
 *
 * "AI-enhanced experiences" is gone, and not only for the line it cost at
 * 375px. The other three are DOMAINS the passport covers; that one is a
 * technique used to build it, so a reader scanning the row for scope hit a
 * category change on the last item. It survives where it belongs — the AI
 * practice is one of the two named consulting paths.
 */
export const COVERS: SpecRow = {
  label: "What it covers",
  items: ["Compliance", "Traceability", "Sustainability"],
};

/**
 * Investors first: investment and venture conversations are the current
 * objective of this path, and on the shipped sheet this was the item the
 * clipping rule hid on every phone.
 *
 * "Commercial partners" is gone as a near-duplicate of "Strategic
 * collaborators" — five items set to three lines on a phone, which was most of
 * the panel.
 */
export const OPEN_TO: SpecRow = {
  label: "Open to",
  items: ["Investors", "Pilot partners", "Customers", "Strategic collaborators"],
};

// There is deliberately NO stage line. "Founder-led, building now" was the
// four-word survivor of the deleted note, and it was still a restatement: the
// eyebrow says ACTIVE VENTURE and `OPEN_TO` lists the conversations a
// founder-led venture that is building would be open to. A third mono line
// asserting it outright is the same repetition this screen exists to remove,
// and at 375px it was the 31px that decided whether the panel fit its card.
