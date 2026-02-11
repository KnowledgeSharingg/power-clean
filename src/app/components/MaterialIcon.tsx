interface MaterialIconProps {
  name: string;
  className?: string;
  filled?: boolean;
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl";
}

const sizeClasses = {
  xs: "text-xs",
  sm: "text-sm",
  md: "text-base",
  lg: "text-lg",
  xl: "text-xl",
  "2xl": "text-2xl",
  "3xl": "text-3xl",
};

export default function MaterialIcon({
  name,
  className = "",
  filled = false,
  size = "md",
}: MaterialIconProps) {
  return (
    <span
      className={`material-symbols-outlined select-none ${sizeClasses[size]} ${filled ? "font-variation-fill" : ""} ${className}`}
      style={
        filled
          ? { fontVariationSettings: '"FILL" 1, "wght" 400, "GRAD" 0, "opsz" 24' }
          : undefined
      }
    >
      {name}
    </span>
  );
}
