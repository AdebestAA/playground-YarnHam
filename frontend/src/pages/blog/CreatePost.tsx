import { useRef, useState, type FormEvent } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, ImagePlus, Lightbulb, X } from "lucide-react";
import { useCreatePost } from "../../hooks/usePosts";
import {
  MAX_POST_IMAGES,
  createObjectUrls,
  revokeObjectUrls,
} from "../../helpers";
import Button from "../../components/ui/Button";

export default function CreatePost() {
  const navigate = useNavigate();
  const location = useLocation();
  const prompt = (location.state as { prompt?: string } | null)?.prompt;
  const createPost = useCreatePost();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [content, setContent] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);

  const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const picked = Array.from(e.target.files ?? []).slice(
      0,
      MAX_POST_IMAGES - images.length,
    );
    if (picked.length === 0) return;
    setImages((prev) => [...prev, ...picked]);
    setPreviews((prev) => [...prev, ...createObjectUrls(picked)]);
    e.target.value = "";
  };

  const removeImage = (index: number) => {
    revokeObjectUrls([previews[index]]);
    setImages((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    createPost.mutate(
      { content: content.trim(), images },
      {
        onSuccess: () => {
          revokeObjectUrls(previews);
          navigate("/blog");
        },
      },
    );
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-20">
        <button
          onClick={() => navigate("/blog")}
          className="flex items-center gap-2 text-sm text-navy-500 hover:text-navy-900 mb-8 transition-colors group"
        >
          <ArrowLeft
            className="w-4 h-4 group-hover:-translate-x-1 transition-transform"
            aria-hidden="true"
          />
          Back to feed
        </button>

        <div className="mb-6">
          <h1 className="text-3xl font-bold text-navy-950 tracking-tight">
            New post
          </h1>
          <p className="text-navy-500 mt-1">
            Share a thought, an idea, or something you learned today.
          </p>
        </div>

        {prompt && (
          <div className="mb-4 flex items-start gap-3 rounded-2xl border border-brand-100 bg-brand-50 px-4 py-3">
            <Lightbulb className="w-5 h-5 text-brand-600 shrink-0 mt-0.5" aria-hidden="true" />
            <p className="text-sm text-navy-700">
              <span className="font-semibold text-navy-900">Prompt:</span>{" "}
              {prompt}
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="neu-card overflow-hidden">
          <label htmlFor="post-content" className="sr-only">
            What's on your mind?
          </label>
          <textarea
            id="post-content"
            autoFocus
            placeholder={prompt ? `${prompt}…` : "What's on your mind?"}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={8}
            className="block w-full resize-none bg-transparent px-5 sm:px-7 pt-6 pb-4 text-lg leading-relaxed text-navy-900 placeholder:text-navy-400 focus:outline-none"
          />

          {previews.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 px-5 sm:px-7 pb-5">
              {previews.map((src, i) => (
                <div key={src} className="relative group">
                  <img
                    src={src}
                    alt={`preview ${i + 1}`}
                    className="w-full h-24 object-cover rounded-xl border border-navy-200"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(i)}
                    aria-label={`Remove image ${i + 1}`}
                    className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-navy-950/75 text-white flex items-center justify-center transition-opacity opacity-100 sm:opacity-0 sm:group-hover:opacity-100 sm:focus:opacity-100"
                  >
                    <X className="w-3.5 h-3.5" aria-hidden="true" />
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-navy-100 bg-navy-50/60 px-4 sm:px-6 py-3">
            <div className="flex items-center gap-3">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handleFiles}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={images.length >= MAX_POST_IMAGES}
                className="inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm font-medium text-navy-600 hover:bg-navy-100 hover:text-navy-900 transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ImagePlus className="w-[18px] h-[18px]" aria-hidden="true" />
                <span>
                  Images{" "}
                  <span className="text-navy-400">
                    {images.length}/{MAX_POST_IMAGES}
                  </span>
                </span>
              </button>
              <span className="text-xs text-navy-400 tabular-nums">
                {content.length} chars
              </span>
            </div>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => navigate("/blog")}
              >
                Discard
              </Button>
              <Button
                type="submit"
                variant="accent"
                size="sm"
                isLoading={createPost.isPending}
                disabled={!content.trim()}
              >
                Publish
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
