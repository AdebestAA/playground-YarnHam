export const MAX_POST_IMAGES = 4;

export const AVATAR_MAX_SIZE = 2 * 1024 * 1024;

export const AVATAR_ALLOWED_TYPES = ["image/jpeg", "image/png"];

export function createObjectUrls(files: File[]): string[] {
  return files.map((f) => URL.createObjectURL(f));
}

export function revokeObjectUrls(urls: Array<string | null | undefined>): void {
  urls.forEach((url) => {
    if (url) URL.revokeObjectURL(url);
  });
}

export function validateAvatarFile(file: File): string | null {
  if (!AVATAR_ALLOWED_TYPES.includes(file.type)) {
    return "Only JPEG or PNG images are allowed.";
  }
  if (file.size > AVATAR_MAX_SIZE) {
    return "Image must be smaller than 2MB.";
  }
  return null;
}
