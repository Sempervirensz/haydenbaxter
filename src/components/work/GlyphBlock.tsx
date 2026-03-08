"use client";

interface GlyphBlockProps {
  prefix: string;
  title: string;
  subtitle?: string;
}

function getInitials(value: string): string {
  const parts = value.match(/[A-Z][a-z]+|[A-Z]+(?![a-z])|[a-z]+|\d+/g) ?? [value];
  return parts
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");
}

export default function GlyphBlock({ prefix, title, subtitle }: GlyphBlockProps) {
  return (
    <div className={`${prefix}__glyph`} aria-hidden="true">
      <div className={`${prefix}__glyph-grid`} />
      <div className={`${prefix}__glyph-badge`}>{getInitials(title)}</div>
      <div className={`${prefix}__glyph-copy`}>
        <div className={`${prefix}__glyph-title`}>{title}</div>
        {subtitle ? <div className={`${prefix}__glyph-subtitle`}>{subtitle}</div> : null}
      </div>
    </div>
  );
}
