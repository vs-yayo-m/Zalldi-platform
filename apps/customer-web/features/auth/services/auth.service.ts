'use client'
import { createBrowserSupabaseClient } from '@zalldi/supabase'
import { mapAuthError } from '@zalldi/utils'
import type { UserProfile }            from '@zalldi/types'

// ─── Internal ─────────────────────────────────────────────────────────────────
async function fetchProfile(userId: string): Promise<UserProfile | null> {
  const supabase = createBrowserSupabaseClient()
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()

  if (error || !data) return null
  return data as UserProfile
}

// ─── Public service ───────────────────────────────────────────────────────────
const authService = {

  async signIn(email: string, password: string): Promise<UserProfile> {
    const supabase = createBrowserSupabaseClient()
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    if (error)      throw new Error(mapAuthError(error.message))
    if (!data.user) throw new Error('Sign in failed')

    const profile = await fetchProfile(data.user.id)
    if (!profile) throw new Error('Profile not found. Please contact support.')
    return profile
  },

  async signUp(
    email:       string,
    password:    string,
    displayName: string
  ): Promise<void> {
    const supabase = createBrowserSupabaseClient()
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data:             { full_name: displayName },
        emailRedirectTo:  `${window.location.origin}/auth/callback?next=/home`,
      },
    })
    if (error)      throw new Error(mapAuthError(error.message))
    if (!data.user) throw new Error('Registration failed')

    // Update display_name explicitly — trigger may have empty string as fallback
    await supabase
      .from('profiles')
      .update({ display_name: displayName })
      .eq('id', data.user.id)
  },

  async signInWithGoogle(): Promise<void> {
    const supabase = createBrowserSupabaseClient()
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo:  `${window.location.origin}/auth/callback?next=/home`,
        queryParams: { prompt: 'select_account' },
      },
    })
    if (error) throw new Error(mapAuthError(error.message))
    // Browser redirects — no return value
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

  // B) No password re-entry — just send confirmation to new email
  async initiateEmailChange(newEmail: string): Promise<void> {
    const supabase = createBrowserSupabaseClient()
    const { error } = await supabase.auth.updateUser(
      { email: newEmail },
      { emailRedirectTo: `${window.location.origin}/auth/callback` }
    )
    if (error) throw new Error(mapAuthError(error.message))

    // Store pending_email so profile UI can show "awaiting confirmation"
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
      type:    'signup',
      email:   user.email,
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
    return fetchProfile(user.id)
  },
}

export default authService