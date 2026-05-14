'use client'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Plus, Minus } from 'lucide-react'
import { useCartStore } from '@/store/cartStore'
import type { Product } from '@/services/darkstore.service'

export function ProductCard({ product }: { product: Product }) {
  const { groceryItems, addGroceryItem, updateGroceryItemQty } = useCartStore()
  const { locationStore_darkstoreId } = { locationStore_darkstoreId: '' }
  
  // Get darkstore from location store
  const darkstoreId = typeof window !== 'undefined' ?
    JSON.parse(localStorage.getItem('zalldi-location') || '{}')?.state?.darkstoreId ?? '' :
    ''
  
  const cartItem = groceryItems.find(i => i.product_id === product.id)
  const qty = cartItem?.quantity ?? 0
  
  const discount = product.discount_percentage ?
    Math.round(product.discount_percentage) :
    null
  
  const outOfStock = product.stock_quantity === 0
  const lowStock = !outOfStock && product.stock_quantity <= product.low_stock_threshold
  
  const primaryImage = product.image_urls[0] ?? null
  
  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden flex flex-col">
      {/* Image */}
      <Link href={`/groceries/product/${product.slug}`} className="block">
        <div className="relative h-32 bg-gray-50 flex items-center justify-center p-3">
          {primaryImage ? (
            <img
              src={primaryImage}
              alt={product.name}
              className="h-full w-full object-contain mix-blend-multiply"
              loading="lazy"
            />
          ) : (
            <span className="text-4xl">📦</span>
          )}

          {discount && discount > 0 && (
            <div className="absolute top-2 left-2 bg-green-500 text-white text-[10px] font-black px-1.5 py-0.5 rounded-md">
              {discount}% OFF
            </div>
          )}

          {lowStock && (
            <div className="absolute top-2 right-2 bg-orange-100 text-orange-700 text-[10px] font-bold px-1.5 py-0.5 rounded-md">
              Few left
            </div>
          )}
        </div>
      </Link>

      {/* Info */}
      <div className="p-3 flex flex-col flex-1">
        <Link href={`/groceries/product/${product.slug}`}>
          <h3 className="text-sm font-semibold text-neutral-900 line-clamp-2 leading-tight mb-0.5">
            {product.name}
          </h3>
        </Link>

        {(product.weight && product.weight_unit) && (
          <p className="text-xs text-neutral-400 mb-2">
            {product.weight}{product.weight_unit}
          </p>
        )}

        {/* Price + Add button */}
        <div className="flex items-center justify-between mt-auto">
          <div>
            <span className="font-black text-neutral-900 text-sm">
              ₹{product.price}
            </span>
            {product.mrp > product.price && (
              <span className="text-xs text-neutral-400 line-through ml-1">
                ₹{product.mrp}
              </span>
            )}
          </div>

          {outOfStock ? (
            <span className="text-xs text-red-500 font-semibold">Out of stock</span>
          ) : qty === 0 ? (
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => addGroceryItem(
                {
                  product_id: product.id,
                  name: product.name,
                  price: product.price,
                  mrp: product.mrp,
                  image_url: primaryImage,
                  quantity: 1,
                  stock_quantity: product.stock_quantity,
                },
                darkstoreId
              )}
              className="w-8 h-8 bg-green-500 hover:bg-green-600 text-white rounded-lg flex items-center justify-center transition-colors"
            >
              <Plus className="w-4 h-4" strokeWidth={3} />
            </motion.button>
          ) : (
            <div className="flex items-center gap-1 border-2 border-green-500 rounded-lg overflow-hidden">
              <button
                onClick={() => updateGroceryItemQty(product.id, qty - 1)}
                className="w-7 h-7 flex items-center justify-center text-green-600 hover:bg-green-50"
              >
                <Minus className="w-3 h-3" strokeWidth={3} />
              </button>
              <span className="w-6 text-center text-sm font-black text-green-700">
                {qty}
              </span>
              <button
                onClick={() => updateGroceryItemQty(product.id, Math.min(qty + 1, product.stock_quantity))}
                className="w-7 h-7 flex items-center justify-center text-green-600 hover:bg-green-50"
              >
                <Plus className="w-3 h-3" strokeWidth={3} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}