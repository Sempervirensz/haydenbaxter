/**
 * Safari-scroll lab — variant configs.
 *
 * Each variant is a real top-level route under /lab/scroll/[id]. Open several
 * tabs in Safari and compare scroll feel through the Work / CD section.
 *
 * NOTE: keep the option strings stable — they are read by CSS attribute
 * selectors in safari-lab.css and by useWorkScrollLab.
 */

export type ScrollHookMode = "raf-always" | "raf-while-lerping" | "passive-scroll-only";
export type CdTransformMode = "css-var" | "direct-transform";
export type SafariCardMode = "default" | "no-blur" | "no-shadow-no-blur";
export type GlobeMode = "always-on" | "pause-offscreen";
export type MemoMode = "off" | "on";
export type RootCssMode = "default" | "safari-no-gutter" | "safari-no-clip";
export type StickyMode = "vh-top" | "px-top";
export type CompositingMode = "none" | "will-change-transform" | "contain-paint";

export interface LabConfig {
  scrollHook: ScrollHookMode;
  cdTransform: CdTransformMode;
  safariCards: SafariCardMode;
  globe: GlobeMode;
  memoChapters: MemoMode;
  rootCss: RootCssMode;
  sticky: StickyMode;
  compositing: CompositingMode;
}

export interface LabVariant {
  id: string;
  title: string;
  hypothesis: string;
  config: LabConfig;
}

const baseline: LabConfig = {
  scrollHook: "raf-always",
  cdTransform: "direct-transform",
  safariCards: "no-shadow-no-blur",
  globe: "always-on",
  memoChapters: "off",
  rootCss: "default",
  sticky: "vh-top",
  compositing: "contain-paint",
};

export const VARIANTS: LabVariant[] = [
  {
    id: "00-baseline",
    title: "Baseline (current main)",
    hypothesis: "Reference point. Matches what is shipped at HEAD.",
    config: { ...baseline },
  },
  {
    id: "01-scroll-while-lerping",
    title: "Scroll hook: rAF only while lerping",
    hypothesis: "Always-on rAF + per-frame getBoundingClientRect is the dominant Safari cost. Sample scroll passively and only run rAF while disc is settling.",
    config: { ...baseline, scrollHook: "raf-while-lerping" },
  },
  {
    id: "02-passive-scroll-only",
    title: "Scroll hook: passive scroll, no rAF lerp",
    hypothesis: "Drop the lerp entirely and snap CD on each passive scroll event. Removes RAF from hot path completely.",
    config: { ...baseline, scrollHook: "passive-scroll-only" },
  },
  {
    id: "03-globe-pause-offscreen",
    title: "Globe: frameloop=never when off-screen",
    hypothesis: "Three.js Canvas at 60fps competes with scroll compositor on Safari. Suspend frameloop when SupplyChain chapter is not active.",
    config: { ...baseline, globe: "pause-offscreen" },
  },
  {
    id: "04-memo-chapters",
    title: "React: memo'd detail chapters",
    hypothesis: "activeLabel ticks every frame; without memo all four chapter trees reconcile per tick.",
    config: { ...baseline, memoChapters: "on" },
  },
  {
    id: "05-safari-root-no-gutter",
    title: "Root CSS: drop scrollbar-gutter on Safari",
    hypothesis: "html { scrollbar-gutter: stable } combined with overflow-x: clip is a known WebKit sticky stressor.",
    config: { ...baseline, rootCss: "safari-no-gutter" },
  },
  {
    id: "06-safari-root-no-clip",
    title: "Root CSS: drop overflow-x clip on Safari",
    hypothesis: "overflow-x: clip on <html>/<body> can interact badly with sticky descendants in WebKit.",
    config: { ...baseline, rootCss: "safari-no-clip" },
  },
  {
    id: "07-compositing-will-change",
    title: "Compositing: will-change instead of contain:paint",
    hypothesis: "contain: paint on sticky cards may force Safari to rebuild paint scopes during handoff between chapters. will-change: transform is a gentler hint.",
    config: { ...baseline, compositing: "will-change-transform" },
  },
  {
    id: "08-compositing-off",
    title: "Compositing: no GPU hints at all",
    hypothesis: "Maybe we are over-promoting. Let WebKit decide layer boundaries on its own.",
    config: { ...baseline, compositing: "none" },
  },
  {
    id: "09-sticky-px-top",
    title: "Sticky: fixed px top instead of 6vh",
    hypothesis: "vh-relative sticky tops can subpixel-shift across the scroll when WebKit recomputes layout.",
    config: { ...baseline, sticky: "px-top" },
  },
  {
    id: "10-stack",
    title: "Stack: hook + globe + memo + no-gutter",
    hypothesis: "Combined attack — the four likeliest helpers stacked. If this is not visibly smoother, the cause is elsewhere.",
    config: {
      ...baseline,
      scrollHook: "raf-while-lerping",
      globe: "pause-offscreen",
      memoChapters: "on",
      rootCss: "safari-no-gutter",
    },
  },
];

export const VARIANT_MAP: Record<string, LabVariant> = Object.fromEntries(
  VARIANTS.map((v) => [v.id, v]),
);
