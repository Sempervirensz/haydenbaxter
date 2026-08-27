/* Option channel for the landing affordance arms.
 *
 * Same shape as the disc probe's: query params so a real phone can be pointed
 * straight at an arm, an in-memory override so the framing lab can switch arms
 * without reloading, and a postMessage listener so it can do that from outside
 * the iframe. Dev-only throughout — a shared URL cannot turn a visitor's
 * homepage into an experiment.
 */

import {
  LANDING_DEFAULTS,
  isLandingVariant,
  isPlayStyle,
  type LandingOptions,
} from "./landing-variants";

export const LANDING_CHANNEL = "landing-ctl";

let override: LandingOptions | null = null;
const listeners = new Set<() => void>();

function boolParam(params: URLSearchParams, key: string): boolean {
  const v = params.get(key);
  return v === "" || v === "1" || v === "true";
}

export function readLandingOptions(): LandingOptions {
  if (process.env.NODE_ENV !== "development") return LANDING_DEFAULTS;
  if (typeof window === "undefined") return LANDING_DEFAULTS;
  if (override) return override;
  const params = new URLSearchParams(window.location.search);
  const v = params.get("landing");
  return {
    variant: v && isLandingVariant(v) ? v : LANDING_DEFAULTS.variant,
    start: boolParam(params, "start"),
    /* `?play` with no value means the default placement, so a hand-typed URL
       on a phone does not have to know the vocabulary. */
    play: (() => {
      const raw = params.get("play");
      if (raw === null) return LANDING_DEFAULTS.play;
      if (raw === "" || raw === "1" || raw === "true") return "hub" as const;
      return isPlayStyle(raw) ? raw : LANDING_DEFAULTS.play;
    })(),
    cue: boolParam(params, "cue"),
  };
}

export function setLandingOptions(next: LandingOptions) {
  override = next;
  listeners.forEach((fn) => fn());
}

export function subscribeLanding(fn: () => void) {
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
}

export function listenForLandingMessages() {
  if (process.env.NODE_ENV !== "development") return () => {};
  const onMessage = (e: MessageEvent) => {
    const data = e.data as { source?: string; value?: Partial<LandingOptions> } | null;
    if (!data || data.source !== LANDING_CHANNEL || !data.value) return;
    const v = data.value;
    setLandingOptions({
      variant: v.variant && isLandingVariant(v.variant) ? v.variant : LANDING_DEFAULTS.variant,
      start: !!v.start,
      play: v.play && isPlayStyle(v.play) ? v.play : LANDING_DEFAULTS.play,
      cue: !!v.cue,
    });
  };
  window.addEventListener("message", onMessage);
  return () => window.removeEventListener("message", onMessage);
}
