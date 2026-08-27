# Report 8 — SEO, Sharing & Responsive Gaps (Brief Phases 7 & 3)

**Date:** 2026-08-26 · **Against:** commit `15f4e7b`

> The brief's real test for this phase: *"Determine what Google, LinkedIn, Slack, Discord, and a
> recruiter receiving the URL are likely to see."* Round 1 audited the homepage's metadata and
> declared SEO strong. It never checked the other routes. Six of them are wrong.

## Scope

**Exercised:** per-route `<title>`, description, canonical, `og:*` and `twitter:*` across all
production routes plus 404; sitemap correctness after 41 routes were removed; the two viewport
widths named in the brief but absent from the matrix (320px, 1024px), in Chromium and WebKit.

**Not exercised:** live crawler behaviour (Googlebot render queue); LinkedIn/Slack cache
invalidation; Search Console data.

---

## Findings

### [ETB-P7-01] Six routes declare a large-image social card and supply no image

- **Severity:** **P2** · **Confidence:** **High (confirmed)** · **Area:** SEO / Sharing

**Evidence** — per-route tags in the built output:

| Route | `og:image` | `twitter:image` | `og:title` vs `twitter:title` |
|---|---|---|---|
| `/` | ✅ 1 | ✅ 1 | match |
| `/emerging-tech-builds` | ❌ **0** | ❌ **0** | **MISMATCH** |
| `/emerging-tech-builds/cortex` | ❌ **0** | ❌ **0** | **MISMATCH** |
| `/emerging-tech-builds/atomic-os` | ❌ **0** | ❌ **0** | **MISMATCH** |
| `/emerging-tech-builds/casebrief` | ❌ **0** | ❌ **0** | **MISMATCH** |
| `/blog` | ❌ **0** | ❌ **0** | **MISMATCH** |
| `/privacy` | ❌ **0** | ❌ **0** | **MISMATCH** |
| `/blog/[slug]` | ✅ | ✅ | match — **done correctly** |

**Two defects, compounding.**

1. **No image.** Every one of these routes still declares
   `<meta name="twitter:card" content="summary_large_image">`. Declaring a large-image card and
   supplying no image is worse than declaring `summary` — LinkedIn, Slack and X render the large
   card layout with an empty image well.

2. **The Twitter tags describe the wrong page.** On `/emerging-tech-builds`, `og:title` correctly
   reads *"Selected AI Work | Hayden Baxter"* while `twitter:title` falls back to the site default
   *"Hayden Baxter | Global Business Leader, AI Strategy Partner…"* — and `twitter:description`
   likewise. Platforms that prefer `twitter:*` over `og:*` show generic site copy for a specific
   page.

**How to reproduce**
Paste `https://www.haydenbaxter.com/emerging-tech-builds` into Slack or the LinkedIn Post
Inspector: large card layout, no image, homepage title.

**Why it matters**
`/emerging-tech-builds` is the link a consulting buyer is most likely to be *sent*. It is the
evidence page. Its share preview is currently the weakest on the site, while the blog — the least
commercially important route — is the only one done right.

The blog post proves the pattern already works here (`og:image`, `og:image:alt`, `og:type=article`,
matching Twitter tags). It just was not applied to the pages that matter most.

**Complexity:** Small

---

## Suspicious but actually fine

1. **The sitemap might still list removed routes.** It does not. All **8 entries resolve to a real
   file** in the build — the 41 removed lab routes were correctly excluded, because
   `PUBLIC_ROUTES` in `src/data/site.ts` is an allowlist rather than a denylist. The one piece of
   round-1 architecture that has aged well.

2. **320px and 1024px — the two widths the brief names and the matrix omits.** Tested both routes,
   both engines: **0px overflow in all eight combinations.** The gap was coverage, not a defect.
   Adding them to the matrix is still worthwhile so it stays that way.

3. **The 404 page has no canonical.** Correct — a 404 should not declare one. It carries
   `noindex`, a proper title, and an `og:image`.

4. **Every route has a unique, specific `<title>` and description.** No duplication, no
   truncation, no template leakage.

---

## Prepared changes

### [ ] 1 — Give every route a social image and matching Twitter tags `ETB-P7-01`

**Files:** `src/app/emerging-tech-builds/page.tsx` and its three detail pages,
`src/app/blog/page.tsx`, `src/app/privacy/page.tsx`

Two options:

- **(a) Inherit the site OG image (recommended, smallest).** Add `openGraph.images` and
  `twitter.images` pointing at the existing `/opengraph-image`, and set `twitter.title` /
  `twitter.description` to each page's own values. Every route gets a correct card immediately.
- **(b) Per-page generated images.** Add `opengraph-image.tsx` to each route segment so
  `/emerging-tech-builds` gets a card naming the projects. Better, but more surface.

Recommend **(a) now**, and **(b) later for `/emerging-tech-builds` only**, since that is the route
that actually gets shared.

- **Risk:** Low — metadata only, no layout or runtime change.
- **Verification:** Re-run the per-route table; require `og:image ≥ 1`, `twitter:image ≥ 1`, and
  `og:title === twitter:title` on every route. Add this as a matrix guard so a new route cannot
  ship without a card.

### [ ] 2 — Add 320px and 1024px to the matrix

**File:** `playwright.audit.config.ts`

Extend `AUDIT_VIEWPORTS` with `xs: 320×568` and `md: 1024×768`. Takes the matrix from 18 projects
to 24.

- **Risk:** None to the site. Run time grows roughly a third (~4.5 min → ~6 min).
- **Verification:** Full matrix green at 24 projects.

### [ ] 3 — Add an SEO invariant guard

**File:** `tests/audit/audit-regression.spec.ts`

Extend the existing SEO test beyond the homepage: for every production route, assert canonical
present, `og:image` present, and Twitter title matching OG title.

- **Risk:** None.
- **Verification:** Fails on the six routes today; passes after change 1.

---

## Not proposed

**Per-route generated OG images for all six routes.** Option (b) above is better but is Medium
effort for five routes that are rarely shared directly. Do it for `/emerging-tech-builds` once the
cheap fix is in.

**Changing `twitter:card` to `summary`.** It would technically resolve the empty-image-well
problem, but by making every share preview smaller and less prominent. Supplying the image is
strictly better and costs the same.
