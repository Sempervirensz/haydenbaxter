// Curated personal collage. Aspect ratios are encoded so each frame fits
// the source image without forced cropping — see globals.css `.about__photo--N`.
//
// Served as pre-compressed WebP (the originals are 22MB of camera-native
// JPEG/PNG, which is what made the gallery flaky on desktop, where all five
// load at once). EXIF rotation is baked into the pixels, so no browser has to
// interpret an orientation tag. `w`/`h` are the real intrinsic dimensions.
export const ABOUT_DATA = {
  heading: "About",
  intro:
    "I'm Hayden, a global business leader, AI strategy partner, and founder of WorldPulse. Over the past 8+ years, I've worked across international sourcing, procurement, and supply chain operations with companies including Nike and Disney, while building practical AI products and Digital Product Passport experiences. I'm fluent in Mandarin and work at the intersection of emerging technology, cross-cultural business, and real-world operations, helping organizations turn complex opportunities into clear strategies, stronger systems, and practical next steps.",
  photos: [
    { src: "/about/pano.webp", alt: "On location — panorama", w: 2600, h: 922 },
    { src: "/about/landscape-1.webp", alt: "In the field", w: 1350, h: 1800 },
    { src: "/about/phone.webp", alt: "Mobile capture", w: 693, h: 1500 },
    { src: "/about/landscape-2.webp", alt: "Working trip", w: 1350, h: 1800 },
    { src: "/about/portrait.webp", alt: "Portrait", w: 1350, h: 1800 },
  ],
};
