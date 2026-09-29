"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function addHoursOverride(formData: FormData) {
  const date = String(formData.get("date") ?? "");
  const isClosed = formData.get("is_closed") === "on";
  const openTime = String(formData.get("open_time") ?? "");
  const closeTime = String(formData.get("close_time") ?? "");
  const note = String(formData.get("note") ?? "");

  if (!date) return;

  const supabase = await createClient();
  const { error } = await supabase.from("hours_overrides").upsert(
    {
      date,
      is_closed: isClosed,
      open_time: isClosed ? null : openTime || null,
      close_time: isClosed ? null : closeTime || null,
      note: note || null,
    },
    { onConflict: "date" }
  );

  if (error) throw error;
  revalidatePath("/");
  revalidatePath("/admin/hours-overrides");
}

export async function deleteHoursOverride(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("hours_overrides").delete().eq("id", id);
  if (error) throw error;
  revalidatePath("/");
  revalidatePath("/admin/hours-overrides");
}
