import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { accountService } from "../services/account.service";
import { getErrorMessage } from "../lib/errors";
import type { UpdateProfilePayload } from "../types";

export function useProfile(enabled = true) {
  return useQuery({
    queryKey: ["profile"],
    queryFn: accountService.getProfile,
    enabled,
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateProfilePayload) =>
      accountService.updateProfile(payload),
    onSuccess: () => {
      toast.success("Profile updated!");
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Failed to update profile"));
    },
  });
}

export function useUpdateProfilePic() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (file: File) => accountService.updateProfilePic(file),
    onSuccess: () => {
      toast.success("Profile picture updated!");
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Failed to upload image"));
    },
  });
}
