'use client'
import { motion } from 'framer-motion'
import { MapPin, Navigation, AlertCircle } from 'lucide-react'
import { useNearestDarkstore } from '../hooks/useNearestDarkstore'

export function LocationGate({ children }: { children: React.ReactNode }) {
  const { status, requestLocation, hasLocation } = useNearestDarkstore()
  
  // Already has location — show content
  if (hasLocation) return <>{children}</>
  
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm text-center"
      >
        {/* Icon */}
        <div className="w-20 h-20 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <MapPin className="w-10 h-10 text-orange-500" />
        </div>

        {status === 'no_coverage' ? (
          <>
            <h2 className="text-xl font-black text-neutral-900 mb-2">
              Not available in your area yet
            </h2>
            <p className="text-neutral-500 text-sm mb-6">
              Zalldi is expanding fast. We'll notify you when we reach you.
            </p>
            <div className="flex items-center justify-center gap-2 text-amber-600 bg-amber-50 rounded-xl p-3">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span className="text-sm font-medium">No darkstore in your area</span>
            </div>
          </>
        ) : status === 'denied' ? (
          <>
            <h2 className="text-xl font-black text-neutral-900 mb-2">
              Location access denied
            </h2>
            <p className="text-neutral-500 text-sm mb-6">
              Please enable location in your browser settings and refresh.
            </p>
            <button
              onClick={requestLocation}
              className="w-full h-12 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl transition-colors"
            >
              Try Again
            </button>
          </>
        ) : (
          <>
            <h2 className="text-xl font-black text-neutral-900 mb-2">
              Where should we deliver?
            </h2>
            <p className="text-neutral-500 text-sm mb-8">
              We need your location to show available products and delivery time.
            </p>

            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={requestLocation}
              disabled={status === 'requesting' || status === 'resolving'}
              className="w-full h-14 bg-orange-500 hover:bg-orange-600 disabled:opacity-70 text-white font-bold rounded-2xl flex items-center justify-center gap-3 transition-colors shadow-lg shadow-orange-500/30"
            >
              {status === 'requesting' || status === 'resolving' ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>
                    {status === 'requesting' ? 'Getting location...' : 'Finding store...'}
                  </span>
                </>
              ) : (
                <>
                  <Navigation className="w-5 h-5" />
                  <span>Use my current location</span>
                </>
              )}
            </motion.button>

            {status === 'error' && (
              <p className="mt-4 text-sm text-red-500 font-medium">
                Something went wrong. Please try again.
              </p>
            )}
          </>
        )}
      </motion.div>
    </div>
  )
}