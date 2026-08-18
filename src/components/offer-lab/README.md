# Offer page lab — `/offer-lab`

Five structural directions for the three offers, against two surfaces.

Today all three offers resolve into one fixed shape: the paper dossier panel
that unfurls inside the Consulting card. This lab asks a different question —
**if each offer were a page, what shape should it be?**

```bash
npm run dev
```

Then open <http://localhost:3000/offer-lab>.

---

## The layouts

| | Layout | What it is |
| --- | --- | --- |
| A | **Dossier** | What ships today — paper panel, two blocks side by side, compact. The baseline. |
| B | **Editorial** *(default)* | No panel. Display serif headline, wide measure, type on hairlines, the note set in serif. |
| C | **Index** | Numbered and tabular. Mono title, labels at the left margin, items as rows. |
| D | **Stack** | One column at every width, generous rhythm, each block a bordered card. |
| E | **Split** | Sticky identity pane left, the proof scrolls on the right. |

Each layout's verdict — what it buys and what it costs — is in the panel and in
`src/data/offerLab.ts`.

**The markup is identical across all five.** Same eyebrow, title, lede, two
labelled blocks, signals strip, note and two actions, in the same order.
`data-layout` never gates content, only presentation — which is what makes the
five comparable rather than five different pages.

## Surface

- **Dark** `#0a0b0f` — the site's documented ground.
- **Paper** `#f5f4f1` / `#111116` — the surface the live destination screens,
  the ETB dossier and the personas lab already use.

Not a theme experiment: the choice genuinely changes which layout wins, so it
is worth being able to flip.

## Content

All copy is re-exported from `src/data/workTogether.ts`, the production source,
so the lab and the live screens cannot drift. Nothing here is invented.

---

## The container trap

`.ofr-shell` establishes the container, one level **above** `.ofr`, and that
separation is load-bearing.

A container query never matches the element that establishes the container. With
`container-type` on `.ofr` itself, every `@container` rule targeting
`.ofr[data-layout=…]` was a silent no-op — no warning, no error, the rule simply
never applied. Descendant rules worked fine throughout, which is exactly what
made it hard to see: four of the five layouts looked correct, and only Split
gave it away by staying a two-column row at 390px and overflowing its frame by
113px.

Split also needs `align-items: stretch` when it collapses. Its base rule sets
`flex-start` for the two-column row, and once the container is a column that
same value governs the horizontal axis and shrinks both panes to content width.

---

## Files

```
src/app/offer-lab/page.tsx                 route (noindex)
src/data/offerLab.ts                       workTogether.ts re-export + rosters
src/components/offer-lab/
  OfferLab.tsx                             shell — owns the settings
  OfferScreen.tsx                          one offer in one layout
  OfferControls.tsx                        experiment panel
  offer-lab.css                            all styling, scoped .ofr- / .ofrl-
```

Three files touched for registration only: `src/components/Splash.tsx`,
`src/data/site.ts`, `src/data/labsRegistry.ts`.

Nothing on the live site imports any of this.
