/* Variants for the mobile load lab (/x-perf).
 *
 * Built after a real-device report of ~26s to load on an iPhone. The decisive
 * measurement, taken before this file existed: the entry screen is
 * BYTE-FOR-BYTE IDENTICAL before and after 2026-08-26's work — 2,584 KB and 36
 * requests either way, same FCP. Today did not make the entry heavier.
 *
 * What today DID change is that the splash used to occupy the first ~4s. The
 * load was always this long; the splash hid it. So these variants split into
 * two questions:
 *   - Does REDUCING the weight actually help? (defer-faces, small-backs, ...)
 *   - Or was the complaint about the blank wait, not the duration? (splash)
 */

export interface PerfVariant {
  id: string;
  title: string;
  hypothesis: string;
  /** Roughly what this removes from the entry screen, uncompressed. */
  saves: string;
}

export const PERF_VARIANTS: PerfVariant[] = [
  {
    id: "control",
    title: "Control — the entry exactly as it ships",
    hypothesis:
      "Baseline. Every other number is only meaningful against this one. Run it first, and run it again at the end — if the two disagree by more than ~20%, the connection moved and the whole session is noise.",
    saves: "—",
  },
  {
    id: "defer-faces",
    title: "Card faces not loaded until you flip",
    hypothesis:
      "The four faces sit behind the backs, rotated away. They carry loading=lazy, which does nothing because the cards ARE in the viewport. 642 KB downloads before anyone can see it.",
    saves: "~642 KB",
  },
  {
    id: "small-backs",
    title: "Card backs at phone size",
    hypothesis:
      "The backs are 560x835 for an 86px slot on your phone. Correct for desktop, 6x oversized here.",
    saves: "~200 KB",
  },
  {
    id: "lean-cards",
    title: "Both card fixes together",
    hypothesis:
      "If the cards are the whole story, this should be dramatically faster. If it barely moves, the weight is not what is costing you the wait.",
    saves: "~840 KB",
  },
  {
    id: "system-fonts",
    title: "System fonts instead of the webfonts",
    hypothesis:
      "Six font files, 172 KB. Text cannot paint until they arrive. This is ugly on purpose — it is a diagnostic, not a proposal.",
    saves: "~172 KB",
  },
  {
    id: "floor",
    title: "Floor — text only, no images at all",
    hypothesis:
      "The theoretical fastest this page could ever be. Nothing shippable. It bounds how much ANY weight fix can possibly buy: if the floor is still slow, weight is not the problem.",
    saves: "~1.0 MB",
  },
  {
    id: "splash",
    title: "The splash, restored",
    hypothesis:
      "Same bytes, same duration — but something on screen while you wait. Tests whether the complaint was the LENGTH of the wait or the BLANKNESS of it. If this feels better while measuring identically, that is the answer.",
    saves: "0 KB (deliberately)",
  },
];
