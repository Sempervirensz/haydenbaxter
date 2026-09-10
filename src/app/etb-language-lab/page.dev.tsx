import type { Metadata } from "next";
import ETBLanguageLab from "@/components/etb-language-lab/ETBLanguageLab";

// Should the Selected AI Work gallery speak the consulting sheet's design
// language? Four independent axes — type triad, accent meaning, top of
// hierarchy, ink ramp — rendered over the REAL /emerging-tech-builds page.
//
// `page.dev.tsx`, so this is a route in dev only (see `pageExtensions` in
// next.config.ts). Production imports nothing from here, and nothing in
// `src/styles/work-details.css` is modified — every axis is an override in
// `etb-language-lab.css`, which is what the eventual diff gets lifted from.

export const metadata: Metadata = {
  title: "ETB language lab",
  description:
    "Four axes over the live Selected AI Work gallery — type triad, accent meaning, top of hierarchy, ink ramp — testing whether it should adopt the consulting sheet's design language.",
  robots: { index: false, follow: false },
};

export default function ETBLanguageLabPage() {
  return <ETBLanguageLab />;
}
