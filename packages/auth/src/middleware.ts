import { createServerClient } from "@supabase/ssr";

export async function updateSession(
  request: Request,
  response: any
) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  if (!url || !key) {
    console.warn("Supabase env vars missing");
    return { response, user: null };
  }
  
  const supabase = createServerClient(url, key, {
    cookies: {
      getAll() {
        return (request as any).cookies?.getAll?.() ?? [];
      },
      setAll(
  cookiesToSet: Array<{
    name: string;
    value: string;
    options?: Record<string, unknown>;
  }>
) {
        const reqCookies = (request as any).cookies;
        cookiesToSet.forEach(({ name, value }) => {
          reqCookies?.set?.(name, value);
        });
      },
    },
  });
  
  const {
    data: { user },
  } = await supabase.auth.getUser();
  
  return { response, user };
}