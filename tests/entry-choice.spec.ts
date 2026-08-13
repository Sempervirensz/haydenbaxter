import { test, expect, type Page } from "@playwright/test";
import { collectConsoleErrors } from "./helpers";

/* The SHIPPED homepage entry — the soft-lock gate on `/`.
 *
 * Designed in /entry-cta-lab and promoted from it: indicator 01 "Mini cards"
 * and route choice 02 "Even". This file guards the production surface; the lab
 * spec guards the lab. They share copy through src/data/entryChoice.ts, so the
 * assertions here are about behaviour and rendering rather than wording drift.
 */

const STORY = ".dlab-soft__line:not(.dlab-soft__line--direct)";
const DIRECT = ".dlab-soft__line--direct";
const MARK = ".dlab-soft__mark";

/**
 * Wait until the entry is genuinely interactive.
 *
 * The site-wide intro splash is rendered by RootLayout and covers the whole
 * viewport for roughly nine seconds. Waiting on the deck being hit-testable
 * covers both that and hydration, without coupling to the splash's internals.
 */
async function ready(page: Page) {
  await expect(page.locator(".dlab-soft__choice")).toBeVisible();
  await page.waitForFunction(
    () => {
      const card = document.querySelector("button.card-hover-wrapper");
      if (!card) return false;
      const r = card.getBoundingClientRect();
      if (r.bottom < 0 || r.top > window.innerHeight) return false;
      const hit = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2);
      return !!hit?.closest("button.card-hover-wrapper");
    },
    undefined,
    { timeout: 30_000 }
  );
}

test.describe("homepage entry choice", () => {
  test("offers the two routes and no Skip button", async ({ page }) => {
    await page.goto("/", { waitUntil: "load" });
    await ready(page);

    await expect(page.locator(STORY)).toHaveText(
      "Flip the four cards to continue in Story Mode."
    );
    await expect(page.locator(".dlab-soft__or")).toHaveText("or");
    await expect(page.locator(DIRECT)).toContainText("Skip ahead and see where I can add value");

    // The retired control and its copy are gone from the shipped page.
    await expect(page.locator(".dlab-soft__skip")).toHaveCount(0);
    await expect(page.getByText(/skip the intro/i)).toHaveCount(0);
    await expect(page.getByText(/^begin here$/i)).toHaveCount(0);
  });

  test("both lines carry one brightness — the Even treatment", async ({ page }) => {
    await page.goto("/", { waitUntil: "load" });
    await ready(page);

    const [story, direct] = await page.evaluate(() => {
      const lines = [...document.querySelectorAll(".dlab-soft__line")];
      return lines.map((l) => getComputedStyle(l).color);
    });
    expect(direct).toBe(story);

    // So the underline has to be what marks the link.
    expect(
      await page.locator(".dlab-soft__lineText").evaluate((el) => getComputedStyle(el).textDecorationLine)
    ).toContain("underline");
  });

  test("only the final sentence is clickable", async ({ page }) => {
    await page.goto("/", { waitUntil: "load" });
    await ready(page);

    await expect(page.locator(".dlab-soft__choice a")).toHaveCount(1);
    await expect(page.locator(".dlab-soft__choice button")).toHaveCount(0);
    expect(await page.locator(STORY).evaluate((el) => el.tagName)).toBe("P");
  });

  test("the indicator sits between the deck and the copy, one mark per card", async ({ page }) => {
    await page.goto("/", { waitUntil: "load" });
    await ready(page);

    await expect(page.locator(MARK)).toHaveCount(4);
    const order = await page.evaluate(() => ({
      deck: document.querySelector(".card-inner")!.getBoundingClientRect().bottom,
      indTop: document.querySelector(".dlab-soft__ind")!.getBoundingClientRect().top,
      indBottom: document.querySelector(".dlab-soft__ind")!.getBoundingClientRect().bottom,
      story: document
        .querySelector(".dlab-soft__line:not(.dlab-soft__line--direct)")!
        .getBoundingClientRect().top,
    }));
    expect(order.indTop).toBeGreaterThan(order.deck);
    expect(order.story).toBeGreaterThan(order.indBottom);
  });

  test("each mark tracks its own card, not the running total", async ({ page }) => {
    await page.goto("/", { waitUntil: "load" });
    await ready(page);

    // Flip the THIRD card. A count-based indicator would light the first.
    await page.locator("button.card-hover-wrapper").nth(2).click();
    await page.waitForTimeout(400);
    expect(
      await page.evaluate(() =>
        [...document.querySelectorAll(".dlab-soft__mark")].map((m) => m.classList.contains("is-on"))
      )
    ).toEqual([false, false, true, false]);

    // And follows the card back down — CardDeck toggles.
    await page.locator("button.card-hover-wrapper").nth(2).click();
    await expect(page.locator(`${MARK}.is-on`)).toHaveCount(0);
  });

  test("completion is not carried by colour alone", async ({ page }) => {
    await page.goto("/", { waitUntil: "load" });
    await ready(page);

    const before = await page.evaluate(() => {
      const m = document.querySelector(".dlab-soft__mark")!;
      return {
        bg: getComputedStyle(m).backgroundColor,
        rank: getComputedStyle(m.querySelector(".dlab-soft__markRank")!).opacity,
      };
    });

    await page.locator("button.card-hover-wrapper").first().click();
    await expect(page.locator(`${MARK}.is-on`)).toHaveCount(1);
    await page.waitForTimeout(400);

    const after = await page.evaluate(() => {
      const m = document.querySelector(".dlab-soft__mark")!;
      return {
        bg: getComputedStyle(m).backgroundColor,
        rank: getComputedStyle(m.querySelector(".dlab-soft__markRank")!).opacity,
      };
    });

    const alpha = (c: string) => {
      const p = (c.match(/[\d.]+/g) ?? []).map(Number);
      return p.length === 4 ? p[3]! : 1;
    };
    // The card fills AND its rank becomes legible — shape, not just hue.
    expect(alpha(after.bg) - alpha(before.bg)).toBeGreaterThan(0.4);
    expect(parseFloat(after.rank) - parseFloat(before.rank)).toBeGreaterThan(0.4);
  });

  test("the indicator is passive and announces the count", async ({ page }) => {
    await page.goto("/", { waitUntil: "load" });
    await ready(page);

    await expect(
      page.locator(".dlab-soft__ind a, .dlab-soft__ind button, .dlab-soft__ind [tabindex]")
    ).toHaveCount(0);
    expect(
      await page.locator(".dlab-soft__indRow").evaluate((el) => getComputedStyle(el).pointerEvents)
    ).toBe("none");
    expect(
      await page.locator(".dlab-soft__indRow").evaluate((el) => el.getAttribute("aria-hidden"))
    ).toBe("true");

    await expect(page.locator(".dlab-soft__srOnly")).toHaveText(/0 of 4 cards flipped/i);
    await page.locator("button.card-hover-wrapper").first().click();
    await expect(page.locator(".dlab-soft__srOnly")).toHaveText(/1 of 4 cards flipped/i);
  });

  test("Story Mode still opens the gate by flipping four cards", async ({ page }) => {
    await page.goto("/", { waitUntil: "load" });
    await ready(page);

    const gate = page.locator(".dlab-gate__content");
    await expect(gate).toHaveClass(/is-locked/);

    const cards = page.locator("button.card-hover-wrapper");
    await expect(async () => {
      const n = await cards.count();
      for (let i = 0; i < n; i++) {
        const card = cards.nth(i);
        if ((await card.getAttribute("aria-pressed")) === "false") await card.click();
      }
      expect(await gate.evaluate((el) => el.classList.contains("is-open"))).toBe(true);
    }).toPass({ timeout: 30_000, intervals: [200, 400, 800] });

    await expect(page.locator(".dlab-soft__prompt--open")).toBeVisible();
  });

  test("the skip-ahead link opens the gate and lands on Consulting", async ({ page }) => {
    const errors = collectConsoleErrors(page);
    await page.goto("/", { waitUntil: "load" });
    await ready(page);

    await page.locator(DIRECT).click();

    await expect(page.locator(".dlab-gate__content")).toHaveClass(/is-open/);
    await expect(page.locator(".work__chapter--detail").nth(3)).toBeAttached({ timeout: 15_000 });

    // Measured from the chapter's viewport rect, NOT its `offsetTop`: the
    // chapters' offsetParent is `section.work`, so offsetTop is ~1300px short of
    // the document offset and comparing it to scrollY reports a correct landing
    // as a full-screen miss.
    await expect(async () => {
      const { y, rectTop } = await page.evaluate(() => {
        const el = document.querySelectorAll(".work__chapter--detail")[3] as HTMLElement;
        return { y: window.scrollY, rectTop: el.getBoundingClientRect().top };
      });
      expect(y).toBeGreaterThan(0);
      expect(Math.abs(rectTop)).toBeLessThan(80);
    }).toPass({ timeout: 15_000, intervals: [200, 400, 800] });

    expect(errors).toEqual([]);
  });

  test("the entry never scrolls sideways", async ({ page }) => {
    await page.goto("/", { waitUntil: "load" });
    await ready(page);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth - document.documentElement.clientWidth
      )
    ).toBe(0);
  });
});
