import { createPublicClient } from "@/lib/supabase/public";
import type { Database } from "@/types/database.types";

export type BusinessInfo = Database["smash_eat"]["Tables"]["business_info"]["Row"];
export type BusinessHour = Database["smash_eat"]["Tables"]["business_hours"]["Row"];
export type HoursOverride = Database["smash_eat"]["Tables"]["hours_overrides"]["Row"];

export async function getBusinessInfo(): Promise<BusinessInfo | null> {
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("business_info")
    .select("*")
    .eq("id", 1)
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function getBusinessHours(): Promise<BusinessHour[]> {
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("business_hours")
    .select("*")
    .order("day_of_week", { ascending: true });

  if (error) throw error;
  return data ?? [];
}

export async function getUpcomingHoursOverrides(): Promise<HoursOverride[]> {
  const supabase = createPublicClient();
  const today = new Date().toISOString().slice(0, 10);
  const { data, error } = await supabase
    .from("hours_overrides")
    .select("*")
    .gte("date", today)
    .order("date", { ascending: true });

  if (error) throw error;
  return data ?? [];
}

/** Every override, past ones included — for the admin list. */
export async function getAllHoursOverrides(): Promise<HoursOverride[]> {
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("hours_overrides")
    .select("*")
    .order("date", { ascending: false });

  if (error) throw error;
  return data ?? [];
}
