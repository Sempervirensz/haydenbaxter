# haydenbaxter

Personal portfolio and product site — Next.js (App Router).

- **Framework:** Next.js 15 (App Router) · React 19 · TypeScript
- **Styling:** Tailwind CSS 4 + component CSS · dark-only, DYMO-label aesthetic
- **Visuals/motion:** GSAP, Three.js / react-three-fiber, d3, opentype.js
- **Production output:** static export (`output: "export"` → `out/`)
- **Hosting:** Vercel
- **Third-party at runtime:** Calendly booking embed (the only external runtime dependency)

## Local development

```bash
npm install
npm run dev        # normal Next dev server (enables dev-only /admin + /api routes)
```

In **dev**, files ending in `.dev.tsx` / `.dev.ts` are registered as routes
(e.g. the `/admin` tools and the `/api/admin/publish` handler). In **production**
these are excluded from the build, so the deployed site is a pure static export
with no server runtime, no API routes, and no admin surface.

## Commands

| Command          | Purpose                                            |
| ---------------- | -------------------------------------------------- |
| `npm run dev`    | Local dev server (dev-only routes enabled)         |
| `npm run generate:ai-source` | Regenerate `/llms.txt` and `/ai/hayden-baxter-source.md` from site content |
| `npm run build`  | Production static export to `out/`                 |
| `npx tsc --noEmit` | Type check                                       |

> ESLint is not yet configured (`npm run lint` will prompt to set it up). Type
> safety is enforced via `tsc`.

## Environment variables

Copy `.env.example` to `.env.local` and fill in values. Never commit real `.env`
files (they are gitignored; only `.env.example` is tracked).

| Variable                    | Required | Purpose                                                                 |
| --------------------------- | -------- | ----------------------------------------------------------------------- |
| `NEXT_PUBLIC_SITE_URL`      | Prod     | Canonical origin for metadata, canonical tags, sitemap, robots, OG. No trailing slash. Defaults to `https://www.haydenbaxter.com`. |
| `BIRTHDAY_PAGE_EXPIRES_AT`  | No       | ISO 8601 timestamp after which the private `/happybirthdaykemmerlee` page stops rendering. |

There are **no server secrets** in production (static export — no API keys,
tokens, or database). Set `NEXT_PUBLIC_SITE_URL` in the Vercel project settings.

## AI Source / ChatGPT Integration

The site publishes two AI-readable files:

- `/llms.txt` is a short orientation file for ChatGPT, Codex, and other AI tools. It describes what HaydenBaxter.com is, Hayden's professional positioning, the most important public pages, and where the canonical Markdown source lives.
- `/ai/hayden-baxter-source.md` is the fuller professional source document. This is the file to upload into a ChatGPT Career Coach Project as a persistent source.

Both files are generated from the same structured source data that renders the public site, mostly under `src/data/*`. Do not hand-edit the generated files for factual updates. Update the site data first, then run:

```bash
npm run generate:ai-source
```

`npm run build` runs the generator automatically before the static export, so deployed output stays synchronized with the current website content.

After deployment, verify:

- `https://www.haydenbaxter.com/llms.txt`
- `https://www.haydenbaxter.com/ai/hayden-baxter-source.md`
- `https://www.haydenbaxter.com/sitemap.xml`
- `https://www.haydenbaxter.com/robots.txt`

For ChatGPT Projects, upload `public/ai/hayden-baxter-source.md`.

## Deployment (Vercel)

The site auto-deploys from `main`. Build settings:

- **Build command:** `npm run build`
- **Output directory:** `out`
- **Install command:** `npm install`
- **Framework preset:** Next.js (static export)

Security headers (CSP, HSTS, X-Frame-Options, X-Content-Type-Options,
Referrer-Policy, Permissions-Policy) are defined in [`vercel.json`](./vercel.json).
Next.js `headers()` are intentionally **not** used because they are ignored under
`output: export`.

### Pre-deploy checklist

- [ ] `npx tsc --noEmit` passes
- [ ] `npm run build` succeeds and `out/` is produced
- [ ] `NEXT_PUBLIC_SITE_URL` is set in Vercel (production + preview)
- [ ] Custom domain `haydenbaxter.com` points to the Vercel project, HTTPS enforced
- [ ] No `.env*` (other than `.env.example`) is tracked: `git ls-files | grep -i env`
- [ ] No `/admin` or `/api` directory in `out/`

### Post-deploy verification

- [ ] `https://haydenbaxter.com/robots.txt` and `/sitemap.xml` resolve and point to the live domain
- [ ] Homepage renders; the soft-lock entry works on mobile + desktop; Skip works
- [ ] Calendly booking embed loads in the Connect section
- [ ] `/privacy` loads and the footer link works
- [ ] A random unknown URL shows the branded 404
- [ ] Social share preview shows the OG card (test with an OG debugger)
- [ ] Security headers present (check response headers / securityheaders.com)
