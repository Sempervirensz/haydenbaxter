import { test, expect, type Page, type Response } from "@playwright/test";

/* Regression guard for /audit-repair.
 *
 * Scope discipline: this file asserts invariants that hold RIGHT NOW. It is
 * not a wishlist of unfixed audit findings. If it asserted things the site does
 * not yet do (the entry fold, the mobile line-clamp), it would be red from the
 * first run, and the repair loop's "debug until green" step would have no
 * signal to work with — every run would look broken.
 *
 * So: general health invariants + a targeted guard per finding already marked
 * Verified in docs/audit-status.md. Each new repair adds its own `test()` here
 * before its status is promoted to Verified.
 */

const PROD_ROUTES = ["/", "/emerging-tech-builds", "/emerging-tech-builds/cortex", "/blog", "/privacy"];

/* Third-party origins are cut off for every test in this file.
 *
 * A regression suite must not be able to go red because Calendly is slow, rate
 * limits the runner, or returns a 401 to a headless browser. Left connected it
 * produced exactly that: cross-origin frame errors and 400/401s in WebKit, and
 * third-party cookie rejections that Firefox reports as console *errors* —
 * none of them defects in this site.
 *
 * Blocking is also the more useful state to assert against. CalendlyEmbed has
 * a deliberate fallback for a blocked widget (see its header comment), so this
 * exercises the path a visitor with a content blocker actually gets.
 *
 * Fulfilled with an empty 204 rather than aborted. `route.abort()` makes the
 * browser log "Failed to load resource: net::ERR_FAILED" with no URL attached,
 * which no URL-based filter can distinguish from a genuine first-party asset
 * failure — and adding that string to the ignore list would blind the suite to
 * exactly the regression it exists to catch. A 204 is silent. */
const THIRD_PARTY = /calendly\.com|stripe\.com/;

test.beforeEach(async ({ context }) => {
  await context.route("**/*", (route) => {
    if (THIRD_PARTY.test(route.request().url())) {
      return route.fulfill({ status: 204, body: "", contentType: "text/plain" });
    }
    return route.continue();
  });
});

/** Lab routes that must NOT exist in a production build (ETB-P1-04). */
const LAB_ROUTES = ["/cd-lab", "/sc-lab", "/design-lab", "/offer-lab", "/personas-lab", "/lab/scroll/08-compositing-off"];

/** Console noise that is not the site's fault.
 *
 * Kept deliberately narrow. Every entry is either third-party or a known
 * engine quirk — none of them suppress a class of error the site could
 * plausibly produce itself. Widening this list is how a regression suite
 * quietly stops regressing. */
function isIgnorableConsole(text: string): boolean {
  return (
    // Next preloads CSS chunks it may not use on a given route. Tracked as
    // ETB-P3-04; a warning, not an error, and not a cross-browser signal.
    text.includes("was preloaded using link preload") ||
    // Firefox reports third-party cookie rejection as a console *error*.
    // These come from the Calendly embed and its Stripe frame, are emitted by
    // calendly.com rather than this site, and appear in no other engine.
    text.includes("has been rejected because it is in a cross-site context") ||
    text.includes("has been rejected for invalid domain") ||
    /_calendly_session|cal_anonymous_id|__stripe_(mid|sid)/.test(text) ||
    // Third-party frames the local run may not be able to reach at all.
    text.includes("Failed to load resource: A server with the specified hostname")
  );
}

/** Third-party hosts a local run cannot reach; their failures are not defects. */
function isExternal(url: string): boolean {
  return !url.includes("127.0.0.1") && !url.includes("localhost");
}

/** A request the browser itself cancelled is not a failed request.
 *
 * The site swaps some image `src` values and unmounts others as the Work
 * section mounts, so the browser drops in-flight loads it no longer needs.
 * Each engine names this differently — NS_BINDING_ABORTED in Firefox,
 * net::ERR_ABORTED in Chromium, "cancelled" in WebKit — and the original audit
 * already established the Chromium case as benign (the resources return 200 on
 * the request that is actually used). Counting these as failures makes Firefox
 * look broken while Chromium looks clean, for identical behaviour. */
function isCancellation(errorText: string | undefined): boolean {
  if (!errorText) return false;
  return /NS_BINDING_ABORTED|ERR_ABORTED|cancell?ed/i.test(errorText);
}

interface Collected {
  errors: string[];
  failed: string[];
}

/** Attach console/network collectors before the first navigation. */
function collect(page: Page): Collected {
  const c: Collected = { errors: [], failed: [] };
  page.on("console", (m) => {
    if (m.type() === "error" && !isIgnorableConsole(m.text())) c.errors.push(m.text().slice(0, 300));
  });
  page.on("pageerror", (e) => c.errors.push(`pageerror: ${String(e).slice(0, 300)}`));
  page.on("requestfailed", (r) => {
    const err = r.failure()?.errorText;
    if (isExternal(r.url()) || isCancellation(err)) return;
    c.failed.push(`${r.url()} :: ${err}`);
  });
  page.on("response", (r: Response) => {
    if (r.status() >= 400 && !isExternal(r.url())) c.failed.push(`${r.url()} :: HTTP ${r.status()}`);
  });
  return c;
}

/** Wait for the page to be interactive.
 *
 * This used to poll the intro splash away — it held the viewport for ~4.1s and
 * swallowed clicks, so every test paid for it. ETB-P1-02 removed the splash
 * outright, so this is now just a hydration settle. The `.splash` check is kept
 * as a guard: if an overlay of that name ever returns, the suite waits for it
 * rather than silently clicking through it. */
async function settle(page: Page): Promise<void> {
  await page
    .waitForFunction(
      () => {
        const s = document.querySelector(".splash");
        if (!s) return true;
        const cs = getComputedStyle(s);
        return cs.display === "none" || cs.visibility === "hidden" || Number(cs.opacity) === 0;
      },
      undefined,
      { timeout: 12_000 }
    )
    .catch(() => {
      /* If the splash never clears that is itself a finding, but it is not this
       * helper's job to assert it -- let the caller's own assertions report. */
    });
  // Brief settle for layout/hydration after the overlay leaves.
  await page.waitForTimeout(400);
}

/** Open the soft-lock gate by flipping all four cards. Returns cards flipped. */
async function openGate(page: Page): Promise<number> {
  const n = await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll("button")).filter((b) =>
      (b.getAttribute("aria-label") || "").toLowerCase().includes("flip")
    );
    btns.forEach((b) => (b as HTMLButtonElement).click());
    return btns.length;
  });
  await page.waitForTimeout(2500);
  return n;
}

test.describe("production routes are healthy", () => {
  for (const route of PROD_ROUTES) {
    test(`${route} loads clean`, async ({ page }) => {
      const c = collect(page);
      const res = await page.goto(route, { waitUntil: "load" });
      expect(res?.status(), `${route} should serve 200`).toBe(200);
      await settle(page);

      expect(c.errors, `console errors on ${route}`).toEqual([]);
      expect(c.failed, `failed requests on ${route}`).toEqual([]);
    });

    test(`${route} has no horizontal overflow`, async ({ page }) => {
      await page.goto(route, { waitUntil: "load" });
      await settle(page);
      const overflow = await page.evaluate(() => {
        const de = document.documentElement;
        return de.scrollWidth - de.clientWidth;
      });
      // 1px of subpixel rounding is tolerable; a real overflow is far larger.
      expect(overflow, `${route} overflows horizontally by ${overflow}px`).toBeLessThanOrEqual(1);
    });
  }
});

test.describe("ETB-P1-04 — labs stay out of the production build", () => {
  for (const route of LAB_ROUTES) {
    test(`${route} is absent from production`, async ({ page }) => {
      const res = await page.goto(route, { waitUntil: "domcontentloaded" });
      expect(res?.status(), `${route} must not be reachable in a prod build`).toBe(404);
    });
  }
});

test.describe("ETB-P1-01 — homepage art is WebP, not PNG", () => {
  test("no oversized image ships on the homepage", async ({ page }) => {
    const heavy: string[] = [];
    page.on("response", async (r) => {
      const ct = r.headers()["content-type"] || "";
      const len = Number(r.headers()["content-length"] || 0);
      // The regression this guards is multi-megabyte PNG art returning. 1.5 MB
      // is comfortably above every asset the fixed homepage serves and well
      // below the 2.0-4.3 MB PNGs it used to.
      if (ct.startsWith("image/") && len > 1_500_000) {
        heavy.push(`${(len / 1e6).toFixed(2)}MB ${ct} ${r.url().split("/").pop()}`);
      }
    });
    await page.goto("/", { waitUntil: "load" });
    await settle(page);
    expect(heavy, "an oversized image regressed onto the homepage").toEqual([]);
  });

  test("the CD art and player plates are served as WebP", async ({ page }) => {
    const seen: string[] = [];
    page.on("response", (r) => seen.push(r.url()));
    await page.goto("/", { waitUntil: "load" });
    await settle(page);
    await openGate(page);

    const pngArt = seen.filter((u) =>
      /(portfolio-cd|playerforeground|playershellpngtransparent|hero-2|WorldPulseCostal3\.0|usethisbackground)\.png$/.test(u)
    );
    expect(pngArt, "heavy PNG art is being served again").toEqual([]);
  });
});

test.describe("keyboard access", () => {
  /* Safari does not put links and buttons in the Tab sequence by default —
   * Tab moves between form controls only, unless the user turns on Full
   * Keyboard Access. Playwright's WebKit inherits that default, so a Tab-walk
   * on WebKit reports activeElement as BODY forever.
   *
   * That is an engine default, not a defect here, and asserting Tab order on
   * WebKit would report this correctly-built gate as broken. So the Tab-order
   * test is Chromium/Firefox, and every engine gets the assertions that do
   * hold everywhere: the controls are real buttons, they take focus, they show
   * a focus ring, and they activate from the keyboard. */

  test("gate cards are real, focusable, keyboard-activatable buttons", async ({ page }) => {
    await page.goto("/", { waitUntil: "load" });
    await settle(page);

    const cards = await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll("button")).filter((b) =>
        /flip/i.test(b.getAttribute("aria-label") || "")
      );
      return btns.map((b) => {
        b.focus();
        const cs = getComputedStyle(b);
        return {
          tag: b.tagName,
          name: (b.getAttribute("aria-label") || "").trim(),
          takesFocus: document.activeElement === b,
          focusVisible: cs.outlineStyle !== "none" || cs.boxShadow !== "none",
        };
      });
    });

    expect(cards.length, "expected four gate cards").toBe(4);
    for (const c of cards) {
      expect(c.tag, `card "${c.name}" must be a <button>`).toBe("BUTTON");
      expect(c.name.length, "every card needs an accessible name").toBeGreaterThan(0);
      expect(c.takesFocus, `card "${c.name}" cannot receive focus`).toBe(true);
      expect(c.focusVisible, `card "${c.name}" has no visible focus indicator`).toBe(true);
    }
  });

  test("the gate opens with the keyboard alone", async ({ page }) => {
    await page.goto("/", { waitUntil: "load" });
    await settle(page);

    const before = await page.evaluate(() => document.documentElement.scrollHeight);

    // Focus each card and activate it with Enter — no mouse, and no reliance
    // on Tab order, so this holds in WebKit too.
    const count = await page.evaluate(
      () => document.querySelectorAll('button[aria-label*="flip" i]').length
    );
    for (let i = 0; i < count; i++) {
      await page.evaluate((idx) => {
        const btns = document.querySelectorAll<HTMLButtonElement>('button[aria-label*="flip" i]');
        btns[idx]?.focus();
      }, i);
      await page.keyboard.press("Enter");
      await page.waitForTimeout(250);
    }
    await page.waitForTimeout(2500);

    const after = await page.evaluate(() => document.documentElement.scrollHeight);
    expect(after, "keyboard-only users must be able to get past the entry gate").toBeGreaterThan(before);
  });

  test("Tab reaches the gate controls", async ({ page, browserName }) => {
    test.skip(
      browserName === "webkit",
      "Safari excludes buttons/links from Tab order unless Full Keyboard Access is enabled; focusability is covered by the test above."
    );
    await page.goto("/", { waitUntil: "load" });
    await settle(page);

    const stops: { tag: string; name: string; focusVisible: boolean }[] = [];
    for (let i = 0; i < 14; i++) {
      await page.keyboard.press("Tab");
      const s = await page.evaluate(() => {
        const a = document.activeElement as HTMLElement | null;
        if (!a || a === document.body) return null;
        const cs = getComputedStyle(a);
        return {
          tag: a.tagName,
          name: (a.getAttribute("aria-label") || a.textContent || "").trim().slice(0, 60),
          focusVisible: cs.outlineStyle !== "none" || cs.boxShadow !== "none",
        };
      });
      if (s) stops.push(s);
    }

    expect(stops.length, "nothing was focusable on the entry screen").toBeGreaterThan(0);
    const cardStops = stops.filter((s) => /flip/i.test(s.name));
    expect(cardStops.length, "all four gate cards must be Tab reachable").toBeGreaterThanOrEqual(4);

    const invisible = stops.filter((s) => !s.focusVisible);
    expect(invisible, `focusable elements with no visible focus indicator: ${JSON.stringify(invisible)}`).toEqual([]);
  });
});

test.describe("reduced motion", () => {
  test.use({ contextOptions: { reducedMotion: "reduce" } });

  test("the site is usable and clean under prefers-reduced-motion", async ({ page }) => {
    const c = collect(page);
    await page.goto("/", { waitUntil: "load" });
    await settle(page);

    expect(c.errors, "console errors under reduced motion").toEqual([]);
    expect(c.failed, "failed requests under reduced motion").toEqual([]);

    // ETB-P1-02: no blocking intro overlay may hold the viewport, in any
    // motion mode. The splash was removed; this asserts it stays gone.
    const blockingOverlay = await page.evaluate(() => {
      const s = document.querySelector(".splash");
      if (!s) return null;
      const cs = getComputedStyle(s);
      const covering = cs.display !== "none" && cs.visibility !== "hidden" && Number(cs.opacity) > 0;
      return covering ? "a .splash overlay is covering the viewport" : null;
    });
    expect(blockingOverlay, "no intro overlay may hold the screen").toBeNull();

    // And the gate must still open.
    const opened = await openGate(page);
    expect(opened, "gate cards should still be present under reduced motion").toBe(4);
  });
});

test.describe("text is not clipped", () => {
  test("no unintentional text truncation on the ETB index", async ({ page }) => {
    await page.goto("/emerging-tech-builds", { waitUntil: "load" });
    await settle(page);

    const clipped = await page.evaluate(() => {
      const out: { text: string; scrollH: number; clientH: number }[] = [];
      for (const el of Array.from(document.querySelectorAll("h1,h2,h3,p,li,button,a"))) {
        const cs = getComputedStyle(el);
        if (cs.overflow === "visible" && cs.overflowY === "visible") continue;
        // An explicit line-clamp is a deliberate design decision, not clipping.
        if (cs.webkitLineClamp && cs.webkitLineClamp !== "none") continue;
        if (el.scrollHeight > el.clientHeight + 2 && el.clientHeight > 0) {
          out.push({
            text: (el.textContent || "").trim().slice(0, 60),
            scrollH: el.scrollHeight,
            clientH: el.clientHeight,
          });
        }
      }
      return out;
    });

    expect(clipped, `text clipped without an explicit clamp: ${JSON.stringify(clipped)}`).toEqual([]);
  });
});

test.describe("SEO invariants", () => {
  test("public routes stay indexable and canonical", async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });
    const meta = await page.evaluate(() => ({
      robots: document.querySelector('meta[name="robots"]')?.getAttribute("content") ?? null,
      canonical: document.querySelector('link[rel="canonical"]')?.getAttribute("href") ?? null,
      title: document.title,
      ogImage: document.querySelector('meta[property="og:image"]')?.getAttribute("content") ?? null,
    }));
    expect(meta.robots, "the homepage must stay indexable").toContain("index");
    expect(meta.robots).not.toContain("noindex");
    expect(meta.canonical, "canonical URL missing").toBeTruthy();
    expect(meta.title.length, "title should be substantive").toBeGreaterThan(10);
    expect(meta.ogImage, "og:image missing").toBeTruthy();
  });
});
