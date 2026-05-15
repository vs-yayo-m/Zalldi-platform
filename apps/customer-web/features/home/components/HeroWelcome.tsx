'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { ShoppingCart, Tag } from 'lucide-react'
import { useAuth } from '@/features/auth/hooks/useAuth'

const SLIDES = [
  {
    eyebrow: "BUTWAL'S FASTEST",
    headline: 'Delivered in\n20 Minutes',
    sub: 'Fresh groceries at your door',
  },
  {
    eyebrow: 'BEST PRICES',
    headline: 'Save More\nEvery Order',
    sub: 'Lowest prices on daily essentials',
  },
  {
    eyebrow: 'FREE DELIVERY',
    headline: 'Zero Fees\nOn Every Order',
    sub: 'No hidden charges. Ever.',
  },
]

const TRUST = [
  { icon: '⚡', label: '20 min delivery' },
  { icon: '🌿', label: 'Always fresh' },
  { icon: '🎁', label: 'Free delivery' },
]

function GroceryIllustration() {
  const items = [
    { emoji: '🍎', top: 0,  left: 0,  size: 26, delay: 0   },
    { emoji: '🥦', top: 5,  left: 40, size: 22, delay: 0.3 },
    { emoji: '🥛', top: 40, left: 2,  size: 22, delay: 0.6 },
    { emoji: '🧅', top: 72, left: 0,  size: 18, delay: 0.9 },
  ]

  return (
    <div style={{ position: 'relative', width: 110, height: 110, flexShrink: 0 }}>
      <div style={{
        position: 'absolute', bottom: 0, right: 0,
        fontSize: 72, lineHeight: 1,
        filter: 'drop-shadow(0 8px 16px rgba(0,0,0,0.25))',
        userSelect: 'none',
      }}>🛍️</div>
      {items.map((item, i) => (
        <motion.span
          key={i}
          animate={{ y: [0, -5, 0] }}
          transition={{ repeat: Infinity, duration: 2.5, delay: item.delay, ease: 'easeInOut' }}
          style={{
            position: 'absolute', top: item.top, left: item.left,
            fontSize: item.size,
            filter: 'drop-shadow(0 3px 6px rgba(0,0,0,0.15))',
            userSelect: 'none',
          }}
        >
          {item.emoji}
        </motion.span>
      ))}
    </div>
  )
}

export function HeroWelcome() {
  const router = useRouter()
  const { user } = useAuth()
  const [idx, setIdx] = useState(0)

  useEffect(() => {
    const t = setInterval(() => setIdx(i => (i + 1) % SLIDES.length), 3500)
    return () => clearInterval(t)
  }, [])

  const slide = SLIDES[idx]

  return (
    <div style={{
      background: 'linear-gradient(180deg, #2d1500 0%, #c2500a 35%, #f97316 65%, #fff7ed 100%)',
      padding: '28px 20px 32px',
      position: 'relative', overflow: 'hidden',
    }}>
      {/* Decorative rings */}
      <div style={{
        position: 'absolute', top: -60, right: -60,
        width: 200, height: 200, borderRadius: '50%',
        border: '1px solid rgba(255,255,255,0.06)', pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', top: -30, right: -30,
        width: 140, height: 140, borderRadius: '50%',
        border: '1px solid rgba(255,255,255,0.08)', pointerEvents: 'none',
      }} />

      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 12, marginBottom: 20 }}>
        <div style={{ flex: 1, minWidth: 0 }}>

          {/* Welcome back */}
          {user && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              style={{ color: 'rgba(255,255,255,0.65)', fontSize: 12, fontWeight: 500, marginBottom: 6 }}
            >
              Welcome back, {user.display_name?.split(' ')[0] || 'there'} 👋
            </motion.div>
          )}

          {/* Eyebrow */}
          <AnimatePresence mode="wait">
            <motion.div
              key={`eyebrow-${idx}`}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              style={{
                display: 'inline-flex', alignItems: 'center',
                background: 'rgba(255,255,255,0.15)',
                borderRadius: 99, padding: '2px 10px', marginBottom: 8,
              }}
            >
              <span style={{ color: '#fff', fontSize: 9, fontWeight: 800, letterSpacing: 0.8, textTransform: 'uppercase' }}>
                {slide.eyebrow}
              </span>
            </motion.div>
          </AnimatePresence>

          {/* Headline */}
          <div style={{ minHeight: 68, marginBottom: 6 }}>
            <AnimatePresence mode="wait">
              <motion.h1
                key={`headline-${idx}`}
                initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.35, ease: 'easeOut' }}
                style={{
                  color: '#fff', fontSize: 28, fontWeight: 900,
                  lineHeight: 1.15, letterSpacing: -0.8, margin: 0,
                  whiteSpace: 'pre-line', textShadow: '0 2px 12px rgba(0,0,0,0.25)',
                }}
              >
                {slide.headline}
              </motion.h1>
            </AnimatePresence>
          </div>

          {/* Sub */}
          <AnimatePresence mode="wait">
            <motion.p
              key={`sub-${idx}`}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              style={{ color: 'rgba(255,255,255,0.65)', fontSize: 12, margin: '0 0 16px', lineHeight: 1.4 }}
            >
              {slide.sub}
            </motion.p>
          </AnimatePresence>

          {/* Dots */}
          <div style={{ display: 'flex', gap: 5, marginBottom: 16 }}>
            {SLIDES.map((_, i) => (
              <motion.button
                key={i}
                onClick={() => setIdx(i)}
                animate={{
                  width: i === idx ? 20 : 6,
                  background: i === idx ? '#fff' : 'rgba(255,255,255,0.30)',
                }}
                transition={{ duration: 0.25 }}
                style={{ height: 5, borderRadius: 99, border: 'none', cursor: 'pointer', padding: 0 }}
              />
            ))}
          </div>

          {/* CTAs */}
          <div style={{ display: 'flex', gap: 10 }}>
            <motion.button
              whileTap={{ scale: 0.93 }} whileHover={{ scale: 1.02 }}
              onClick={() => router.push('/groceries')}
              style={{
                display: 'flex', alignItems: 'center', gap: 7,
                background: '#fff', color: '#f97316',
                border: 'none', borderRadius: 14, padding: '11px 20px',
                fontSize: 13, fontWeight: 900, letterSpacing: 0.2,
                cursor: 'pointer', boxShadow: '0 4px 20px rgba(0,0,0,0.18)', flexShrink: 0,
              }}
            >
              <ShoppingCart size={14} />
              SHOP NOW
            </motion.button>

            <motion.button
              whileTap={{ scale: 0.93 }}
              onClick={() => router.push('/search')}
              style={{
                display: 'flex', alignItems: 'center', gap: 7,
                background: 'rgba(255,255,255,0.15)', color: '#fff',
                border: '1.5px solid rgba(255,255,255,0.30)', borderRadius: 14,
                padding: '11px 16px', fontSize: 13, fontWeight: 700,
                cursor: 'pointer', backdropFilter: 'blur(8px)', flexShrink: 0,
              }}
            >
              <Tag size={14} />
              Browse
            </motion.button>
          </div>
        </div>

        <GroceryIllustration />
      </div>

      {/* Trust strip */}
      <div style={{
        display: 'flex', justifyContent: 'center', gap: 20,
        padding: '14px 0 4px',
        borderTop: '1px solid rgba(255,255,255,0.10)',
      }}>
        {TRUST.map(t => (
          <div key={t.label} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <span style={{ fontSize: 14 }}>{t.icon}</span>
            <span style={{ color: 'rgba(255,255,255,0.75)', fontSize: 11, fontWeight: 600, whiteSpace: 'nowrap' }}>
              {t.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}