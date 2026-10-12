import { type ButtonHTMLAttributes } from "react";
import { LoaderCircle } from "lucide-react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
}

export default function Button({
  variant = "primary",
  size = "md",
  isLoading,
  children,
  className = "",
  disabled,
  ...props
}: ButtonProps) {
  const base =
    "inline-flex items-center justify-center font-bold rounded-full transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed";

  const variants: Record<string, string> = {
    primary: "text-white bg-navy-950 hover:bg-navy-800 active:bg-navy-900",
    secondary:
      "bg-white border border-navy-300 text-navy-900 hover:border-navy-400 hover:bg-navy-50 active:bg-navy-100",
    outline:
      "bg-white border border-navy-200 text-navy-900 hover:border-navy-300 hover:bg-navy-50 active:bg-navy-100",
    ghost: "text-navy-600 hover:bg-navy-100 active:bg-navy-200",
  };

  const sizes: Record<string, string> = {
    sm: "px-4 py-2 text-sm gap-1.5",
    md: "px-6 py-2.5 text-sm gap-2",
    lg: "px-8 py-3 text-base gap-2.5",
  };

  return (
    <button
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && (
        <LoaderCircle className="animate-spin h-4 w-4" aria-hidden="true" />
      )}
      {children}
    </button>
  );
}
