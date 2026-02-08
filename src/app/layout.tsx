import type { Metadata } from "next";
import { DM_Serif_Display, DM_Sans } from "next/font/google";
import "./globals.css";

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
    <html lang="en" className={`${dmSerifDisplay.variable} ${dmSans.variable}`}>
      <head>
        {/* Preload card face images so they're ready before first flip */}
        <link rel="preload" href="/cards/clubs_jack.svg" as="image" />
        <link rel="preload" href="/cards/hearts_queen.svg" as="image" />
        <link rel="preload" href="/cards/diamonds_king.svg" as="image" />
        <link rel="preload" href="/cards/spades_ace.svg" as="image" />
      </head>
      <body className="bg-[#0a0a0a] text-white antialiased overflow-x-hidden">
        {children}
      </body>
    </html>
  );
}
