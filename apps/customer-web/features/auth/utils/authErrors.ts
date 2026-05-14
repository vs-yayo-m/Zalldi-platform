// Single place to map ALL Supabase auth error strings → user-facing messages
// Add new entries here as you discover new Supabase errors in production

const ERROR_MAP: Record<string, string> = {
  'Invalid login credentials':
    'Incorrect email or password',
  'Email not confirmed':
    'Please verify your email before signing in',
  'User already registered':
    'This email is already registered. Sign in instead?',
  'Password should be at least 6 characters':
    'Password must be at least 6 characters',
  'Unable to validate email address':
    'Invalid email address',
  'Email rate limit exceeded':
    'Too many attempts. Please wait a few minutes',
  'over_email_send_rate_limit':
    'Too many emails sent. Please wait before retrying',
  'User not found':
    'No account found with this email',
  'Token has expired or is invalid':
    'This link has expired. Please request a new one',
  'New password should be different':
    'New password must be different from your current password',
}

export function mapAuthError(message: string): string {
  for (const [key, value] of Object.entries(ERROR_MAP)) {
    if (message.toLowerCase().includes(key.toLowerCase())) {
      return value
    }
  }
  return message || 'Something went wrong. Please try again'
}