'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Search, Mic } from 'lucide-react'

const PLACEHOLDERS = [
  'Search "vegetables, fruits…"',
  'Search "milk, bread, eggs…"',
  'Search "chips, snacks…"',
  'Search "shampoo, soap…"',
  'Search "rice, dal, atta…"',
]

export function HeroSearchBar() {
  const router = useRouter()
  const [idx, setIdx] = useState(0)
  const [visible, setVisible] = useState(true)
  
  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false)
      setTimeout(() => {
        setIdx(i => (i + 1) % PLACEHOLDERS.length)
        setVisible(true)
      }, 250)
    }, 3000)
    return () => clearInterval(interval)
  }, [])
  
  return (
    <div style={{ padding: '8px 14px', marginBottom: 0 }}>
      <div
        role="button"
        tabIndex={0}
        onClick={() => router.push('/search')}
        onKeyDown={e => e.key === 'Enter' && router.push('/search')}
        style={{
          display: 'flex', alignItems: 'center', gap: 8,
          background: 'rgba(8,10,16,0.60)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          borderRadius: 14,
          border: '1.5px solid rgba(255,255,255,0.09)',
          padding: '0 14px', height: 40,
          cursor: 'pointer',
        }}
      >
        <Search size={16} style={{ color: 'rgba(255,255,255,0.40)', flexShrink: 0 }} />
        <span style={{
          flex: 1, color: 'rgba(255,255,255,0.36)',
          fontSize: 13, fontWeight: 400,
          userSelect: 'none', letterSpacing: 0.1,
          opacity: visible ? 1 : 0,
          transition: 'opacity 0.25s ease',
          overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis',
        }}>
          {PLACEHOLDERS[idx]}
        </span>
        <div style={{ width: 1, height: 18, background: 'rgba(255,255,255,0.10)', flexShrink: 0 }} />
        <Mic size={16} style={{ color: 'rgba(255,255,255,0.30)', flexShrink: 0 }} />
      </div>
    </div>
  )
}