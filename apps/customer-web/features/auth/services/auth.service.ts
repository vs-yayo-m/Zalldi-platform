'use client'
import { createBrowserSupabaseClient } from '@/services/supabase/client.browser'
import { mapAuthError } from '../utils/authErrors'
import type { UserProfile } from '@zalldi/types'

// ─── Internal ─────────────────────────────────────────────────────────────────
async function fetchProfile(userId: string): Promise<UserProfile | null> {
  const supabase = createBrowserSupabaseClient()
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()

  if (error) {
    console.error('fetchProfile error:', error.message, error.code)
    return null
  }
  return data as UserProfile
}

async function createProfileIfMissing(
  userId: string,
  email: string,
  displayName: string,
  provider: 'email' | 'google' = 'email'
): Promise<UserProfile | null> {
  const supabase = createBrowserSupabaseClient()

  const { error } = await supabase.from('profiles').insert({
    id:           userId,
    email:        email,
    display_name: displayName,
    auth_provider: provider,
    role:         'customer',
  })

  if (error) {
    console.error('createProfile error:', error.message)
    // Profile may already exist — try fetching anyway
  }

  return fetchProfile(userId)
}

// ─── Public service ───────────────────────────────────────────────────────────
const authService = {

  async signIn(email: string, password: string): Promise<UserProfile> {
    const supabase = createBrowserSupabaseClient()
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) throw new Error(mapAuthError(error.message))
    if (!data.user) throw new Error('Sign in failed')

    // Try fetching profile
    let profile = await fetchProfile(data.user.id)

    // Profile missing — create it on the fly (handles trigger failures)
    if (!profile) {
      const displayName = data.user.user_metadata?.full_name ?? email.split('@')[0]
      profile = await createProfileIfMissing(data.user.id, email, displayName, 'email')
    }

    if (!profile) throw new Error('Could not load profile. Please try again.')
    return profile
  },

  async signUp(
    email: string,
    password: string,
    displayName: string
  ): Promise<void> {
    const supabase = createBrowserSupabaseClient()
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: displayName },
        emailRedirectTo: `${window.location.origin}/auth/callback?next=/home`,
      },
    })

    if (error) throw new Error(mapAuthError(error.message))
    if (!data.user) throw new Error('Registration failed')

    // Explicitly upsert profile — don't rely solely on trigger
    await supabase.from('profiles').upsert({
      id:           data.user.id,
      email:        email,
      display_name: displayName,
      auth_provider: 'email',
      role:         'customer',
    }, { onConflict: 'id' })
  },

  async signInWithGoogle(): Promise<void> {
    const supabase = createBrowserSupabaseClient()
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=/home`,
        queryParams: { prompt: 'select_account' },
      },
    })
    if (error) throw new Error(mapAuthError(error.message))
  },

  async signOut(): Promise<void> {
    const supabase = createBrowserSupabaseClient()
    const { error } = await supabase.auth.signOut()
    if (error) throw new Error(mapAuthError(error.message))
  },

  async resetPassword(email: string): Promise<void> {
    const supabase = createBrowserSupabaseClient()
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    })
    if (error) throw new Error(mapAuthError(error.message))
  },

  async updateProfile(updates: Partial<UserProfile>): Promise<void> {
    const supabase = createBrowserSupabaseClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Not authenticated')

    const { error } = await supabase
      .from('profiles')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', user.id)
    if (error) throw new Error(error.message)
  },

  async initiateEmailChange(newEmail: string): Promise<void> {
    const supabase = createBrowserSupabaseClient()
    const { error } = await supabase.auth.updateUser(
      { email: newEmail },
      { emailRedirectTo: `${window.location.origin}/auth/callback` }
    )
    if (error) throw new Error(mapAuthError(error.message))

    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      await supabase
        .from('profiles')
        .update({ pending_email: newEmail })
        .eq('id', user.id)
    }
  },

  async resendVerificationEmail(): Promise<void> {
    const supabase = createBrowserSupabaseClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user?.email) throw new Error('No active session')

    const { error } = await supabase.auth.resend({
      type: 'signup',
      email: user.email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback?next=/home`,
      },
    })
    if (error) throw new Error(mapAuthError(error.message))
  },

  async getProfile(): Promise<UserProfile | null> {
    const supabase = createBrowserSupabaseClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return null

    let profile = await fetchProfile(user.id)

    // Auto-heal missing profile
    if (!profile && user.email) {
      const displayName = user.user_metadata?.full_name ?? user.email.split('@')[0]
      profile = await createProfileIfMissing(user.id, user.email, displayName)
    }

    return profile
  },
}

export default authService