'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Search, Mic } from 'lucide-react'

const PLACEHOLDERS = [
  'Search "milk, bread, eggs…"',
  'Search "vegetables, fruits…"',
  'Search "chips, snacks…"',
  'Search "shampoo, soap…"',
  'Search "rice, dal, atta…"',
]

export function HomeSearchBar() {
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
    <div className="px-4 py-3 bg-neutral-900">
      <button
        onClick={() => router.push('/search')}
        className="w-full h-11 bg-white/10 hover:bg-white/15 border border-white/10 rounded-2xl flex items-center gap-3 px-4 transition-colors"
      >
        <Search className="w-4 h-4 text-white/40 flex-shrink-0" />
        <span
          className="flex-1 text-left text-sm text-white/35 transition-opacity duration-200"
          style={{ opacity: visible ? 1 : 0 }}
        >
          {PLACEHOLDERS[idx]}
        </span>
        <div className="w-px h-4 bg-white/10 flex-shrink-0" />
        <Mic className="w-4 h-4 text-white/30 flex-shrink-0" />
      </button>
    </div>
  )
}