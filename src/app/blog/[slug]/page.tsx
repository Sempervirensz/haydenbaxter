import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import JsonLd from "@/components/JsonLd";
import { BLOG_POSTS, getBlogPostBySlug } from "@/data/journal";
import { blogPostingGraph, toIsoDate } from "@/data/schema";
import { SITE_URL } from "@/data/site";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return BLOG_POSTS.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);
  if (!post) return { title: "Post not found" };

  const path = `/blog/${post.slug}`;

  return {
    title: `${post.title} | Journal`,
    description: post.excerpt,
    authors: [{ name: post.author, url: SITE_URL }],
    alternates: { canonical: path },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.excerpt,
      url: path,
      publishedTime: toIsoDate(post.date),
      authors: [post.author],
      images: post.hero ? [{ url: post.hero, alt: post.title }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
      images: post.hero ? [{ url: post.hero, alt: post.title }] : undefined,
    },
  };
}

function renderInlineText(text: string) {
  const tokens = text.match(/(\*\*[^*]+\*\*|\*[^*]+\*|\[[^\]]+\]\([^)]+\)|[^*[\]]+)/g) ?? [
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

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);
  if (!post) notFound();

  const articleSchema = blogPostingGraph({
    path: `/blog/${post.slug}`,
    headline: post.title,
    description: post.excerpt,
    author: post.author,
    datePublished: toIsoDate(post.date),
    image: post.hero,
    keywords: post.tags,
  });

  return (
    <main className="blog-post">
      <JsonLd data={articleSchema} />
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
          {post.body.map((block, i) => {
            if (block.type === "heading") {
              return (
                <h2 key={i} className="blog-post__h2">
                  {renderInlineText(block.text)}
                </h2>
              );
            }

            if (block.type === "list") {
              return (
                <ul key={i} className="blog-post__list">
                  {block.items.map((item, itemIndex) => (
                    <li key={itemIndex} className="blog-post__li">
                      {renderInlineText(item)}
                    </li>
                  ))}
                </ul>
              );
            }

            if (block.type === "quote") {
              return (
                <blockquote key={i} className="blog-post__quote">
                  {renderInlineText(block.text)}
                </blockquote>
              );
            }

            return (
              <p key={i} className="blog-post__p">
                {renderInlineText(block.text)}
              </p>
            );
          })}
        </div>
      </article>

      <Link href="/blog" className="etb-page__backFooter">
        <span aria-hidden="true">&larr;</span>
        <span>Back to journal</span>
      </Link>
    </main>
  );
}
