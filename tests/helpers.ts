import { expect, type Page, type ConsoleMessage } from "@playwright/test";

/* Shared harness.
 *
 * Every helper here exists because a naive version of it produced a WRONG
 * reading during manual verification. The comments say which, so nobody
 * re-derives them the hard way.
 */

/** Below this the site swaps the cinematic Work stack for the mobile cards. */
export const CINEMATIC_MIN_WIDTH = 1024;

export function isCinematic(page: Page) {
  const w = page.viewportSize()?.width ?? 0;
  return w >= CINEMATIC_MIN_WIDTH;
}

/**
 * Load a route and release the soft-lock gate.
 *
 * The homepage renders everything below the card deck inside
 * `.dlab-gate__content.is-locked` (display:none) until the visitor flips four
 * cards or presses Skip. Measuring before that returns zeros for every element
 * on the page, which reads exactly like "the layout collapsed".
 */
export async function openSite(page: Page, path = "/") {
  await page.goto(path, { waitUntil: "load" });
  await releaseGate(page);
  await page.waitForLoadState("networkidle").catch(() => {});
}

/**
 * Flip all four cards until the gate actually opens.
 *
 * The entry used to carry a "Skip the intro" button and this drove that. It no
 * longer exists — the gate now offers Story Mode (flip four cards) or a link
 * that jumps to Consulting — so flipping is the route that opens the gate and
 * leaves the visitor at the top of the page, which is what every caller wants.
 *
 * Two details that are not optional:
 *  - Only unflipped cards are clicked. A second click flips a card back, so a
 *    naive retry that re-clicks everything oscillates instead of converging.
 *  - No `force: true`. Force skips Playwright's actionability wait, which is the
 *    only thing that notices the intro splash still covering the deck — with it
 *    on, every click lands on `.splash` and reports success while nothing flips.
 *
 * The retry itself is for hydration: the deck is server-rendered, so a click
 * that lands before React attaches is swallowed with no handler.
 */
export async function releaseGate(page: Page) {
  const gate = page.locator(".dlab-gate__content");
  if (!(await gate.count())) return; // route has no soft lock

  const cards = page.locator("button.card-hover-wrapper");
  if (!(await cards.count())) return;

  await expect(async () => {
    const n = await cards.count();
    for (let i = 0; i < n; i++) {
      const card = cards.nth(i);
      if ((await card.getAttribute("aria-pressed")) === "false") await card.click();
    }
    const nowOpen = await gate
      .first()
      .evaluate((el) => el.classList.contains("is-open"));
    expect(nowOpen).toBe(true);
  }).toPass({ timeout: 30_000, intervals: [200, 400, 800] });
}

/**
 * Natural document offsets of the four cinematic chapters.
 *
 * MUST be read from the chapter wrappers' `offsetTop`, never from a card's
 * `getBoundingClientRect()`. The cards are `position: sticky`, so once stuck
 * they report their STUCK position — using that to compute a scroll target
 * walks the page further down on every call and silently lands you on the
 * wrong chapter.
 */
export async function chapterOffsets(page: Page): Promise<number[]> {
  return page.evaluate(() => {
    window.scrollTo(0, 0);
    return [...document.querySelectorAll(".work__chapter--detail")].map(
      (el) => (el as HTMLElement).offsetTop
    );
  });
}

/**
 * Park the viewport inside cinematic card `n` (1-indexed) and let it settle.
 *
 * The `resize` tick is not decoration: `SupplyChainDetail` sizes its globe from
 * a ResizeObserver on the globe column, and the observer's first callback fires
 * while the gate still has the column at zero size, so `compute()` early-returns
 * and the globe stays at its 360px `useState` default. A real resize event runs
 * `compute()` again against the settled layout.
 */
export async function gotoCard(page: Page, n: 1 | 2 | 3 | 4, into = 2000) {
  const offsets = await chapterOffsets(page);
  const top = offsets[n - 1];
  if (top == null) throw new Error(`chapter ${n} not found (got ${offsets.length})`);
  await page.evaluate(
    ([y]) => {
      window.scrollTo(0, y as number);
      window.dispatchEvent(new Event("resize"));
    },
    [top + into]
  );
  await page.waitForTimeout(400);
}

/** Force lazy images in a container to load, then wait for them. */
export async function settleImages(page: Page, selector: string) {
  await page.evaluate((sel) => {
    document.querySelectorAll<HTMLImageElement>(`${sel} img`).forEach((img) => {
      img.loading = "eager";
    });
  }, selector);
  await page
    .waitForFunction(
      (sel) => {
        const imgs = [...document.querySelectorAll<HTMLImageElement>(`${sel} img`)];
        return imgs.length > 0 && imgs.every((i) => i.complete && i.naturalWidth > 0);
      },
      selector,
      { timeout: 15_000 }
    )
    .catch(() => {});
}

/** Document-level horizontal overflow in px (0 = none). */
export function overflowX(page: Page) {
  return page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth
  );
}

/**
 * Collect console errors. Filters noise that is not the site's fault:
 * WebGL/three.js warnings in headless, and Next's dev-only HMR chatter.
 */
export function collectConsoleErrors(page: Page) {
  const errors: string[] = [];
  const ignore = [
    /WebGL/i,
    /THREE\./i,
    /Download the React DevTools/i,
    /\[Fast Refresh\]/i,
    /favicon/i,
    /Failed to load resource.*404.*\.map/i,
  ];
  const onMsg = (m: ConsoleMessage) => {
    if (m.type() !== "error") return;
    const text = m.text();
    if (ignore.some((re) => re.test(text))) return;
    errors.push(text);
  };
  page.on("console", onMsg);
  page.on("pageerror", (e) => {
    if (!ignore.some((re) => re.test(e.message))) errors.push(`pageerror: ${e.message}`);
  });
  return errors;
}

/**
 * Characters-per-line for a text element, in the SAME unit CSS means by `ch`.
 *
 * An earlier version assumed `1ch ≈ 0.5em`. That is wrong for this site's sans:
 * its `0` advance is nearer 0.67em, so a `max-width: 74ch` rule resolves to
 * ~758px while the helper reported the same box as "99ch". The test and the
 * stylesheet were describing the same element in different units, which made a
 * correctly-capped column look like an uncapped one. Measuring a real `0` in
 * the element's own computed font keeps both honest.
 */
export async function measureCh(page: Page, selector: string) {
  return page.evaluate((sel) => {
    const el = document.querySelector(sel);
    if (!el) return null;
    const r = el.getBoundingClientRect();
    if (!r.width) return null;

    const probe = document.createElement("span");
    const cs = getComputedStyle(el);
    probe.style.font = cs.font || `${cs.fontSize} ${cs.fontFamily}`;
    probe.style.fontFamily = cs.fontFamily;
    probe.style.fontSize = cs.fontSize;
    probe.style.fontWeight = cs.fontWeight;
    probe.style.letterSpacing = cs.letterSpacing;
    probe.style.position = "absolute";
    probe.style.visibility = "hidden";
    probe.style.whiteSpace = "pre";
    probe.textContent = "0".repeat(100);
    document.body.appendChild(probe);
    const chWidth = probe.getBoundingClientRect().width / 100;
    probe.remove();

    if (!chWidth) return null;
    return Math.round(r.width / chWidth);
  }, selector);
}

/** Box of an element, or null when it is absent/not rendered. */
export async function box(page: Page, selector: string) {
  return page.evaluate((sel) => {
    const el = document.querySelector(sel);
    if (!el) return null;
    const r = el.getBoundingClientRect();
    const cs = getComputedStyle(el);
    return {
      w: Math.round(r.width),
      h: Math.round(r.height),
      left: Math.round(r.left),
      right: Math.round(r.right),
      top: Math.round(r.top),
      bottom: Math.round(r.bottom),
      fontSize: parseFloat(cs.fontSize),
      display: cs.display,
      visibility: cs.visibility,
    };
  }, selector);
}
