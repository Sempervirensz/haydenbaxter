import type { Metadata } from "next";
import { Caveat, DM_Mono, DM_Sans, DM_Serif_Display, Permanent_Marker } from "next/font/google";
import "./globals.css";
import Splash from "@/components/Splash";
import { SITE_URL, SITE_NAME, SITE_TITLE, SITE_DESCRIPTION } from "@/data/site";

const dmSerifDisplay = DM_Serif_Display({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-serif",
});

const dmSans = DM_Sans({
  weight: ["400", "500"],
  subsets: ["latin"],
  variable: "--font-sans",
});

const dmMono = DM_Mono({
  weight: ["400", "500"],
  subsets: ["latin"],
  variable: "--font-mono",
});

const permanentMarker = Permanent_Marker({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-marker",
});

const caveat = Caveat({
  weight: ["500", "600"],
  subsets: ["latin"],
  variable: "--font-cursive",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_TITLE,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${dmSerifDisplay.variable} ${dmSans.variable} ${dmMono.variable} ${permanentMarker.variable} ${caveat.variable}`}
      style={{ overflowX: "clip" }}
      suppressHydrationWarning
    >
      {/* Card-face SVGs removed from preload — only seen after user flip */}
      <body className="bg-[#0a0a0a] text-white antialiased" style={{ overflowX: "clip" }}>
        {/* Safari (desktop+iOS) struggles with backdrop-filter on tall sticky
            glass cards — causes severe scroll jitter through the Work section.
            Tag <html> synchronously so a Safari-only CSS override can simplify
            those surfaces without affecting Chrome/Firefox. */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "try{var u=navigator.userAgent;if(/^((?!chrome|crios|fxios|android).)*safari/i.test(u)){document.documentElement.classList.add('is-safari');}}catch(e){}",
          }}
        />
        <Splash />
        {children}
      </body>
    </html>
  );
}
