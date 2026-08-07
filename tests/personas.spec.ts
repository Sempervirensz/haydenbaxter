import { test, expect } from "@playwright/test";
import { openSite, overflowX } from "./helpers";

/* Personas: the three glass cards under the "Let's work together" chapter.
 *
 * This section used to be a WAI-ARIA tabs widget and this file used to assert
 * that contract. It is now three disclosure cards, because a tabs widget shows
 * one persona at a time and the section has to show an accomplishment under
 * every persona without being asked. The old assertions are gone with the
 * pattern they described.
 *
 * What is asserted here is what the new pattern owes a visitor:
 *
 *   - every persona shows one bullet WITHOUT any interaction, on every input,
 *     which is the whole reason the pattern changed;
 *   - the rest is reachable by click and by tap, not by hover alone, so a
 *     phone is never promised copy it cannot get to;
 *   - the held-back copy stays in the accessibility tree, so it is only ever
 *     visually held back, never hidden from a screen reader.
 *
 * State is read from `aria-expanded` and from the `is-open` class rather than
 * from computed height, because both are the actual mechanism and both survive
 * the grid-row transition, which a height measurement does not.
 */

const TITLES = [
  "AI Strategist & Builder",
  "Global Supply Chain & Cross-Cultural Leader",
  "WorldPulse Founder & Sustainability-Tech Innovator",
];

/** The first bullet of each persona: the one that must always be visible. */
const PREVIEWS = [
  "Builds practical AI products",
  "Led Nike and Converse global sourcing",
  "Founder and product designer at WorldPulse",
];

/** Scroll the section into view. It sits ~14k px down a very long page. */
async function gotoPersonas(page: import("@playwright/test").Page) {
  await openSite(page, "/");
  await page.evaluate(() => {
    const el = document.querySelector("#personas");
    if (el) window.scrollTo(0, el.getBoundingClientRect().top + window.scrollY);
  });
  await expect(page.locator("#personas")).toBeVisible();

  // Park the pointer clear of the cards. `openSite` releases the soft-lock gate
  // by CLICKING Skip, which leaves the pointer at that coordinate; once the page
  // scrolls down here, a card can land underneath it and sit hovered-open before
  // the test has touched anything. That read as "bullets painted at rest" on the
  // narrow viewports, where a stacked card is wide enough to catch it.
  await page.mouse.move(0, 0);
}

/** Which cards report themselves open, and whether their bullets are painted. */
function openState(page: import("@playwright/test").Page) {
  return page.evaluate(() => {
    const cards = [...document.querySelectorAll<HTMLElement>(".personas__card")];
    return cards.map((c) => ({
      expanded:
        c.querySelector(".personas__toggle")?.getAttribute("aria-expanded") ===
        "true",
      hasOpenClass: c.classList.contains("is-open"),
      itemsPainted: [...c.querySelectorAll<HTMLElement>(".personas__item")].every(
        (i) => getComputedStyle(i).opacity === "1"
      ),
    }));
  });
}

/**
 * Wait for the bullets to finish fading rather than reading once.
 *
 * The reveal runs over --g-fast (200ms), so a synchronous read straight after a
 * click catches the items mid-transition at something like 0.43 and reports a
 * working disclosure as broken. The state itself (`aria-expanded`, `is-open`)
 * flips instantly and is asserted directly; only the paint needs polling.
 */
async function expectItemsPainted(
  page: import("@playwright/test").Page,
  index: number,
  painted: boolean
) {
  await expect
    .poll(async () => (await openState(page))[index].itemsPainted, {
      message: painted ? "bullets never faded in" : "bullets never faded out",
    })
    .toBe(painted);
}

test.describe("Personas: placement", () => {
  test("sits between the Work section and Connect", async ({ page }) => {
    await openSite(page, "/");
    const tops = await page.evaluate(() => {
      const top = (sel: string) => {
        const el = document.querySelector(sel);
        return el ? el.getBoundingClientRect().top + window.scrollY : null;
      };
      const wt = document.querySelector(".wt");
      const host = wt?.closest("section, article") ?? null;
      return {
        workTogether: host
          ? host.getBoundingClientRect().top + window.scrollY
          : null,
        personas: top("#personas"),
        connect: top("#connect"),
      };
    });

    expect(tops.personas, "#personas missing").not.toBeNull();
    expect(tops.workTogether, "the Let's work together host is missing").not.toBeNull();
    // Immediately below the CTA chapter, and still above Connect.
    expect(tops.personas!).toBeGreaterThan(tops.workTogether!);
    expect(tops.personas!).toBeLessThan(tops.connect!);
  });

  test("adds no horizontal overflow", async ({ page }) => {
    await gotoPersonas(page);
    expect(await overflowX(page)).toBeLessThanOrEqual(0);
  });
});

test.describe("Personas: resting state", () => {
  test("all three cards render, closed, with their titles", async ({ page }) => {
    await gotoPersonas(page);
    const cards = page.locator(".personas__card");
    await expect(cards).toHaveCount(3);

    for (let i = 0; i < TITLES.length; i++) {
      await expect(cards.nth(i).locator(".personas__title")).toHaveText(TITLES[i]);
    }

    // Nothing is open on load. The tabs widget this replaced could not rest
    // closed; this one can, and does.
    for (const s of await openState(page)) {
      expect(s.expanded, "a card is open before anyone asked").toBe(false);
    }
  });

  test("every persona shows one bullet with no interaction at all", async ({
    page,
  }) => {
    await gotoPersonas(page);
    const previews = page.locator(".personas__preview");
    await expect(previews).toHaveCount(3);

    for (let i = 0; i < PREVIEWS.length; i++) {
      await expect(previews.nth(i)).toBeVisible();
      await expect(previews.nth(i)).toContainText(PREVIEWS[i]);
    }
  });

  test("the held-back bullets are visually hidden but never removed", async ({
    page,
  }) => {
    await gotoPersonas(page);
    // Parking the pointer in gotoPersonas can START a fade-out rather than
    // finish one, so settle first. Reported, not just compared: a bare `false`
    // cannot tell a card held open by hover from one caught mid-transition.
    await expect
      .poll(
        async () =>
          page.evaluate(() => ({
            opacities: [
              ...document.querySelectorAll<HTMLElement>(".personas__item"),
            ].map((i) => getComputedStyle(i).opacity),
            openCards: [...document.querySelectorAll(".personas__card")].filter(
              (c) =>
                c.matches(":hover, .is-open, :has(.personas__toggle:focus-visible)")
            ).length,
          })),
        { message: "bullets never settled back to transparent at rest" }
      )
      .toEqual({ opacities: ["0", "0", "0", "0", "0", "0"], openCards: 0 });

    const state = await page.evaluate(() => {
      const items = [...document.querySelectorAll<HTMLElement>(".personas__item")];
      return {
        count: items.length,
        allTransparent: items.every((i) => getComputedStyle(i).opacity === "0"),
        // `hidden` or display:none would take the copy out of the
        // accessibility tree. It must only ever be held back visually.
        noneHidden: items.every(
          (i) => !i.hasAttribute("hidden") && getComputedStyle(i).display !== "none"
        ),
        bodiesAriaHidden: [
          ...document.querySelectorAll(".personas__body"),
        ].some((b) => b.getAttribute("aria-hidden") === "true"),
      };
    });

    expect(state.count, "two held-back bullets per persona").toBe(6);
    expect(state.allTransparent).toBe(true);
    expect(state.noneHidden, "held-back copy was removed, not just faded").toBe(true);
    expect(state.bodiesAriaHidden, "held-back copy was hidden from AT").toBe(false);
  });
});

test.describe("Personas: disclosure", () => {
  test("clicking a card opens it and clicking again closes it", async ({ page }) => {
    await gotoPersonas(page);
    const toggle = page.locator(".personas__toggle").first();

    await toggle.click();
    let state = await openState(page);
    expect(state[0].expanded).toBe(true);
    expect(state[0].hasOpenClass).toBe(true);
    await expectItemsPainted(page, 0, true);

    await toggle.click();
    state = await openState(page);
    expect(state[0].expanded).toBe(false);

    // The pointer is still resting on the card after the click, and on a
    // hover-capable device `:hover` legitimately keeps the bullets painted. The
    // state closes; the paint does not, until the pointer leaves. Move it away
    // before asserting the fade-out, or this tests hover rather than the click.
    await page.mouse.move(0, 0);
    await expectItemsPainted(page, 0, false);
  });

  test("only one card is open at a time", async ({ page }) => {
    await gotoPersonas(page);
    const toggles = page.locator(".personas__toggle");

    await toggles.nth(0).click();
    await toggles.nth(2).click();

    const state = await openState(page);
    expect(state.filter((s) => s.expanded).length, "a second card stayed open").toBe(1);
    expect(state[2].expanded).toBe(true);
    expect(state[0].expanded).toBe(false);
  });

  test("aria-controls resolves to the copy it reveals", async ({ page }) => {
    await gotoPersonas(page);
    const wired = await page.evaluate(() =>
      [...document.querySelectorAll<HTMLElement>(".personas__toggle")].map((t) => {
        const id = t.getAttribute("aria-controls") ?? "";
        const body = document.getElementById(id);
        return {
          resolves: !!body,
          isTheBody: body?.classList.contains("personas__body") ?? false,
          hasExpanded: t.hasAttribute("aria-expanded"),
        };
      })
    );

    expect(wired).toHaveLength(3);
    for (const t of wired) {
      expect(t.resolves, "aria-controls points at nothing").toBe(true);
      expect(t.isTheBody, "aria-controls does not point at the revealed copy").toBe(true);
      expect(t.hasExpanded, "a disclosure without aria-expanded").toBe(true);
    }
  });
});

test.describe("Personas: touch input", () => {
  test.use({ hasTouch: true });

  test("a tap opens a card, same as a click", async ({ page }) => {
    await gotoPersonas(page);
    // The point of the whole pattern: hover does not exist here, so tap has to
    // be a real way in rather than a fallback.
    await page.locator(".personas__toggle").nth(2).tap();

    const state = await openState(page);
    expect(state[2].expanded).toBe(true);
    await expectItemsPainted(page, 2, true);
  });

  test("the preview is readable on touch without opening anything", async ({
    page,
  }) => {
    await gotoPersonas(page);
    const previews = page.locator(".personas__preview");
    for (let i = 0; i < 3; i++) {
      await expect(previews.nth(i)).toBeVisible();
    }
  });

  test("every toggle clears the 44px tap floor where the site promises it", async ({
    page,
  }) => {
    await gotoPersonas(page);
    const result = await page.evaluate(() => ({
      // The floor is keyed on `(pointer: coarse)`, so assert it exactly where
      // the stylesheet actually applies it rather than at every viewport.
      coarse: window.matchMedia("(pointer: coarse)").matches,
      sizes: [...document.querySelectorAll(".personas__toggle")].map(
        (t) => (t as HTMLElement).offsetHeight
      ),
    }));
    test.skip(!result.coarse, "no coarse pointer in this context");
    for (const h of result.sizes) expect(h).toBeGreaterThanOrEqual(44);
  });
});

test.describe("Personas: keyboard", () => {
  test("each card is reachable and operable from the keyboard", async ({ page }) => {
    await gotoPersonas(page);
    const toggle = page.locator(".personas__toggle").nth(1);

    await toggle.focus();
    await expect(toggle).toBeFocused();

    await page.keyboard.press("Enter");
    let state = await openState(page);
    expect(state[1].expanded, "Enter did not open the card").toBe(true);

    await page.keyboard.press("Enter");
    state = await openState(page);
    expect(state[1].expanded, "Enter did not close the card").toBe(false);
  });

  test("focus alone reveals the copy, so a keyboard never needs hover", async ({
    page,
  }) => {
    await gotoPersonas(page);

    // Focus has to ARRIVE by keyboard. The reveal is keyed on
    // `:focus-visible`, which Chromium does not match for a programmatic
    // .focus() — so stepping off and tabbing back is what a keyboard visitor
    // actually does, and the only way this asserts the real rule.
    const toggle = page.locator(".personas__toggle").first();
    await toggle.focus();
    await page.keyboard.press("Shift+Tab");
    await page.keyboard.press("Tab");
    await expect(toggle).toBeFocused();

    // Tabbing to a card opens it without a keypress, which is what stops the
    // detail from being mouse-only.
    await expectItemsPainted(page, 0, true);
  });
});
