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

Three treatments over **identical copy**, so each comparison isolates one
variable:

| | Treatment | What changes |
|---|---|---|
| 01 | **Plain** | Bolded emphasis only. No interaction. |
| 02 | **Deep** | Same words; five terms open one supporting detail each. |
| 03 | **Ground** | Treatment 02 over a photograph. |

01 → 02 is emphasis alone. 02 → 03 is material alone. A test asserts all three
render the same paragraphs.

## The format, and where it comes from

Rounds one and two both designed a *section* — a heading, a composition, a grid.
Research into the sites that share Hayden's shape says none of them has one:

| Site | Identity length | How range is handled |
|------|-----------------|----------------------|
| [rauno.me](https://rauno.me) | 1 sentence | An index of work types below it. The index is the About. |
| [vanschneider.com](https://vanschneider.com) | 2–3 sentences | Closest structural twin — one person, a studio, three ventures. Ventures named inline; galleries carry the rest. |
| [brianlovin.com/about](https://brianlovin.com/about) | ~180 words | Reverse-chronological prose. "Before that…" turns range into an arc. |
| [nadia.xyz](https://nadia.xyz) | ~25 words | A method statement, no titles at all. |
| [stephango.com](https://stephango.com) | no job titles | Credibility from the archive alone. |

Brian Lovin's is the format built here, because **Hayden's credibility is the
order**: Mandarin, then the factory floor, then Fortune 100 operations, then AI.
Prose carries an order; a grid of cards turns the same facts into a résumé.

Four beats — triage, origin, the AI turn, the thesis. It returns to the present
at the end on purpose: a pure reverse chronology reads as a job history, and the
return makes it an argument about how he works. **~150 words** against
production's 216, measured live in the switcher.

## Paragraph one triages three audiences

A recruiter, a consulting buyer, and a WorldPulse customer each need to
recognise themselves in the first four seconds. Paragraph one names all three
surfaces — founder of WorldPulse, consultant, eight years with Nike, Converse,
Disney and Aosom — and the five term details are each addressed to one of them,
labelled on screen so a sixth term cannot quietly be added that serves nobody.

**Positioning guardrail** (from `workTogether.ts`): Hayden is a founder who
takes selective consulting work. "Targeting recruiters" therefore means making
the *record* legible to someone evaluating him — never signalling availability.
A test asserts the copy contains no job-seeking language.

## Two tiers of emphasis

- **`em`** — a phrase a scanner needs. Renders `<strong>`. Never interactive.
- **`term`** — a phrase worth going deeper on. Renders a button that opens one
  detail.

`em` is only usable in the **sans** paragraphs. DM Serif Display is loaded at
weight 400 and nothing else, so `<strong>` in the serif lead resolves to a face
that does not exist and renders as faux bold or as nothing — measured, not
assumed. The lead marks its phrases with terms instead.

## The reveal

The passage makes its full argument **before anything is opened**. A term reveals
supplementary depth for one named audience, never a load-bearing claim — so this
is a standard disclosure (`aria-expanded` + `aria-controls`, collapsed panels
`hidden`), correctly announced and openable by a screen reader, rather than the
visually-held-back pattern `PersonasSection` needs. That distinction is the whole
point: Personas hid its actual content behind hover, which is what made it a bad
widget.

All five details are in the markup together — nothing is fetched or generated on
demand. The slot is height-reserved, and a test asserts the prose above it does
not move by more than 1px when a detail opens. ESC closes.

Rounds one and two are preserved in `a3bf704` and `9e604c8`; the un-annotated
prose in `e54210e`.

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
    Prose.tsx                                the arc; `deep` / `ground` props select the treatment
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

`0` selects the baseline, `1`–`3` select a treatment. In **Deep** and **Ground**
each marked term is a real `<button>`: Tab reaches it, Enter or Space opens it,
ESC closes it, and `aria-expanded` tracks state. The switcher is a toolbar of
`aria-pressed` buttons, not a tablist — the stage below is a page region, not a
tabpanel, and labelling it as one would promise a keyboard model this does not
implement. Every control clears the 44px tap floor. Nothing animates under
`prefers-reduced-motion`; nothing animates on scroll at all.

## Not indexed

`page.dev.tsx`, so the route only exists under `next dev` (see `pageExtensions`
in `next.config.ts`) and is absent from the static-export production build.
`/identity-lab` is also in `NON_PUBLIC_PREFIXES`, so `robots.txt` disallows it
either way, and the page sets `robots: { index: false, follow: false }`.
