import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import { ProductCard } from './ProductCard'
import type { CategoryWithProducts } from '@/services/darkstore.service'

export function CategorySectionRow({ category }: { category: CategoryWithProducts }) {
  if (category.products.length === 0) return null
  
  return (
    <section className="mb-6">
      {/* Header */}
      <div className="flex items-center justify-between px-4 mb-3">
        <h2 className="text-base font-black text-neutral-900 uppercase tracking-wide">
          {category.name}
        </h2>
        <Link
          href={`/groceries/category/${category.slug}`}
          className="flex items-center gap-1 text-orange-500 text-xs font-bold"
        >
          See all
          <ChevronRight className="w-3 h-3" />
        </Link>
      </div>

      {/* Horizontal product scroll */}
      <div className="flex gap-3 overflow-x-auto px-4 pb-2 scrollbar-hide">
        {category.products.map(product => (
          <div key={product.id} className="w-36 flex-shrink-0">
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </section>
  )
}