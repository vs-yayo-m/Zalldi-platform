// ============================================================
// ZALLDI — Shared TypeScript Types
// ============================================================

// --- User & Auth ---

export type UserRole = "customer" | "admin" | "seller" | "agent";

export interface UserProfile {
  id: string;
  email: string;
  full_name: string | null;
  phone: string | null;
  avatar_url: string | null;
  role: UserRole;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// --- Address ---

export type AddressType = "home" | "work" | "other";

export interface Address {
  id: string;
  user_id: string;
  label: AddressType;
  full_address: string;
  flat_no: string | null;
  landmark: string | null;
  city: string;
  state: string;
  pincode: string;
  latitude: number | null;
  longitude: number | null;
  is_default: boolean;
  created_at: string;
}

// --- Category ---

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  parent_id: string | null;
  is_active: boolean;
  sort_order: number;
  created_at: string;
}

// --- Product (Quick Commerce) ---

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  sku: string;
  barcode: string | null;
  brand: string | null;
  category_id: string;
  darkstore_id: string;
  price: number;
  mrp: number;
  discount_percentage: number;
  weight: number | null;
  weight_unit: "g" | "kg" | "ml" | "l" | "pcs" | null;
  stock_quantity: number;
  low_stock_threshold: number;
  image_urls: string[];
  is_active: boolean;
  is_approved: boolean;
  created_by: string;
  created_at: string;
  updated_at: string;
}

// --- Restaurant ---

export interface Restaurant {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  cuisine_types: string[];
  image_url: string | null;
  cover_url: string | null;
  address: string;
  city: string;
  latitude: number;
  longitude: number;
  rating: number;
  rating_count: number;
  avg_delivery_time_mins: number;
  min_order_amount: number;
  delivery_fee: number;
  is_pure_veg: boolean;
  is_open: boolean;
  opens_at: string | null;
  closes_at: string | null;
  is_active: boolean;
  is_approved: boolean;
  created_at: string;
}

// --- Menu ---

export interface MenuCategory {
  id: string;
  restaurant_id: string;
  name: string;
  sort_order: number;
  is_active: boolean;
}

export interface MenuItem {
  id: string;
  restaurant_id: string;
  category_id: string;
  name: string;
  description: string | null;
  price: number;
  image_url: string | null;
  is_veg: boolean;
  is_bestseller: boolean;
  is_available: boolean;
  customization_groups: CustomizationGroup[];
  created_at: string;
}

export interface CustomizationGroup {
  id: string;
  name: string;
  required: boolean;
  multi_select: boolean;
  options: CustomizationOption[];
}

export interface CustomizationOption {
  id: string;
  name: string;
  price: number;
  is_default: boolean;
}

// --- Darkstore ---

export interface Darkstore {
  id: string;
  name: string;
  address: string;
  city: string;
  latitude: number;
  longitude: number;
  service_radius_km: number;
  is_open: boolean;
  opens_at: string;
  closes_at: string;
  avg_delivery_time_mins: number;
  is_active: boolean;
  created_at: string;
}

// --- Orders ---

export type FoodOrderStatus =
  | "pending"
  | "accepted"
  | "preparing"
  | "ready"
  | "picked_up"
  | "delivered"
  | "cancelled";

export type GroceryOrderStatus =
  | "pending"
  | "confirmed"
  | "picking"
  | "packed"
  | "dispatched"
  | "delivered"
  | "cancelled";

export interface FoodOrderItem {
  menu_item_id: string;
  name: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  customizations: SelectedCustomization[];
}

export interface SelectedCustomization {
  group_name: string;
  option_name: string;
  price: number;
}

export interface GroceryOrderItem {
  product_id: string;
  name: string;
  sku: string;
  quantity: number;
  unit_price: number;
  total_price: number;
}

export interface FoodOrder {
  id: string;
  customer_id: string;
  restaurant_id: string;
  delivery_address_id: string;
  status: FoodOrderStatus;
  items: FoodOrderItem[];
  subtotal: number;
  delivery_fee: number;
  platform_fee: number;
  taxes: number;
  discount: number;
  total: number;
  promo_code: string | null;
  cooking_instructions: string | null;
  estimated_delivery_at: string | null;
  delivered_at: string | null;
  cancelled_reason: string | null;
  payment_method: string;
  payment_status: "pending" | "paid" | "failed" | "refunded";
  created_at: string;
  updated_at: string;
}

export interface GroceryOrder {
  id: string;
  customer_id: string;
  darkstore_id: string;
  delivery_address_id: string;
  status: GroceryOrderStatus;
  items: GroceryOrderItem[];
  subtotal: number;
  delivery_fee: number;
  platform_fee: number;
  taxes: number;
  discount: number;
  total: number;
  promo_code: string | null;
  estimated_delivery_at: string | null;
  delivered_at: string | null;
  payment_method: string;
  payment_status: "pending" | "paid" | "failed" | "refunded";
  created_at: string;
  updated_at: string;
}

// --- Delivery Agent ---

export interface DeliveryAgent {
  id: string;
  user_id: string;
  full_name: string;
  phone: string;
  vehicle_type: "bike" | "bicycle" | "scooter";
  vehicle_number: string | null;
  is_online: boolean;
  is_verified: boolean;
  current_latitude: number | null;
  current_longitude: number | null;
  created_at: string;
}

// --- Promo / Coupon ---

export interface PromoCode {
  id: string;
  code: string;
  description: string;
  discount_type: "percentage" | "flat";
  discount_value: number;
  min_order_amount: number;
  max_discount_amount: number | null;
  usage_limit: number | null;
  used_count: number;
  valid_from: string;
  valid_until: string;
  applicable_to: "food" | "grocery" | "both";
  is_active: boolean;
  created_at: string;
}

// --- Cart (Client-side) ---

export interface FoodCartItem {
  menu_item_id: string;
  name: string;
  price: number;
  quantity: number;
  customizations: SelectedCustomization[];
  item_total: number;
}

export interface GroceryCartItem {
  product_id: string;
  name: string;
  price: number;
  mrp: number;
  image_url: string | null;
  quantity: number;
  stock_quantity: number;
}

// --- API Responses ---

export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  count: number;
  page: number;
  limit: number;
  has_more: boolean;
}

// --- App Config ---

export type Vertical = "food" | "groceries" | "dineout";

export type AppName = "customer-web" | "admin-panel" | "seller-hub" | "darkstore-manager";
