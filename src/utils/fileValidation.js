export const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif"
];

export const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

export function validateImageFile(file) {
  if (!file) {
    return { valid: false, error: "Vui lòng chọn ảnh." };
  }

  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    return {
      valid: false,
      error: "Chỉ chấp nhận ảnh JPG, PNG, WebP hoặc GIF."
    };
  }

  if (file.size > MAX_IMAGE_SIZE) {
    return {
      valid: false,
      error: "Ảnh không được vượt quá 5MB."
    };
  }

  return { valid: true, error: null };
}

export function createSafeFileName(file, prefix = "image") {
  const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const safeExt = ["jpg", "jpeg", "png", "webp", "gif"].includes(ext) ? ext : "jpg";
  const id =
    typeof crypto !== "undefined" && crypto.randomUUID
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(36).slice(2)}`;

  return `${prefix}-${id}.${safeExt}`;
}
