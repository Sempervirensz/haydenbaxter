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
  imageDataUrl?: string;
  imageExt?: string;
  snippet?: string;
};

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

  const { slug, imageDataUrl, imageExt, snippet } = body;

  if (!slug || !SLUG_RE.test(slug)) {
    return NextResponse.json({ ok: false, error: "Invalid slug" }, { status: 400 });
  }
  if (!snippet || !snippet.trim().startsWith("{")) {
    return NextResponse.json({ ok: false, error: "Invalid snippet" }, { status: 400 });
  }
  if (!imageDataUrl || !imageDataUrl.startsWith("data:image/")) {
    return NextResponse.json({ ok: false, error: "Invalid image" }, { status: 400 });
  }
  const ext = (imageExt || "jpg").toLowerCase().replace(/^\./, "");
  if (!ALLOWED_EXTS.has(ext)) {
    return NextResponse.json(
      { ok: false, error: `Image type .${ext} not allowed` },
      { status: 400 },
    );
  }

  const cwd = process.cwd();
  const journalPath = path.join(cwd, "src", "data", "journal.ts");
  const imagesDir = path.join(cwd, "public", "images", "blog");
  const imagePath = path.join(imagesDir, `${slug}.${ext}`);

  // Decode data URL → Buffer
  const commaIdx = imageDataUrl.indexOf(",");
  if (commaIdx === -1) {
    return NextResponse.json(
      { ok: false, error: "Malformed image data URL" },
      { status: 400 },
    );
  }
  const base64 = imageDataUrl.slice(commaIdx + 1);
  let buffer: Buffer;
  try {
    buffer = Buffer.from(base64, "base64");
  } catch {
    return NextResponse.json({ ok: false, error: "Could not decode image" }, { status: 400 });
  }
  if (buffer.length === 0 || buffer.length > MAX_IMAGE_BYTES) {
    return NextResponse.json(
      { ok: false, error: "Image must be > 0 and <= 8MB" },
      { status: 400 },
    );
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

  if (journal.includes(`slug: "${slug}"`) || journal.includes(`slug: '${slug}'`)) {
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

  const normalizedSnippet = snippet.replace(/^\n+|\n+$/g, "");
  const next = [
    ...lines.slice(0, markerIdx + 1),
    normalizedSnippet,
    ...lines.slice(markerIdx + 1),
  ].join("\n");

  try {
    await fs.mkdir(imagesDir, { recursive: true });
    await fs.writeFile(imagePath, buffer);
    await fs.writeFile(journalPath, next, "utf8");
  } catch (err) {
    const message = err instanceof Error ? err.message : "Write failed";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }

  return NextResponse.json({
    ok: true,
    wrote: {
      journal: path.relative(cwd, journalPath),
      image: path.relative(cwd, imagePath),
    },
  });
}
