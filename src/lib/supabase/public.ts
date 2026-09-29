import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database.types";

// Cookie-free client for anonymous, RLS "public read" queries used by the
// marketing page's data functions (lib/data/*). Unlike the SSR client in
// server.ts, this never calls cookies()/headers(), so routes that only use
// it stay eligible for static rendering / ISR instead of being forced fully
// dynamic on every request.
export function createPublicClient() {
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { db: { schema: "smash_eat" } }
  );
}
