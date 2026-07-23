#!/usr/bin/env node
// Validates every /public asset reference in src/ against what git actually
// tracks — case-sensitively.
//
// Why this exists: macOS is case-insensitive, Vercel's Linux build is not. A
// reference to "/Consulting/hero.png" resolves fine here and 404s in
// production, and an asset that was never committed still renders locally
// because the file is sitting in your working directory. Both failure modes
// are invisible until after deploy, and both have bitten this repo.
//
// git's index is the authority: it is exactly what a fresh clone gets.
//
//   node scripts/check-assets.mjs        # exits 1 if anything is unresolvable

import { execFileSync } from "node:child_process";
import { readFileSync, existsSync, readdirSync } from "node:fs";
import { dirname, join, basename } from "node:path";

const SRC_EXT = new Set([".ts", ".tsx", ".css", ".js", ".jsx"]);
const ASSET_EXT =
  "png|jpe?g|webp|svg|gif|mp4|webm|woff2?|avif|ico|json|txt|xml";
const REF_RE = new RegExp(`["'(]\\s*(/[A-Za-z0-9_./%\\- ]+\\.(?:${ASSET_EXT}))`, "g");

// -z gives NUL-separated raw paths, sidestepping git's quoting of names with spaces.
const gitFiles = execFileSync("git", ["ls-files", "-z"], { encoding: "utf8" })
  .split("\0")
  .filter(Boolean);
const tracked = new Set(gitFiles);

const srcFiles = gitFiles.filter(
  (f) => f.startsWith("src/") && SRC_EXT.has(f.slice(f.lastIndexOf(".")))
);

const missing = [];   // referenced, not tracked at all
const caseOnly = [];  // tracked under a different case — the silent killer
const untracked = []; // on disk but not committed

const trackedLower = new Map();
for (const f of tracked) trackedLower.set(f.toLowerCase(), f);

for (const file of srcFiles) {
  if (!existsSync(file)) continue;
  const text = readFileSync(file, "utf8");
  for (const m of text.matchAll(REF_RE)) {
    const ref = decodeURIComponent(m[1]);
    const target = "public" + ref;
    if (tracked.has(target)) continue;

    const actual = trackedLower.get(target.toLowerCase());
    if (actual) caseOnly.push({ file, ref, actual: "/" + actual.slice("public/".length) });
    else if (existsSync(target)) untracked.push({ file, ref });
    else missing.push({ file, ref });
  }
}

// Separate hazard: a directory whose on-disk case differs from the index.
// git with core.ignorecase=true will not report this, and it makes every
// audit run against the filesystem give the wrong answer.
const dirCaseDrift = [];
const trackedDirs = new Set(gitFiles.filter((f) => f.startsWith("public/")).map(dirname));
for (const d of trackedDirs) {
  const parent = dirname(d);
  if (!existsSync(parent)) continue;
  const want = basename(d);
  const entries = readdirSync(parent);
  if (!entries.includes(want)) {
    const found = entries.find((e) => e.toLowerCase() === want.toLowerCase());
    if (found) dirCaseDrift.push({ tracked: d, onDisk: join(parent, found) });
  }
}

const report = (title, rows, fmt) => {
  if (!rows.length) return;
  console.error(`\n${title}`);
  for (const r of rows) console.error("  " + fmt(r));
};

report("Referenced but NOT TRACKED — will 404 on a fresh clone:", untracked,
  (r) => `${r.ref}\n      <- ${r.file}   (file exists locally; run: git add public${r.ref})`);
report("Referenced with the WRONG CASE — resolves on macOS, 404s on Linux:", caseOnly,
  (r) => `${r.ref}  ->  should be  ${r.actual}\n      <- ${r.file}`);
report("Referenced but MISSING everywhere:", missing,
  (r) => `${r.ref}\n      <- ${r.file}`);
report("Directory case differs between git and your working copy:", dirCaseDrift,
  (r) => `git has "${r.tracked}" but disk has "${r.onDisk}"`);

const total = untracked.length + caseOnly.length + missing.length + dirCaseDrift.length;
if (total === 0) {
  console.log(`Assets OK — every reference in ${srcFiles.length} source files resolves to a tracked file.`);
  process.exit(0);
}
console.error(`\n${total} problem(s) found.\n`);
process.exit(1);
