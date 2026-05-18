'use client'
import Link from 'next/link'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Minus, Heart } from 'lucide-react'
import { useCartStore } from '@/store/cartStore'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import type { Product } from '@/services/darkstore.service'

const ADD_H    = 28
const ADD_PEEK = 14

export function ProductCard({ product }: { product: Product }) {
  const router = useRouter()
  const { user } = useAuth()
  const { groceryItems, addGroceryItem, updateGroceryItemQty } = useCartStore()

  const [isWishlisted, setIsWishlisted] = useState(false)

  // Get darkstore from localStorage (set by useNearestDarkstore)
  const darkstoreId = typeof window !== 'undefined'
    ? (JSON.parse(localStorage.getItem('zalldi-location') || '{}')?.state?.darkstoreId ?? '')
    : ''

  const cartItem = groceryItems.find(i => i.product_id === product.id)
  const qty = cartItem?.quantity ?? 0

  // Match old React card logic exactly
  const sellingPrice = product.price
  const savings = product.mrp > product.price
    ? Math.round(product.mrp - product.price)
    : null
  const discount = product.mrp > product.price
    ? Math.round(((product.mrp - product.price) / product.mrp) * 100)
    : null

  const isOOS = product.stock_quantity === 0
  const isLow = !isOOS && product.stock_quantity <= product.low_stock_threshold
  const image = product.image_urls?.[0] ?? null

  const guard = () => {
    if (user) return true
    router.push('/login')
    return false
  }

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (!guard()) return
    if (isOOS) { toast.error('Out of stock'); return }

    if (qty === 0) {
      addGroceryItem({
        product_id: product.id,
        name: product.name,
        price: product.price,
        mrp: product.mrp,
        image_url: image,
        quantity: 1,
        stock_quantity: product.stock_quantity,
      }, darkstoreId)
      toast.success('Added!', { icon: '🛒', duration: 1100 })
    } else {
      updateGroceryItemQty(product.id, qty + 1)
    }
  }

  const handleDecrease = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    updateGroceryItemQty(product.id, qty - 1)
  }

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (!guard()) return
    setIsWishlisted(w => !w)
    toast.success(isWishlisted ? 'Removed 💔' : 'Saved ❤️', { duration: 1100 })
  }

  return (
    <Link
      href={`/groceries/product/${product.slug}`}
      style={{ display: 'block', textDecoration: 'none' }}
      draggable={false}
    >
      {/* Card — NO overflow:hidden so ADD button peeks above */}
      <div style={{
        background: '#fff',
        borderRadius: 14,
        boxShadow: '0 3px 16px rgba(0,0,0,0.09), 0 1px 3px rgba(0,0,0,0.05)',
        position: 'relative',
      }}>

        {/* Image zone — overflow:hidden only here */}
        <div style={{
          position: 'relative',
          width: '100%',
          paddingBottom: '100%',
          background: '#f5f5f5',
          borderRadius: '14px 14px 0 0',
          overflow: 'hidden',
        }}>
          {image ? (
            <img
              src={image}
              alt={product.name}
              loading="lazy"
              draggable={false}
              onError={e => {
                (e.currentTarget as HTMLImageElement).src = ''
                e.currentTarget.style.display = 'none'
              }}
              style={{
                position: 'absolute', inset: 0,
                width: '100%', height: '100%',
                objectFit: 'contain',
                padding: 8,
                filter: isOOS ? 'brightness(0.45) saturate(0.2)' : 'none',
              }}
            />
          ) : (
            <div style={{
              position: 'absolute', inset: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 36,
            }}>
              📦
            </div>
          )}

          {/* Bottom vignette */}
          {!isOOS && (
            <div style={{
              position: 'absolute', inset: 0, pointerEvents: 'none',
              background: 'linear-gradient(to top,rgba(0,0,0,0.15) 0%,transparent 40%)',
            }} />
          )}

          {/* TOP-LEFT: discount badge */}
          {discount && discount > 0 && (
            <div style={{
              position: 'absolute', top: 0, left: 0,
              background: '#f97316', color: '#fff',
              fontSize: 7, fontWeight: 900,
              padding: '2px 6px',
              borderRadius: '0 0 7px 0',
              letterSpacing: 0.2, lineHeight: 1.5,
              whiteSpace: 'nowrap',
            }}>
              {discount}% OFF
            </div>
          )}

          {/* TOP-RIGHT: Heart */}
          <motion.button
            whileTap={{ scale: 0.72 }}
            onClick={handleWishlist}
            aria-label="Wishlist"
            style={{
              position: 'absolute', top: 5, right: 5,
              background: 'none', border: 'none', cursor: 'pointer',
              padding: 4, display: 'flex', alignItems: 'center',
            }}
          >
            <Heart size={14} style={{
              fill:   isWishlisted ? '#ef4444' : 'none',
              color:  isWishlisted ? '#ef4444' : 'rgba(255,255,255,0.92)',
              filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.55))',
              transition: 'all 0.15s',
            }} />
          </motion.button>

          {/* OOS overlay */}
          {isOOS && (
            <div style={{
              position: 'absolute', inset: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <span style={{
                background: 'rgba(0,0,0,0.68)', color: '#fff',
                fontSize: 10, fontWeight: 900,
                padding: '4px 12px', borderRadius: 99,
              }}>
                Out of Stock
              </span>
            </div>
          )}
        </div>

        {/* Info panel */}
        <div style={{
          position: 'relative',
          padding: `${ADD_PEEK - 8}px 9px 9px`,
          borderRadius: '0 0 14px 14px',
        }}>

          {/* Floating ADD button — peeks above info panel */}
          {!isOOS && (
            <div style={{
              position: 'absolute',
              top: -ADD_PEEK,
              right: 6,
              zIndex: 20,
            }}>
              <AnimatePresence mode="wait">
                {qty === 0 ? (
                  <motion.button
                    key="add"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    whileTap={{ scale: 0.88 }}
                    onClick={handleAdd}
                    style={{
                      background: '#111', color: '#fff',
                      height: ADD_H, padding: '0 14px',
                      borderRadius: ADD_H / 2,
                      fontSize: 10, fontWeight: 900,
                      border: 'none', cursor: 'pointer',
                      letterSpacing: 0.8,
                      boxShadow: '0 2px 10px rgba(0,0,0,0.25)',
                      display: 'flex', alignItems: 'center',
                    }}
                  >
                    ADD
                  </motion.button>
                ) : (
                  <motion.div
                    key="qty"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    style={{
                      display: 'flex', alignItems: 'center',
                      height: ADD_H,
                      background: '#f97316',
                      borderRadius: ADD_H / 2,
                      overflow: 'hidden',
                      boxShadow: '0 2px 10px rgba(249,115,22,0.35)',
                    }}
                  >
                    <motion.button
                      whileTap={{ scale: 0.82 }}
                      onClick={handleDecrease}
                      style={{
                        height: '100%', padding: '0 9px',
                        background: 'none', border: 'none',
                        color: '#fff', cursor: 'pointer',
                        display: 'flex', alignItems: 'center',
                      }}
                    >
                      <Minus size={10} />
                    </motion.button>
                    <motion.span
                      key={qty}
                      initial={{ scale: 1.3 }}
                      animate={{ scale: 1 }}
                      style={{
                        color: '#fff', fontWeight: 900,
                        fontSize: 11, minWidth: 16, textAlign: 'center',
                      }}
                    >
                      {qty}
                    </motion.span>
                    <motion.button
                      whileTap={{ scale: 0.82 }}
                      onClick={handleAdd}
                      style={{
                        height: '100%', padding: '0 9px',
                        background: 'none', border: 'none',
                        color: '#fff', cursor: 'pointer',
                        display: 'flex', alignItems: 'center',
                      }}
                    >
                      <Plus size={10} />
                    </motion.button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          {/* Weight badge */}
          {product.weight && product.weight_unit && (
            <div style={{
              display: 'inline-flex', alignItems: 'center',
              background: '#e5e7eb', borderRadius: 5,
              padding: '2px 7px', marginBottom: 3, maxWidth: '85%',
            }}>
              <span style={{
                fontSize: 9, fontWeight: 700, color: '#374151',
                whiteSpace: 'nowrap', overflow: 'hidden',
                textOverflow: 'ellipsis', maxWidth: 110,
              }}>
                {product.weight}{product.weight_unit}
              </span>
            </div>
          )}

          {/* Name — 2-line clamp */}
          <h3 style={{
            fontSize: 11, fontWeight: 600, color: '#1a1a1a',
            lineHeight: 1.3, margin: '0 0 0px',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            letterSpacing: -0.1,
            minHeight: 28,
          }}>
            {product.name}
          </h3>

          {/* Save badge */}
          <div style={{ minHeight: 20, marginBottom: 3, display: 'flex', alignItems: 'center' }}>
            {savings && savings > 0 && (
              <div style={{
                display: 'inline-flex', alignItems: 'center',
                background: 'linear-gradient(90deg,#16a34a,#15803d)',
                borderRadius: 4, padding: '1.5px 6px',
              }}>
                <span style={{
                  fontSize: 8, fontWeight: 900, color: '#fff',
                  letterSpacing: 0.2, whiteSpace: 'nowrap',
                }}>
                  Save ₹{savings}
                </span>
              </div>
            )}
          </div>

          {/* Price row */}
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 5, marginBottom: 3 }}>
            <span style={{ fontSize: 13, fontWeight: 900, color: '#111', letterSpacing: -0.3 }}>
              ₹{sellingPrice}
            </span>
            {product.mrp > product.price && (
              <span style={{ fontSize: 9, color: '#9ca3af', textDecoration: 'line-through', fontWeight: 500 }}>
                ₹{product.mrp}
              </span>
            )}
          </div>

          {/* Stock status */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', minHeight: 16 }}>
            <span />
            {isOOS ? null : isLow ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#f97316' }} />
                <span style={{ fontSize: 8, fontWeight: 800, color: '#f97316' }}>
                  Only {product.stock_quantity} left
                </span>
              </div>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#16a34a' }} />
                <span style={{ fontSize: 8, fontWeight: 600, color: '#16a34a' }}>In stock</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  )
}