/* The mark labs, in the order they were built.
 *
 * Registry for the cross-lab switcher in `MarkLabShell` — routing only. It
 * carries no design information and nothing about how any mark is presented;
 * each project's art direction lives in its own folder. Keep paths in sync
 * with `src/app/**` and with `src/data/labsRegistry.ts`.
 *
 * A project belongs here once it has BOTH a mark on its record and a detail
 * page to render the mark against. ProcureBridge has the first and not the
 * second; OpenClaw has neither. */

export interface MarkLabLink {
  /** Project name, as it appears on the pill. */
  label: string;
  path: string;
}

export const MARK_LABS: MarkLabLink[] = [
  { label: "Cortex", path: "/cortex-mark-lab" },
  { label: "AtomicOS", path: "/atomicos-mark-lab" },
  { label: "CaseBrief", path: "/casebrief-mark-lab" },
];
