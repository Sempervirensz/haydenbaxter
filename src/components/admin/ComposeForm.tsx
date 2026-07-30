"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { BlogBlock, JournalPost } from "@/data/journal";

const STORAGE_KEY = "compose-draft-v2";
const LEGACY_STORAGE_KEY = "compose-draft-v1";
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
  imagePath: string | null;
  sourceSlug: string | null;
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
  imagePath: null,
  sourceSlug: null,
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

function dateToInputValue(display: string): string {
  if (!display) return TODAY_ISO();
  if (/^\d{4}-\d{2}-\d{2}$/.test(display)) return display;
  const d = new Date(display);
  if (Number.isNaN(d.getTime())) return TODAY_ISO();
  return d.toISOString().slice(0, 10);
}

function parseTags(raw: string): string[] {
  return raw
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);
}

function collapsedListItems(text: string): string[] {
  const trimmed = text.trim();
  if (!trimmed.startsWith("- ")) return [];
  return trimmed
    .slice(2)
    .split(/\s+-\s+/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function bodyToEditor(blocks: BlogBlock[]): string {
  return blocks
    .map((block) => {
      if (block.type === "heading") return `## ${block.text}`;
      if (block.type === "list") return block.items.map((item) => `- ${item}`).join("\n");
      if (block.type === "quote") return `> ${block.text}`;

      const items = collapsedListItems(block.text);
      if (items.length > 1) return items.map((item) => `- ${item}`).join("\n");
      return block.text;
    })
    .join("\n\n");
}

function parseBody(raw: string): BlogBlock[] {
  return raw
    .split(/\n{2,}/)
    .map((chunk) => chunk.trim())
    .filter(Boolean)
    .map((chunk) => {
      const lines = chunk
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean);

      if (lines.length === 1 && lines[0].startsWith("## ")) {
        return { type: "heading" as const, text: lines[0].replace(/^##\s+/, "").trim() };
      }

      if (lines.length === 1 && lines[0].startsWith("> ")) {
        return { type: "quote" as const, text: lines[0].replace(/^>\s+/, "").trim() };
      }

      if (lines.length > 0 && lines.every((line) => /^[-*]\s+/.test(line))) {
        return {
          type: "list" as const,
          items: lines.map((line) => line.replace(/^[-*]\s+/, "").trim()).filter(Boolean),
        };
      }

      return { type: "paragraph" as const, text: lines.join(" ").replace(/\s+/g, " ").trim() };
    });
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function isSafeUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return parsed.protocol === "https:" || parsed.protocol === "http:";
  } catch {
    return false;
  }
}

function inlineTextToHtml(text: string): string {
  const escaped = escapeHtml(text);
  return escaped
    .replace(/\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/g, '<a href="$2" target="_blank" rel="noreferrer">$1</a>')
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/\*([^*]+)\*/g, "<em>$1</em>");
}

function bodyToEditorHtml(raw: string): string {
  return parseBody(raw)
    .map((block) => {
      if (block.type === "heading") return `<h2>${inlineTextToHtml(block.text)}</h2>`;
      if (block.type === "quote") return `<blockquote>${inlineTextToHtml(block.text)}</blockquote>`;
      if (block.type === "list") {
        return `<ul>${block.items.map((item) => `<li>${inlineTextToHtml(item)}</li>`).join("")}</ul>`;
      }

      return `<p>${inlineTextToHtml(block.text)}</p>`;
    })
    .join("");
}

function textToEditorHtml(text: string): string {
  const normalized = text.replace(/\r\n/g, "\n");
  return normalized
    .split(/\n{2,}/)
    .map((chunk) => chunk.trim())
    .filter(Boolean)
    .map((chunk) => {
      const lines = chunk
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean);

      if (lines.length === 1 && lines[0].startsWith("## ")) {
        return `<h2>${inlineTextToHtml(lines[0].replace(/^##\s+/, ""))}</h2>`;
      }

      if (lines.length === 1 && lines[0].startsWith("> ")) {
        return `<blockquote>${inlineTextToHtml(lines[0].replace(/^>\s+/, ""))}</blockquote>`;
      }

      if (lines.length > 0 && lines.every((line) => /^[-*]\s+/.test(line))) {
        return `<ul>${lines
          .map((line) => `<li>${inlineTextToHtml(line.replace(/^[-*]\s+/, ""))}</li>`)
          .join("")}</ul>`;
      }

      return `<p>${inlineTextToHtml(lines.join(" "))}</p>`;
    })
    .join("");
}

function normalizeInlineText(text: string): string {
  return text.replace(/\s+/g, " ").trim();
}

function inlineMarkdownFromNode(node: Node): string {
  if (node.nodeType === Node.TEXT_NODE) return node.textContent || "";

  if (!(node instanceof HTMLElement)) return "";

  const tag = node.tagName.toLowerCase();
  const content = Array.from(node.childNodes).map(inlineMarkdownFromNode).join("");
  const normalized = normalizeInlineText(content);

  if (!normalized && tag !== "br") return "";
  if (tag === "br") return "\n";
  if (tag === "strong" || tag === "b") return `**${normalized}**`;
  if (tag === "em" || tag === "i") return `*${normalized}*`;
  if (tag === "a") {
    const href = node.getAttribute("href") || "";
    return isSafeUrl(href) ? `[${normalized}](${href})` : normalized;
  }

  return content;
}

function blockTextFromElement(el: Element): string {
  return normalizeInlineText(Array.from(el.childNodes).map(inlineMarkdownFromNode).join(""));
}

function editorRootToBody(root: HTMLElement): string {
  const blocks: string[] = [];

  function pushElement(el: Element) {
    const tag = el.tagName.toLowerCase();

    if (tag === "ul" || tag === "ol") {
      const items = Array.from(el.children)
        .filter((child) => child.tagName.toLowerCase() === "li")
        .map((child) => blockTextFromElement(child))
        .filter(Boolean)
        .map((item) => `- ${item}`);
      if (items.length > 0) blocks.push(items.join("\n"));
      return;
    }

    if (/^h[1-6]$/.test(tag)) {
      const text = blockTextFromElement(el);
      if (text) blocks.push(`## ${text}`);
      return;
    }

    if (tag === "blockquote") {
      const text = blockTextFromElement(el);
      if (text) blocks.push(`> ${text}`);
      return;
    }

    if (tag === "div" || tag === "p") {
      const nestedList = Array.from(el.children).find((child) =>
        ["ul", "ol"].includes(child.tagName.toLowerCase()),
      );
      if (nestedList) {
        pushElement(nestedList);
        return;
      }

      const text = blockTextFromElement(el);
      if (text) blocks.push(text);
    }
  }

  Array.from(root.childNodes).forEach((node) => {
    if (node.nodeType === Node.TEXT_NODE) {
      const text = normalizeInlineText(node.textContent || "");
      if (text) blocks.push(text);
      return;
    }

    if (node instanceof Element) pushElement(node);
  });

  return blocks.join("\n\n");
}

function extOf(name: string | null): string {
  if (!name) return "jpg";
  const m = name.toLowerCase().match(/\.([a-z0-9]+)$/);
  return m ? m[1] : "jpg";
}

function fileNameFromPath(imagePath: string | null): string | null {
  if (!imagePath) return null;
  return imagePath.split("/").filter(Boolean).at(-1) || null;
}

function escapeForTemplate(s: string): string {
  return s.replace(/\\/g, "\\\\").replace(/`/g, "\\`").replace(/\$\{/g, "\\${");
}

function blockToCode(block: BlogBlock): string {
  if (block.type === "list") {
    const itemsCode =
      block.items.length === 0
        ? "[]"
        : `[\n${block.items
            .map((item) => `        \`${escapeForTemplate(item)}\`,`)
            .join("\n")}\n      ]`;
    return `      { type: "list", items: ${itemsCode} },`;
  }

  return `      { type: ${JSON.stringify(block.type)}, text: \`${escapeForTemplate(
    block.text,
  )}\` },`;
}

function buildSnippet(d: DraftState, imagePath: string): string {
  const slug = d.slug || slugify(d.title);
  const tags = parseTags(d.tags);
  const blocks = parseBody(d.body);
  const tagsCode =
    tags.length === 0
      ? "[]"
      : `[\n      ${tags.map((t) => JSON.stringify(t)).join(",\n      ")},\n    ]`;
  const bodyCode =
    blocks.length === 0 ? "[]" : `[\n${blocks.map(blockToCode).join("\n")}\n    ]`;

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

function renderInlineText(text: string) {
  const tokens = text.match(/(\*\*[^*]+\*\*|\*[^*]+\*|\[[^\]]+\]\([^)]+\)|[^*[]+)/g) ?? [
    text,
  ];

  return tokens.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={i}>{part.slice(2, -2)}</strong>;
    }

    if (part.startsWith("*") && part.endsWith("*")) {
      return <em key={i}>{part.slice(1, -1)}</em>;
    }

    const linkMatch = part.match(/^\[([^\]]+)\]\((https?:\/\/[^)]+)\)$/);
    if (linkMatch) {
      return (
        <a key={i} href={linkMatch[2]} target="_blank" rel="noreferrer">
          {linkMatch[1]}
        </a>
      );
    }

    return part;
  });
}

function renderPreviewBlock(block: BlogBlock, i: number) {
  if (block.type === "heading") {
    return (
      <h2 key={i} className="cmp-preview__h2">
        {renderInlineText(block.text)}
      </h2>
    );
  }

  if (block.type === "list") {
    return (
      <ul key={i} className="cmp-preview__list">
        {block.items.map((item, itemIndex) => (
          <li key={itemIndex}>{renderInlineText(item)}</li>
        ))}
      </ul>
    );
  }

  if (block.type === "quote") {
    return (
      <blockquote key={i} className="cmp-preview__quote">
        {renderInlineText(block.text)}
      </blockquote>
    );
  }

  return (
    <p key={i} className="cmp-preview__p">
      {renderInlineText(block.text)}
    </p>
  );
}

type Status =
  | { kind: "idle" }
  | { kind: "publishing" }
  | { kind: "finalizing" }
  | { kind: "ok"; message: string }
  | { kind: "err"; message: string };

type PublishResponse = {
  ok?: boolean;
  error?: string;
  wrote?: {
    journal?: string;
    image?: string | null;
  };
};

type FinalizeResponse = {
  ok?: boolean;
  error?: string;
  branch?: string;
  commit?: string;
  pushed?: boolean;
};

export default function ComposeForm({ existingPosts }: { existingPosts: JournalPost[] }) {
  const [draft, setDraft] = useState<DraftState>(EMPTY);
  const [hydrated, setHydrated] = useState(false);
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const [showSnippet, setShowSnippet] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const editorRef = useRef<HTMLDivElement>(null);
  const editorAppliedBodyRef = useRef<string | null>(null);
  const savedSelectionRef = useRef<Range | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY) || localStorage.getItem(LEGACY_STORAGE_KEY);
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

  useEffect(() => {
    if (!hydrated) return;
    applyBodyToEditor(draft.body, { force: true });
    // The rich editor is uncontrolled while typing so caret position stays stable.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hydrated]);

  useEffect(() => {
    function handleSelectionChange() {
      rememberEditorSelection();
    }

    document.addEventListener("selectionchange", handleSelectionChange);
    return () => document.removeEventListener("selectionchange", handleSelectionChange);
  }, []);

  const slugAuto = useMemo(() => slugify(draft.title), [draft.title]);
  const effectiveSlug = draft.slug || slugAuto;
  const currentImagePath = useMemo(() => {
    if (draft.imageDataUrl) return `/images/blog/${effectiveSlug || "post"}.${extOf(draft.imageName)}`;
    return draft.imagePath || "";
  }, [draft.imageDataUrl, draft.imageName, draft.imagePath, effectiveSlug]);
  const parsedBody = useMemo(() => parseBody(draft.body), [draft.body]);
  const snippet = useMemo(
    () => buildSnippet(draft, currentImagePath || `/images/blog/${effectiveSlug || "post"}.jpg`),
    [currentImagePath, draft, effectiveSlug],
  );
  const blockCount = parsedBody.length;
  const wordCount = useMemo(
    () => (draft.body.trim() ? draft.body.trim().split(/\s+/).length : 0),
    [draft.body],
  );
  const selectedPostSlug = draft.sourceSlug || "";
  const savedPostHref = draft.sourceSlug ? `/blog/${effectiveSlug}` : "";

  function patch<K extends keyof DraftState>(key: K, value: DraftState[K]) {
    setDraft((d) => ({ ...d, [key]: value }));
  }

  function applyBodyToEditor(body: string, options?: { force?: boolean }) {
    const el = editorRef.current;
    if (!el) return;
    if (!options?.force && editorAppliedBodyRef.current === body) return;
    el.innerHTML = bodyToEditorHtml(body);
    editorAppliedBodyRef.current = body;
    savedSelectionRef.current = null;
  }

  function setDraftWithEditor(next: DraftState) {
    applyBodyToEditor(next.body, { force: true });
    setDraft(next);
  }

  function syncBodyFromEditor() {
    const el = editorRef.current;
    if (!el) return;
    const nextBody = editorRootToBody(el);
    editorAppliedBodyRef.current = nextBody;
    setDraft((d) => (d.body === nextBody ? d : { ...d, body: nextBody }));
  }

  function draftWithEditorBody(): DraftState {
    const el = editorRef.current;
    if (!el) return draft;
    const body = editorRootToBody(el);
    if (body !== draft.body) {
      editorAppliedBodyRef.current = body;
      setDraft((d) => ({ ...d, body }));
    }
    return { ...draft, body };
  }

  function selectionBelongsToEditor(selection: Selection | null): boolean {
    const el = editorRef.current;
    if (!el || !selection || selection.rangeCount === 0) return false;
    const range = selection.getRangeAt(0);
    const container = range.commonAncestorContainer;
    const owner =
      container.nodeType === Node.ELEMENT_NODE ? container : container.parentElement;
    return owner === el || Boolean(owner && el.contains(owner));
  }

  function rememberEditorSelection() {
    const selection = window.getSelection();
    if (!selectionBelongsToEditor(selection)) return;
    savedSelectionRef.current = selection?.getRangeAt(0).cloneRange() ?? null;
  }

  function placeCaretAtEditorEnd() {
    const el = editorRef.current;
    if (!el) return;
    const range = document.createRange();
    range.selectNodeContents(el);
    range.collapse(false);
    const selection = window.getSelection();
    selection?.removeAllRanges();
    selection?.addRange(range);
    savedSelectionRef.current = range.cloneRange();
  }

  function restoreEditorSelection() {
    const el = editorRef.current;
    if (!el) return;
    el.focus();

    const selection = window.getSelection();
    if (savedSelectionRef.current) {
      selection?.removeAllRanges();
      selection?.addRange(savedSelectionRef.current);
      return;
    }

    if (!selectionBelongsToEditor(selection)) placeCaretAtEditorEnd();
  }

  function caretAfterNode(node: Node) {
    const selection = window.getSelection();
    const range = document.createRange();
    range.setStartAfter(node);
    range.collapse(true);
    selection?.removeAllRanges();
    selection?.addRange(range);
    savedSelectionRef.current = range.cloneRange();
  }

  function nearestBlockForRange(range: Range): Element | null {
    const el = editorRef.current;
    if (!el) return null;

    let node: Node | null =
      range.commonAncestorContainer.nodeType === Node.ELEMENT_NODE
        ? range.commonAncestorContainer
        : range.commonAncestorContainer.parentElement;

    while (node && node !== el) {
      if (node instanceof Element && node.matches("p,h1,h2,h3,h4,h5,h6,blockquote,li")) {
        if (node.tagName.toLowerCase() === "li") return node.closest("ul,ol");
        return node;
      }
      node = node.parentElement;
    }

    return null;
  }

  function fragmentFromHtml(html: string): DocumentFragment {
    const template = document.createElement("template");
    template.innerHTML = html;
    return template.content;
  }

  function htmlHasReadableContent(html: string): boolean {
    const probe = document.createElement("div");
    probe.innerHTML = html;
    return Boolean(normalizeInlineText(probe.textContent || ""));
  }

  function htmlFromRange(range: Range): string {
    const wrapper = document.createElement("div");
    wrapper.append(range.cloneContents());
    return wrapper.innerHTML;
  }

  function insertStructuredHtmlAtCaret(html: string, range: Range, block: Element): boolean {
    const tag = block.tagName.toLowerCase();
    const fragment = fragmentFromHtml(html);
    const lastPastedNode = fragment.lastChild;

    if (!lastPastedNode) return false;

    if (tag === "ul" || tag === "ol") {
      block.after(fragment);
      caretAfterNode(lastPastedNode);
      syncBodyFromEditor();
      return true;
    }

    const beforeRange = document.createRange();
    beforeRange.selectNodeContents(block);
    beforeRange.setEnd(range.startContainer, range.startOffset);

    const afterRange = document.createRange();
    afterRange.selectNodeContents(block);
    afterRange.setStart(range.startContainer, range.startOffset);

    const beforeHtml = htmlFromRange(beforeRange);
    const afterHtml = htmlFromRange(afterRange);
    const hasBefore = htmlHasReadableContent(beforeHtml);
    const hasAfter = htmlHasReadableContent(afterHtml);
    const afterBlock = block.cloneNode(false) as HTMLElement;
    afterBlock.innerHTML = afterHtml;

    if (hasBefore) {
      block.innerHTML = beforeHtml;
      if (hasAfter) block.after(afterBlock);
      block.after(fragment);
    } else if (hasAfter) {
      block.innerHTML = afterHtml;
      block.before(fragment);
    } else {
      block.replaceWith(fragment);
    }

    caretAfterNode(lastPastedNode);
    syncBodyFromEditor();
    return true;
  }

  function insertTextAtSelection(text: string) {
    restoreEditorSelection();
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0 || !selectionBelongsToEditor(selection)) return;

    const range = selection.getRangeAt(0);
    range.deleteContents();

    const textNode = document.createTextNode(text);
    range.insertNode(textNode);
    caretAfterNode(textNode);
    syncBodyFromEditor();
  }

  function insertHtmlAtSelection(html: string, options?: { preferBlockBoundary?: boolean }) {
    const el = editorRef.current;
    if (!el) return;

    restoreEditorSelection();
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0 || !selectionBelongsToEditor(selection)) return;

    const range = selection.getRangeAt(0);
    if (options?.preferBlockBoundary && range.collapsed) {
      const block = nearestBlockForRange(range);
      if (block) {
        if (insertStructuredHtmlAtCaret(html, range, block)) return;
      }
    }

    range.deleteContents();

    const fragment = fragmentFromHtml(html);
    const lastNode = fragment.lastChild;
    range.insertNode(fragment);

    if (lastNode) {
      const nextRange = document.createRange();
      nextRange.setStartAfter(lastNode);
      nextRange.collapse(true);
      selection.removeAllRanges();
      selection.addRange(nextRange);
      savedSelectionRef.current = nextRange.cloneRange();
    }

    syncBodyFromEditor();
  }

  function isStructuredPaste(text: string): boolean {
    const normalized = text.replace(/\r\n/g, "\n").trim();
    if (!normalized) return false;
    if (/\n{2,}/.test(normalized)) return true;
    const lines = normalized
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);
    if (lines.length > 1) return true;
    return /^(##\s+|>\s+|[-*]\s+)/.test(normalized);
  }

  function runEditorCommand(command: string, value?: string) {
    const el = editorRef.current;
    if (!el) return;
    restoreEditorSelection();
    document.execCommand(command, false, value);
    rememberEditorSelection();
    syncBodyFromEditor();
  }

  function formatBlock(tagName: "p" | "h2" | "blockquote") {
    runEditorCommand("formatBlock", tagName);
  }

  function createLink() {
    const raw = window.prompt("Paste the full link URL");
    if (!raw) return;
    const trimmed = raw.trim();
    if (!isSafeUrl(trimmed)) {
      setStatus({ kind: "err", message: "Links must start with http:// or https://." });
      return;
    }
    runEditorCommand("createLink", trimmed);
  }

  function handleEditorPaste(e: React.ClipboardEvent<HTMLDivElement>) {
    e.preventDefault();
    rememberEditorSelection();
    const text = e.clipboardData.getData("text/plain");
    if (!text.trim()) return;
    if (isStructuredPaste(text)) {
      insertHtmlAtSelection(textToEditorHtml(text), { preferBlockBoundary: true });
      return;
    }

    insertTextAtSelection(text);
  }

  function loadPost(slug: string) {
    if (!slug) {
      startNewPost();
      return;
    }

    const post = existingPosts.find((p) => p.slug === slug);
    if (!post) {
      setStatus({ kind: "err", message: "Could not load that post. Refresh the page and try again." });
      return;
    }

    setDraftWithEditor({
      title: post.title,
      slug: post.slug,
      date: dateToInputValue(post.date),
      excerpt: post.excerpt,
      tags: post.tags.join(", "),
      author: post.author,
      body: bodyToEditor(post.body),
      imageDataUrl: null,
      imageName: fileNameFromPath(post.hero),
      imagePath: post.hero,
      sourceSlug: post.slug,
    });
    setShowSnippet(false);
    setStatus({ kind: "ok", message: `Loaded "${post.title}" for editing.` });
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function startNewPost() {
    if (draft.title.trim() && !confirm("Discard the current draft and start a new post?")) return;
    setDraftWithEditor(EMPTY);
    setShowSnippet(false);
    setStatus({ kind: "idle" });
    if (fileInputRef.current) fileInputRef.current.value = "";
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {}
  }

  function onPickImage(file: File) {
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = typeof reader.result === "string" ? reader.result : null;
      setDraft((d) => ({
        ...d,
        imageDataUrl: dataUrl,
        imageName: file.name,
      }));
    };
    reader.readAsDataURL(file);
  }

  function onClearImage() {
    setDraft((d) => ({ ...d, imageDataUrl: null, imageName: null, imagePath: null }));
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function resetDraft() {
    if (!confirm("Discard the current draft?")) return;
    setDraftWithEditor(EMPTY);
    setStatus({ kind: "idle" });
    if (fileInputRef.current) fileInputRef.current.value = "";
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {}
  }

  function validateDraft(nextDraft = draft): string | null {
    if (!nextDraft.title.trim()) return "Title is required.";
    if (!effectiveSlug) return "Slug could not be derived from the title.";
    if (!currentImagePath && !nextDraft.imageDataUrl) return "Hero image is required.";
    if (!nextDraft.body.trim()) return "Body is required.";
    return null;
  }

  async function copySnippet() {
    const nextDraft = draftWithEditorBody();
    const error = validateDraft(nextDraft);
    if (error) {
      setStatus({ kind: "err", message: error });
      return;
    }

    try {
      await navigator.clipboard.writeText(
        buildSnippet(nextDraft, currentImagePath || `/images/blog/${effectiveSlug || "post"}.jpg`),
      );
      setStatus({
        kind: "ok",
        message: draft.sourceSlug
          ? "Updated snippet copied. It can replace the existing post object in src/data/journal.ts."
          : "Snippet copied. It can be pasted after the COMPOSE_INSERT_BELOW marker in src/data/journal.ts.",
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
    const nextDraft = draftWithEditorBody();
    const error = validateDraft(nextDraft);
    if (error) {
      setStatus({ kind: "err", message: error });
      return;
    }

    setStatus({ kind: "publishing" });
    try {
      const res = await fetch("/api/admin/publish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slug: effectiveSlug,
          oldSlug: nextDraft.sourceSlug,
          imageDataUrl: nextDraft.imageDataUrl,
          imageExt: extOf(nextDraft.imageName),
          snippet: buildSnippet(
            nextDraft,
            currentImagePath || `/images/blog/${effectiveSlug || "post"}.jpg`,
          ),
        }),
      });
      const json = (await res.json().catch(() => ({}))) as PublishResponse;
      if (!res.ok || !json.ok) {
        throw new Error(json.error || `Publish failed (${res.status})`);
      }

      const savedImagePath = currentImagePath;
      setDraft((d) => ({
        ...d,
        sourceSlug: effectiveSlug,
        imageDataUrl: null,
        imageName: fileNameFromPath(savedImagePath),
        imagePath: savedImagePath,
      }));
      if (fileInputRef.current) fileInputRef.current.value = "";
      setStatus({
        kind: "ok",
        message: `Saved locally. Review /blog/${effectiveSlug}, then use Final commit & push when it is ready.`,
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Publish failed";
      setStatus({ kind: "err", message });
    }
  }

  async function finalizePublish() {
    if (!confirm("Run checks, commit Journal changes, and push the current branch?")) return;
    setStatus({ kind: "finalizing" });

    try {
      const res = await fetch("/api/admin/finalize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: `blog: ${effectiveSlug || "journal updates"}`,
          push: true,
        }),
      });
      const json = (await res.json().catch(() => ({}))) as FinalizeResponse;
      if (!res.ok || !json.ok) {
        throw new Error(json.error || `Finalize failed (${res.status})`);
      }

      setStatus({
        kind: "ok",
        message: `Committed ${json.commit || "Journal changes"} on ${json.branch || "current branch"}${
          json.pushed ? " and pushed to origin." : "."
        }`,
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Finalize failed";
      setStatus({ kind: "err", message });
    }
  }

  return (
    <div className="cmp">
      <div className="cmp__manager">
        <Field label="Edit existing post" hint="Load a saved Journal post, edit it, then update it in place.">
          <select
            value={selectedPostSlug}
            onChange={(e) => loadPost(e.target.value)}
            className="cmp__input cmp__select"
          >
            <option value="">New post</option>
            {existingPosts.map((post) => (
              <option key={post.slug} value={post.slug}>
                {post.title}
              </option>
            ))}
          </select>
        </Field>
        <button type="button" onClick={startNewPost} className="cmp__btn">
          New post
        </button>
      </div>

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
            hint={draft.slug ? "Custom slug" : `Auto from title: ${slugAuto || "none yet"}`}
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
              placeholder="Why authenticity signals matter as much as compliance checklists..."
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

          <Field
            label="Body"
            required
            hint="Select text, use the toolbar, paste cleanly from docs, and review the live preview."
            asContainer
          >
            <div
              className="cmp__toolbar"
              aria-label="Formatting tools"
              onMouseDown={(e) => {
                if ((e.target as HTMLElement).closest("button")) {
                  rememberEditorSelection();
                  e.preventDefault();
                }
              }}
            >
              <button type="button" onClick={() => runEditorCommand("undo")} title="Undo" aria-label="Undo">
                ↶
              </button>
              <button type="button" onClick={() => runEditorCommand("redo")} title="Redo" aria-label="Redo">
                ↷
              </button>
              <span className="cmp__toolbarSep" aria-hidden="true" />
              <button
                type="button"
                onClick={() => formatBlock("p")}
                title="Paragraph"
                aria-label="Paragraph"
              >
                ¶
              </button>
              <button
                type="button"
                onClick={() => formatBlock("h2")}
                title="Heading"
                aria-label="Heading"
              >
                H2
              </button>
              <button
                type="button"
                onClick={() => formatBlock("blockquote")}
                title="Quote"
                aria-label="Quote"
              >
                ❝
              </button>
              <span className="cmp__toolbarSep" aria-hidden="true" />
              <button type="button" onClick={() => runEditorCommand("bold")} title="Bold" aria-label="Bold">
                B
              </button>
              <button
                type="button"
                onClick={() => runEditorCommand("italic")}
                title="Italic"
                aria-label="Italic"
              >
                I
              </button>
              <button
                type="button"
                onClick={createLink}
                title="Add link"
                aria-label="Add link"
              >
                ⛓
              </button>
              <button
                type="button"
                onClick={() => runEditorCommand("unlink")}
                title="Remove link"
                aria-label="Remove link"
              >
                ⊘
              </button>
              <span className="cmp__toolbarSep" aria-hidden="true" />
              <button
                type="button"
                onClick={() => runEditorCommand("insertUnorderedList")}
                title="Bullet list"
                aria-label="Bullet list"
              >
                •
              </button>
              <button
                type="button"
                onClick={() => runEditorCommand("removeFormat")}
                title="Clear formatting"
                aria-label="Clear formatting"
              >
                Tx
              </button>
            </div>
            <div
              ref={editorRef}
              contentEditable
              suppressContentEditableWarning
              role="textbox"
              aria-multiline="true"
              data-placeholder="Start writing here..."
              className="cmp-editor"
              onInput={syncBodyFromEditor}
              onBlur={syncBodyFromEditor}
              onFocus={rememberEditorSelection}
              onKeyUp={rememberEditorSelection}
              onMouseUp={rememberEditorSelection}
              onPaste={handleEditorPaste}
            />
            <div className="cmp__counts">
              <span>{blockCount} blocks</span>
              <span>{wordCount} words</span>
            </div>
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
            {(draft.imageDataUrl || currentImagePath) && (
              <div className="cmp__previewWrap">
                <div className="cmp__preview">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={draft.imageDataUrl || currentImagePath} alt="Hero preview" />
                </div>
                <div className="cmp__previewMeta">
                  <span className="cmp__previewPath">
                    Will save as <code>{currentImagePath || "Choose an image"}</code>
                  </span>
                  <button type="button" onClick={onClearImage} className="cmp__linkBtn">
                    Remove
                  </button>
                </div>
              </div>
            )}
          </Field>

          <section className="cmp-preview" aria-label="Post preview">
            <div className="cmp-preview__bar">
              <span>Preview</span>
              {savedPostHref && (
                <a href={savedPostHref} target="_blank" rel="noreferrer">
                  Open saved post
                </a>
              )}
            </div>
            <article className="cmp-preview__article">
              {draft.imageDataUrl || currentImagePath ? (
                <div className="cmp-preview__hero">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={draft.imageDataUrl || currentImagePath} alt="" />
                </div>
              ) : null}
              <div className="cmp-preview__meta">
                <span>{formatDateForDisplay(draft.date) || "Date"}</span>
                <span>{draft.author || "Author"}</span>
              </div>
              <h1 className="cmp-preview__title">{draft.title || "Untitled post"}</h1>
              <p className="cmp-preview__excerpt">
                {draft.excerpt || "Excerpt preview appears here."}
              </p>
              {parseTags(draft.tags).length > 0 && (
                <ul className="cmp-preview__tags">
                  {parseTags(draft.tags).map((tag) => (
                    <li key={tag}>{tag}</li>
                  ))}
                </ul>
              )}
              <div className="cmp-preview__body">
                {parsedBody.length > 0 ? (
                  parsedBody.map(renderPreviewBlock)
                ) : (
                  <p className="cmp-preview__p">Body preview appears here.</p>
                )}
              </div>
            </article>
          </section>
        </div>
      </div>

      <div className="cmp__actions">
        <button
          type="button"
          onClick={publishToSite}
          disabled={status.kind === "publishing" || status.kind === "finalizing"}
          className="cmp__btn cmp__btn--primary"
        >
          {status.kind === "publishing"
            ? "Saving..."
            : draft.sourceSlug
              ? "Update local post"
              : "Save local post"}
        </button>
        <button
          type="button"
          onClick={finalizePublish}
          disabled={status.kind === "publishing" || status.kind === "finalizing"}
          className="cmp__btn cmp__btn--ship"
        >
          {status.kind === "finalizing" ? "Finalizing..." : "Final commit & push"}
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
            ? "Writing files..."
            : status.kind === "finalizing"
              ? "Running checks, committing, and pushing..."
              : "message" in status
                ? status.message
                : ""}
        </div>
      )}

      <ol className="cmp__steps">
        <li>Preview the article in this portal before saving anything to the local site.</li>
        <li>
          Save local post writes <code className="cmp__codeInline">src/data/journal.ts</code>{" "}
          and any new <code className="cmp__codeInline">public/images/blog/*</code> asset.
        </li>
        <li>Final commit & push runs checks, stages only Journal files, commits, and pushes.</li>
      </ol>

      {showSnippet && (
        <div className="cmp__snippetBox">
          <div className="cmp__snippetLabel">Snippet</div>
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
  asContainer,
  children,
}: {
  label: string;
  hint?: React.ReactNode;
  required?: boolean;
  asContainer?: boolean;
  children: React.ReactNode;
}) {
  const content = (
    <>
      <span className="cmp__label">
        {label}
        {required && <span className="cmp__req"> *</span>}
      </span>
      {children}
      {hint && <span className="cmp__hint">{hint}</span>}
    </>
  );

  if (asContainer) {
    return <div className="cmp__field">{content}</div>;
  }

  return (
    <label className="cmp__field">
      {content}
    </label>
  );
}
