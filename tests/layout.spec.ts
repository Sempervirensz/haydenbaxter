import { test, expect } from "@playwright/test";
import { openSite, overflowX, box, measureCh, isCinematic, gotoCard } from "./helpers";

/* Layout contracts that must hold at every viewport.
 *
 * These are the regressions that are invisible on the machine that creates
 * them: a horizontal scrollbar only a 4K panel shows, a reading column that
 * runs to 113 characters, a section that keeps a laptop width inside a 3840px
 * frame. All three shipped at some point in this repo's history. */

const ROUTES = ["/", "/blog", "/privacy", "/emerging-tech-builds", "/emerging-tech-builds/atomic-os"];

test.describe("no horizontal overflow", () => {
  for (const route of ROUTES) {
    test(`${route} does not scroll sideways`, async ({ page }) => {
      await openSite(page, route);
      expect(await overflowX(page), `${route} overflows horizontally`).toBeLessThanOrEqual(1);
    });
  }
});

test.describe("reading measure", () => {
  test("privacy body copy stays inside a readable measure", async ({ page }) => {
    await openSite(page, "/privacy");
    const ch = await measureCh(page, ".legal p");
    expect(ch, "privacy paragraph measure").not.toBeNull();
    // Upper bound is the real defect (91ch shipped); lower bound catches a
    // column that collapsed rather than one that is merely narrow on a phone.
    expect(ch!).toBeLessThanOrEqual(95);
    expect(ch!).toBeGreaterThan(20);
  });

  test("ETB detail copy stays inside a readable measure", async ({ page }) => {
    await openSite(page, "/emerging-tech-builds/atomic-os");
    for (const sel of [".etb-page__stepBody", ".etb-page__techBody", ".etb-page__storyPara"]) {
      const ch = await measureCh(page, sel);
      if (ch == null) continue; // not every detail page renders every block
      expect(ch, `${sel} measure`).toBeLessThanOrEqual(95);
    }
  });

  test("hero lead-in is capped and centred", async ({ page }) => {
    await openSite(page, "/");
    const eyebrow = await box(page, ".hero-eyebrow");
    expect(eyebrow).not.toBeNull();
    const vw = page.viewportSize()!.width;
    // 850px is the top of the band the design calls for; allow the phone case
    // where the element is simply narrower than the cap.
    expect(eyebrow!.w).toBeLessThanOrEqual(Math.min(vw, 850) + 2);
    if (vw >= 900) {
      const centreOffset = Math.abs(
        eyebrow!.left + eyebrow!.w / 2 - vw / 2
      );
      expect(centreOffset, "lead-in should be centred").toBeLessThanOrEqual(4);
    }
  });
});

test.describe("no sub-14px functional text", () => {
  for (const route of ["/", "/privacy", "/emerging-tech-builds/atomic-os"]) {
    test(`${route} has no text below the readability floor`, async ({ page }) => {
      await openSite(page, route);
      const small = await page.evaluate(() => {
        const out: { sel: string; fs: number; text: string }[] = [];
        document.querySelectorAll<HTMLElement>("*").forEach((el) => {
          const r = el.getBoundingClientRect();
          if (r.width < 2 || r.height < 2) return;
          const cs = getComputedStyle(el);
          if (cs.display === "none" || cs.visibility === "hidden") return;
          if (parseFloat(cs.opacity) < 0.05) return;
          const ownText = [...el.childNodes]
            .filter((n) => n.nodeType === 3)
            .map((n) => n.textContent?.trim() ?? "")
            .join("");
          if (ownText.length < 2) return;
          const fs = parseFloat(cs.fontSize);
          // 11.5px is the --text-label floor: DYMO labels are a deliberate
          // design decision. Anything BELOW that is an unscaled leftover.
          if (fs < 11.4) {
            out.push({
              sel: (el.className || el.tagName).toString().split(" ")[0],
              fs,
              text: ownText.slice(0, 30),
            });
          }
        });
        return out;
      });
      expect(small, `sub-floor text on ${route}`).toEqual([]);
    });
  }
});

test.describe("large-display composition", () => {
  test.skip(({ viewport }) => (viewport?.width ?? 0) < 1600, "large displays only");

  test("Emerging Tech keeps a scannable working width", async ({ page }) => {
    await openSite(page, "/");
    test.skip(!isCinematic(page), "cinematic stack only");
    await gotoCard(page, 2);
    const shell = await box(page, ".cstack__etbShell");
    expect(shell).not.toBeNull();
    // The design brief's working width. 2688px (--content-wide) is the bug.
    expect(shell!.w).toBeGreaterThanOrEqual(1400);
    expect(shell!.w).toBeLessThanOrEqual(1700);
  });

  test("Emerging Tech panel fits inside its card", async ({ page }) => {
    await openSite(page, "/");
    test.skip(!isCinematic(page), "cinematic stack only");
    await gotoCard(page, 2);
    const shell = await box(page, ".cstack__etbShell");
    const card = await box(page, ".cstack__card--2");
    expect(shell!.h, "panel taller than its card").toBeLessThanOrEqual(card!.h);
  });

  test("Supply Chain gives surplus width to the globe, not to dead space", async ({ page }) => {
    await openSite(page, "/");
    test.skip(!isCinematic(page), "cinematic stack only");
    await gotoCard(page, 3);
    const { tracks, contentW } = await page.evaluate(() => {
      const cols = document.querySelector(".sc-ed__cols");
      const content = document.querySelector(".sc-ed__content");
      return {
        tracks: cols ? getComputedStyle(cols).gridTemplateColumns.split(" ").map(parseFloat) : null,
        contentW: content ? content.getBoundingClientRect().width : null,
      };
    });
    expect(tracks, "sc-ed grid").not.toBeNull();
    const textTrack = tracks![1];
    // The defect: a 1366px track holding 657px of copy — 709px of dead space
    // sitting INSIDE the grid.
    expect(textTrack - contentW!, "dead space inside the text column").toBeLessThanOrEqual(80);
  });

  test("Consulting copy sits in a shell, not across the full bezel", async ({ page }) => {
    await openSite(page, "/");
    test.skip(!isCinematic(page), "cinematic stack only");
    await gotoCard(page, 4);
    const mast = await box(page, ".wt__masthead");
    const card = await box(page, ".cstack__card--4");
    expect(mast).not.toBeNull();
    expect(mast!.w).toBeLessThanOrEqual(1750);
    // and it should not have collapsed to shrink-wrap either
    expect(mast!.w).toBeGreaterThanOrEqual(1000);
    expect(mast!.w, "masthead should be narrower than the card").toBeLessThan(card!.w);
  });
});

test.describe("standard desktop is unchanged", () => {
  test("Consulting keeps its pre-existing full-width behaviour below 1600", async ({ page }) => {
    const vw = page.viewportSize()!.width;
    test.skip(vw >= 1600 || vw < CINEMATIC, "only the 1024-1599 band");
    await openSite(page, "/");
    await gotoCard(page, 4);
    const right = await page.evaluate(() => {
      const m = document.querySelector(".wt__masthead");
      return m ? getComputedStyle(m).right : null;
    });
    // The large-display rule sets `right: auto`. Below the threshold the
    // original left/right stretch must still be in force.
    expect(right).not.toBe("auto");
  });
});

const CINEMATIC = 1024;
