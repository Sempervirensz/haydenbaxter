# SEO / AI-discovery — manual TODOs

Everything in the codebase is done, built, and validated against the generated
static export. What's below is the part I can't do from here: things needing
your credentials, your accounts, a deployed URL, or a product decision.

Canonical origin is now **`https://www.haydenbaxter.com`** — production 301s the
apex to `www` (verified: `haydenbaxter.com/privacy` → `www.haydenbaxter.com/privacy`),
so `www` is what every canonical tag, sitemap URL, robots line, and JSON-LD `@id`
declares. The bare `haydenbaxter.com` keeps working as an address; it just hands off.

---

## Before you deploy

- [ ] **Commit the three new files.** They're untracked, and an uncommitted file
      under `public/` renders locally but is simply absent for everyone else
      (AGENTS.md trap #2). `public/llms.txt` will 404 without this.
      - `public/llms.txt`
      - `src/data/schema.ts`
      - `src/components/JsonLd.tsx`

- [ ] **Check `.env.example`** for a `NEXT_PUBLIC_SITE_URL` line. That variable
      overrides the canonical origin at build time. If it's set to the apex, it
      needs to be `https://www.haydenbaxter.com` or it silently wins over the
      default. I couldn't read this file — it's permission-blocked in my session.

- [ ] **Check the same variable in Vercel** → Project Settings → Environment
      Variables. Same reasoning, and this is the one that actually affects the
      production build.

- [ ] **Resolve the concurrent edits in the working tree.** Files I never touched
      changed during my session — `src/components/work/WorkTogether.tsx`,
      `tsconfig.json`, `src/data/consultingPaths.ts`, `ConsultingPathsScreen.tsx`,
      `WorkTogetherSolo.tsx`, `consulting-paths.css`,
      `scripts/extract-consulting-scheme.mjs`. Another tool or session is writing
      to this repo. Your git-hygiene rule is one writer at a time; sort this out
      before committing so the SEO change lands as a clean, revertable chunk.

- [ ] **Decide on the OpenGraph card copy.** This is the only visible-output
      change I made. `src/app/opengraph-image.tsx` now reads *"AI Product Builder
      & Supply Chain Strategist / AI products · Global supply chains · Digital
      Product Passports"*. Same layout, colors, and type — only wording changed,
      because leaving *"Designer & Builder"* would have contradicted the new
      `og:title`. Revert if you disagree.

---

## After you deploy

- [ ] Open `https://www.haydenbaxter.com/robots.txt` — confirm it loads and the
      `User-Agent: OAI-SearchBot` block is present.
- [ ] Open `https://www.haydenbaxter.com/sitemap.xml` — 8 URLs, all `www`.
- [ ] Open `https://www.haydenbaxter.com/llms.txt` — confirm it's served (this is
      the one that silently fails if the file wasn't committed).
- [ ] Confirm `haydenbaxter.com` still 301s to `www` with the path preserved.
- [ ] View source on the homepage and confirm one `<link rel="canonical">`
      pointing at the `www` URL.

### Search consoles

- [ ] **Google Search Console** — make sure the verified property is the one that
      matches. A Domain property covers both hostnames; a URL-prefix property for
      the apex alone will under-report now that canonicals point at `www`.
- [ ] Submit `https://www.haydenbaxter.com/sitemap.xml` in GSC.
- [ ] Request indexing for the homepage, `/emerging-tech-builds`, the three
      project pages, and `/blog`.
- [ ] **Bing Webmaster Tools** — confirm it can fetch the sitemap (you can import
      the property straight from GSC).

### Validate the deployed structured data

I could not run these — they need a live URL and I have no network egress from
the build environment. **Nothing has been tested with them yet.**

- [ ] Google Rich Results Test on the deployed homepage.
- [ ] Schema.org Validator on the deployed homepage and one project page.
- [ ] Expect: `Person`, `WebSite`, `Organization`, `ProfilePage` on the homepage;
      `CreativeWork` + `WebPage` + `BreadcrumbList` on project pages;
      `BlogPosting` on the post. Breadcrumbs are the only rich result these are
      actually eligible for — the rest is entity understanding, not a SERP feature.

### AI crawlers

- [ ] Confirm `OAI-SearchBot` isn't blocked upstream of robots.txt — Vercel bot
      protection, firewall rules, or any CDN setting. robots.txt allowing it means
      nothing if the edge returns 403.
- [ ] Start watching for referrals with `utm_source=chatgpt.com`. This is a slow
      signal; don't read anything into the first few weeks.

---

## Decisions parked for you

- [ ] **`alumniOf` in the Person schema.** The page shows *"M.S. in Artificial
      Intelligence in Business (ASU)"*. I left this out because expanding "ASU"
      to a specific institution is an inference, not something the page states.
      Confirm the institution and I'll add it — it's a strong entity signal.

- [ ] **A real portrait.** There's no `Person.image` in the schema. The only
      portrait-ish asset is `/about/portrait.webp`, which is a motion-blurred
      candid street frame — not usable for a knowledge-panel-style entity image.
      A clear, crawlable headshot would be the single biggest addition to the
      Person entity. Add the file and I'll wire it in.

---

## The bigger finding, not fixed

**The entire Work section renders zero server HTML.**
`src/components/work/WorkSectionResponsive.tsx` returns an empty
`<section id="work" aria-hidden="true"/>` until a client-side `matchMedia` call
resolves. Grepping the built HTML: `"Emerging Tech Builds"` — 0 hits.
`"Consulting"` — 0. The WorldPulse caption — 0.

Every crawler that doesn't execute JavaScript — which includes most AI retrieval
crawlers — sees your signature section as an empty div. Google renders JS, but
does it on a delay and with no guarantee.

The cheap fix is **not** new routes. It's server-rendering a static text summary
of the four screens inside `#work`, which the client component replaces on mount.
The CD scroll, the cards, the interactions all stay exactly as they are — you're
adding a crawlable text layer underneath, not changing the experience. That's a
separate change and I haven't made it.

### On the individual portfolio routes

- `/work/emerging-tech` — **already solved.** `/emerging-tech-builds` exists, is
  crawlable, is in the sitemap, and has three real project pages under it.
- `/work/worldpulse` — **don't build yet.** Two sentences and an outbound link is
  a thin page. The persona panel already carries the entity signal.
- `/work/supply-chain` — content exists in `work.ts` (operator story, governance,
  traceability, three case entries) but is authored for a drawer interaction.
  Needs a real page design first.
- `/consulting` — two genuine offers plus a reserved slot in `work.ts`, and
  `consultingOffers.ts`. Same situation; note your in-progress
  `consulting-paths-lab` may be heading here.

Do the SSR text layer before any of these. It's smaller and worth more.
