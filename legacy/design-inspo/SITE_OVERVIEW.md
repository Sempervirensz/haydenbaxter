# Hayden Baxter — Portfolio Site Overview

## What It Is

A dark-mode, scroll-driven portfolio website for **Hayden Baxter** — founder, product builder, supply chain operator, and AI systems engineer. The site serves as both a **hiring artifact** (for recruiters) and a **consulting storefront** (for prospective clients). It presents four equal-weight bodies of work — WorldPulse, Emerging Tech Builds, Supply Chain, and Consulting — unified by a central thesis: *building thoughtful products where data, design, and the human experience converge.*

The site is not a template. It's a handcrafted, detail-obsessed digital object that communicates craft through its own construction.

---

## Why It Was Made

The portfolio exists to solve a positioning problem. Hayden's background spans supply chain operations (8+ years in Asia), AI/ML engineering (M.S. in AI), product design, and consulting — domains that rarely coexist on the same resume. A conventional portfolio couldn't hold all of that without feeling scattered.

The site reframes this breadth as a **coherent identity**: someone who builds at the intersection of systems thinking, design sensibility, and technical depth. The CD-based navigation — a real photograph of a hand-burned CD-R — serves as a literal metaphor: each section is a "track" on the same disc.

---

## Structure

### Page Architecture

```
index.html                          ← Thin shell (~34 lines), mounts everything via JS
├── Splash Screen                   ← Multilingual greetings (Hello, 你好, Olã, नमस्ते, こんにちは)
├── Sticky Glass Header             ← Wordmark + nav (Work, About, Contact, Resume, Book a Call)
├── Hero                            ← Headline + subheadline
├── Brand Carousel                  ← Infinite scroll: Nike, Disney, Aosom
└── Work Section (4500vh)           ← Scroll-driven, four detail screens
    ├── Landing                     ← Rotating CD disc + active section label
    ├── Screen 1: WorldPulse        ← Origin product, DPP focus, founder role
    ├── Screen 2: Emerging Tech     ← Filterable/sortable project gallery with modals
    ├── Screen 3: Supply Chain      ← Map hero, cinematic quote reveal, proof drawer
    └── Screen 4: Consulting        ← Typographic hero, offers, particle globe, proof tiles
```

### Code Architecture

The codebase is organized for **AI-assisted editing** — small files, strict separation of concerns, localized edits:

```
app/
├── main.js                         ← Bootstrap (48 lines)
├── data/
│   └── site-content.js             ← ALL text, labels, cards, config (524 lines)
├── renderers/
│   └── page.js                     ← HTML generation (435 lines)
└── features/
    ├── splash.js                   ← Greeting animation (30 lines)
    ├── work-scroll.js              ← CD rotation + scroll state (126 lines)
    ├── emerging-tech-builds.js     ← Filtering, sorting, modals (467 lines)
    └── supply-consulting.js        ← Supply Chain + Consulting interactivity (1160 lines)

style.css                            ← All visual styling (5,781 lines)
```

Content lives in `site-content.js`. Markup lives in `page.js`. Interaction lives in `features/`. Style lives in `style.css`. Changing copy never requires touching layout code. Changing animations never requires touching content. This separation was a deliberate design decision to make the codebase legible to both humans and AI tools.

### Experimental Labs

Several directories exist as isolated sandboxes for prototyping features before promoting them to the main site:

- `/typography-lightup-lab/` — Cursor-following text reveal experiments
- `/consulting-lab/` — 2D canvas globe concept
- `/etb-lab/` — Emerging Tech Builds layout alternatives
- `/experiments/particle-globe-lab/` — Three.js/React Three Fiber particle globe
- `/experiments/supply-chain-hero/` — Map composition and hero art experiments

---

## Tech Stack

| Layer | Choice | Rationale |
|---|---|---|
| **Language** | Vanilla JavaScript (ES modules) | No framework overhead; full control over scroll physics and DOM |
| **Styling** | Pure CSS with custom properties | 5,781 lines of hand-authored CSS; no utility framework |
| **Build Tool** | None (main site) / Vite (experiments) | Main site is flat HTML+JS+CSS served statically; labs use Vite for React/TS |
| **3D** | Three.js + React Three Fiber | Particle globe in Consulting section (embedded via iframe from experiments) |
| **Fonts** | Google Fonts | Inter (body), DM Mono (nav/labels), Playfair Display (headings), Permanent Marker (CD labels), Cormorant Garamond (accent) |
| **APIs** | IntersectionObserver, passive scroll listeners | Scroll-driven interactions without libraries |
| **Dev Server** | Python `http.server` (port 8000) | Simple, no-config local serving |

No React, no Tailwind, no component library. The entire main site is ~2,300 lines of JavaScript and ~5,800 lines of CSS. The constraint was intentional — the site itself is a demonstration of craft, and frameworks would obscure that.

---

## Design Language

### Visual Identity

**Dark mode only.** Black background (`#000`), white text at varying opacities, no light theme. The darkness is functional — it creates a gallery-like environment where content, images, and interactive elements become the light sources.

### The DYMO Label System

The most distinctive UI element is the **embossed button style** inspired by DYMO label makers. Navigation buttons use:
- DM Mono typeface (monospaced, industrial)
- Deep inset box shadows simulating plastic embossing
- Text shadows mimicking stamped ink impression
- Subtle random rotation (1-2°) for handmade feel
- Tactile press states (buttons physically depress on click)

```css
--btn-face: #1c1c1c;
--depth: 3px;
--lift: -2px;
--press: 1.5px;
```

This aesthetic carries through to filter chips, status tags, and interactive labels across the site.

### Typography Hierarchy

- **Playfair Display** — Serif, used for major headings. Conveys editorial weight and seriousness.
- **Inter** — Sans-serif body text. Clean, readable, modern.
- **DM Mono** — Monospaced, used for nav buttons, labels, metadata. Adds a technical/systems quality.
- **Permanent Marker** — Handwritten, used exclusively for CD disc labels. Anchors the physical metaphor.
- **Cormorant Garamond** — Serif accent, used sparingly for quotes and elegant callouts.

### Effects & Polish

- **Glassmorphism** — Header uses `backdrop-filter: blur()` for frosted glass effect
- **Grain texture overlays** — Subtle film grain adds analog warmth
- **Vignette** — Edge darkening on hero compositions
- **Smooth easing** — Custom `cubic-bezier` curves tuned across 14+ iterations
- **Reduced motion** — All animations respect `prefers-reduced-motion`
- **Responsive** — Fluid scaling via `clamp()`, breakpoints at 680px, 960px, 1200px

---

## Key Interactions

### The CD Navigation

The centerpiece interaction. A real photograph of a hand-burned CD-R rotates in response to scroll position, with four "hold zones" — one per portfolio section. The disc stays locked at each position for ~22% of the scroll range (990vh), then glides to the next.

**Technical details:**
- Total scroll height: 4500vh (creates slow, deliberate pacing)
- Rotation: CSS `transform: rotate()` driven by JavaScript scroll calculations
- Transition: `800ms cubic-bezier(.25, .1, .25, 1)` (smooth, not floaty)
- Labels below the disc update in sync, fading between section names
- Each hold zone triggers a corresponding detail screen (IntersectionObserver)

This interaction was tuned across 5+ development sessions and 14 discrete adjustments. The changelog documents the progression from "too clicky" to "too floaty" to the final "grounded glide" feel.

### Emerging Tech Builds Gallery

A filterable, sortable project showcase:
- 6 filter categories (All, Agents, NLP/Privacy, Voice/Video, Supply Chain Apps, R&D)
- 3 sort modes (Most complete, Most technical, Most recent)
- Retro candy-bar accordion layout
- Modal detail views with screenshots, tech stacks, and descriptions
- Projects: AtomicOS, CaseBrief, ProcureBridge, OpenClaw + graduate work section

### Supply Chain Section

A cinematic, map-based presentation:
- Pacific region map hero (East Asia ↔ North America composition)
- Quote lines with **light-up typography** — text illuminates as the user scrolls or hovers
- Multi-tab proof drawer (Operator Story, Governance, Traceability)
- Featured card with supporting detail modals

### Consulting Section

- Typographic hero with identity statement
- Three consulting offers (AI Roadmap Sprint, MVP Prototype Sprint, reserved slot)
- **Particle globe** — Interactive Three.js visualization with terrain relief, curl noise, pointer-following particles, and shimmer effects
- Proof tiles with case-study-lite modal details

---

## Building Methodology

### Human-AI Collaborative Development

This site was built through **iterative human-AI collaboration**, and the methodology is a first-class feature of the project. Key practices:

1. **Specification by conversation.** `work-page-spec.md` contains 50+ Q&A pairs where design decisions were made through dialogue — covering portfolio coherence, writing tone, credibility strategy, and interaction models.

2. **AI-optimized architecture.** The codebase was explicitly designed for AI tools to edit efficiently (`AI_EDITING_GUIDE.md`). Files are small, concerns are separated, and common change patterns are documented.

3. **Documented iteration.** `CHANGELOG.md` captures every major development session with user prompts, technical decisions, and outcomes. `SUPPLY_CHAIN_PAGE_WORKLOG.md` and `globe-fix-log.md` provide granular debugging and iteration histories.

4. **Lab → Promote pattern.** New features are prototyped in isolated `/experiments/` or `/*-lab/` directories before being integrated into the main site. This keeps the production code stable while enabling ambitious experimentation.

### Development Timeline

The project evolved through roughly 14 major development phases:

1. **Foundation** — Navbar, hero, splash screen, brand carousel
2. **Work section scaffold** — 4-screen scroll structure, page-turn transitions (later reverted)
3. **CD concept v1** — CSS-only iridescent disc, scroll-driven rotation
4. **CD concept v2** — Real CD-R photograph, Permanent Marker labels, realistic hub/hole
5. **Scroll tuning** — Section heights scaled from 780vh → 3000vh → 4500vh; hold zones calibrated
6. **WorldPulse detail** — Logo, featured image, role card, caption, side cards
7. **Emerging Tech Builds** — Filter bar, sort system, project cards, modals, image fallbacks
8. **Supply Chain v1** — Magazine spread → split-map hero → minimal landing with map
9. **Supply Chain v2** — Light-up typography, proof drawer, featured/support cards
10. **Consulting** — Typographic hero, offers, particle globe integration, proof tiles
11. **Globe refinement** — Terrain relief, curl noise, back-face alpha, camera adaptation, shimmer
12. **Typography lab** — Experimental cursor-following text reveal with tunable parameters
13. **Responsive polish** — Mobile breakpoints, touch fallbacks, fluid scaling
14. **Final tuning** — Cache busting, performance optimization, accessibility audit

### Version Control

- **Branch strategy:** Feature branches named `codex/feat-*` off `main`
- **Cache busting:** CSS/JS files versioned with timestamps (`?v=20260304-globe`)
- **Clean commits:** Repository maintained in clean state between sessions

---

## Essence

This isn't a portfolio that *describes* capability — it *demonstrates* it. The scroll physics were tuned across 14 iterations because the feel matters. The CD is a real photograph because authenticity matters. The code architecture was designed for AI collaboration because that's the future of building. The 5,781 lines of CSS are hand-authored because craft is the point.

The site makes an argument through its own existence: the person who built this thinks in systems, cares about details, and ships real things.
