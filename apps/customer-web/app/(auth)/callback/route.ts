import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/services/supabase/client.server'

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/home'
  
  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error) {
      // Validate — no open redirects
      const safe = next.startsWith('/') && !next.startsWith('//') ? next : '/home'
      return NextResponse.redirect(`${origin}${safe}`)
    }
  }
  
  return NextResponse.redirect(`${origin}/login?error=auth_failed`)
}