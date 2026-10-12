import api from "../lib/api";
import type { PostFromApi } from "../types";

export const postService = {
  async getAll() {
    const { data } = await api.get<{ success: boolean; data: PostFromApi[] }>(
      "/posts",
    );

    if (!data.success) throw new Error("Failed to fetch posts");
    return data.data;
  },

  async create(content: string, images: File[] = []) {
    const formData = new FormData();
    formData.append("content", content);
    images.forEach((img) => formData.append("images", img));

    const { data } = await api.post<{ success: boolean; message?: string }>(
      "/posts",
      formData,
      { headers: { "Content-Type": "multipart/form-data" } },
    );
    if (!data.success) throw new Error(data.message || "Failed to create post");
    return data;
  },

  async edit(id: string, content: string) {
    const { data } = await api.patch<{ success: boolean; message?: string }>(
      `/posts/${id}`,
      { content },
    );
    if (!data.success) throw new Error(data.message || "Failed to edit post");
    return data;
  },

  async toggleLike(id: string) {
    const { data } = await api.post<{ success: boolean; liked: boolean }>(
      `/posts/likes/${id}`,
    );
    if (!data.success) throw new Error("Failed to toggle like");
    return data;
  },
};
