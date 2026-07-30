import { defineConfig, devices } from "@playwright/test";

/* Playwright config for the portfolio.
 *
 * Viewports are declared as PROJECTS rather than looped inside tests so a
 * failure names the width it happened at ("4k › carousel loops seamlessly")
 * instead of burying it in an assertion message.
 *
 * `next dev` is deliberately NOT reused for the suite by default — Fast Refresh
 * preserves React state across edits, which silently reports stale values for
 * anything driven by useState (this is exactly how the globe once looked like a
 * regression it never was). `reuseExistingServer` is allowed locally for speed,
 * but CI always gets a cold server.
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
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 2 : 4,
  reporter: process.env.CI ? [["github"], ["list"]] : [["list"]],
  timeout: 60_000,
  expect: { timeout: 10_000 },

  use: {
    baseURL: BASE,
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
    // The card deck, cinematic stack and marquee all animate; without this the
    // suite races them and reports phantom geometry.
    reducedMotion: "no-preference",
  },

  projects: Object.entries(VIEWPORTS).map(([name, viewport]) => ({
    name,
    use: { ...devices["Desktop Chrome"], viewport },
  })),

  webServer: {
    command: `npx next dev -p ${PORT}`,
    url: BASE,
    reuseExistingServer: !process.env.CI,
    timeout: 180_000,
    stdout: "ignore",
    stderr: "pipe",
  },
});
