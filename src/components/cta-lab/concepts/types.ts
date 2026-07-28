import type { CtaFlow } from "../useCtaFlow";

export interface ConceptProps {
  flow: CtaFlow;
  /** Only the primary stage claims focus — the compare view renders two. */
  primary?: boolean;
}
