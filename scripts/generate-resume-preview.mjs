#!/usr/bin/env node
/**
 * Renders page 1 of the resume PDF to the WebP shown on /resume.
 *
 * Why an image and not the PDF itself: the site sends `X-Frame-Options: DENY`
 * and `frame-ancestors 'none'` on every response, so the PDF cannot be put in
 * an <iframe> or <object> without relaxing that hardening site-wide. For a
 * one-page resume an image is also the better preview — it renders on phones,
 * where iOS refuses inline PDFs outright, and it carries no viewer chrome.
 *
 * Two stages, both already in the toolchain:
 *   1. `qlmanage` (macOS QuickLook) rasterises the PDF from its vectors at a
 *      size we choose. This is why the script is a local dev tool and NOT part
 *      of `next build`: the generated WebP is committed, so Vercel's Linux
 *      builders never need to run this.
 *
 *      It used to be `sips --resampleWidth`, which looked equivalent and was
 *      not. sips rasterises a PDF at 72 DPI — 612x792 for a US Letter page —
 *      and `--resampleWidth` then INTERPOLATES that bitmap up. The output was
 *      1400px wide carrying 612px of real detail, so the preview arrived at
 *      roughly 40% of the resolution the page paints it at, and every glyph
 *      was soft. QuickLook re-renders from the vectors instead, so the pixels
 *      are real.
 *   2. `sharp` compresses to WebP, matching the house pattern recorded in
 *      next.config.ts ("real savings come from pre-compressed WebP").
 *
 * It also writes src/data/resumePreview.ts, which carries the image's real
 * dimensions (so the page reserves the box and shifts no layout) and the
 * SHA-256 of the PDF it was made from. `check:resume-preview` compares that
 * hash against the PDF on disk, so replacing the resume without re-running
 * this fails the check instead of silently leaving a preview of the old one.
 *
 *   node scripts/generate-resume-preview.mjs
 */
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const ROOT = path.resolve(fileURLToPath(new URL("..", import.meta.url)));
const PDF = path.join(ROOT, "public/documents/Hayden-Baxter-Resume.pdf");
const IMAGE_DIR = path.join(ROOT, "public/documents");
const OUT_DATA = path.join(ROOT, "src/data/resumePreview.ts");

/* The image filename carries a hash of the PDF it was rendered from.
 *
 * vercel.json rule 7 sends `public, max-age=31536000, immutable` for every
 * .webp on the site. At the old fixed filename that was a lie: the file is
 * regenerated whenever the resume changes, but every browser that had ever
 * loaded /resume was pinned to the previous image for a YEAR with no
 * revalidation. Shipping a new resume did not reach anyone who had already
 * visited. Found 2026-09-15, when the new resume went live and the old
 * preview kept showing.
 *
 * A new resume now produces a new URL, so `immutable` becomes true instead
 * of harmful and the caching is free. The page never hardcodes this name --
 * it reads RESUME_PREVIEW.src -- so nothing else has to know. */
const imageName = (sha) => `resume-preview.${sha.slice(0, 8)}.webp`;

// The viewer is capped at --content-narrow (46rem = 736px) and never grows,
// so 1472 is the most device pixels any 2x display can ask for. 1500 covers
// that with a hair to spare; going wider only adds weight no screen can show.
const RENDER_WIDTH = 1500;
// Rendered at 2x and downsampled, which is cheap here and antialiases the
// small type better than rendering straight to RENDER_WIDTH.
const SUPERSAMPLE = 2;
// 72, not the 82 this used to run at. Encoding a genuinely sharp render is
// more expensive than encoding a blurry one, and 82 pushed the file to
// 311 KB. At 1500px of real detail 72 is indistinguishable at 1:1, and the
// curve flattens below it — 66 saves only another 9 KB.
const WEBP_QUALITY = 72;

if (process.platform !== "darwin") {
  console.error(
    "generate-resume-preview: needs macOS `qlmanage` to rasterise the PDF.\n" +
      "The generated WebP is committed, so only regeneration needs a Mac."
  );
  process.exit(1);
}

if (!fs.existsSync(PDF)) {
  console.error(`generate-resume-preview: no PDF at ${path.relative(ROOT, PDF)}`);
  process.exit(1);
}

const pdfBytes = fs.readFileSync(PDF);
const sourceSha256 = createHash("sha256").update(pdfBytes).digest("hex");

const OUT_IMAGE = path.join(IMAGE_DIR, imageName(sourceSha256));
const PUBLIC_SRC = `/documents/${imageName(sourceSha256)}`;

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "resume-preview-"));

try {
  // -s is the LONGEST side, so a portrait page comes back narrower than this.
  // Deliberately generous: we only need it to clear RENDER_WIDTH.
  execFileSync("qlmanage", ["-t", "-s", String(RENDER_WIDTH * SUPERSAMPLE), "-o", tmp, PDF], {
    stdio: "pipe",
  });

  // qlmanage names its output after the source file and exits 0 even when it
  // has written nothing at all, so the file's existence is the real check.
  const tmpPng = path.join(tmp, `${path.basename(PDF)}.png`);
  if (!fs.existsSync(tmpPng)) {
    console.error("generate-resume-preview: qlmanage rasterised nothing. Is the PDF readable?");
    process.exit(1);
  }

  const rendered = await sharp(tmpPng).metadata();
  if (rendered.width < RENDER_WIDTH) {
    // Refusing to upscale is the entire point of this rewrite: silently
    // enlarging a small render is what made the old preview look washed out.
    console.error(
      `generate-resume-preview: QuickLook returned ${rendered.width}px, under the ` +
        `${RENDER_WIDTH}px target. Refusing to upscale — that is the bug this replaced.`
    );
    process.exit(1);
  }

  await sharp(tmpPng)
    .flatten({ background: "#ffffff" })
    .resize({ width: RENDER_WIDTH })
    .webp({ quality: WEBP_QUALITY })
    .toFile(OUT_IMAGE);

  const { width, height } = await sharp(OUT_IMAGE).metadata();
  const bytes = fs.statSync(OUT_IMAGE).size;

  // Hashed names accumulate. Only the current one is referenced, so drop
  // the rest rather than leaving dead weight in the deploy.
  const stale = fs
    .readdirSync(IMAGE_DIR)
    .filter((f) => /^resume-preview\.[0-9a-f]{8}\.webp$|^resume-preview\.webp$/.test(f))
    .filter((f) => f !== path.basename(OUT_IMAGE));
  for (const f of stale) fs.rmSync(path.join(IMAGE_DIR, f));

  fs.writeFileSync(
    OUT_DATA,
    `/* GENERATED by scripts/generate-resume-preview.mjs — do not edit by hand.
 *
 * Re-run \`npm run gen:resume-preview\` after replacing the resume PDF.
 * \`npm run check\` fails if sourceSha256 no longer matches the PDF on disk.
 *
 * \`src\` is hashed on purpose -- see the note in the generator. Never pin
 * this filename anywhere; read it from here.
 */

export const RESUME_PREVIEW = {
  src: "${PUBLIC_SRC}",
  width: ${width},
  height: ${height},
  /** SHA-256 of the PDF this image was rendered from. */
  sourceSha256: "${sourceSha256}",
} as const;
`
  );

  console.log(
    `resume preview: ${width}x${height} WebP from a ${rendered.width}px render, ` +
      `${Math.round(bytes / 1024)} KB\n` +
      `  ${path.relative(ROOT, OUT_IMAGE)}` +
      `${stale.length ? ` (removed ${stale.length} stale)` : ""}\n` +
      `  ${path.relative(ROOT, OUT_DATA)} (pdf ${sourceSha256.slice(0, 12)}…)`
  );
} finally {
  fs.rmSync(tmp, { recursive: true, force: true });
}
