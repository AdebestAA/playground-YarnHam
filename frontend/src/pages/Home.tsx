import { Link } from "react-router-dom";
import {
  ArrowRight,
  PenLine,
  Heart,
  MessageCircle,
  Layers,
} from "lucide-react";
import { useAuthStore } from "../stores/authStore";

const FEATURES = [
  {
    icon: PenLine,
    title: "Write",
    text: "A clean, focused editor. Drop your thoughts in and publish — no clutter, no fuss.",
  },
  {
    icon: Heart,
    title: "React",
    text: "Posts you love get a tap. The good stuff rises with the people who read it.",
  },
  {
    icon: MessageCircle,
    title: "Discuss",
    text: "Every post has a comment thread. Say something, or read what others said.",
  },
];

export default function Home() {
  const user = useAuthStore((s) => s.user);

  return (
    <div className="min-h-screen bg-white text-navy-900">
      {/* ── Hero ── */}
      <section className="border-b border-navy-200">
        <div className="mx-auto max-w-5xl px-4 py-24 sm:py-32 text-center">
          <h1 className="text-[clamp(3rem,10vw,6.5rem)] font-black leading-[0.95] tracking-tighter text-navy-950">
            Write it down.
            <br />
            Keep it in your YarnHam.
          </h1>

          <p className="mx-auto mt-8 max-w-2xl text-lg leading-relaxed text-navy-500 sm:text-xl">
            Your thoughts, kept. A clean place to publish, read, and talk —
            built on PostgreSQL, Express and Redis.
          </p>

          <div className="mt-10 flex w-full flex-col items-center justify-center gap-3 sm:w-auto sm:flex-row">
            {user ? (
              <Link
                to="/blog"
                className="group inline-flex w-full items-center justify-center gap-2 rounded-full bg-navy-950 px-8 py-3.5 text-sm font-bold text-white transition-colors hover:bg-navy-800 active:bg-navy-900 sm:w-auto"
              >
                Read the Blog
                <ArrowRight
                  className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
                  aria-hidden="true"
                />
              </Link>
            ) : (
              <>
                <Link
                  to="/auth/register"
                  className="group inline-flex w-full items-center justify-center gap-2 rounded-full bg-navy-950 px-8 py-3.5 text-sm font-bold text-white transition-colors hover:bg-navy-800 active:bg-navy-900 sm:w-auto"
                >
                  Start Writing
                  <ArrowRight
                    className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
                    aria-hidden="true"
                  />
                </Link>
                <Link
                  to="/auth/login"
                  className="inline-flex w-full items-center justify-center rounded-full border border-navy-300 bg-white px-8 py-3.5 text-sm font-bold text-navy-900 transition-colors hover:border-navy-400 hover:bg-navy-50 active:bg-navy-100 sm:w-auto"
                >
                  Sign In
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="border-b border-navy-200">
        <div className="mx-auto grid max-w-5xl divide-y divide-navy-200 px-4 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
          {FEATURES.map(({ icon: Icon, title, text }) => (
            <div key={title} className="px-6 py-10 sm:px-8">
              <div className="mb-5 flex h-10 w-10 items-center justify-center rounded-xl bg-navy-950">
                <Icon className="h-5 w-5 text-white" aria-hidden="true" />
              </div>
              <h3 className="text-lg font-bold tracking-tight text-navy-950">
                {title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-navy-500">
                {text}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Closing CTA ── */}
      <section className="bg-navy-950">
        <div className="mx-auto flex max-w-5xl flex-col items-center gap-6 px-4 py-20 text-center sm:py-24">
          <Layers className="h-8 w-8 text-white" aria-hidden="true" />
          <h2 className="text-3xl font-black tracking-tight text-white sm:text-4xl">
            Your first post is one click away.
          </h2>
          {!user && (
            <Link
              to="/auth/register"
              className="inline-flex w-full items-center justify-center rounded-full bg-white px-8 py-3.5 text-sm font-bold text-navy-950 transition-colors hover:bg-navy-100 active:bg-navy-200 sm:w-auto"
            >
              Create your account
            </Link>
          )}
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-navy-200 bg-white">
        <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-3 px-4 py-6 sm:flex-row">
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-navy-950">
              <Layers className="h-3 w-3 text-white" aria-hidden="true" />
            </div>
            <span className="text-sm font-bold text-navy-900">YarnHam</span>
          </div>
          <p className="text-xs text-navy-400">
            &copy; {new Date().getFullYear()} YarnHam. Built on PostgreSQL,
            Express &amp; Redis.
          </p>
        </div>
      </footer>
    </div>
  );
}