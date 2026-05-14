import type { AuthMode } from '../../types/auth.types'

interface ModeToggleProps {
  mode: AuthMode
  onChange: (mode: AuthMode) => void
}

export function ModeToggle({ mode, onChange }: ModeToggleProps) {
  return (
    <div className="inline-flex items-center w-full gap-2 bg-neutral-50 rounded-full p-1 mb-5">
      {(['login', 'register'] as AuthMode[]).map((m) => (
        <button
          key={m}
          type="button"
          onClick={() => onChange(m)}
          className={`flex-1 px-4 py-2 text-sm font-bold rounded-full transition-all ${
            mode === m
              ? 'bg-orange-500 text-white shadow-md'
              : 'text-neutral-600 hover:text-orange-500'
          }`}
        >
          {m === 'login' ? 'Sign In' : 'Sign Up'}
        </button>
      ))}
    </div>
  )
}