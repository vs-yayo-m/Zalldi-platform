'use client'
import { createBrowserClient } from '@supabase/ssr'
import type { Database } from '@zalldi/types'

let instance: ReturnType < typeof createBrowserClient < Database >> | null = null

export function createBrowserSupabaseClient() {
  if (instance) return instance
  instance = createBrowserClient < Database > (
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
  return instance
}