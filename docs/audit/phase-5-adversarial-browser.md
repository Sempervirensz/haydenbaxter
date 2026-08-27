# Report 5 — Adversarial Browser Test (Brief Phase 2)

**Date:** 2026-08-26 · **Against:** commit `15f4e7b`, local production export

> The brief singles this out: *"Specifically attack the scroll-driven CD navigation. Determine
> whether its state machine remains correct when the user does something other than slowly
> scrolling from top to bottom."* Round 1 argued it was safe from the source. This report attacks
> it.

## Scope

**Exercised:** instant scrollbar jumps to four depths · 14 rapid direction reversals · slam to
document end and back to top · 1-pixel creep · in-page history back/forward · 8 rapid modal
open/close cycles with Escape · Escape with nothing open · triple-clicking every gate card three
times over.

**Not exercised:** real touch momentum/fling; trackpad inertia; two-finger swipe navigation;
multi-tab interference.

---

## Findings

**No P0–P2 findings. The CD state machine survived every attack.**

That is a real result rather than a gap, and it has a specific cause worth recording.

### The state machine, attacked

Reference behaviour was captured by scrolling slowly to four depths in the Work section and
recording the disc's computed transform. Each attack then tried to reach the same depths a
different way:

| Attack | Result |
|---|---|
| Instant jump from y=0 to each depth | **Converges to the reference transform** |
| 14 rapid direction reversals, then settle | **Matches reference** |
| Slam to document end → top → target depth | **Matches reference** |
| 1-pixel creep across 40 px | **Matches reference** |
| History back / forward across `#work` | Gate stays open, `y=1102`, no error |
| **Page errors across all attacks** | **Zero** |

**Why it holds.** `getCdState` (`src/hooks/useWorkScroll.ts:20-53`) is a pure function of a single
progress scalar. It accumulates nothing, and it has no notion of direction. There is no state to
desync — any path to a given scroll position produces the same output by construction. Round 1
inferred this from the source; it is now demonstrated.

---

## A false finding I nearly reported

The first run showed two of four probes **not** matching after an instant jump:

```
matches reference: [true, true, false, false]
```

That reads exactly like a fast-scroll desync. It was not. Two causes, both mine:

1. **My settle window was shorter than the lerp's convergence.** `LERP_SPEED = 0.08` means the
   disc approaches its target ~8% per frame; from a distant value that needs well over 1,400 ms.
   Re-run with a 4-second settle: **both probes match.**
2. **The disc was off-screen at those depths** (`top: -2738`, `-5738`), so the
   `IntersectionObserver` gate added in `ETB-P2-01` had correctly *stopped* the loop. The identity
   transform was the fix working, not the machine failing.

Recording this because it is the fourth harness artifact in this audit, and because publishing it
would have manufactured a P1 out of my own instrumentation.

---

## Suspicious but actually fine

1. **8 rapid modal open/close cycles with Escape** — the classic failure here is `body` left with
   `overflow: hidden`, silently killing scroll for the rest of the session. Measured after the
   churn:
   ```
   dialogs remaining: 0
   body.style.overflow: (unset)   ← correctly restored, not stuck
   page scrollable: true
   focus: BUTTON                  ← returned to the trigger
   ```
   `DetailModal.tsx:47-102` saves and restores the previous overflow value rather than blindly
   resetting to `""`. That is the careful version, and it survives being hammered.

2. **Escape with nothing open** — no effect, page remains scrollable. No stray global handler.

3. **Triple-clicking all four gate cards, three rounds (36 clicks)** — the gate opens correctly
   (`scrollHeight` 909 → >3000). No double-toggle, no flip-flop, no stuck state.

4. **In-page history navigation** — back/forward across the `#work` hash keeps the gate open and
   throws no error. (Note: a full *reload* does re-lock the gate — that is `ETB-P11-03` in Report 2,
   a different mechanism.)

---

## Prepared changes

### [ ] 1 — Lock in the CD state machine's path-independence as a test

**File:** `tests/audit/audit-regression.spec.ts`

A test that records the disc transform after a slow scroll to a depth, then asserts an instant
jump to the same depth converges to the identical transform — with a settle window derived from
`LERP_SPEED` rather than guessed, and an on-screen assertion so the IntersectionObserver gate
cannot mask the result.

This guards a property that is currently true *by construction* but would silently break the first
time someone introduces accumulated state into `useWorkScroll` — which is exactly the kind of
change that looks harmless in review.

- **Risk:** None. Test-only.
- **Verification:** Passes now; fails if `getCdState` gains direction- or history-dependence.

### [ ] 2 — Guard the modal's overflow restoration

**File:** `tests/audit/audit-regression.spec.ts`

Cycle a modal open/closed 8 times, then assert `document.body.style.overflow` is not `hidden` and
the page still scrolls.

- **Risk:** None.
- **Verification:** Passes now; fails if the save/restore in `DetailModal` regresses to a blind
  reset.

---

## Not proposed

Nothing. This phase produced no defects requiring a code change — the two prepared items are tests
that pin down behaviour which is currently correct but fragile to future edits.

**An honest note on scope:** real touch momentum, trackpad inertia and fling gestures were not
tested, and they are the most plausible remaining way to stress a scroll-linked interaction. A
Playwright `scrollTo` is not a fling. Given the machine is path-independent by construction, I
expect it holds — but that is reasoning, not evidence, and it is the same kind of reasoning that
made round 1 incomplete.
