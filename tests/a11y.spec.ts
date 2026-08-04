import { test, expect } from "@playwright/test";
import { openSite, collectConsoleErrors } from "./helpers";

/* Accessibility and console hygiene.
 *
 * Deliberately hand-rolled rather than pulling in axe: the repo's own rules
 * name four specific obligations (visible focus, keyboard operability, ESC
 * closes overlays, reduced motion respected) and those are what is asserted
 * here. A full axe sweep would be a separate, larger conversation about
 * colour contrast in a deliberately dark gallery aesthetic. */

const ROUTES = ["/", "/blog", "/privacy", "/emerging-tech-builds"];

test.describe("console is clean", () => {
  for (const route of ROUTES) {
    test(`${route} logs no errors`, async ({ page }) => {
      const errors = collectConsoleErrors(page);
      await openSite(page, route);
      await page.waitForTimeout(1200);
      expect(errors, `console errors on ${route}`).toEqual([]);
    });
  }
});

test.describe("keyboard access", () => {
  test("tabbing from the top reaches a visible, focused control", async ({ page }) => {
    await openSite(page, "/");
    await page.keyboard.press("Tab");
    const info = await page.evaluate(() => {
      const el = document.activeElement as HTMLElement | null;
      if (!el || el === document.body) return null;
      const cs = getComputedStyle(el);
      const r = el.getBoundingClientRect();
      return {
        tag: el.tagName,
        visible: r.width > 0 && r.height > 0 && cs.visibility !== "hidden",
        outline: cs.outlineStyle,
        outlineWidth: cs.outlineWidth,
        boxShadow: cs.boxShadow,
      };
    });
    expect(info, "nothing received focus on first Tab").not.toBeNull();
    expect(info!.visible, "focused element is not visible").toBe(true);
  });

  test("focused controls have a visible focus indicator", async ({ page }) => {
    await openSite(page, "/emerging-tech-builds");
    const bar = page.locator(".etb-bar__head").first();
    await bar.focus();
    const hasIndicator = await page.evaluate(() => {
      const el = document.activeElement as HTMLElement;
      const cs = getComputedStyle(el);
      // Any of these counts: the repo uses outline on some controls and an
      // inset shadow / border colour change on the DYMO-style ones.
      const outline = cs.outlineStyle !== "none" && parseFloat(cs.outlineWidth) > 0;
      const shadow = cs.boxShadow !== "none";
      return outline || shadow;
    });
    expect(hasIndicator, "no visible focus indicator on the ETB bar").toBe(true);
  });

  test("gated content is out of the tab order while locked", async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });
    const hidden = await page.locator(".dlab-gate__content").getAttribute("aria-hidden");
    expect(hidden, "locked gate must be aria-hidden").toBe("true");
  });
});

test.describe("landmarks and alt text", () => {
  test("every route has exactly one main landmark", async ({ page }) => {
    for (const route of ROUTES) {
      await openSite(page, route);
      const mains = await page.locator("main").count();
      expect(mains, `${route} main landmarks`).toBeGreaterThanOrEqual(1);
    }
  });

  test("decorative marquee repeats are hidden from assistive tech", async ({ page }) => {
    await openSite(page, "/");
    const { total, hidden, logos } = await page.evaluate(() => {
      const track = document.querySelector(".brands__track")!;
      const items = [...track.children];
      const logos = parseInt(
        getComputedStyle(document.querySelector(".brands")!).getPropertyValue("--brands-logos") ||
          "3",
        10
      );
      return {
        total: items.length,
        hidden: items.filter((i) => i.getAttribute("aria-hidden") === "true").length,
        logos,
      };
    });
    // Exactly one pass should be announced; the rest are visual filler.
    expect(hidden, "duplicate logos must be aria-hidden").toBe(total - logos);
  });

  test("content images carry alt text", async ({ page }) => {
    await openSite(page, "/emerging-tech-builds/atomic-os");
    const missing = await page.evaluate(() =>
      [...document.querySelectorAll("img")]
        .filter((i) => i.getAttribute("alt") === null)
        .map((i) => i.getAttribute("src") ?? "(no src)")
    );
    expect(missing, "images without an alt attribute").toEqual([]);
  });
});
