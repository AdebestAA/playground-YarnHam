import { Link } from "react-router-dom";
import { type ReactNode } from "react";
import Logo from "../ui/Logo";

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
  footerText?: string;
  footerLink?: string;
  footerLinkText?: string;
}

export default function AuthLayout({
  children,
  title,
  subtitle,
  footerText,
  footerLink,
  footerLinkText,
}: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex bg-white">
      <div className="hidden lg:flex lg:w-5/12 bg-navy-950">
        <div className="flex flex-col justify-between px-14 py-12 w-full">
          <Logo inverted />

          <div>
            <h2 className="text-4xl font-bold text-white leading-tight tracking-tight mb-4">
              Write it down.
              <br />
              Keep it in your YarnHam.
            </h2>
            <p className="text-lg text-navy-400 leading-relaxed max-w-sm">
              Short posts, likes and replies. Nothing else in the way.
            </p>
          </div>

          <p className="text-sm text-navy-500">
            &copy; {new Date().getFullYear()} YarnHam
          </p>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <div className="lg:hidden mb-10">
            <Logo />
          </div>

          <div className="mb-8">
            <h1 className="text-3xl font-bold text-navy-950 mb-2 tracking-tight">
              {title}
            </h1>
            {subtitle && <p className="text-navy-500">{subtitle}</p>}
          </div>

          {children}

          {footerLink && (
            <p className="mt-8 text-center text-sm text-navy-500">
              {footerText}{" "}
              <Link
                to={footerLink}
                className="font-semibold text-brand-600 hover:text-brand-700 transition-colors"
              >
                {footerLinkText}
              </Link>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
