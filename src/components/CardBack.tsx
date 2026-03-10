import Image from "next/image";

interface CardBackProps {
  variant: "black" | "red";
}

export default function CardBack({ variant }: CardBackProps) {
  const src =
    variant === "red"
      ? "/cards/back-red-custom.webp"
      : "/cards/back-blue-custom.webp";

  return (
    <div className="w-full h-full bg-white relative">
      <Image
        src={src}
        alt="Card back"
        fill
        sizes="(max-width: 640px) 25vw, 280px"
        className="object-cover"
        priority
        draggable={false}
      />
    </div>
  );
}
