'use client'
import { useSearchParams, useRouter } from 'next/navigation'
import { useCallback } from 'react'

// Only these paths are safe redirect targets — prevents open redirect attacks
const SAFE_PATHS = [
  '/home', '/groceries', '/cart',
  '/checkout', '/orders', '/account', '/search',
]

function isSafeRedirect(path: string): boolean {
  return SAFE_PATHS.some(safe => path.startsWith(safe))
}

export function useAuthRedirect() {
  const searchParams = useSearchParams()
  const router = useRouter()
  
  const redirectAfterAuth = useCallback(() => {
    const redirectParam = searchParams.get('redirect')
    const destination =
      redirectParam && isSafeRedirect(redirectParam) ?
      redirectParam :
      '/home'
    
    router.replace(destination)
  }, [searchParams, router])
  
  return { redirectAfterAuth }
}