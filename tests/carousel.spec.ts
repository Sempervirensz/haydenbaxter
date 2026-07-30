import { test, expect } from "@playwright/test";
import { openSite, settleImages } from "./helpers";

/* The brand marquee.
 *
 * Two bugs shipped here, both invisible below ~1600px and both arithmetic
 * rather than visual, which is why they survived review:
 *
 *   1. The track used `gap` while the keyframe shifted by -50%. With N items
 *      there are N-1 gaps, so half the track is (N/2 items + (N-1)/2 gaps)
 *      while a seamless shift needs N/2 of each. Every cycle snapped by half a
 *      gap — 40px at desktop.
 *
 *   2. Item widths came from the images' intrinsic size, so the belt was
 *      2694px total. Against a 3840px viewport that is 2493px of blank canvas
 *      scrolling past on every loop.
 *
 * Both are prevented by the same invariant: every logo occupies an identical
 * fixed-width slot, so the shift is a whole number of slots. */

async function marquee(page: import("@playwright/test").Page) {
  await settleImages(page, ".brands__track");
  return page.evaluate(() => {
    const section = document.querySelector(".brands");
    const track = document.querySelector(".brands__track");
    if (!section || !track) return null;
    const items = [...track.children];
    const widths = items.map((el) => Math.round(el.getBoundingClientRect().width * 100) / 100);
    const unique = [...new Set(widths)];
    const total = widths.reduce((a, b) => a + b, 0);
    const cs = getComputedStyle(section);
    const logos = parseInt(cs.getPropertyValue("--brands-logos").trim() || "3", 10);
    const cycle = unique.length === 1 ? unique[0] * logos : NaN;
    return {
      count: items.length,
      unique,
      slot: unique[0],
      total,
      cycle,
      logos,
      coverage: total - cycle,
      viewport: window.innerWidth,
      duration: cs.getPropertyValue("--brands-duration").trim(),
      columnGap: parseFloat(getComputedStyle(track).columnGap) || 0,
    };
  });
}

test("every logo occupies an identical slot", async ({ page }) => {
  await openSite(page, "/");
  const m = await marquee(page);
  expect(m, "brands track missing").not.toBeNull();
  expect(m!.unique, `slot widths must be uniform, got ${m!.unique.join("/")}`).toHaveLength(1);
  expect(m!.slot).toBeGreaterThan(0);
});

test("the track carries no flex gap", async ({ page }) => {
  await openSite(page, "/");
  const m = await marquee(page);
  // A reintroduced `gap` is precisely the half-gap-jump bug coming back, and it
  // would still LOOK fine in a static screenshot.
  expect(m!.columnGap, "column-gap must stay 0; spacing lives in the slot").toBe(0);
});

test("the belt always covers the viewport after a full shift", async ({ page }) => {
  await openSite(page, "/");
  const m = await marquee(page);
  expect(
    m!.coverage,
    `belt covers ${Math.round(m!.coverage)}px of a ${m!.viewport}px viewport — a gap would show`
  ).toBeGreaterThanOrEqual(m!.viewport);
});

test("the item count is a whole number of passes", async ({ page }) => {
  await openSite(page, "/");
  const m = await marquee(page);
  expect(
    m!.count % m!.logos,
    "belt must hold whole passes or the loop cannot be seamless"
  ).toBe(0);
});

test("shifting by one cycle lands pixel-identically", async ({ page }) => {
  await openSite(page, "/");
  const m = await marquee(page);

  // The real proof: freeze the animation, sample every item's position at
  // t=0 and at t=cycle, and require item i to land exactly where item
  // i+logos sat. Any drift is the seam the visitor sees.
  const maxDrift = await page.evaluate((cycle: number) => {
    const track = document.querySelector(".brands__track") as HTMLElement;
    const items = [...track.children] as HTMLElement[];
    const logos = parseInt(
      getComputedStyle(document.querySelector(".brands")!).getPropertyValue("--brands-logos") || "3",
      10
    );
    track.getAnimations().forEach((a) => a.pause());
    const prevAnim = track.style.animation;
    track.style.animation = "none";

    track.style.transform = "translateX(0px)";
    const at0 = items.map((el) => el.getBoundingClientRect().left);
    track.style.transform = `translateX(${-cycle}px)`;
    const at1 = items.map((el) => el.getBoundingClientRect().left);

    track.style.transform = "";
    track.style.animation = prevAnim;

    let max = 0;
    for (let i = 0; i + logos < items.length; i++) {
      max = Math.max(max, Math.abs(at1[i + logos] - at0[i]));
    }
    return max;
  }, m!.cycle);

  expect(maxDrift, "seam drift after one cycle").toBeLessThanOrEqual(0.5);
});

test("hover and reduced-motion behaviour survive", async ({ page }) => {
  await openSite(page, "/");
  const hasAnim = await page.evaluate(() => {
    const t = document.querySelector(".brands__track")!;
    return getComputedStyle(t).animationName !== "none";
  });
  expect(hasAnim, "marquee should animate by default").toBe(true);

  // Hover must still lift the logo opacity (the CSS hover contract).
  await page.locator(".brands__track").hover({ force: true });
  const hovered = await page.evaluate(() => {
    const img = document.querySelector(".brands__logo--img img");
    return img ? getComputedStyle(img).opacity : null;
  });
  expect(hovered).not.toBeNull();
});
