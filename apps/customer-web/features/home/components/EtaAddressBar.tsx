'use client'
import { useMemo, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, MapPin, ChevronDown, ShoppingCart, UserCircle2 } from 'lucide-react'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { useCartStore } from '@/store/cartStore'
import { useLocationStore } from '@/store/locationStore'

function getInitial(displayName?: string | null, email?: string | null) {
  return (displayName?.[0] || email?.[0] || 'U').toUpperCase()
}

interface Props {
  onMenuOpen: () => void
}

export function EtaAddressBar({ onMenuOpen }: Props) {
  const router = useRouter()
  const { user } = useAuth()
  const { groceryItems, foodItems } = useCartStore()
  const { addressLabel, deliveryMins, isOpen, locationGranted } = useLocationStore()

  const cartCount = useMemo(() =>
    [...groceryItems, ...foodItems].reduce((t, i) => t + i.quantity, 0),
    [groceryItems, foodItems]
  )

  const initial = getInitial(user?.display_name, user?.email)

  const handleAddressTap = () => {
    if (!user) router.push('/login')
    // Address bottom sheet — Section 10
  }

  const handleProfileTap = () => {
    if (!user) router.push('/login')
    else router.push('/account')
  }

  return (
    <div style={{ padding: '10px 16px 8px' }}>

      {/* ROW 1: ☰ · Logo · 🛒 👤 */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '40px 1fr 40px 40px',
        alignItems: 'center',
        gap: 6,
        marginBottom: 6,
      }}>

        {/* Hamburger */}
        <motion.button
          whileTap={{ scale: 0.84 }}
          onClick={onMenuOpen}
          style={{
            background: 'none', border: 'none',
            cursor: 'pointer', padding: 4,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >
          <Menu size={22} color="rgba(255,255,255,0.85)" strokeWidth={2} />
        </motion.button>

        {/* Logo */}
        <Link href="/" style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          gridColumn: '2 / 3',
        }}>
          <motion.div
            whileTap={{ scale: 0.95 }}
            style={{ display: 'flex', alignItems: 'baseline', gap: 1 }}
          >
            <span style={{
              fontSize: 22, fontWeight: 900, fontStyle: 'italic',
              letterSpacing: -0.5, color: '#f97316',
            }}>Z</span>
            <span style={{
              fontSize: 20, fontWeight: 900, fontStyle: 'italic',
              letterSpacing: -0.5, color: '#fff',
            }}>alldi</span>
          </motion.div>
        </Link>

        {/* Cart */}
        <motion.button
          whileTap={{ scale: 0.84 }}
          onClick={() => router.push('/cart')}
          style={{
            position: 'relative', background: 'none', border: 'none',
            cursor: 'pointer', padding: 4,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >
          <ShoppingCart
            size={22}
            color={cartCount > 0 ? '#f97316' : 'rgba(255,255,255,0.80)'}
            strokeWidth={2}
          />
          <AnimatePresence>
            {cartCount > 0 && (
              <motion.span
                key="badge"
                initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
                style={{
                  position: 'absolute', top: -1, right: -1,
                  background: '#f97316', color: '#fff',
                  fontSize: 8, fontWeight: 900,
                  minWidth: 15, height: 15, borderRadius: 99,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  padding: '0 2px', border: '1.5px solid #0c1117',
                }}
              >
                {cartCount > 9 ? '9+' : cartCount}
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>

        {/* Profile */}
        <motion.button
          whileTap={{ scale: 0.84 }}
          onClick={handleProfileTap}
          style={{
            background: 'none', border: 'none', cursor: 'pointer', padding: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >
          {user?.photo_url ? (
            <img
              src={user.photo_url}
              alt="avatar"
              style={{
                width: 30, height: 30, borderRadius: '50%',
                objectFit: 'cover', border: '2px solid rgba(255,255,255,0.25)',
              }}
            />
          ) : user ? (
            <div style={{
              width: 30, height: 30, borderRadius: '50%',
              background: 'linear-gradient(135deg,#f97316,#ea580c)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              border: '2px solid rgba(255,255,255,0.20)',
            }}>
              <span style={{ color: '#fff', fontSize: 13, fontWeight: 900 }}>
                {initial}
              </span>
            </div>
          ) : (
            <UserCircle2 size={26} color="rgba(255,255,255,0.70)" strokeWidth={1.5} />
          )}
        </motion.button>
      </div>

      {/* ROW 2: 📍 Address */}
      <motion.button
        whileTap={{ opacity: 0.65 }}
        onClick={handleAddressTap}
        style={{
          display: 'flex', alignItems: 'center', gap: 4,
          background: 'none', border: 'none',
          cursor: 'pointer', padding: '2px 0',
          width: '100%', textAlign: 'left',
        }}
      >
        <MapPin size={11} color="#f97316" style={{ flexShrink: 0, marginTop: 1 }} />
        <span style={{ color: 'rgba(255,255,255,0.45)', fontSize: 11, fontWeight: 500, flexShrink: 0 }}>
          To:
        </span>
        <span style={{ fontSize: 11, flexShrink: 0 }}>🏠</span>
        <span style={{
          color: 'rgba(255,255,255,0.55)', fontSize: 12, fontWeight: 400,
          overflow: 'hidden', textOverflow: 'ellipsis',
          whiteSpace: 'nowrap', flex: 1,
        }}>
          {locationGranted && addressLabel ? addressLabel : 'Set delivery location'}
        </span>
        {deliveryMins > 0 && locationGranted && (
          <span style={{
            color: '#f97316', fontSize: 10, fontWeight: 800,
            background: 'rgba(249,115,22,0.15)',
            padding: '1px 6px', borderRadius: 99, flexShrink: 0,
          }}>
            ⚡ {isOpen ? `${deliveryMins}min` : 'Closed'}
          </span>
        )}
        <ChevronDown size={12} color="rgba(255,255,255,0.40)" style={{ flexShrink: 0 }} />
      </motion.button>
    </div>
  )
}