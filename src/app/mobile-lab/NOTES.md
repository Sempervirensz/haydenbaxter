# Mobile Lab — /mobile-lab

Experimental mobile-native homepage: a **cinematic field guide** assembled
from the site's real visual identity. Isolated from production — nothing here
is imported by the live homepage (the lab imports FROM production, never the
reverse).

## V2 — what changed from V1

V1 was a generic dark accordion page. V2 rebuilds every section from the
deployed site's actual DNA:

| Site signature | Where it came from | Where it lives in the lab |
|---|---|---|
| Suede Work landing | `.work__screen--landing` + `/usethisbackground.png` | `.mlab-landing` |
| Gold track numbers + serif list | `.wl-c2__*` mobile fork (`#cba86a`) | `.mlab-c2` |
| Discman + printed disc | `/playershellpngtransparent.png` + `/cd-disc-final.png`, prod geometry (55% / 50.25% / 87%) | `.mlab-player` |
| Marker "now playing" label | `.cd-active-label` (Permanent Marker font) | `.mlab-player-label` |
| Frosted glass pill | `.pd-full__tagline` mobile pill | `.mlab-pill` |
| White tape project labels | ETB mobile project buttons | `.mlab-tape` |
| Journey timeline rail | sc-journey mobile layout | `.mlab-tl` |
| Playing-card deck | soft-lock `CardDeck` back assets | `.mlab-cards` (as section shortcuts) |
| Wordmark + glass hamburger | production `Navbar` mobile | `.mlab-topbar` |
| Brands carousel | `BrandsCarousel` | imported directly, untouched |
| DYMO tags | global `.tag` / `.tag--cta` | reused directly |
| Statue-over-city consulting | `/Consulting/mobile-statue.png` + `#02021E` | `.mlab-detail--cns` |
| Connect grid + Calendly | `CONNECT_LINKS` / `CALENDLY_URL` from `src/data/connect.ts` | `.mlab-connect` |

Copy is derived from `WORK_SCREENS` (src/data/work.ts) at module load, so the
lab always shows production content.

## Files

| File | Role |
|---|---|
| `src/app/mobile-lab/page.tsx` | Route (noindex; also in `NON_PUBLIC_PREFIXES`) |
| `src/components/mobile-lab/MobileLab.tsx` | Lab shell: phone frame + CD-mode controls (lab-only) |
| `src/components/mobile-lab/MobileExperience.tsx` | The mobile flow itself |
| `src/components/mobile-lab/CdArtifact.tsx` | CD system: player landing / mini dock / track sheet |
| `src/components/mobile-lab/GlobeModule.tsx` | Deferred-load wrapper around the production globe |
| `src/components/mobile-lab/mobile-lab.css` | All styles, `.mlab-` prefixed |
| `src/data/mobileLab.ts` | Mobile glue copy; canonical content derived from `WORK_SCREENS` |

## The flow

1. **Top bar** — wordmark + glass circular menu (menu opens the track sheet,
   merging navigation with the CD metaphor).
2. **Hero** — production eyebrow + serif positioning line, centered like the
   deployed site; DYMO Resume / Book a Call; proof chips (Nike · Disney · AI
   Systems · Global Supply Chain).
3. **Card strip** — the four soft-lock playing cards (production CARDS faces
   + backs). Tapping jumps to a track; visiting a section flips its card
   face-up — the mobile version of the flip-all-four entry ritual. All four
   flipped swaps the marker caption to a book-a-call nudge.
4. **Brands** — the production carousel component, untouched.
5. **CD player landing** — suede card, kicker, gold-numbered serif track list
   (tap to jump), Discman shell with the printed disc. The disc is a
   **scroll scrubber**: rotation is driven by `--mlab-spin` (a rAF scroll
   handler writes CSS vars to the frame — no React re-renders), mirroring
   the production `--cd-deg` pattern. Tapping the player "plays" the NEXT
   track in sequence. Marker-font "now playing — {section}" label.
6. **Four detail sections** — flat dark with hairline separators (exactly the
   deployed mobile treatment): WorldPulse (gold logo head, prod copy, coastal
   photo + ORIGIN MATTERS pill, link out) → ETB (credibility line, intro,
   white tape labels linking to the real `/emerging-tech-builds/*` pages,
   coming-soon tapes dimmed) → Supply Chain (deferred globe + journey
   timeline rail + quote-line hierarchy) → Consulting (statue photo on navy;
   the EXPLORE WHAT'S POSSIBLE pill is a real control that reveals the offer
   tapes, like the production dossier).
7. **About** — one-line bio + three photos from the production gallery.
8. **Connect** — serif heading, the real connect grid (LinkedIn / WorldPulse /
   Email / WhatsApp / WeChat + id), Book a Call → Calendly.

## Performance notes

- The six signature assets were converted to resized WebP (25.3MB of PNG →
  ~0.6MB total). **Production references were updated too** (globals.css
  landing/disc, WorkSection/WorkLanding shell+foreground, work.ts coastal,
  CinematicCardBody, consulting-hero-transition.css — which also had a
  case-broken `/consulting/` path, now fixed). Original PNGs remain in
  /public for the other labs.
- Below-fold images use `loading="lazy"` + real intrinsic dimensions.
- The mini dock hides while the big player is on screen (one CD at a time)
  and respects `safe-area-inset-bottom`.
- The track sheet moves focus into the dialog on open and restores it on
  close; ESC closes.
- `content-visibility: auto` on sections was tried and reverted — it
  layout-thrashes against the per-frame offset reads in the jump animation.

## CD treatments (toggle in the lab panel)

- **A · Player + mini dock** — landing plus a sticky mini disc with a
  progress ring; tap opens the bottom-sheet track list.
- **B · Player only** — the landing is the sole CD moment; the sheet stays
  reachable via the glass menu button.
- **C · No CD** — skips the landing; baseline for judging the metaphor.

## Promotion candidates ([PROMOTABLE])

- **Compact CD player landing** — the production Work intro at a fraction of
  the scroll cost (no 500vh scroll-lock); tap-based instead.
- **Deferred-load globe** (`GlobeModule.tsx`) — wraps the untouched
  production `RealisticGlobe`; promotion is just moving the wrapper.
- **Section structure/copy derivation** — pulling from `WORK_SCREENS` keeps
  one source of truth.
- **Timeline rail, tape labels, glass pill** — already production recipes;
  the lab only re-scopes them for a standalone scroll container.
- **CSS grain** — data-URI SVG turbulence, no asset.

## Lab-only ([EXPERIMENT])

- `MobileLab.tsx` shell, phone frame, control panel.
- The card-strip shortcuts (delightful, but unproven — test whether people
  understand them as navigation).
- Whichever CD treatments lose. Winner gets extracted into its own
  production component; the rest of `CdArtifact.tsx` is deleted.

## Open questions

- Card strip: navigation or decoration? Needs a user test.
- Resume CTA target is a placeholder (`#`) — no resume asset in `/public` yet.
- Should the landing replace the production mobile Work intro (which spends
  real scroll on the same elements), or live above it?
