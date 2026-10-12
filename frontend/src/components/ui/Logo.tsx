import { Link } from "react-router-dom";
import { Feather } from "lucide-react";

interface LogoProps {
  to?: string;
  inverted?: boolean;
  hideWordmarkOnMobile?: boolean;
  size?: "sm" | "md";
}

export default function Logo({
  to = "/",
  inverted = false,
  hideWordmarkOnMobile = false,
  size = "md",
}: LogoProps) {
  const mark = size === "sm" ? "w-7 h-7 rounded-lg" : "w-9 h-9 rounded-xl";
  const icon = size === "sm" ? "w-3.5 h-3.5" : "w-[18px] h-[18px]";
  const text = size === "sm" ? "text-base" : "text-xl";

  return (
    <Link to={to} className="flex items-center gap-2.5 group">
      <div
        className={`${mark} flex items-center justify-center transition-colors ${
          inverted ? "bg-white" : "bg-navy-950 group-hover:bg-navy-800"
        }`}
      >
        <Feather
          className={`${icon} ${inverted ? "text-navy-950" : "text-white"}`}
          aria-hidden="true"
        />
      </div>
      <span
        className={`${text} font-bold tracking-tight ${
          inverted ? "text-white" : "text-navy-950"
        } ${hideWordmarkOnMobile ? "hidden min-[460px]:block" : ""}`}
      >
        YarnHam
      </span>
    </Link>
  );
}
