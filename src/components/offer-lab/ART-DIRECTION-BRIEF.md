# Art direction brief — the three offer pages

**The job:** the offer pages are structurally solved and visually inert. Give
them a look that belongs to this site, and stop one template pretending three
different offers are the same thing.

Paste the block below into a new thread. Everything it references is on `main`
and live — the CTA row that leads into these pages already ships.

---

## THE PROMPT

I need help with **visual design for three offer pages**. The structure is
solved and I do not want it re-litigated. What I have is correct and boring —
it reads flat, too subtle, and nothing like the rest of my site. I am
brainstorming, so give me real options, not one safe answer.

### Where things stand

Repo: Next.js portfolio, dark-only, design-forward. Work from `main`; the CTA
row that leads into these pages is already live on haydenbaxter.com.

Three offers — **Consulting**, **WorldPulse**, **Experience** — each now a real
route at `/offer-lab/[offer]`, entered from a CTA row at the end of the Work
section. Read `src/components/offer-lab/DECISION.md` first: it records why the
offers became pages instead of panels, and it is settled.

Run it:

```bash
npm run dev
```

- `/offer-lab` — five layouts × dark/paper, switchable
- `/offer-lab/consulting?layout=editorial&surface=dark` — an offer as a page
- `/cta-lab/in-site` — the whole flow inside the real page. Panel → "Choices
  open into" → "Routed pages", scroll to chapter 04, press a choice.

### The problem

The pages are structurally right and visually inert. My diagnosis, argue with
it:

1. **No imagery.** My site's strongest asset is cinematic photography — a
   winged-victory statue over a night cityscape. The offer pages throw it away
   entirely and are pure type on flat dark.
2. **No motion.** The site has grounded, scroll-driven motion. These pages have
   literally none.
3. **One tonal value throughout.** Same dark ground top to bottom, one blue
   accent, no contrast blocks, no surface change to create rhythm.
4. **No movements.** It is one continuous column. A real offer page has beats:
   hero → proof → how it works → who it is for → the ask.
5. **None of my signature furniture.** The site has DYMO label plates, the
   Emerging Tech Builds "Cobalt Select" candy bars, a CD-scroll interaction.
   The offer pages use none of it, so they read as generic.

### What I want from you

Several genuinely different directions, each far enough from the others to be a
real choice — not one idea in five colourways. Build them as switchable
variants in the existing lab so I can compare them the way I compare
everything else. For each, tell me what it costs, not just what it buys.

Some starting points, take or discard:

- A cinematic hero that reuses the photography, then drops into content
- The page as its own chaptered scroll, using the site's scroll vocabulary
- Surface alternation for rhythm — dark hero, paper proof, dark close
- Signature furniture: DYMO plates for metadata, candy bars for capability lists
- Editorial magazine: pull quotes, drop caps, asymmetric grid, big numerals
- Spec sheet: lean all the way into density and monospace

### The second problem, if you get there

The three offers are **not parallel** and the template pretends they are.
Consulting is a *service* (scope, process, how to start). WorldPulse is a
*venture* (positioning, who it is for, what conversation is open). Experience
is a *credential* (record, chronology, proof). All three run through one shape
because that is what the old dossier panel was. That is why every layout
compromises somewhere. Per-offer templates, not per-offer styling.

### Hard constraints

- **Do not change the live homepage.** `src/app/page.tsx`,
  `WorkTogether.tsx`, `work-together.css` and everything the homepage renders
  stay untouched. Verify it: `/` must show zero `.ctar` and `.ofr` elements and
  one live `.wt`.
- Labs only, under `/offer-lab` and `/cta-lab`. Register new routes in
  `src/data/labsRegistry.ts`, `src/components/Splash.tsx` and
  `src/data/site.ts`.
- **Dark-only.** Paper is a surface the site already owns
  (`#f5f4f1` / `#111116`), not a light theme.
- **Invent no brand colour.** Gold `#d8b15a` is the site's single accent; blue
  `#2563eb` is what the destination screens already use. On dark, blue must
  lift to `#7aa2ff` to clear contrast; on paper, gold must darken to `#8a6a1f`.
- All copy comes from `src/data/workTogether.ts` via `src/data/offerLab.ts`.
  Do not retype or invent copy.
- Respect `prefers-reduced-motion`, keep keyboard access, visible focus.
- Commit in small logical chunks. Checkpoint before starting.

### Traps that cost me time in the last thread — do not repeat them

1. **A container query never matches the element that establishes the
   container.** `.ofr-shell` exists solely for this. Put `container-type` on a
   wrapper, never on the element the queries style. It fails *silently* —
   descendant rules keep working, so most of it looks fine and one layout
   quietly breaks.
2. **A missing stylesheet does not error.** `offer-lab.css` was imported only
   by the lab shell, so mounting `OfferScreen` elsewhere rendered naked markup
   while every structural test passed. Import CSS on the component that needs
   it, and assert *computed styles*, not just that elements exist.
3. **Declaring `backdrop-filter` at all costs sharpness**, even at `blur(0px)`
   — it promotes the backdrop to a resampled texture. Omit the property until
   there is something to blur for.
4. **`animation-fill-mode: both` pins the end-state transform** and silently
   kills hover and press. Use `backwards`.
5. **Verify with Playwright against the running dev server, not the repo's
   `playwright.config.ts`** — that config runs `next build`, which clobbers a
   running `next dev`. Two dev servers on one folder flap routes between 200
   and 404; give the second one `NEXT_DIST_DIR` (there is a `next-dev-alt`
   launch config).
6. **Hard-reload before believing something is broken.** Fast Refresh
   repeatedly showed stale, unstyled or stale-state renders of work that was
   actually correct.

### How I want it verified

Screenshots at 1440 / 768 / 390 for every direction, plus: no horizontal
overflow, no nested scrolling, keyboard reachable, reduced-motion honoured, and
the homepage untouched. Show me the comparison, then tell me which one you
would ship and why.
