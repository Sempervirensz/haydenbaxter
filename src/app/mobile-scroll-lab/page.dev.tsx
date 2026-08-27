/* Dev-only route: `page.dev.tsx` is registered by next.config's pageExtensions
   in dev and dropped from the production build, so this lab cannot ship or be
   indexed the way earlier ones were. */
import MobileScrollLab from "@/components/mobile-scroll-lab/MobileScrollLab";

export const metadata = { title: "Mobile Scroll Lab" };

export default function Page() {
  return <MobileScrollLab />;
}
