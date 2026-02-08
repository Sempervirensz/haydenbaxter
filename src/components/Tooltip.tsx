interface TooltipProps {
  visible: boolean;
  color?: "black" | "red";
}

export default function Tooltip({ visible, color = "black" }: TooltipProps) {
  return (
    <div
      className={`tooltip ${!visible ? "tooltip-hidden" : ""}`}
    >
      <span
        className="inline-block px-4 py-2 rounded-full text-sm font-medium shadow-lg border"
        style={{
          fontFamily: "var(--font-sans)",
          backgroundColor: "white",
          color: color === "red" ? "#b91c1c" : "#1a1a1a",
          borderColor: color === "red" ? "rgba(185,28,28,0.2)" : "rgba(0,0,0,0.1)",
        }}
      >
        Click to flip
      </span>
    </div>
  );
}
