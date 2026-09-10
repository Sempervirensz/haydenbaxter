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

`01`–`05` are five different theses about what identity *is*, not five layouts:

| | Concept | Thesis |
|---|---------|--------|
| 01 | **Throughline** | It has been one job the whole time; the three areas are the same method in three rooms. |
| 02 | **The Route** | The order it happened in is the differentiator — operations first, AI last. |
| 03 | **What to Bring Me** | Identity by fit: show the problems, not the person. |
| 04 | **Plain Text** | Drop every title and just talk; credentials go in the margin. |
| 05 | **Provenance** | A Digital Product Passport, applied to the person who builds them. |

Each carries a readout: thesis, strengths, **honest** weaknesses, the site map
(what every other homepage section does if this one ships), and the SEO delta.
The site map is the point — the redundancy being fixed is not inside About.

## The phone frame

Concept layout uses `@container` queries against the frame, never `@media`
queries against the viewport, so the **390px frame is a real narrow-width test**
rather than a scaled picture of one — the same rules fire in the frame and on a
phone. The baseline is the exception: production's CSS is viewport-driven, so
it does not reflow inside the frame, and the lab says so on screen instead of
pretending otherwise.

## Facts

`identityLab.ts` carries only facts that already exist elsewhere in this repo,
cited inline to the file they come from. Nothing is invented — no dates, titles,
metrics, clients, or credentials beyond what the site already says out loud.
The interpretive sentences (the ones stating what a fact *means*) are new,
because that is the actual deliverable.

Two deliberate omissions:

- The Route's photograph carries **no caption**. The obvious one — "supplier
  networks across China, Vietnam, and Indonesia" — would be a claim about what
  the photograph shows, and it does not show that.
- Plain Text's portrait keeps the repo's own `alt` ("Portrait"). Naming the
  subject would be an assertion nothing in the repo supports.

## Files

```
src/data/identityLab.ts                     diagnosis + facts + concept metadata
src/components/identity-lab/
  IdentityLab.tsx                           shell, switcher, frame, readouts
  identity-lab.css                          lab chrome + all five concepts
  concepts/
    parts.tsx                               shared eyebrow / rule / meta
    Throughline.tsx  Route.tsx  Asks.tsx  Plain.tsx  Passport.tsx
src/app/identity-lab/page.dev.tsx           dev-only route
```

Touched outside the lab: `src/data/site.ts` (noindex prefix) and
`src/data/labsRegistry.ts` (hub entry). Six lines. Deleting the four paths above
and reverting those two entries removes the experiment completely.

## Keyboard

`0` selects the baseline, `1`–`5` select a concept. The switcher is a toolbar of
`aria-pressed` buttons, not a tablist — the stage below is a page region, not a
tabpanel, and labelling it as one would promise a keyboard model this does not
implement. Every control clears the 44px tap floor. Nothing animates under
`prefers-reduced-motion`; nothing animates on scroll at all.

## Not indexed

`page.dev.tsx`, so the route only exists under `next dev` (see `pageExtensions`
in `next.config.ts`) and is absent from the static-export production build.
`/identity-lab` is also in `NON_PUBLIC_PREFIXES`, so `robots.txt` disallows it
either way, and the page sets `robots: { index: false, follow: false }`.
