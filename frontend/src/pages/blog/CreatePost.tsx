import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useCreatePost } from "../../hooks/usePosts";
import {
  MAX_POST_IMAGES,
  createObjectUrls,
  revokeObjectUrls,
} from "../../helpers";
import Button from "../../components/ui/Button";
import Textarea from "../../components/ui/Textarea";

export default function CreatePost() {
  const navigate = useNavigate();
  const createPost = useCreatePost();
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
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-20">
        <button
          onClick={() => navigate("/blog")}
          className="flex items-center gap-2 text-sm text-navy-500 hover:text-brand-600 mb-8 transition-colors group"
        >
          <ArrowLeft
            className="w-4 h-4 group-hover:-translate-x-1 transition-transform"
            aria-hidden="true"
          />
          Cancel
        </button>

        <div className="neu-card p-5 sm:p-10">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-navy-900 mb-2 tracking-tight">
              Create a <span className="text-navy-950 font-black">new post</span>
            </h1>
            <p className="text-navy-500">
              Share your thoughts, ideas, or what you learned today.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <Textarea
              label="What's on your mind?"
              placeholder="Start writing something..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={8}
            />

            <div>
              <label className="block text-sm font-semibold text-navy-800 mb-2">
                Images (optional, max 4)
              </label>
              <input
                type="file"
                accept="image/*"
                multiple
                disabled={images.length >= 4}
                onChange={handleFiles}
                className="block w-full text-sm text-navy-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:text-white file:bg-navy-950 hover:file:bg-navy-800 file:cursor-pointer file:transition-colors disabled:opacity-50"
              />
              {previews.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
                  {previews.map((src, i) => (
                    <div key={src} className="relative group">
                      <img
                        src={src}
                        alt={`preview ${i + 1}`}
                        className="w-full h-24 object-cover rounded-xl shadow-md"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(i)}
                        className="absolute top-1 right-1 w-6 h-6 rounded-full bg-navy-900/70 text-white text-xs flex items-center justify-center transition-opacity opacity-100 sm:opacity-0 sm:group-hover:opacity-100 sm:focus:opacity-100"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <p className="text-sm text-navy-400">
                {content.length} characters
              </p>
              <div className="flex flex-wrap gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/blog")}
                >
                  Discard
                </Button>
                <Button
                  type="submit"
                  isLoading={createPost.isPending}
                  disabled={!content.trim()}
                >
                  Publish Post
                </Button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
