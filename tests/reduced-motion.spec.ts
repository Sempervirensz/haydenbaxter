import { test, expect } from "@playwright/test";
import { openSite, gotoCard, isCinematic } from "./helpers";

/* prefers-reduced-motion.
 *
 * The repo rule is absolute: "Any animation must respect
 * prefers-reduced-motion." The marquee is the one most likely to regress,
 * because its guard is `animation: none !important` in a media query far away
 * from the keyframe it disables — an easy thing to leave behind when the
 * keyframe is rewritten (as it was, to fix the seam). */

test.use({ contextOptions: { reducedMotion: "reduce" } });

test("the brand marquee stops animating", async ({ page }) => {
  await openSite(page, "/");
  const anim = await page.evaluate(() => {
    const t = document.querySelector(".brands__track");
    if (!t) return null;
    const cs = getComputedStyle(t);
    return { name: cs.animationName, running: t.getAnimations().length };
  });
  expect(anim, "brands track missing").not.toBeNull();
  expect(anim!.name, "marquee must not animate under reduced motion").toBe("none");
});

test("the marquee still covers the viewport when frozen", async ({ page }) => {
  await openSite(page, "/");
  // Frozen at translateX(0) the belt must still fill the frame, or reduced
  // motion users see a half-empty strip.
  const { total, vw } = await page.evaluate(() => {
    const track = document.querySelector(".brands__track")!;
    const total = [...track.children].reduce(
      (a, el) => a + el.getBoundingClientRect().width,
      0
    );
    return { total, vw: window.innerWidth };
  });
  expect(total).toBeGreaterThanOrEqual(vw);
});

test("hero and card transitions are neutralised", async ({ page }) => {
  await openSite(page, "/");
  const moving = await page.evaluate(() => {
    const out: string[] = [];
    document.querySelectorAll<HTMLElement>("*").forEach((el) => {
      const r = el.getBoundingClientRect();
      if (r.width < 4 || r.height < 4) return;
      const cs = getComputedStyle(el);
      if (cs.animationName !== "none" && cs.animationIterationCount === "infinite") {
        out.push((el.className || el.tagName).toString().split(" ")[0]);
      }
    });
    return [...new Set(out)];
  });
  expect(moving, "infinite animations still running under reduced motion").toEqual([]);
});

test("the Work chapters still render and are readable", async ({ page }) => {
  await openSite(page, "/");
  test.skip(!isCinematic(page), "cinematic stack only");
  // Reduced motion must not mean reduced CONTENT — the chapters still have to
  // be reachable and laid out.
  await gotoCard(page, 3);
  const visible = await page.evaluate(() => {
    const el = document.querySelector(".sc-ed__cols");
    if (!el) return false;
    const r = el.getBoundingClientRect();
    return r.width > 100 && r.height > 100;
  });
  expect(visible, "Supply Chain did not render under reduced motion").toBe(true);
});
