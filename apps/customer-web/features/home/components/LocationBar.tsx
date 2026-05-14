'use client'
import { MapPin, ChevronDown, Zap } from 'lucide-react'
import { useLocationStore } from '@/store/locationStore'

export function LocationBar() {
  const { addressLabel, deliveryMins, isOpen, darkstoredName } = useLocationStore()
  
  return (
    <div className="bg-neutral-900 px-4 py-3 flex items-center justify-between">
      {/* Left — address */}
      <button className="flex items-center gap-2 min-w-0">
        <MapPin className="w-4 h-4 text-orange-500 flex-shrink-0" />
        <div className="min-w-0 text-left">
          <div className="flex items-center gap-1">
            <span className="text-white text-sm font-bold truncate max-w-[180px]">
              {addressLabel || 'Set location'}
            </span>
            <ChevronDown className="w-3 h-3 text-white/50 flex-shrink-0" />
          </div>
          {darkstoredName && (
            <span className="text-white/40 text-xs">{darkstoredName}</span>
          )}
        </div>
      </button>

      {/* Right — delivery ETA */}
      <div className="flex items-center gap-1.5 bg-white/10 rounded-full px-3 py-1 flex-shrink-0">
        <Zap className="w-3 h-3 text-orange-400" />
        <span className="text-white text-xs font-bold">
          {isOpen ? `${deliveryMins} min` : 'Closed'}
        </span>
      </div>
    </div>
  )
}