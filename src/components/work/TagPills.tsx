"use client";

interface TagPillsProps {
  tags: string[];
  className: string;
}

export default function TagPills({ tags, className }: TagPillsProps) {
  return (
    <>
      {tags.map((tag) => (
        <span key={tag} className={className}>
          {tag}
        </span>
      ))}
    </>
  );
}
