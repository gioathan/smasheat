import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { isAllowedAdminEmail } from "@/lib/auth";

// Google redirects here after consent, with a ?code= to exchange for a
// session. Supabase would otherwise let any Google account sign in and
// auto-create a user for it, so this also enforces ADMIN_ALLOWED_EMAILS.
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");

  if (code) {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error && isAllowedAdminEmail(data.user?.email)) {
      return NextResponse.redirect(`${origin}/admin`);
    }

    await supabase.auth.signOut();
  }

  return NextResponse.redirect(`${origin}/admin/login?error=not_authorized`);
}
