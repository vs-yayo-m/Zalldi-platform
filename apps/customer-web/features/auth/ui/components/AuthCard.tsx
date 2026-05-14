// Reusable white card wrapper used on all auth pages

interface AuthCardProps {
  children: React.ReactNode
  className ? : string
}

export function AuthCard({ children, className = '' }: AuthCardProps) {
  return (
    <div className={`bg-white rounded-3xl shadow-xl p-6 sm:p-8 border border-neutral-100 ${className}`}>
      {children}
    </div>
  )
}