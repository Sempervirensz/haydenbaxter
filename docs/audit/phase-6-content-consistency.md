# Report 6 — Content & UX Consistency (Brief Phase 9)

**Date:** 2026-08-26 · **Against:** commit `15f4e7b`

> The brief is explicit here: *"Do not rewrite content yet. Report the problem first."* Nothing in
> this report changes a word. Every proposal below is a prepared change awaiting approval, and the
> ones touching voice are marked so you can reject them without rejecting the structural fixes.

## Scope

**Exercised:** 2,230 lines of production content across 13 `src/data/*.ts` files (lab data
excluded) — terminology, dates, numeric claims, duplicated strings, dead CTAs, placeholder text,
hedging language; heading structure on every production route; where credibility evidence actually
sits in the reading order.

**Not exercised:** tone-of-voice judgement (out of scope by your instruction); factual verification
of biographical claims — I cannot confirm employment history, and have not tried.

---

## A correction I owe you

In my earlier credibility assessment I said the site has **"no employer names anywhere."** That was
wrong, and I should have grepped before asserting it.

```
about.ts:11            "…companies including Nike and Disney…"
personas.ts:64         "Led Nike and Converse global sourcing initiatives…"
consultingPaths.ts:183 "Across Aosom, Disney, and Three Tree…"
```

Nike, Disney, Converse, Aosom and Three Tree are all named. The real finding is different — and
worse in a way, because it means the material exists and is being wasted. See `ETB-P9-02`.

---

## Findings

### [ETB-P9-01] `/emerging-tech-builds` has no `<h1>` at all

- **Severity:** **P2** · **Confidence:** **High (confirmed)** · **Area:** SEO + Accessibility
- **Location:** `src/app/emerging-tech-builds/page.tsx`

**Problem**
```
headings on /emerging-tech-builds:
  h1 count: 0
```
The page a consulting buyer is sent to for evidence, and the second-most-important route in the
sitemap, has no top-level heading. Google uses `h1` as a primary relevance signal; screen-reader
users navigating by heading get no entry point; WCAG 2.4.6 (Headings and Labels) is weakened.

The `<title>` is correct ("Selected AI Work | Hayden Baxter") — this is a document-structure gap,
not a metadata one, which is exactly why a metadata-only SEO check missed it in round 1.

**Remediation:** promote the existing intro line to an `h1`, or add one. **Complexity:** Small

---

### [ETB-P9-02] Every employer name sits behind the card gate, roughly 20 screens down

- **Severity:** **P2** · **Confidence:** **High** · **Area:** Credibility
- **Location:** `src/app/page.tsx:32-43` — `AboutSection`, `PersonasSection` are inside `<SoftLockGate>`

**Problem**
Nike, Disney, Converse, Aosom and Three Tree appear only inside `AboutSection`, `PersonasSection`
and `consultingPaths` — all rendered **inside** the soft-lock gate, on a 21,174 px page. A visitor
reaches them only by flipping four cards and then scrolling roughly twenty screens.

**Why it matters**
The brief gives the recruiter 45 seconds and asks whether they can determine *"what companies he
has worked for."* Today: no — not because the answer is missing, but because it is the furthest
thing from the entry. These are the strongest credibility assets on the site and they are the
least reachable.

**Remediation:** surface one line of employer proof above the gate. This is a positioning decision,
so it is proposed as an option below, not applied. **Complexity:** Small

---

### [ETB-P9-03] The same section has three different names, one of which is the URL

- **Severity:** **P3** · **Confidence:** **High (confirmed)** · **Area:** Consistency

**Evidence**
```
URL:         /emerging-tech-builds
<title>:     Selected AI Work | Hayden Baxter
nav label:   Work
codebase:    "Emerging Tech Builds" ×13   "Selected AI Work" ×10   plus 4 casing variants
```
Commit `35f4abd` renamed the section to "Selected AI Work" but the route, and half the codebase,
still say "Emerging Tech Builds."

**Why it matters**
A visitor who notices the URL sees a different product name than the page they are reading. It is
a small thing that reads as unfinished — and the brief lists "inconsistent terminology" and
"mismatched labels" explicitly.

**Remediation:** decide the canonical name. Changing the URL costs a redirect (`vercel.json`
already carries 17, so the pattern exists); leaving it costs the inconsistency. Recommend keeping
the URL and aligning the internal vocabulary, since the URL is indexed and linked.
**Complexity:** Small (vocabulary) / Medium (URL change + redirect)

---

### [ETB-P9-04] The LinkedIn URL is hardcoded in two files

- **Severity:** **P4** · **Confidence:** **High** · **Area:** Maintainability
- **Location:** `src/data/connect.ts:9`, `src/data/workTogether.ts`

One will eventually be updated and the other missed. `connect.ts` already exists as the single
source of truth for contact links.

**Complexity:** Small

---

## Suspicious but actually fine

1. **No dead CTAs.** Scanned every `href`, `cta` and `label` in production data for `null`, `""`
   and `"#"` — none. (`RESUME_HREF = null` is deliberate and already tracked as `ETB-P2-03`; the
   UI degrades to "Request the resume" by design rather than rendering a dead link.)

2. **No placeholder text.** No lorem, no TODO, no FIXME, no HACK anywhere in shipped code.

3. **Hedging language is near-absent** — the only hit across 2,230 lines is `leverage` ×5, and in
   context it is used literally. For a consulting site this is unusually disciplined; the copy says
   what things do.

4. **Dates are internally consistent.** 2012, 2016, 2022, 2023–2024, 2026 — a coherent timeline,
   no contradictions, nothing stale-looking.

5. **The numeric claims are specific and modest** — "8+ years across Asia" appears in both the
   About prose and the Consulting timeline, and they agree. No inflated round numbers.

6. **Duplicated strings across data files: 2**, one of which is a false positive from my regex
   catching a code fragment. Only the LinkedIn URL is a genuine duplicate.

---

## Prepared changes

### [ ] 1 — Add an `<h1>` to `/emerging-tech-builds` `ETB-P9-01`

**File:** `src/app/emerging-tech-builds/page.tsx`

Promote the existing intro sentence ("I understand AI. I understand business…") to `h1`, or add a
visually-hidden `h1` if the design should not gain a visible heading. Prefer the visible option —
the page currently opens with body text where a title belongs.

- **Risk:** Low. May need a type-scale adjustment so it does not read as oversized.
- **Verification:** `h1 count === 1` on that route; heading order still never skips; screenshot at
  DPR 2 to confirm the visual weight is right.
- **Note:** this text is also the 3.98:1 contrast failure in Report 3 — fix both together.

### [ ] 2 — Align the internal vocabulary on one name `ETB-P9-03`

**Files:** ~23 occurrences across `src/data/*.ts` and `src/components/**`

Keep the URL `/emerging-tech-builds` (indexed, linked, and carrying a redirect cost to change).
Align user-facing strings on **"Selected AI Work"**, and leave route/file identifiers alone.

- **Risk:** Low — string-level, no structural change.
- **Verification:** No user-facing "Emerging Tech Builds" remains; route unchanged; matrix green.

### [ ] 3 — Single-source the LinkedIn URL `ETB-P9-04`

**Files:** `src/data/workTogether.ts` imports from `src/data/connect.ts`

- **Risk:** None.

### [ ] 4 — ⚠️ VOICE: surface employer proof above the gate `ETB-P9-02`

**File:** `src/components/HeroSection.tsx` or the entry guidance block

**This one changes what a visitor reads first, so it is yours to decide.** Three options, no
recommendation forced:

- **(a) Minimal** — one mono line under the headline, in the existing label style:
  `NIKE · DISNEY · CONVERSE · WORLDPULSE`
- **(b) Sentence** — fold into the existing hero sub-line: *"Eight years in global sourcing with
  Nike and Disney; now building AI systems and WorldPulse."*
- **(c) Do nothing** — a legitimate choice if the card gate's discovery experience is the point,
  and you accept that recruiters who do not scroll will not learn this.

- **Risk:** Design risk, not technical. The entry composition was just tuned in `ETB-P1-03`; adding
  a line consumes vertical space that fix reclaimed, so this needs re-verification at 1440×900.
- **Verification:** If approved — re-run the entry-fold measurement across all six widths and
  confirm the instruction and skip link are still above the fold.

---

## Not proposed

**Rewriting any prose for tone or positioning.** The copy is disciplined — specific, low on
hedging, honest about scope. It does not need my voice, and the brief's instruction and yours
agree on this.

**Changing the `/emerging-tech-builds` URL.** The consistency gain is real but smaller than the
cost: an indexed, sitemapped, externally-linkable URL plus a permanent redirect, for a name only
visible in the address bar.
