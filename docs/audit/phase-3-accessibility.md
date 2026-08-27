# Report 3 — Accessibility Completion (Brief Phase 5)

**Date:** 2026-08-26 · **Against:** commit `15f4e7b`, local production export

> Round 1 covered headings, alt text, keyboard, focus, modals and reduced motion. It never
> measured **a single contrast ratio**, despite contrast being on the brief's list. That is the
> centre of this report.

## Scope

**Exercised:** computed contrast for every visible text node on `/`, `/emerging-tech-builds`,
`/blog`, `/privacy` (alpha-composited, gradient-aware, AA thresholds by size and weight);
skip-to-content; landmarks; `h1` count; live regions; carousel semantics and motion; iframe
labelling; `lang`; marquee and video under `prefers-reduced-motion`.

**Not exercised:** real screen readers (VoiceOver / NVDA / JAWS) — structure is reasoned from the
accessibility tree, not heard. Windows High Contrast Mode. Voice control. The brief's instruction
*"do not simply run an automated scanner"* is honoured: every finding below was reasoned to a
cause, and one automated result was rejected as a harness artifact.

---

## Findings

### [ETB-P5-01] No skip-to-content link on a 21,174px page — WCAG 2.4.1, Level A

- **Severity:** **P2** · **Confidence:** **High (confirmed)** · **Area:** Accessibility
- **Location:** `src/app/layout.tsx` / `src/components/Navbar.tsx`

**Problem**
There is no mechanism to bypass the repeated navigation block. Measured: `skipToContent: false`.
Tab order on every page starts with five nav links before any content.

**Why it matters**
This is the one **Level A** failure in the report — the lowest bar WCAG sets. It matters more here
than on a typical site because the homepage is 21,174px (23.5 screens) after the gate; a keyboard
or switch user pays the nav toll on every load, and there is no way past it.

**Remediation:** a visually-hidden `<a href="#main">` that becomes visible on focus, as the first
focusable element. **Complexity:** Small

---

### [ETB-P5-02] Five text elements below WCAG AA contrast

- **Severity:** **P2** · **Confidence:** **High (measured)** · **Area:** Accessibility

**Evidence** — alpha-composited against the true painted background, AA thresholds by size/weight:

| Ratio | Needs | Size | Element | Text |
|---|---|---|---|---|
| **3.98:1** | 4.5 | 15px | ETB intro paragraph | "I understand AI. I understand business…" |
| **3.06:1** | 4.5 | 12.2px | `.card-caption__title` | "QUEEN OF VISION" |
| **4.08:1** | 4.5 | 11.6px | `.wl-c2__num` | "01" |
| 2.77:1 | 3.0 | 18px | `.etb-bar__chevron` | "›" |
| 3.47:1 | 3.0 | — | `.wt__chev` | "›" |

`/blog` and `/privacy` are **clean — zero failures.**

The first three are real text failures. The two chevrons fall under 1.4.11 (non-text contrast,
3:1); both are paired with adjacent text that carries the meaning, so they are the weakest items
here — but 2.77:1 is still under the bar for a control affordance.

**The most consequential is the 3.98:1 paragraph.** It is the ETB intro — prose a consulting buyer
actually reads, on the page that carries the evidence. It misses AA by 0.52.

**Remediation:** raise the alpha/lightness on those three tokens. All are token-level, so the
change is contained. **Complexity:** Small

---

### [ETB-P5-03] Infinite 12s marquee has no pause control (for users who have not set reduced motion)

- **Severity:** **P4** · **Confidence:** **High** · **Area:** Accessibility (WCAG 2.2.2)
- **Location:** `src/components/BrandsCarousel.tsx`; `.brands__track`

**Problem**
The brands carousel runs `scroll-brands 12s` infinitely with no pause/stop control. WCAG 2.2.2
wants a mechanism for moving content that runs longer than 5 seconds.

**Deliberately rated P4, not higher.** The standard mitigation is present and working:

```
no-pref  { anim: "scroll-brands", dur: "12s" }
reduce   { anim: "none",          dur: "0s"  }   ← respected
```

The same is true of the autoplaying video, which is **not rendered at all** under `reduce`. A
`:hover`/`:focus-within` pause would close the remaining gap cheaply, but honouring the OS
preference is the accepted mitigation and this site does it.

**Complexity:** Small

---

## Suspicious but actually fine

1. **A contrast scan initially reported 1.02:1–1.12:1 on the ETB bars — near-invisible text.**
   False. `.etb-bar` paints with `background-image: linear-gradient(rgb(254,254,254)…)` while its
   `background-color` stays `rgba(0,0,0,0)`. My probe only read `background-color`, walked past the
   near-white card, and compared dark text against the dark page ground. Corrected to read gradient
   stops; the bars are fine. **Third harness artifact this session** — the pattern is consistent
   enough to be worth naming: automated a11y output on this site needs a cause before it needs a
   severity.

2. **The Calendly iframe is unlabelled.** It is not: `title="Select a Date & Time - Calendly"`.
   The open item there is `sandbox` (tracked as `ETB-P2-07`), not labelling.

3. **`aria-live` region might be noise.** It carries `"Enter the site. Scroll to explore ↓"` and
   the `"0 of 4 cards flipped"` counter — genuine state changes a screen-reader user needs. Correct
   use.

4. **11 landmark elements looked like landmark soup.** `main`, `nav`, `header`, `footer`, `aside`
   — the repeated `header` elements are section headers inside articles, which is valid. Exactly
   **one `h1`**, and `lang="en"` present.

5. **`.dlab-soft__srOnly` "0 of 4 cards flipped" appeared as clipped text** in an earlier scan.
   That is the intended visually-hidden technique, not clipping.

---

## Prepared changes

### [ ] 1 — Add a skip-to-content link `ETB-P5-01`

**Files:** `src/app/layout.tsx`, `src/app/globals.css`

First focusable element in the document: `<a class="skip-link" href="#main">Skip to content</a>`,
visually hidden until `:focus-visible`, then pinned top-left above the nav. `<main>` already
exists in `page.tsx` and needs `id="main"` plus `tabindex="-1"` so focus lands there.

- **Risk:** Low. Additive; no layout impact when unfocused.
- **Verification:** Tab once from load on every route — first stop is the skip link, it is visible
  when focused, and activating it moves focus into `<main>`. Add as a regression guard across all
  18 matrix projects.

### [ ] 2 — Raise the three failing text tokens to AA `ETB-P5-02`

**Files:** `src/styles/work-details.css` (ETB intro), `src/components/PlayingCard.tsx` /
`CardDeck.tsx` (`textColor`), the `.wl-c2__num` rule

Raise alpha/lightness only — no hue or size changes, so the visual language is untouched. Target
≥4.5:1 measured, not estimated.

- **Risk:** Low-medium. This is a design-forward dark site where muted text is deliberate; the aim
  is the minimum lift that clears AA, verified by re-running the probe.
- **Verification:** Re-run the contrast probe on all four routes; require zero AA failures for
  text. Before/after screenshots at DPR 2 so the change is visible to review.

### [ ] 3 — Lift the two chevrons to 3:1 `ETB-P5-02`

**Files:** `.etb-bar__chevron`, `.wt__chev`

- **Risk:** Very low.
- **Verification:** Same probe; both ≥3:1.

### [ ] 4 — Pause the marquee on hover and focus `ETB-P5-03`

**File:** `src/app/globals.css`

`.brands:hover .brands__track, .brands:focus-within .brands__track { animation-play-state: paused; }`

- **Risk:** Very low, CSS-only.
- **Verification:** Assert `animationPlayState === "paused"` while hovered.

---

## Not proposed

**Restructuring the carousel into an ARIA carousel pattern** (tablist, slide announcements). It is
a decorative logo marquee with `aria-label="Brands worked with"` and `aria-hidden` on the duplicate
track — the correct treatment for decorative repetition. Adding carousel semantics would announce
noise a screen-reader user does not need.

**Screen-reader verification** cannot be done from here and is not claimed. `ETB-P5-01` and
`ETB-P5-02` are both structural/measurable, so they do not depend on it — but a VoiceOver pass on
the real site is still worth an hour of your time before you call accessibility done.
