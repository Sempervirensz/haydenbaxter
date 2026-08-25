# CaseBrief mark — art direction

**Lab:** `/casebrief-mark-lab` · **Production page:** `/emerging-tech-builds/casebrief` — ships **A · Navy plinth**

## The question

Same question again, third set of answers. The CaseBrief mark is **not a
photograph**: it is a flat isometric render sitting on a perfectly uniform
navy field. Neither Cortex's feathering nor AtomicOS's black crush applies, and
neither is offered.

| # | Direction | What it does |
| --- | --- | --- |
| 1 | Current | Today's hero, as the baseline to argue against. |
| 2 | **A · Navy plinth** | The page adopts the mark's own `#00253c` for one panel. The cube sits large on it, title beside — no frame needed, because the panel *is* the frame. |
| 3 | **B · Corner monolith** | Full-bleed navy band, cube oversized and cropped by the right edge, fading to page black. Architectural rather than illustrative. |
| 4 | **C · Case stack** | Three navy cards fanned like files, the cube on the top one. The product's own metaphor: scattered records resolving into one case. Rotation held inside the house 1–2° rule. |
| 5 | **D · Chip lockup** | The restrained, most obviously shippable option. Cube at ~210px in a rounded navy chip, title beside, tags off the shared cobalt onto the cube's own green and teal. |

## The technique, measured

The navy is **flat**. Sampled at all four corners it is `#00253c` every time,
and it is 65% of the image's pixels.

That uniformity is the whole opportunity: **hand the mark's ground to the
page.** Paint a container `var(--cb-navy)` and the image's square edge stops
existing — no mask, no feather, no crush. It is why every direction here can
use a hard-edged panel where Cortex needed a soft one, and why A works with
literally no treatment of the image at all.

Sampled palette, all used as tokens on `.cb-skin`:

| token | value | where it came from |
| --- | --- | --- |
| `--cb-navy` | `#00253c` | the field, exact |
| `--cb-cream` | `#ebe4d8` | the C and B letterforms |
| `--cb-teal` | `#86bfc4` | top facet |
| `--cb-green` | `#4e9a3f` | left face |
| `--cb-blue` | `#2f6fb0` | right face |

## Shipped

**A · Navy plinth is live on `/emerging-tech-builds/casebrief`.** The page wraps `ProjectDetailPage` in
`<div className="cb-skin" data-cb-variant="plinth">` and passes
`hero={<CaseBriefMarkHero … variant="plinth" />}`. Everything else on the site is
untouched: the shared template still draws the default 96px seal for anything
that does not opt in.

The stylesheet is split so production does not carry the exploration:

| file | holds | imported by |
| --- | --- | --- |
| `casebrief-mark.css` | tokens + A · Navy plinth | the production page **and** the lab |
| `casebrief-directions.css` | every rejected direction | the lab only |

If you revisit this and pick differently, move that direction's rules from
`casebrief-directions.css` into `casebrief-mark.css` and change the `variant` in the page — do
not import the directions file from production.

## Moving between labs

The rail's top row switches projects — `/cortex-mark-lab`,
`/atomicos-mark-lab`, `/casebrief-mark-lab`. They are real `<Link>`s, not
state, so a shared URL lands on the lab it names. `←` / `→` cycle between them
and wrap; `1`–`n` still pick a direction within the current lab. The route list
lives in `../mark-lab/labs.ts`.

## Scope

CaseBrief only. Cortex and AtomicOS have their own folders, own heroes, own
stylesheets — everything here is scoped under `.cb-skin`. The three labs share
`../mark-lab/MarkLabShell` and nothing else, and that is a switcher, not a
design system.


## Not yet covered

ProcureBridge has a mark (`/assets/procurebridge-mark.webp`) but no detail
page, and OpenClaw has neither — so there is nothing for a lab to render
against. Both need a route and a `demo` record before they are worth
art-directing.
