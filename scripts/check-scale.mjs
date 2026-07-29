#!/usr/bin/env node
// Guards the fluid scale system (src/styles/scale.css) against silent decay.
//
// Why this exists: large-display regressions are invisible on the machine that
// creates them. Someone writes `font-size: 10px` or `max-width: 900px`, it
// looks correct on a laptop, ships, and the site quietly re-strands itself on a
// 1440p or 4K panel. Nobody notices for months because nobody develops at 4K.
//
// That is exactly how the site got into the state this system was built to fix:
// no breakpoint above 1100px, container caps at ~1200px, and 387 hardcoded
// sub-14px font sizes — every one of which looked fine when it was written.
//
// Two rules, both scoped to the public surface and both skipped inside
// `max-width` media queries (deliberate mobile sizing is not a regression):
//
//   1. No fixed font-size below 14px. Use a --text-* token; they carry the
//      readability floors. Also catches `clamp(..., <15px)`, whose ceiling is
//      the value that actually renders on a large display.
//   2. No flat `max-width` container cap of 600px or more. Use a --content-*
//      token or a `ch` measure so the container tracks the type ramp.
//
// Escape hatch for a genuine exception — put it on the same line:
//
//   font-size: 9px; /* scale-ok: legal disclaimer, never a reading target */
//
//   node scripts/check-scale.mjs     # exits 1 on any violation

import { readFileSync } from "node:fs";
import { execFileSync } from "node:child_process";

// The stylesheets reachable from a public route. Lab-only stylesheets are
// deliberately excluded — they are scaffolding, and holding them to the public
// site's readability floors would be noise. Add to this list when a lab
// stylesheet starts shipping on a real page (design-lab.css is here because
// SoftLockGate wraps the homepage).
const PUBLIC_CSS = [
  "src/app/globals.css",
  "src/styles/scale.css",
  "src/styles/work-details.css",
  "src/components/site-footer.css",
  "src/components/work/cinematic-work-stack.css",
  "src/components/work/work-together.css",
  "src/components/design-lab/design-lab.css",
  // Route-scoped stylesheet. It was missing from this list, which is exactly
  // how it kept an 11.52px eyebrow on a public page indefinitely — the guard
  // was never looking at the file.
  "src/app/privacy/privacy.css",
];

// JSX carrying fixed type escapes CSS review entirely — two Tailwind
// `text-[10px]` captions survived a full CSS sweep because nothing was looking
// in .tsx files.
const TSX_GLOB = /^src\/(app|components)\/.*\.tsx$/;

// Lab routes, the dev-only admin composer, and anything named *-lab. These are
// scaffolding the owner uses, not pages visitors see. A guard that shouts about
// them is a guard that gets muted, and then it protects nothing.
const LAB_PATH =
  /(^src\/app\/lab\/|^src\/app\/admin\/|[-/]lab[-/]|-lab\/|\.dev\.tsx?$|site-parallax-lab|scroll-lab|cta-lab|design-lab\/(?!SoftLockGate)|work-fidelity|worldpulse-hero-lab|sc-lab)/;

// Same idea inside a shared stylesheet: globals.css holds the admin composer's
// `.cmp__*` rules, and design-lab.css is mostly lab furniture with only the
// `.dlab-soft*` soft-lock gate reaching the homepage.
// `.dlab__*` is the lab page's own chrome; `.dlab-soft*` is the shipped gate.
// `.cstack__dock*`/`__dial*`/`__toggle` is the intensity dock, rendered only
// when CinematicWorkStack gets `lab && !embedded`.
// `hb-handwriting-lab` is here for a different reason than the rest: it is not
// scaffolding, it is DEAD. The class appears nowhere outside globals.css, so no
// route can render it and its type sizes cannot reach a visitor. It is excluded
// rather than fixed so the guard reports only live surfaces; the block itself
// should be deleted.
const LAB_SELECTOR =
  /^\.(cmp[-_]|dlab__|dlab-(?!soft)|dlab-thresh|rv__|wf-|wfl-|scs-lab|admin|hb-handwriting-lab|cstack__(dock|dial|toggle))/;

// The site never overrides the root font-size, so 1rem is the browser default.
const REM_PX = 16;
const MIN_FONT_PX = 14;
const MIN_CLAMP_CEILING_PX = 15;
const CONTAINER_CAP_PX = 600;
const OK = /scale-ok:/;

const problems = [];

function scanCss(file) {
  let text;
  try {
    text = readFileSync(file, "utf8");
  } catch {
    return; // File list is checked against git below; a missing file is reported there.
  }

  let depth = 0;
  // Stack of [depthAtOpen, isMaxWidthQuery] so nested queries unwind correctly.
  const media = [];
  let selector = "";

  text.split("\n").forEach((line, i) => {
    const trimmed = line.trim();
    // `@container (max-width: …)` narrows a component exactly like a media
    // query does, so it gets the same exemption — treating it as a normal block
    // made the guard flag the query line itself as a container cap.
    if (/^@(media|container)\b/.test(trimmed)) {
      media.push([depth, /max-width/.test(trimmed)]);
    } else {
      const sel = trimmed.match(/^([.#][^{]*?)\s*\{/);
      if (sel) selector = sel[1].trim();
    }

    const inMobileQuery = media.some(([, isMax]) => isMax);
    const report = (msg) => problems.push({ file, line: i + 1, msg, src: trimmed });

    if (!inMobileQuery && !OK.test(line) && !LAB_SELECTOR.test(selector)) {
      const fixed = line.match(/font-size:\s*([0-9.]+)px/);
      if (fixed && parseFloat(fixed[1]) < MIN_FONT_PX) {
        report(`fixed font-size ${fixed[1]}px is below the ${MIN_FONT_PX}px floor — use a --text-* token`);
      }

      // Same rule in rem. Checking only `px` is what let privacy.css ship
      // `font-size: 0.72rem` — 11.52px on every display, including 4K —
      // straight past a guard whose whole job was to catch that.
      const fixedRem = line.match(/font-size:\s*([0-9.]+)rem/);
      if (fixedRem && parseFloat(fixedRem[1]) * REM_PX < MIN_FONT_PX) {
        const px = (parseFloat(fixedRem[1]) * REM_PX).toFixed(2);
        report(`fixed font-size ${fixedRem[1]}rem (${px}px) is below the ${MIN_FONT_PX}px floor — use a --text-* token`);
      }

      // Only the clamp ceiling matters here: it is what renders once the
      // viewport is wide enough, i.e. on every display this guard protects.
      const clamped = line.match(/font-size:\s*clamp\([^)]*?,\s*([0-9.]+)px\s*\)/);
      if (clamped && parseFloat(clamped[1]) < MIN_CLAMP_CEILING_PX) {
        report(`clamp() ceiling of ${clamped[1]}px stops scaling too early — use a --text-* token`);
      }

      const clampedRem = line.match(/font-size:\s*clamp\([^)]*?,\s*([0-9.]+)rem\s*\)/);
      if (clampedRem && parseFloat(clampedRem[1]) * REM_PX < MIN_CLAMP_CEILING_PX) {
        const px = (parseFloat(clampedRem[1]) * REM_PX).toFixed(2);
        report(`clamp() ceiling of ${clampedRem[1]}rem (${px}px) stops scaling too early — use a --text-* token`);
      }

      const cap = line.match(/max-width:\s*([0-9.]+)px/);
      if (cap && parseFloat(cap[1]) >= CONTAINER_CAP_PX) {
        report(`flat container cap of ${cap[1]}px — use a --content-* token or a ch measure`);
      }
    }

    depth += (line.match(/\{/g) || []).length - (line.match(/\}/g) || []).length;
    while (media.length && depth <= media[media.length - 1][0]) media.pop();
  });
}

function scanTsx(file) {
  const text = readFileSync(file, "utf8");
  text.split("\n").forEach((line, i) => {
    if (OK.test(line)) return;
    // Tailwind arbitrary type: text-[10px]. `sm:` and up are desktop-facing;
    // an unprefixed value applies at every width, so both are worth flagging.
    for (const m of line.matchAll(/(?:^|[\s"'`])((?:sm:|md:|lg:|xl:)?)text-\[([0-9.]+)px\]/g)) {
      if (parseFloat(m[2]) < MIN_FONT_PX) {
        problems.push({
          file,
          line: i + 1,
          msg: `Tailwind ${m[1]}text-[${m[2]}px] is below the ${MIN_FONT_PX}px floor — use a class with a --text-* token`,
          src: line.trim(),
        });
      }
    }
  });
}

// git's index is the authority on what actually ships, same as check-assets.mjs.
const tracked = new Set(
  execFileSync("git", ["ls-files", "-z"], { encoding: "utf8" }).split("\0").filter(Boolean)
);

const missing = PUBLIC_CSS.filter((f) => !tracked.has(f));
if (missing.length) {
  console.error("check-scale: PUBLIC_CSS lists files git does not track:");
  for (const f of missing) console.error(`  ${f}`);
  console.error("Update the list in scripts/check-scale.mjs.\n");
  process.exit(1);
}

PUBLIC_CSS.forEach(scanCss);
[...tracked]
  .filter((f) => TSX_GLOB.test(f) && !LAB_PATH.test(f))
  .forEach(scanTsx);

if (!problems.length) {
  console.log(
    `check-scale: OK — ${PUBLIC_CSS.length} public stylesheets and all src .tsx clear.`
  );
  process.exit(0);
}

console.error(`check-scale: ${problems.length} scaling regression(s)\n`);
for (const p of problems) {
  console.error(`  ${p.file}:${p.line}`);
  console.error(`    ${p.msg}`);
  console.error(`    ${p.src}\n`);
}
console.error("Tokens live in src/styles/scale.css.");
console.error("If a value is genuinely intentional, append: /* scale-ok: why */\n");
process.exit(1);
