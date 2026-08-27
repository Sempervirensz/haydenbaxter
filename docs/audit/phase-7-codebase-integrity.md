# Report 7 — Codebase Integrity (Brief Phase 10)

**Date:** 2026-08-26 · **Against:** commit `15f4e7b`

> This is the shortest report, because the codebase is in better shape than the audit expected.
> Round 1 assessed architecture and dead code but never touched the 7,887 lines of core CSS. That
> gap is now closed, and it came back clean.

## Scope

**Exercised:** duplicate selectors and whether each is a conflict or a legitimate override;
specificity chains; `!important` pressure; dead CSS classes cross-referenced against every
production `.tsx`; the brief's architectural boundary test (content → data, markup → components,
behaviour → hooks, styles → stylesheets); module-scope mutable state; magic numbers in the scroll
hook; whether lab CSS reaches the production bundle.

**Not exercised:** runtime CSS coverage profiling (which rules go unused on a given route, as
opposed to unused in the source); bundle-level JS tree-shaking analysis.

---

## Findings

### [ETB-P10-01] The production CSS bundle is 321 KB, with a single 164 KB chunk

- **Severity:** **P3** · **Confidence:** **High (measured)** · **Area:** Performance / Maintainability

**Evidence**
```
exported CSS total: 321,500 bytes
largest chunk:      164,025 bytes  c4aac04026149347.css
next two:            49,565 / 35,016
```
Production CSS source is 20,140 lines across all stylesheets. A 164 KB single chunk means most
routes download rules for surfaces they never render.

**Calibration:** this is a real inefficiency but a modest one — CSS compresses well, and Report 4
established the site is network-bound in *image* bytes, not CSS. Fixing the two remaining PNGs
(`ETB-P4-02`, ~1.06 MB) is worth roughly 16× more than perfectly splitting this bundle. Recorded
so it is visible, not urgent.

**Complexity:** Medium

---

## Suspicious but actually fine — the substance of this phase

1. **Zero dead CSS classes.** Cross-referenced all **620** class selectors defined in
   `globals.css` and `work-details.css` against every production `.tsx` and `.css`:
   **0 unused.** On a 20,140-line stylesheet with a long experimental history, that is genuinely
   unusual.

2. **Zero deep specificity chains.** No selector in either core stylesheet runs 4+ levels.

3. **Every "duplicate selector" is legitimate.** Seven selectors appear more than once
   (`.hero-heading`, `.brands`, `.blog-post`, …). Each is either a media-query override at a
   different breakpoint or a grouped selector setting a different property — e.g. `.hero-heading`
   sets typography at line 306 and is grouped with `.hero-eyebrow` for a shared `margin-inline` at
   314. **No cascade conflicts.**

4. **`!important` count: 30** across 7,887 lines of core CSS (19 + 11). Low enough to indicate the
   cascade is being reasoned about rather than fought.

5. **The architectural boundary holds.** The brief's specific test — is content in data, markup in
   components, behaviour in hooks, styles in stylesheets — passes: **0 components contain literal
   prose of 90+ characters.** All copy lives in `src/data/`.

6. **One module-scope `let`** exists in production: `CalendlyEmbed.tsx:36`,
   `let scriptPromise: Promise<void> | null = null`. This is a deliberate cross-mount singleton so
   the third-party script loads exactly once, and the file documents why, including the failure it
   prevents. Correct pattern, not global mutable state.

7. **Lab CSS does not ship.** Checked the production bundle for eight lab-only prefixes
   (`ecta__`, `rv__`, `olab`, `htl__`, …): only 12 `plab` occurrences, which belong to the
   production personas styles. The `page.dev.tsx` mechanism from `ETB-P1-04` is keeping lab styles
   out as well as lab routes.

8. **Magic numbers in `useWorkScroll`** — the brief calls these out specifically. The only bare
   constant is `LERP_SPEED = 0.08`, which is named, module-scope, and explained. Everything else is
   loop bookkeeping. No hardcoded dimensions.

9. **Comments that contradict behaviour** — the brief lists this as a defect class. I found the
   opposite: comments here carry *measured evidence*. The `.hero-heading` phone block records
   "measured five lines at 375, in a 261px column against ~349px of content, last line 'meets
   next-gen tech.' with no orphan." That is a comment written by someone who checked.

---

## Prepared changes

### [ ] 1 — Record the CSS bundle baseline `ETB-P10-01`

**File:** `docs/audit-status.md`

Log 321 KB total / 164 KB largest chunk as a measured baseline, with the note that image bytes
dominate and this should be revisited only after `ETB-P4-02`.

- **Risk:** None (documentation).

### [ ] 2 — Add a CSS bundle-size guard

**File:** `tests/audit/audit-regression.spec.ts`

Assert total CSS transferred on `/` stays under a ceiling (~380 KB, above today's 321 KB) so the
bundle cannot drift upward unnoticed as labs and features are added.

- **Risk:** None. Threshold set with headroom so it catches drift, not noise.
- **Verification:** Passes now; fails if a large stylesheet joins the critical path.

---

## Not proposed

**Splitting the 164 KB CSS chunk.** It is the correct long-term move, but it is a Medium-to-Large
refactor of a stylesheet that currently has zero dead rules and zero conflicts — i.e. real
regression risk against a genuinely healthy file, for a fraction of the byte savings available in
Report 4's image work.

**Consolidating the 30 `!important` declarations.** At this density they signal deliberate override
points, not cascade breakdown. Touching them risks the layout for no measurable gain.
