'use client'
import Link from 'next/link'
import { Mail } from 'lucide-react'

export default function VerifyEmailView() {
  return (
    <div className="w-full max-w-sm bg-white rounded-3xl shadow-xl p-8 text-center border border-neutral-100">
      <Mail className="w-14 h-14 text-orange-500 mx-auto mb-4" />
      <h1 className="text-2xl font-black text-neutral-900 mb-2">Check your email</h1>
      <p className="text-neutral-600 text-sm font-medium mb-6">
        We sent a verification link to your email. Click it to activate your account.
      </p>
      <Link href="/login" className="text-sm font-bold text-orange-500 hover:text-orange-600">
        Back to Sign In
      </Link>
    </div>
  )
}