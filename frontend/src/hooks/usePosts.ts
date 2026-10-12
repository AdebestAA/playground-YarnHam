import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { postService } from "../services/post.service";
import { getErrorMessage } from "../lib/errors";

export function usePosts() {
  return useQuery({
    queryKey: ["posts"],
    queryFn: postService.getAll,
  });
}

export function useCreatePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ content, images }: { content: string; images: File[] }) =>
      postService.create(content, images),
    onSuccess: () => {
      toast.success("Post published!");
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Failed to create post"));
    },
  });
}

export function useToggleLike() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => postService.toggleLike(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Failed to like post"));
    },
  });
}

export function useEditPost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, content }: { id: string; content: string }) =>
      postService.edit(id, content),
    onSuccess: () => {
      toast.success("Post updated!");
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Failed to update post"));
    },
  });
}
