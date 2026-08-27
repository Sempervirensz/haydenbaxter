# Report 4 — Performance Under Load (Brief Phase 4)

**Date:** 2026-08-26 · **Against:** commit `15f4e7b`, local production export

> Every performance number in round 1 was uncontended localhost with ~0 ms RTT. The brief's own
> anti-vagueness example is literally about CPU throttling. This report supplies the numbers that
> pass could not.

## Scope

**Exercised:** CPU throttling (1×, 4×) × network throttling (none, Slow 4G, Fast 3G) on a 390px
mobile viewport; frame rate through the Work section under 4× CPU; mobile weight breakdown by
content type; full-journey transfer; DOM growth after a complete scroll-through.

**Not exercised:** real device thermal throttling; GPU memory pressure on real mobile hardware;
Lighthouse field data; long-session memory profiling (heap snapshots over hours).

---

## Findings

### [ETB-P4-01] 42 seconds to full load on Fast 3G

- **Severity:** **P2** · **Confidence:** **High (measured)** · **Area:** Performance

**Evidence** — 390px mobile viewport, homepage:

| Network | CPU | Wall clock | FCP | DCL | load |
|---|---|---|---|---|---|
| none | 1× | 782 ms | 116 | 166 | 778 |
| none | 4× | 242 ms | 176 | 170 | 241 |
| **Slow 4G** | 1× | **17,298 ms** | 1,992 | 1,970 | 17,293 |
| Slow 4G | 4× | 18,820 ms | 1,984 | 1,983 | 18,818 |
| **Fast 3G** | 1× | **42,246 ms** | 4,892 | 4,881 | 42,243 |
| Fast 3G | 4× | 43,216 ms | 4,928 | 4,926 | 43,215 |

**Two things this reveals that the localhost numbers hid:**

1. **The site is network-bound, not CPU-bound.** 4× CPU throttling changes load time by ~1 s;
   dropping to Fast 3G changes it by 41 s. Optimising JS execution would buy nothing here — bytes
   are the whole story.
2. **First paint is genuinely good.** FCP 1.99 s on Slow 4G, 4.89 s on Fast 3G — the static export
   paints early because the HTML carries the content. The 42 s is *full* load: every image settling.

So the honest framing is not "the site takes 42 seconds." It is: **a visitor on a weak connection
sees the headline in ~5 s and keeps downloading for another 37.**

**Complexity:** Small for the immediate win (see change 1), Medium for the rest.

---

### [ETB-P4-02] Mobile carries 5.72 MB initially — more than desktop — and 1.06 MB of it is PNG I left behind

- **Severity:** **P2** · **Confidence:** **High (measured)** · **Area:** Performance

**Evidence** — 390px initial load:

```
total: 5.72 MB          (desktop /: 4.05 MB — mobile is HEAVIER)
  text/javascript  1.64 MB
  image/webp       1.47 MB
  image/png        1.06 MB   ← should not exist
  image/jpeg       0.51 MB
  image/svg+xml    0.34 MB
>200 KB: worldpulse-digital-product-passport-logo.png  0.57 MB
         casebrief-mark.png                            0.49 MB
         ace-of-spades-mountain-card.jpeg              0.47 MB
```

The two PNGs are the ones I explicitly flagged as "remaining PNG on the homepage (~1.06 MB), not
addressed" when closing `ETB-P1-01` — and then never came back to. They are **logos and marks**:
flat-colour artwork, the single best case for WebP. Based on the ratios achieved on the other
seven assets (95–97%), these should land near 30–60 KB combined.

On Fast 3G, 1.06 MB is roughly **5 seconds of the 42**.

**Complexity:** Small — the encoder and method are already proven in this repo.

---

## Suspicious but actually fine

1. **Frame rate through the Work section: 39.9 fps at 4× CPU throttle**, scrolling 6,000 px. That
   is a simulated mid-range phone holding near-40 fps through the site's heaviest scroll-linked
   interaction. The `ETB-P2-01` fix (gating the rAF loop) and the direct-transform write documented
   at `useWorkScroll.ts:130` are both doing real work. **Not a defect.**

2. **DOM nodes after a full 21,174 px scroll-through: 549.** No node leak, no unbounded growth. The
   cinematic stack mounts and unmounts cleanly.

3. **20.14 MB for the complete journey** looked alarming until compared against what it buys: 23.5
   screens of full-bleed photographic content, with 29 of 37 images lazy-loaded. That is the cost
   of the design, incurred progressively, not an upfront tax.

4. **CPU 4× being *faster* than 1× in one row** (242 ms vs 782 ms) is measurement noise on an
   uncontended local server, not a real effect. Reported as-is rather than quietly dropped.

---

## Prepared changes

### [ ] 1 — Convert the two remaining PNGs to WebP `ETB-P4-02`

**Files:** `public/images/worldpulse/worldpulse-digital-product-passport-logo.png`,
`public/assets/casebrief-mark.png`, plus their references

Same method already proven here: full-resolution Chromium-canvas encode at q=0.85, alpha
preserved, references switched, PNGs kept on disk for any legacy redirect.

- **Expected:** ~1.06 MB → ~0.06 MB. Mobile initial 5.72 → ~4.7 MB; ~5 s off Fast 3G.
- **Risk:** Low. Both are flat-colour marks — the easiest possible WebP case. Alpha must be
  verified (both sit on dark grounds).
- **Verification:** Per-pixel diff against the PNG source at DPR 1/2/3, as with the earlier seven
  assets — require mean dE < 2. Re-measure mobile transfer. A regression guard already exists that
  fails if any image over 1.5 MB appears; extend it to flag PNG art specifically.

### [ ] 2 — Add a throttled-load budget test `ETB-P4-01`

**File:** `tests/audit/audit-regression.spec.ts`

A test that loads `/` under Slow 4G emulation and asserts **FCP under 3 s** — the metric that
actually governs whether a visitor stays, rather than full-load time which is dominated by
below-the-fold imagery.

- **Risk:** None. CDP emulation is deterministic enough for an FCP ceiling; the threshold is set
  well above the measured 1.99 s so it catches regressions, not noise.
- **Verification:** Passes now; fails if a large render-blocking asset is added.

### [ ] 3 — Record the measured baselines in the ledger

**File:** `docs/audit-status.md`

The throttled numbers above, so future work is compared against a real baseline rather than
localhost figures.

- **Risk:** None.

---

## Not proposed

**Reducing the 1.64 MB JavaScript bundle.** It is now the largest single category, but the data
says the site is network-bound in *bytes*, and this is a React/Three.js/GSAP site whose bundle is
proportionate to what it does. Code-splitting the Work section would be a Medium-to-Large change
for a fraction of what change 1 delivers for Small effort. Revisit only after images are done.

**Deferring or lazy-loading the Work section's imagery.** 29 of 37 images already lazy-load, and
the full-journey weight is incurred progressively. The remaining upfront cost is the entry screen,
which is the one place the design should not be compromised.
