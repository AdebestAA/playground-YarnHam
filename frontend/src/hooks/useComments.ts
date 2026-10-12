import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { commentService } from "../services/comment.service";
import { getErrorMessage } from "../lib/errors";

export function useCommentsByPost(postId: string | undefined) {
  return useQuery({
    queryKey: ["comments", postId],
    queryFn: () => commentService.getByPostId(postId!),
    enabled: !!postId,
  });
}

export function useCreateComment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      comment,
      post_id,
    }: {
      comment: string;
      post_id: string;
    }) => commentService.create(comment, post_id),
    onSuccess: (_data, variables) => {
      toast.success("Comment added!");
      queryClient.invalidateQueries({ queryKey: ["comments", variables.post_id] });
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Failed to add comment"));
    },
  });
}
