// Extracts the SHIPPED consulting scheme out of the lab stylesheet.
//
// The lab at /consulting-paths-lab carries every direction, palette, surface,
// type scheme, button recipe, track style and play key — 159KB of CSS, 34KB
// gzipped — because comparing them is what it is for. Production wants exactly
// one combination of those, so this copies out the rules that belong to it and
// drops the rest.
//
// THE ONE RULE THIS FOLLOWS: a selector that survives is copied BYTE-IDENTICAL,
// and source order is preserved. It never rewrites a selector to remove the
// axis attributes it matched on, because dropping an attribute drops a point of
// specificity — and rules that used to tie and resolve by source order start
// resolving the other way. That failure is silent, it looks like a styling bug
// three directions away from the change, and this project has already paid for
// it twice: the candy bar's unreadable selected state, and the numeral that
// would not move to the top of its column.
//
// So production renders the axis attributes hard-coded on the same elements the
// lab does, and the cascade here is the cascade there.
//
//   node scripts/extract-consulting-scheme.mjs

import { readFileSync, writeFileSync } from "node:fs";

const SRC = "src/components/consulting-paths-lab/consulting-paths-lab.css";
const OUT = "src/components/work/consulting-paths.css";

/** The shipped scheme. Change these and re-run to ship a different one. */
const SCHEME = {
  "data-layout": "tracklist",
  "data-palette": "cobalt-brass",
  "data-surface": "paper",
  "data-type": "house",
  "data-button": "cue",
  "data-row-button": "rule",
  "data-track": "player",
  "data-key": "plain",
  "data-rows": "skin",
  // Promoted from /consulting-color-lab. `data-system` is everything that
  // ports to all three destination screens; `data-actions` is the button row
  // alone, so the row can change without touching the system.
  "data-system": "drafting",
  "data-actions": "rule",
};

/** Lab chrome — the control panel and the framing around the stage. */
const LAB_ONLY = /\.cpl-(root|panel|toggle|group|frame|stages)\b/;

function parse(css) {
  const nodes = [];
  let i = 0;
  while (i < css.length) {
    if (css.startsWith("/*", i)) {
      const end = css.indexOf("*/", i + 2);
      const stop = end === -1 ? css.length : end + 2;
      nodes.push({ type: "comment", text: css.slice(i, stop) });
      i = stop;
      continue;
    }
    if (/\s/.test(css[i])) {
      let j = i;
      while (j < css.length && /\s/.test(css[j])) j++;
      nodes.push({ type: "space", text: css.slice(i, j) });
      i = j;
      continue;
    }
    let j = i, depth = 0, inStr = null;
    while (j < css.length) {
      // Comments first. This file's prose is full of apostrophes — "the row's
      // own wash" — and a scanner that tracks quotes but not comments treats
      // one of those as an opening string delimiter and swallows every brace
      // until the next apostrophe. That is how a 700-rule stylesheet parsed as
      // 40 rules and the filter appeared to do nothing.
      if (!inStr && css.startsWith("/*", j)) {
        const end = css.indexOf("*/", j + 2);
        j = end === -1 ? css.length : end + 2;
        continue;
      }
      const c = css[j];
      if (inStr) { if (c === inStr && css[j - 1] !== "\\") inStr = null; }
      else if (c === '"' || c === "'") inStr = c;
      else if (c === "{") { depth++; if (depth === 1) break; }
      else if (c === ";" && depth === 0) break;
      j++;
    }
    const prelude = css.slice(i, j).trim();
    if (css[j] !== "{") {
      nodes.push({ type: "statement", text: css.slice(i, j + 1) });
      i = j + 1;
      continue;
    }
    let k = j, d = 0;
    inStr = null;
    while (k < css.length) {
      if (!inStr && css.startsWith("/*", k)) {
        const end = css.indexOf("*/", k + 2);
        k = end === -1 ? css.length : end + 2;
        continue;
      }
      const c = css[k];
      if (inStr) { if (c === inStr && css[k - 1] !== "\\") inStr = null; }
      else if (c === '"' || c === "'") inStr = c;
      else if (c === "{") d++;
      else if (c === "}") { d--; if (d === 0) break; }
      k++;
    }
    nodes.push({
      type: prelude.startsWith("@") ? "atrule" : "rule",
      prelude,
      body: css.slice(j + 1, k),
      nested: /^@(container|media|supports|layer)/.test(prelude),
    });
    i = k + 1;
  }
  return nodes;
}

/** Split a selector list on top-level commas only. */
function splitSelectors(list) {
  const out = [];
  let depth = 0, start = 0;
  for (let i = 0; i < list.length; i++) {
    const c = list[i];
    if (c === "(" || c === "[") depth++;
    else if (c === ")" || c === "]") depth--;
    else if (c === "," && depth === 0) { out.push(list.slice(start, i)); start = i + 1; }
  }
  out.push(list.slice(start));
  return out.map((s) => s.trim()).filter(Boolean);
}

const AXIS_ATTR =
  /\[(data-(?:layout|palette|surface|type|button|row-button|track|key|rows|system|actions))="([^"]+)"\]/g;

function keepSelector(sel) {
  if (LAB_ONLY.test(sel)) return null;
  for (const m of sel.matchAll(AXIS_ATTR)) {
    if (SCHEME[m[1]] !== m[2]) return null;
  }
  // `.cpl-stage` is the lab's name for the element production calls `.wt`.
  // A class for a class — the swap costs no specificity.
  return sel.replace(/\.cpl-stage\b/g, ".wt");
}

function filterNodes(nodes) {
  const out = [];
  let pending = [];
  for (const node of nodes) {
    if (node.type === "comment") { pending.push(node); continue; }
    if (node.type === "space") { (pending.length ? pending : out).push(node); continue; }
    if (node.type === "rule") {
      const kept = splitSelectors(node.prelude).map(keepSelector).filter(Boolean);
      if (!kept.length) { pending = []; continue; }
      out.push(...pending); pending = [];
      out.push({ ...node, prelude: kept.join(",\n") });
      continue;
    }
    if (node.type === "atrule") {
      if (node.nested) {
        const inner = filterNodes(parse(node.body));
        if (!inner.some((n) => n.type === "rule" || n.type === "atrule")) { pending = []; continue; }
        out.push(...pending); pending = [];
        out.push({ ...node, body: stringify(inner) });
      } else {
        out.push(...pending); pending = [];
        out.push(node);
      }
      continue;
    }
    out.push(...pending); pending = [];
    out.push(node);
  }
  return out;
}

function stringify(nodes) {
  return nodes.map((n) =>
    n.type === "comment" || n.type === "space" || n.type === "statement"
      ? n.text
      : `${n.prelude} {${n.body}}`
  ).join("");
}

const src = readFileSync(SRC, "utf8");
const body = stringify(filterNodes(parse(src))).trim() + "\n";

const header = `/* ===========================================================================
   Consulting paths — the shipped scheme
   ===========================================================================

   GENERATED. Do not hand-edit: change it in the lab, confirm it there, then run

       node scripts/extract-consulting-scheme.mjs

   Source: src/components/consulting-paths-lab/consulting-paths-lab.css, which
   carries every direction, palette, surface, type scheme, button recipe, track
   style and play key. This file is the one combination the site ships:

${Object.entries(SCHEME).map(([k, v]) => `     ${k.padEnd(16)} ${v}`).join("\n")}

   Selectors are copied byte-identical, axis attributes included, and production
   renders those attributes hard-coded on the same elements the lab does. That is
   deliberate: stripping an attribute drops a point of specificity, and rules
   that tie and resolve by source order start resolving the other way — silently,
   and looking like a bug somewhere else entirely.
   ======================================================================== */

`;

writeFileSync(OUT, header + body);
const before = Buffer.byteLength(src), after = Buffer.byteLength(header + body);
console.log(`${OUT}\n  ${before} → ${after} bytes (${Math.round((1 - after / before) * 100)}% smaller)`);
