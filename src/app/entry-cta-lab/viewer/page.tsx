import ResponsiveViewer from "@/components/site-parallax-lab/ResponsiveViewer";

// Display-size preview for the entry route chooser.
//
// Reuses the viewer the cinematic stack already uses rather than growing a
// second one: the page cannot change its own viewport, but an <iframe> has its
// own, so the frame width genuinely drives the framed route's media queries and
// vw units. That is what makes 4K and ultra-wide real here without the hardware.
//
// It opens on /entry-cta-lab and gains a Direction group that drives the framed
// page over postMessage — see EntryCtaLab's listener.

export const metadata = {
  title: "Entry route chooser — display sizes",
  robots: { index: false },
};

export default function EntryRoutesViewerPage() {
  return <ResponsiveViewer initialSrc="/entry-cta-lab" />;
}
