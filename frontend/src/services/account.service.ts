import api from "../lib/api";
import type { UpdateProfilePayload, UserProfile } from "../types";

export const accountService = {
  async getProfile() {
    const { data } = await api.get<{ success: boolean; data: UserProfile }>(
      "/accounts",
    );
    if (!data.success) {
      throw new Error("Failed to load profile");
    }
    return data.data;
  },

  async updateProfile(payload: UpdateProfilePayload) {
    const { data } = await api.patch<{ success: boolean; message?: string }>(
      "/accounts",
      payload,
    );
    if (!data.success) {
      throw new Error(data.message || "Failed to update profile");
    }
    return data;
  },

  async updateProfilePic(file: File) {
    const formData = new FormData();
    formData.append("image", file);

    const { data } = await api.post<{ success: boolean; message?: string }>(
      "/accounts/profile-pic",
      formData,
      { headers: { "Content-Type": "multipart/form-data" } },
    );
    if (!data.success) {
      throw new Error(data.message || "Failed to upload image");
    }
    return data;
  },
};
