"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import {
  categoryAllowsPhoto,
  menuItemSchema,
  menuPhotoError,
} from "@/lib/validation/menu.schema";

export type MenuFormState = { error?: string } | undefined;

type Supabase = Awaited<ReturnType<typeof createClient>>;

async function categoryTakesPhoto(supabase: Supabase, categoryId: string): Promise<boolean> {
  const { data } = await supabase
    .from("categories")
    .select("slug")
    .eq("id", categoryId)
    .maybeSingle();
  return data ? categoryAllowsPhoto(data.slug) : true;
}

async function uploadImageIfPresent(
  supabase: Supabase,
  formData: FormData
): Promise<{ path?: string; error?: string }> {
  const file = formData.get("image");
  if (!(file instanceof File) || file.size === 0) return {};

  const path = `${crypto.randomUUID()}-${file.name}`;
  // Unique path per upload, so a month-long cache can't serve a stale photo.
  const { error } = await supabase.storage
    .from("menu-images")
    .upload(path, file, { cacheControl: "2592000" });
  if (error) return { error: `Photo upload failed: ${error.message}` };
  return { path };
}

export async function createMenuItem(
  _prevState: MenuFormState,
  formData: FormData
): Promise<MenuFormState> {
  const parsed = menuItemSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid form." };
  }

  const photoError = menuPhotoError(formData.get("image"));
  if (photoError) return { error: photoError };

  const supabase = await createClient();
  if (!(await categoryTakesPhoto(supabase, parsed.data.category_id))) formData.delete("image");
  const { path: imagePath, error: uploadError } = await uploadImageIfPresent(supabase, formData);
  if (uploadError) return { error: uploadError };
  const { data: existing } = await supabase
    .from("menu_items")
    .select("display_order")
    .eq("category_id", parsed.data.category_id)
    .order("display_order", { ascending: false })
    .limit(1)
    .maybeSingle();

  const { error } = await supabase.from("menu_items").insert({
    category_id: parsed.data.category_id,
    name: parsed.data.name,
    description: parsed.data.description || null,
    price_cents: parsed.data.price_euros
      ? Math.round(Number(parsed.data.price_euros) * 100)
      : null,
    allergen_notes: parsed.data.allergen_notes || null,
    is_available: parsed.data.is_available ?? false,
    display_order: (existing?.display_order ?? -1) + 1,
    ...(imagePath ? { image_path: imagePath } : {}),
  });

  if (error) return { error: error.message };

  revalidatePath("/");
  revalidatePath("/admin/menu");
  redirect("/admin/menu");
}

export async function updateMenuItem(
  id: string,
  _prevState: MenuFormState,
  formData: FormData
): Promise<MenuFormState> {
  const parsed = menuItemSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid form." };
  }

  const photoError = menuPhotoError(formData.get("image"));
  if (photoError) return { error: photoError };

  const supabase = await createClient();
  const { data: previous } = await supabase
    .from("menu_items")
    .select("image_path, category_id")
    .eq("id", id)
    .maybeSingle();
  if (!previous) return { error: "This item no longer exists." };

  if (!(await categoryTakesPhoto(supabase, previous.category_id))) formData.delete("image");
  const { path: imagePath, error: uploadError } = await uploadImageIfPresent(supabase, formData);
  if (uploadError) return { error: uploadError };

  const removePhoto = formData.get("remove_image") === "on";

  const { error } = await supabase
    .from("menu_items")
    // category_id is deliberately left alone: an item never changes category.
    .update({
      name: parsed.data.name,
      description: parsed.data.description || null,
      price_cents: parsed.data.price_euros
        ? Math.round(Number(parsed.data.price_euros) * 100)
        : null,
      allergen_notes: parsed.data.allergen_notes || null,
      is_available: parsed.data.is_available ?? false,
      ...(imagePath ? { image_path: imagePath } : removePhoto ? { image_path: null } : {}),
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) return { error: error.message };

  // The old file is no longer referenced once it is replaced or removed.
  if (previous.image_path && (imagePath || removePhoto)) {
    await supabase.storage.from("menu-images").remove([previous.image_path]);
  }

  revalidatePath("/");
  revalidatePath("/admin/menu");
  redirect("/admin/menu");
}

export async function deleteMenuItem(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("menu_items").delete().eq("id", id);
  if (error) throw error;
  revalidatePath("/");
  revalidatePath("/admin/menu");
}

export async function toggleAvailability(id: string, isAvailable: boolean) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("menu_items")
    .update({ is_available: !isAvailable })
    .eq("id", id);
  if (error) throw error;
  revalidatePath("/");
  revalidatePath("/admin/menu");
}

export async function moveMenuItem(
  id: string,
  categoryId: string,
  direction: "up" | "down"
) {
  const supabase = await createClient();
  const { data: items, error } = await supabase
    .from("menu_items")
    .select("id, display_order")
    .eq("category_id", categoryId)
    .order("display_order", { ascending: true });

  if (error) throw error;

  const index = items.findIndex((i) => i.id === id);
  const swapIndex = direction === "up" ? index - 1 : index + 1;
  if (index === -1 || swapIndex < 0 || swapIndex >= items.length) return;

  const a = items[index];
  const b = items[swapIndex];

  await Promise.all([
    supabase.from("menu_items").update({ display_order: b.display_order }).eq("id", a.id),
    supabase.from("menu_items").update({ display_order: a.display_order }).eq("id", b.id),
  ]);

  revalidatePath("/");
  revalidatePath("/admin/menu");
}

export async function renameCategory(id: string, formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  if (!name) return;
  const supabase = await createClient();
  const { error } = await supabase
    .from("categories")
    .update({ name, updated_at: new Date().toISOString() })
    .eq("id", id);
  if (error) throw error;
  revalidatePath("/");
  revalidatePath("/admin/menu");
}
