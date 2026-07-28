"use client";

// One state model for all three concepts.
//
// The whole interaction is two levels deep and nothing else. Concepts differ in
// how they *render* a level, never in what levels exist — that's what makes them
// comparable, and it's why there are no ad-hoc class toggles anywhere in the
// concept components.
//
//   intro       →  the CTA, alone
//   paths       →  the three things a visitor could actually want
//   destination →  one complete screen. Terminal: nothing branches out of it.
//
// `back` always steps up exactly one level, so Back / Escape mean the same thing
// at every point in every concept.

import { useCallback, useMemo, useReducer } from "react";
import type { PathId, Step } from "@/data/ctaLab";

export interface FlowState {
  step: Step;
  path: PathId | null;
}

export type FlowAction =
  | { type: "open" }
  | { type: "choosePath"; path: PathId }
  | { type: "back" }
  | { type: "reset" };

export const INITIAL_FLOW: FlowState = { step: "intro", path: null };

/** Exported so the transitions can be exercised without a browser. */
export function ctaFlowReducer(state: FlowState, action: FlowAction): FlowState {
  switch (action.type) {
    case "open":
      return state.step === "intro" ? { step: "paths", path: null } : state;

    case "choosePath":
      return { step: "destination", path: action.path };

    case "back":
      if (state.step === "destination") return { step: "paths", path: null };
      if (state.step === "paths") return INITIAL_FLOW;
      return state;

    case "reset":
      return INITIAL_FLOW;

    default:
      return state;
  }
}

export function useCtaFlow() {
  const [state, dispatch] = useReducer(ctaFlowReducer, INITIAL_FLOW);

  const open = useCallback(() => dispatch({ type: "open" }), []);
  const choosePath = useCallback(
    (path: PathId) => dispatch({ type: "choosePath", path }),
    []
  );
  const back = useCallback(() => dispatch({ type: "back" }), []);
  const reset = useCallback(() => dispatch({ type: "reset" }), []);

  /** Human-readable state, for the lab readout. */
  const label = useMemo(
    () => [state.step, state.path].filter(Boolean).join(" · "),
    [state]
  );

  return { state, label, open, choosePath, back, reset };
}

export type CtaFlow = ReturnType<typeof useCtaFlow>;
