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
    "I'm Hayden — a product builder, supply chain operator, and emerging-tech generalist based between the U.S. and Asia. I've spent 8+ years navigating international sourcing, building design-driven products, and translating complex workflows into systems that actually ship. I'm fluent in Mandarin, grounded in operations, and obsessed with the space where data, design, and the real world collide.",
  photos: [
    { src: "/about/pano.webp", alt: "On location — panorama", w: 2600, h: 922 },
    { src: "/about/landscape-1.webp", alt: "In the field", w: 1350, h: 1800 },
    { src: "/about/phone.webp", alt: "Mobile capture", w: 693, h: 1500 },
    { src: "/about/landscape-2.webp", alt: "Working trip", w: 1350, h: 1800 },
    { src: "/about/portrait.webp", alt: "Portrait", w: 1350, h: 1800 },
  ],
};
