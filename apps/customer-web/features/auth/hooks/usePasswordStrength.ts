import { useMemo } from 'react'

export interface PasswordStrength {
  score: number // 0–100
  label: 'Weak' | 'Medium' | 'Strong'
  color: string
  text: string
}

export function usePasswordStrength(password: string): PasswordStrength {
  return useMemo(() => {
    if (!password) {
      return { score: 0, label: 'Weak', color: 'bg-neutral-200', text: 'text-neutral-400' }
    }
    
    let score = 0
    if (password.length >= 6) score += 25
    if (password.length >= 8) score += 25
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score += 25
    if (/\d/.test(password)) score += 15
    if (/[^a-zA-Z0-9]/.test(password)) score += 10
    score = Math.min(score, 100)
    
    if (score < 40) return { score, label: 'Weak', color: 'bg-red-500', text: 'text-red-500' }
    if (score < 70) return { score, label: 'Medium', color: 'bg-yellow-500', text: 'text-yellow-500' }
    return { score, label: 'Strong', color: 'bg-green-500', text: 'text-green-500' }
  }, [password])
}