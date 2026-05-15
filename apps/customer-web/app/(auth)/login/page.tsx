import { Suspense } from 'react'
import LoginView from '@/features/auth/ui/LoginView'

export const metadata = { title: 'Login — Zalldi' }

export default function LoginPage() {
  return (
    <Suspense>
      <LoginView />
    </Suspense>
  )
}