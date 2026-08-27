# Report 1 — Security & Dependencies (Brief Phase 6)

**Date:** 2026-08-26 · **Against:** commit `15f4e7b`, live `www.haydenbaxter.com`

> The brief calibrates this phase explicitly: *"This is primarily a static portfolio, so calibrate
> severity realistically… Do not manufacture security findings just to create a dramatic report."*
> One finding here is genuinely serious. The other four are not, and the report says so.

## Scope

**Exercised:** dependency advisories with reachability analysis against the deployed artifact;
DOM XSS surface (`dangerouslySetInnerHTML`, `innerHTML`, `eval`, `new Function`); secret scanning
of the built output; private data in the deployed artifact **verified against the live domain**;
CSP / security headers; `target="_blank"` handling; source-map exposure; deployment artifacts;
`.vercel` tracking.

**Not exercised:** penetration testing of Vercel's edge; TLS configuration; DNS; email/SPF/DMARC;
Calendly's own security posture. No forms exist on the site, so form abuse is not applicable.

---

## Findings

### [ETB-P6-01] 22.3 MB of personal camera originals are publicly served from the production domain

- **Severity:** **P1** · **Confidence:** **High (confirmed live)** · **Area:** Privacy
- **Location:** `public/Personal Photos/` → `out/Personal Photos/`; `.gitignore:21`

**Problem**
Five personal camera originals are reachable, unauthenticated, on the production domain, and are
not excluded from crawling.

**Evidence** — fetched against `https://www.haydenbaxter.com`:

```
200  /Personal%20Photos/IMG_2716.PNG
200  /Personal%20Photos/IMG_8203.jpeg
200  /Personal%20Photos/IMG_8296.jpeg
200  /Personal%20Photos/IMG_8854.JPG
200  /Personal%20Photos/PANO_20170527_125156(1).jpg
LIVE: 5/5  ~22.3 MB publicly served
robots.txt: NOT excluded — crawlable
```

**This corrects a round-1 error.** `ETB-P3-01` recorded this as *P3, Medium confidence*, with the
reasoning: *"A git-based Vercel deploy is clean — the files aren't in the repo."* That reasoning
was sound but the premise was wrong. `.gitignore:21` excludes `public/Personal Photos/` from
**git**, and this project does not deploy from git — it deploys with `vercel --prod` from the
working directory, and no `.vercelignore` exists. I reasoned instead of fetching. Fetching takes
one request and would have caught it.

**How to reproduce**
`curl -I "https://www.haydenbaxter.com/Personal%20Photos/IMG_8296.jpeg"` → `200`.

**Why it matters**
These are camera originals, not published work — JPEG/PNG straight off a device, including a
2017 panorama. They may carry EXIF (GPS coordinates, device, timestamp). They are indexable,
hotlinkable, and appear on the domain a recruiter or client is being sent to. `.gitignore` says
*"Nothing references these"* — that is true, and irrelevant: nothing has to reference a file for
it to be served.

**Remediation:** move out of `public/`, add `.vercelignore`, and re-verify against the live
domain after deploy — not against the repo.
**Complexity:** Small

---

### [ETB-P6-02] Four high-severity advisories; none reachable in the deployed artifact

- **Severity:** **P3** · **Confidence:** **High** · **Area:** Supply chain
- **Location:** `package.json`; `next@15.5.19`, and transitive `postcss`, `sharp`, `nanoid`

**Problem**
`npm audit` reports 4 high advisories. Round 1 could not run this — there was no network egress —
so it went unassessed. Assessed now, **the raw count materially overstates the exposure.**

**Evidence — reachability against what actually ships:**

```
server JS files in out/:  0
API routes in out/:       0
'use server' occurrences: 0
next.config:              output: "export"   images.unoptimized: true
```

Mapping each advisory to that reality:

| Advisory | Reachable here? | Why |
|---|---|---|
| Server Actions DoS | **No** | No `use server`, no server runtime |
| Server Actions SSRF (custom servers) | **No** | No custom server |
| Cache confusion (×2) | **No** | No server to cache |
| Unbounded Server Action payload (Edge) | **No** | No Edge runtime |
| SSRF in rewrites | **No** | Static export performs no runtime rewrites |
| Image Optimization DoS via SVG | **No** | `images.unoptimized: true`; no optimizer deployed |
| Server Function endpoint disclosure | **No** | No server functions |
| **postcss** path traversal / XSS | **Build-time only** | Reads `sourceMappingURL` from CSS during build |
| **sharp** / libvips CVEs | **Build-time only** | Not deployed |
| **nanoid** infinite loop | **Build-time only** | Pulled in by postcss |

**Zero of the eight Next.js runtime advisories can execute on this deployment.** The three
build-time packages require attacker-controlled input to the build; all CSS here is
author-written.

**The remediation is not a patch.** `npm audit fix --dry-run` changes 15 packages, adds 45, and
leaves **all 4 highs**. The advisory range is `9.3.4-canary.0 – 16.3.0-preview.10`; installed is
`15.5.19`; latest is `16.3.3`. Clearing it means **Next 15 → 16, a major upgrade**, against a
site that just had 19 fixes verified and deployed.

**Why it matters** — honestly: mostly as a signal. An EM who runs `npm audit` on your repo sees
"4 high" and forms an impression before reading further. The actual runtime risk is near zero.

**Recommendation:** do the Next 16 upgrade **deliberately, on its own branch**, gated on the full
18-project matrix — not folded into an audit-repair pass. Treating it as urgent would trade real
regression risk for a theoretical exposure.
**Complexity:** Large (major version upgrade)

---

## Not proposed

**Next 15 → 16 upgrade as part of this audit.** It is the correct fix for `ETB-P6-02`, but
bundling a major framework upgrade into a remediation pass is how verified work gets silently
regressed. It deserves its own branch and its own verification cycle.

---

## Suspicious but actually fine

1. **Two `dangerouslySetInnerHTML` call sites.** Both safe.
   `layout.tsx:90` injects a hardcoded Safari UA-sniff string with no interpolation.
   `JsonLd.tsx:9-12` escapes `<`, U+2028 and U+2029 before injection — the correct defense against
   script-block termination, and commented as such. **Zero DOM XSS surface:** no `innerHTML`
   assignments, no `eval`, no `new Function` anywhere in shipped code.

2. **`archive/` might still deploy.** It does not — `out/archive` does not exist. Moving those
   sub-apps out of `public/` worked.

3. **`.vercel/project.json` might be committed.** It is not: `git ls-files | grep '^\.vercel'`
   returns nothing.

4. **Source maps might be exposed.** None: `find out -name "*.map"` → 0.

5. **Secrets in the built artifact.** Scanned `out/` for private-key headers and AWS/GitHub/OpenAI
   key patterns — clean.

6. **CSP looked permissive because of `'unsafe-inline'`.** It is required by Next's inline
   bootstrap, and on a site with no user input and no DOM XSS surface it is not exploitable. The
   rest of the policy is genuinely tight: `default-src 'self'`, `object-src 'none'`,
   `frame-ancestors 'none'`, `base-uri 'self'`, scoped `frame-src`/`connect-src`.

---

## Prepared changes

### [ ] 1 — Move personal photos out of `public/` and stop them deploying `ETB-P6-01`

**Files:** `public/Personal Photos/` → `archive/personal-photos/`; new `.vercelignore`; `.gitignore`

```
git mv-equivalent:  public/Personal Photos/  →  archive/personal-photos/
```

New `.vercelignore` (the CLI has no `.vercelignore` today, and does **not** reliably fall back to
`.gitignore` — which is exactly how these reached production):

```
archive/
legacy/
docs/
tests/
playwright*.config.ts
*.md
```

`.gitignore`: replace the now-stale `public/Personal Photos/` entry with a note pointing at
`archive/`, so the next person does not re-create the directory under `public/`.

- **Risk:** Low. Nothing in `src/` references these files (verified). `archive/` is already
  git-ignored.
- **Verification:** `npm run build` → `ls out/"Personal Photos"` must not exist; after deploy,
  re-fetch all five URLs and require **404**. A repo-side check is not sufficient — that is the
  mistake this finding came from.

### [ ] 2 — Add a regression guard so this cannot come back silently

**File:** `tests/audit/audit-regression.spec.ts`

A test asserting no path under `/Personal Photos/` resolves, and — more usefully — that the built
`out/` contains no file whose path matches known-private directory names.

- **Risk:** None.
- **Verification:** Fails against the current build, passes after change 1.

### [ ] 3 — Record the Next 16 upgrade as tracked work, not an audit fix `ETB-P6-02`

**File:** `docs/audit-status.md`

Add `ETB-P6-02` as **Pending — scheduled**, with the reachability table above, so the advisory is
visibly assessed rather than ignored, and the upgrade is planned rather than urgent.

- **Risk:** None (documentation).
- **Verification:** n/a.

---

## Status going into Report 2

`ETB-P3-01` is **escalated to P1 and re-designated `ETB-P6-01`** — confirmed live, not
hypothetical. `ETB-P6-02` is new. Step 0 (original feature suite) was still running when this
report was written; its result lands in Report 2.
