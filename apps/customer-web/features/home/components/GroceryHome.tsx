'use client'
import { motion } from 'framer-motion'
import { CategorySectionRow } from './CategorySectionRow'
import type { DarkstoreHomeData } from '@/services/darkstore.service'

export function GroceryHome({ data }: { data: DarkstoreHomeData }) {
  const { categories } = data
  
  return (
    <div>
      {categories.length === 0 ? (
        <div className="py-24 text-center">
          <p className="text-4xl mb-4">🛒</p>
          <p className="text-neutral-500 text-sm font-medium">
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