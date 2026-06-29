import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <main
      style={{
        minHeight: "100svh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "1.25rem",
        padding: "2rem",
        textAlign: "center",
      }}
    >
      <span
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: "0.75rem",
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          color: "#d8b15a",
        }}
      >
        Error 404
      </span>
      <h1
        style={{
          fontFamily: "var(--font-serif)",
          fontSize: "clamp(2rem, 6vw, 3.5rem)",
          margin: 0,
          color: "#f3f3f3",
        }}
      >
        This page wandered off.
      </h1>
      <p
        style={{
          fontFamily: "var(--font-sans)",
          color: "rgba(243,243,243,0.6)",
          maxWidth: "32ch",
          margin: 0,
        }}
      >
        The link may be broken or the page may have moved.
      </p>
      <Link
        href="/"
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: "0.8rem",
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          color: "#0a0a0a",
          background: "#f3f3f3",
          padding: "0.75rem 1.25rem",
          borderRadius: "6px",
          textDecoration: "none",
          marginTop: "0.5rem",
        }}
      >
        Back to home →
      </Link>
    </main>
  );
}
