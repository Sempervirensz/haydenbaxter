import { defineConfig, devices } from "@playwright/test";

/* Playwright config for the portfolio.
 *
 * Viewports are declared as PROJECTS rather than looped inside tests, so a
 * failure names the width it happened at ("uhd › carousel loops seamlessly")
 * instead of burying it in an assertion message.
 *
 * The dev server is started on its own port so the suite never races a dev
 * server another session is already using — and so Fast Refresh from an open
 * editor session cannot feed the suite stale React state, which is exactly how
 * a non-existent globe "regression" once cost half a debugging session.
 */

const PORT = Number(process.env.PW_PORT ?? 3100);
const BASE = `http://127.0.0.1:${PORT}`;

/** The widths the site is contractually responsive at. */
export const VIEWPORTS = {
  mobile: { width: 375, height: 812 },
  mobileL: { width: 430, height: 932 },
  tablet: { width: 768, height: 1024 },
  laptop: { width: 1440, height: 900 },
  fhd: { width: 1920, height: 1080 },
  qhd: { width: 2560, height: 1440 },
  ultrawide: { width: 3440, height: 1440 },
  uhd: { width: 3840, height: 2160 },
} as const;

export default defineConfig({
  testDir: "./tests",
  // tests/audit is the cross-browser matrix for /audit-repair; it has its own
  // config (playwright.audit.config.ts) with Firefox and WebKit projects.
  // tests/audit is the cross-browser matrix (playwright.audit.config.ts).
  // entry-cta.spec.ts targets /entry-cta-lab, a dev-only route since 92fbecf —
  // it runs from playwright.labs.config.ts against `next dev`.
  testIgnore: ["**/audit/**", "**/entry-cta.spec.ts"],
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  /* Retry locally too, not just in CI.
   *
   * These pages are heavy enough that four workers against one static server
   * can push the soft-lock gate's hydration past its budget. The tests that
   * lose that race are not failing on their assertion — they never get the page
   * open — and they pass every time when run serially. Without a retry the run
   * reports them as defects, which is how a 46/47 project came back as 26
   * "failures" across a full sweep and cost an hour of chasing ghosts.
   *
   * A genuine failure still fails twice. A flake shows up as flaky, which is
   * the information actually worth having. */
  retries: 1,
  workers: process.env.CI ? 2 : 4,
  // HTML report so results are browsable after the fact — `npx playwright
  // show-report` opens it with the failure screenshots and traces attached.
  reporter: process.env.CI
    ? [["github"], ["list"]]
    : [["list"], ["html", { open: "never" }]],
  timeout: 60_000,
  expect: { timeout: 10_000 },

  use: {
    baseURL: BASE,
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
    // Motion preference lives under contextOptions in Playwright 1.6x, not as a
    // top-level `use` key. At the top level it type-errors rather than being
    // silently ignored, which is the good failure mode.
    contextOptions: { reducedMotion: "no-preference" },
  },

  projects: Object.entries(VIEWPORTS).map(([name, viewport]) => ({
    name,
    use: { ...devices["Desktop Chrome"], viewport },
  })),

  /* Production build, not `next dev`.
   *
   * Dev mode compiles each route on first request, so with parallel workers the
   * first few tests to touch `/` waited on a 45,000px page being built and
   * hydrated — enough for the soft-lock gate to miss a 20s budget and report as
   * a broken gate rather than a slow one. A dev run also went 2.6m → 12.8m and
   * lost half its assertions purely to compile latency.
   *
   * `reuseExistingServer` is off deliberately: a stale `next dev` left over
   * from a debugging session got adopted by the runner once and produced 26
   * phantom failures. The suite now always owns its own server. */
  /* Build once, then serve the static export.
   *
   * NOT `next dev`: dev compiles each route on first request, so with parallel
   * workers the first tests to touch `/` waited on a 45,000px page being built
   * and hydrated — enough for the soft-lock gate to blow a 20s budget and
   * report as a broken gate rather than a slow one. A dev run went 2.6m →
   * 12.8m and lost half its assertions to compile latency alone.
   *
   * NOT `next start` either: next.config.ts sets `output: "export"` outside
   * dev, and `next start` refuses to run against an exported build. `serve out`
   * is what .claude/launch.json already uses for the same reason.
   *
   * `reuseExistingServer` is off deliberately: a stale `next dev` left over
   * from a debugging session got adopted by the runner once and produced 26
   * phantom failures. The suite always owns its own server. */
  webServer: {
    command: `npx next build && npx --yes serve out -l ${PORT}`,
    url: BASE,
    reuseExistingServer: false,
    timeout: 300_000,
    stdout: "ignore",
    stderr: "pipe",
  },
});
