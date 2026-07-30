import { NextResponse } from "next/server";
import { promises as fs } from "node:fs";
import path from "node:path";

// Dev-only publish handler. The .dev.ts extension keeps it out of static-export
// production builds (see pageExtensions in next.config.ts).

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const ALLOWED_EXTS = new Set(["jpg", "jpeg", "png", "webp", "avif", "gif"]);
const SLUG_RE = /^[a-z0-9](?:[a-z0-9-]{0,78}[a-z0-9])?$/;
const INSERT_MARKER = "// <COMPOSE_INSERT_BELOW>";
const MAX_IMAGE_BYTES = 8 * 1024 * 1024;

type Body = {
  slug?: string;
  oldSlug?: string | null;
  imageDataUrl?: string | null;
  imageExt?: string;
  snippet?: string;
};

function hasSlug(source: string, slug: string): boolean {
  return source.includes(`slug: "${slug}"`) || source.includes(`slug: '${slug}'`);
}

function findMatchingBrace(source: string, start: number): number {
  let depth = 0;
  let quote: "\"" | "'" | "`" | null = null;
  let escaped = false;
  let lineComment = false;
  let blockComment = false;

  for (let i = start; i < source.length; i += 1) {
    const ch = source[i];
    const next = source[i + 1];

    if (lineComment) {
      if (ch === "\n") lineComment = false;
      continue;
    }

    if (blockComment) {
      if (ch === "*" && next === "/") {
        blockComment = false;
        i += 1;
      }
      continue;
    }

    if (quote) {
      if (escaped) {
        escaped = false;
        continue;
      }
      if (ch === "\\") {
        escaped = true;
        continue;
      }
      if (ch === quote) quote = null;
      continue;
    }

    if (ch === "/" && next === "/") {
      lineComment = true;
      i += 1;
      continue;
    }

    if (ch === "/" && next === "*") {
      blockComment = true;
      i += 1;
      continue;
    }

    if (ch === "\"" || ch === "'" || ch === "`") {
      quote = ch;
      continue;
    }

    if (ch === "{") {
      depth += 1;
      continue;
    }

    if (ch === "}") {
      depth -= 1;
      if (depth === 0) return i + 1;
    }
  }

  return -1;
}

function findPostObjectRange(source: string, slug: string): { start: number; end: number } | null {
  const slugIdx = source.indexOf(`slug: "${slug}"`);
  const altSlugIdx = source.indexOf(`slug: '${slug}'`);
  const foundSlugIdx = slugIdx === -1 ? altSlugIdx : slugIdx;
  if (foundSlugIdx === -1) return null;

  const beforeSlug = source.slice(0, foundSlugIdx);
  const objectStarts = [...beforeSlug.matchAll(/\n {2}\{/g)];
  const lastStart = objectStarts.at(-1);
  if (!lastStart || lastStart.index === undefined) return null;

  const start = lastStart.index + 1;
  const braceEnd = findMatchingBrace(source, start);
  if (braceEnd === -1) return null;

  let end = braceEnd;
  while (source[end] === " " || source[end] === "\t") end += 1;
  if (source[end] === ",") end += 1;
  if (source[end] === "\r") end += 1;
  if (source[end] === "\n") end += 1;

  return { start, end };
}

export async function POST(req: Request) {
  if (process.env.NODE_ENV !== "development") {
    return NextResponse.json({ ok: false, error: "Disabled outside dev" }, { status: 404 });
  }

  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  const { slug, oldSlug, imageDataUrl, imageExt, snippet } = body;

  if (!slug || !SLUG_RE.test(slug)) {
    return NextResponse.json({ ok: false, error: "Invalid slug" }, { status: 400 });
  }
  if (oldSlug && !SLUG_RE.test(oldSlug)) {
    return NextResponse.json({ ok: false, error: "Invalid previous slug" }, { status: 400 });
  }
  if (!snippet || !snippet.trim().startsWith("{")) {
    return NextResponse.json({ ok: false, error: "Invalid snippet" }, { status: 400 });
  }

  const cwd = process.cwd();
  const journalPath = path.join(cwd, "src", "data", "journal.ts");
  const imagesDir = path.join(cwd, "public", "images", "blog");
  const ext = (imageExt || "jpg").toLowerCase().replace(/^\./, "");
  const imagePath = path.join(imagesDir, `${slug}.${ext}`);
  let imageBuffer: Buffer | null = null;

  if (imageDataUrl) {
    if (!imageDataUrl.startsWith("data:image/")) {
      return NextResponse.json({ ok: false, error: "Invalid image" }, { status: 400 });
    }
    if (!ALLOWED_EXTS.has(ext)) {
      return NextResponse.json(
        { ok: false, error: `Image type .${ext} not allowed` },
        { status: 400 },
      );
    }

    const commaIdx = imageDataUrl.indexOf(",");
    if (commaIdx === -1) {
      return NextResponse.json(
        { ok: false, error: "Malformed image data URL" },
        { status: 400 },
      );
    }

    try {
      imageBuffer = Buffer.from(imageDataUrl.slice(commaIdx + 1), "base64");
    } catch {
      return NextResponse.json({ ok: false, error: "Could not decode image" }, { status: 400 });
    }

    if (imageBuffer.length === 0 || imageBuffer.length > MAX_IMAGE_BYTES) {
      return NextResponse.json(
        { ok: false, error: "Image must be > 0 and <= 8MB" },
        { status: 400 },
      );
    }
  }

  let journal: string;
  try {
    journal = await fs.readFile(journalPath, "utf8");
  } catch {
    return NextResponse.json({ ok: false, error: "Cannot read journal.ts" }, { status: 500 });
  }

  if (!journal.includes(INSERT_MARKER)) {
    return NextResponse.json(
      { ok: false, error: `Insert marker missing in journal.ts: ${INSERT_MARKER}` },
      { status: 500 },
    );
  }

  const normalizedSnippet = snippet.replace(/^\n+|\n+$/g, "");
  let nextJournal: string;

  if (oldSlug) {
    if (oldSlug !== slug && hasSlug(journal, slug)) {
      return NextResponse.json(
        { ok: false, error: `Slug "${slug}" already exists in journal.ts` },
        { status: 409 },
      );
    }

    const range = findPostObjectRange(journal, oldSlug);
    if (!range) {
      return NextResponse.json(
        { ok: false, error: `Could not locate existing post "${oldSlug}"` },
        { status: 404 },
      );
    }

    nextJournal = journal.slice(0, range.start) + normalizedSnippet + "\n" + journal.slice(range.end);
  } else {
    if (hasSlug(journal, slug)) {
      return NextResponse.json(
        { ok: false, error: `Slug "${slug}" already exists in journal.ts` },
        { status: 409 },
      );
    }

    const lines = journal.split("\n");
    const markerIdx = lines.findIndex((l) => l.includes(INSERT_MARKER));
    if (markerIdx === -1) {
      return NextResponse.json(
        { ok: false, error: "Could not locate marker line" },
        { status: 500 },
      );
    }

    nextJournal = [
      ...lines.slice(0, markerIdx + 1),
      normalizedSnippet,
      ...lines.slice(markerIdx + 1),
    ].join("\n");
  }

  try {
    if (imageBuffer) {
      await fs.mkdir(imagesDir, { recursive: true });
      await fs.writeFile(imagePath, imageBuffer);
    }
    await fs.writeFile(journalPath, nextJournal, "utf8");
  } catch (err) {
    const message = err instanceof Error ? err.message : "Write failed";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }

  return NextResponse.json({
    ok: true,
    wrote: {
      journal: path.relative(cwd, journalPath),
      image: imageBuffer ? path.relative(cwd, imagePath) : null,
    },
  });
}
