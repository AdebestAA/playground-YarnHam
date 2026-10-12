import { getAvatarColor, getInitial } from "../../helpers";

interface AvatarProps {
  name?: string | null;
  src?: string | null;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  className?: string;
}

const SIZES: Record<NonNullable<AvatarProps["size"]>, string> = {
  xs: "w-6 h-6 text-[10px]",
  sm: "w-8 h-8 text-xs",
  md: "w-10 h-10 text-sm",
  lg: "w-12 h-12 text-lg",
  xl: "w-24 h-24 text-3xl",
};

export default function Avatar({
  name,
  src,
  size = "md",
  className = "",
}: AvatarProps) {
  if (src) {
    return (
      <img
        src={src}
        alt={name ? `${name}'s avatar` : "Avatar"}
        className={`${SIZES[size]} shrink-0 rounded-full object-cover ring-2 ring-white ${className}`}
      />
    );
  }

  return (
    <div
      aria-hidden="true"
      className={`${SIZES[size]} ${getAvatarColor(name)} shrink-0 rounded-full flex items-center justify-center font-semibold text-white ring-2 ring-white ${className}`}
    >
      {getInitial(name)}
    </div>
  );
}
