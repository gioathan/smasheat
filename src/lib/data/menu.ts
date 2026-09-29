import { createPublicClient } from "@/lib/supabase/public";
import type { Database } from "@/types/database.types";

export type MenuItem = Database["smash_eat"]["Tables"]["menu_items"]["Row"] & {
  image_url: string | null;
};
export type Category = Database["smash_eat"]["Tables"]["categories"]["Row"] & {
  menu_items: MenuItem[];
};

export async function getMenu(): Promise<Category[]> {
  const supabase = createPublicClient();

  const { data, error } = await supabase
    .from("categories")
    .select("*, menu_items(*)")
    .order("display_order", { ascending: true })
    .order("display_order", { referencedTable: "menu_items", ascending: true });

  if (error) throw error;

  type RawCategory = Database["smash_eat"]["Tables"]["categories"]["Row"] & {
    menu_items: Database["smash_eat"]["Tables"]["menu_items"]["Row"][];
  };
  const categories = (data ?? []) as unknown as RawCategory[];

  return categories.map((category) => ({
    ...category,
    menu_items: category.menu_items.map((item) => ({
      ...item,
      image_url: item.image_path
        ? supabase.storage.from("menu-images").getPublicUrl(item.image_path).data.publicUrl
        : null,
    })),
  }));
}
