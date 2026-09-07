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
  // The gate used to carry a "Skip the intro" button and this drove that. It now
  // offers two routes instead — flip the four cards, or a link that jumps to
  // Consulting — so the release path under test is the link. The flip path and
  // the entry's own rendering are covered in entry-choice.spec.ts.
  test("the skip-ahead link releases the page and reveals the gated sections", async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });
    const gated = page.locator(".dlab-gate__content");
    await expect(gated).toHaveClass(/is-locked/);
    await page.locator(".dlab-soft__line--direct").click();
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

    // ETBDetail renders BOTH a desktop side panel (.etb-overlay) and a mobile
    // dialog (.etb-mobileOverlay), each with its own close button; CSS hides
    // whichever does not apply. Target the visible one so this test means the
    // same thing at 375 as at 3840.
    await page.locator(".etb-dos__close").locator("visible=true").first().click();
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

/* These three were written against a flow that no longer exists. `.wt__cta`
   and `.wt__rowBtn` appear in ZERO source files, and the intermediate "paths"
   step they walk through was removed: `WorkTogether` now has two states, not
   three — `data-step` is "destination" when a path is open and "intro"
   otherwise, with the three rows visible from the start rather than behind a
   CTA. The screen itself is `.cpp-screen`, not `.wt-screen`.

   They failed on every run for however long that has been true, which is the
   worst kind of test: red for a reason nobody reads, so a real regression in
   the same file would have looked like more of the same noise. Rewritten
   against the markup that ships. */
test.describe("Consulting — Work Together flow", () => {
  test.skip(({ viewport }) => (viewport?.width ?? 0) < 1024, "cinematic stack only");

  test("intro to destination, and back again", async ({ page }) => {
    await openSite(page, "/");
    await gotoCard(page, 4);

    const wt = page.locator(".wt");
    await expect(wt).toHaveAttribute("data-step", "intro");

    // The three rows are the entry point — there is no CTA in front of them.
    await page.locator('[data-wt-row="consulting"]').click();
    await expect(wt).toHaveAttribute("data-step", "destination");
    await expect(page.locator(".cpp-screen")).toBeVisible();

    await page.locator(".cpp-screen__back").click();
    await expect(wt).toHaveAttribute("data-step", "intro");
  });

  test("every destination opens and carries the promoted system", async ({ page }) => {
    await openSite(page, "/");
    await gotoCard(page, 4);

    for (const id of ["consulting", "worldpulse", "experience"]) {
      await page.locator(`[data-wt-row="${id}"]`).click();
      const screen = page.locator(".cpp-screen");
      await expect(screen, `${id} did not open`).toBeVisible();
      // Promoted from /consulting-color-lab; all three screens carry it.
      await expect(screen).toHaveAttribute("data-system", "drafting");
      await expect(screen).toHaveAttribute("data-actions", "rule");
      await page.locator(".cpp-screen__back").click();
      await expect(page.locator(".wt")).toHaveAttribute("data-step", "intro");
    }
  });

  test("the proof sheet fits its card and needs no inner scroll", async ({ page }) => {
    await openSite(page, "/");
    await gotoCard(page, 4);
    await page.locator('[data-wt-row="consulting"]').click();
    await expect(page.locator(".cpp-screen")).toBeVisible();
    await page.waitForTimeout(500);

    const sheet = await box(page, ".cpp-screen");
    const card = await box(page, ".cstack__card--4");
    expect(sheet!.bottom, "proof sheet spills past the card").toBeLessThanOrEqual(card!.bottom + 1);
    expect(sheet!.right).toBeLessThanOrEqual(card!.right + 1);
    expect(await overflowX(page)).toBeLessThanOrEqual(1);
  });

  test("rows are keyboard operable", async ({ page }) => {
    await openSite(page, "/");
    await gotoCard(page, 4);

    const row = page.locator('[data-wt-row="consulting"]');
    await row.focus();
    await expect(row).toBeFocused();
    await page.keyboard.press("Enter");
    await expect(page.locator(".wt")).toHaveAttribute("data-step", "destination");

    // And back out from the keyboard alone.
    await page.locator(".cpp-screen__back").focus();
    await page.keyboard.press("Enter");
    await expect(page.locator(".wt")).toHaveAttribute("data-step", "intro");
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

test.describe("Work landing — CD disc on phones", () => {
  /* Emulate a real phone explicitly.
   *
   * Every project in playwright.config.ts is `devices["Desktop Chrome"]` with a
   * narrow viewport, so even the 375px `mobile` project reports `hover: hover`
   * and `pointer: fine`. useWorkScroll's phone branch keys off
   * `(max-width: 640px) and (hover: none), (max-width: 640px) and (pointer: coarse)`
   * — which NO project reaches. Without this override the test would exercise
   * the tablet code path at a phone width and prove nothing about phones. */
  test.use({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });

  test("the disc turns as the CD travels through the viewport", async ({ page }, testInfo) => {
    // The context above replaces the project viewport, so all eight projects
    // would run a byte-identical test. Once is enough.
    test.skip(
      testInfo.project.name !== "mobile",
      "phone-emulated — runs once, under the mobile project"
    );

    await openSite(page, "/");

    const geom = await page.evaluate(() => {
      const el = document.querySelector<HTMLElement>(".cd-player-wrap");
      if (!el) return null;
      let top = 0;
      let n: HTMLElement | null = el;
      while (n) {
        top += n.offsetTop;
        n = n.offsetParent as HTMLElement | null;
      }
      return { top, h: el.getBoundingClientRect().height, vh: window.innerHeight };
    });
    expect(geom, "CD player missing from the Work landing").not.toBeNull();

    /* The phone mapping runs 0 → 1 across the CD's OWN pass through the
       viewport: 0 as its top edge enters at the bottom, 1 as its bottom edge
       leaves at the top. Sampling any other window reads the holds instead of
       the sweep and understates the movement. */
    const from = Math.max(0, geom!.top - geom!.vh);
    const to = geom!.top + geom!.h;

    const seen: string[] = [];
    for (let i = 0; i <= 5; i++) {
      await page.evaluate(
        (y) => window.scrollTo(0, y),
        Math.round(from + ((to - from) * i) / 5)
      );
      // The lerp converges at 0.08/frame, so a settle beat is not optional —
      // sampling immediately reads the previous target and flattens the spread.
      await page.waitForTimeout(1200);
      seen.push(
        await page.evaluate(
          () => (document.querySelector(".cd-disc") as HTMLElement).style.transform
        )
      );
    }

    /* An EMPTY inline transform is the actual regression this guards: it means
       useWorkScroll returned before it ever reached `.cd-disc`, which is how the
       disc sat frozen at 0deg on phones while spinning fine on tablet. */
    for (const t of seen) {
      expect(t, `disc carries no JS-written rotation (got "${t}")`).toContain("rotate(");
    }

    expect(
      new Set(seen).size,
      `disc did not turn across its travel: ${seen.join(" | ")}`
    ).toBeGreaterThan(3);
  });
});
