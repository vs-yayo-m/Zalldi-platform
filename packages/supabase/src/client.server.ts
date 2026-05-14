import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import type { Database } from '@zalldi/types'

export async function createClient() {
  const cookieStore = await cookies()
  
  return createServerClient < Database > (
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // Called from Server Component — safe to ignore
          }
        },
      },
    }
  )
}

export async function createServiceRoleClient() {
  const { createClient: supabase } = await import('@supabase/supabase-js')
  return supabase < Database > (
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!, // NEVER NEXT_PUBLIC_
    { auth: { autoRefreshToken: false, persistSession: false } }
  )
}