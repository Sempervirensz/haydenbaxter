/* Mobile scroll lab — the techniques under test.
 *
 * Every one of these drives the SAME disc on the SAME real page. What varies is
 * how scroll position becomes an angle, which is the thing actually in question:
 * the disc is frozen on phones because the shipped way of doing it costs a
 * per-frame layout read, not because a turning disc is unwanted.
 *
 * Two axes are deliberately tangled here, because on a phone they cannot be
 * separated — a technique that feels right and drops frames has not solved
 * anything, and neither has one that runs free and feels dead:
 *
 *   COST   what the technique spends per frame of momentum scroll
 *   FEEL   how the disc responds to the flick
 *
 * `getCdState` is imported from the hook rather than reimplemented. Every
 * technique animates the same choreography, so a difference between two arms
 * is a difference in technique and never in the curve.
 */

import { getCdState, LERP_SPEED } from "@/hooks/cdChoreography";
import type { WorkScrollZone } from "@/data/work";

export type DiscTechnique =
  | "off"
  | "rect"
  | "cached"
  | "direct"
  | "freewheel"
  | "native";

/* Switches rather than lookups in a table, so nothing in this file is a
   top-level data structure the bundler has to keep alive. See
   disc-technique-catalog.ts for why that matters. */
export function isDiscTechnique(v: string): v is DiscTechnique {
  switch (v) {
    case "off":
    case "rect":
    case "cached":
    case "direct":
    case "freewheel":
    case "native":
      return true;
    default:
      return false;
  }
}

/** May the JS loop run on this technique, on ANY device?
 *
 *  `off` is true, which reads oddly until you remember what `off` means: it is
 *  the shipped build, and the shipped build runs the loop on desktop and
 *  freezes it on phones. The freeze is a device gate, applied separately.
 *  `native` is false everywhere — the compositor drives the disc through a CSS
 *  `rotate`, and a JS transform write would compose on top and show the disc at
 *  the sum of the two. */
export function techniqueRunsLoop(id: DiscTechnique): boolean {
  return id !== "native";
}

/** Cheap geometry (cached on resize) rather than a layout read per frame. */
export function techniqueUsesCache(id: DiscTechnique): boolean {
  return id === "cached" || id === "direct" || id === "freewheel";
}

/* ---- Feel: how the written angle follows the curve ---------------------- */

/** Returns the next angle to write, given where it is and where the curve says
 *  it should be. `progress` is section progress, for techniques that care about
 *  the rate of scroll rather than its position. */
export type DiscSmoother = (current: number, target: number, progress: number) => number;

/* An impulse model, not a position mapping: scrolling spins the disc up and
   friction spins it down. Tuned as a CD rather than a vinyl platter — it
   settles in roughly a second, because `.claude/rules/design-language.md` asks
   for grounded motion and a disc still coasting three seconds later reads as a
   toy.
   
   GAIN is calibrated in PROGRESS units, not pixels, and that matters here: the
   Work section is ~3,400px on a phone against ~13,000px on desktop, so the same
   flick is four times more progress on the phone. Reading velocity in progress
   keeps the disc's response to a given flick the same on both.
   
   At 0.9, angular velocity falls to a standstill in about a second at 60fps;
   the gain puts a firm flick at roughly a degree per frame per percent of
   section scrolled. Both were set by watching the disc, not derived. */
const FREEWHEEL_GAIN = 74;
const FREEWHEEL_FRICTION = 0.9;
/* A ceiling on how much momentum one frame can add.
   
   Without it, any jump that is not a scroll — an anchor link, a back
   navigation, the lab resetting the frame to the top of Work — arrives as a
   single enormous delta and throws the disc into a spin nobody asked for. Real
   input cannot exceed this: a hard iOS flick peaks near 120px/frame, which is
   ~0.04 of the Work section on a phone and ~0.01 on desktop. */
const FREEWHEEL_MAX_DELTA = 0.06;

export function makeSmoother(id: DiscTechnique, reduceMotion: boolean): DiscSmoother {
  /* Under `reduce`, every arm collapses to the same thing: the angle is a
     function of scroll position and stops when scrolling stops. Freewheel in
     particular is motion that CONTINUES after input ends, which is exactly what
     the preference is asking not to happen. */
  if (reduceMotion) return (_c, target) => target;

  if (id === "direct") return (_c, target) => target;

  if (id === "freewheel") {
    let vel = 0;
    let lastProgress: number | null = null;
    return (current, _target, progress) => {
      const raw = lastProgress === null ? 0 : progress - lastProgress;
      lastProgress = progress;
      const delta = Math.max(-FREEWHEEL_MAX_DELTA, Math.min(FREEWHEEL_MAX_DELTA, raw));
      vel += delta * FREEWHEEL_GAIN;
      vel *= FREEWHEEL_FRICTION;
      // Park it rather than creeping by fractions of a degree forever.
      if (Math.abs(vel) < 0.02) vel = 0;
      return current - vel;
    };
  }

  return (current, target) => current + (target - current) * LERP_SPEED;
}

/* ---- Cost: the arm with no per-frame cost at all ------------------------ */

export const NATIVE_STYLE_ID = "disc-native-timeline";

/* Sampled rather than hand-authored. The shipped curve is piecewise — five
   holds joined by eased ramps, then a fast spin-off past the last hold — and
   any CSS easing that "looked close" would make this arm incomparable to the
   others. Sampling `getCdState` guarantees it is the same animation.
   
   One real difference remains, and it is the point of the arm: there is no
   lerp here, so native tracks the curve exactly where the JS arms lag behind
   it. `direct` is the arm to compare it against for feel; `off` for cost. */
export function nativeDiscCss(
  zones: WorkScrollZone[],
  landingBreak: number,
  steps = 160
): string {
  const stops: string[] = [];
  for (let i = 0; i <= steps; i += 1) {
    const landingProgress = i / steps;
    const pct = landingProgress * landingBreak * 100;
    stops.push(`${pct.toFixed(3)}%{rotate:${getCdState(landingProgress, zones).deg.toFixed(2)}deg}`);
  }
  // Past the landing chapter the shipped disc holds its last angle.
  stops.push(`100%{rotate:${getCdState(1, zones).deg.toFixed(2)}deg}`);

  return [
    `@keyframes disc-native-spin{${stops.join("")}}`,
    /* The timeline is the Work section's own pass through the viewport.
       `contain` for a subject taller than the scrollport runs from "top edge
       reaches the top of the viewport" to "bottom edge reaches the bottom" —
       which is exactly the range `getProgress()` maps to 0→1, so the two are
       the same scroll span and not merely similar ones. */
    `#work{view-timeline-name:--disc-work;view-timeline-axis:block}`,
    `@supports (animation-timeline: view()){`,
    /* No `prefers-reduced-motion: no-preference` wrapper here, and it would
       make no difference if there were one.
       
       KNOWN LIMIT OF THIS ARM, measured rather than assumed: globals.css
       already carries `@media (prefers-reduced-motion: reduce){ .cd-disc{
       animation:none !important } }`. That rule cannot see the difference
       between autonomous motion and a scroll mapping, so under `reduce` it
       kills this arm outright and the disc sits at 0deg — while every JS arm
       still tracks scroll there, because writing a transform is not an
       animation and the rule does not reach it.
       
       So the arms are NOT equivalent under `reduce`, and shipping `native`
       would mean either accepting a frozen disc for those users or carving an
       exception into that rule. Left alone deliberately: quietly out-specifying
       a site-wide accessibility rule from inside a lab is how you end up
       shipping the exception by accident.
       
       `rotate`, not `transform`. The disc's transform carries translateZ(0) for
       its compositor layer, and animating that property here would replace it —
       the same trap personas-lab documents for its entrance animation. */
    `.cd-disc{animation:disc-native-spin linear both;animation-timeline:--disc-work;animation-range:contain 0% contain 100%}`,
    `}`,
  ].join("");
}

/** Whether this browser can run the `native` arm at all. */
export function supportsNativeTimeline(): boolean {
  return (
    typeof CSS !== "undefined" &&
    typeof CSS.supports === "function" &&
    CSS.supports("animation-timeline: view()")
  );
}
