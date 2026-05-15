// apps/customer-web/features/auth/ui/LoginView.tsx
'use client'
import React, { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Mail, Lock, Eye, EyeOff, LogIn, AlertCircle,
  UserPlus, User, Loader2, Shield, Sparkles, ArrowRight
} from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import { useAuthRedirect } from '../hooks/useAuthRedirect'
import { validateEmail } from '@/utils/validators'
import { debounce } from '@/utils/helpers'
import { APP_NAME } from '@/utils/constants'
import toast from 'react-hot-toast'
import type { AuthMode, LoginFormData, LoginFormErrors } from '../types/auth.types'

// ─── Password strength ────────────────────────────────────────────────────────
function calcStrength(password: string) {
  if (!password) return { score: 0, label: '', color: '' }
  let score = 0
  if (password.length >= 6)  score += 25
  if (password.length >= 8)  score += 25
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score += 25
  if (/\d/.test(password))   score += 15
  if (/[^a-zA-Z0-9]/.test(password)) score += 10
  score = Math.min(score, 100)
  if (score < 40) return { score, label: 'Weak',   color: '#ef4444' }
  if (score < 70) return { score, label: 'Medium', color: '#f59e0b' }
  return               { score, label: 'Strong', color: '#10b981' }
}

export default function LoginView() {
  const { login, register, loginWithGoogle } = useAuth()
  const { redirectAfterAuth } = useAuthRedirect()

  const [formData, setFormData] = useState<LoginFormData>({
    email: '', password: '', displayName: '', rememberMe: false,
  })
  const [errors,        setErrors]        = useState<LoginFormErrors>({})
  const [showPassword,  setShowPassword]  = useState(false)
  const [loading,       setLoading]       = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [error,         setError]         = useState<string | null>(null)
  const [mode,          setMode]          = useState<AuthMode>('login')
  const [focused,       setFocused]       = useState<string | null>(null)

  const strength = calcStrength(formData.password)

  useEffect(() => {
    const saved    = localStorage.getItem('zalldi_email')
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
    }, 500), []
  )

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
    if (name === 'email') debouncedEmailValidate(value)
    if (errors[name as keyof LoginFormErrors]) setErrors(prev => ({ ...prev, [name]: undefined }))
    if (error) setError(null)
  }

  const handleModeChange = (newMode: AuthMode) => {
    setMode(newMode)
    setError(null)
    setErrors({})
  }

  const handleGoogleSignIn = async () => {
    setError(null)
    setGoogleLoading(true)
    try {
      await loginWithGoogle()
    } catch (err) {
      setGoogleLoading(false)
      const msg = err instanceof Error ? err.message : 'Google sign-in failed'
      setError(msg)
      toast.error(msg)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    const newErrors: LoginFormErrors = {}
    const emailErr = validateEmail(formData.email)
    if (emailErr) newErrors.email = emailErr
    if (!formData.password) newErrors.password = 'Password is required'
    else if (formData.password.length < 6) newErrors.password = 'Min 6 characters'
    if (mode === 'register' && !formData.displayName.trim()) newErrors.displayName = 'Name is required'
    if (Object.keys(newErrors).length > 0) { setErrors(newErrors); return }

    setLoading(true)
    try {
      if (mode === 'login') {
        await login(formData.email, formData.password)
        if (formData.rememberMe) {
          localStorage.setItem('zalldi_email', formData.email)
          localStorage.setItem('zalldi_remember', 'true')
        } else {
          localStorage.removeItem('zalldi_email')
          localStorage.removeItem('zalldi_remember')
        }
        toast.success('Welcome back! 👋', { style: { borderRadius: '12px', background: '#10B981', color: '#fff' } })
        redirectAfterAuth()
      } else {
        await register(formData.email, formData.password, formData.displayName.trim())
        toast.success(`Welcome to ${APP_NAME}! Check your email. 🎉`, {
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
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0c1117 0%, #1a1206 40%, #2d1500 70%, #f97316 100%)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px 16px',
      position: 'relative',
      overflow: 'hidden',
    }}>

      {/* Background decorative circles */}
      <div style={{
        position: 'absolute', top: -100, right: -100,
        width: 300, height: 300, borderRadius: '50%',
        background: 'rgba(249,115,22,0.08)',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', bottom: -80, left: -80,
        width: 250, height: 250, borderRadius: '50%',
        background: 'rgba(249,115,22,0.05)',
        pointerEvents: 'none',
      }} />

      {/* Logo */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ marginBottom: 24, textAlign: 'center' }}
      >
        <Link href="/" style={{ textDecoration: 'none' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
            <div style={{
              width: 44, height: 44, borderRadius: 14,
              background: 'linear-gradient(135deg, #f97316, #ea580c)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 4px 20px rgba(249,115,22,0.4)',
            }}>
              <span style={{ color: '#fff', fontWeight: 900, fontSize: 20, fontStyle: 'italic' }}>Z</span>
            </div>
            <span style={{ color: '#fff', fontWeight: 900, fontSize: 24, letterSpacing: -0.5 }}>alldi</span>
          </div>
        </Link>
      </motion.div>

      {/* Main card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        style={{
          width: '100%',
          maxWidth: 420,
          background: 'rgba(255,255,255,0.97)',
          borderRadius: 28,
          overflow: 'hidden',
          boxShadow: '0 32px 80px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.1)',
        }}
      >
        {/* Card header strip */}
        <div style={{
          background: 'linear-gradient(135deg, #0c1117, #2d1500)',
          padding: '20px 24px 24px',
          position: 'relative',
          overflow: 'hidden',
        }}>
          <div style={{
            position: 'absolute', top: -30, right: -30,
            width: 120, height: 120, borderRadius: '50%',
            background: 'rgba(249,115,22,0.15)',
          }} />

          <AnimatePresence mode="wait">
            <motion.div
              key={mode}
              initial={{ opacity: 0, x: mode === 'login' ? -10 : 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                <Sparkles size={16} color="#f97316" />
                <span style={{ color: '#f97316', fontSize: 11, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase' }}>
                  {mode === 'login' ? 'Welcome back' : 'Get started free'}
                </span>
              </div>
              <h1 style={{ color: '#fff', fontSize: 26, fontWeight: 900, margin: 0, letterSpacing: -0.5 }}>
                {mode === 'login' ? 'Sign in to Zalldi' : 'Create your account'}
              </h1>
              <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13, margin: '4px 0 0', fontWeight: 400 }}>
                {mode === 'login' ? 'Groceries delivered in 20 minutes' : 'Join thousands ordering on Zalldi'}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Card body */}
        <div style={{ padding: '20px 24px 24px' }}>

          {/* Error banner */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                style={{
                  background: '#fef2f2', border: '1px solid #fecaca',
                  borderRadius: 12, padding: '10px 12px',
                  display: 'flex', alignItems: 'flex-start', gap: 8,
                  marginBottom: 16,
                }}
              >
                <AlertCircle size={16} color="#ef4444" style={{ flexShrink: 0, marginTop: 1 }} />
                <p style={{ color: '#dc2626', fontSize: 13, fontWeight: 600, margin: 0 }}>{error}</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Google button */}
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={handleGoogleSignIn}
            disabled={isDisabled}
            style={{
              width: '100%', height: 48,
              background: '#fff', border: '1.5px solid #e5e7eb',
              borderRadius: 14,
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
              cursor: isDisabled ? 'not-allowed' : 'pointer',
              opacity: isDisabled ? 0.6 : 1,
              marginBottom: 16,
              boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
              transition: 'all 0.2s',
              fontWeight: 700, fontSize: 14, color: '#374151',
            }}
          >
            {googleLoading ? (
              <Loader2 size={18} color="#f97316" style={{ animation: 'spin 0.8s linear infinite' }} />
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
            )}
            <span>Continue with Google</span>
          </motion.button>

          {/* Mode toggle */}
          <div style={{
            display: 'flex', background: '#f3f4f6',
            borderRadius: 12, padding: 4, marginBottom: 16,
          }}>
            {(['login', 'register'] as AuthMode[]).map(m => (
              <button
                key={m}
                onClick={() => handleModeChange(m)}
                style={{
                  flex: 1, height: 36, borderRadius: 9, border: 'none',
                  background: mode === m ? '#fff' : 'transparent',
                  color: mode === m ? '#111' : '#6b7280',
                  fontWeight: 700, fontSize: 13, cursor: 'pointer',
                  boxShadow: mode === m ? '0 1px 4px rgba(0,0,0,0.1)' : 'none',
                  transition: 'all 0.2s',
                }}
              >
                {m === 'login' ? 'Sign In' : 'Sign Up'}
              </button>
            ))}
          </div>

          {/* Divider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
            <div style={{ flex: 1, height: 1, background: '#e5e7eb' }} />
            <span style={{ color: '#9ca3af', fontSize: 11, fontWeight: 600, whiteSpace: 'nowrap' }}>
              or with email
            </span>
            <div style={{ flex: 1, height: 1, background: '#e5e7eb' }} />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>

            {/* Email */}
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#374151', marginBottom: 6 }}>
                Email address
              </label>
              <div style={{ position: 'relative' }}>
                <div style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
                  <Mail size={15} color={focused === 'email' ? '#f97316' : '#9ca3af'} />
                </div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  onFocus={() => setFocused('email')}
                  onBlur={() => setFocused(null)}
                  placeholder="name@example.com"
                  autoComplete="email"
                  disabled={isDisabled}
                  style={{
                    width: '100%', height: 46, paddingLeft: 38, paddingRight: 12,
                    borderRadius: 12, border: `1.5px solid ${errors.email ? '#fca5a5' : focused === 'email' ? '#f97316' : '#e5e7eb'}`,
                    background: errors.email ? '#fef2f2' : '#fafafa',
                    fontSize: 14, fontWeight: 500, color: '#111',
                    outline: 'none', transition: 'all 0.2s',
                    boxSizing: 'border-box',
                  }}
                />
              </div>
              {errors.email && <p style={{ color: '#ef4444', fontSize: 11, fontWeight: 600, marginTop: 4 }}>{errors.email}</p>}
            </div>

            {/* Full name — register only */}
            <AnimatePresence>
              {mode === 'register' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#374151', marginBottom: 6 }}>
                    Full name
                  </label>
                  <div style={{ position: 'relative' }}>
                    <div style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
                      <User size={15} color={focused === 'displayName' ? '#f97316' : '#9ca3af'} />
                    </div>
                    <input
                      type="text"
                      name="displayName"
                      value={formData.displayName}
                      onChange={handleChange}
                      onFocus={() => setFocused('displayName')}
                      onBlur={() => setFocused(null)}
                      placeholder="Enter your name"
                      autoComplete="name"
                      disabled={isDisabled}
                      style={{
                        width: '100%', height: 46, paddingLeft: 38, paddingRight: 12,
                        borderRadius: 12, border: `1.5px solid ${errors.displayName ? '#fca5a5' : focused === 'displayName' ? '#f97316' : '#e5e7eb'}`,
                        background: errors.displayName ? '#fef2f2' : '#fafafa',
                        fontSize: 14, fontWeight: 500, color: '#111',
                        outline: 'none', transition: 'all 0.2s',
                        boxSizing: 'border-box',
                      }}
                    />
                  </div>
                  {errors.displayName && <p style={{ color: '#ef4444', fontSize: 11, fontWeight: 600, marginTop: 4 }}>{errors.displayName}</p>}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Password */}
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#374151', marginBottom: 6 }}>
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <div style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
                  <Lock size={15} color={focused === 'password' ? '#f97316' : '#9ca3af'} />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  onFocus={() => setFocused('password')}
                  onBlur={() => setFocused(null)}
                  placeholder={mode === 'register' ? 'Min 6 characters' : '••••••••'}
                  autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                  disabled={isDisabled}
                  style={{
                    width: '100%', height: 46, paddingLeft: 38, paddingRight: 44,
                    borderRadius: 12, border: `1.5px solid ${errors.password ? '#fca5a5' : focused === 'password' ? '#f97316' : '#e5e7eb'}`,
                    background: errors.password ? '#fef2f2' : '#fafafa',
                    fontSize: 14, fontWeight: 500, color: '#111',
                    outline: 'none', transition: 'all 0.2s',
                    boxSizing: 'border-box',
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(p => !p)}
                  style={{
                    position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                    background: 'none', border: 'none', cursor: 'pointer', padding: 2,
                    color: '#9ca3af',
                  }}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && <p style={{ color: '#ef4444', fontSize: 11, fontWeight: 600, marginTop: 4 }}>{errors.password}</p>}
            </div>

            {/* Password strength bar — register only */}
            <AnimatePresence>
              {mode === 'register' && formData.password && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <span style={{ fontSize: 11, fontWeight: 600, color: '#6b7280' }}>Strength</span>
                    <span style={{ fontSize: 11, fontWeight: 700, color: strength.color }}>{strength.label}</span>
                  </div>
                  <div style={{ height: 4, background: '#e5e7eb', borderRadius: 99, overflow: 'hidden' }}>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${strength.score}%` }}
                      style={{ height: '100%', background: strength.color, borderRadius: 99 }}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Remember + Forgot */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                  style={{ width: 15, height: 15, accentColor: '#f97316', cursor: 'pointer' }}
                />
                <span style={{ fontSize: 13, fontWeight: 600, color: '#6b7280' }}>Remember me</span>
              </label>
              {mode === 'login' && (
                <Link href="/forgot-password" style={{ fontSize: 13, fontWeight: 700, color: '#f97316', textDecoration: 'none' }}>
                  Forgot?
                </Link>
              )}
            </div>

            {/* ── SUBMIT BUTTON ── */}
            <motion.button
              type="submit"
              whileTap={{ scale: 0.98 }}
              disabled={isDisabled}
              style={{
                width: '100%',
                height: 52,
                background: isDisabled
                  ? '#fdba74'
                  : 'linear-gradient(135deg, #f97316, #ea580c)',
                color: '#fff',
                border: 'none',
                borderRadius: 14,
                fontSize: 15,
                fontWeight: 800,
                cursor: isDisabled ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                boxShadow: isDisabled ? 'none' : '0 4px 20px rgba(249,115,22,0.4)',
                transition: 'all 0.2s',
                marginTop: 4,
              }}
            >
              {loading ? (
                <>
                  <Loader2 size={18} style={{ animation: 'spin 0.8s linear infinite' }} />
                  <span>{mode === 'login' ? 'Signing in...' : 'Creating account...'}</span>
                </>
              ) : mode === 'login' ? (
                <>
                  <LogIn size={18} />
                  <span>Sign In</span>
                  <ArrowRight size={16} />
                </>
              ) : (
                <>
                  <UserPlus size={18} />
                  <span>Create Account</span>
                  <ArrowRight size={16} />
                </>
              )}
            </motion.button>

          </form>

          {/* Terms */}
          <AnimatePresence>
            {mode === 'register' && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                style={{ textAlign: 'center', fontSize: 11, color: '#9ca3af', marginTop: 12 }}
              >
                By signing up you agree to our{' '}
                <Link href="/terms-conditions" style={{ color: '#f97316', fontWeight: 700, textDecoration: 'none' }}>Terms</Link>
                {' & '}
                <Link href="/privacy-policy" style={{ color: '#f97316', fontWeight: 700, textDecoration: 'none' }}>Privacy</Link>
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Security badge */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        style={{
          marginTop: 20,
          display: 'flex', alignItems: 'center', gap: 6,
          color: 'rgba(255,255,255,0.4)',
        }}
      >
        <Shield size={14} />
        <span style={{ fontSize: 12, fontWeight: 600 }}>Secured by Zalldi</span>
      </motion.div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}