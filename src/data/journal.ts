// Internal blog data. New posts are added by /admin/compose (dev-only) — the
// composer copies a snippet to the clipboard which is pasted directly below
// the COMPOSE_INSERT_BELOW marker.

export type BlogBlock =
  | { type: "paragraph"; text: string }
  | { type: "heading"; text: string };

export interface JournalPost {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  tags: string[];
  thumbnail: string;
  hero: string;
  author: string;
  body: BlogBlock[];
}

export const JOURNAL_COPY = {
  heading: "Journal",
  subline:
    "Long-form thinking on AI, supply chain, and building products that matter.",
  ctaLabel: "Read the full journal",
  ctaHref: "/blog",
};

export const BLOG_POSTS: JournalPost[] = [
  // <COMPOSE_INSERT_BELOW> — do not remove; /admin/compose pastes new posts after this line.
  {
    slug: "test",
    title: "test",
    date: "May 9, 2026",
    excerpt: "test",
    tags: [
      "test",
    ],
    thumbnail: "/images/blog/test.png",
    hero: "/images/blog/test.png",
    author: "Hayden Baxter",
    body: [
      { type: "paragraph", text: `test` },
    ],
  },
];

export function getBlogPostBySlug(slug: string): JournalPost | undefined {
  return BLOG_POSTS.find((p) => p.slug === slug);
}

// Legacy compatibility for the home-page <JournalSection />.
// Maps the new shape onto the older surface the section was built for.
export const JOURNAL_DATA = {
  heading: JOURNAL_COPY.heading,
  subline: JOURNAL_COPY.subline,
  blogUrl: JOURNAL_COPY.ctaHref,
  blogLabel: JOURNAL_COPY.ctaLabel,
  posts: BLOG_POSTS,
};
