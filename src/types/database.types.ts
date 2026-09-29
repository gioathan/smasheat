// Hand-written to match supabase/migrations/0001_init_schema.sql.
// Regenerate with `npx supabase gen types typescript --linked` once the
// project is linked to a live Supabase instance, and replace this file.
//
// Tables live in the custom `smash_eat` schema (not `public`) — the
// project's Data API "Exposed schemas" setting must include `smash_eat`,
// and every Supabase client in this app passes `db: { schema: "smash_eat" }`.

type NoRelationships = { Relationships: [] };

export type Database = {
  smash_eat: {
    Tables: {
      categories: {
        Row: {
          id: string;
          slug: string;
          name: string;
          display_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database["smash_eat"]["Tables"]["categories"]["Row"]> & {
          slug: string;
          name: string;
        };
        Update: Partial<Database["smash_eat"]["Tables"]["categories"]["Row"]>;
      } & NoRelationships;
      menu_items: {
        Row: {
          id: string;
          category_id: string;
          name: string;
          description: string | null;
          price_cents: number | null;
          allergen_notes: string | null;
          image_path: string | null;
          is_available: boolean;
          display_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database["smash_eat"]["Tables"]["menu_items"]["Row"]> & {
          category_id: string;
          name: string;
        };
        Update: Partial<Database["smash_eat"]["Tables"]["menu_items"]["Row"]>;
      } & NoRelationships;
      business_info: {
        Row: {
          id: number;
          phone: string;
          address_line: string;
          google_maps_url: string;
          google_review_url: string | null;
          google_place_id: string | null;
          google_rating: number | null;
          google_review_count: number | null;
          instagram_url: string | null;
          wolt_url: string | null;
          efood_url: string | null;
          updated_at: string;
        };
        Insert: Partial<Database["smash_eat"]["Tables"]["business_info"]["Row"]>;
        Update: Partial<Database["smash_eat"]["Tables"]["business_info"]["Row"]>;
      } & NoRelationships;
      business_hours: {
        Row: {
          id: string;
          day_of_week: number;
          is_closed: boolean;
          open_time: string | null;
          close_time: string | null;
        };
        Insert: Partial<Database["smash_eat"]["Tables"]["business_hours"]["Row"]> & {
          day_of_week: number;
        };
        Update: Partial<Database["smash_eat"]["Tables"]["business_hours"]["Row"]>;
      } & NoRelationships;
      hours_overrides: {
        Row: {
          id: string;
          date: string;
          is_closed: boolean;
          open_time: string | null;
          close_time: string | null;
          note: string | null;
          created_at: string;
        };
        Insert: Partial<Database["smash_eat"]["Tables"]["hours_overrides"]["Row"]> & {
          date: string;
        };
        Update: Partial<Database["smash_eat"]["Tables"]["hours_overrides"]["Row"]>;
      } & NoRelationships;
      gallery_images: {
        Row: {
          id: string;
          image_path: string;
          alt_text: string | null;
          display_order: number;
          created_at: string;
        };
        Insert: Partial<Database["smash_eat"]["Tables"]["gallery_images"]["Row"]> & {
          image_path: string;
        };
        Update: Partial<Database["smash_eat"]["Tables"]["gallery_images"]["Row"]>;
      } & NoRelationships;
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
  };
};
