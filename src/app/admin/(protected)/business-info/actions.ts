"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { businessInfoSchema } from "@/lib/validation/business-info.schema";

export type BusinessInfoFormState = { error?: string; success?: boolean } | undefined;

export async function updateBusinessInfo(
  _prevState: BusinessInfoFormState,
  formData: FormData
): Promise<BusinessInfoFormState> {
  const parsed = businessInfoSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid form." };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("business_info")
    .update({
      phone: parsed.data.phone,
      address_line: parsed.data.address_line,
      google_maps_url: parsed.data.google_maps_url,
      google_place_id: parsed.data.google_place_id || null,
      instagram_url: parsed.data.instagram_url || null,
      wolt_url: parsed.data.wolt_url || null,
      efood_url: parsed.data.efood_url || null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", 1);

  if (error) return { error: error.message };

  revalidatePath("/");
  revalidatePath("/admin/business-info");
  return { success: true };
}

export async function updateBusinessHours(formData: FormData) {
  const supabase = await createClient();

  const updates = Array.from({ length: 7 }).map(async (_, dayOfWeek) => {
    const isClosed = formData.get(`closed_${dayOfWeek}`) === "on";
    const openTime = formData.get(`open_${dayOfWeek}`);
    const closeTime = formData.get(`close_${dayOfWeek}`);

    return supabase
      .from("business_hours")
      .update({
        is_closed: isClosed,
        open_time: isClosed ? null : String(openTime || "") || null,
        close_time: isClosed ? null : String(closeTime || "") || null,
      })
      .eq("day_of_week", dayOfWeek);
  });

  await Promise.all(updates);
  revalidatePath("/");
  revalidatePath("/admin/business-info");
}
