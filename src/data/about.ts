// About — "Liner Notes".
//
// Work is the album. About is the liner notes.
//
// The Work chapters are the site's ambitious, interactive stretch: a pinned CD
// player on blue velvet, full-bleed photography, ~1,700vh of scroll. This
// section is the deliberate contrast — quiet, editorial, typographic, almost no
// UI. The visitor has just come out of a sequence that asked them to perform,
// and the point of this one is that the interface stops asking.
//
// Selected out of `/identity-lab` treatment 04, where it was compared against
// production's previous About + Personas pair and three other directions.
//
// WHAT THIS SECTION DELIBERATELY DOES NOT DO
// It names no employer, no credential, no venture and no metric. That is the
// concept, not an omission: the Work chapters own every piece of proof, and the
// brands carousel still names Nike, Disney and Aosom directly above them. If
// the Work chapters are ever shortened or reordered, this section is the thing
// that becomes stranded — check here first.
//
// THE COPY IS LOCKED. Supplied verbatim and not to be rewritten, shortened,
// expanded or "corrected". The only liberty taken is typographic: the
// apostrophe in "doesn’t" is U+2019, matching every other apostrophe on the
// site. That is rendering, not wording.

export const ABOUT_DATA = {
  /** Chapter metadata. Work runs 01–04; About continues the numbering. */
  index: "About / 05",

  /** The dominant visual element — set as the title of an editorial feature. */
  opening: "I like understanding how things became what they are.",

  /**
   * "Products, companies, systems, ideas." given its own typographic role
   * rather than buried in the body: a tracked mono index line, uppercased in
   * CSS so the real string stays intact for screen readers and crawlers.
   * Inert typography — never a control, a filter or a link.
   */
  secondary: ["Products", "Companies", "Systems", "Ideas"],

  body: [
    "Following that curiosity has taken me across languages, countries, factories, supply chains, data, and emerging technology.",
    "Somewhere along the way I noticed a lot of that work is translation. Sometimes literally, between Mandarin and English. More often between operations and technology, strategy and execution, data and the people actually living inside it.",
    "The medium keeps changing. The instinct doesn’t: figure out how the pieces fit together, connect what usually sits apart, and build something better from what I find.",
  ],
} as const;

/**
 * Annotations derived from the locked prose — not new claims, and not a
 * replacement for it. They sit beside the translation paragraph the way a note
 * is printed in a booklet margin, and they are `aria-hidden`: a screen reader
 * should hear the sentence once, not twice.
 *
 * DATA ↔ PEOPLE IS DELIBERATELY OMITTED. The source phrase is "data and the
 * people actually living inside it" — containment, not a symmetry between two
 * opposed domains. Rendering it as a pair would state the opposite of what the
 * sentence says. Three genuinely symmetric pairs also read as annotation;
 * four begins to look like a grid.
 */
export const ABOUT_PAIRS: readonly (readonly [string, string])[] = [
  ["Mandarin", "English"],
  ["Operations", "Technology"],
  ["Strategy", "Execution"],
] as const;
