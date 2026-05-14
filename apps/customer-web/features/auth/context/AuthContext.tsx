'use client'
import React, {
  createContext, useState, useEffect, useCallback,
} from 'react'
import { createBrowserSupabaseClient } from '@zalldi/supabase'
import authService                     from '../services/auth.service'
import type { AuthContextValue, UserProfile } from '@zalldi/types'

export const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user,    setUser]    = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState<string | null>(null)

  // ─── Session bootstrap + listener ─────────────────────────────────────────
  useEffect(() => {
    const supabase = createBrowserSupabaseClient()

    // 1. Restore existing session on mount
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session?.user) {
        const profile = await authService.getProfile()
        setUser(profile)
      }
      setLoading(false)
    })

    // 2. React to all future auth events
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          const profile = await authService.getProfile()
          setUser(profile)
        }
        if (event === 'SIGNED_OUT') {
          setUser(null)
        }
        if (event === 'USER_UPDATED' && session?.user) {
          const profile = await authService.getProfile()
          setUser(profile)
        }
        // TOKEN_REFRESHED — no UI update needed
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  // ─── Actions ───────────────────────────────────────────────────────────────
  const refreshUser = useCallback(async () => {
    const profile = await authService.getProfile()
    setUser(profile)
  }, [])

  const login = useCallback(async (email: string, password: string) => {
    setError(null)
    try {
      const profile = await authService.signIn(email, password)
      setUser(profile)
      return profile
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Login failed'
      setError(msg)
      throw new Error(msg)
    }
  }, [])

  const register = useCallback(async (
    email: string, password: string, displayName: string
  ) => {
    setError(null)
    try {
      await authService.signUp(email, password, displayName)
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Registration failed'
      setError(msg)
      throw new Error(msg)
    }
  }, [])

  const loginWithGoogle = useCallback(async () => {
    setError(null)
    try {
      await authService.signInWithGoogle()
      // Page redirects — nothing to return
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Google sign-in failed'
      setError(msg)
      throw new Error(msg)
    }
  }, [])

  const logout = useCallback(async () => {
    setError(null)
    try {
      await authService.signOut()
      setUser(null)
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Logout failed'
      setError(msg)
      throw new Error(msg)
    }
  }, [])

  const resetPassword = useCallback(async (email: string) => {
    setError(null)
    try {
      await authService.resetPassword(email)
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Reset failed'
      setError(msg)
      throw new Error(msg)
    }
  }, [])

  const updateUserProfile = useCallback(async (updates: Partial<UserProfile>) => {
    setError(null)
    try {
      await authService.updateProfile(updates)
      setUser(prev => prev ? { ...prev, ...updates } : prev)
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Update failed'
      setError(msg)
      throw new Error(msg)
    }
  }, [])

  const initiateEmailChange = useCallback(async (newEmail: string) => {
    setError(null)
    try {
      await authService.initiateEmailChange(newEmail)
      setUser(prev => prev ? { ...prev, pending_email: newEmail } : prev)
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Email change failed'
      setError(msg)
      throw new Error(msg)
    }
  }, [])

  const resendVerificationEmail = useCallback(async () => {
    setError(null)
    try {
      await authService.resendVerificationEmail()
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Could not resend email'
      setError(msg)
      throw new Error(msg)
    }
  }, [])

  // ─── Value ─────────────────────────────────────────────────────────────────
  const value: AuthContextValue = {
    user,
    loading,
    error,
    isAuthenticated:         !!user,
    login,
    register,
    loginWithGoogle,
    logout,
    resetPassword,
    updateUserProfile,
    initiateEmailChange,
    resendVerificationEmail,
    refreshUser,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}