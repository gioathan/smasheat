const MAX_EDGE = 2000;
const QUALITY = 0.82;

// Browser-only. Phone photos are several MB, which is over the Server Action
// body limit and far heavier than the site needs, so downscale to a 2000px
// WebP before uploading. Anything the browser can't decode (or an SVG/GIF)
// is returned untouched.
export async function shrinkImage(file: File, maxEdge = MAX_EDGE): Promise<File> {
  if (!file.type.startsWith("image/") || /svg|gif/.test(file.type)) return file;

  let bitmap: ImageBitmap;
  try {
    bitmap = await createImageBitmap(file, { imageOrientation: "from-image" });
  } catch {
    return file;
  }

  const scale = Math.min(1, maxEdge / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  canvas.getContext("2d")?.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();

  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, "image/webp", QUALITY)
  );
  // Safari before 17 falls back to PNG here, which can be bigger than the
  // original — only keep the result when it's actually smaller.
  if (!blob || blob.type !== "image/webp" || blob.size >= file.size) return file;

  const name = file.name.replace(/\.[^.]+$/, "") + ".webp";
  return new File([blob], name, { type: "image/webp" });
}

// Swaps the form's "image" entry for its downscaled version, in place.
export async function shrinkImageField(formData: FormData, field = "image", maxEdge = MAX_EDGE) {
  const file = formData.get(field);
  if (file instanceof File && file.size > 0) {
    formData.set(field, await shrinkImage(file, maxEdge));
  }
}
