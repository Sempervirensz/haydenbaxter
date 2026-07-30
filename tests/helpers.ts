import type { Page, ConsoleMessage } from "@playwright/test";

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
  await page.goto(path, { waitUntil: "domcontentloaded" });
  await releaseGate(page);
  await page.waitForLoadState("networkidle").catch(() => {});
}

export async function releaseGate(page: Page) {
  const skip = page.locator("button", { hasText: /Skip the intro/i });
  if (await skip.count()) {
    await skip.first().click();
    await page.locator(".dlab-gate__content.is-open").waitFor({ timeout: 5000 });
  }
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

/** Approximate characters-per-line for a text element. */
export async function measureCh(page: Page, selector: string) {
  return page.evaluate((sel) => {
    const el = document.querySelector(sel);
    if (!el) return null;
    const r = el.getBoundingClientRect();
    const fs = parseFloat(getComputedStyle(el).fontSize);
    if (!fs || !r.width) return null;
    // 0.5em per character is the standard rough advance for a humanist sans.
    return Math.round(r.width / (fs * 0.5));
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
