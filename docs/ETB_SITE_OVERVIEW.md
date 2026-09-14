# ETB Site Overview

A quick description of everything that lives under **Emerging Tech Builds** (ETB) — the `/emerging-tech-builds` section of the portfolio.

_Snapshot: 2026-08-24, branch `main`._

---

## Routes

| Route | What it is |
| --- | --- |
| `/emerging-tech-builds` | The gallery — candy-bar accordion of all 5 projects |
| `/emerging-tech-builds/cortex` | Cortex detail page |
| `/emerging-tech-builds/atomic-os` | AtomicOS detail page |
| `/emerging-tech-builds/casebrief` | CaseBrief detail page |

Only these three projects have detail routes. ProcureBridge and OpenClaw appear in the gallery but their CTA renders as a disabled **"Coming Soon"** button.

---

## The gallery page (`/emerging-tech-builds`)

`src/app/emerging-tech-builds/page.tsx` → renders `<ETBDetail>` inside a shell with a "← Back to home" rail.

**What's on it:**

- **Intro line** — "Applied emerging tech builds focused on clear workflows and useful interfaces. Case Brief and Atomic OS currently have active front-end implementations; Procurement and Open Claw are concept-stage."
- **Bar stack** — one near-white "candy bar" per project: mono name, one-line summary, `›` chevron, diagonal sheen sweep on hover, cobalt fill on the active bar. Sorted by `completenessScore` descending: **CaseBrief (85) → AtomicOS (82) → Cortex (78) → ProcureBridge (35) → OpenClaw (28)**.
- **Dossier panel** — clicking a bar opens a slide-in "Project File" card. Two layouts:
  - **Curiosity-first** (any project with a `panel` block — Cortex, AtomicOS, CaseBrief): embroidered mark · category meta · title · hook line · one paragraph · tags · CTA.
  - **Capability layout** (ProcureBridge, OpenClaw): status + category · one-liner · 3 bullets · tags · "System Notes" · disabled CTA.
  - On mobile the same card renders as a full-push overlay portaled to `document.body`, with scroll lock and ESC-to-close.
- **`DetailModal`** — a second, richer modal path (hero screenshot, full bullet list, tag pills, System Snapshot aside). Wired up but not currently triggered from the bar stack.
- **Graduate Work section** — defined in data (3 placeholder cards) but **hidden**; not rendered today.

Filters ("All / Personal OS / Case Intelligence / Voice-Video / Supply Chain Apps / Editorial Brain / R&D") and sort options ("Most complete / Most technical / Most recent") exist in the data model but no filter/sort UI is rendered — only `defaultSort` is applied.

---

## The five projects

### 1. Cortex — Editorial Brain · Front-end Build
> "Find the signal. Grade the evidence. Publish the truth."

A living second brain built on an Obsidian knowledge architecture plus an intelligence layer: sources, notes, claims, topic maps, and drafts in one connected system that reasons across the whole base and keeps answers tied to sources.

- Scores: complete 78 · technical 88 · recency 97 (the most recent build)
- Mark: `/assets/cortex-mark.webp` (embroidered brain)
- **4 stat cards** — 186 research notes · 3,783 indexed knowledge units · 9 topic maps · 3 core workflows
- **9 screenshots** — dashboard overview, source note, editorial pipeline, knowledge graph, Map of Content, multi-axis source index, coverage analysis, triage queue, evidence strength
- **How Cortex works** — 5 steps: absorbs → remembers with structure → connects → reasons across the system → turns knowledge into work
- **What makes it different** — 6 items: one brain not a toolset · structure before automation · knowledge that compounds · gaps become visible · source-to-publishing · safe write-back
- **Technical breakdown** — Obsidian knowledge architecture · connected ingestion + knowledge model · hybrid retrieval and reasoning · coverage, creation, and review
- Plus Outcomes and Lessons learned
- _Not yet captured:_ research-answer-with-source-panel, draft with inline citations, Export Pack, provenance-filter comparison, retrieval architecture diagram (TODOs in `cortexDemo.ts`)

### 2. AtomicOS — Personal OS / Behavior Intelligence · Front-end Build
> "An operating system built for better habits, better days, and an extraordinary life."

Chat-based check-ins throughout the day; you reply in plain English and the system extracts habit, timing, and energy, then surfaces which routines actually drive better days.

- Scores: complete 82 · technical 89 · recency 89
- Mark: `/assets/atomicos-mark.webp` (embroidered atom)
- **4 stat cards** — 60d demo history · 22 behaviors modeled · 4 daily loops · 2 input modes
- **6 screenshots** (phone mock + 5 dashboard views, each with a mobile variant) — chat check-in thread, dashboard overview, loop drivers, activity heatmap, 60-day habit grid, check-in analytics
- **How AtomicOS works** — 4 steps: checks in naturally → you reply like a person → it stores the useful signal → it reveals the patterns
- **What makes it different** — 5 items: reply-to-track · loop drivers · interaction effects · meal-photo analysis · human-centered streak protection
- **Technical breakdown** — front end · data layer · AI and automation · privacy and demo safety
- Plus Outcomes and Lessons learned

### 3. CaseBrief — Case Intelligence · Front-end Build
> "Understand the full story of an injury, so every client's case is built with care."

Turns scattered medical records into a source-backed narrative of injury, treatment, and recovery; flags referenced-but-missing records; keeps every conclusion tied to its source document and page.

- Scores: complete 85 · technical 95 · recency 87 (highest technical score)
- Mark: `/assets/casebrief-mark.png` (cube)
- **No stat cards and no screenshots yet** — the screenshots array is deliberately empty so the section simply doesn't render (no broken images, no placeholder)
- **How CaseBrief works** — 4 steps: bring the full record together → build the client's health narrative → surface the missing pieces → verify every important point
- **What makes it different** — 5 items: the client's full narrative · missing-piece detection · source-backed by design · structured case review · human verification built in
- **Technical breakdown** — document intelligence pipeline · structured retrieval and reasoning · source grounding and validation · modular product architecture
- Plus Outcomes and Lessons learned
- _Not yet captured:_ 5 planned screenshots (intake/upload, cited treatment timeline, missing-information checklist, expanded citation, document-indexing view) — captions already written in `casebriefDemo.ts`

### 4. ProcureBridge — Supply Chain Apps · Concept
> "A procurement intelligence concept for evaluating suppliers and clearer sourcing decisions."

Gallery-only. Scores 35 / 62 / 78. Has an embroidered globe-and-bridge mark, three System Notes bullets, "Demo Coming Soon" preview label, and a disabled CTA. No detail route.

### 5. OpenClaw — R&D · Concept
> "An R&D concept for open-ended agentic workflows that turn rough ideas into usable tools."

Gallery-only. Scores 28 / 74 / 96. No mark, no screenshot, disabled CTA. No detail route.

---

## Detail page anatomy

All three detail pages share one layout (`ProjectDetailPage.tsx`), rendered in this order:

1. "← Back to Emerging Tech Builds" link
2. **Hero** — embroidered mark, category eyebrow, title, one-liner, tag row
3. Optional demo note / badge / disclaimer aside (none of the three use it today)
4. **Story** — 3–4 opening paragraphs
5. **Principle** — a pull-quote (e.g. Cortex: "A second brain should not just remember what you know. It should help you build on it.")
6. **Stat cards** (`DemoStats`) — icon · label · big value · detail line
7. **Accordion**, open by default for the first three:
   - Screenshots (`DemoScreenshots` — inline carousel with dot nav + prev/next, `<picture>` with mobile art-direction sources, click-to-zoom lightbox with ESC, scroll lock, and focus restore)
   - How {project} works — numbered steps
   - What makes it different — title + body cards, optional note
   - Technical breakdown
   - Outcomes
   - Lessons learned
   - Honest limitations (supported; unused today)
8. Footer back-link

Projects without a `demo` block fall through to quiet "Coming soon" placeholder sections instead.

---

## Where the content lives

| File | Holds |
| --- | --- |
| `src/data/work.ts` | The ETB screen: title, intro, filters, sort options, and all 5 project records (scores, tags, panel copy, marks, graduate-work placeholders) |
| `src/data/cortexDemo.ts` | Cortex detail-page content |
| `src/data/atomicosDemo.ts` | AtomicOS detail-page content |
| `src/data/casebriefDemo.ts` | CaseBrief detail-page content |
| `src/data/etbProjects.ts` | `findEtbProject(id)` lookup used by the three routes |
| `src/data/schema.ts` | JSON-LD graphs — `collectionPageGraph` on the gallery, `projectPageGraph` on each detail page |
| `src/app/globals.css` | All ETB styling (`etb-`, `etb-bar__`, `etb-dos__`, `etb-page__`, `etb-shot__`, `etb-lightbox__`) |

Every route carries its own `metadata` (title, description, canonical, OpenGraph) and a JSON-LD block; the gallery declares the three detail pages as its parts.

---

## Where ETB shows up outside its own routes

- **Home / Work stack** — ETB is screen `02 / 04` (`src/components/work/ETBDetail.tsx` is shared)
- **Mobile Work card** — `MobileEtbCard.tsx`, routing through the same `ETB_DETAIL_ROUTES` slug map
- **Work-fidelity lab** — `src/components/work-fidelity/cards/EtbCard.tsx`
- **Labs registry** — the gallery and all three detail pages are listed in `src/data/labsRegistry.ts`
- **Legacy reference** — `legacy/design-inspo/etb-lab/`

---

## In flight (uncommitted)

- **`/cortex-mark-lab`** — an art-direction exercise for Cortex only: three hero treatments for the embroidered mark (specimen plate · masthead lockup · fabric field) rendered over the real detail page, plus today's hero as baseline. `noindex`, and production imports nothing from it.
- **`ProjectDetailPage`** gained an optional `hero` prop so one project can be art-directed without changing the others. No page passes it yet — every detail page still renders the default hero.
- New files: `src/components/etb-page/cortex/CortexMarkHero.tsx`, `CortexMarkLab.tsx`, `cortex-mark.css`, `cortex-mark-lab.css`.

---

## Known gaps

- CaseBrief has zero screenshots and no stat cards — the thinnest of the three detail pages
- Cortex is missing its five intelligence-experience captures (reasoning + creation views)
- Graduate Work is still three placeholder cards and is hidden from render
- Filter and sort controls exist in data but have no UI
- ProcureBridge and OpenClaw are concept-only with no detail routes
