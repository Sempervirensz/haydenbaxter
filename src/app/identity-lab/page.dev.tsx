import type { Metadata } from "next";
import IdentityLab from "@/components/identity-lab/IdentityLab";

// `.dev.tsx`, so the route only exists under `next dev` — see `pageExtensions`
// in next.config.ts. The static-export production build never sees it, and
// `/identity-lab` is in NON_PUBLIC_PREFIXES so robots.txt disallows it either
// way.

export const metadata: Metadata = {
  title: "Identity Lab — About + Personas",
  description:
    "Five directions for the About + Personas pair, each rendered against production's shipped components.",
  robots: { index: false, follow: false },
};

export default function IdentityLabPage() {
  return <IdentityLab />;
}
