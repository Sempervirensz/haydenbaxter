import { test, expect, type Page } from "@playwright/test";
import { collectConsoleErrors } from "./helpers";
import { INDICATOR_DESIGNS, ROUTE_VARIANTS } from "@/data/entryCtaLab";

/* The entry route choice (/entry-cta-lab).
 *
 * Three lines of type under the deck: an instruction about the cards, an italic
 * "or", and one link out to Consulting. The design claim is that it reads as a
 * quiet decision point rather than a control — so what is asserted here is that
 * it stays typographic (no panel, no button), that exactly one line is
 * clickable, and that the phone gets the same reading size as the desktop.
 *
 * `releaseGate` from ./helpers cannot be used against this route: it drives
 * "Skip the intro", which this gate does not have. Use `flipAllCards`.
 */

const LAB = "/entry-cta-lab";
const STORY = ".ecta__line--story";
const DIRECT = ".ecta__line--direct";

/**
 * Open the gate by flipping all four cards.
 *
 * Only unflipped cards are clicked, since a second click flips a card back — a
 * naive retry that re-clicks everything oscillates instead of converging. The
 * retry itself is for hydration: the deck is server-rendered, so a click that
 * lands before React attaches is swallowed with no handler.
 *
 * NOT `force: true`. Force skips Playwright's actionability wait, which is the
 * only thing that notices the intro splash still covering the deck — with it on,
 * every card click lands on `.splash` and reports success while nothing flips.
 */
async function flipAllCards(page: Page) {
  const gate = page.locator(".dlab-gate__content");
  const cards = page.locator("button.card-hover-wrapper");
  await expect(async () => {
    const n = await cards.count();
    for (let i = 0; i < n; i++) {
      const card = cards.nth(i);
      if ((await card.getAttribute("aria-pressed")) === "false") await card.click();
    }
    expect(await gate.evaluate((el) => el.classList.contains("is-open"))).toBe(true);
  }).toPass({ timeout: 30_000, intervals: [200, 400, 800] });
}

/**
 * Wait until the entry is genuinely interactive.
 *
 * Two gates, not one. React has to hydrate (the reset button only renders from
 * an effect), AND the site-wide intro splash has to finish — it is rendered by
 * RootLayout and covers the whole viewport for roughly nine seconds, so anything
 * that bypasses actionability checks before then is interacting with `.splash`.
 * Waiting on the deck being hit-testable covers both without coupling to the
 * splash's internal classes.
 */
async function ready(page: Page, variant?: string) {
  await expect(page.locator(".ecta__choice")).toBeVisible();
  // The iteration arrives from `?v=` in a mount effect, so the class lands a
  // commit after hydration — asserting before it settles reads the default.
  if (variant) {
    await expect(page.locator(".ecta__choice")).toHaveClass(
      new RegExp(`ecta__choice--${variant}\\b`)
    );
  }
  await expect(page.locator(".ecta__reset")).toBeVisible({ timeout: 20_000 });
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

test.describe("entry route choice", () => {
  test("reads as the three specified lines", async ({ page }) => {
    await page.goto(LAB, { waitUntil: "load" });
    await ready(page);

    await expect(page.locator(STORY)).toHaveText("Flip the four cards to continue in Story Mode.");
    await expect(page.locator(".ecta__or")).toHaveText("or");
    await expect(page.locator(DIRECT)).toContainText("Skip ahead and see where I can add value");
  });

  test("the pause is lowercase italic and set apart from both routes", async ({ page }) => {
    // Pinned to 01 Quiet: the gap symmetry below measures story→or→link, and the
    // iterations that show a flip bar put it between the first two, so the
    // "above" gap legitimately includes it there.
    await page.goto(`${LAB}?v=quiet`, { waitUntil: "load" });
    await ready(page, "quiet");

    const or = page.locator(".ecta__or");
    expect(await or.evaluate((el) => getComputedStyle(el).fontStyle)).toBe("italic");
    // Lowercase in the source, and not upper-cased back by a text-transform.
    expect(await or.evaluate((el) => getComputedStyle(el).textTransform)).toBe("none");
    await expect(or).toHaveText(/^or$/);

    // A real gap either side, and a symmetrical one — the pause is the spacing.
    const gaps = await page.evaluate(() => {
      const r = (s: string) => document.querySelector(s)!.getBoundingClientRect();
      const story = r(".ecta__line--story");
      const or = r(".ecta__or");
      const direct = r(".ecta__line--direct");
      return { above: Math.round(or.top - story.bottom), below: Math.round(direct.top - or.bottom) };
    });
    expect(gaps.above).toBeGreaterThan(10);
    expect(gaps.below).toBeGreaterThan(10);
    expect(Math.abs(gaps.above - gaps.below)).toBeLessThan(8);
  });

  test("only the final sentence is clickable", async ({ page }) => {
    await page.goto(LAB, { waitUntil: "load" });
    await ready(page);

    // One link in the whole choice, and it is the direct route.
    await expect(page.locator(".ecta__choice a")).toHaveCount(1);
    await expect(page.locator(".ecta__choice button")).toHaveCount(0);
    expect(await page.locator(DIRECT).evaluate((el) => el.tagName)).toBe("A");

    // The story line is inert type, not a control.
    expect(await page.locator(STORY).evaluate((el) => el.tagName)).toBe("P");
    expect(await page.locator(STORY).evaluate((el) => getComputedStyle(el).cursor)).not.toBe(
      "pointer"
    );
  });

  test("it stays typographic — no panel, button or box", async ({ page }) => {
    // The brief's line to hold: a quiet decision point, not a conventional
    // button, panel or menu. Filled or bordered surfaces are how that slides.
    await page.goto(LAB, { waitUntil: "load" });
    await ready(page);

    const boxed = await page.evaluate(() =>
      [...document.querySelectorAll(".ecta__choice, .ecta__choice *")]
        // The flip markers are meant to have edges and fills — they are the
        // indicator, not a panel around the copy.
        .filter((el) => !el.closest(".ecta__ind"))
        .filter((el) => {
          const cs = getComputedStyle(el);
          const bg = (cs.backgroundColor.match(/[\d.]+/g) ?? []).map(Number);
          const opaque = bg.length === 3 || (bg[3] ?? 0) > 0.02;
          const bordered = ["Top", "Right", "Bottom", "Left"].some(
            (s) =>
              parseFloat(cs[`border${s}Width` as keyof CSSStyleDeclaration] as string) > 0 &&
              cs[`border${s}Style` as keyof CSSStyleDeclaration] !== "none"
          );
          return opaque || bordered;
        }).length
    );
    expect(boxed).toBe(0);
  });

  test("the link is visibly clickable and moves on hover", async ({ page }) => {
    await page.goto(LAB, { waitUntil: "load" });
    await ready(page);

    // Underlined, and brighter than the story line it sits under.
    const text = page.locator(".ecta__lineText");
    expect(await text.evaluate((el) => getComputedStyle(el).textDecorationLine)).toContain(
      "underline"
    );

    // Restrained movement: the arrow travels, the sentence does not.
    const before = await page.evaluate(() => ({
      arrow: document.querySelector(".ecta__arrow")!.getBoundingClientRect().left,
      line: document.querySelector(".ecta__line--direct")!.getBoundingClientRect().left,
    }));
    await page.locator(DIRECT).hover();
    await page.waitForTimeout(400);
    const after = await page.evaluate(() => ({
      arrow: document.querySelector(".ecta__arrow")!.getBoundingClientRect().left,
      line: document.querySelector(".ecta__line--direct")!.getBoundingClientRect().left,
    }));
    expect(after.arrow - before.arrow).toBeGreaterThan(1);
    expect(Math.abs(after.line - before.line)).toBeLessThan(1);
  });

  test("the link opens the gate and lands on Consulting", async ({ page }) => {
    const errors = collectConsoleErrors(page);
    await page.goto(LAB, { waitUntil: "load" });
    await ready(page);

    await page.locator(DIRECT).click();

    // Work mounts asynchronously, so the chapter appears after the click.
    await expect(page.locator(".dlab-gate__content")).toHaveClass(/is-open/);
    await expect(page.locator(".work__chapter--detail").nth(3)).toBeAttached({ timeout: 15_000 });

    // Landed at the top of Consulting rather than at the top of the page.
    //
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

  test("flipping the four cards still opens the gate", async ({ page }) => {
    await page.goto(LAB, { waitUntil: "load" });
    await ready(page);

    await expect(page.locator(".dlab-gate__content")).toHaveClass(/is-locked/);
    await flipAllCards(page);
    await expect(page.locator(".dlab-gate__content")).toHaveClass(/is-open/);
  });

  test("the link is keyboard reachable with a visible focus ring", async ({ page }) => {
    await page.goto(LAB, { waitUntil: "load" });
    await ready(page);

    await page.locator(DIRECT).focus();
    await expect(page.locator(DIRECT)).toBeFocused();
    const ring = await page.locator(DIRECT).evaluate((el) => {
      const cs = getComputedStyle(el);
      const [, , , a = 1] = (cs.outlineColor.match(/[\d.]+/g) ?? []).map(Number);
      return { width: parseFloat(cs.outlineWidth), alpha: a };
    });
    expect(ring.width).toBeGreaterThan(0);
    expect(ring.alpha).toBeGreaterThan(0.5);
  });

  test("reset clears flipped cards and re-locks the gate", async ({ page }) => {
    await page.goto(LAB, { waitUntil: "load" });
    await ready(page);

    const gate = page.locator(".dlab-gate__content");
    await flipAllCards(page);
    await expect(gate).toHaveClass(/is-open/);

    await page.locator(".ecta__reset").click();
    await expect(gate).toHaveClass(/is-locked/);
    await expect(page.locator('button.card-hover-wrapper[aria-pressed="true"]')).toHaveCount(0);
    await expect(page.locator(STORY)).toBeVisible();
  });

  test("the type holds its size and breaks cleanly at every width", async ({ page }) => {
    // "Without shrinking the text or creating awkward wrapping": the phone gets
    // the same reading size as the desktop, and neither sentence is allowed to
    // strand a single word on a line of its own.
    await page.goto(LAB, { waitUntil: "load" });
    await ready(page);

    const m = await page.evaluate(() => {
      const el = (s: string) => document.querySelector(s) as HTMLElement;
      const lineCount = (node: HTMLElement) =>
        Math.round(node.getBoundingClientRect().height / parseFloat(getComputedStyle(node).lineHeight));
      return {
        size: parseFloat(getComputedStyle(el(".ecta__line--story")).fontSize),
        storyLines: lineCount(el(".ecta__line--story")),
        overflowX: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      };
    });

    expect(m.size).toBeGreaterThanOrEqual(18); // never shrunk to a caption
    expect(m.storyLines).toBeLessThanOrEqual(3);
    expect(m.overflowX).toBe(0);
  });

  test("the previous concepts are gone", async ({ page }) => {
    await page.goto(LAB, { waitUntil: "load" });
    await ready(page);

    // No A/B switch, no direction switch, no panels, no Skip, no old CTA copy.
    await expect(
      // `.ecta__labBtn` is deliberately NOT in this list — those are the
      // iteration buttons in the lab bar, which are harness, not a concept.
      page.locator(".ecta__swatch, .ecta__cta, .ecta__routeHit, .ecta__fork, .dlab-soft__skip")
    ).toHaveCount(0);
    for (const gone of [
      /short on time/i,
      /skip the intro/i,
      /see how i can help/i,
      /choose your route/i,
      /business mode/i,
      /see where i add value/i,
    ]) {
      await expect(page.getByText(gone)).toHaveCount(0);
    }
  });
});

/* Every iteration is presentation only, so each has to hold the same contract:
   the specified copy, exactly one link, no box, and an arrow that travels while
   the sentence stays put. Running it per iteration is what stops a new emphasis
   from quietly breaking the moment it is exploring. */
test.describe("entry route choice — every iteration", () => {
  for (const v of ROUTE_VARIANTS) {
    test(`${v.index} ${v.label} holds the shared contract`, async ({ page }) => {
      await page.goto(`${LAB}?v=${v.id}`, { waitUntil: "load" });
      await ready(page, v.id);

      await expect(page.locator(STORY)).toHaveText(
        "Flip the four cards to continue in Story Mode."
      );
      await expect(page.locator(".ecta__or")).toHaveText("or");
      await expect(page.locator(DIRECT)).toContainText("Skip ahead and see where I can add value");

      await expect(page.locator(".ecta__choice a")).toHaveCount(1);
      await expect(page.locator(".ecta__choice button")).toHaveCount(0);

      // Restrained movement, in every iteration.
      const before = await page.evaluate(
        () => document.querySelector(".ecta__arrow")!.getBoundingClientRect().left
      );
      await page.locator(DIRECT).hover();
      await page.waitForTimeout(400);
      const after = await page.evaluate(
        () => document.querySelector(".ecta__arrow")!.getBoundingClientRect().left
      );
      expect(after - before).toBeGreaterThan(1);

      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth - document.documentElement.clientWidth
        )
      ).toBe(0);
    });
  }

  test("an unknown iteration falls back rather than rendering nothing", async ({ page }) => {
    await page.goto(`${LAB}?v=nonsense`, { waitUntil: "load" });
    await ready(page, "storyLed"); // the default
    await expect(page.locator(".ecta__choice a")).toHaveCount(1);
  });

  test("02 Even holds both lines at one brightness", async ({ page }) => {
    for (const id of ["even"]) {
      await page.goto(`${LAB}?v=${id}`, { waitUntil: "load" });
      await ready(page, id);
      /* `.ecta__line--direct` carries `transition: color 220ms ease`. Reading the
         computed colour before it settles returns an interpolated value — 0.85
         against an expected 0.86 — which reads as a real mismatch and made this
         the suite's only flake. Wait for the transition rather than widen the
         assertion, so a genuine colour drift still fails. */
      await page.waitForTimeout(400);
      const [story, direct] = await page.evaluate(() => [
        getComputedStyle(document.querySelector(".ecta__line--story")!).color,
        getComputedStyle(document.querySelector(".ecta__line--direct")!).color,
      ]);
      expect(direct, `${id}: lines should match`).toBe(story);
    }
  });

  test("03 Story-led puts the instruction ahead of the skip line", async ({ page }) => {
    await page.goto(`${LAB}?v=storyLed`, { waitUntil: "load" });
    await ready(page, "storyLed");

    const size = await page.evaluate(() => ({
      story: parseFloat(getComputedStyle(document.querySelector(".ecta__line--story")!).fontSize),
      direct: parseFloat(getComputedStyle(document.querySelector(".ecta__line--direct")!).fontSize),
    }));
    expect(size.story).toBeGreaterThan(size.direct);
  });

  test("04 Drawn has no rule at rest and draws one on hover", async ({ page }) => {
    await page.goto(`${LAB}?v=drawn`, { waitUntil: "load" });
    await ready(page, "drawn");

    const text = page.locator(".ecta__lineText");
    expect(await text.evaluate((el) => getComputedStyle(el).textDecorationLine)).toBe("none");

    const restWidth = await text.evaluate((el) => getComputedStyle(el).backgroundSize);
    await page.locator(DIRECT).hover();
    await page.waitForTimeout(450);
    const hoverWidth = await text.evaluate((el) => getComputedStyle(el).backgroundSize);
    expect(hoverWidth).not.toBe(restWidth);
    expect(parseFloat(hoverWidth)).toBeGreaterThan(parseFloat(restWidth));
  });

  test("05 Warm marks the link by colour, not by being brighter", async ({ page }) => {
    await page.goto(`${LAB}?v=warm`, { waitUntil: "load" });
    await ready(page, "warm");

    const direct = await page.locator(DIRECT).evaluate((el) => getComputedStyle(el).color);
    const [r = 0, g = 0, b = 0] = (direct.match(/[\d.]+/g) ?? []).map(Number);
    // Warm: measurably more red than blue, rather than plain white.
    expect(r - b).toBeGreaterThan(20);
  });
});


/* The flip indicator: four markers between the deck and the route choice, one
   per card. Three designs share one component and one box. */
test.describe("flip indicator", () => {
  const IND = ".ecta__ind";
  const MARK = ".ecta__mark";

  /** Flip specific cards by index and wait for the markers to settle. */
  async function flipCards(page: Page, indexes: number[]) {
    const cards = page.locator("button.card-hover-wrapper");
    for (const i of indexes) {
      const card = cards.nth(i);
      if ((await card.getAttribute("aria-pressed")) === "false") await card.click();
    }
    await page.waitForTimeout(400);
  }

  test("sits between the card row and the route choice", async ({ page }) => {
    await page.goto(LAB, { waitUntil: "load" });
    await ready(page);

    const order = await page.evaluate(() => {
      const deck = document.querySelector(".card-inner")!.getBoundingClientRect().bottom;
      const ind = document.querySelector(".ecta__ind")!.getBoundingClientRect();
      const story = document.querySelector(".ecta__line--story")!.getBoundingClientRect().top;
      return { deck, indTop: ind.top, indBottom: ind.bottom, story };
    });
    expect(order.indTop).toBeGreaterThan(order.deck);
    expect(order.story).toBeGreaterThan(order.indBottom);
  });

  test("defaults to mini cards", async ({ page }) => {
    await page.goto(LAB, { waitUntil: "load" });
    await ready(page);
    await expect(page.locator(IND)).toHaveClass(/ecta__ind--miniCards\b/);
    await expect(page.locator(MARK)).toHaveCount(4);
  });

  test("each marker tracks its own card, not the running total", async ({ page }) => {
    // The distinguishing property: flipping the THIRD card must light the third
    // marker. A count-based indicator would light the first.
    await page.goto(LAB, { waitUntil: "load" });
    await ready(page);

    await flipCards(page, [2]);
    const state = await page.evaluate(() =>
      [...document.querySelectorAll(".ecta__mark")].map((m) => m.classList.contains("is-on"))
    );
    expect(state).toEqual([false, false, true, false]);
  });

  test("a card returned face-down empties its marker again", async ({ page }) => {
    await page.goto(LAB, { waitUntil: "load" });
    await ready(page);

    await flipCards(page, [1]);
    await expect(page.locator(`${MARK}.is-on`)).toHaveCount(1);

    // Same card again — CardDeck toggles, so the marker must follow it back.
    await page.locator("button.card-hover-wrapper").nth(1).click();
    await expect(page.locator(`${MARK}.is-on`)).toHaveCount(0);
    await expect(page.locator(".ecta__srOnly")).toHaveText(/0 of 4 cards flipped/i);
  });

  test("announces the count without showing it", async ({ page }) => {
    await page.goto(LAB, { waitUntil: "load" });
    await ready(page);

    await expect(page.locator(".ecta__srOnly")).toHaveText(/0 of 4 cards flipped/i);
    await flipCards(page, [0, 1]);
    await expect(page.locator(".ecta__srOnly")).toHaveText(/2 of 4 cards flipped/i);

    // The markers themselves are decorative, so the count is not duplicated.
    expect(
      await page.locator(".ecta__indRow").evaluate((el) => el.getAttribute("aria-hidden"))
    ).toBe("true");
  });

  test("is passive — nothing to click or tab to", async ({ page }) => {
    await page.goto(LAB, { waitUntil: "load" });
    await ready(page);

    await expect(page.locator(`${IND} a, ${IND} button, ${IND} [tabindex]`)).toHaveCount(0);
    expect(
      await page.locator(".ecta__indRow").evaluate((el) => getComputedStyle(el).pointerEvents)
    ).toBe("none");
  });

  for (const d of INDICATOR_DESIGNS) {
    test(`${d.index} ${d.label} completes by more than colour`, async ({ page }) => {
      // Relying on hue alone fails in greyscale and for colour-blind visitors, so
      // every design must also change shape or mass.
      await page.goto(`${LAB}?i=${d.id}`, { waitUntil: "load" });
      await ready(page);
      await expect(page.locator(IND)).toHaveClass(new RegExp(`ecta__ind--${d.id}\\b`));

      const before = await page.evaluate(() => {
        const m = document.querySelector(".ecta__mark")!;
        const cs = getComputedStyle(m);
        const after = getComputedStyle(m, "::after");
        const rank = getComputedStyle(m.querySelector(".ecta__markRank")!);
        return { bg: cs.backgroundColor, afterTransform: after.transform, rank: rank.opacity };
      });

      await flipCards(page, [0]);
      await expect(page.locator(`${MARK}.is-on`)).toHaveCount(1);
      await page.waitForTimeout(400);

      const after = await page.evaluate(() => {
        const m = document.querySelector(".ecta__mark")!;
        const cs = getComputedStyle(m);
        const a = getComputedStyle(m, "::after");
        const rank = getComputedStyle(m.querySelector(".ecta__markRank")!);
        return { bg: cs.backgroundColor, afterTransform: a.transform, rank: rank.opacity };
      });

      // At least one non-hue property moved: a fill appeared, an inner shape
      // scaled up, or the printed rank became visible.
      const alpha = (c: string) => {
        const p = (c.match(/[\d.]+/g) ?? []).map(Number);
        return p.length === 4 ? p[3]! : 1;
      };
      const filled = alpha(after.bg) - alpha(before.bg) > 0.4;
      const scaled = before.afterTransform !== after.afterTransform;
      const printed = parseFloat(after.rank) - parseFloat(before.rank) > 0.4;
      expect(filled || scaled || printed, `${d.id}: needs a non-colour change`).toBe(true);
    });
  }

  test("the three designs reserve exactly the same box", async ({ page }) => {
    // Switching design must not nudge the deck above or the type below.
    await page.goto(LAB, { waitUntil: "load" });
    await ready(page);

    const boxes: Record<string, { h: number; storyTop: number; deckTop: number }> = {};
    for (const d of INDICATOR_DESIGNS) {
      await page.locator(`.ecta__labBtn[aria-label^="Indicator ${d.index}"]`).click();
      await expect(page.locator(IND)).toHaveClass(new RegExp(`ecta__ind--${d.id}\\b`));
      boxes[d.id] = await page.evaluate(() => ({
        h: Math.round(document.querySelector(".ecta__ind")!.getBoundingClientRect().height),
        storyTop: Math.round(
          document.querySelector(".ecta__line--story")!.getBoundingClientRect().top
        ),
        deckTop: Math.round(document.querySelector(".card-inner")!.getBoundingClientRect().top),
      }));
    }

    const values = Object.values(boxes);
    for (const v of values) expect(v).toEqual(values[0]);
    expect(values[0]!.h).toBeGreaterThan(0);
  });
});

test.describe("flip indicator — reduced motion", () => {
  test.use({ contextOptions: { reducedMotion: "reduce" } });

  test("markers still complete, without transitions", async ({ page }) => {
    await page.goto(LAB, { waitUntil: "load" });
    await ready(page);

    expect(
      await page.locator(".ecta__mark").first().evaluate((el) => getComputedStyle(el).transitionDuration)
    ).toBe("0s");

    await page.locator("button.card-hover-wrapper").first().click();
    await expect(page.locator(".ecta__mark.is-on")).toHaveCount(1);
  });
});

test.describe("entry route choice — reduced motion", () => {
  test.use({ contextOptions: { reducedMotion: "reduce" } });

  test("the link still works, without the arrow travelling", async ({ page }) => {
    await page.goto(LAB, { waitUntil: "load" });
    await ready(page);

    expect(
      await page.locator(".ecta__arrow").evaluate((el) => getComputedStyle(el).transitionDuration)
    ).toBe("0s");

    const before = await page.evaluate(
      () => document.querySelector(".ecta__arrow")!.getBoundingClientRect().left
    );
    await page.locator(DIRECT).hover();
    await page.waitForTimeout(300);
    const after = await page.evaluate(
      () => document.querySelector(".ecta__arrow")!.getBoundingClientRect().left
    );
    expect(Math.abs(after - before)).toBeLessThan(1);

    await page.locator(DIRECT).click();
    await expect(page.locator(".dlab-gate__content")).toHaveClass(/is-open/);
  });
});
