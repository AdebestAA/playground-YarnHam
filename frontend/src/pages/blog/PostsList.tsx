import { Link, useNavigate } from "react-router-dom";
import { usePosts, useToggleLike } from "../../hooks/usePosts";
import { useAuthStore } from "../../stores/authStore";
import { useProfile } from "../../hooks/useAccount";
import Spinner from "../../components/ui/Spinner";
import Button from "../../components/ui/Button";
import { MessageSquare, Heart } from "lucide-react";
import type { PostFromApi } from "../../types";
import { timeAgo, getInitial } from "../../helpers";

function PostImages({ images }: { images: string[] }) {
  if (!images || images.length === 0) return null;
  if (images.length === 1) {
    return (
      <img
        src={images[0]}
        alt="post attachment"
        loading="lazy"
        className="w-full max-h-[420px] object-cover"
      />
    );
  }
  return (
    <div className="grid grid-cols-2 gap-0.5">
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
  );
}

function PostCard({ post }: { post: PostFromApi }) {
  const toggleLike = useToggleLike();

  return (
    <article className="neu-card overflow-hidden">
      <div className="px-4 pt-4 pb-3 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-navy-900 flex items-center justify-center text-white text-sm font-bold shrink-0">
          {getInitial(post.nickname, "?")}
        </div>
        <div className="min-w-0">
          <p className="text-[15px] font-bold text-navy-900 leading-tight truncate">
            {post.nickname?.trim() || "Anonymous"}
          </p>
          <p className="text-[13px] text-navy-400 leading-tight">
            {timeAgo(post.created_at)}
          </p>
        </div>
      </div>

      <Link to={`/blog/${post.id}`} className="block px-4 pb-3">
        <p className="text-[15px] text-navy-800 leading-normal whitespace-pre-wrap break-words">
          {post.content}
        </p>
      </Link>

      <PostImages images={post.images} />

      <div className="flex items-center px-2 py-1 border-t border-navy-100 mt-0">
        <button
          type="button"
          onClick={() => toggleLike.mutate(post.id)}
          disabled={toggleLike.isPending}
          className={`flex items-center gap-2 px-3 py-2 text-[13px] font-semibold rounded-full cursor-pointer transition-colors disabled:opacity-50 ${
            post.liked_by_me
              ? "text-navy-950"
              : "text-navy-500 hover:text-navy-950"
          }`}
        >
          <Heart size={17} fill={post.liked_by_me ? "currentColor" : "none"} />
          {post.likes_count}
        </button>
        <Link
          to={`/blog/${post.id}`}
          className="flex items-center gap-2 px-3 py-2 text-[13px] font-semibold text-navy-500 rounded-full hover:text-navy-950 transition-colors"
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

  return (
    <div className="max-w-[600px] mx-auto px-3 sm:px-0 py-6">
      {user && (
        <button
          onClick={() => navigate("/blog/create")}
          className="neu-card w-full flex items-center gap-3 px-4 py-3.5 mb-4 text-left cursor-pointer"
        >
          <div className="w-10 h-10 rounded-full bg-navy-900 flex items-center justify-center text-white text-sm font-bold shrink-0">
            {getInitial(profile?.nickname || user?.email, "?")}
          </div>
          <span className="flex-1 min-w-0 truncate text-[15px] text-navy-400 bg-navy-50 border border-navy-100 rounded-full px-4 py-2.5">
            What&apos;s happening?
          </span>
          <span className="shrink-0 text-sm font-bold text-white bg-brand-500 hover:bg-brand-600 rounded-full px-5 py-2 transition-colors">
            Post
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
          <h3 className="text-lg font-bold text-navy-900 mb-2">
            Couldn&apos;t load the feed
          </h3>
          <p className="text-navy-500 text-sm mb-6">
            Something went wrong. Check your connection and try again.
          </p>
          <Button variant="outline" onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </div>
      )}

      {!isLoading && !isError && posts?.length === 0 && (
        <div className="neu-card text-center py-16 px-6">
          <h3 className="text-lg font-bold text-navy-900 mb-2">No posts yet</h3>
          <p className="text-navy-500 text-sm mb-6">
            Be the first to share something with the feed.
          </p>
          {user && (
            <Button onClick={() => navigate("/blog/create")}>
              Create a post
            </Button>
          )}
        </div>
      )}

      {posts && posts.length > 0 && (
        <div className="space-y-3">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}
