import { test, expect } from "@playwright/test";
import { openSite, gotoCard, isCinematic, box, overflowX } from "./helpers";

/* Live interactions only.
 *
 * Note for anyone extending this: several interactions named in the original
 * design brief DO NOT EXIST in the shipped components — Emerging Tech filtering
 * and sorting, Consulting offer-card modals and badges, and the Supply Chain
 * proof drawer / map / light-up typography. Their CSS survives in
 * work-details.css (.cns-modal, .cns-offerCard, .cns-badge, .scs-minimalLanding,
 * .scs-proof) but no .tsx references any of it. Do not write tests against
 * those class names; they will pass vacuously or fail confusingly. */

test.describe("soft-lock gate", () => {
  test("Skip releases the page and reveals the gated sections", async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });
    const gated = page.locator(".dlab-gate__content");
    await expect(gated).toHaveClass(/is-locked/);
    await page.locator("button", { hasText: /Skip the intro/i }).first().click();
    await expect(gated).toHaveClass(/is-open/);
    // aria-hidden must lift too, or the whole site stays out of the a11y tree.
    await expect(gated).not.toHaveAttribute("aria-hidden", "true");
  });
});

test.describe("Emerging Tech accordion + dossier", () => {
  test("a bar opens the dossier, and Close and Escape both dismiss it", async ({ page }) => {
    await openSite(page, "/emerging-tech-builds");
    const overlay = page.locator(".etb-overlay");
    const bars = page.locator(".etb-bar__head");
    await expect(bars.first()).toBeVisible();

    await bars.nth(1).click();
    await expect(overlay).toHaveClass(/is-open/);

    // Close button
    await page.locator(".etb-dos__close").click();
    await expect(overlay).not.toHaveClass(/is-open/);

    // Escape
    await bars.nth(2).click();
    await expect(overlay).toHaveClass(/is-open/);
    await page.keyboard.press("Escape");
    await expect(overlay).not.toHaveClass(/is-open/);
  });

  test("the dossier stays inside the shell and does not stretch to empty", async ({ page }) => {
    await openSite(page, "/emerging-tech-builds");
    await page.locator(".etb-bar__head").nth(1).click();
    await expect(page.locator(".etb-overlay")).toHaveClass(/is-open/);
    await page.waitForTimeout(400);

    const overlay = await box(page, ".etb-overlay");
    const shell = await box(page, ".etb-gallery__shell");
    expect(overlay!.right, "dossier escapes the shell").toBeLessThanOrEqual(shell!.right + 1);
    expect(overlay!.left).toBeGreaterThanOrEqual(shell!.left - 1);

    // It must hug its content rather than inherit the full stack height.
    const slack = await page.evaluate(() => {
      const o = document.querySelector(".etb-overlay") as HTMLElement;
      const dos = document.querySelector(".etb-dos") as HTMLElement;
      if (!o || !dos) return null;
      return o.getBoundingClientRect().height - dos.scrollHeight;
    });
    if (slack != null) {
      expect(slack, "dossier has empty surface below its content").toBeLessThanOrEqual(120);
    }
  });

  test("hover marks the bar and the stack", async ({ page }) => {
    await openSite(page, "/emerging-tech-builds");
    await page.locator(".etb-bar").first().hover();
    await expect(page.locator(".etb-barStack")).toHaveClass(/has-hover/);
    await expect(page.locator(".etb-bar").first()).toHaveClass(/is-hovered/);
  });

  test("bars are keyboard reachable and operable", async ({ page }) => {
    await openSite(page, "/emerging-tech-builds");
    const first = page.locator(".etb-bar__head").first();
    await first.focus();
    await expect(first).toBeFocused();
    await page.keyboard.press("Enter");
    await expect(page.locator(".etb-overlay")).toHaveClass(/is-open/);
  });
});

test.describe("Consulting — Work Together flow", () => {
  test.skip(({ viewport }) => (viewport?.width ?? 0) < 1024, "cinematic stack only");

  test("intro to paths to destination, and back again", async ({ page }) => {
    await openSite(page, "/");
    await gotoCard(page, 4);

    const wt = page.locator(".wt");
    await expect(wt).toHaveAttribute("data-step", "intro");

    await page.locator(".wt__cta").click();
    await expect(wt).toHaveAttribute("data-step", "paths");

    await page.locator(".wt__rowBtn").first().click();
    await expect(wt).toHaveAttribute("data-step", "destination");
    await expect(page.locator(".wt-screen")).toBeVisible();

    // Back out of the destination screen
    await page.locator(".wt-screen__back").click();
    await expect(wt).toHaveAttribute("data-step", "paths");

    // And back to the intro
    await page.locator(".wt__back").click();
    await expect(wt).toHaveAttribute("data-step", "intro");
  });

  test("the proof sheet fits its card and needs no inner scroll", async ({ page }) => {
    await openSite(page, "/");
    await gotoCard(page, 4);
    await page.locator(".wt__cta").click();
    await page.locator(".wt__rowBtn").first().click();
    await expect(page.locator(".wt-screen")).toBeVisible();
    await page.waitForTimeout(500);

    const sheet = await box(page, ".wt-screen");
    const card = await box(page, ".cstack__card--4");
    expect(sheet!.bottom, "proof sheet spills past the card").toBeLessThanOrEqual(card!.bottom + 1);
    expect(sheet!.right).toBeLessThanOrEqual(card!.right + 1);
    expect(await overflowX(page)).toBeLessThanOrEqual(1);
  });

  test("rows are keyboard operable", async ({ page }) => {
    await openSite(page, "/");
    await gotoCard(page, 4);
    await page.locator(".wt__cta").focus();
    await page.keyboard.press("Enter");
    await expect(page.locator(".wt")).toHaveAttribute("data-step", "paths");
    const row = page.locator(".wt__rowBtn").first();
    await row.focus();
    await expect(row).toBeFocused();
    await page.keyboard.press("Enter");
    await expect(page.locator(".wt")).toHaveAttribute("data-step", "destination");
  });
});

test.describe("Supply Chain timeline", () => {
  test.skip(({ viewport }) => (viewport?.width ?? 0) < 1024, "cinematic stack only");

  test("selecting a stop activates it", async ({ page }) => {
    await openSite(page, "/");
    await gotoCard(page, 3);
    const items = page.locator(".sc-ed__item");
    const n = await items.count();
    expect(n, "timeline stops").toBeGreaterThan(0);

    // Stops reveal progressively with scroll; click the first enabled one.
    const enabled = items.locator("visible=true");
    await enabled.first().click({ force: true });
    await expect(page.locator(".sc-ed__item.is-active")).toHaveCount(1);
  });

  test("the globe grows with the viewport", async ({ page }) => {
    await openSite(page, "/");
    await gotoCard(page, 3);
    const vw = page.viewportSize()!.width;
    const size = await page.evaluate(() => {
      const g = document.querySelector(".sc-ed__globe");
      const wrap = g?.firstElementChild as HTMLElement | undefined;
      return wrap ? Math.round(wrap.getBoundingClientRect().width) : null;
    });
    expect(size, "globe wrapper").not.toBeNull();
    // 360 is the useState default — seeing it means sizing never ran.
    expect(size, "globe stuck at its initial state").not.toBe(360);
    if (vw >= 2560) expect(size!).toBeGreaterThanOrEqual(700);
  });
});

test.describe("navigation", () => {
  test("nav links reach their sections through the gate", async ({ page }) => {
    await openSite(page, "/");
    const about = page.locator('a[href="#about"]').first();
    if (!(await about.count())) test.skip(true, "no #about link at this width");
    await about.click();
    await expect(page.locator("#about")).toBeInViewport({ ratio: 0.05, timeout: 8000 });
  });
});
