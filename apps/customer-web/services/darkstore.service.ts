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
  
  const { data: cats, error: catError } = await supabase
  .from('categories')
  .select('id, name, slug, image_url, sort_order')
  .is('parent_id', null)
  .eq('is_active', true)
  .order('sort_order', { ascending: true })
  .limit(12)
  
  // Log error so we can see it in Vercel logs
  if (catError) {
    console.error('CATEGORIES ERROR:', JSON.stringify(catError))
    return { categories: [], darkstoreOpen: false, opensAt: '06:00', deliveryMins: 20 }
  }
  
  if (!cats || cats.length === 0) {
    console.error('CATEGORIES EMPTY: no rows returned for darkstore', darkstoreId)
    return { categories: [], darkstoreOpen: false, opensAt: '06:00', deliveryMins: 20 }
  }
  
  console.log('CATEGORIES FOUND:', cats.length)
  
  const { data: store } = await supabase
  .from('darkstores')
  .select('is_open, opens_at, avg_delivery_time_mins')
  .eq('id', darkstoreId)
  .single()
  
  const categoriesWithProducts = await Promise.all(
    cats.map(async (cat) => {
      const { data: products, error: prodError } = await supabase
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
      
      if (prodError) {
        console.error(`PRODUCTS ERROR for category ${cat.name}:`, JSON.stringify(prodError))
      }
      
      console.log(`Category ${cat.name}: ${products?.length ?? 0} products`)
      
      return {
        ...cat,
        products: (products ?? []) as Product[],
      }
    })
  )
  
  const nonEmpty = categoriesWithProducts.filter(c => c.products.length > 0)
  console.log('NON-EMPTY CATEGORIES:', nonEmpty.length)
  
  return {
    categories: nonEmpty,
    darkstoreOpen: store?.is_open ?? false,
    opensAt: store?.opens_at ?? '06:00',
    deliveryMins: store?.avg_delivery_time_mins ?? 20,
  }
}

