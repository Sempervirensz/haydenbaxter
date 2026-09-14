#!/usr/bin/env node
/**
 * Fails if /resume is showing a preview of a resume that no longer exists.
 *
 * The preview on /resume is a rendered image, not the PDF, so nothing about
 * dropping in a new PDF forces the image to be regenerated — the page would
 * keep serving a picture of the old resume and look completely normal doing
 * it. That is the failure this guard exists to make impossible.
 *
 * generate-resume-preview.mjs records the SHA-256 of the PDF it rendered.
 * This compares that against the PDF on disk.
 *
 *   node scripts/check-resume-preview.mjs    # exits 1 on drift
 */
import { createHash } from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(fileURLToPath(new URL("..", import.meta.url)));
const PDF = path.join(ROOT, "public/documents/Hayden-Baxter-Resume.pdf");
const IMAGE = path.join(ROOT, "public/documents/resume-preview.webp");
const DATA = path.join(ROOT, "src/data/resumePreview.ts");

const fail = (msg) => {
  console.error(`check-resume-preview: ${msg}`);
  process.exit(1);
};

for (const [label, file] of [["resume PDF", PDF], ["preview image", IMAGE], ["preview data", DATA]]) {
  if (!fs.existsSync(file)) fail(`${label} missing at ${path.relative(ROOT, file)}`);
}

const recorded = /sourceSha256:\s*"([0-9a-f]{64})"/.exec(fs.readFileSync(DATA, "utf8"))?.[1];
if (!recorded) fail(`no sourceSha256 in ${path.relative(ROOT, DATA)} — regenerate it.`);

const actual = createHash("sha256").update(fs.readFileSync(PDF)).digest("hex");

if (actual !== recorded) {
  fail(
    "the resume PDF changed but its preview image did not.\n" +
      `  PDF on disk : ${actual.slice(0, 16)}…\n` +
      `  preview made from: ${recorded.slice(0, 16)}…\n` +
      "  Fix: npm run gen:resume-preview"
  );
}

console.log("check-resume-preview: OK — /resume preview matches the current PDF.");
