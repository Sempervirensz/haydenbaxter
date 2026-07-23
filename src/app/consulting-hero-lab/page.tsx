import { Caveat } from "next/font/google";
import ConsultingHeroTransitionLab from "@/components/ConsultingHeroTransitionLab";

// Scoped cursive font for the write-on quote — exposed as --font-cursive.
const caveat = Caveat({
  weight: ["500", "600"],
  subsets: ["latin"],
  variable: "--font-cursive",
});

export default function ConsultingHeroLabPage() {
  return (
    <div className={caveat.variable}>
      <ConsultingHeroTransitionLab />
    </div>
  );
}
