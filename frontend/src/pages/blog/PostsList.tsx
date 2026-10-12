import { Link, useNavigate } from "react-router-dom";
import { usePosts, useToggleLike } from "../../hooks/usePosts";
import { useAuthStore } from "../../stores/authStore";
import { useProfile } from "../../hooks/useAccount";
import Spinner from "../../components/ui/Spinner";
import Button from "../../components/ui/Button";
import Avatar from "../../components/ui/Avatar";
import { MessageSquare, Heart, PenLine, Feather, WifiOff } from "lucide-react";
import type { PostFromApi } from "../../types";
import { timeAgo, getUsernameFromEmail } from "../../helpers";

function PostImages({ images }: { images: string[] }) {
  if (!images || images.length === 0) return null;
  if (images.length === 1) {
    return (
      <div className="px-4 pb-3">
        <img
          src={images[0]}
          alt="post attachment"
          loading="lazy"
          className="w-full max-h-[420px] object-cover rounded-xl border border-navy-100"
        />
      </div>
    );
  }
  return (
    <div className="px-4 pb-3">
      <div className="grid grid-cols-2 gap-1 overflow-hidden rounded-xl border border-navy-100">
        {images.slice(0, 4).map((src, i) => (
          <img
            key={`${src}-${i}`}
            src={src}
            alt={`post attachment ${i + 1}`}
            loading="lazy"
            className="w-full h-52 object-cover"
          />
        ))}
      </div>
    </div>
  );
}

function PostCard({ post }: { post: PostFromApi }) {
  const toggleLike = useToggleLike();
  const name = post.nickname?.trim() || "Anonymous";

  return (
    <article className="neu-card neu-card-hover overflow-hidden">
      <div className="px-4 sm:px-5 pt-4 pb-3 flex items-center gap-3">
        <Avatar name={name} size="md" />
        <div className="min-w-0">
          <p className="text-[15px] font-semibold text-navy-900 leading-tight truncate">
            {name}
          </p>
          <p className="text-[13px] text-navy-400 leading-tight mt-0.5">
            {timeAgo(post.created_at)}
          </p>
        </div>
      </div>

      <Link to={`/blog/${post.id}`} className="block px-4 sm:px-5 pb-3">
        <p className="text-[15.5px] text-navy-800 leading-relaxed whitespace-pre-wrap break-words">
          {post.content}
        </p>
      </Link>

      <PostImages images={post.images} />

      <div className="flex items-center gap-1 px-2 sm:px-3 py-1.5 border-t border-navy-100">
        <button
          type="button"
          onClick={() => toggleLike.mutate(post.id)}
          disabled={toggleLike.isPending}
          aria-pressed={!!post.liked_by_me}
          aria-label={post.liked_by_me ? "Unlike" : "Like"}
          className={`flex items-center gap-2 px-3 py-2 text-[13px] font-medium rounded-full cursor-pointer transition-colors disabled:opacity-50 ${
            post.liked_by_me
              ? "text-brand-600 bg-brand-50"
              : "text-navy-500 hover:text-brand-600 hover:bg-brand-50"
          }`}
        >
          <Heart size={17} fill={post.liked_by_me ? "currentColor" : "none"} />
          {post.likes_count}
        </button>
        <Link
          to={`/blog/${post.id}`}
          aria-label="Comments"
          className="flex items-center gap-2 px-3 py-2 text-[13px] font-medium text-navy-500 rounded-full hover:text-navy-950 hover:bg-navy-100 transition-colors"
        >
          <MessageSquare size={17} />
          {post.comments_count}
        </Link>
      </div>
    </article>
  );
}

export default function PostsList() {
  const { data: posts, isLoading, isError } = usePosts();
  const user = useAuthStore((s) => s.user);
  const { data: profile } = useProfile(!!user);
  const navigate = useNavigate();
  const displayName = profile?.nickname || getUsernameFromEmail(user?.email);

  return (
    <div className="max-w-[620px] mx-auto px-3 sm:px-0 py-8">
      <div className="px-1 mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-navy-950">
          Feed
        </h1>
        <p className="text-navy-500 mt-1">
          Latest posts from everyone.
        </p>
      </div>

      {user && (
        <button
          onClick={() => navigate("/blog/create")}
          className="neu-card neu-card-hover group w-full flex items-center gap-3 px-4 py-3.5 mb-6 text-left cursor-pointer"
        >
          <Avatar name={displayName} src={profile?.avatar} size="md" />
          <span className="flex-1 min-w-0 truncate text-[15px] text-navy-400 bg-navy-50 border border-navy-100 rounded-full px-4 py-2.5 group-hover:border-navy-200 transition-colors">
            What&apos;s on your mind?
          </span>
          <span className="shrink-0 inline-flex items-center gap-1.5 text-sm font-semibold text-white bg-brand-600 group-hover:bg-brand-700 rounded-full px-4 py-2.5 transition-colors">
            <PenLine className="w-4 h-4" aria-hidden="true" />
            <span className="hidden min-[400px]:inline">Write</span>
          </span>
        </button>
      )}

      {isLoading && (
        <div className="flex justify-center py-20">
          <Spinner size="lg" />
        </div>
      )}

      {isError && (
        <div className="neu-card text-center py-16 px-6">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-navy-100">
            <WifiOff className="h-5 w-5 text-navy-500" aria-hidden="true" />
          </div>
          <h3 className="text-lg font-bold text-navy-900 mb-2">
            Couldn&apos;t load the feed
          </h3>
          <p className="text-navy-500 text-sm mb-6">
            Something went wrong. Check your connection and try again.
          </p>
          <Button variant="outline" onClick={() => window.location.reload()}>
            Try again
          </Button>
        </div>
      )}

      {!isLoading && !isError && posts?.length === 0 && (
        <div className="neu-card text-center py-16 px-6">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-brand-50">
            <Feather className="h-5 w-5 text-brand-600" aria-hidden="true" />
          </div>
          <h3 className="text-lg font-bold text-navy-900 mb-2">
            It&apos;s quiet in here
          </h3>
          <p className="text-navy-500 text-sm mb-6">
            Be the first to share something with the feed.
          </p>
          {user && (
            <Button variant="accent" onClick={() => navigate("/blog/create")}>
              Write the first post
            </Button>
          )}
        </div>
      )}

      {posts && posts.length > 0 && (
        <div className="space-y-4">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}
