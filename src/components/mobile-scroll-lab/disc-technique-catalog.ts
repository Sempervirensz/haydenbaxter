/* Mobile scroll lab — what each technique IS, in words.
 *
 * Deliberately separate from disc-techniques.ts, which is what each technique
 * DOES. The hook imports the behaviour; only the HUD and the lab page import
 * this. That split is not tidiness: as one module, the labels and notes below
 * rode into the production page chunk on the back of the hook's import of
 * `makeSmoother`, and no amount of dead-branch guarding shook them loose —
 * a top-level Map over the table is an initializer webpack has to keep.
 *
 * So: nothing on the shipped path may import this file. */

import type { DiscTechnique } from "./disc-techniques";

export interface TechniqueDef {
  id: DiscTechnique;
  label: string;
  /** One line, shown in the lab. What this arm is actually asking. */
  note: string;
  /** May the JS loop run on this technique, on ANY device?
   *
   *  `off` is true, which reads oddly until you remember what `off` means: it
   *  is the shipped build, and the shipped build runs the loop on desktop and
   *  freezes it on phones. The freeze is a device gate, applied separately.
   *  `native` is false everywhere — the compositor is driving the disc through
   *  a CSS `rotate`, and a JS transform write would compose on top of it and
   *  show the disc at the sum of the two. */
  runsLoop: boolean;
  /** Cheap geometry (cached on resize) rather than a layout read per frame. */
  cachedGeometry: boolean;
}

export const DISC_TECHNIQUES: TechniqueDef[] = [
  {
    id: "off",
    label: "off",
    note: "Shipped. On a phone the loop never starts and the disc sits still — the baseline every other arm has to beat.",
    runsLoop: true,
    cachedGeometry: false,
  },
  {
    id: "rect",
    label: "rect",
    note: "The naive unfreeze: getBoundingClientRect + offsetHeight every frame. What the perf work argues against.",
    runsLoop: true,
    cachedGeometry: false,
  },
  {
    id: "cached",
    label: "cached",
    note: "Same lerp and same curve, geometry measured on resize only. Proven bit-identical to rect, without the layout read.",
    runsLoop: true,
    cachedGeometry: true,
  },
  {
    id: "direct",
    label: "direct",
    note: "Cached geometry, no smoothing — the disc is a pure function of scroll. Tests whether the lerp is what makes it feel good or what makes it feel late.",
    runsLoop: true,
    cachedGeometry: true,
  },
  {
    id: "freewheel",
    label: "freewheel",
    note: "Turntable inertia. Flicks add angular momentum and the disc coasts down on its own — not a position mapping at all.",
    runsLoop: true,
    cachedGeometry: true,
  },
  {
    id: "native",
    label: "native",
    note: "The curve baked into @keyframes on a view-timeline. No JS per frame, no main-thread work, nothing to drop.",
    runsLoop: false,
    cachedGeometry: false,
  },
];

const BY_ID = new Map(DISC_TECHNIQUES.map((t) => [t.id, t]));

export function techniqueDef(id: DiscTechnique): TechniqueDef {
  return BY_ID.get(id) ?? DISC_TECHNIQUES[0];
}


