interface CardBackProps {
  variant: "black" | "red";
}

export default function CardBack({ variant }: CardBackProps) {
  // Use the user's custom card back images
  const src =
    variant === "red"
      ? "/cards/back-red-custom.png"
      : "/cards/back-blue-custom.png";

  return (
    <div className="w-full h-full bg-white">
      <img
        src={src}
        alt="Card back"
        className="w-full h-full object-cover"
        draggable={false}
      />
    </div>
  );
}
