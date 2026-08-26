import type { Metadata } from "next";
import { Fraunces, Instrument_Serif, Space_Grotesk } from "next/font/google";
import ConsultingPathsLab from "@/components/consulting-paths-lab/ConsultingPathsLab";

// A redesign of the answer behind "Start a Consulting Project": two named paths
// side by side — Fractional AI Partner and Supply Chain Advisor — each with its
// own colour identity, its own detail, and its own Discuss a Project CTA, in
// five art directions.
//
// The three top-level choices are unchanged, and so are the WorldPulse and
// Experience screens. Production imports nothing from here.
//
// THE THREE FONTS BELOW ARE LAB-ONLY. The site ships DM Serif Display, DM Sans
// and DM Mono (see app/layout.tsx) and the House type scheme uses exactly
// those. These three exist so a direction can be judged in a voice the site
// does not own yet — if one of them ships, it has to be promoted into the root
// layout, and that is a decision about the whole site, not about this panel.

const instrumentSerif = Instrument_Serif({
  weight: "400",
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--cpp-instrument",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  weight: ["400", "500", "700"],
  subsets: ["latin"],
  variable: "--cpp-grotesk",
  display: "swap",
});

const fraunces = Fraunces({
  weight: ["400", "600"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--cpp-fraunces",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Consulting paths lab",
  description:
    "Two side-by-side consulting paths — Fractional AI Partner and Supply Chain Advisor — in five art directions, expanding upward inside the Let's work together section.",
  robots: { index: false, follow: false },
};

export default function ConsultingPathsLabPage() {
  return (
    <div
      className={`${instrumentSerif.variable} ${spaceGrotesk.variable} ${fraunces.variable}`}
    >
      <ConsultingPathsLab />
    </div>
  );
}
