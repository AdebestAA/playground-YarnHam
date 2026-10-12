import { Link } from "react-router-dom";
import { type ReactNode } from "react";
import { Layers } from "lucide-react";

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
      <div className="hidden lg:flex lg:w-5/12 relative overflow-hidden bg-brand-500">
        <div className="relative flex flex-col justify-center px-14 w-full">
          <Link to="/" className="flex items-center gap-2.5 mb-12 group">
            <div className="w-10 h-10 rounded-full bg-white/15 flex items-center justify-center">
              <Layers className="w-5 h-5 text-white" aria-hidden="true" />
            </div>
            <span className="text-2xl font-bold text-white tracking-tight">
              YarnHam
            </span>
          </Link>

          <h2 className="text-4xl font-bold text-white leading-tight mb-4 tracking-tight">
            Write it down.
            <br />
            Keep it in your YarnHam.
          </h2>
          <p className="text-lg text-white/80 leading-relaxed">
            Your thoughts, kept.
            <br />
            Write once, find it forever.
          </p>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <Link to="/" className="lg:hidden flex items-center gap-2 mb-10">
            <div className="w-8 h-8 rounded-full bg-brand-500 flex items-center justify-center">
              <Layers className="w-4 h-4 text-white" aria-hidden="true" />
            </div>
            <span className="text-lg font-bold text-navy-900">YarnHam</span>
          </Link>

          <div className="mb-8">
            <h1 className="text-3xl font-bold text-navy-900 mb-2 tracking-tight">
              {title}
            </h1>
            {subtitle && <p className="text-navy-400">{subtitle}</p>}
          </div>

          {children}

          {footerLink && (
            <p className="mt-8 text-center text-sm text-navy-400">
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
