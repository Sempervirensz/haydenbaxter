import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BLOG_POSTS, getBlogPostBySlug } from "@/data/journal";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return BLOG_POSTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);
  if (!post) return { title: "Post not found" };
  return {
    title: `${post.title} — Journal`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: post.hero ? [{ url: post.hero }] : undefined,
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);
  if (!post) notFound();

  return (
    <main className="blog-post">
      <Link href="/blog" className="etb-gallery__back">
        <span aria-hidden="true">&larr;</span>
        <span>Back to journal</span>
      </Link>

      <article className="blog-post__article">
        <div className="blog-post__hero">
          <img src={post.hero} alt="" loading="eager" />
        </div>

        <header className="blog-post__head">
          <div className="blog-post__meta">
            <span>{post.date}</span>
            <span className="blog-post__metaSep" aria-hidden="true" />
            <span>{post.author}</span>
          </div>

          <h1 className="blog-post__title">{post.title}</h1>
          <p className="blog-post__excerpt">{post.excerpt}</p>

          {post.tags.length > 0 && (
            <ul className="blog-post__tags">
              {post.tags.map((tag) => (
                <li key={tag} className="blog-post__tag">
                  {tag}
                </li>
              ))}
            </ul>
          )}
        </header>

        <div className="blog-post__body">
          {post.body.map((block, i) =>
            block.type === "heading" ? (
              <h2 key={i} className="blog-post__h2">
                {block.text}
              </h2>
            ) : (
              <p key={i} className="blog-post__p">
                {block.text}
              </p>
            ),
          )}
        </div>
      </article>

      <Link href="/blog" className="etb-page__backFooter">
        <span aria-hidden="true">&larr;</span>
        <span>Back to journal</span>
      </Link>
    </main>
  );
}
