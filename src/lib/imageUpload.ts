const ALLOWED_IMAGE_TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
};

export const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

/** Admin görsel yüklemeleri: sadece resim türleri ve 5 MB sınırı; uzantı türden türetilir. */
export function validateImageFile(file: File): { ok: true; ext: string } | { ok: false; message: string } {
  const ext = ALLOWED_IMAGE_TYPES[file.type];
  if (!ext) return { ok: false, message: "Sadece JPG, PNG, WEBP veya GIF yüklenebilir." };
  if (file.size > MAX_IMAGE_BYTES) return { ok: false, message: "Dosya 5 MB'tan büyük olamaz." };
  return { ok: true, ext };
}
