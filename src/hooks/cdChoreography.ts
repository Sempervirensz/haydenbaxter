/* The CD disc's choreography, extracted from useWorkScroll so it has no
   dependency on the hook.
   
   The mobile scroll lab needs this curve to build its `native` arm — the same
   animation baked into @keyframes — and importing it back out of the hook made
   a cycle: hook → probe → techniques → hook. Same functions, same values, just
   somewhere both sides can reach without one importing the other. */

import { WORK_LANDING } from "@/data/work";
import type { WorkScrollZone } from "@/data/work";

function ease(t: number): number {
  return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
}

function clamp01(value: number): number {
  return Math.max(0, Math.min(1, value));
}

/* Also read by the mobile scroll lab's `native` technique, which samples it
   into @keyframes. Sampling the real function is the only way that arm is
   comparable — a hand-written CSS approximation would be a different
   animation wearing the same name. */
export function getCdState(progress: number, zones: WorkScrollZone[]) {
  const p = clamp01(progress);

  for (const zone of zones) {
    if (p >= zone.hold[0] && p <= zone.hold[1]) {
      return { deg: zone.deg, label: zone.label };
    }
  }

  const last = zones[zones.length - 1];
  if (p > last.hold[1]) {
    const extra = (p - last.hold[1]) / (1 - last.hold[1]);
    return {
      deg: last.deg - extra * extra * 720,
      label: last.label,
    };
  }

  for (let i = 0; i < zones.length - 1; i += 1) {
    const start = zones[i];
    const end = zones[i + 1];
    const tStart = start.hold[1];
    const tEnd = end.hold[0];

    if (p > tStart && p < tEnd) {
      const t = ease((p - tStart) / (tEnd - tStart));
      return {
        deg: start.deg + (end.deg - start.deg) * t,
        label: t < 0.5 ? start.label : end.label,
      };
    }
  }

  return { deg: 0, label: WORK_LANDING.activeLabel };
}

export const LERP_SPEED = 0.08;

