// Hero headline type iterations.
//
// Brief: reduce the size slightly, let the line span wider, and make the block
// easier to take in at a glance on mobile, desktop and ultrawide.
//
// The lever that actually decides "how many lines" is the MEASURE, not the
// size. The statement is 115 characters, and `text-wrap: balance` divides it
// evenly, so lines ≈ 115 / (real chars per line), and real chars per line runs
// about 0.9× the `ch` cap in this serif. That gives:
//
//     32ch → 4 lines   (what ships today)
//     ~43ch → 3 lines
//     ~64ch → 2 lines
//
// Size and measure are therefore tuned as a pair: dropping size without opening
// the measure just makes a smaller four-line block, which is not what "span"
// means.
//
// One correction worth recording, because it is load-bearing here and the
// handoff note has it wrong for this font: `1ch` in the display serif is
// **0.502em**, not the 0.67em rule of thumb. Measured off the live site at both
// 1920 (1374px ÷ 32ch ÷ 85.5px) and 3840 (2410px ÷ 32ch ÷ 150px). Physical
// width = measure_ch × 0.502 × font-size. The 0.67 figure applies to the sans.

export type HeroVariantId = "current" | "a" | "b" | "c" | "d" | "e";

export interface HeroVariant {
  id: HeroVariantId;
  label: string;
  /** One-line statement of the intent. */
  note: string;
  /** Rendered px at 1280 → 3840, for the readout. */
  ramp: string;
  /** Measure summary, for the readout. */
  measure: string;
}

export const HERO_VARIANTS: HeroVariant[] = [
  {
    id: "current",
    label: "Current",
    note: "What is live now. Four lines from 1100px up, six on a phone.",
    ramp: "64 → 150px",
    measure: "32ch · 22ch mobile",
  },
  {
    id: "a",
    label: "A · Gentle",
    note: "Smallest change that still reads as different. Three lines on desktop.",
    ramp: "59 → 138px  (−8%)",
    measure: "40ch · 24ch mobile",
  },
  {
    id: "b",
    label: "B · Balanced",
    note: "Three even lines with real width behind them. The safe recommendation.",
    ramp: "54 → 127px  (−15%)",
    measure: "46ch · 26ch mobile",
  },
  {
    id: "c",
    label: "C · Editorial",
    note: "Two long lines. Biggest change in feel — reads as a masthead, not a stack.",
    ramp: "48 → 112px  (−25%)",
    measure: "60ch · 28ch mobile",
  },
  {
    id: "d",
    label: "D · Ultrawide-aware",
    note: "B on a laptop, C past 2200px. The only one that treats ultrawide as its own case.",
    ramp: "54 → 127px  (−15%)",
    measure: "46ch → 64ch ≥2200px",
  },
  {
    id: "e",
    label: "E · Compact",
    note: "Shortest block on the page. Tighter leading, pulls the card fan up the fold.",
    ramp: "45 → 105px  (−30%)",
    measure: "68ch · 30ch mobile",
  },
];

export const DEFAULT_VARIANT: HeroVariantId = "b";

export function isHeroVariant(value: string | null): value is HeroVariantId {
  return !!value && HERO_VARIANTS.some((v) => v.id === value);
}
