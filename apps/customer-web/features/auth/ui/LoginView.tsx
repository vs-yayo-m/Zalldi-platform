'use client'
import React, { useState, useEffect, useCallback } from 'react'
import Link                    from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Mail, Lock, Eye, EyeOff, LogIn, AlertCircle, UserPlus, User, Loader2, Shield } from 'lucide-react'
import { useAuth }             from '../hooks/useAuth'
import { useAuthRedirect }     from '../hooks/useAuthRedirect'
import { PasswordStrengthBar } from './components/PasswordStrengthBar'
import { GoogleButton }        from './components/GoogleButton'
import { ModeToggle }          from './components/ModeToggle'
import { AuthCard }            from './components/AuthCard'
import { AuthDivider }         from './components/AuthDivider'
import { AuthIllustration }    from './components/AuthIllustration'
import { AuthFormField }       from './components/AuthFormField'
import type { AuthMode, LoginFormData, LoginFormErrors } from '../types/auth.types'
import { validateEmail }       from '@zalldi/utils'
import { APP_NAME }            from '../../../utils/constants'
import { debounce }            from '@zalldi/utils'
import toast                   from 'react-hot-toast'

export default function LoginView() {
  const { login, register, loginWithGoogle } = useAuth()
  const { redirectAfterAuth }                = useAuthRedirect()

  const [formData,      setFormData]      = useState<LoginFormData>({
    email: '', password: '', displayName: '', rememberMe: false,
  })
  const [errors,        setErrors]        = useState<LoginFormErrors>({})
  const [showPassword,  setShowPassword]  = useState(false)
  const [loading,       setLoading]       = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [error,         setError]         = useState<string | null>(null)
  const [mode,          setMode]          = useState<AuthMode>('login')

  // Restore remembered email on mount
  useEffect(() => {
    const saved   = localStorage.getItem('zalldi_email')
    const remember = localStorage.getItem('zalldi_remember')
    if (remember === 'true' && saved) {
      setFormData(prev => ({ ...prev, email: saved, rememberMe: true }))
    }
  }, [])

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedEmailValidate = useCallback(
    debounce((email: string) => {
      const err = validateEmail(email)
      if (err) setErrors(prev => ({ ...prev, email: err }))
    }, 500),
    []
  )

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
    if (name === 'email') debouncedEmailValidate(value)
    if (errors[name as keyof LoginFormErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }))
    }
    if (error) setError(null)
  }

  const handleModeChange = (newMode: AuthMode) => {
    setMode(newMode)
    setError(null)
    setErrors({})
  }

  // ─── Google ────────────────────────────────────────────────────────────────
  const handleGoogleSignIn = async () => {
    setError(null)
    setGoogleLoading(true)
    try {
      await loginWithGoogle()
      // Redirects away — no further code runs
    } catch (err) {
      setGoogleLoading(false)
      const msg = err instanceof Error ? err.message : 'Google sign-in failed'
      setError(msg)
      toast.error(msg)
    }
  }

  // ─── Email/password ────────────────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    const newErrors: LoginFormErrors = {}
    const emailErr = validateEmail(formData.email)
    if (emailErr) newErrors.email = emailErr
    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters'
    }
    if (mode === 'register' && !formData.displayName.trim()) {
      newErrors.displayName = 'Full name is required'
    }
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setLoading(true)
    try {
      if (mode === 'login') {
        const user = await login(formData.email, formData.password)

        if (formData.rememberMe) {
          localStorage.setItem('zalldi_email',    formData.email)
          localStorage.setItem('zalldi_remember', 'true')
        } else {
          localStorage.removeItem('zalldi_email')
          localStorage.removeItem('zalldi_remember')
        }

        toast.success('Welcome back! 👋', {
          style: { borderRadius: '12px', background: '#10B981', color: '#fff' },
        })
        redirectAfterAuth()

      } else {
        await register(formData.email, formData.password, formData.displayName.trim())
        toast.success(`Welcome to ${APP_NAME}! Check your email to verify. 🎉`, {
          duration: 5000,
          style: { borderRadius: '12px', background: '#FF6B35', color: '#fff' },
        })
        handleModeChange('login')
      }

    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Authentication failed'
      setError(msg)
      if (!msg.includes('verify')) toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  const isDisabled = loading || googleLoading

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-orange-50 via-white to-orange-50">
      <div className="flex-1 flex items-center justify-center p-4 sm:p-6">
        <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-center">

          <AuthIllustration />

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md mx-auto"
          >
            {/* Heading */}
            <div className="text-center mb-6">
              <AnimatePresence mode="wait">
                <motion.div
                  key={mode}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <h1 className="text-3xl font-black text-neutral-900 mb-2">
                    {mode === 'login' ? 'Welcome Back' : 'Join Zalldi'}
                  </h1>
                  <p className="text-neutral-600 font-medium">
                    {mode === 'login'
                      ? 'Sign in to continue shopping'
                      : 'Create account to get started'}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>

            <AuthCard>
              {/* Error */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                    animate={{ opacity: 1, height: 'auto', marginBottom: 16 }}
                    exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                    className="bg-red-50 border border-red-200 rounded-xl p-3 flex items-start gap-2"
                  >
                    <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                    <p className="text-sm font-semibold text-red-700">{error}</p>
                  </motion.div>
                )}
              </AnimatePresence>

              <GoogleButton
                loading={googleLoading}
                disabled={isDisabled}
                onClick={handleGoogleSignIn}
              />

              <ModeToggle mode={mode} onChange={handleModeChange} />
              <AuthDivider />

              <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                <AuthFormField
                  label="Email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="name@example.com"
                  error={errors.email}
                  disabled={isDisabled}
                  autoComplete="email"
                  icon={<Mail className="w-4 h-4" />}
                />

                <AnimatePresence>
                  {mode === 'register' && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                    >
                      <AuthFormField
                        label="Full Name"
                        name="displayName"
                        type="text"
                        value={formData.displayName}
                        onChange={handleChange}
                        placeholder="Enter your name"
                        error={errors.displayName}
                        disabled={isDisabled}
                        autoComplete="name"
                        icon={<User className="w-4 h-4" />}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>

                <AuthFormField
                  label="Password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleChange}
                  placeholder={mode === 'register' ? 'Min 6 characters' : '••••••••'}
                  error={errors.password}
                  disabled={isDisabled}
                  autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                  icon={<Lock className="w-4 h-4" />}
                  rightElement={
                    <button
                      type="button"
                      onClick={() => setShowPassword(p => !p)}
                      className="text-neutral-400 hover:text-orange-500 transition-colors"
                    >
                      {showPassword
                        ? <EyeOff className="w-4 h-4" />
                        : <Eye className="w-4 h-4" />
                      }
                    </button>
                  }
                />

                <AnimatePresence>
                  {mode === 'register' && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                    >
                      <PasswordStrengthBar password={formData.password} />
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Remember + Forgot */}
                <div className="flex items-center justify-between pt-1">
                  <label className="flex items-center gap-2 cursor-pointer group">
                    <input
                      type="checkbox"
                      name="rememberMe"
                      checked={formData.rememberMe}
                      onChange={handleChange}
                      className="w-4 h-4 rounded border-neutral-300 text-orange-500 focus:ring-orange-500 cursor-pointer"
                    />
                    <span className="text-sm font-semibold text-neutral-600 group-hover:text-neutral-900">
                      Remember me
                    </span>
                  </label>
                  {mode === 'login' && (
                    <Link
                      href="/forgot-password"
                      className="text-sm font-semibold text-orange-500 hover:text-orange-600"
                    >
                      Forgot?
                    </Link>
                  )}
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={isDisabled}
                  className="w-full h-11 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold rounded-xl shadow-lg shadow-orange-500/30 transition-all active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={`${mode}-${loading}`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center gap-2"
                    >
                      {loading ? (
                        <><Loader2 className="w-5 h-5 animate-spin" /><span>{mode === 'login' ? 'Signing in...' : 'Creating...'}</span></>
                      ) : mode === 'login' ? (
                        <><LogIn className="w-5 h-5" /><span>Sign In</span></>
                      ) : (
                        <><UserPlus className="w-5 h-5" /><span>Create Account</span></>
                      )}
                    </motion.span>
                  </AnimatePresence>
                </button>
              </form>

              {/* Terms */}
              <AnimatePresence>
                {mode === 'register' && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-xs text-center text-neutral-500 mt-4"
                  >
                    By signing up, you agree to our{' '}
                    <Link href="/terms-conditions" className="text-orange-500 hover:underline font-semibold">Terms</Link>
                    {' & '}
                    <Link href="/privacy-policy" className="text-orange-500 hover:underline font-semibold">Privacy</Link>
                  </motion.p>
                )}
              </AnimatePresence>
            </AuthCard>

            <div className="mt-5 flex items-center justify-center gap-2 text-xs text-neutral-500">
              <Shield className="w-4 h-4 text-orange-500" />
              <span className="font-semibold">Secured by Zalldi</span>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}