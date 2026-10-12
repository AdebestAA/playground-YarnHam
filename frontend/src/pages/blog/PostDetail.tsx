import { useState, type FormEvent } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { usePosts, useEditPost } from "../../hooks/usePosts";
import { useCommentsByPost, useCreateComment } from "../../hooks/useComments";
import { useProfile } from "../../hooks/useAccount";
import { useAuthStore } from "../../stores/authStore";
import Spinner from "../../components/ui/Spinner";
import Button from "../../components/ui/Button";
import Textarea from "../../components/ui/Textarea";
import { ArrowLeft, Heart, MessageCircle, MessageSquare } from "lucide-react";
import { formatDate, getInitial, getUsernameFromEmail } from "../../helpers";

export default function PostDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: posts, isLoading: postsLoading } = usePosts();
  const { data: comments, isLoading: commentsLoading } = useCommentsByPost(id);
  const { data: profile } = useProfile();
  const user = useAuthStore((s) => s.user);
  const createComment = useCreateComment();
  const editPost = useEditPost();

  const [comment, setComment] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState("");

  const post = posts?.find((p) => p.id === id);

  const isOwner =
    !!profile?.nickname &&
    !!post?.nickname &&
    post.nickname === profile.nickname;

  const handleCommentSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;
    createComment.mutate({ comment: comment.trim(), post_id: id! });
    setComment("");
  };

  const handleEditSubmit = () => {
    if (!editContent.trim()) return;
    editPost.mutate(
      { id: id!, content: editContent.trim() },
      { onSuccess: () => setIsEditing(false) },
    );
  };

  if (postsLoading) {
    return (
      <div className="flex justify-center py-20">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-4">🔍</div>
          <h2 className="text-2xl font-bold text-navy-900 mb-2">Post not found</h2>
          <p className="text-navy-500 mb-6">This post doesn't exist or has been removed.</p>
          <Button onClick={() => navigate("/blog")}>Back to Blog</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <button
          onClick={() => navigate("/blog")}
          className="flex items-center gap-2 text-sm text-navy-500 hover:text-brand-600 mb-8 transition-colors group"
        >
          <ArrowLeft
            className="w-4 h-4 group-hover:-translate-x-1 transition-transform"
            aria-hidden="true"
          />
          Back to all posts
        </button>

        <article className="neu-card p-5 sm:p-10 mb-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-full bg-navy-950 flex items-center justify-center text-white font-bold text-lg">
              {(post.nickname?.trim()?.charAt(0) || "?").toUpperCase()}
            </div>
            <div>
              <p className="font-semibold text-navy-900">
                {post.nickname?.trim() || "Anonymous"}
              </p>
              <p className="text-sm text-navy-400">{formatDate(post.created_at)}</p>
            </div>
            {isOwner && (
              <div className="ml-auto">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setEditContent(post.content);
                    setIsEditing(!isEditing);
                  }}
                >
                  {isEditing ? "Cancel" : "Edit"}
                </Button>
              </div>
            )}
          </div>

          {isEditing ? (
            <div className="space-y-4">
              <Textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                rows={5}
              />
              <div className="flex gap-2">
                <Button size="sm" onClick={handleEditSubmit} isLoading={editPost.isPending}>
                  Save Changes
                </Button>
                <Button variant="outline" size="sm" onClick={() => setIsEditing(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <>
              <p className="text-navy-700 leading-relaxed whitespace-pre-wrap text-lg">
                {post.content}
              </p>
              {post.images && post.images.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                  {post.images.map((src) => (
                    <img
                      key={src}
                      src={src}
                      alt="post image"
                      loading="lazy"
                      className="w-full h-64 object-cover rounded-2xl border border-navy-200"
                    />
                  ))}
                </div>
              )}
              <div className="flex items-center gap-6 mt-6 pt-6 border-t border-white/70">
                <span className="flex items-center gap-x-2 text-sm text-navy-500">
                  <Heart size={16} /> {post.likes_count}
                  <span className="text-navy-400">likes</span>
                </span>
                <span className="flex items-center gap-x-2 text-sm text-navy-500">
                  <MessageSquare size={16} /> {post.comments_count}
                  <span className="text-navy-400">comments</span>
                </span>
              </div>
            </>
          )}
        </article>

        <div className="neu-card p-5 sm:p-10">
          <h3 className="text-xl font-bold text-navy-900 mb-6 flex items-center gap-2">
            <MessageCircle className="w-5 h-5 text-brand-600" aria-hidden="true" />
            Discussion
            {comments && (
              <span className="text-sm font-normal text-navy-400">({comments.length})</span>
            )}
          </h3>

          <div className="space-y-4 mb-8">
            {commentsLoading ? (
              <div className="flex justify-center py-8">
                <Spinner size="sm" />
              </div>
            ) : comments && comments.length > 0 ? (
              comments.map((c) => (
                <div key={c.id} className="neu-inset p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-navy-950 text-white text-[10px] font-bold">
                      {getInitial(c.user_email)}
                    </span>
                    <span className="text-xs font-semibold text-navy-700">
                      {getUsernameFromEmail(c.user_email, c.user_email)}
                    </span>
                    <span className="text-xs text-navy-400">{formatDate(c.created_at)}</span>
                  </div>
                  <p className="text-navy-600 text-sm leading-relaxed">{c.comment}</p>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <p className="text-navy-400">No comments yet. Start the conversation!</p>
              </div>
            )}
          </div>

          {user ? (
            <form onSubmit={handleCommentSubmit} className="flex gap-3 items-start">
              <Textarea
                placeholder="Write a comment..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={3}
                className="flex-1"
              />
              <Button
                type="submit"
                size="md"
                isLoading={createComment.isPending}
                className="shrink-0"
              >
                Post
              </Button>
            </form>
          ) : (
            <div className="neu-inset p-6 text-center">
              <p className="text-navy-500 text-sm">
                <a href="/auth/login" className="text-brand-600 font-semibold hover:text-brand-700">
                  Sign in
                </a>{" "}
                to join the discussion.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
