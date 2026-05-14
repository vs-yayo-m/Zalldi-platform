'use client'
import { motion } from 'framer-motion'

export function AuthIllustration() {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="hidden lg:flex flex-col items-center justify-center"
    >
      <div className="relative w-full max-w-md">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-200 to-orange-100 rounded-3xl blur-3xl opacity-60" />
        <motion.img
          src="/assets/auth/auth-animation.gif"
          alt="Zalldi delivery"
          className="relative w-full h-auto rounded-2xl"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = 'none'
          }}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mt-8 text-center"
      >
        <h2 className="text-3xl font-black text-neutral-900 mb-3">
          Fast. Fresh. <span className="text-orange-500">Delivered.</span>
        </h2>
        <p className="text-neutral-600 font-medium">
          Order anything, delivered in 60 minutes
        </p>
      </motion.div>
    </motion.div>
  )
}