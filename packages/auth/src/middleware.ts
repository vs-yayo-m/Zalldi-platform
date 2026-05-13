import { createServerClient } from "@supabase/ssr";

// ============================================================
// Supabase Middleware Helper
// Refreshes auth session and manages cookie forwarding
//
// NOTE: We intentionally do NOT import NextRequest/NextResponse
// from "next/server" here. Doing so causes TypeScript errors
// when apps use different Next.js patch versions.
// The app's middleware.ts passes its own NextRequest/NextResponse
// and we work with them via the generic Request interface.
// ============================================================

export async function updateSession(request: Request) {
  // Dynamically import next/server so the import resolves from
  // the *calling app's* node_modules, not the package's.
  const { NextResponse } = await import("next/server");

  // @ts-expect-error - NextRequest is a superset of Request; cookies exist at runtime
  const requestCookies = request.cookies;

  let supabaseResponse = NextResponse.next({ request });

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    console.warn("Supabase env vars not set — skipping session update");
    return { response: supabaseResponse, user: null };
  }

  const supabase = createServerClient(url, key, {
    cookies: {
      getAll() {
        return requestCookies.getAll();
      },
      setAll(cookiesToSet: Array<{ name: string; value: string; options?: Record<string, unknown> }>) {
        cookiesToSet.forEach(({ name, value }) => requestCookies.set(name, value));
        supabaseResponse = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options as Parameters<typeof supabaseResponse.cookies.set>[2])
        );
      },
    },
  });

  // Refresh session — required for Server Components to get fresh session
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return { response: supabaseResponse, user };
}
