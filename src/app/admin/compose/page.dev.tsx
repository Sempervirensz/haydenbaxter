import type { Metadata } from "next";
import ComposeForm from "@/components/admin/ComposeForm";
import { BLOG_POSTS } from "@/data/journal";

export const metadata: Metadata = {
  title: "Compose — Admin",
  robots: { index: false, follow: false },
};

export default function ComposePage() {
  return (
    <main className="cmp-page">
      <header className="cmp-page__head">
        <span className="cmp-page__eyebrow">Private — dev only</span>
        <h1 className="cmp-page__title">Compose a journal post</h1>
        <p className="cmp-page__lede">
          Draft, edit, preview, and save Journal posts locally. When the preview is
          right, use <span className="cmp-page__accent">Final commit & push</span>{" "}
          to ship the Journal files.
        </p>
      </header>

      <ComposeForm existingPosts={BLOG_POSTS} />
    </main>
  );
}
