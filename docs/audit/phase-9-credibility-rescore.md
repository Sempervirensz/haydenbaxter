# Report 9 — Credibility Re-Score & Round-2 Summary (Brief Phase 8)

**Date:** 2026-08-26 · **Against:** commit `15f4e7b`, live `www.haydenbaxter.com`

> Final report. Re-runs the three personas now that the other eight phases are complete, and
> supplies the round-2 scorecard. **I wrote the fixes being scored here**, so every number below is
> tied to measured evidence rather than my judgement of my own work.

---

## Coverage: what round 2 actually closed

| Phase | Round 1 | Round 2 |
|---|---|---|
| 1 Ground truth | Done | Done |
| 2 Adversarial browser | ~50% | **Done** — CD machine attacked five ways |
| 3 Responsive | ~85% | **Done** — 320 + 1024 added |
| 4 Performance | ~35% | **Done** — CPU × network throttling, frame rates |
| 5 Accessibility | ~50% | **Done** — contrast measured for the first time |
| 6 Security | ~85% | **Done** — advisories assessed for reachability |
| 7 SEO | ~80% | **Done** — per-route, not just homepage |
| 8 Credibility | Done | **Re-run** |
| 9 Content | ~10% | **Done** — 2,230 lines reviewed |
| 10 Codebase | ~40% | **Done** — 620 selectors cross-referenced |
| 11 Failure injection | ~10% | **Done** — 13/13 scenarios |

**New findings: 11.** Two of them (`ETB-P6-01`, `ETB-P11-01`) are live defects that round 1's
methodology structurally could not have found.

---

## Recruiter Red Team — 45 seconds, 1440×900

**Second 0–1.5:** Headline renders (measured 1,515 ms live). No black screen — the splash is gone.
**Seconds 1.5–20:** Clear value proposition. Four face-down cards, instruction and skip link now
above the fold. Nav offers Work / About / Connect / Journal / Book a Call.
**Seconds 20–45:** They flip cards, click skip, or leave.

| Question | Round 1 | Now |
|---|---|---|
| Who is Hayden? | Partly | Partly — headline only, no photo above the fold |
| What does he do? | Yes | **Yes** — the headline is genuinely strong |
| What role does he want? | No | **No** — still never stated |
| What has he built? | After the gate | After the gate |
| What companies? | *"No"* — **I was wrong** | **Nike, Disney, Converse — but ~20 screens down** (`ETB-P9-02`) |
| How to contact? | Yes | **Yes** |
| Resume? | **No** | **No** (`ETB-P2-03`, Blocked on you) |

**The correction matters.** I previously told you there were no employer names on the site. There
are — Nike, Disney, Converse, Aosom, Three Tree. They are in `about.ts`, `personas.ts` and
`consultingPaths.ts`, all behind the card gate. The problem was never missing evidence; it is
evidence placed where a 45-second visitor cannot reach it.

**Verdict:** materially improved on speed and clarity. Unchanged on the two things that decide a
recruiter outcome: **no resume, no stated role.**

---

## Engineering Manager Red Team

Now the strongest of the three, and the evidence is in this audit's own data:

- **Zero dead CSS classes out of 620.** On a 20,140-line stylesheet with a long experimental
  history.
- **Zero prose leaking into components** — the content/markup boundary genuinely holds.
- **Comments carry measurements, not intentions** — e.g. *"measured five lines at 375, in a 261px
  column… last line 'meets next-gen tech.' with no orphan."*
- **The CD state machine is path-independent by construction** and survived five attacks.
- **The modal restores the previous `body` overflow** rather than blindly resetting — it survived
  8 rapid open/close cycles with no stuck scroll.
- **39.9 fps** through the heaviest scroll interaction at 4× CPU throttle.

What an EM would still flag: `npm audit` prints "4 high" (harmless here, but they will not read the
reachability analysis), and 27 tests are currently red (`ETB-P11-01`).

---

## Consulting Buyer Red Team

| Question | Answer |
|---|---|
| What can he do for me? | **Yes** — five named systems |
| Who is it for? | Partly — implied, never stated as an ICP |
| What outcomes? | **Weak** — statuses are "Production / In Development", which is build state, not outcome |
| What evidence? | **Good** — real screenshots and demo stats |
| What next? | **Yes** — Book a Call, well implemented |

**New trust reducers found this round:** the evidence page has **no `<h1>`** (`ETB-P9-01`), and its
share preview is **the worst on the site** — a large-image card with no image and the homepage's
title (`ETB-P7-01`). The page a buyer is most likely to be *sent* is the one whose link looks
broken.

---

## Round-2 Scorecard

Scored against measured evidence. Round 1 in brackets.

| Category | Score | Assessment |
|---|---|---|
| Functional Reliability | **88** [82] | Survived 13/13 failure scenarios and every scroll attack. −12 for 27 red tests. |
| Mobile Experience | **72** [61] | No overflow at any width incl. 320. −28 for 5.72 MB initial and 42 s on Fast 3G. |
| Performance | **58** [38] | 14.75→4.05 MB desktop, 241 forced layouts→0, 39.9 fps throttled. Still 1.06 MB of avoidable PNG. |
| Accessibility | **70** [68] | Modal, alt text, reduced motion all correct. −30 for a Level A skip-link failure and 5 contrast misses now actually measured. |
| Security & Privacy | **62** [74] | **Down.** Strong CSP, zero XSS surface — but 22.3 MB of personal photos are live. |
| SEO & Sharing | **68** [71] | **Down.** Sitemap and homepage excellent; 6 routes have broken share cards. |
| UX | **78** [63] | Entry fixed, splash gone, gate reachable. −22 for gate re-locking on reload. |
| Visual Polish | **90** [88] | Verified by per-pixel diff at DPR 1/2/3 through the WebP work. |
| Maintainability | **74** [58] | 620/620 selectors live, boundaries hold, matrix exists. −26 for red tests and undeclared baselines. |
| Recruiter Effectiveness | **56** [52] | Faster, clearer. Still no resume, no stated role. |
| Consulting Effectiveness | **64** [66] | **Down.** Evidence page has no h1 and the worst share card. |
| **Overall Launch Readiness** | **72** [64] | |

**Two scores went down, and that is the point.** Security and SEO fell because round 2 *looked
harder*, not because the site got worse. A rising-numbers report after the auditor fixed everything
himself would be the least trustworthy possible outcome.

---

## Top 10 by ROI — `impact × probability × visibility ÷ effort`

| # | Fix | ID | Effort | Why here |
|---|---|---|---|---|
| 1 | Remove the live personal photos | `P6-01` | S | Only finding that is a live privacy exposure. 100% probability — it is serving now. |
| 2 | Restore the 27 red tests | `P11-01` | S | Your safety net is down; every later fix is unverified without it. |
| 3 | Add a skip-to-content link | `P5-01` | S | The only Level A failure. Two lines. |
| 4 | Convert the last two PNGs | `P4-02` | S | ~5 s off Fast 3G. Method already proven here. |
| 5 | Fix 6 routes' share cards | `P7-01` | S | Every share of the evidence page currently looks broken. |
| 6 | Add an `h1` to the evidence page | `P9-01` | S | SEO + a11y, one element, on the page that matters. |
| 7 | Raise 3 text colours to AA | `P5-02` | S | Token-level; includes prose a buyer reads. |
| 8 | Persist the gate across reload | `P11-03` | S | Stops punishing returning visitors. |
| 9 | Surface employer proof above the fold | `P9-02` | S | Highest recruiter impact — but a design decision, so it is yours. |
| 10 | Add a no-JS route into the work | `P11-02` | S | One footer link recovers all content when JS fails. |

Items 1–8 are mechanical. **Item 9 is the one that would most change a recruiter outcome**, and the
one I will not decide for you.

---

## Launch Recommendation

# SHIP AFTER P1 FIXES

**One P1 remains: `ETB-P6-01`** — 22.3 MB of personal camera originals, publicly served,
crawlable, confirmed live. That is a privacy exposure, not a quality issue, and it is a fifteen-
minute fix.

**Why not DO NOT SHIP:** the site is already live and materially good. It survived 13/13 hostile
conditions, every scroll attack, holds 39.9 fps throttled, has zero XSS surface, zero dead CSS,
and a correct modal. The engineering is sound.

**Why not SHIP:** publishing someone's personal photos by accident is exactly the "fail
reputationally" case the brief's central question asks about.

**Sequence:** fix `P6-01` today. Then items 2–8 — all Small, roughly a day. Then decide item 9 and
supply the resume, which together are worth more to a recruiter than everything else on the list.

---

## Honest limits

- **Real Safari and iOS were never tested.** Playwright's WebKit is the engine, not the browser.
- **No real screen reader.** Structure was reasoned from the accessibility tree, not heard.
- **Touch momentum and fling were not tested** — the most plausible remaining way to stress a
  scroll-linked interaction.
- **Biographical claims were not verified.** I checked internal consistency, not truth.
- **Five harness artifacts were caught and discarded** during round 2 (WebKit HTTPS upgrade,
  Firefox cookie errors, `route.abort()` masking, a gradient-blind contrast probe, a lerp settle
  window too short). Each would have been a false finding. That rate is itself a caution: on this
  site, automated output needs a cause before it needs a severity.
