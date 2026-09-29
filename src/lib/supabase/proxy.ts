import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { isAllowedAdminEmail } from "@/lib/auth";

// Refreshes the Supabase auth cookie on every request and performs an
// optimistic redirect for /admin routes. This is a fast, cookie-only
// check (Supabase validates the JWT signature, no extra DB round trip);
// the real per-request authorization still happens in app/admin/layout.tsx.
export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isAdminRoute = request.nextUrl.pathname.startsWith("/admin");
  const isLoginRoute = request.nextUrl.pathname === "/admin/login";
  const isAuthCallback = request.nextUrl.pathname.startsWith("/admin/auth/callback");
  const isAuthorized = !!user && isAllowedAdminEmail(user.email);

  if (isAdminRoute && !isLoginRoute && !isAuthCallback && !isAuthorized) {
    const loginUrl = new URL("/admin/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  if (isLoginRoute && isAuthorized) {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  return response;
}
