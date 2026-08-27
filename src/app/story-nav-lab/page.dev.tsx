// Story Navigation Lab — local only.
//
// `page.dev.tsx`, not `page.tsx`: next.config.ts registers the `dev.tsx`
// extension in development only, so this route does not exist in the static
// export. Naming it `page.tsx` would ship it and make it indexable.

import type { Metadata } from "next";
import StoryNavLab from "@/components/story-nav-lab/StoryNavLab";

export const metadata: Metadata = {
  title: "Story Navigation Lab",
  robots: { index: false, follow: false },
};

export default function StoryNavLabPage() {
  return <StoryNavLab />;
}
