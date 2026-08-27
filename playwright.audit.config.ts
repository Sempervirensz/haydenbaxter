import { defineConfig, devices } from "@playwright/test";

/* Cross-browser regression matrix for /audit-repair.
 *
 * Separate from playwright.config.ts on purpose. That suite is the existing
 * feature suite: Chromium only, eight widths, tuned over time. This one exists
 * to answer a narrower question — "did repairing an audit finding break the
 * site in a browser or at a width I wasn't looking at?" — and it has to run
 * Firefox and WebKit to do that.
 *
 * WebKit matters more than its share of the matrix suggests. The repo carries
 * Safari-specific lab routes (/lab/scroll/05-safari-root-no-gutter) and a
 * documented Safari perf cliff in useWorkScroll.ts, so Safari is where this
 * site has historically diverged — and it was the single largest untested
 * surface when the audit was written.
 *
 * 3 engines x 8 widths = 24 projects.
 */

/** The eight display classes every repair must survive. */
export const AUDIT_VIEWPORTS = {
  /* 320 and 1024 are named in the audit brief and were missing from the first
     matrix. Both came back clean when finally tested — kept so they stay that way. */
  xs: { width: 320, height: 568 },
  mobile: { width: 390, height: 844 },
  landscape: { width: 844, height: 390 },
  tablet: { width: 768, height: 1024 },
  md: { width: 1024, height: 768 },
  laptop: { width: 1440, height: 900 },
  desktop: { width: 1920, height: 1080 },
  wide: { width: 2560, height: 1440 },
} as const;

const ENGINES = {
  chromium: devices["Desktop Chrome"],
  firefox: devices["Desktop Firefox"],
  webkit: devices["Desktop Safari"],
} as const;

const PORT = Number(process.env.PW_AUDIT_PORT ?? 3101);
const BASE = `http://127.0.0.1:${PORT}`;

export default defineConfig({
  testDir: "./tests/audit",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  /* Retried once for the same reason the main suite retries: these pages are
   * heavy enough that a cold worker can lose the soft-lock gate's hydration
   * race and report a page that never opened as a broken gate. A real failure
   * still fails twice; a flake reports as flaky, which is the useful signal. */
  retries: 1,
  /* Deliberately lower than the main suite's 4. Eighteen projects against one
   * static server, with WebKit and Firefox in the mix, is enough concurrency
   * already — pushing further trades signal for flakes. */
  workers: process.env.CI ? 2 : 3,
  reporter: process.env.CI ? [["github"], ["list"]] : [["list"], ["html", { open: "never" }]],
  timeout: 90_000,
  expect: { timeout: 15_000 },

  use: {
    baseURL: BASE,
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
    contextOptions: { reducedMotion: "no-preference" },
  },

  projects: Object.entries(ENGINES).flatMap(([engine, device]) =>
    Object.entries(AUDIT_VIEWPORTS).map(([size, viewport]) => ({
      // "webkit-mobile" — a failure names the engine and the width, so the
      // report reads as a coordinate rather than a stack trace to decode.
      name: `${engine}-${size}`,
      use: { ...device, viewport },
    }))
  ),

  /* Production build, then the static export — never `next dev`.
   *
   * Dev compiles per route on first request; with parallel workers the first
   * tests to touch `/` wait on a multi-thousand-pixel page being built, and a
   * slow gate reports as a broken gate. `next start` is not an option either:
   * next.config.ts sets `output: "export"` outside dev.
   *
   * scripts/serve-export.mjs rather than `npx --yes serve`: no network fetch at
   * test time, and it resolves `/foo` to `foo.html` instead of listing the
   * sibling `foo/` asset directory (that listing bug produced two false
   * findings during the original audit). */
  webServer: {
    /* CI builds once in a setup job and hands `out/` to each engine shard as an
       artifact, so the shards must NOT rebuild — three parallel `next build`
       runs would triple the wall clock for an identical result. Locally the
       flag is unset and the build still happens here. */
    command: process.env.PW_SKIP_BUILD
      ? `node scripts/serve-export.mjs ${PORT}`
      : `npx next build && node scripts/serve-export.mjs ${PORT}`,
    url: BASE,
    reuseExistingServer: false,
    timeout: 300_000,
    stdout: "ignore",
    stderr: "pipe",
  },
});
