import { Suspense } from 'react'
import LoginView from '@/features/auth/ui/LoginView'

export const metadata = { title: 'Create Account — Zalldi' }

export default function RegisterPage() {
  return (
    <Suspense>
      <LoginView />
    </Suspense>
  )
}