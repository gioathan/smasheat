"use client";

import { Suspense, useActionState } from "react";
import { useSearchParams } from "next/navigation";
import { login } from "./actions";
import { Button } from "@/components/ui/Button";
import { createClient } from "@/lib/supabase/client";

function GoogleButton() {
  async function handleGoogleLogin() {
    const supabase = createClient();
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/admin/auth/callback` },
    });
  }

  return (
    <button
      type="button"
      onClick={handleGoogleLogin}
      className="flex w-full items-center justify-center gap-2 rounded-full border border-ink-900/15 px-5 py-2.5 text-sm font-semibold text-ink-900 hover:border-ink-900/30"
    >
      <svg viewBox="0 0 24 24" className="size-4" aria-hidden="true">
        <path
          fill="#4285F4"
          d="M23.52 12.27c0-.85-.08-1.66-.22-2.45H12v4.64h6.47a5.53 5.53 0 0 1-2.4 3.63v3h3.87c2.27-2.09 3.58-5.17 3.58-8.82Z"
        />
        <path
          fill="#34A853"
          d="M12 24c3.24 0 5.96-1.07 7.94-2.91l-3.87-3c-1.08.72-2.46 1.15-4.07 1.15-3.13 0-5.78-2.11-6.73-4.96H1.27v3.11A12 12 0 0 0 12 24Z"
        />
        <path
          fill="#FBBC05"
          d="M5.27 14.28A7.2 7.2 0 0 1 4.89 12c0-.79.14-1.56.38-2.28V6.61H1.27A12 12 0 0 0 0 12c0 1.94.46 3.77 1.27 5.39l4-3.11Z"
        />
        <path
          fill="#EA4335"
          d="M12 4.75c1.76 0 3.35.61 4.6 1.8l3.44-3.44C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.69 1.27 6.61l4 3.11C6.22 6.86 8.87 4.75 12 4.75Z"
        />
      </svg>
      Sign in with Google
    </button>
  );
}

function LoginError() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");
  if (error !== "not_authorized") return null;

  return (
    <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
      That Google account isn&apos;t authorized for admin access.
    </p>
  );
}

export default function LoginPage() {
  const [state, formAction, pending] = useActionState(login, undefined);

  return (
    <div className="flex min-h-screen items-center justify-center bg-ink-900 px-4">
      <div className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-lg">
        <h1 className="font-display text-xl font-bold text-ink-900">Smasheat admin</h1>
        <p className="mt-1 text-sm text-ink-600">Sign in to manage the site.</p>

        <Suspense fallback={null}>
          <LoginError />
        </Suspense>

        <div className="mt-6">
          <GoogleButton />
        </div>

        <div className="my-5 flex items-center gap-3 text-xs text-ink-600">
          <span className="h-px flex-1 bg-ink-900/10" />
          or
          <span className="h-px flex-1 bg-ink-900/10" />
        </div>

        <form action={formAction}>
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="text-sm font-medium text-ink-900">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="mt-1 w-full rounded-lg border border-ink-900/15 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none"
              />
            </div>
            <div>
              <label htmlFor="password" className="text-sm font-medium text-ink-900">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="mt-1 w-full rounded-lg border border-ink-900/15 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none"
              />
            </div>
          </div>

          {state?.error && (
            <p className="mt-4 text-sm text-red-600">{state.error}</p>
          )}

          <Button className="mt-6 w-full" disabled={pending}>
            {pending ? "Signing in…" : "Sign in"}
          </Button>
        </form>
      </div>
    </div>
  );
}
