'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import type { DarkstoreHomeData } from '@/services/darkstore.service'
import { GroceryHome } from './GroceryHome'
import { FoodComingSoon } from './FoodComingSoon'

type Tab = 'food' | 'groceries' | 'dineout'

const TABS: { id: Tab;label: string;emoji: string;available: boolean } [] = [
  { id: 'food', label: 'Food', emoji: '🍔', available: false },
  { id: 'groceries', label: 'Groceries', emoji: '🛒', available: true },
  { id: 'dineout', label: 'Dine Out', emoji: '🍽️', available: false },
]

interface Props {
  groceryData: DarkstoreHomeData
}

export function VerticalTabSwitcher({ groceryData }: Props) {
  const [active, setActive] = useState < Tab > ('groceries')
  
  return (
    <div>
      {/* Tab row — dark background matching header */}
      <div style={{
        background: '#2d1500',
        display: 'flex',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
      }}>
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActive(tab.id)}
            style={{
              flex: 1, position: 'relative',
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', gap: 4,
              padding: '10px 8px 8px',
              background: 'none', border: 'none', cursor: 'pointer',
            }}
          >
            {/* Active background */}
            {active === tab.id && (
              <motion.div
                layoutId="tab-bg"
                style={{
                  position: 'absolute', inset: 0,
                  background: 'rgba(255,255,255,0.07)',
                  borderRadius: '12px 12px 0 0',
                }}
                transition={{ type: 'spring', stiffness: 400, damping: 35 }}
              />
            )}

            <span style={{ fontSize: 24, position: 'relative', zIndex: 1 }}>
              {tab.emoji}
            </span>

            <span style={{
              fontSize: 11, fontWeight: 700,
              color: active === tab.id ? '#fff' : 'rgba(255,255,255,0.40)',
              position: 'relative', zIndex: 1,
              transition: 'color 0.2s',
            }}>
              {tab.label}
            </span>

            {/* Coming soon badge */}
            {!tab.available && (
              <span style={{
                position: 'absolute', top: 6, right: 8,
                fontSize: 7, fontWeight: 900,
                color: '#f97316',
                background: 'rgba(249,115,22,0.15)',
                padding: '1px 4px', borderRadius: 99,
                border: '1px solid rgba(249,115,22,0.3)',
                zIndex: 2,
              }}>
                SOON
              </span>
            )}

            {/* Active underline */}
            {active === tab.id && (
              <motion.div
                layoutId="tab-line"
                style={{
                  position: 'absolute', bottom: 0,
                  left: '20%', right: '20%',
                  height: 2, background: '#f97316', borderRadius: 99,
                }}
                transition={{ type: 'spring', stiffness: 400, damping: 35 }}
              />
            )}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div style={{ background: '#f9fafb', minHeight: '60vh' }}>
        {active === 'groceries' && <GroceryHome data={groceryData} />}
        {active === 'food'      && <FoodComingSoon label="Food Delivery" />}
        {active === 'dineout'   && <FoodComingSoon label="Dine Out" />}
      </div>
    </div>
  )
}