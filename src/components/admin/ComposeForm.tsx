"use client";

import { useEffect, useMemo, useRef, useState } from "react";

const STORAGE_KEY = "compose-draft-v1";
const TODAY_ISO = () => new Date().toISOString().slice(0, 10);

type DraftState = {
  title: string;
  slug: string;
  date: string;
  excerpt: string;
  tags: string;
  author: string;
  body: string;
  imageDataUrl: string | null;
  imageName: string | null;
};

const EMPTY: DraftState = {
  title: "",
  slug: "",
  date: TODAY_ISO(),
  excerpt: "",
  tags: "",
  author: "Hayden Baxter",
  body: "",
  imageDataUrl: null,
  imageName: null,
};

function slugify(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 80);
}

function formatDateForDisplay(iso: string): string {
  if (!iso) return "";
  const d = new Date(iso + "T00:00:00");
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
}

function parseTags(raw: string): string[] {
  return raw
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);
}

type Block = { type: "heading" | "paragraph"; text: string };

function parseBody(raw: string): Block[] {
  return raw
    .split(/\n{2,}/)
    .map((chunk) => chunk.trim())
    .filter(Boolean)
    .map((chunk) =>
      chunk.startsWith("## ")
        ? { type: "heading" as const, text: chunk.replace(/^##\s+/, "").trim() }
        : { type: "paragraph" as const, text: chunk.replace(/\s+/g, " ").trim() },
    );
}

function extOf(name: string | null): string {
  if (!name) return "jpg";
  const m = name.toLowerCase().match(/\.([a-z0-9]+)$/);
  return m ? m[1] : "jpg";
}

function escapeForTemplate(s: string): string {
  return s.replace(/\\/g, "\\\\").replace(/`/g, "\\`").replace(/\$\{/g, "\\${");
}

function buildSnippet(d: DraftState): string {
  const slug = d.slug || slugify(d.title);
  const ext = extOf(d.imageName);
  const imagePath = `/images/blog/${slug}.${ext}`;
  const tags = parseTags(d.tags);
  const blocks = parseBody(d.body);
  const tagsCode =
    tags.length === 0
      ? "[]"
      : `[\n      ${tags.map((t) => JSON.stringify(t)).join(",\n      ")},\n    ]`;
  const bodyCode =
    blocks.length === 0
      ? "[]"
      : `[\n${blocks
          .map(
            (b) =>
              `      { type: ${JSON.stringify(b.type)}, text: \`${escapeForTemplate(b.text)}\` },`,
          )
          .join("\n")}\n    ]`;

  return `  {
    slug: ${JSON.stringify(slug)},
    title: ${JSON.stringify(d.title)},
    date: ${JSON.stringify(formatDateForDisplay(d.date))},
    excerpt: ${JSON.stringify(d.excerpt)},
    tags: ${tagsCode},
    thumbnail: ${JSON.stringify(imagePath)},
    hero: ${JSON.stringify(imagePath)},
    author: ${JSON.stringify(d.author || "Hayden Baxter")},
    body: ${bodyCode},
  },`;
}

type Status =
  | { kind: "idle" }
  | { kind: "publishing" }
  | { kind: "ok"; message: string }
  | { kind: "err"; message: string };

export default function ComposeForm() {
  const [draft, setDraft] = useState<DraftState>(EMPTY);
  const [hydrated, setHydrated] = useState(false);
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const [showSnippet, setShowSnippet] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setDraft({ ...EMPTY, ...JSON.parse(raw) });
    } catch {}
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
    } catch {}
  }, [draft, hydrated]);

  const slugAuto = useMemo(() => slugify(draft.title), [draft.title]);
  const effectiveSlug = draft.slug || slugAuto;
  const snippet = useMemo(() => buildSnippet(draft), [draft]);
  const blockCount = useMemo(() => parseBody(draft.body).length, [draft.body]);
  const wordCount = useMemo(
    () => (draft.body.trim() ? draft.body.trim().split(/\s+/).length : 0),
    [draft.body],
  );

  function patch<K extends keyof DraftState>(key: K, value: DraftState[K]) {
    setDraft((d) => ({ ...d, [key]: value }));
  }

  function onPickImage(file: File) {
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = typeof reader.result === "string" ? reader.result : null;
      setDraft((d) => ({ ...d, imageDataUrl: dataUrl, imageName: file.name }));
    };
    reader.readAsDataURL(file);
  }

  function onClearImage() {
    setDraft((d) => ({ ...d, imageDataUrl: null, imageName: null }));
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function resetDraft() {
    if (!confirm("Discard the current draft?")) return;
    setDraft(EMPTY);
    if (fileInputRef.current) fileInputRef.current.value = "";
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {}
  }

  async function copySnippet() {
    if (!draft.title.trim()) {
      setStatus({ kind: "err", message: "Title is required before copying." });
      return;
    }
    if (!effectiveSlug) {
      setStatus({ kind: "err", message: "Slug could not be derived from the title." });
      return;
    }
    try {
      await navigator.clipboard.writeText(snippet);
      setStatus({
        kind: "ok",
        message: `Snippet copied — paste it after the COMPOSE_INSERT_BELOW marker in src/data/journal.ts.`,
      });
    } catch {
      setStatus({
        kind: "err",
        message: "Could not copy. Use the snippet box below and copy manually.",
      });
      setShowSnippet(true);
    }
  }

  function downloadImage() {
    if (!draft.imageDataUrl) return;
    const a = document.createElement("a");
    a.href = draft.imageDataUrl;
    a.download = `${effectiveSlug || "post"}.${extOf(draft.imageName)}`;
    document.body.appendChild(a);
    a.click();
    a.remove();
  }

  async function publishToSite() {
    if (!draft.title.trim()) {
      setStatus({ kind: "err", message: "Title is required." });
      return;
    }
    if (!effectiveSlug) {
      setStatus({ kind: "err", message: "Slug could not be derived from the title." });
      return;
    }
    if (!draft.imageDataUrl) {
      setStatus({ kind: "err", message: "Hero image is required." });
      return;
    }
    if (!draft.body.trim()) {
      setStatus({ kind: "err", message: "Body is required." });
      return;
    }
    setStatus({ kind: "publishing" });
    try {
      const res = await fetch("/api/admin/publish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slug: effectiveSlug,
          imageDataUrl: draft.imageDataUrl,
          imageExt: extOf(draft.imageName),
          snippet,
        }),
      });
      const json = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        error?: string;
      };
      if (!res.ok || !json.ok) {
        throw new Error(json.error || `Publish failed (${res.status})`);
      }
      setStatus({
        kind: "ok",
        message: `Published. Files written: src/data/journal.ts and public/images/blog/${effectiveSlug}.${extOf(draft.imageName)}. Now run: git add -A && git commit -m "blog: ${effectiveSlug}" && git push`,
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Publish failed";
      setStatus({ kind: "err", message });
    }
  }

  return (
    <div className="cmp">
      <div className="cmp__grid">
        <div className="cmp__col">
          <Field label="Title" required>
            <input
              value={draft.title}
              onChange={(e) => patch("title", e.target.value)}
              placeholder="Transparency as a Product"
              className="cmp__input"
            />
          </Field>

          <Field
            label="Slug"
            hint={draft.slug ? "Custom slug" : `Auto from title: ${slugAuto || "—"}`}
          >
            <input
              value={draft.slug}
              onChange={(e) => patch("slug", slugify(e.target.value))}
              placeholder={slugAuto || "url-safe-slug"}
              className="cmp__input"
            />
          </Field>

          <div className="cmp__row2">
            <Field label="Date" required>
              <input
                type="date"
                value={draft.date}
                onChange={(e) => patch("date", e.target.value)}
                className="cmp__input"
              />
            </Field>
            <Field label="Author">
              <input
                value={draft.author}
                onChange={(e) => patch("author", e.target.value)}
                placeholder="Hayden Baxter"
                className="cmp__input"
              />
            </Field>
          </div>

          <Field
            label="Excerpt"
            hint="One or two sentences shown on the card and under the title."
          >
            <textarea
              value={draft.excerpt}
              onChange={(e) => patch("excerpt", e.target.value)}
              rows={3}
              placeholder="Why authenticity signals matter as much as compliance checklists…"
              className="cmp__input"
            />
          </Field>

          <Field label="Tags" hint="Comma-separated. First three show on the card.">
            <input
              value={draft.tags}
              onChange={(e) => patch("tags", e.target.value)}
              placeholder="AI, Supply Chain, Strategy"
              className="cmp__input"
            />
            {parseTags(draft.tags).length > 0 && (
              <ul className="cmp__tagPreview">
                {parseTags(draft.tags).map((t) => (
                  <li key={t} className="cmp__tagChip">
                    {t}
                  </li>
                ))}
              </ul>
            )}
          </Field>
        </div>

        <div className="cmp__col">
          <Field
            label="Hero image"
            required
            hint="Used for the card thumbnail and the article hero. JPG / PNG / WebP."
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) onPickImage(file);
              }}
              className="cmp__file"
            />
            {draft.imageDataUrl && (
              <div className="cmp__previewWrap">
                <div className="cmp__preview">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={draft.imageDataUrl} alt="Hero preview" />
                </div>
                <div className="cmp__previewMeta">
                  <span className="cmp__previewPath">
                    Will save as{" "}
                    <code>
                      /images/blog/{effectiveSlug || "post"}.{extOf(draft.imageName)}
                    </code>
                  </span>
                  <button type="button" onClick={onClearImage} className="cmp__linkBtn">
                    Remove
                  </button>
                </div>
              </div>
            )}
          </Field>

          <Field
            label="Body"
            required
            hint={
              <>
                Separate paragraphs with a blank line. Start a line with{" "}
                <code className="cmp__codeInline">## </code> for a heading.
              </>
            }
          >
            <textarea
              value={draft.body}
              onChange={(e) => patch("body", e.target.value)}
              rows={18}
              placeholder={
                "Walk into any boutique and watch what happens when a buyer picks up an object…\n\n## Compliance is the floor\n\nCompliance gives you a checklist…"
              }
              className="cmp__input cmp__bodyArea"
            />
            <div className="cmp__counts">
              <span>{blockCount} blocks</span>
              <span>{wordCount} words</span>
            </div>
          </Field>
        </div>
      </div>

      <div className="cmp__actions">
        <button
          type="button"
          onClick={publishToSite}
          disabled={status.kind === "publishing"}
          className="cmp__btn cmp__btn--primary"
        >
          {status.kind === "publishing" ? "Publishing…" : "Publish to site"}
        </button>
        <button type="button" onClick={copySnippet} className="cmp__btn">
          Copy snippet
        </button>
        <button
          type="button"
          onClick={downloadImage}
          disabled={!draft.imageDataUrl}
          className="cmp__btn"
        >
          Download image
        </button>
        <button type="button" onClick={() => setShowSnippet((v) => !v)} className="cmp__btn">
          {showSnippet ? "Hide snippet" : "Show snippet"}
        </button>
        <button type="button" onClick={resetDraft} className="cmp__resetBtn">
          Reset draft
        </button>
      </div>

      {status.kind !== "idle" && (
        <div
          className={`cmp__status ${
            status.kind === "ok"
              ? "cmp__status--ok"
              : status.kind === "err"
                ? "cmp__status--err"
                : "cmp__status--info"
          }`}
        >
          {status.kind === "publishing"
            ? "Writing files…"
            : "message" in status
              ? status.message
              : ""}
        </div>
      )}

      <ol className="cmp__steps">
        <li>
          <strong>Publish to site</strong> writes{" "}
          <code className="cmp__codeInline">public/images/blog/{effectiveSlug || "post"}.{extOf(draft.imageName)}</code>{" "}
          and inserts the post snippet into{" "}
          <code className="cmp__codeInline">src/data/journal.ts</code>.
        </li>
        <li>
          Then commit and push to deploy:{" "}
          <code className="cmp__codeInline">
            {`git add -A && git commit -m "blog: ${effectiveSlug || "new-post"}" && git push`}
          </code>
        </li>
        <li>
          (Optional) <strong>Copy snippet</strong> / <strong>Download image</strong>{" "}
          give you the raw artifacts to paste manually if you ever need to.
        </li>
      </ol>

      {showSnippet && (
        <div className="cmp__snippetBox">
          <div className="cmp__snippetLabel">
            Snippet — paste into src/data/journal.ts
          </div>
          <pre className="cmp__snippetPre">{snippet}</pre>
        </div>
      )}
    </div>
  );
}

function Field({
  label,
  hint,
  required,
  children,
}: {
  label: string;
  hint?: React.ReactNode;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="cmp__field">
      <span className="cmp__label">
        {label}
        {required && <span className="cmp__req"> *</span>}
      </span>
      {children}
      {hint && <span className="cmp__hint">{hint}</span>}
    </label>
  );
}
