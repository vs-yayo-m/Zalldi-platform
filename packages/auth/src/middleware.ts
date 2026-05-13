import { createServerClient } from "@supabase/ssr";

export async function updateSession(request: Request) {
  const requestCookies = (request as any).cookies;
  
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  if (!url || !key) {
    return { user: null };
  }
  
  const supabase = createServerClient(url, key, {
    cookies: {
      getAll() {
        return requestCookies.getAll();
      },
      setAll() {
        // ❌ no framework response handling here
      },
    },
  });
  
  const {
    data: { user },
  } = await supabase.auth.getUser();
  
  return { user };
}