"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { menuItemSchema } from "@/lib/validation/menu.schema";

export type MenuFormState = { error?: string } | undefined;

async function uploadImageIfPresent(
  supabase: Awaited<ReturnType<typeof createClient>>,
  formData: FormData
): Promise<string | undefined> {
  const file = formData.get("image");
  if (!(file instanceof File) || file.size === 0) return undefined;

  const path = `${crypto.randomUUID()}-${file.name}`;
  // Unique path per upload, so a month-long cache can't serve a stale photo.
  const { error } = await supabase.storage
    .from("menu-images")
    .upload(path, file, { cacheControl: "2592000" });
  if (error) throw error;
  return path;
}

export async function createMenuItem(
  _prevState: MenuFormState,
  formData: FormData
): Promise<MenuFormState> {
  const parsed = menuItemSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid form." };
  }

  const supabase = await createClient();
  const imagePath = await uploadImageIfPresent(supabase, formData);
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

  const supabase = await createClient();
  const imagePath = await uploadImageIfPresent(supabase, formData);

  const { error } = await supabase
    .from("menu_items")
    .update({
      category_id: parsed.data.category_id,
      name: parsed.data.name,
      description: parsed.data.description || null,
      price_cents: parsed.data.price_euros
        ? Math.round(Number(parsed.data.price_euros) * 100)
        : null,
      allergen_notes: parsed.data.allergen_notes || null,
      is_available: parsed.data.is_available ?? false,
      ...(imagePath ? { image_path: imagePath } : {}),
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) return { error: error.message };

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
