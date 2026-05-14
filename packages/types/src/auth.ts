// Customer-web only. No supplier/admin roles here.

export type UserRole = 'customer'

export interface UserProfile {
  id: string
  email: string
  display_name: string
  photo_url: string | null
  phone_number: string | null // collected now, OTP login added later
  role: UserRole
  auth_provider: 'email' | 'google'
  email_verified: boolean
  pending_email: string | null // email change awaiting confirmation
  notifications: {
    email: boolean
    push: boolean
    sms: boolean
  }
  created_at: string
  updated_at: string
}

export interface AuthState {
  user: UserProfile | null
  loading: boolean
  error: string | null
  isAuthenticated: boolean
}

export interface AuthActions {
  login: (email: string, password: string) => Promise < UserProfile >
    register: (email: string, password: string, displayName: string) => Promise < void >
    loginWithGoogle: () => Promise < void >
    logout: () => Promise < void >
    resetPassword: (email: string) => Promise < void >
    updateUserProfile: (updates: Partial < UserProfile > ) => Promise < void >
    initiateEmailChange: (newEmail: string) => Promise < void >
    resendVerificationEmail: () => Promise < void >
    refreshUser: () => Promise < void >
}

export type AuthContextValue = AuthState & AuthActions