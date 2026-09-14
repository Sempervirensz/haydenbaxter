# Journal Admin Portal

## Purpose

`/admin/compose` is a local, dev-only publishing portal for the Journal section. It lets Hayden draft, edit, preview, save, and ship Journal posts without manually editing `src/data/journal.ts`.

The portal is intentionally excluded from production builds through the `.dev.tsx` / `.dev.ts` route naming and `pageExtensions` configuration in `next.config.ts`.

## What It Supports

- Create a new Journal post.
- Load and edit an existing Journal post.
- Edit body copy in a rich writing surface instead of a raw textarea.
- Use toolbar controls for undo, redo, paragraph, heading, quote, bold, italic, link, unlink, bullets, and clear formatting.
- Paste plain text or document text into the editor and normalize it into clean Journal blocks.
- Preview the article in the admin portal before saving.
- Save or update the local post entry in `src/data/journal.ts`.
- Save hero images under `public/images/blog/`.
- Run final checks, stage only Journal files/assets, commit, and push from the portal.

## Main Files

- `src/app/admin/compose/page.dev.tsx`  
  Dev-only admin page shell. Passes existing Journal posts into the composer.

- `src/components/admin/ComposeForm.tsx`  
  Main portal UI: post selector, rich editor, preview, local save/update, snippet fallback, image handling, and finalization trigger.

- `src/app/api/admin/publish/route.dev.ts`  
  Dev-only local save endpoint. Inserts new posts or replaces existing post objects in `src/data/journal.ts`. Writes a new image only when one is selected.

- `src/data/journal.ts`  
  Canonical Journal content source. Supports paragraph, heading, list, and quote blocks.

- `src/app/blog/[slug]/page.tsx`  
  Public Journal post renderer. Renders paragraphs, headings, lists, quotes, bold, italic, and links.

- `src/app/globals.css`  
  Styles for the admin portal editor/preview and public Journal block types.

## Authoring Model

The rich editor is a browser `contentEditable` surface, but the saved content remains structured and reviewable in `src/data/journal.ts`.

Editor content is serialized into Journal blocks:

- Paragraphs become `{ type: "paragraph", text }`.
- `h2` headings become `{ type: "heading", text }`.
- Bullet lists become `{ type: "list", items }`.
- Blockquotes become `{ type: "quote", text }`.
- Bold, italic, and links are preserved as lightweight inline markdown inside `text` or `items`.

This keeps the site static-export friendly while giving the admin flow a word-processor-like writing experience.

## Local Workflow

1. Run `npm run dev`.
2. Open `http://127.0.0.1:3000/admin/compose`.
3. Select an existing post or start a new one.
4. Edit title, slug, date, excerpt, tags, image, and body.
5. Review the live preview.
6. Click `Save local post` or `Update local post`.
7. Open the saved `/blog/<slug>` page for final visual review.
8. Commit and push from the terminal. The portal prints the exact command after
   a successful save:
   `git add -A && git commit -m "blog: <slug>" && git push`

## Review Checklist

- `/admin/compose` is available in development.
- `/admin/compose` is excluded from production/static export.
- Existing posts can be loaded from the selector.
- New posts require title, slug, hero image, and body.
- Updating an existing post replaces the correct object instead of duplicating the slug.
- Body formatting round-trips correctly: headings, bullets, quotes, bold, italic, and links.
- The preview matches the saved `/blog/<slug>` rendering.
- New image references under `/images/blog/*` point to tracked files.
- The portal prints the commit command after a save, with the right slug.
- `npm run check` passes before you commit.

## Rich Editor QA Checklist

Use this checklist when reviewing changes to the body editor:

- Click inside the body editor and type several words; existing content should remain intact.
- Continue typing after the first words; the caret should not jump to the start or end.
- Paste a single line into the middle of a paragraph; it should insert inline at the caret.
- Paste multiple paragraphs; they should insert as separate blocks without replacing the whole article.
- Paste bullet text such as `- First item`; it should render as list items in the preview.
- Select text and apply bold or italic from the toolbar; preview should show the same formatting.
- Add and remove a link with the toolbar; only `http://` and `https://` links should be accepted.
- Convert a block to paragraph, heading, quote, and bullets; preview should match the editor.
- Use undo and redo after typing and formatting; content should remain in the editor.
- Switch from one saved post to another; the previous post's body should not leak into the new selection.
- Switch back to the original post; the saved body should reload cleanly.
- Save/update the post and open `/blog/<slug>`; the public page should match the portal preview.

## Current Caveat

Committing is manual and deliberately so. An in-portal `Final commit & push` was
drafted as `src/app/api/admin/finalize/route.dev.ts` but never wired to the UI,
and was removed rather than left as dead code — `ComposeForm` only ever called
`/api/admin/publish`. Two things would need deciding before rebuilding it: a
blind `git add -A` sweeps up whatever else is dirty in the shared worktree, and
the push targets whatever branch is checked out, which is usually not `main`.

Deploys do not come from `git push` in any case — only `vercel --prod` ships
anything (see `docs/HANDOFF-2026-08-26.md`).
