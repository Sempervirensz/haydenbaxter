import type { Metadata } from "next";
import ConsultingColorLab from "@/components/consulting-color-lab/ConsultingColorLab";

// Consulting colour lab — can a restrained accent system give the Consulting
// screen visual hierarchy without turning it into a product landing page?
//
// Four stages over identical copy and identical markup: the shipped panel as a
// control, plus three directions — Drafting (cool, one system blue for every
// action), Letterpress (warm, DYMO plate, poster figures) and Index (the
// contrast thesis: same accents, three jobs each).
//
// NO NEW FONTS. The paths lab loads three Google families so a direction can
// be judged in a voice the site does not own; this lab is about colour,
// contrast and control weight, and adding a typeface would confound every
// comparison on the page. Everything below is DM Serif Display, DM Sans and
// DM Mono out of the root layout — the House scheme, exactly as the site
// ships it.
//
// Production imports nothing from here.

export const metadata: Metadata = {
  title: "Consulting colour lab",
  description:
    "Visual hierarchy and readability directions for the Consulting screen — control plus three accent treatments over identical copy.",
  robots: { index: false, follow: false },
};

export default function ConsultingColorLabPage() {
  return <ConsultingColorLab />;
}
