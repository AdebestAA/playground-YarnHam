import { Link } from "react-router-dom";
import { ArrowRight, ArrowUpRight, Heart, MessageSquare } from "lucide-react";
import { useAuthStore } from "../stores/authStore";
import Avatar from "../components/ui/Avatar";
import Logo from "../components/ui/Logo";

const PREVIEW_POSTS = [
  {
    name: "Tolu",
    time: "2h",
    text: "Finally fixed the bug that's been haunting me for a week. It was a missing await. It's always a missing await.",
    likes: 48,
    comments: 12,
    liked: true,
  },
  {
    name: "Kemi",
    time: "5h",
    text: "The best ideas show up on long bus rides, not in meetings. Change my mind.",
    likes: 31,
    comments: 9,
    liked: false,
  },
  {
    name: "Chidi",
    time: "1d",
    text: "Read 20 pages every morning for a month. Didn't think it'd stick, but here we are.",
    likes: 22,
    comments: 4,
    liked: false,
  },
];

const PROMPTS = [
  "Something you learned this week",
  "A small win nobody noticed",
  "The best advice you ignored",
  "What you'd tell yourself a year ago",
  "A book or song on repeat",
  "A place that feels like home",
];

function PreviewCard({ post }: { post: (typeof PREVIEW_POSTS)[number] }) {
  return (
    <div className="neu-card p-4">
      <div className="flex items-center gap-3 mb-2.5">
        <Avatar name={post.name} size="sm" />
        <p className="text-sm font-semibold text-navy-900">
          {post.name}
          <span className="ml-1.5 font-normal text-navy-400">· {post.time}</span>
        </p>
      </div>
      <p className="text-[15px] leading-relaxed text-navy-800">{post.text}</p>
      <div className="mt-3 flex items-center gap-5 text-[13px] font-medium text-navy-500">
        <span
          className={`flex items-center gap-1.5 ${post.liked ? "text-brand-600" : ""}`}
        >
          <Heart
            size={15}
            fill={post.liked ? "currentColor" : "none"}
            aria-hidden="true"
          />
          {post.likes}
        </span>
        <span className="flex items-center gap-1.5">
          <MessageSquare size={15} aria-hidden="true" />
          {post.comments}
        </span>
      </div>
    </div>
  );
}

export default function Home() {
  const user = useAuthStore((s) => s.user);
  const primaryTo = user ? "/blog" : "/auth/register";

  return (
    <div className="min-h-screen bg-white text-navy-900">
      {/* ── Hero ── */}
      <section className="border-b border-navy-200">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-16 sm:px-6 sm:py-24 lg:grid-cols-2 lg:gap-16 lg:px-8">
          <div>
            <h1 className="text-[clamp(2.5rem,6vw,4.25rem)] font-bold leading-[1.05] tracking-tight text-navy-950">
              Say what&apos;s on your mind.
            </h1>

            <p className="mt-5 max-w-md text-lg leading-relaxed text-navy-500">
              Post a thought, like the ones you agree with, and reply when you
              have something to add. That&apos;s YarnHam.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                to={primaryTo}
                className="group inline-flex items-center justify-center gap-2 rounded-full bg-navy-950 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-navy-800"
              >
                {user ? "Go to your feed" : "Create an account"}
                <ArrowRight
                  className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
                  aria-hidden="true"
                />
              </Link>
              {!user && (
                <Link
                  to="/auth/login"
                  className="inline-flex items-center justify-center rounded-full border border-navy-300 bg-white px-6 py-3 text-sm font-semibold text-navy-900 transition-colors hover:border-navy-400 hover:bg-navy-50"
                >
                  Log in
                </Link>
              )}
            </div>
          </div>

          {/* Feed preview */}
          <div className="rounded-2xl border border-navy-200 bg-navy-50 p-3 sm:p-4">
            <div className="flex items-center justify-between px-1 pb-3">
              <span className="text-sm font-semibold text-navy-900">Feed</span>
              <span className="text-xs text-navy-400">Latest</span>
            </div>
            <div className="space-y-2.5">
              {PREVIEW_POSTS.map((post) => (
                <PreviewCard key={post.name} post={post} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Prompts ── */}
      <section className="border-b border-navy-200">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
          <h2 className="text-2xl font-bold tracking-tight text-navy-950 sm:text-3xl">
            Need something to write about?
          </h2>
          <p className="mt-2 text-navy-500">
            Pick one. A couple of sentences is plenty.
          </p>

          <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {PROMPTS.map((prompt) => (
              <Link
                key={prompt}
                to={user ? "/blog/create" : "/auth/register"}
                state={{ prompt }}
                className="neu-card-sm neu-card-hover group flex items-center justify-between gap-4 px-4 py-3.5"
              >
                <span className="text-[15px] font-medium text-navy-800">
                  {prompt}
                </span>
                <ArrowUpRight
                  className="h-4 w-4 shrink-0 text-navy-300 transition-colors group-hover:text-brand-600"
                  aria-hidden="true"
                />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Closing CTA ── */}
      <section className="bg-navy-950">
        <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-6 px-4 py-14 sm:flex-row sm:items-center sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
            Your first post takes about a minute.
          </h2>
          <Link
            to={primaryTo}
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-navy-950 transition-colors hover:bg-navy-100"
          >
            {user ? "Open the feed" : "Get started"}
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="bg-white">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-4 py-6 sm:flex-row sm:px-6 lg:px-8">
          <Logo size="sm" />
          <p className="text-xs text-navy-400">
            &copy; {new Date().getFullYear()} YarnHam. Built on PostgreSQL,
            Express &amp; Redis.
          </p>
        </div>
      </footer>
    </div>
  );
}
