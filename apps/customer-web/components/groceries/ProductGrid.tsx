"use client";

import Link from "next/link";
import type { Product } from "@zalldi/types";
import { EmptyState } from "@zalldi/ui";
import { useCartStore } from "@/store/cartStore";

function ProductCard({ product }: { product: Product }) {
  const { addGroceryItem, groceryItems, updateGroceryItemQty } = useCartStore();
  const cartItem = groceryItems.find((i) => i.product_id === product.id);
  const qty = cartItem?.quantity ?? 0;

  const discountPct = Math.round(((product.mrp - product.price) / product.mrp) * 100);

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-all group">
      <Link href={`/groceries/product/${product.slug}`} className="block">
        <div className="relative h-36 bg-gray-50 flex items-center justify-center p-3">
          {product.image_urls[0] ? (
            <img
              src={product.image_urls[0]}
              alt={product.name}
              className="h-full w-full object-contain mix-blend-multiply"
            />
          ) : (
            <span className="text-4xl">📦</span>
          )}
          {discountPct > 0 && (
            <div className="absolute top-2 left-2 bg-green-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
              {discountPct}% OFF
            </div>
          )}
          {product.stock_quantity <= product.low_stock_threshold && product.stock_quantity > 0 && (
            <div className="absolute top-2 right-2 bg-orange-100 text-orange-700 text-[10px] font-bold px-1.5 py-0.5 rounded">
              Few left
            </div>
          )}
        </div>
      </Link>

      <div className="p-3">
        <Link href={`/groceries/product/${product.slug}`}>
          <h3 className="text-sm font-semibold text-gray-900 line-clamp-2 leading-tight group-hover:text-green-600 transition-colors">
            {product.name}
          </h3>
          <p className="text-xs text-gray-500 mt-0.5">
            {product.weight}{product.weight_unit}
          </p>
        </Link>

        <div className="flex items-center justify-between mt-2">
          <div>
            <span className="font-bold text-gray-900">₹{product.price}</span>
            {product.mrp > product.price && (
              <span className="text-xs text-gray-400 line-through ml-1">₹{product.mrp}</span>
            )}
          </div>

          {product.stock_quantity === 0 ? (
            <span className="text-xs text-red-500 font-medium">Out of stock</span>
          ) : qty === 0 ? (
            <button
              onClick={() =>
                addGroceryItem(
                  {
                    product_id: product.id,
                    name: product.name,
                    price: product.price,
                    mrp: product.mrp,
                    image_url: product.image_urls[0] ?? null,
                    quantity: 1,
                    stock_quantity: product.stock_quantity,
                  },
                  product.darkstore_id
                )
              }
              className="px-3 py-1 bg-green-500 hover:bg-green-600 text-white text-sm font-semibold rounded-lg transition-colors"
            >
              ADD
            </button>
          ) : (
            <div className="flex items-center gap-1 border border-green-500 rounded-lg overflow-hidden">
              <button
                onClick={() => updateGroceryItemQty(product.id, qty - 1)}
                className="w-7 h-7 flex items-center justify-center text-green-600 hover:bg-green-50 font-bold"
              >
                −
              </button>
              <span className="w-6 text-center text-sm font-bold text-green-700">{qty}</span>
              <button
                onClick={() => updateGroceryItemQty(product.id, Math.min(qty + 1, product.stock_quantity))}
                className="w-7 h-7 flex items-center justify-center text-green-600 hover:bg-green-50 font-bold"
              >
                +
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ProductGrid({ products }: { products: Product[] }) {
  if (products.length === 0) {
    return (
      <EmptyState
        icon="🛒"
        title="No products found"
        description="We're stocking up. Check back soon or try a different category."
      />
    );
  }

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-900 mb-4">All Products</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </div>
  );
}
