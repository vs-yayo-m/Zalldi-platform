import { type NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'

const PROTECTED = ['/cart', '/checkout', '/orders', '/account']
const AUTH_ONLY = ['/login', '/forgot-password', '/reset-password']

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  let response = NextResponse.next({ request })
  
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: (cookies) => {
          cookies.forEach(({ name, value, options }) => {
            request.cookies.set(name, value)
            response.cookies.set(name, value, options)
          })
        },
      },
    }
  )
  
  const {
    data: { user },
  } = await supabase.auth.getUser()
  
  const isProtected = PROTECTED.some(p => pathname.startsWith(p))
  const isAuthRoute = AUTH_ONLY.some(p => pathname.startsWith(p))
  
  // 1. protect routes
  if (isProtected && !user) {
    return NextResponse.redirect(
      new URL(`/login?redirect=${pathname}`, request.url)
    )
  }
  
  // 2. prevent auth page access when logged in
  if (isAuthRoute && user) {
    return NextResponse.redirect(new URL('/home', request.url))
  }
  
  return response
}