export function AuthDivider({ label = 'Or with email' }: { label ? : string }) {
  return (
    <div className="relative my-5">
      <div className="absolute inset-0 flex items-center">
        <div className="w-full border-t border-neutral-200" />
      </div>
      <div className="relative flex justify-center">
        <span className="bg-white px-3 text-xs font-bold text-neutral-400 uppercase tracking-wide">
          {label}
        </span>
      </div>
    </div>
  )
}