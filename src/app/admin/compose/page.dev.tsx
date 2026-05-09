import type { Metadata } from "next";
import ComposeForm from "@/components/admin/ComposeForm";

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
          Fill in the fields, drop a hero image, then{" "}
          <span className="cmp-page__accent">Copy snippet</span> and{" "}
          <span className="cmp-page__accent">Download image</span>. The next steps below
          tell you exactly where to paste / drop them. Then commit and push to publish.
        </p>
      </header>

      <ComposeForm />
    </main>
  );
}
