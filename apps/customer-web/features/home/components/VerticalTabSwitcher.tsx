'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import type { DarkstoreHomeData } from '@/services/darkstore.service'
import { GroceryHome } from './GroceryHome'
import { FoodComingSoon } from './FoodComingSoon'

type Tab = 'groceries' | 'food' | 'dineout'

interface Props {
  groceryData: DarkstoreHomeData
}

const TABS: { id: Tab;label: string;emoji: string;available: boolean } [] = [
  { id: 'food', label: 'Food', emoji: '🍔', available: false },
  { id: 'groceries', label: 'Groceries', emoji: '🛒', available: true },
  { id: 'dineout', label: 'Dine Out', emoji: '🍽️', available: false },
]

export function VerticalTabSwitcher({ groceryData }: Props) {
  const [active, setActive] = useState < Tab > ('groceries')
  
  return (
    <div className="bg-neutral-900">
      {/* Tab row */}
      <div className="flex border-b border-white/10">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActive(tab.id)}
            className="relative flex-1 flex flex-col items-center gap-1 py-3 px-2 transition-colors"
          >
            {/* Active indicator */}
            {active === tab.id && (
              <motion.div
                layoutId="tab-indicator"
                className="absolute inset-0 bg-white/8 rounded-t-xl"
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              />
            )}

            <span className="text-2xl relative z-10">{tab.emoji}</span>
            <span
              className={`text-xs font-bold relative z-10 transition-colors ${
                active === tab.id
                  ? 'text-white'
                  : 'text-white/40'
              }`}
            >
              {tab.label}
            </span>

            {/* Active underline */}
            {active === tab.id && (
              <motion.div
                layoutId="tab-underline"
                className="absolute bottom-0 left-4 right-4 h-0.5 bg-orange-500 rounded-full"
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              />
            )}

            {/* Coming soon badge */}
            {!tab.available && (
              <span className="absolute top-2 right-2 text-[8px] font-black text-orange-400 bg-orange-400/10 px-1.5 py-0.5 rounded-full">
                SOON
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="bg-gray-50 min-h-screen">
        {active === 'groceries' && <GroceryHome data={groceryData} />}
        {active === 'food'      && <FoodComingSoon />}
        {active === 'dineout'   && <FoodComingSoon label="Dine Out" />}
      </div>
    </div>
  )
}