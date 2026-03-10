import type { Metadata } from "next";
import { DM_Mono, DM_Sans, DM_Serif_Display, Permanent_Marker } from "next/font/google";
import "./globals.css";
import Splash from "@/components/Splash";

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

export const metadata: Metadata = {
  title: "Portfolio",
  description: "I Create Designs That Appeal, Engage & Sell",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${dmSerifDisplay.variable} ${dmSans.variable} ${dmMono.variable} ${permanentMarker.variable}`}
      style={{ overflowX: "clip" }}
    >
      {/* Card-face SVGs removed from preload — only seen after user flip */}
      <body className="bg-[#0a0a0a] text-white antialiased" style={{ overflowX: "clip" }}>
        <Splash />
        {children}
      </body>
    </html>
  );
}
