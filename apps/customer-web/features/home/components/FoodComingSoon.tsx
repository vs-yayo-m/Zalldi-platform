import { Clock } from 'lucide-react'

export function FoodComingSoon({ label = 'Food Delivery' }: { label ? : string }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 px-6 text-center">
      <div className="w-20 h-20 bg-orange-50 rounded-full flex items-center justify-center mb-6">
        <Clock className="w-10 h-10 text-orange-400" />
      </div>
      <h2 className="text-xl font-black text-neutral-800 mb-2">
        {label} Coming Soon
      </h2>
      <p className="text-neutral-500 text-sm max-w-xs">
        We're working on bringing {label.toLowerCase()} to Zalldi.
        Stay tuned — it's going to be 🔥
      </p>
    </div>
  )
}