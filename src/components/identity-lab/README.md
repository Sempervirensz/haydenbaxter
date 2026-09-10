# Identity Lab — `/identity-lab`

Five directions for **one pair of sections**: `About` and `Personas`, and the
redundancy those two create with the rest of the homepage. Production is
untouched.

## The problem being solved

The live homepage states Hayden's identity eight times. Six of those are the
same triad — AI, supply chain, WorldPulse — in six different vocabularies:

| # | Where | Vocabulary |
|---|-------|-----------|
| 1 | Hero eyebrow | navigation |
| 2 | Hero heading | promise |
| 3 | Card deck | character portrait (a fourth vocabulary, not the triad) |
| 4 | Work chapters 01–04 | work |
| 5 | Let's work together | routes |
| 6 | Personas | job titles |
| 7 | About | paragraph |
| 8 | `<title>` + schema `jobTitle` | search |

Three structural faults follow from that:

- **Personas paraphrases Work.** Its three areas are the three the Work chapters
  just spent 1,700vh showing, restated as titles, in résumé grammar, *after* the
  CTA.
- **About renders below Connect.** The page asks for a booking before it
  finishes the introduction.
- **The connection is never stated.** Nothing says why one person does all
  three. The nearest thing to a thesis — *"AI fits best after the operating
  model is clear…"* — is buried in `work.ts → supplyChain.bridgeLine`.

## What the lab renders

`00 Shipping today` renders production's **real** `AboutSection` and
`PersonasSection` components, in production's order, with a marker showing
where Connect currently separates them. A redrawn baseline would hide the exact
thing under review.

`01 Plain` and `02 Ground` are **one format in two treatments over identical
copy**. The words do not change between them, so the comparison can only ever be
about whether the photograph earns its place.

## The format, and where it comes from

Rounds one and two both designed a *section* — a heading, a composition, a grid.
Research into the sites that share Hayden's shape says none of them has one:

| Site | Identity length | How range is handled |
|------|-----------------|----------------------|
| [rauno.me](https://rauno.me) | 1 sentence | An index of work types below it. The index is the About. |
| [vanschneider.com](https://vanschneider.com) | 2–3 sentences | Closest structural twin — one person, a studio, three ventures. Ventures named inline; full-bleed galleries carry the rest. |
| [brianlovin.com/about](https://brianlovin.com/about) | ~180 words | Reverse-chronological prose. "Before that…" turns range into an arc. |
| [nadia.xyz](https://nadia.xyz) | ~25 words | A method statement, no titles at all. |
| [stephango.com](https://stephango.com) | no job titles | Credibility from the archive alone. |

Brian Lovin's is the format built here, because **Hayden's credibility is the
order**: Mandarin, then the factory floor, then Fortune 100 operations, then AI.
Prose carries an order. A grid of cards turns the same facts into a résumé.

The arc is four beats — now, before, how he got there, and what it means for the
work today. It deliberately returns to the present at the end: a pure reverse
chronology reads as a job history, and the return is what makes it an argument
about how he works.

**145 words**, against production's 216. The lab measures the rendered count
live, in the switcher.

## What is deliberately absent

- **No section heading.** The first three words are "I'm Hayden."
- **No DYMO fact strip.** Rounds one and two hung Mandarin / Nike / Disney under
  everything. Here the prose names them in sequence, so a strip would repeat the
  section's own sentences three lines later — the exact habit this lab exists to
  break. A test asserts each name appears *exactly once*.
- **No cards, no grid, no disclosure, no interaction.**

Rounds one and two are preserved in `a3bf704` and `9e604c8`.

## Facts

`identityLab.ts` carries only facts that already exist elsewhere in this repo,
cited inline to the file they come from. Nothing is invented — no dates, titles,
metrics, clients, or credentials beyond what the site already says out loud.
The interpretive sentences (the ones stating what a fact *means*) are new,
because that is the actual deliverable.

`02 Ground`'s photograph carries an empty `alt` and is `aria-hidden`, which is
correct: it depicts nothing the page is claiming. It is also already the
Consulting chapter's ground — worth watching for whether reuse reads as a motif
or as a repeat.

## Files

```
src/data/identityLab.ts                     diagnosis + the arc + treatment metadata
src/components/identity-lab/
  IdentityLab.tsx                           shell, switcher, frame, word meter, readouts
  identity-lab.css                          lab chrome + the reading column
  concepts/
    parts.tsx                               full-bleed art + scrim (all that is left)
    Prose.tsx                                the arc; `ground` prop selects the treatment
src/app/identity-lab/page.dev.tsx           dev-only route
```

The 390px frame is a real narrow-width test: the one container query in the
concept fires against the frame, not the viewport. The baseline is the
exception — production's CSS is viewport-driven and does not reflow inside the
frame, and the lab says so on screen rather than pretending otherwise.

Touched outside the lab: `src/data/site.ts` (noindex prefix) and
`src/data/labsRegistry.ts` (hub entry). Six lines. Deleting the four paths above
and reverting those two entries removes the experiment completely.

## Keyboard

`0` selects the baseline, `1`–`2` select a treatment. Neither treatment has any
interaction at all. The switcher is a toolbar of
`aria-pressed` buttons, not a tablist — the stage below is a page region, not a
tabpanel, and labelling it as one would promise a keyboard model this does not
implement. Every control clears the 44px tap floor. Nothing animates under
`prefers-reduced-motion`; nothing animates on scroll at all.

## Not indexed

`page.dev.tsx`, so the route only exists under `next dev` (see `pageExtensions`
in `next.config.ts`) and is absent from the static-export production build.
`/identity-lab` is also in `NON_PUBLIC_PREFIXES`, so `robots.txt` disallows it
either way, and the page sets `robots: { index: false, follow: false }`.
