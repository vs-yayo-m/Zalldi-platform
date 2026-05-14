// Local auth feature types — extends global @zalldi/types
// Add anything auth-UI-specific here that doesn't belong in the shared package

export type AuthMode = 'login' | 'register'

export interface LoginFormData {
  email: string
  password: string
  displayName: string // only used in register mode
  rememberMe: boolean
}

export interface LoginFormErrors {
  email ? : string
  password ? : string
  displayName ? : string
}

export interface ForgotPasswordFormData {
  email: string
}