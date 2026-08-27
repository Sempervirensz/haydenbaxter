/* Mobile scroll lab — instrument bus for the frozen-disc question.
 *
 * On a phone the CD disc does not turn: `useWorkScroll` short-circuits on
 * `(max-width: 640px) and (pointer: coarse)` and its rAF loop never starts.
 * Lifting that is a one-line change; the reason it has not been lifted is that
 * the loop reads `getBoundingClientRect()` + `offsetHeight` every frame, right
 * after writing the disc's transform — a forced synchronous layout per frame,
 * during momentum scroll, on the slowest device we ship to. That is precisely
 * what `perf/entry-screen-and-card-motion` spent its commits removing.
 *
 * So this measures instead of guessing, with three arms:
 *
 *   off      shipped behaviour — loop never starts, disc frozen. The baseline:
 *            what scrolling this page costs with no disc work at all.
 *   rect     naive flip. Loop runs, geometry read per frame. The expensive
 *            version, and the one the perf work argues against.
 *   cached   loop runs, geometry measured on resize only and progress derived
 *            from `window.scrollY` alone — the same trick `useScrollProgress`
 *            already uses on this page. No layout read in the scroll frame.
 *
 * If `cached` holds frame rate against `off`, the perf objection is answered
 * and the disc can turn. If it does not, the disc stays frozen and we know why.
 *
 * Two separate measurements, because they answer different halves:
 *   • frame cadence is sampled by the HUD's own rAF, so it exists in all three
 *     arms — including `off`, where the hook's loop contributes nothing.
 *   • read cost is reported by the hook, and only exists in `rect` / `cached`.
 *     Two `performance.now()` calls once per frame are NOT free — cold, they
 *     cost more than the arithmetic being timed, and left uncorrected they
 *     flatten both arms to the same number. So the hook times an empty
 *     `now()`-to-`now()` pair on the same frame and we report the difference.
 *
 * Stats accumulate incrementally — no ring buffer, no sorting, no allocation
 * per frame — because the instrument must not become the jank it is measuring.
 */

export type DiscMode = "off" | "rect" | "cached";

export const DISC_MODES: DiscMode[] = ["off", "rect", "cached"];

const VALID = new Set<string>(DISC_MODES);

/* Set by the HUD so all three arms can be compared on one device without
   reloading — a reload means re-flipping the four gate cards, and lands the
   next arm in a different thermal state than the last. */
let override: DiscMode | null = null;
const listeners = new Set<() => void>();

/* Dev-only, deliberately. This is read from inside a hook that ships on the
   real homepage, so production must not be armable at all: a URL someone
   shares cannot turn a visitor's phone into a test rig. */
export function readDiscMode(): DiscMode {
  if (process.env.NODE_ENV !== "development") return "off";
  if (typeof window === "undefined") return "off";
  if (override) return override;
  const v = new URLSearchParams(window.location.search).get("disc");
  return v && VALID.has(v) ? (v as DiscMode) : "off";
}

export function setDiscMode(mode: DiscMode) {
  override = mode;
  resetDiscStats();
  listeners.forEach((fn) => fn());
}

export function subscribeDiscMode(fn: () => void) {
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
}

/* 1ms buckets, 0–127ms. A frame past 127ms pins to the top bucket; by then the
   exact value has stopped mattering. */
const BUCKETS = 128;

export interface DiscStats {
  frames: number;
  spanMs: number;
  fps: number;
  frameP95: number;
  frameMax: number;
  over16: number;
  over33: number;
  reads: number;
  readMean: number;
  readMax: number;
  readFloor: number;
  longTasks: number;
  longMax: number;
}

const hist = new Uint32Array(BUCKETS);
let frames = 0;
let frameMax = 0;
let over16 = 0;
let over33 = 0;
let reads = 0;
let readSum = 0;
let readMax = 0;
let floorSum = 0;
let longTasks = 0;
let longMax = 0;
let spanMs = 0;

/* Called from the HUD's rAF, once per displayed frame. */
export function recordFrameDelta(ms: number) {
  frames += 1;
  spanMs += ms;
  if (ms > frameMax) frameMax = ms;
  if (ms > 16.7) over16 += 1;
  if (ms > 33.4) over33 += 1;
  hist[ms >= BUCKETS ? BUCKETS - 1 : ms | 0] += 1;
}

/* Called from inside the work-scroll tick. Allocation-free by design.
   `floorMs` is what an empty timing pair cost on that same frame — subtracting
   it is the difference between measuring the geometry read and measuring the
   clock. */
export function recordReadCost(ms: number, floorMs: number) {
  reads += 1;
  readSum += ms;
  floorSum += floorMs;
  if (ms > readMax) readMax = ms;
}

export function recordLongTask(ms: number) {
  longTasks += 1;
  if (ms > longMax) longMax = ms;
}

export function resetDiscStats() {
  hist.fill(0);
  frames = 0;
  frameMax = 0;
  over16 = 0;
  over33 = 0;
  reads = 0;
  readSum = 0;
  readMax = 0;
  floorSum = 0;
  longTasks = 0;
  longMax = 0;
  spanMs = 0;
}

export function readDiscStats(): DiscStats {
  let p95 = 0;
  if (frames > 0) {
    const target = frames * 0.95;
    let seen = 0;
    for (let i = 0; i < BUCKETS; i += 1) {
      seen += hist[i];
      if (seen >= target) {
        p95 = i;
        break;
      }
    }
  }
  return {
    frames,
    spanMs,
    fps: spanMs > 0 ? (frames * 1000) / spanMs : 0,
    frameP95: p95,
    frameMax,
    over16,
    over33,
    reads,
    /* Net of the clock's own overhead, floored at zero: on a frame where the
       read is genuinely free, noise can put the empty pair above it. */
    readMean: reads ? Math.max(0, (readSum - floorSum) / reads) : 0,
    readMax,
    readFloor: reads ? floorSum / reads : 0,
    longTasks,
    longMax,
  };
}
