'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { MapPin, Navigation, AlertCircle } from 'lucide-react'
import { useNearestDarkstore } from '../hooks/useNearestDarkstore'

export function LocationGate({ children }: { children: React.ReactNode }) {
  const { status, requestLocation, hasLocation } = useNearestDarkstore()
  const router = useRouter()
  
  // After location granted → refresh Server Component to pick up cookie
  useEffect(() => {
    if (status === 'success') {
      router.refresh()
    }
  }, [status, router])
  
  if (hasLocation) return <>{children}</>
  
  return (
    <div style={{
      minHeight: '50vh', display: 'flex',
      alignItems: 'center', justifyContent: 'center',
      padding: '0 24px', background: '#fff7ed',
    }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ width: '100%', maxWidth: 360, textAlign: 'center' }}
      >
        <div style={{
          width: 72, height: 72,
          background: '#fff7ed', borderRadius: '50%',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 20px',
          border: '2px solid rgba(249,115,22,0.2)',
        }}>
          <MapPin size={36} color="#f97316" />
        </div>

        {status === 'no_coverage' ? (
          <>
            <h2 style={{ fontSize: 20, fontWeight: 900, color: '#1f2937', marginBottom: 8 }}>
              Not in your area yet
            </h2>
            <p style={{ color: '#6b7280', fontSize: 14, marginBottom: 16 }}>
              Zalldi is expanding fast. We'll be there soon!
            </p>
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              color: '#d97706', background: '#fffbeb',
              borderRadius: 12, padding: '12px 16px',
              border: '1px solid #fde68a',
            }}>
              <AlertCircle size={16} />
              <span style={{ fontSize: 13, fontWeight: 600 }}>No darkstore in your area</span>
            </div>
          </>
        ) : status === 'denied' ? (
          <>
            <h2 style={{ fontSize: 20, fontWeight: 900, color: '#1f2937', marginBottom: 8 }}>
              Location access denied
            </h2>
            <p style={{ color: '#6b7280', fontSize: 14, marginBottom: 20 }}>
              Enable location in browser settings and try again.
            </p>
            <button
              onClick={requestLocation}
              style={{
                width: '100%', height: 52,
                background: '#f97316', color: '#fff',
                border: 'none', borderRadius: 16,
                fontSize: 15, fontWeight: 800, cursor: 'pointer',
              }}
            >
              Try Again
            </button>
          </>
        ) : (
          <>
            <h2 style={{ fontSize: 20, fontWeight: 900, color: '#1f2937', marginBottom: 8 }}>
              Where should we deliver?
            </h2>
            <p style={{ color: '#6b7280', fontSize: 14, marginBottom: 24 }}>
              We need your location to show products and delivery time.
            </p>

            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={requestLocation}
              disabled={status === 'requesting' || status === 'resolving'}
              style={{
                width: '100%', height: 56,
                background: status === 'requesting' || status === 'resolving'
                  ? '#fdba74' : '#f97316',
                color: '#fff', border: 'none', borderRadius: 18,
                fontSize: 15, fontWeight: 800,
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                cursor: 'pointer',
                boxShadow: '0 4px 24px rgba(249,115,22,0.35)',
              }}
            >
              {status === 'requesting' || status === 'resolving' ? (
                <>
                  <div style={{
                    width: 20, height: 20,
                    border: '2px solid rgba(255,255,255,0.3)',
                    borderTopColor: '#fff',
                    borderRadius: '50%',
                    animation: 'spin 0.8s linear infinite',
                  }} />
                  <span>
                    {status === 'requesting' ? 'Getting location...' : 'Finding store...'}
                  </span>
                </>
              ) : (
                <>
                  <Navigation size={20} />
                  <span>Use my current location</span>
                </>
              )}
            </motion.button>

            {status === 'error' && (
              <p style={{ marginTop: 12, fontSize: 13, color: '#ef4444', fontWeight: 600 }}>
                Something went wrong. Please try again.
              </p>
            )}
          </>
        )}
      </motion.div>

      {/* Spinner animation */}
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}