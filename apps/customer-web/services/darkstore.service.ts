// Server-side only — never import in client components
import { createClient } from '@/services/supabase/client.server'

export interface CategoryWithProducts {
  id: string
  name: string
  slug: string
  image_url: string | null
  sort_order: number
  products: Product[]
}

export interface Product {
  id: string
  name: string
  slug: string
  price: number
  mrp: number
  discount_percentage: number | null
  image_urls: string[]
  stock_quantity: number
  low_stock_threshold: number
  weight: number | null
  weight_unit: string | null
  brand: string | null
}

export interface DarkstoreHomeData {
  categories: CategoryWithProducts[]
  darkstoreOpen: boolean
  opensAt: string
  deliveryMins: number
}

// Fetch top-level categories + first 8 products each
// Uses server-side Supabase client — never exposed to browser
export async function getDarkstoreHomeData(
  darkstoreId: string
): Promise < DarkstoreHomeData > {
  const supabase = await createClient()
  
  // 1. Get top-level categories (parent_id IS NULL)
  const { data: cats, error: catError } = await supabase
  .from('categories')
  .select('id, name, slug, image_url, sort_order')
  .is('parent_id', null)
  .eq('is_active', true)
  .order('sort_order', { ascending: true })
  .limit(12)
  
  if (catError || !cats) return {
    categories: [],
    darkstoreOpen: false,
    opensAt: '06:00',
    deliveryMins: 20,
  }
  
  // 2. Get darkstore open status
  const { data: store } = await supabase
  .from('darkstores')
  .select('is_open, opens_at, avg_delivery_time_mins')
  .eq('id', darkstoreId)
  .single()
  
  // 3. For each category fetch first 8 products in parallel
  const categoriesWithProducts = await Promise.all(
    cats.map(async (cat) => {
      const { data: products } = await supabase
        .from('products')
        .select(`
          id, name, slug, price, mrp, discount_percentage,
          image_urls, stock_quantity, low_stock_threshold,
          weight, weight_unit, brand
        `)
        .eq('category_id', cat.id)
        .eq('darkstore_id', darkstoreId)
        .eq('is_active', true)
        .eq('is_approved', true)
        .gt('stock_quantity', 0)
        .order('created_at', { ascending: false })
        .limit(8)
      
      return {
        ...cat,
        products: (products ?? []) as Product[],
      }
    })
  )
  
  // Filter out empty categories
  const nonEmpty = categoriesWithProducts.filter(c => c.products.length > 0)
  
  return {
    categories: nonEmpty,
    darkstoreOpen: store?.is_open ?? false,
    opensAt: store?.opens_at ?? '06:00',
    deliveryMins: store?.avg_delivery_time_mins ?? 20,
  }
}