export type Nullable < T > = T | null
export type Optional < T > = T | undefined
export type AsyncResult < T > = Promise < { data: T;error: null } | { data: null;error: string } >

export interface CustomerOrderSummary {
  id: string
  total: number
  status: string
  created_at: string
}

export type FoodOrder = CustomerOrderSummary
export type GroceryOrder = CustomerOrderSummary


export interface Restaurant {
  id: string
  slug: string
  name: string
  cover_url: string | null
  is_open: boolean
  opens_at: string | null
  delivery_fee: number
  rating: number
  cuisine_types: string[]
  avg_delivery_time_mins: number
  min_order_amount: number
  is_pure_veg: boolean
}


export interface Category {
  id: string
  slug: string
  name: string
  image_url: string | null
}

export interface Product {
  id: string
  slug: string
  name: string
  image_urls: string[]
  price: number
  mrp: number
  stock_quantity: number
  low_stock_threshold: number
  weight: number
  weight_unit: string
  darkstore_id: string
}

export interface FoodCartItem {
  menu_item_id: string
  name: string
  price: number
  quantity: number
  item_total: number
}

export interface GroceryCartItem {
  product_id: string
  name: string
  price: number
  mrp: number
  image_url: string | null
  quantity: number
  stock_quantity: number
}

export interface Address {
  id: string
  label: string
  line1: string
  line2?: string | null
  city: string
  state: string
  postal_code: string
  lat?: number | null
  lng?: number | null
}
