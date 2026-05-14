'use client'
import { motion } from 'framer-motion'
import { AlertCircle } from 'lucide-react'
import { CategorySectionRow } from './CategorySectionRow'
import type { DarkstoreHomeData } from '@/services/darkstore.service'

export function GroceryHome({ data }: { data: DarkstoreHomeData }) {
  const { categories, darkstoreOpen, opensAt } = data
  
  return (
    <div>
      {/* Store closed banner */}
      {!darkstoreOpen && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mx-4 mt-4 bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3"
        >
          <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-bold text-amber-800">
              Store is currently closed
            </p>
            <p className="text-xs text-amber-600 mt-0.5">
              Opens at {opensAt}. You can still browse and add items to cart.
            </p>
          </div>
        </motion.div>
      )}

      {/* Category sections */}
      {categories.length === 0 ? (
        <div className="py-24 text-center">
          <p className="text-4xl mb-4">🛒</p>
          <p className="text-neutral-500 text-sm">
            Products coming soon to your area
          </p>
        </div>
      ) : (
        <div className="pt-4 pb-20">
          {categories.map((cat, i) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <CategorySectionRow category={cat} />
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}