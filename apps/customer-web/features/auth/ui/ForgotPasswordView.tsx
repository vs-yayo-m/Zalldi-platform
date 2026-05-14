'use client'
import React, { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Mail, ArrowLeft, Loader2, CheckCircle } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import { validateEmail } from '@/utils/validators'

export default function ForgotPasswordView() {
  const { resetPassword } = useAuth()
  const [email, setEmail] = useState('')
  const [error, setError] = useState < string | null > (null)
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const err = validateEmail(email)
    if (err) { setError(err); return }
    setError(null)
    setLoading(true)
    try {
      await resetPassword(email)
      setSent(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send reset email')
    } finally {
      setLoading(false)
    }
  }
  
  return (
    <div className="w-full max-w-sm">
      <Link href="/login" className="inline-flex items-center gap-2 text-sm font-semibold text-neutral-600 hover:text-orange-500 mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" />
        Back to Sign In
      </Link>

      {sent ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-3xl shadow-xl p-8 text-center border border-neutral-100"
        >
          <CheckCircle className="w-14 h-14 text-green-500 mx-auto mb-4" />
          <h2 className="text-xl font-black text-neutral-900 mb-2">Check your email</h2>
          <p className="text-neutral-600 text-sm font-medium mb-6">
            We sent a reset link to <strong>{email}</strong>
          </p>
          <Link href="/login" className="text-sm font-bold text-orange-500 hover:text-orange-600">
            Back to Sign In
          </Link>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-3xl shadow-xl p-8 border border-neutral-100"
        >
          <h1 className="text-2xl font-black text-neutral-900 mb-2">Forgot Password?</h1>
          <p className="text-neutral-600 text-sm font-medium mb-6">
            Enter your email and we'll send a reset link.
          </p>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-3 mb-4">
              <p className="text-sm font-semibold text-red-700">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <div>
              <label className="block text-sm font-semibold text-neutral-700 mb-1.5">Email</label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={e => { setEmail(e.target.value); setError(null) }}
                  placeholder="name@example.com"
                  autoComplete="email"
                  className="w-full h-11 pl-10 pr-4 rounded-xl border border-neutral-200 font-medium text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent hover:border-neutral-300 transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-11 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold rounded-xl shadow-lg shadow-orange-500/30 transition-all active:scale-[0.98] disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {loading
                ? <><Loader2 className="w-5 h-5 animate-spin" /><span>Sending...</span></>
                : <span>Send Reset Link</span>
              }
            </button>
          </form>
        </motion.div>
      )}
    </div>
  )
}