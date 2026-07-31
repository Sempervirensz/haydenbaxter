# Large-display work — handoff

Branch: `feat/large-display-scaling` (merged with `main`, no divergence)
Status: **paused deliberately**, tree clean, build green.

## Goal

Make the site behave on 1920 / 2560 / 3440 / 3840 without redesigning it or
disturbing mobile and standard desktop, and back that claim with a repeatable
test suite rather than eyeballing.

## Where it got to

Green and committed:

- Fluid scale tokens; `--leading-body` restored (it was swallowed by an
  unterminated comment, so every `line-height: var(--leading-body)` on the site
  had been falling back to `normal`).
- Brand carousel rebuilt on fixed-width slots. Seamless by construction —
  measured zero pixel drift at every viewport. Previously it snapped half a gap
  each cycle and left 2493px of blank canvas at 3840.
- Emerging Tech, Supply Chain and Consulting given large-display shells;
  Supply Chain's dead grid space went 709px → 22px, its globe 920 → 1152px.
- `/privacy` moved onto the scale tokens (it shipped 11.52px text at every
  width, including 4K).
- Playwright suite: 47 tests × 8 viewport projects.

Four real bugs the suite caught that hand-checking had missed:

| Bug | Effect |
|---|---|
| `.cstack__head` had no `pointer-events: none` | Consulting's Back button was **unclickable** — a full-width `z-index: 6` plate sat over it |
| Calendly's magic class kept on the embed host | **Console error on every homepage load**; their auto-scan matched it and split a null `data-url` |
| `.etb-bar__head` has `all: unset` | **No keyboard focus ring**; the only replacement was identical to hover |
| Four ETB detail blocks had no measure cap | Copy ran to ~99 characters per line around 1920 |

## Constraints that shaped the work

- Dark-only, DYMO label system, grounded motion — see `.claude/rules/`.
- **Standard desktop and mobile must not move.** This is why `--text-body-sm`
  and `--text-body-lg` exist: retrofitting `--text-base` onto copy that sat
  *below* it would drag 14px text up and 19px text down, re-setting pages that
  only needed to stop shrinking on large displays. Those tokens keep the laptop
  rendering as their floor.
- Container queries, not viewport queries, inside `.wt` — it is a size
  container, and the mobile Consulting card mounts the same component.

## Baseline recorded

Full 8-viewport run: **309 passed, 26 failed, 41 skipped** of 376, in 15.8m.

**Do not read those 26 as 26 defects.** The same `fhd` project run on its own
is 46/47 green; under the full run it reported 6 failures. Every failure
sampled so far is `Test timeout of 60000ms exceeded`, not a failed assertion —
8 projects × 4 workers competing for a single `serve` instance, with tests that
walk every element on a 45,000px page.

**First job next session is to make the numbers trustworthy**, before treating
any of them as findings: re-run with `--workers=2`, or project-by-project, and
diff against this baseline. Anything that survives that is real.

Worth noting the two that repeat across *both* mobile widths, since a
consistent pattern is likelier to be genuine than a load flake:

- `navigation › nav links reach their sections through the gate`
- `Emerging Tech › the dossier stays inside the shell and does not stretch to empty`

## Next steps

1. **Re-run the baseline with reduced concurrency** and triage what survives.
   430 and 768 have never been checked properly; 768 is the cinematic↔mobile
   handoff and is the most likely place to find something real.
2. **Screenshot review** of Consulting / Supply Chain / Emerging Tech at 1920
   and 3840. Geometry is verified; nobody has actually *looked* at 4K.
3. **Dead CSS** — see below.
4. **Merge to main.** Nothing here has shipped. Two of the four bugs above are
   live user-facing defects.

## Dead CSS — proven, not removed

Deliberately left in place: the selectors are scattered and several share rule
blocks with live ones, so removal is careful surgery with no user-facing gain.
Do it as its own focused pass.

Proven unreferenced (quoted `grep -rl "<name>" src --include="*.tsx"`, plus a
check for template-literal class construction):

| Family | Lines | Note |
|---|---|---|
| `hb-handwriting-lab` | ~27 | globals.css; a background task is already open for it |
| `cns-offerCard` | ~19 | work-details.css |
| `cns-hero` | ~14 | work-details.css |
| `scs-minimalLanding` | ~28 | work-details.css |
| `scs-proof` | ~20 | work-details.css |

**Traps when removing.** `.cns-offerCard__tags` shares a rule with
`.cns-modalBody__tags`; `.cns-pill` shares one with `.cns-badge` and **is
live**. Split grouped selectors rather than deleting whole blocks.

Also note `ConsultingDetail` and its `.cns-photo__*` / `.cns-badge` styles are
**not** dead — they are mounted by lab routes (`scroll-lab/CardContent`,
`CardSizingLab`, `CardLightingLab`), just not by the public site. Deleting them
breaks `/lab/*`.

An earlier pass reported `.cns-modal` and `.cns-badge` as dead. That was wrong:
the grep used an unquoted `--include=*.tsx`, which zsh swallowed, so every
family came back 0. Quote the pattern.

## Test steps

```bash
npx tsc --noEmit && npx tsc --noEmit -p tests/tsconfig.json
node scripts/check-scale.mjs && node scripts/check-assets.mjs
npm run build

npx playwright test                 # all 8 widths, ~15 min
npx playwright test --project=fhd   # 1920 only, ~2.5 min
npx playwright show-report          # browsable results + failure traces
```

The suite builds and serves the static export itself on port 3100. Do not point
it at a dev server: `next dev` compiles per route, and parallel workers queued
behind a 45,000px page turned a 2.6m run into 12.8m with half the assertions
lost to compile latency. `reuseExistingServer` is off because a stale dev server
was adopted once and produced 26 phantom failures.

## Traps that cost real time

Encoded in `tests/helpers.ts` so they need not be rediscovered:

- **Sticky cards report their stuck position.** A scroll target computed from a
  card's rect walks further down the page on every call. Use the chapter's
  `offsetTop`.
- **The globe's ResizeObserver first fires while the soft-lock gate still has
  the column at zero size**, so `compute()` early-returns and the globe sits at
  its 360px `useState` default forever. Dispatch a `resize` before measuring.
- **The marquee images carry no intrinsic size**, so the track measures zero
  until they decode.
- **`1ch` is not `0.5em` in this font** — it is nearer `0.67em`. An earlier
  helper used the 0.5em rule of thumb and reported a correctly-capped 74ch
  column as "99ch".
- **Fast Refresh preserves `useState`.** Measuring a `useState`-driven size
  after editing the component reports the pre-edit value and reads exactly like
  a regression you just caused. Full-reload before measuring.

## Not covered

- Colour contrast and heading order are unaudited (Lighthouse was scoped out).
  The dark aesthetic makes contrast the most likely real finding.
- Physical legibility on a real 32" panel. The viewer scales a 4K frame down to
  fit, which verifies layout, not whether 14px is comfortable at arm's length.
