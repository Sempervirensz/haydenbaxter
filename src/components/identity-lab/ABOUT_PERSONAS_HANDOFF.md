# About + Personas — Handoff (`design/identity-lab`)

Written 2026-09-10. Paste the whole file into a new chat, or read it in place.

---

## Where things are

- **Branch:** `design/identity-lab`, currently at `9e801ca`
- **Worktree:** `.claude/worktrees/identity-lab` — a separate checkout, so the
  shared HEAD in the main working copy is untouched
- **Route:** `/identity-lab` (dev only)
- **Dev server:** `.claude/launch.json` → config named `identity-lab`, port 3051
- **Production: unchanged.** Nothing has been merged or promoted.

**`main` is 4 commits ahead of this branch's base** (`3f60f22` → `06436ec`), all
WorldPulse-panel work from another session. Merge `main` in before doing
anything that touches shared files, and before any promotion.

---

## The problem this exists to solve

The live homepage states Hayden's identity **eight times**. Six are the same
triad (AI · supply chain · WorldPulse) in six different vocabularies: hero
eyebrow, hero heading, Work chapters 01–04, the three "Let's work together"
paths, the three Personas cards, and the About paragraph — plus `<title>` and
schema `jobTitle`.

Three structural faults:

1. **Personas paraphrases Work.** Same three areas the Work chapters just spent
   1,700vh showing, restated as job titles in résumé grammar, *after* the CTA.
2. **About renders below Connect.** The page asks for a booking before it
   finishes the introduction.
3. **The connection is never stated.** Nothing says why one person does all
   three. The nearest thing to a thesis — "AI fits best after the operating
   model is clear…" — is buried in `work.ts → supplyChain.bridgeLine`.

The full diagnosis is data, not prose: `src/data/identityLab.ts` →
`RESTATEMENTS` and `FAULTS`. It renders in the lab under treatment `0`.

---

## What has been tried and rejected — do not repeat these

**Round 1 (`a3bf704`) — five long-form concepts.** Throughline, The Route, What
to Bring Me, Plain Text, Provenance. *Rejected: too long and too plain.*
Production's About + Personas is 216 words; these came in at **200–350 words
each**, so the fix was longer than the problem. They were also type on flat
`#0a0a0a` with hairlines, next to a site whose Work chapters are full-bleed
photography and a physical CD player on blue velvet.

**Round 2 (`9e604c8`) — five short, material concepts.** Statement, Triptych,
Plate, Margin, Reveal. Capped at 60 words each, built on real assets (the
consulting night coast, the Pacific supply-chain map, the four product marks,
the DYMO emboss on blue velvet, the Caveat hand). *Rejected: "none of them
really land."* In hindsight several were variations on "short text over a hero
image", and Triptych was structurally the Personas grid again.

**Round 3 (`e54210e`) — the career arc in prose, un-annotated.** Superseded, not
rejected — round 4 is this plus emphasis and depth.

**The meta-lesson:** rounds 1 and 2 both designed a *section* — a heading, a
composition, a grid. That was the mistake.

---

## What the research found

Sites that share Hayden's shape (one person, several credible domains,
commercial intent) **do not have an About section**:

| Site | Identity length | How range is handled |
|------|-----------------|----------------------|
| [rauno.me](https://rauno.me) | 1 sentence | An index of work types. The index *is* the About. |
| [vanschneider.com](https://vanschneider.com) | 2–3 sentences | **Closest structural twin** — one person, a studio, three ventures, photography-led. Ventures named inline in the bio; galleries carry the rest. |
| [brianlovin.com/about](https://brianlovin.com/about) | ~180 words | Reverse-chronological prose. "Before that…" turns range into an arc. |
| [nadia.xyz](https://nadia.xyz) | ~25 words | A method statement. No titles at all. |
| [stephango.com](https://stephango.com) | zero job titles | Credibility from the archive alone. |

Also checked: Awwwards / Godly portfolio galleries. **Not useful here** — they
are creative-technologist showreels, and copying that energy pushes toward
gimmick, which is the opposite of the credibility this site needs.

---

## Current state — round 4 (`9e801ca`)

**One format, three treatments over identical copy**, so each comparison
isolates one variable:

| | Treatment | What changes |
|---|---|---|
| 00 | Shipping today | Production's **real** `AboutSection` + `PersonasSection`, with a marker where Connect currently splits them |
| 01 | **Plain** | Bolded emphasis only. No interaction. |
| 02 | **Deep** | Same words; five terms open one supporting detail each. *Currently the strongest.* |
| 03 | **Ground** | Treatment 02 over the consulting night-coast photograph |

The copy is a four-beat arc — triage, origin, the AI turn, the thesis — at
**~150 words** against production's 216. It returns to the present at the end on
purpose: a pure reverse chronology reads as a job history.

**Paragraph one triages three audiences** (recruiters, consulting buyers,
WorldPulse customers) by naming all three surfaces. The five term details are
each addressed to one audience, labelled on screen.

**Two tiers of emphasis:** `em` (bold, inert) and `term` (dotted gold, opens a
detail). Both live in the copy as data — `ARC` in `src/data/identityLab.ts`.

---

## Hard constraints — violating any of these is a regression

- **Positioning guardrail** (`workTogether.ts`): Hayden is a founder who takes
  selective consulting work. Never phrase anything as job-seeking — no "hire
  me", "open to work", "looking for a job", "available for employment".
  Targeting recruiters means making the *record* legible, not signalling
  availability. A test asserts this.
- **Fact discipline:** every claim must already exist somewhere in the repo,
  cited inline. Nothing invented — no dates, titles, metrics, or clients beyond
  what the site already says.
- **Labs are `page.dev.tsx`.** As plain `page.tsx` they ship to production and
  become indexable. Also add the route to `NON_PUBLIC_PREFIXES` in
  `src/data/site.ts`.
- **DM Serif Display is loaded at weight 400 only.** `<strong>` in the serif
  lead paragraph renders as faux bold or as nothing. Emphasis only works in the
  sans paragraphs. Measured, not assumed.
- **Never bare `git stash`** — the stash stack is shared across worktrees and
  other sessions.
- **Stop the dev server before `npm run build`.** Two writers on the same
  `.next` produces a prerender error on `/identity-lab` that looks like a
  routing bug and is not.
- **The Browser pane is unreliable here.** When hidden it reports a 2px
  container and throttles timers, so container queries and any `setTimeout`
  loop misreport. Verify with Playwright.
- **Two other sessions have adjacent worktrees** — `codex/about-identity-lab`
  and `codex/current-site-credibility-lab`. One writer at a time.

---

## What is still open

1. **Pick a treatment.** 01 vs 02 is emphasis alone; 02 vs 03 is material alone.
   Current recommendation is **02 Deep** — Plain leaves each audience wanting
   more, and Ground's scrim has to be heavy enough that the photograph is mostly
   darkness, while also reusing the Consulting chapter's own ground.
2. **Is prose right at all?** The user has now rejected ten concepts across two
   rounds; the arc has not been rejected but has not been endorsed either.
   `rauno.me`'s "one sentence + an index" is the strongest untried alternative,
   and the Work chapters already *are* an index.
3. **Whether About should exist as a section at all.** The research says the
   closest analogues attach identity to the hero or nav instead. That was
   offered and not chosen, but it was never prototyped.
4. **Promotion plan, if a treatment wins.** The section list each treatment
   frees is in the lab's readout (`moves`). Every treatment agrees on two
   changes independent of which wins: **move About above Connect**, and
   **delete Personas**.
5. **Photography.** Hayden's available portraits are travel snapshots, not
   shots made for this. Any treatment leaning on a portrait wants a photograph
   that does not exist yet.

---

## How to run and verify

```bash
# from .claude/worktrees/identity-lab
npm run check          # tsc + asset refs + type-scale floors
npm run build          # STOP the dev server first
```

Dev server: start the `identity-lab` config from `.claude/launch.json`
(port 3051), then open `http://localhost:3051/identity-lab`. Keys `0`–`3`
switch treatments; `Page` / `390px` switches the frame width.

`npm run lint` is **non-functional repo-wide** — there is no ESLint config or
dependency on `main`, so `next lint` drops into an interactive setup prompt.
This is pre-existing, not caused by this branch.

There is no committed Playwright spec for this lab; the suite used during
development was scratch. Ten checks were run and passed: identical copy across
treatments, each credibility name appearing exactly once, paragraph-one audience
triage, the no-job-seeking guardrail, all five details present in markup at
once, prose not moving more than 1px when a detail opens, keyboard +
`aria-expanded` + ESC, no operable terms in Plain, no horizontal scroll at 390
and 1440, and nothing animating under reduced motion. **Rewrite these before
promoting anything.**

---

## Files on this branch

```
src/data/identityLab.ts                        diagnosis + the arc + term details + metadata
src/components/identity-lab/
  IdentityLab.tsx                              shell, switcher, frame, live word meter, readouts
  identity-lab.css                             lab chrome + reading column + emphasis + detail slot
  README.md                                    the design argument
  ABOUT_PERSONAS_HANDOFF.md                    this file
  concepts/
    Prose.tsx                                  the arc; `deep` / `ground` props select the treatment
    parts.tsx                                  full-bleed art + scrim
src/app/identity-lab/page.dev.tsx              dev-only route
```

Touched outside the lab: `src/data/site.ts` (one noindex prefix) and
`src/data/labsRegistry.ts` (one hub entry). Deleting the paths above and
reverting those two entries removes the experiment completely.
