interface CardBackProps {
  variant: "black" | "red";
}

/* Plain <img> rather than next/image: `images.unoptimized` is required for
 * static export, so next/image emits a single-candidate srcset and there is no
 * way to hand it two real encodes. width/height carry the intrinsic ratio so
 * the box is reserved before the bytes land. */
export default function CardBack({ variant }: CardBackProps) {
  const base =
    variant === "red"
      ? "/images/cards/playing-card-back-red"
      : "/images/cards/playing-card-back-blue";

  return (
    <div className="w-full h-full bg-white relative">
      {/* React 19 hoists this into <head>. imagesrcset/imagesizes matter: without
          them the preload fetches the 560w file and the <img> then picks 320w,
          so the phone downloads both. With them the preload resolves to exactly
          the candidate the <img> uses. */}
      <link
        rel="preload"
        as="image"
        href={`${base}.webp`}
        imageSrcSet={`${base}-320w.webp 320w, ${base}.webp 560w`}
        imageSizes="(max-width: 640px) 25vw, 280px"
        fetchPriority="high"
      />
      <img
        src={`${base}.webp`}
        srcSet={`${base}-320w.webp 320w, ${base}.webp 560w`}
        sizes="(max-width: 640px) 25vw, 280px"
        width={560}
        height={835}
        alt="Card back"
        className="absolute inset-0 w-full h-full object-cover"
        fetchPriority="high"
        decoding="async"
        draggable={false}
      />
    </div>
  );
}
