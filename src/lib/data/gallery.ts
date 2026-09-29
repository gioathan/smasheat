import { createPublicClient } from "@/lib/supabase/public";
import type { Database } from "@/types/database.types";

export type GalleryImage = Database["smash_eat"]["Tables"]["gallery_images"]["Row"];

export async function getGalleryImages(): Promise<
  (GalleryImage & { url: string })[]
> {
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("gallery_images")
    .select("*")
    .order("display_order", { ascending: true });

  if (error) throw error;

  return (data ?? []).map((image) => ({
    ...image,
    url: supabase.storage.from("gallery").getPublicUrl(image.image_path).data
      .publicUrl,
  }));
}
