/* ===========================================================================
   HIDDEN ALTERNATE SITE: /v2

   A full alternate version of the portfolio (warm parchment editorial design,
   ported from a Bolt prototype). Unlisted: not linked from nav, footer,
   sitemap, or homepage, noindex'd here, and listed in NON_PUBLIC_PREFIXES.

   To remove: delete src/app/v2/, src/components/v2/, src/data/v2Content.ts,
   src/styles/v2-theme.css (+ its @import in globals.css), the "/v2" entry in
   src/data/site.ts, and the lucide-react dependency if nothing else uses it.
   =========================================================================== */

import type { Metadata, Viewport } from "next";
import { Fraunces, Inter, JetBrains_Mono } from "next/font/google";
import V2Site from "@/components/v2/V2Site";
import { socialCard } from "@/data/site";
import "./v2.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-v2-serif",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-v2-sans",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-v2-mono",
});

const TITLE = "Hayden Baxter — Global Business Strategist & AI Product Builder";
const DESCRIPTION =
  "Hayden Baxter helps organizations put AI to work, strengthen global supply chains, and innovate where sustainability meets next-generation technology.";

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  // Own share card, so a sent link previews this design, not the main site's.
  ...socialCard({ title: TITLE, description: DESCRIPTION, path: "/v2", image: "/v2/opengraph-image" }),
  robots: { index: false, follow: false, googleBot: { index: false, follow: false } },
};

export const viewport: Viewport = {
  themeColor: "#f7f5f0",
};

export default function V2Page() {
  return (
    <div className={`${fraunces.variable} ${inter.variable} ${jetbrainsMono.variable}`}>
      <V2Site />
    </div>
  );
}
