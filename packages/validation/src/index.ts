import { z } from "zod";

// --- Auth Schemas ---

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const registerSchema = z.object({
  full_name: z.string().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  phone: z
    .string()
    .regex(/^[6-9]\d{9}$/, "Invalid Indian phone number")
    .optional(),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;

// --- Address Schemas ---

export const addressSchema = z.object({
  label: z.enum(["home", "work", "other"]),
  full_address: z.string().min(10, "Please enter a complete address"),
  flat_no: z.string().optional(),
  landmark: z.string().optional(),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
  pincode: z.string().regex(/^\d{6}$/, "Invalid pincode"),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  is_default: z.boolean().default(false),
});

export type AddressInput = z.infer<typeof addressSchema>;

// --- Product Schemas ---

export const productSchema = z.object({
  name: z.string().min(2, "Product name is required").max(200),
  description: z.string().max(1000).optional(),
  sku: z.string().min(2, "SKU is required"),
  barcode: z.string().optional(),
  brand: z.string().optional(),
  category_id: z.string().uuid("Invalid category"),
  darkstore_id: z.string().uuid("Invalid darkstore"),
  price: z.number().positive("Price must be positive"),
  mrp: z.number().positive("MRP must be positive"),
  weight: z.number().positive().optional(),
  weight_unit: z.enum(["g", "kg", "ml", "l", "pcs"]).optional(),
  stock_quantity: z.number().int().min(0),
  low_stock_threshold: z.number().int().min(0).default(10),
});

export type ProductInput = z.infer<typeof productSchema>;

// --- Restaurant Schemas ---

export const restaurantSchema = z.object({
  name: z.string().min(2).max(200),
  description: z.string().max(1000).optional(),
  cuisine_types: z.array(z.string()).min(1, "Select at least one cuisine"),
  address: z.string().min(10),
  city: z.string().min(2),
  latitude: z.number(),
  longitude: z.number(),
  min_order_amount: z.number().min(0).default(0),
  delivery_fee: z.number().min(0).default(0),
  is_pure_veg: z.boolean().default(false),
  opens_at: z.string().regex(/^\d{2}:\d{2}$/, "Format: HH:MM"),
  closes_at: z.string().regex(/^\d{2}:\d{2}$/, "Format: HH:MM"),
});

export type RestaurantInput = z.infer<typeof restaurantSchema>;

// --- Order Schemas ---

export const placeOrderSchema = z.object({
  delivery_address_id: z.string().uuid("Select a delivery address"),
  payment_method: z.enum(["upi", "card", "cod", "wallet"]),
  promo_code: z.string().optional(),
  cooking_instructions: z.string().max(300).optional(),
});

export type PlaceOrderInput = z.infer<typeof placeOrderSchema>;

// --- Promo Code Schemas ---

export const promoCodeSchema = z.object({
  code: z.string().min(4).max(20).toUpperCase(),
  description: z.string().min(5),
  discount_type: z.enum(["percentage", "flat"]),
  discount_value: z.number().positive(),
  min_order_amount: z.number().min(0).default(0),
  max_discount_amount: z.number().positive().optional(),
  usage_limit: z.number().int().positive().optional(),
  valid_from: z.string().datetime(),
  valid_until: z.string().datetime(),
  applicable_to: z.enum(["food", "grocery", "both"]),
});

export type PromoCodeInput = z.infer<typeof promoCodeSchema>;
