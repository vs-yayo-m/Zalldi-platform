import { motion } from 'framer-motion'
import { usePasswordStrength } from '../../hooks/usePasswordStrength'

export function PasswordStrengthBar({ password }: { password: string }) {
  const strength = usePasswordStrength(password)
  if (!password) return null
  
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-neutral-600">Strength</span>
        <span className={`text-xs font-bold ${strength.text}`}>
          {strength.label}
        </span>
      </div>
      <div className="h-1.5 bg-neutral-100 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${strength.score}%` }}
          className={`h-full rounded-full ${strength.color}`}
        />
      </div>
    </div>
  )
}