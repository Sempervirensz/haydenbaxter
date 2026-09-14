import type { Metadata } from "next";
import NavLabShell from "@/components/nav-lab/NavLabShell";

// Navbar design lab. Eight sticky directions for the top navigation, each one
// framed over the real homepage at /nav-lab/stage.
//
// Nothing here is promoted: the production navbar (`src/components/Navbar.tsx`)
// is untouched, and this route is `page.dev.tsx`, so it exists under `next dev`
// and is absent from the static export.

export const metadata: Metadata = {
  title: "Navbar lab — eight sticky directions",
  robots: { index: false },
};

export default function NavLabPage() {
  return <NavLabShell />;
}
