import { defineConfig, devices } from "@playwright/test";

/* Lab specs run against a DEV server, not the production export.
 *
 * Labs are `page.dev.tsx` (see next.config.ts `pageExtensions`), so they exist
 * under `next dev` and are absent from every production build. `entry-cta.spec.ts`
 * navigates to /entry-cta-lab, so running it against a production build 404s and
 * all 27 of its tests fail on a missing `.ecta__choice` — which is exactly what
 * happened after commit 92fbecf, silently, on already-deployed code.
 *
 * Splitting it out mirrors the architecture instead of fighting it: dev-only
 * routes get a dev-only suite. `playwright.config.ts` ignores this spec, and the
 * cross-browser matrix (playwright.audit.config.ts) never touched it.
 */

const PORT = Number(process.env.PW_LABS_PORT ?? 3102);
const BASE = `http://127.0.0.1:${PORT}`;

export default defineConfig({
  testDir: "./tests",
  testMatch: ["**/entry-cta.spec.ts"],
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: 1,
  /* Lower than the export suites on purpose: `next dev` compiles each route on
   * first request, so parallel workers queue behind the same compile. */
  workers: 2,
  reporter: process.env.CI ? [["github"], ["list"]] : [["list"], ["html", { open: "never" }]],
  timeout: 90_000,
  expect: { timeout: 15_000 },

  use: {
    baseURL: BASE,
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
    contextOptions: { reducedMotion: "no-preference" },
  },

  projects: [{ name: "laptop", use: { ...devices["Desktop Chrome"], viewport: { width: 1440, height: 900 } } }],

  /* Its own NEXT_DIST_DIR: two `next dev` processes sharing `.next` flap a live
   * route between 200 and 404 (documented in next.config.ts), which would look
   * exactly like the bug this config exists to fix. */
  webServer: {
    command: `NEXT_DIST_DIR=.next-labs npx next dev -p ${PORT}`,
    url: BASE,
    reuseExistingServer: false,
    timeout: 180_000,
    stdout: "ignore",
    stderr: "pipe",
  },
});
