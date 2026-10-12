import api from "../lib/api";
import type { PostComment } from "../types";

export const commentService = {
  async getByPostId(postId: string) {
    const { data } = await api.get<{ success: boolean; data: PostComment[] }>(
      `/comments/${postId}`,
    );
    if (!data.success) throw new Error("Failed to fetch comments");
    return data.data;
  },

  async create(comment: string, post_id: string) {
    const { data } = await api.post<{ success: boolean; message?: string }>(
      "/comments",
      { comment, post_id },
    );
    if (!data.success)
      throw new Error(data.message || "Failed to add comment");
    return data;
  },
};
