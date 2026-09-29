"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export type GalleryFormState = { error?: string } | undefined;

export async function uploadGalleryImage(
  _prevState: GalleryFormState,
  formData: FormData
): Promise<GalleryFormState> {
  const file = formData.get("image");
  const altText = String(formData.get("alt_text") ?? "");

  if (!(file instanceof File) || file.size === 0) {
    return { error: "Choose an image to upload." };
  }

  const supabase = await createClient();
  const path = `${crypto.randomUUID()}-${file.name}`;

  // The path includes a random UUID, so a file is never overwritten and a
  // month-long browser/CDN cache can't ever show a stale photo.
  const { error: uploadError } = await supabase.storage
    .from("gallery")
    .upload(path, file, { cacheControl: "2592000" });
  if (uploadError) return { error: uploadError.message };

  const { data: existing } = await supabase
    .from("gallery_images")
    .select("display_order")
    .order("display_order", { ascending: false })
    .limit(1)
    .maybeSingle();

  const { error: insertError } = await supabase.from("gallery_images").insert({
    image_path: path,
    alt_text: altText || null,
    display_order: (existing?.display_order ?? -1) + 1,
  });
  if (insertError) return { error: insertError.message };

  revalidatePath("/");
  revalidatePath("/admin/gallery");
  return undefined;
}

export async function deleteGalleryImage(id: string, imagePath: string) {
  const supabase = await createClient();
  await supabase.storage.from("gallery").remove([imagePath]);
  const { error } = await supabase.from("gallery_images").delete().eq("id", id);
  if (error) throw error;
  revalidatePath("/");
  revalidatePath("/admin/gallery");
}

export async function moveGalleryImage(id: string, direction: "up" | "down") {
  const supabase = await createClient();
  const { data: images, error } = await supabase
    .from("gallery_images")
    .select("id, display_order")
    .order("display_order", { ascending: true });

  if (error) throw error;

  const index = images.findIndex((i) => i.id === id);
  const swapIndex = direction === "up" ? index - 1 : index + 1;
  if (index === -1 || swapIndex < 0 || swapIndex >= images.length) return;

  const a = images[index];
  const b = images[swapIndex];

  await Promise.all([
    supabase.from("gallery_images").update({ display_order: b.display_order }).eq("id", a.id),
    supabase.from("gallery_images").update({ display_order: a.display_order }).eq("id", b.id),
  ]);

  revalidatePath("/");
  revalidatePath("/admin/gallery");
}
